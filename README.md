# 📱 PhoneStore — Smartphone E-Commerce (for Software Testing courses)

A complete, lightweight, production-ready e-commerce web app for selling smartphones,
explicitly engineered for **Selenium WebDriver**, **Apache JMeter** and **cross-browser
(LambdaTest)** testing classes.

| Area | Technology |
|---|---|
| Backend | Node.js + Express 5 (modular REST API) |
| Frontend | HTML5 + Tailwind CSS (CDN) + Vanilla JS SPA |
| Persistence | In-memory database with deterministic, resettable seed data |
| Security | `bcryptjs` password hashing + token sessions + server-side RBAC (401/403) |
| Testability | Stable `id` + `data-testid` on every interactive element; stateless load-test endpoints |

---

## 1. Quick start (install & run)

Requirements: **Node.js ≥ 18** (developed on Node 24). All dependencies are pinned in
`package.json`; the project was installed and validated with `npm install` from scratch.

```bash
# 1) Install dependencies (only dependencies: express, cors, bcryptjs)
npm install

# 2) Boot the local server
npm start            # == node server.js

# 3) Open the storefront
#    http://localhost:3000
```

Utility scripts:

| Command | What it does |
|---|---|
| `npm start` | Boots the API + storefront on `http://localhost:3000` (env `PORT` overrides) |
| `npm test` | Runs the self-contained API smoke suite (`scripts/smoke-test.js`, 43 checks) |

After boot you will see the admin/customer credentials printed in the console.

---

## 2. Default test credentials & coupons

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@phonestore.test` | `Admin123!` |
| **Customer** | `customer@phonestore.test` | `Customer123!` |
| Customer (2nd) | `anna.le@example.com` | `Customer123!` |

| Coupon | Type | Value |
|---|---|---|
| `SALE10` | Percentage | **10%** off order subtotal |
| `GIAM50K` | Fixed | **50,000 VND** off order subtotal |

Any other code (e.g. `NOPE`) produces a descriptive "invalid or expired" error.

---

## 3. Seed dataset (deterministic — resets trivially)

- **6 active products** (`SP001`–`SP006`) across Apple / Samsung / Xiaomi with hardware
  variants (Color, RAM, ROM, Price, Stock). `SP007` (iPhone SE) is seeded **inactive**
  to prove soft-delete on the storefront.
- **3 sample orders** (`ORD-A1B2C3`, `ORD-D4E5F6`, `ORD-G7H8I9`) so the analytics
  dashboard has data on first boot. `ORD-G7H8I9` is `Cancelled` (excluded from revenue).
- **Low-stock demo:** several variants are seeded below 5 units (e.g.
  `VAR-SP001-TITAN-256` = 1, `VAR-SP004-BLUE-64` = 3) to light up the low-stock panel.

**Reset for every test run** — restore the exact seed state at any time:

```bash
curl -X POST http://localhost:3000/api/admin/reset \
     -H "Authorization: Bearer <admin_token>"
