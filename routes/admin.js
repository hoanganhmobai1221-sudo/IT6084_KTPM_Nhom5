'use strict';
// =============================================================================
// PhoneStore – Admin routes (/api/admin)
// =============================================================================
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('../data/db');
const { sendSuccess, sendError, sanitizeHtml } = require('../middleware/response');

const router = express.Router();

const uploadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'public', 'images', 'products');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    const cleanBase = path.basename(file.originalname, ext).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    cb(null, `${cleanBase}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/image\/(jpeg|jpg|png|webp|svg\+xml)/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file hình ảnh (PNG, JPG, WEBP, SVG).'));
    }
  }
});

// Upload image file endpoint (Section 3.3)
router.post('/upload', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return sendError(res, err.message || 'Lỗi khi tải ảnh lên.', 400, 'UPLOAD_ERROR');
    }
    if (!req.file) {
      return sendError(res, 'Vui lòng chọn file hình ảnh cần tải lên.', 400, 'NO_FILE');
    }
    const imageUrl = `/images/products/${req.file.filename}`;
    return sendSuccess(res, 'Tải ảnh lên thành công.', { imageUrl, filename: req.file.filename });
  });
});

const ORDER_STATUSES = [
  'Chờ xác nhận',
  'Đang giao',
  'Đã hoàn thành',
  'Đã hủy',
  'Pending',
  'Processing',
  'Shipping',
  'Completed',
  'Cancelled'
];

function nextProductId(database) {
  const products = database.prepare('SELECT id FROM Products').all();
  let max = 0;
  for (const p of products) {
    const n = parseInt(String(p.id).replace(/^SP/, ''), 10);
    if (!Number.isNaN(n) && n > max) max = n;
  }
  return 'SP' + String(max + 1).padStart(3, '0');
}

function nextVariantId(database, productId) {
  const variants = database.prepare('SELECT id FROM Product_Variants WHERE product_id = ?').all(productId);
  let n = variants.length + 1;
  let id = `VAR-${productId}-${String(n).padStart(2, '0')}`;
  while (variants.some((v) => v.id === id)) {
    n += 1;
    id = `VAR-${productId}-${String(n).padStart(2, '0')}`;
  }
  return id;
}

// ---------------------------------------------------------------------------
// GET /api/admin/products -> all products including hidden
// ---------------------------------------------------------------------------
router.get('/products', (req, res) => {
  const database = db.getDb();
  const rawProducts = database.prepare('SELECT * FROM Products').all();
  const rawVariants = database.prepare('SELECT * FROM Product_Variants').all();

  const products = rawProducts.map((p) => {
    let specs = [];
    try { specs = JSON.parse(p.specs); } catch { specs = []; }
    let specDetails = null;
    try { if (p.spec_details) specDetails = JSON.parse(p.spec_details); } catch { specDetails = null; }
    let promotions = [];
    try { if (p.promotions) promotions = JSON.parse(p.promotions); } catch { promotions = []; }

    const variants = rawVariants
      .filter((v) => v.product_id === p.id)
      .map((v) => ({
        id: v.id,
        productId: v.product_id,
        color: v.color,
        storage: v.storage,
        ram: v.ram,
        rom: v.rom,
        price: v.price,
        stock: v.stock,
        imageUrl: v.image_url,
        image_url: v.image_url
      }));

    const prices = variants.map((v) => v.price);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;
    const defaultImg = variants.length ? variants[0].imageUrl : '';

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      description: p.description,
      specs,
      specDetails,
      promotions,
      price: minPrice,
      originalPrice: p.original_price || maxPrice,
      minPrice,
      maxPrice,
      createdAt: p.created_at,
      active: Boolean(p.active),
      image: defaultImg,
      imageUrl: defaultImg,
      variants
    };
  });

  return sendSuccess(res, 'Danh sách sản phẩm (Admin)', { products });
});

// ---------------------------------------------------------------------------
// POST /api/admin/products -> create new product with variants
// ---------------------------------------------------------------------------
router.post('/products', (req, res) => {
  const b = req.body || {};
  const name = sanitizeHtml(String(b.name || '').trim());
  const brand = sanitizeHtml(String(b.brand || '').trim());
  if (name.length < 2) {
    return sendError(res, 'Tên sản phẩm phải có ít nhất 2 ký tự.', 400, 'VALIDATION', { field: 'name' });
  }
  if (brand.length < 2) {
    return sendError(res, 'Thương hiệu phải có ít nhất 2 ký tự.', 400, 'VALIDATION', { field: 'brand' });
  }

  const incoming = Array.isArray(b.variants) ? b.variants : [];
  if (incoming.length === 0) {
    return sendError(res, 'Sản phẩm phải có ít nhất một biến thể.', 400, 'VALIDATION', { field: 'variants' });
  }

  const database = db.getDb();
  const id = nextProductId(database);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || id.toLowerCase();
  const description = sanitizeHtml(String(b.description || '').trim()) || 'Không có mô tả.';
  const specs = JSON.stringify(Array.isArray(b.specs) ? b.specs : []);
  const createdAt = new Date().toISOString();
  const active = b.active !== false ? 1 : 0;

  const insertProd = database.prepare(`
    INSERT INTO Products (id, name, slug, brand, description, specs, spec_details, promotions, original_price, active, created_at)
    VALUES (?, ?, ?, ?, ?, ?, NULL, NULL, 0, ?, ?)
  `);

  const insertVar = database.prepare(`
    INSERT INTO Product_Variants (id, product_id, color, storage, ram, rom, price, stock, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const createdVariants = [];
  const createTx = database.transaction(() => {
    insertProd.run(id, name, slug, brand, description, specs, active, createdAt);
    for (let i = 0; i < incoming.length; i++) {
      const v = incoming[i];
      const color = sanitizeHtml(String(v.color || 'Default').trim());
      const storage = String(v.storage || `${v.rom || 128}GB`).trim();
      const ram = Number(v.ram) || 8;
      const rom = Number(v.rom) || 128;
      const price = Number(v.price) || 0;
      const stock = Number(v.stock) || 0;
      const imageUrl = String(v.imageUrl || v.image_url || '/images/products/placeholder.png').trim();
      const variantId = `VAR-${id}-${String(i + 1).padStart(2, '0')}`;

      insertVar.run(variantId, id, color, storage, ram, rom, price, stock, imageUrl);
      createdVariants.push({
        id: variantId,
        productId: id,
        color,
        storage,
        ram,
        rom,
        price,
        stock,
        imageUrl,
        image_url: imageUrl
      });
    }
  });

  try {
    createTx();
  } catch (err) {
    console.error('[Admin create product error]', err);
    return sendError(res, 'Lỗi khi tạo sản phẩm.', 500, 'INTERNAL_ERROR');
  }

  const product = {
    id,
    name,
    slug,
    brand,
    description,
    specs: Array.isArray(b.specs) ? b.specs : [],
    createdAt,
    active: Boolean(active),
    variants: createdVariants
  };

  return sendSuccess(res, 'Tạo sản phẩm mới thành công.', { product }, 201);
});

