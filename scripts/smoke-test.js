'use strict';
/* =============================================================================
   PhoneStore – Self-contained API smoke test
   ---------------------------------------------------------------------------
   Spawns the server on a throwaway port, exercises every critical flow and
   business constraint, prints PASS/FAIL lines and exits 0/1. Run with:
        npm test        (or:  node scripts/smoke-test.js)

   Covered: health, catalog, instant search, multi-criteria filters, sorting,
   RBAC (401/403), registration validation, bcrypt login, coupon math, order
   placement, mandatory stock deduction, stock-limit rejection, automatic
   restock on cancel, analytics, admin guards and the data reset endpoint.
   ============================================================================= */
const { spawn } = require('child_process');
const path = require('path');

const PORT = 3917;
const BASE = `http://127.0.0.1:${PORT}`;
const SERVER_JS = path.join(__dirname, '..', 'server.js');

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `   => ${detail}`}`);
}

async function req(method, p, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(BASE + p, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });
  let data = {};
  try { data = await res.json(); } catch { /* non-JSON body */ }
  return { status: res.status, ok: res.ok, data };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForServer(ms = 15000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    try {
      const r = await fetch(BASE + '/api/health');
      if (r.ok) return true;
    } catch { /* not up yet */ }
    await sleep(200);
  }
  return false;
}

async function main() {
  const child = spawn(process.execPath, [SERVER_JS], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'inherit'
  });

  const ready = await waitForServer();
  check('Server boots and answers /api/health', ready, 'health endpoint unreachable');
  if (!ready) {
    child.kill();
    process.exit(1);
  }

  try {
    // --- Catalog ---------------------------------------------------------------
    const cat = await req('GET', '/api/products');
    check('GET /api/products returns the 11 active products', cat.ok && cat.data.total === 11,
      `expected 11, got ${cat.data.total}`);
    const ids = cat.data.products.map((p) => p.id);
    check('Soft-deleted SP007 is hidden from the storefront', !ids.includes('SP007'),
      `unexpected product ids: ${ids.join(', ')}`);

    const search = await req('GET', '/api/products?search=iphone');
    check('Instant search "iphone" is case-insensitive', search.ok && search.data.total === 4,
      `expected 4, got ${search.data.total}`);

    const brand = await req('GET', '/api/products?brand=Samsung');
    check('Brand filter (Samsung) narrows the catalog', brand.ok && brand.data.total === 3 && brand.data.products.every((p) => p.brand === 'Samsung'),
      `expected 3 Samsung phones, got ${brand.data.total}`);

    const ramRom = await req('GET', '/api/products?ram=8&rom=256');
    check('Concurrent RAM+ROM filter returns matching products only', ramRom.ok && ramRom.data.products.every(
      (p) => p.variants.some((v) => v.ram === 8 && v.rom === 256)), `got ${ramRom.data.total} products`);
    check('RAM+ROM filter actually yields results', ramRom.data.total >= 1, 'filter too strict');

    const minMax = await req('GET', '/api/products?minPrice=10000000&maxPrice=30000000');
    check('Price-range filter (10M–30M VND)', minMax.ok && minMax.data.total > 0 && minMax.data.products.every(
      (p) => p.variants.some((v) => v.price >= 10000000 && v.price <= 30000000)), `got ${minMax.data.total}`);

    const asc = await req('GET', '/api/products?sort=price_asc');
    const ascPrices = asc.data.products.map((p) => Math.min(...p.variants.map((v) => v.price)));
    check('Sort price_asc is ascending', asc.ok && ascPrices.every((v, i) => i === 0 || v >= ascPrices[i - 1]),
      `prices: ${ascPrices.join(', ')}`);

    const desc = await req('GET', '/api/products?sort=price_desc');
    const descPrices = desc.data.products.map((p) => Math.min(...p.variants.map((v) => v.price)));
    check('Sort price_desc is descending', desc.ok && descPrices.every((v, i) => i === 0 || v <= descPrices[i - 1]),
      `prices: ${descPrices.join(', ')}`);

    const fo = await req('GET', '/api/products/filter-options');
    check('Filter options include brands/ram/rom', fo.ok && fo.data.brands.includes('Apple') && fo.data.ram.includes(8) && fo.data.rom.includes(256),
      JSON.stringify(fo.data));
// --- Auth / RBAC -------------------------------------------------------------
    const badLogin = await req('POST', '/api/auth/login', { email: 'customer@phonestore.test', password: 'wrong' });
    check('Login with a wrong password returns 401', badLogin.status === 401, `got ${badLogin.status}`);

    const customerLogin = await req('POST', '/api/auth/login', { email: 'customer@phonestore.test', password: 'Customer123!' });
    check('Customer login succeeds (bcrypt verified)', customerLogin.ok && customerLogin.data.token,
      JSON.stringify(customerLogin.data).slice(0, 120));
    const custToken = customerLogin.data.token;

    const adminLogin = await req('POST', '/api/auth/login', { email: 'admin@phonestore.test', password: 'Admin123!' });
    check('Admin login succeeds', adminLogin.ok && adminLogin.data.user.role === 'admin', JSON.stringify(adminLogin.data).slice(0, 120));
    const adminToken = adminLogin.data.token;

    const me = await req('GET', '/api/auth/me', undefined, custToken);
    check('GET /api/auth/me resolves the session', me.ok && me.data.user.email === 'customer@phonestore.test', JSON.stringify(me.data).slice(0, 120));

    const dup = await req('POST', '/api/auth/register', { fullName: 'Maria Nguyen', email: 'customer@phonestore.test', phone: '0912000002', password: 'Customer123!' });
    check('Duplicate registration email returns 409', dup.status === 409 && dup.data.error === 'EMAIL_EXISTS', `got ${dup.status}`);

    const badReg = await req('POST', '/api/auth/register', { fullName: 'X', email: 'not-an-email', phone: '09', password: '123' });
    check('Registration field validation returns 400', badReg.status === 400, `got ${badReg.status}`);

    const register = await req('POST', '/api/auth/register', { fullName: 'Test Student', email: 'student.test@edu.com', phone: '0913777555', password: 'Student123!' });
    check('Fresh registration returns a token', register.ok && register.data.token, JSON.stringify(register.data).slice(0, 120));

    // --- Coupons -------------------------------------------------------------------
    const sale10 = await req('GET', '/api/coupons/validate?code=SALE10&subtotal=100000');
    check('Coupon SALE10 gives 10% of 100,000 = 10,000', sale10.data.valid && sale10.data.discount === 10000, JSON.stringify(sale10.data));

    const giam50k = await req('GET', '/api/coupons/validate?code=GIAM50K&subtotal=100000');
    check('Coupon GIAM50K gives fixed 50,000 VND', giam50k.data.valid && giam50k.data.discount === 50000, JSON.stringify(giam50k.data));

    const invalidCoupon = await req('GET', '/api/coupons/validate?code=NOPE');
    check('Unknown coupon is reported invalid with a message', invalidCoupon.data.valid === false && !!invalidCoupon.data.message,
      JSON.stringify(invalidCoupon.data));
// --- Orders --------------------------------------------------------------------
    const anonOrder = await req('POST', '/api/orders', { fullName: 'A', phone: '091', address: 'x', paymentMethod: 'cod', items: [] });
    check('POST /api/orders without a token returns 401', anonOrder.status === 401, `got ${anonOrder.status}`);

    // Buy 2 units of VAR-SP004-NAVY-128 (seed stock 30 -> 28) with SALE10.
    const goodOrder = await req('POST', '/api/orders', {
      fullName: 'Maria Nguyen',
      phone: '0912000002',
      address: '221B Baker Street, Hanoi',
      paymentMethod: 'cod',
      couponCode: 'SALE10',
      items: [{ variantId: 'VAR-SP004-NAVY-128', qty: 2 }]
    }, custToken);
    check('Valid order placement returns 201 + ORD-XXXXXX id', goodOrder.status === 201 && /^ORD-[A-Z0-9]{6}$/.test(goodOrder.data.order.id),
      JSON.stringify(goodOrder.data).slice(0, 160));
    const orderId = goodOrder.data.order.id;
    const expectedSubtotal = 2 * 9690000;
    const expectedDiscount = Math.round(expectedSubtotal * 0.1);
    check('Order subtotal/discount/grand-total math is exact',
      goodOrder.data.order.subtotal === expectedSubtotal &&
      goodOrder.data.order.discount === expectedDiscount &&
      goodOrder.data.order.grandTotal === expectedSubtotal - expectedDiscount,
      JSON.stringify(goodOrder.data.order).slice(0, 200));

    const afterBuy = await req('GET', '/api/products?search=Galaxy A55');
    const blackVariant = afterBuy.data.products[0].variants.find((v) => v.id === 'VAR-SP004-NAVY-128');
    check('Stock is AUTOMATICALLY DEDUCTED after purchase (30 -> 28)', blackVariant.stock === 28, `stock=${blackVariant.stock}`);

    const overStock = await req('POST', '/api/orders', {
      fullName: 'Maria Nguyen', phone: '0912000002', address: '221B Baker Street, Hanoi', paymentMethod: 'cod',
      items: [{ variantId: 'VAR-SP002-GRAY-256', qty: 999 }]
    }, custToken);
    check('Buying more than available stock returns 409 INSUFFICIENT_STOCK', overStock.status === 409 && overStock.data.error === 'INSUFFICIENT_STOCK',
      JSON.stringify(overStock.data).slice(0, 160));

    const invalidCouponOrder = await req('POST', '/api/orders', {
      fullName: 'Maria Nguyen', phone: '0912000002', address: '221B Baker Street, Hanoi', paymentMethod: 'cod',
      couponCode: 'NOPE', items: [{ variantId: 'VAR-SP004-NAVY-128', qty: 1 }]
    }, custToken);
    check('Order with an invalid coupon returns 400 INVALID_COUPON', invalidCouponOrder.status === 400 && invalidCouponOrder.data.error === 'INVALID_COUPON',
      JSON.stringify(invalidCouponOrder.data).slice(0, 120));

    const mine = await req('GET', '/api/orders/mine', undefined, custToken);
    check('Customer sees only their own orders', mine.ok && mine.data.orders.some((o) => o.id === orderId) && mine.data.orders.every((o) => o.fullName === 'Maria Nguyen'),
      `got ${mine.data.orders.length} orders`);
// --- Admin guards ----------------------------------------------------------------
    const nonAdmin = await req('GET', '/api/admin/analytics', undefined, custToken);
    check('Customer token on /api/admin/* returns 403', nonAdmin.status === 403, `got ${nonAdmin.status}`);

    const stale = await req('GET', '/api/admin/analytics');
    check('No token on /api/admin/* returns 401', stale.status === 401, `got ${stale.status}`);

    const analytics = await req('GET', '/api/admin/analytics', undefined, adminToken);
    check('Admin analytics returns revenue + status volume', analytics.ok &&
      typeof analytics.data.totalRevenue === 'number' && analytics.data.ordersByStatus.Pending === 1,
      JSON.stringify(analytics.data).slice(0, 180));
    check('Low-stock warning flags active products under 5 units', Array.isArray(analytics.data.lowStock) && analytics.data.lowStock.length > 0 &&
      analytics.data.lowStock.every((l) => l.stock < 5), JSON.stringify(analytics.data.lowStock).slice(0, 160));

    const adminProducts = await req('GET', '/api/admin/products', undefined, adminToken);
    check('Admin product list includes hidden products (12 total)', adminProducts.ok && adminProducts.data.products.length === 12,
      `got ${adminProducts.data.products.length}`);

    // --- Order lifecycle: Cancel -> auto-restock -----------------------------------------
    const cancel = await req('PUT', `/api/admin/orders/${orderId}/status`, { status: 'Cancelled' }, adminToken);
    check('Admin can move the order to Cancelled', cancel.ok && cancel.data.restocked.length === 1,
      JSON.stringify(cancel.data).slice(0, 160));

    const afterCancel = await req('GET', '/api/products?search=Galaxy A55');
    const restored = afterCancel.data.products[0].variants.find((v) => v.id === 'VAR-SP004-NAVY-128');
    check('Cancelling the order AUTOMATICALLY RESTOCKS inventory (28 -> 30)', restored.stock === 30, `stock=${restored.stock}`);

    const badStatus = await req('PUT', '/api/admin/orders/ORD-A1B2C3/status', { status: 'Exploded' }, adminToken);
    check('Invalid status transition is rejected (400)', badStatus.status === 400, `got ${badStatus.status}`);

    // --- Product CRUD (admin) --------------------------------------------------------------
    const newProduct = await req('POST', '/api/admin/products', {
      name: 'PhoneStore Test Phone',
      brand: 'Xiaomi',
      description: 'Created by the smoke test suite.',
      specs: ['Display: 6.0" LCD', 'Chipset: Smoke-1'],
      active: true,
      variants: [{ color: 'Black', ram: 6, rom: 128, price: 5999000, stock: 12 }]
    }, adminToken);
    check('Admin can create a product with variants', newProduct.status === 201 && /^SP\d{3}$/.test(newProduct.data.product.id),
      JSON.stringify(newProduct.data).slice(0, 160));
    const newId = newProduct.data.product.id;

    const hidden = await req('DELETE', `/api/admin/products/${newId}`, undefined, adminToken);
    check('Soft-delete hides the product but keeps it in the DB', hidden.ok && hidden.data.product.active === false, JSON.stringify(hidden.data).slice(0, 120));

    const street = await req('GET', `/api/products/${newId}`);
    check('Storefront returns 404 for a soft-deleted product', street.status === 404, `got ${street.status}`);

    // --- /admin view guard --------------------------------------------------------------------
    const adminView = await fetch(BASE + '/admin?token=' + adminToken);
    const adminViewBody = await adminView.text();
    check('GET /admin with an admin token serves the SPA', adminView.status === 200 && adminViewBody.includes('PhoneStore'),
      `got ${adminView.status}`);

    const blockedView = await fetch(BASE + '/admin');
    check('GET /admin without a token returns 401', blockedView.status === 401, `got ${blockedView.status}`);

    // --- Reset -----------------------------------------------------------------------------------
    const reset = await req('POST', '/api/admin/reset', {}, adminToken);
    check('POST /api/admin/reset restores seed data', reset.ok && reset.data.success === true, JSON.stringify(reset.data).slice(0, 120));

    const afterReset = await req('GET', '/api/admin/orders', undefined, adminToken);
    check('Reset brings orders back to the 3 seed orders', afterReset.ok && afterReset.data.orders.length === 3,
      `got ${afterReset.data.orders.length} orders`);
  } catch (err) {
    check('Smoke test execution finished without exceptions', false, err.message);
  } finally {
    child.kill();
  }

  const failed = results.filter((r) => !r.ok).length;
  console.log('------------------------------------------------------------');
  console.log(`Smoke test complete: ${results.length - failed}/${results.length} checks passed.`);
  process.exit(failed ? 1 : 0);
}

main();