```

Active sessions survive a reset, so Selenium suites can `setUp` → reset → `tearDown`
without re-logging-in. There is also a two-click **"↺ Reset demo data"** button on the
Admin dashboard (`btn-reset-data`).

---

## 4. REST API reference

All JSON. Authenticated endpoints expect `Authorization: Bearer <token>` (the same token
may be passed as `?token=` or as the `phonestore_token` cookie).

| Method & Path | Auth | Purpose |
|---|---|---|
| `GET /api/health` | – | Liveness probe (JMeter smoke test target) |
| `POST /api/auth/register` | – | `fullName, email, phone, password` → `{token, user}` (409 on duplicate email) |
| `POST /api/auth/login` | – | `email, password` → `{token, user}` (401 on bad credentials) |
| `GET /api/auth/me` | ✅ | Current user |
| `POST /api/auth/logout` | ✅ | Destroys the session |
| `GET /api/products` | – | Catalog: `search` (case-insensitive name/brand), `brand`, `ram`, `rom`, `minPrice`, `maxPrice`, `sort` (`newest`\|`price_asc`\|`price_desc`) |
| `GET /api/products/:id` | – | Product detail incl. all variants |
| `GET /api/products/filter-options` | – | Distinct brands / RAM / ROM for dropdowns |
| `GET /api/coupons/validate?code=&subtotal=` | – | Coupon validity + exact discount |
| `POST /api/orders` | ✅ | Place order → deducts stock, computes total |
| `GET /api/orders/mine` | ✅ | Current customer's orders |
| `GET /api/admin/products` | 🛡️ | All products incl. hidden |
| `POST /api/admin/products` | 🛡️ | Create product + variants |
| `PUT /api/admin/products/:id` | 🛡️ | Update fields / `active` / replace variants |
| `DELETE /api/admin/products/:id` | 🛡️ | Soft delete (hide from storefront) |
| `POST /api/admin/products/:id/variants` · `PUT/DELETE /api/admin/variants/:id` | 🛡️ | Variant CRUD |
| `GET /api/admin/orders` | 🛡️ | Complete order list |
| `PUT /api/admin/orders/:id/status` | 🛡️ | Lifecycle transition (+ auto-restock on `Cancelled`) |
| `GET /api/admin/analytics` | 🛡️ | Revenue (excl. Cancelled), volume by status, low-stock alerts |
| `POST /api/admin/reset` | 🛡️ | Restore deterministic seed data |

`✅` = any authenticated user · `🛡️` = admin only (`401` no token, `403` non-admin).

### Key business rules (automatically tested by `npm test`)

1. Cart quantities can never exceed available stock — clients are blocked and shown a
   clear error; the order API re-validates server-side and answers **409
   `INSUFFICIENT_STOCK`** with per-item details.
2. Placing an order **automatically deducts inventory** for every purchased variant
   (authoritative server-side data, never client prices).
3. Moving an order to **`Cancelled` automatically restores the stock** of every item;
   restocking is idempotent.
4. Total realized revenue **excludes `Cancelled` orders**; order volume is reported per
   status (`Pending → Processing → Shipping → Completed → Cancelled`).
5. `POST /api/orders` generates a unique `ORD-XXXXXX` id, validates coupons and computes
   `Subtotal − Discount = Grand Total` server-side.
---

## 5. Selenium locator reference (id == data-testid)

**Rule implemented across the whole UI:** every input, select, button, checkbox,
table row/cell, product card, modal, and error/success alert carries a permanent,
deterministic `id` **and** the same `data-testid`. Dynamic markers embed only
deterministic business keys (product `SP001`, variant `VAR-SP001-BLACK-256`, order
`ORD-XXXXXX`), never random values.

| Element | `id` / `data-testid` |
|---|---|
| Brand logo | `brand-logo` |
| Nav: Home / Cart / Login / Register / My orders / Admin / Logout | `nav-home`, `nav-cart`, `nav-login`, `nav-register`, `nav-my-orders`, `nav-admin`, `nav-logout` |
| Cart count badge | `cart-count` |
| User badge (name + role) | `nav-user-badge` |
| Instant search input | `input-search` |
| Filter select: Brand / RAM / ROM / Sort | `select-brand`, `select-ram`, `select-rom`, `select-sort` |
| Filter inputs: min / max price | `input-min-price`, `input-max-price` |
| Apply / reset filters | `btn-apply-filters`, `btn-reset-filters` |
| Filter validation message | `filter-error-msg` |
| Result count | `result-count` |
| Empty catalog message | `catalog-empty` |
| Product card (per product) | `product-card-SP001` (+ `product-brand-`, `product-name-`, `product-price-`, `product-stock-`) |
| Quick add / details buttons | `btn-add-cart-SP001`, `btn-details-SP001` |
| Details modal | `product-modal` (`modal-product-title`, `modal-product-brand`) |
| Variant select / qty input / add button | `select-variant`, `input-qty`, `btn-add-variant` |
| Modal stock note / error | `modal-stock-note`, `modal-error-msg` |
| Close modal | `btn-close-modal` |
| Cart view | `view-cart` |
| Cart row (per variant) | `cart-row-VAR-…` |
| Cart qty display / +/- / remove | `cart-qty-VAR-…`, `btn-cart-inc-VAR-…`, `btn-cart-dec-VAR-…`, `btn-cart-remove-VAR-…` |
| In-cart stock hint | `cart-stock-VAR-…` |
| Cart success / error feedback | `cart-success-msg`, `cart-error-msg` |
| Coupon input / apply / feedback | `input-coupon`, `btn-apply-coupon`, `coupon-msg` (errors use `coupon-error-msg`, success `coupon-success-msg`) |
| Applied coupon notice | `applied-coupon` |
| Cart summary totals | `cart-subtotal`, `cart-discount`, `cart-grand-total` |
| Checkout / clear cart | `btn-checkout`, `btn-clear-cart`, `btn-continue-shopping` |
| Checkout view | `view-checkout` (`checkout-login-link` when guest) |
| Shipping form | `input-checkout-fullname`, `input-checkout-phone`, `input-checkout-address`, `select-payment` |
| Checkout summary | `checkout-subtotal`, `checkout-discount`, `checkout-grand-total` |
| Place order / back | `btn-place-order`, `btn-back-to-cart` |
| Order error / order id display | `order-error-msg`, `order-id-display` |
| Login / register forms | `view-login`, `view-register`; `input-login-email`, `input-login-password`, `btn-login`; `input-register-fullname`, `input-register-email`, `input-register-phone`, `input-register-password`, `btn-register` |
| Auth error messages | `auth-error-msg`, `register-error-msg` |
| My orders view / empty state | `view-orders`, `orders-empty`, `order-placed-banner` |
| Order card (per order) | `order-card-ORD-…`, `order-status-ORD-…`, `order-total-ORD-…` |
| Admin view / tabs | `view-admin`, `admin-tab-analytics`, `admin-tab-products`, `admin-tab-orders` |
| Revenue / total orders stats | `stat-revenue`, `stat-total-orders` |
| Order volume per status | `stat-orders-Pending` … `stat-orders-Cancelled` |
| Low-stock panel & rows | `low-stock-panel`, `lowstock-item-VAR-…`, `lowstock-stock-VAR-…` |
| Reset demo data (2-click confirm) | `btn-reset-data` |
| Admin products rows & actions | `admin-product-row-SP001`, `btn-edit-product-SP001`, `btn-toggle-product-SP001`, `btn-add-product` |
| Product editor modal | `admin-product-modal`, `input-product-name`, `select-product-brand`, `textarea-product-description`, `textarea-product-specs`, `checkbox-product-active`, `btn-save-product`, `btn-cancel-product-form`, `admin-form-error-msg` |
| Variant editor rows | `product-variant-row-VAR-…`, `input-variant-color-N`, `input-variant-ram-N`, `input-variant-rom-N`, `input-variant-price-N`, `input-variant-stock-N`, `btn-add-variant-row`, `btn-remove-variant-row-N` |
| Admin orders rows | `admin-order-row-ORD-…`, `admin-order-status-ORD-…`, `order-status-select-ORD-…`, `btn-update-status-ORD-…` |
| Toasts (global) | `toast-success`, `toast-error` |

### Locator stability guarantees

- No `Math.random()`/`Date.now()` is ever used to build an HTML id or `data-testid`.
- Product/variant/order ids come from deterministic seed data or incremental counters
  (`SP008`, `VAR-SP008-01`), so locators survive restarts after a `reset`.
- Admin variant rows keep their `data-testid="product-variant-row-VAR-…"` when edited
  because the server preserves variant ids on (color, RAM, ROM) signature match.
---

## 6. Performance & load testing (Apache JMeter)

The API is stateless for the load-critical paths — perfect for a 50-thread Thread Group.

Sample JMeter plan outline:

1. **Thread Group**: 50 threads, ramp-up 30 s, loop 5 → 250 iterations.
2. **HTTP Header Manager**: `Content-Type: application/json`.
3. **Samplers**
   - `GET http://localhost:3000/api/health` — smoke/liveness.
   - `GET http://localhost:3000/api/products?sort=price_asc` — catalog lookup.
   - `POST /api/auth/login` with JSON body `{"email":"customer@phonestore.test","password":"Customer123!"}` + a **JSON Extractor** on `$.token` saved as `token`.
   - `POST /api/orders` (needs `Authorization: Bearer ${token}`) with a small item payload, e.g. `{"fullName":"Load Tester","phone":"0912345678","address":"Load City","paymentMethod":"cod","items":[{"variantId":"VAR-SP003-GREEN-256","qty":1}]}`.