// ---------------------------------------------------------------------------
// PUT /api/admin/products/:id -> update product
// ---------------------------------------------------------------------------
router.put('/products/:id', (req, res) => {
  const database = db.getDb();
  const p = database.prepare('SELECT * FROM Products WHERE id = ?').get(req.params.id);
  if (!p) {
    return sendError(res, `Sản phẩm "${req.params.id}" không tồn tại.`, 404, 'NOT_FOUND');
  }

  const b = req.body || {};
  let name = p.name;
  let brand = p.brand;
  let description = p.description;
  let specs = p.specs;
  let active = p.active;

  if (b.name !== undefined) {
    name = sanitizeHtml(String(b.name).trim());
    if (name.length < 2) return sendError(res, 'Tên sản phẩm phải từ 2 ký tự trở lên.', 400, 'VALIDATION');
  }
  if (b.brand !== undefined) {
    brand = sanitizeHtml(String(b.brand).trim());
    if (brand.length < 2) return sendError(res, 'Thương hiệu phải từ 2 ký tự trở lên.', 400, 'VALIDATION');
  }
  if (b.description !== undefined) description = sanitizeHtml(String(b.description).trim());
  if (b.specs !== undefined) specs = JSON.stringify(Array.isArray(b.specs) ? b.specs : []);
  if (b.active !== undefined) active = b.active ? 1 : 0;

  database.prepare(`
    UPDATE Products
    SET name = ?, brand = ?, description = ?, specs = ?, active = ?
    WHERE id = ?
  `).run(name, brand, description, specs, active, p.id);

  const updated = database.prepare('SELECT * FROM Products WHERE id = ?').get(p.id);
  const variants = database.prepare('SELECT * FROM Product_Variants WHERE product_id = ?').all(p.id);

  return sendSuccess(res, 'Cập nhật sản phẩm thành công.', {
    product: {
      ...updated,
      active: Boolean(updated.active),
      variants
    }
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/admin/products/:id -> soft delete product
// ---------------------------------------------------------------------------
router.delete('/products/:id', (req, res) => {
  const database = db.getDb();
  const p = database.prepare('SELECT * FROM Products WHERE id = ?').get(req.params.id);
  if (!p) {
    return sendError(res, `Sản phẩm "${req.params.id}" không tồn tại.`, 404, 'NOT_FOUND');
  }

  database.prepare('UPDATE Products SET active = 0 WHERE id = ?').run(p.id);
  const updated = database.prepare('SELECT * FROM Products WHERE id = ?').get(p.id);

  return sendSuccess(res, `Sản phẩm "${p.id}" đã được ẩn khỏi cửa hàng (soft-delete).`, {
    product: {
      ...updated,
      active: false
    }
  });
});

// ---------------------------------------------------------------------------
// POST /api/admin/products/:id/variants
// ---------------------------------------------------------------------------
router.post('/products/:id/variants', (req, res) => {
  const database = db.getDb();
  const p = database.prepare('SELECT * FROM Products WHERE id = ?').get(req.params.id);
  if (!p) {
    return sendError(res, `Sản phẩm "${req.params.id}" không tồn tại.`, 404, 'NOT_FOUND');
  }

  const b = req.body || {};
  const color = sanitizeHtml(String(b.color || 'Standard').trim());
  const storage = String(b.storage || `${b.rom || 128}GB`).trim();
  const ram = Number(b.ram) || 8;
  const rom = Number(b.rom) || 128;
  const price = Number(b.price) || 0;
  const stock = Number(b.stock) || 0;
  const imageUrl = String(b.imageUrl || b.image_url || '/images/products/placeholder.png').trim();

  const variantId = nextVariantId(database, p.id);

  database.prepare(`
    INSERT INTO Product_Variants (id, product_id, color, storage, ram, rom, price, stock, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(variantId, p.id, color, storage, ram, rom, price, stock, imageUrl);

  const variant = {
    id: variantId,
    productId: p.id,
    color,
    storage,
    ram,
    rom,
    price,
    stock,
    imageUrl,
    image_url: imageUrl
  };

  return sendSuccess(res, 'Thêm biến thể thành công.', { variant }, 201);
});

// ---------------------------------------------------------------------------
// PUT /api/admin/variants/:variantId
// ---------------------------------------------------------------------------
router.put('/variants/:variantId', (req, res) => {
  const database = db.getDb();
  const v = database.prepare('SELECT * FROM Product_Variants WHERE id = ?').get(req.params.variantId);
  if (!v) {
    return sendError(res, `Biến thể "${req.params.variantId}" không tồn tại.`, 404, 'NOT_FOUND');
  }

  const b = req.body || {};
  const color = b.color !== undefined ? sanitizeHtml(String(b.color).trim()) : v.color;
  const storage = b.storage !== undefined ? String(b.storage).trim() : v.storage;
  const ram = b.ram !== undefined ? Number(b.ram) : v.ram;
  const rom = b.rom !== undefined ? Number(b.rom) : v.rom;
  const price = b.price !== undefined ? Number(b.price) : v.price;
  const stock = b.stock !== undefined ? Number(b.stock) : v.stock;
  const imageUrl = b.imageUrl !== undefined || b.image_url !== undefined
    ? String(b.imageUrl || b.image_url).trim()
    : v.image_url;

  database.prepare(`
    UPDATE Product_Variants
    SET color = ?, storage = ?, ram = ?, rom = ?, price = ?, stock = ?, image_url = ?
    WHERE id = ?
  `).run(color, storage, ram, rom, price, stock, imageUrl, v.id);

  const updated = database.prepare('SELECT * FROM Product_Variants WHERE id = ?').get(v.id);
  return sendSuccess(res, 'Cập nhật biến thể thành công.', {
    variant: {
      ...updated,
      productId: updated.product_id,
      imageUrl: updated.image_url
    }
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/admin/variants/:variantId
// ---------------------------------------------------------------------------
router.delete('/variants/:variantId', (req, res) => {
  const database = db.getDb();
  const v = database.prepare('SELECT * FROM Product_Variants WHERE id = ?').get(req.params.variantId);
  if (!v) {
    return sendError(res, `Biến thể "${req.params.variantId}" không tồn tại.`, 404, 'NOT_FOUND');
  }

  database.prepare('DELETE FROM Product_Variants WHERE id = ?').run(v.id);
  return sendSuccess(res, `Đã xóa biến thể "${v.id}".`, { variant: v });
});

// ---------------------------------------------------------------------------
// GET /api/admin/orders
// ---------------------------------------------------------------------------
router.get('/orders', (req, res) => {
  const database = db.getDb();
  const rawOrders = database.prepare('SELECT * FROM Orders ORDER BY created_at DESC').all();
  const getItems = database.prepare(`
    SELECT i.*, v.color, v.storage, v.ram, v.rom, p.id AS productId, p.name AS productName, p.brand
    FROM Order_Items i
    JOIN Product_Variants v ON i.variant_id = v.id
    JOIN Products p ON v.product_id = p.id
    WHERE i.order_id = ?
  `);

  const orders = rawOrders.map((o) => {
    const rawItems = getItems.all(o.id);
    const items = rawItems.map((i) => ({
      id: i.id,
      orderId: i.order_id,
      variantId: i.variant_id,
      productId: i.productId,
      productName: i.productName,
      brand: i.brand,
      color: i.color,
      storage: i.storage,
      ram: i.ram,
      rom: i.rom,
      unitPrice: i.price,
      price: i.price,
      qty: i.quantity,
      quantity: i.quantity
    }));

    return {
      id: o.id,
      userId: o.user_id,
      fullName: o.shipping_name,
      shipping_name: o.shipping_name,
      phone: o.shipping_phone,
      shipping_phone: o.shipping_phone,
      address: o.shipping_address,
      shipping_address: o.shipping_address,
      shippingProvider: o.shipping_provider,
      shipping_provider: o.shipping_provider,
      shippingFee: o.shipping_fee,
      shipping_fee: o.shipping_fee,
      paymentMethod: o.payment_method,
      status: o.status,
      note: o.note,
      createdAt: o.created_at,
      items,
      subtotal: o.subtotal,
      couponCode: o.voucher_code,
      discount: o.discount_amount,
      grandTotal: o.total_amount,
      total_amount: o.total_amount
    };
  });

  return sendSuccess(res, 'Danh sách đơn hàng toàn hệ thống (Admin)', { orders });
});

// ---------------------------------------------------------------------------
// PUT /api/admin/orders/:id/status (with TC-WEB-10 Auto-Restock on Cancel)
// ---------------------------------------------------------------------------
router.put('/orders/:id/status', (req, res) => {
  const database = db.getDb();
  const order = database.prepare('SELECT * FROM Orders WHERE id = ?').get(req.params.id);
  if (!order) {
    return sendError(res, `Đơn hàng "${req.params.id}" không tồn tại.`, 404, 'NOT_FOUND');
  }

  const rawStatus = String((req.body || {}).status || '').trim();
  if (!ORDER_STATUSES.includes(rawStatus)) {
    return sendError(
      res,
      `Trạng thái không hợp lệ. Vui lòng chọn một trong: ${ORDER_STATUSES.slice(0, 4).join(', ')}.`,
      400,
      'VALIDATION'
    );
  }

  // Normalize status for Vietnamese standard
  let status = rawStatus;
  if (status === 'Cancelled') status = 'Đã hủy';
  if (status === 'Pending') status = 'Chờ xác nhận';
  if (status === 'Shipping') status = 'Đang giao';
  if (status === 'Completed') status = 'Đã hoàn thành';

  const prev = order.status;
  const isNowCancelled = status === 'Đã hủy' || status === 'Cancelled';
  const wasCancelled = prev === 'Đã hủy' || prev === 'Cancelled';

  const restocked = [];

  const updateTx = database.transaction(() => {
    // TC-WEB-10: Restock when moving to Cancelled (idempotent)
    if (isNowCancelled && !wasCancelled) {
      const items = database.prepare('SELECT * FROM Order_Items WHERE order_id = ?').all(order.id);
      const restockStmt = database.prepare('UPDATE Product_Variants SET stock = stock + ? WHERE id = ?');
      for (const it of items) {
        restockStmt.run(it.quantity, it.variant_id);
        const v = database.prepare('SELECT stock FROM Product_Variants WHERE id = ?').get(it.variant_id);
        restocked.push({
          variantId: it.variant_id,
          restoredQty: it.quantity,
          newStock: v ? v.stock : 0
        });
      }
    }

    database.prepare('UPDATE Orders SET status = ? WHERE id = ?').run(status, order.id);
  });

  try {
    updateTx();
  } catch (err) {
    console.error('[Admin update order status error]', err);
    return sendError(res, 'Lỗi khi cập nhật trạng thái đơn hàng.', 500, 'INTERNAL_ERROR');
  }

  const updatedOrder = database.prepare('SELECT * FROM Orders WHERE id = ?').get(order.id);
  return sendSuccess(
    res,
    `Cập nhật trạng thái đơn hàng ${order.id} thành "${status}".`,
    {
      order: updatedOrder,
      restocked
    }
  );
});

// ---------------------------------------------------------------------------
// POST /api/admin/orders/:id/cancel -> direct cancel helper for Selenium
// ---------------------------------------------------------------------------
router.post('/orders/:id/cancel', (req, res) => {
  const database = db.getDb();
  const order = database.prepare('SELECT * FROM Orders WHERE id = ?').get(req.params.id);
  if (!order) {
    return sendError(res, `Đơn hàng "${req.params.id}" không tồn tại.`, 404, 'NOT_FOUND');
  }

  const prev = order.status;
  const isCancelled = prev === 'Đã hủy' || prev === 'Cancelled';
  if (isCancelled) {
    return sendSuccess(res, `Đơn hàng ${order.id} đã ở trạng thái Đã hủy từ trước.`, { order, restocked: [] });
  }

  const restocked = [];
  const cancelTx = database.transaction(() => {
    const items = database.prepare('SELECT * FROM Order_Items WHERE order_id = ?').all(order.id);
    const restockStmt = database.prepare('UPDATE Product_Variants SET stock = stock + ? WHERE id = ?');
    for (const it of items) {
      restockStmt.run(it.quantity, it.variant_id);
      const v = database.prepare('SELECT stock FROM Product_Variants WHERE id = ?').get(it.variant_id);
      restocked.push({
        variantId: it.variant_id,
        restoredQty: it.quantity,
        newStock: v ? v.stock : 0
      });
    }
    database.prepare("UPDATE Orders SET status = 'Đã hủy' WHERE id = ?").run(order.id);
  });

  try {
    cancelTx();
  } catch (err) {
    console.error('[Admin cancel order error]', err);
    return sendError(res, 'Lỗi khi hủy đơn hàng.', 500, 'INTERNAL_ERROR');
  }

  const updatedOrder = database.prepare('SELECT * FROM Orders WHERE id = ?').get(order.id);
  return sendSuccess(
    res,
    `Đã hủy đơn hàng ${order.id} và hoàn lại tồn kho thành công.`,
    { order: updatedOrder, restocked }
  );
});

// ---------------------------------------------------------------------------
// GET /api/admin/analytics
// ---------------------------------------------------------------------------
router.get('/analytics', (req, res) => {
  const database = db.getDb();
  const allOrders = database.prepare('SELECT * FROM Orders').all();

  // Total revenue excludes cancelled orders
  const validOrders = allOrders.filter((o) => o.status !== 'Đã hủy' && o.status !== 'Cancelled');
  const totalRevenue = validOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const ordersByStatus = {
    'Pending': 0,
    'Processing': 0,
    'Shipping': 0,
    'Completed': 0,
    'Cancelled': 0,
    'Chờ xác nhận': 0,
    'Đang giao': 0,
    'Đã hoàn thành': 0,
    'Đã hủy': 0
  };

  for (const o of allOrders) {
    ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
    // Map to English equivalent for smoke test compatibility
    if (o.status === 'Chờ xác nhận') ordersByStatus['Pending'] = (ordersByStatus['Pending'] || 0) + 1;
    if (o.status === 'Đang giao') ordersByStatus['Shipping'] = (ordersByStatus['Shipping'] || 0) + 1;
    if (o.status === 'Đã hoàn thành') ordersByStatus['Completed'] = (ordersByStatus['Completed'] || 0) + 1;
    if (o.status === 'Đã hủy') ordersByStatus['Cancelled'] = (ordersByStatus['Cancelled'] || 0) + 1;
  }

  const rawLowStock = database.prepare(`
    SELECT v.*, p.name AS productName, p.brand
    FROM Product_Variants v
    JOIN Products p ON v.product_id = p.id
    WHERE p.active = 1 AND v.stock < 5
    ORDER BY v.stock ASC
  `).all();

  const lowStock = rawLowStock.map((l) => ({
    productId: l.product_id,
    productName: l.productName,
    brand: l.brand,
    variantId: l.id,
    color: l.color,
    storage: l.storage,
    ram: l.ram,
    rom: l.rom,
    stock: l.stock
  }));

  return sendSuccess(res, 'Thống kê tổng quan hệ thống', {
    totalOrders: allOrders.length,
    totalRevenue,
    ordersByStatus,
    lowStock
  });
});

// ---------------------------------------------------------------------------
// POST /api/admin/reset -> deterministic seed reset
// ---------------------------------------------------------------------------
router.post('/reset', (req, res) => {
  db.resetDatabase();
  return sendSuccess(res, 'Cơ sở dữ liệu SQLite đã được đặt lại về trạng thái mẫu ban đầu.', { success: true });
});

module.exports = router;