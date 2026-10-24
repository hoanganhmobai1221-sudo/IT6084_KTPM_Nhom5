'use strict';
// =============================================================================
// PhoneStore – Database Cart Synchronization Routes (/api/cart)
// =============================================================================
const express = require('express');
const db = require('../data/db');
const { requireAuth } = require('../middleware/auth');
const { sendSuccess, sendError } = require('../middleware/response');

const router = express.Router();
router.use(requireAuth);

function getUserCart(userId) {
  const database = db.getDb();
  const rows = database.prepare(`
    SELECT c.quantity AS qty, v.*, p.name AS productName, p.brand
    FROM User_Cart c
    JOIN Product_Variants v ON c.variant_id = v.id
    JOIN Products p ON v.product_id = p.id
    WHERE c.user_id = ?
  `).all(userId);

  return rows.map((r) => ({
    variantId: r.id,
    productId: r.product_id,
    productName: r.productName,
    brand: r.brand,
    color: r.color,
    storage: r.storage,
    ram: r.ram,
    rom: r.rom,
    price: r.price,
    stock: r.stock,
    imageUrl: r.image_url,
    qty: r.qty
  }));
}

// ---------------------------------------------------------------------------
// GET /api/cart -> Get current user's DB cart
// ---------------------------------------------------------------------------
router.get('/', (req, res) => {
  const items = getUserCart(req.user.id);
  return sendSuccess(res, 'Giỏ hàng người dùng', { items, cart: items });
});

// ---------------------------------------------------------------------------
// POST /api/cart/sync -> Merge localStorage cart with DB cart
// ---------------------------------------------------------------------------
router.post('/sync', (req, res) => {
  const incoming = Array.isArray(req.body.items) ? req.body.items : (Array.isArray(req.body.cart) ? req.body.cart : []);
  const database = db.getDb();

  const syncTx = database.transaction(() => {
    const upsertStmt = database.prepare(`
      INSERT INTO User_Cart (user_id, variant_id, quantity)
      VALUES (?, ?, ?)
      ON CONFLICT(user_id, variant_id) DO UPDATE SET quantity = quantity + excluded.quantity
    `);

    for (const it of incoming) {
      const vId = String(it.variantId || it.variant_id || '');
      const q = Math.max(1, parseInt(it.qty || it.quantity || 1, 10));
      const v = database.prepare('SELECT stock FROM Product_Variants WHERE id = ?').get(vId);
      if (v && v.stock > 0) {
        upsertStmt.run(req.user.id, vId, q);
      }
    }

    // Clamp all quantities to available stock
    database.prepare(`
      UPDATE User_Cart
      SET quantity = (SELECT stock FROM Product_Variants WHERE id = User_Cart.variant_id)
      WHERE user_id = ? AND quantity > (SELECT stock FROM Product_Variants WHERE id = User_Cart.variant_id)
    `).run(req.user.id);
  });

  try {
    syncTx();
  } catch (err) {
    console.error('[Cart sync error]', err);
    return sendError(res, 'Lỗi đồng bộ giỏ hàng.', 500, 'INTERNAL_ERROR');
  }

  const items = getUserCart(req.user.id);
  return sendSuccess(res, 'Đồng bộ giỏ hàng thành công', { items, cart: items });
});

// ---------------------------------------------------------------------------
// POST /api/cart/item -> Add or update item in DB cart
// ---------------------------------------------------------------------------
router.post('/item', (req, res) => {
  const variantId = String(req.body.variantId || '').trim();
  const qty = parseInt(req.body.qty || 1, 10);
  if (!variantId || qty < 1) {
    return sendError(res, 'Thông tin sản phẩm trong giỏ hàng không hợp lệ.', 400, 'VALIDATION');
  }

  const database = db.getDb();
  const v = database.prepare('SELECT stock FROM Product_Variants WHERE id = ?').get(variantId);
  if (!v) {
    return sendError(res, 'Biến thể không tồn tại.', 404, 'NOT_FOUND');
  }

  database.prepare(`
    INSERT INTO User_Cart (user_id, variant_id, quantity)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, variant_id) DO UPDATE SET quantity = quantity + excluded.quantity
  `).run(req.user.id, variantId, qty);

  const items = getUserCart(req.user.id);
  return sendSuccess(res, 'Đã cập nhật giỏ hàng', { items, cart: items });
});

// ---------------------------------------------------------------------------
// DELETE /api/cart/item/:variantId -> Remove variant from DB cart
// ---------------------------------------------------------------------------
router.delete('/item/:variantId', (req, res) => {
  const database = db.getDb();
  database.prepare('DELETE FROM User_Cart WHERE user_id = ? AND variant_id = ?').run(req.user.id, req.params.variantId);
  const items = getUserCart(req.user.id);
  return sendSuccess(res, 'Đã xóa sản phẩm khỏi giỏ hàng', { items, cart: items });
});

// ---------------------------------------------------------------------------
// DELETE /api/cart -> Clear DB cart
// ---------------------------------------------------------------------------
router.delete('/', (req, res) => {
  const database = db.getDb();
  database.prepare('DELETE FROM User_Cart WHERE user_id = ?').run(req.user.id);
  return sendSuccess(res, 'Đã làm trống giỏ hàng', { items: [], cart: [] });
});

module.exports = router;
