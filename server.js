'use strict';
// =============================================================================
// PhoneStore – Express Application Entry Point
// =============================================================================
const path = require('path');
const express = require('express');
const cors = require('cors');

const db = require('./data/db');
const { requireAdmin, userFromRequest } = require('./middleware/auth');
const { sendSuccess, sendError } = require('./middleware/response');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const couponRoutes = require('./routes/coupons');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, 'public');
const INDEX_HTML = path.join(PUBLIC_DIR, 'index.html');

app.disable('x-powered-by');

// --- Global middleware -------------------------------------------------------
app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false }));

// Lightweight request logger
app.use((req, res, next) => {
  res.on('finish', () => {
    const code = res.statusCode || 200;
    console.log(`${new Date().toISOString()}  ${req.method} ${req.originalUrl} -> ${code}`);
  });
  next();
});

// Start every boot from a clean, deterministic dataset
db.resetDatabase();

// --- Public API --------------------------------------------------------------
app.get('/api/health', (req, res) => {
  const database = db.getDb();
  const productCount = database.prepare('SELECT COUNT(*) AS count FROM Products').get().count;
  const orderCount = database.prepare('SELECT COUNT(*) AS count FROM Orders').get().count;

  return sendSuccess(res, 'PhoneStore API hoạt động bình thường', {
    status: 'ok',
    service: 'phonestore-api',
    time: new Date().toISOString(),
    productCount,
    orderCount
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// --- Admin API (401 / 403 enforced for every request) -------------------------
app.use('/api/admin', requireAdmin, adminRoutes);

// --- Static storefront (no-cache headers to prevent browser stale cache) ---
app.use(express.static(PUBLIC_DIR, {
  etag: false,
  lastModified: false,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// --- Protected /admin view -----------------------------------------------------
// Server-side protection of the /admin view
app.get(/^\/admin(\/.*)?$/, (req, res) => {
  const user = userFromRequest(req);
  if (user && user.role === 'admin') {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.sendFile(INDEX_HTML);
  }
  return sendError(
    res,
    'Yêu cầu xác thực tài khoản quản trị viên để truy cập trang quản trị.',
    401,
    'AUTH_REQUIRED'
  );
});

// --- 404 for unknown API routes ------------------------------------------------
app.use('/api', (req, res) => {
  return sendError(
    res,
    `Không tìm thấy tuyến API cho ${req.method} ${req.originalUrl}`,
    404,
    'NOT_FOUND'
  );
});

// --- Fallback SPA route for HTML navigation ---
app.get('{*path}', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(INDEX_HTML);
});

// --- Central error handler ------------------------------------------------------
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    return sendError(res, 'Dữ liệu JSON gửi lên không hợp lệ.', 400, 'BAD_JSON');
  }
  console.error('[SERVER ERROR]', err);
  return sendError(res, 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.', 500, 'INTERNAL');
});

// --- Boot ------------------------------------------------------------------------
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('============================================================');
    console.log('  PhoneStore is running');
    console.log(`  Storefront : http://localhost:${PORT}`);
    console.log(`  Admin view : http://localhost:${PORT}/admin`);
    console.log(`  Health     : http://localhost:${PORT}/api/health`);
    console.log('------------------------------------------------------------');
    console.log('  Admin    : admin@phonestore.test / Admin123!');
    console.log('  Customer : customer@phonestore.test / Customer123!');
    console.log('  Coupons  : SALE10 (10%) · GIAM50K (50,000 VND)');
    console.log('============================================================');
  });
}

module.exports = app;