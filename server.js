'use strict';
// =============================================================================
// PhoneStore – Express application entry point
// -----------------------------------------------------------------------------
// Boots the API on http://localhost:3000, serves the SPA from /public and
// enforces server-side protection of the /admin view + every /api/admin route.
// =============================================================================
const path = require('path');
const express = require('express');
const cors = require('cors');

const db = require('./data/db');
const { requireAdmin, userFromRequest } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const couponRoutes = require('./routes/coupons');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, 'public');
const INDEX_HTML = path.join(PUBLIC_DIR, 'index.html');

app.disable('x-powered-by');

// --- Global middleware -------------------------------------------------------
app.use(cors()); // permissive CORS: LambdaTest / JMeter / local Selenium etc.
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false }));

// Lightweight request logger – handy for correlating JMeter / Selenium runs.
app.use((req, res, next) => {
  res.on('finish', () => {
    const code = res.statusCode || res.status || 200;
    console.log(`${new Date().toISOString()}  ${req.method} ${req.originalUrl} -> ${code}`);
  });
  next();
});

// Start every boot from a clean, deterministic dataset (test-suite hygiene).
db.resetDatabase();

// --- Public API --------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'phonestore-api',
    time: new Date().toISOString(),
    productCount: db.getState().products.length,
    orderCount: db.getState().orders.length
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/orders', orderRoutes);

// --- Admin API (401 / 403 enforced for every request) -------------------------
app.use('/api/admin', requireAdmin, adminRoutes);

// --- Static storefront --------------------------------------------------------
app.use(express.static(PUBLIC_DIR));

// --- Protected /admin view -----------------------------------------------------
// A plain browser navigation to /admin must also be blocked server-side when
// the visitor is not an authenticated admin (401 JSON). The SPA is only served
// to valid admins; everyone else gets an explicit rejection they can assert on.
app.get(/^\/admin(\/.*)?$/, (req, res) => {
  const user = userFromRequest(req);
  if (user && user.role === 'admin') return res.sendFile(INDEX_HTML);
  res.status(401).json({
    error: 'AUTH_REQUIRED',
    message: 'Admin authentication required to access the admin area.'
  });
});

// --- 404 for unknown API routes ------------------------------------------------
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'NOT_FOUND', message: `No API route for ${req.method} ${req.originalUrl}` });
});

// --- Central error handler ------------------------------------------------------
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'BAD_JSON', message: 'Request body is not valid JSON.' });
  }
  console.error('[ERROR]', err);
  res.status(500).json({ error: 'INTERNAL', message: 'Unexpected server error. Please try again.' });
});

// --- Boot ------------------------------------------------------------------------
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
  console.log('  Reset    : POST /api/admin/reset (admin token)');
  console.log('============================================================');
});