4. **Assertions**: response ≤ 2000 ms; status `200/201`; error rate < 1%.

Performance characteristics: in-memory store, O(n) catalog scan over 6 products, no
external I/O on request paths — response times stay in the low single-digit ms on any
modern laptop. **Reset** (`POST /api/admin/reset`) between runs so `VAR-SP003-GREEN-256`
never runs dry.

---

## 7. Cross-browser testing (LambdaTest / local Grid)

- The storefront is W3C-valid HTML5/CSS3 (semantic elements, ARIA `role`/`aria-label`,
  responsive Tailwind breakpoints, no vendor-prefixed-only CSS).
- Point any WebDriver (Chrome / Edge / Firefox, or a LambdaTest cloud tunnel at
  `http://localhost:3000`) at the app and reuse the locator table above.
- Recommended visual-regression baseline: load `/` → screenshot → expand to a mobile
  viewport (390×844) → screenshot; compare against the baseline per browser.

---

## 8. Project structure

```
phonestore-test/
├── package.json              # scripts (start/test) + pinned deps
├── server.js                 # Express app: middleware, routes, /admin guard, error handling
├── data/
│   └── db.js                 # in-memory DB: deterministic seed + resetDatabase()
├── middleware/
│   └── auth.js               # token resolution (Bearer/query/cookie) + requireAuth/requireAdmin
├── routes/
│   ├── auth.js               # register / login / me / logout
│   ├── products.js           # catalog, search, filters, sort, detail, filter-options
│   ├── coupons.js            # coupon validation (+ exact discount math)
│   ├── orders.js             # order placement, stock deduction, my orders
│   └── admin.js              # product/variant CRUD, order lifecycle (restock), analytics, reset
├── public/
│   ├── index.html            # HTML5 shell + Tailwind CDN
│   └── app.js                # SPA: storefront, cart, checkout, auth, admin dashboard
└── scripts/
    └── smoke-test.js         # self-contained 43-check API suite (npm test)
```

---

## 9. Notes & assumptions

- **VND** is used for prices (`GIAM50K` is a fixed 50,000 VND coupon); display format
  is `₫1,234,567` (comma group separator).
- Prices are integers; percentage discounts are rounded to the nearest VND.
- Sessions are in-memory tokens (UUID). On server restart all sessions are cleared —
  the seed dataset is rebuilt deterministically at every boot.
- `express`, `cors` and `bcryptjs` are the only runtime dependencies; the frontend has
  **zero** build step.
- The `/admin` URL is guarded server-side (401 JSON for non-admins) and the SPA also
  hides admin entry points from non-admin roles.