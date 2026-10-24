'use strict';
// =============================================================================
// PhoneStore – SQLite Database with better-sqlite3 & WAL mode
// =============================================================================
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'phonestore.db');

// Ensure data folder exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db = null;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.pragma('busy_timeout = 5000');
    initTables(db);
  }
  return db;
}

function initTables(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS Users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer',
      is_locked INTEGER NOT NULL DEFAULT 0,
      failed_attempts INTEGER NOT NULL DEFAULT 0,
      lock_until TEXT DEFAULT NULL
    );

    CREATE TABLE IF NOT EXISTS Products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      brand TEXT NOT NULL,
      description TEXT NOT NULL,
      specs TEXT NOT NULL,
      spec_details TEXT DEFAULT NULL,
      promotions TEXT DEFAULT NULL,
      original_price INTEGER DEFAULT 0,
      images TEXT DEFAULT NULL,
      image_url TEXT DEFAULT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Product_Variants (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL REFERENCES Products(id) ON DELETE CASCADE,
      color TEXT NOT NULL,
      storage TEXT NOT NULL,
      ram INTEGER NOT NULL DEFAULT 8,
      rom INTEGER NOT NULL DEFAULT 128,
      price INTEGER NOT NULL,
      stock INTEGER NOT NULL,
      image_url TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Orders (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES Users(id),
      shipping_name TEXT NOT NULL,
      shipping_phone TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      shipping_provider TEXT NOT NULL,
      shipping_fee INTEGER NOT NULL DEFAULT 0,
      voucher_code TEXT DEFAULT NULL,
      discount_amount INTEGER NOT NULL DEFAULT 0,
      subtotal INTEGER NOT NULL,
      total_amount INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'Chờ xác nhận',
      note TEXT DEFAULT '',
      payment_method TEXT NOT NULL DEFAULT 'cod',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Order_Items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL REFERENCES Orders(id) ON DELETE CASCADE,
      variant_id TEXT NOT NULL REFERENCES Product_Variants(id),
      quantity INTEGER NOT NULL,
      price INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Vouchers (
      code TEXT PRIMARY KEY,
      discount_percent INTEGER NOT NULL DEFAULT 0,
      max_discount INTEGER NOT NULL DEFAULT 0,
      min_order_value INTEGER NOT NULL DEFAULT 0,
      expiration_date TEXT NOT NULL,
      discount_type TEXT NOT NULL DEFAULT 'percent',
      fixed_amount INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS User_Cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
      variant_id TEXT NOT NULL REFERENCES Product_Variants(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL,
      UNIQUE(user_id, variant_id)
    );

    CREATE TABLE IF NOT EXISTS Sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );
  `);

  try {
    database.exec('ALTER TABLE Products ADD COLUMN images TEXT DEFAULT NULL;');
  } catch {
    // Column already exists
  }
  try {
    database.exec('ALTER TABLE Products ADD COLUMN image_url TEXT DEFAULT NULL;');
  } catch {
    // Column already exists
  }
}

// Deterministic seed data
function seedDatabase(database) {
  const adminHash = bcrypt.hashSync('Admin@123', 10);
  const custHash = bcrypt.hashSync('User@123', 10);
  const testAdminHash = bcrypt.hashSync('Admin123!', 10);
  const testCustHash = bcrypt.hashSync('Customer123!', 10);

  // 1. Users (Admin: admin@phonestore.com / Admin@123 | Customer: user@phonestore.com / User@123)
  const insertUser = database.prepare(`
    INSERT INTO Users (id, name, username, email, phone, password, role, is_locked, failed_attempts, lock_until)
    VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, NULL)
  `);

  insertUser.run('U001', 'System Administrator', 'admin', 'admin@phonestore.com', '0912000001', adminHash, 'admin');
  insertUser.run('U002', 'Maria Nguyen', 'customer', 'customer@phonestore.test', '0912000002', custHash, 'customer');
  insertUser.run('U003', 'Anna Le', 'annale', 'anna.le@example.com', '0912000003', custHash, 'customer');

  // 2. Vouchers
  const insertVoucher = database.prepare(`
    INSERT INTO Vouchers (code, discount_percent, max_discount, min_order_value, expiration_date, discount_type, fixed_amount)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertVoucher.run('SALE10', 10, 0, 0, '2030-12-31', 'percent', 0);
  insertVoucher.run('GIAM50K', 0, 50000, 0, '2030-12-31', 'fixed', 50000);

  // 3. Products & Variants (Apple, Samsung, Xiaomi, OPPO, Vivo)
  const insertProduct = database.prepare(`
    INSERT INTO Products (id, name, slug, brand, description, specs, spec_details, promotions, original_price, images, image_url, active, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertVariant = database.prepare(`
    INSERT INTO Product_Variants (id, product_id, color, storage, ram, rom, price, stock, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const { SEED_PRODUCTS } = require('./seed-products');
  const products = SEED_PRODUCTS;

  for (const p of products) {
    insertProduct.run(
      p.id,
      p.name,
      p.slug,
      p.brand,
      p.description,
      p.specs,
      p.specDetails,
      p.promotions,
      p.originalPrice,
      p.images || null,
      p.image_url || p.imageUrl || null,
      p.active,
      p.createdAt
    );
    for (const v of p.variants) {
      insertVariant.run(
        v.id,
        p.id,
        v.color,
        v.storage,
        v.ram,
        v.rom,
        v.price,
        v.stock,
        v.imageUrl
      );
    }
  }

  // 4. Sample Orders & Order_Items
  const insertOrder = database.prepare(`
    INSERT INTO Orders (id, user_id, shipping_name, shipping_phone, shipping_address, shipping_provider, shipping_fee, voucher_code, discount_amount, subtotal, total_amount, status, note, payment_method, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertOrderItem = database.prepare(`
    INSERT INTO Order_Items (order_id, variant_id, quantity, price)
    VALUES (?, ?, ?, ?)
  `);

  // Order 1: Completed
  insertOrder.run(
    'ORD-A1B2C3',
    'U002',
    'Maria Nguyen',
    '0912000002',
    '221B Baker Street, Hanoi 10001',
    'GHN',
    30000,
    'SALE10',
    3598000,
    35980000,
    32412000,
    'Đã hoàn thành',
    'Giao giờ hành chính',
    'bank',
    '2026-08-20T10:30:00Z'
  );
  insertOrderItem.run('ORD-A1B2C3', 'VAR-SP003-GREEN-256', 2, 17990000);

  // Order 2: Shipping
  insertOrder.run(
    'ORD-D4E5F6',
    'U002',
    'Maria Nguyen',
    '0912000002',
    '221B Baker Street, Hanoi 10001',
    'GHTK',
    25000,
    null,
    0,
    19490000,
    19515000,
    'Đang giao',
    '',
    'cod',
    '2026-08-21T14:00:00Z'
  );
  insertOrderItem.run('ORD-D4E5F6', 'VAR-SP005-MID-128', 1, 19490000);

  // Order 3: Cancelled
  insertOrder.run(
    'ORD-G7H8I9',
    'U003',
    'Anna Le',
    '0912000003',
    '4 Rue Violette, Hanoi 10002',
    'Viettel Post',
    20000,
    null,
    0,
    31990000,
    32010000,
    'Đã hủy',
    'Khách đổi ý',
    'bank',
    '2026-08-18T09:15:00Z'
  );
  insertOrderItem.run('ORD-G7H8I9', 'VAR-SP001-SILVER-256', 1, 31990000);
}

function resetDatabase() {
  const database = getDb();
  // Preserve sessions across reset for test suite hygiene if requested
  const sessions = database.prepare('SELECT * FROM Sessions').all();

  database.exec(`
    DELETE FROM Order_Items;
    DELETE FROM Orders;
    DELETE FROM User_Cart;
    DELETE FROM Product_Variants;
    DELETE FROM Products;
    DELETE FROM Vouchers;
    DELETE FROM Users;
    DELETE FROM Sessions;
  `);

  seedDatabase(database);

  const insertSession = database.prepare('INSERT OR REPLACE INTO Sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)');
  for (const s of sessions) {
    try {
      insertSession.run(s.token, s.user_id, s.created_at, s.expires_at);
    } catch {
      // ignore expired/orphaned
    }
  }

  return getState();
}

function publicUser(u) {
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    fullName: u.name,
    username: u.username,
    email: u.email,
    phone: u.phone,
    role: u.role,
    is_locked: u.is_locked,
    failed_attempts: u.failed_attempts,
    lock_until: u.lock_until
  };
}

function findVariant(variantId) {
  const database = getDb();
  const v = database.prepare(`
    SELECT v.*, p.name AS productName, p.brand, p.active
    FROM Product_Variants v
    JOIN Products p ON v.product_id = p.id
    WHERE v.id = ?
  `).get(variantId);

  if (!v) return null;
  return {
    id: v.id,
    productId: v.product_id,
    product_id: v.product_id,
    productName: v.productName,
    brand: v.brand,
    color: v.color,
    storage: v.storage,
    ram: v.ram,
    rom: v.rom,
    price: v.price,
    stock: v.stock,
    imageUrl: v.image_url,
    image_url: v.image_url,
    active: v.active
  };
}

function generateOrderId() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  let suffix = '';
  for (let i = 0; i < 6; i += 1) {
    suffix += alphabet[crypto.randomBytes(1)[0] % alphabet.length];
  }
  return 'ORD-' + suffix;
}

// In-memory format adapter for compatibility with existing routes and smoke tests
function getState() {
  const database = getDb();
  const rawUsers = database.prepare('SELECT * FROM Users').all();
  const rawProducts = database.prepare('SELECT * FROM Products').all();
  const rawVariants = database.prepare('SELECT * FROM Product_Variants').all();
  const rawVouchers = database.prepare('SELECT * FROM Vouchers').all();
  const rawOrders = database.prepare('SELECT * FROM Orders ORDER BY created_at DESC').all();
  const rawItems = database.prepare(`
    SELECT i.*, v.color, v.ram, v.rom, v.storage, p.id AS productId, p.name AS productName, p.brand
    FROM Order_Items i
    JOIN Product_Variants v ON i.variant_id = v.id
    JOIN Products p ON v.product_id = p.id
  `).all();
  const rawSessions = database.prepare('SELECT * FROM Sessions').all();

  const sessionsMap = {};
  for (const s of rawSessions) {
    sessionsMap[s.token] = s.user_id;
  }

  const products = rawProducts.map((p) => {
    let specs = [];
    try { specs = JSON.parse(p.specs); } catch { specs = []; }
    let specDetails = null;
    try { if (p.spec_details) specDetails = JSON.parse(p.spec_details); } catch { specDetails = null; }
    let promotions = [];
    try { if (p.promotions) promotions = JSON.parse(p.promotions); } catch { promotions = []; }
    let images = [];
    try { if (p.images) images = JSON.parse(p.images); } catch { images = []; }

    const variants = rawVariants
      .filter((v) => v.product_id === p.id)
      .map((v) => ({
        id: v.id,
        productId: v.product_id,
        product_id: v.product_id,
        color: v.color,
        storage: v.storage,
        ram: v.ram,
        rom: v.rom,
        price: v.price,
        stock: v.stock,
        imageUrl: v.image_url,
        image_url: v.image_url
      }));

    const firstImg = (images.length && images[0]) ? images[0] : (variants.length ? variants[0].imageUrl : '');
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      description: p.description,
      specs,
      specDetails,
      promotions,
      images,
      originalPrice: p.original_price,
      active: Boolean(p.active),
      createdAt: p.created_at,
      variants,
      image: firstImg,
      imageUrl: firstImg,
      image_url: firstImg
    };
  });

  const orders = rawOrders.map((o) => {
    const items = rawItems
      .filter((i) => i.order_id === o.id)
      .map((i) => ({
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
      user_id: o.user_id,
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
      payment_method: o.payment_method,
      status: o.status,
      note: o.note,
      createdAt: o.created_at,
      created_at: o.created_at,
      items,
      subtotal: o.subtotal,
      couponCode: o.voucher_code,
      voucher_code: o.voucher_code,
      discount: o.discount_amount,
      discount_amount: o.discount_amount,
      grandTotal: o.total_amount,
      total_amount: o.total_amount
    };
  });

  const vouchers = rawVouchers.map((v) => ({
    code: v.code,
    type: v.discount_type,
    discount_type: v.discount_type,
    value: v.discount_type === 'percent' ? v.discount_percent : v.fixed_amount,
    discount_percent: v.discount_percent,
    max_discount: v.max_discount,
    min_order_value: v.min_order_value,
    expiration_date: v.expiration_date,
    fixed_amount: v.fixed_amount,
    description: v.discount_type === 'percent'
      ? (v.max_discount > 0 ? `Giảm ${v.discount_percent}% (tối đa ${(v.max_discount).toLocaleString('vi-VN')}đ)` : `Giảm ${v.discount_percent}%`)
      : `Giảm ${(v.fixed_amount).toLocaleString('vi-VN')}đ`
  }));

  const users = rawUsers.map((u) => ({
    id: u.id,
    name: u.name,
    fullName: u.name,
    username: u.username,
    email: u.email,
    phone: u.phone,
    passwordHash: u.password,
    password: u.password,
    role: u.role,
    is_locked: u.is_locked,
    failed_attempts: u.failed_attempts,
    lock_until: u.lock_until
  }));

  return {
    users,
    products,
    coupons: vouchers,
    vouchers,
    orders,
    sessions: sessionsMap
  };
}

module.exports = {
  get db() { return getDb(); },
  get state() { return getState(); },
  getDb,
  getState,
  resetDatabase,
  reset: resetDatabase,
  findVariant,
  publicUser,
  generateOrderId
};
