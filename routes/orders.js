'use strict';
// =============================================================================
// PhoneStore – Order routes (/api/orders)
// =============================================================================
const express = require('express');
const db = require('../data/db');
const { requireAuth } = require('../middleware/auth');
const { validateOrderInput } = require('../middleware/validator');
const { sendSuccess, sendError, sanitizeHtml } = require('../middleware/response');

const router = express.Router();
router.use(requireAuth);

const SHIPPING_FEES = {
  'GHN': 30000,
  'GHTK': 25000,
  'Viettel Post': 20000
};

// ---------------------------------------------------------------------------
// GET /api/orders/mine -> orders for the currently authenticated user
// ---------------------------------------------------------------------------
router.get('/mine', (req, res) => {
  const database = db.getDb();
  const orders = database.prepare(`
    SELECT * FROM Orders WHERE user_id = ? ORDER BY created_at DESC
  `).all(req.user.id);

  const getItems = database.prepare(`
    SELECT i.*, v.color, v.storage, v.ram, v.rom, p.id AS productId, p.name AS productName, p.brand
    FROM Order_Items i
    JOIN Product_Variants v ON i.variant_id = v.id
    JOIN Products p ON v.product_id = p.id
    WHERE i.order_id = ?
  `);

  const results = orders.map((o) => {
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

  return sendSuccess(res, 'Danh sách đơn hàng của bạn', { orders: results });
});

// ---------------------------------------------------------------------------
// POST /api/orders -> ACID Transaction order placement with race-condition check
// ---------------------------------------------------------------------------
router.post('/', validateOrderInput, (req, res) => {
  const b = req.body || {};
  const items = Array.isArray(b.items) ? b.items : [];
  const fullName = sanitizeHtml(String(b.fullName || b.shipping_name || '').trim());
  const phone = String(b.phone || b.shipping_phone || '').trim();
  const address = sanitizeHtml(String(b.address || b.shipping_address || '').trim());
  const shippingProvider = String(b.shippingProvider || b.shipping_provider || '').trim();
  const paymentMethod = String(b.paymentMethod || b.payment_method || 'cod').toLowerCase();
  const voucherCode = String(b.voucherCode || b.couponCode || '').trim().toUpperCase();
  const note = sanitizeHtml(String(b.note || '').trim());

  const shippingFee = shippingProvider && SHIPPING_FEES[shippingProvider] != null
    ? SHIPPING_FEES[shippingProvider]
    : (b.shippingFee != null ? Number(b.shippingFee) : (shippingProvider ? 30000 : 0));

  const database = db.getDb();
  let subtotal = 0;
  const verifiedLines = [];

  // 1. Pre-validate variants and current inventory
  for (const it of items) {
    const vId = String(it.variantId || it.variant_id || '');
    const qty = Number(it.qty || it.quantity);

    const variant = db.findVariant(vId);
    if (!variant) {
      return sendError(
        res,
        `Biến thể sản phẩm "${vId}" không tồn tại trong hệ thống.`,
        400,
        'INVALID_VARIANT'
      );
    }
    if (!variant.active) {
      return sendError(
        res,
        `Sản phẩm "${variant.productName}" hiện đã ngừng kinh doanh.`,
        400,
        'PRODUCT_INACTIVE'
      );
    }
    if (variant.stock < qty) {
      return sendError(
        res,
        `Sản phẩm "${variant.productName} (${variant.color})" không đủ tồn kho (chỉ còn ${variant.stock} máy).`,
        400,
        'INSUFFICIENT_STOCK',
        { shortages: [{ variantId: variant.id, available: variant.stock, requested: qty }] }
      );
    }

    subtotal += variant.price * qty;
    verifiedLines.push({
      variantId: variant.id,
      productId: variant.productId,
      productName: variant.productName,
      brand: variant.brand,
      color: variant.color,
      storage: variant.storage,
      ram: variant.ram,
      rom: variant.rom,
      unitPrice: variant.price,
      price: variant.price,
      qty,
      quantity: qty
    });
  }

  // 2. Compute Voucher Discount (calculated strictly on Subtotal before shipping)
  let discountAmount = 0;
  let appliedVoucherCode = null;

  if (voucherCode) {
    const voucher = database.prepare('SELECT * FROM Vouchers WHERE code = ?').get(voucherCode);
    if (!voucher) {
      return sendError(
        res,
        `Mã giảm giá "${voucherCode}" không hợp lệ hoặc đã hết hạn.`,
        400,
        'INVALID_COUPON'
      );
    }

    if (voucher.expiration_date && new Date(voucher.expiration_date) < new Date()) {
      return sendError(
        res,
        `Mã giảm giá "${voucherCode}" đã hết hạn sử dụng.`,
        400,
        'EXPIRED_COUPON'
      );
    }

    if (subtotal < (voucher.min_order_value || 0)) {
      return sendError(
        res,
        `Mã giảm giá "${voucherCode}" yêu cầu đơn hàng tối thiểu ${(voucher.min_order_value).toLocaleString('vi-VN')}đ.`,
        400,
        'MIN_ORDER_VALUE_NOT_MET'
      );
    }

    if (voucher.discount_type === 'percent') {
      const calcDiscount = Math.round((subtotal * voucher.discount_percent) / 100);
      discountAmount = voucher.max_discount > 0 ? Math.min(calcDiscount, voucher.max_discount) : calcDiscount;
    } else {
      discountAmount = Math.min(voucher.fixed_amount || 0, subtotal);
    }

    appliedVoucherCode = voucher.code;
  }

  // 3. Exact Grand Total calculation: Subtotal + Shipping Fee - Discount
  const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);
  const orderId = db.generateOrderId();
  const createdAt = new Date().toISOString();

  // 4. ACID Transaction with Concurrency & Race-condition prevention
  const orderTx = database.transaction(() => {
    // A. Deduct inventory with strict condition: stock >= quantity
    const deductStmt = database.prepare(`
      UPDATE Product_Variants
      SET stock = stock - ?
      WHERE id = ? AND stock >= ?
    `);

    for (const line of verifiedLines) {
      const result = deductStmt.run(line.qty, line.variantId, line.qty);
      if (result.changes === 0) {
        // Rollback entire transaction immediately
        throw new Error('Sản phẩm vừa hết hàng hoặc không đủ số lượng tồn kho');
      }
    }

    // B. Insert into Orders table
    database.prepare(`
      INSERT INTO Orders (
        id, user_id, shipping_name, shipping_phone, shipping_address,
        shipping_provider, shipping_fee, voucher_code, discount_amount,
        subtotal, total_amount, status, note, payment_method, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Chờ xác nhận', ?, ?, ?)
    `).run(
      orderId, req.user.id, fullName, phone, address,
      shippingProvider, shippingFee, appliedVoucherCode, discountAmount,
      subtotal, totalAmount, note, paymentMethod, createdAt
    );

    // C. Insert into Order_Items table
    const itemStmt = database.prepare(`
      INSERT INTO Order_Items (order_id, variant_id, quantity, price)
      VALUES (?, ?, ?, ?)
    `);

    for (const line of verifiedLines) {
      itemStmt.run(orderId, line.variantId, line.qty, line.unitPrice);
    }

    // D. Clear user's database cart
    database.prepare('DELETE FROM User_Cart WHERE user_id = ?').run(req.user.id);
  });

  try {
    orderTx();
  } catch (err) {
    if (err.message === 'Sản phẩm vừa hết hàng hoặc không đủ số lượng tồn kho') {
      return sendError(
        res,
        'Sản phẩm vừa hết hàng hoặc không đủ số lượng tồn kho',
        400,
        'INSUFFICIENT_STOCK'
      );
    }
    console.error('[Order placement error]', err);
    return sendError(
      res,
      'Lỗi khi xử lý đơn hàng. Vui lòng thử lại.',
      500,
      'INTERNAL_ERROR'
    );
  }

  const createdOrder = {
    id: orderId,
    userId: req.user.id,
    user_id: req.user.id,
    fullName,
    shipping_name: fullName,
    phone,
    shipping_phone: phone,
    address,
    shipping_address: address,
    shippingProvider,
    shipping_provider: shippingProvider,
    shippingFee,
    shipping_fee: shippingFee,
    paymentMethod,
    payment_method: paymentMethod,
    status: 'Chờ xác nhận',
    note,
    createdAt,
    created_at: createdAt,
    items: verifiedLines,
    subtotal,
    couponCode: appliedVoucherCode,
    voucher_code: appliedVoucherCode,
    discount: discountAmount,
    discount_amount: discountAmount,
    grandTotal: totalAmount,
    total_amount: totalAmount
  };

  return sendSuccess(
    res,
    'Đặt hàng thành công!',
    { order: createdOrder },
    201
  );
});

// ---------------------------------------------------------------------------
// POST /api/orders/:id/cancel -> Customer cancels pending order (TC-WEB-10 restock)
// ---------------------------------------------------------------------------
router.post('/:id/cancel', (req, res) => {
  const database = db.getDb();
  const order = database.prepare('SELECT * FROM Orders WHERE id = ?').get(req.params.id);

  if (!order) {
    return sendError(res, `Đơn hàng "${req.params.id}" không tồn tại.`, 404, 'NOT_FOUND');
  }

  // Must be customer's own order or admin
  if (order.user_id !== req.user.id && req.user.role !== 'admin') {
    return sendError(res, 'Bạn không có quyền thao tác trên đơn hàng này.', 403, 'FORBIDDEN');
  }

  // Only allowed if status is 'Chờ xác nhận' or 'Pending'
  const isPending = order.status === 'Chờ xác nhận' || order.status === 'Pending';
  if (!isPending) {
    return sendError(
      res,
      `Không thể hủy đơn hàng đang ở trạng thái "${order.status}". Chỉ có thể hủy đơn hàng "Chờ xác nhận".`,
      400,
      'CANNOT_CANCEL'
    );
  }

  // Cancel & Restock transaction
  const items = database.prepare('SELECT * FROM Order_Items WHERE order_id = ?').all(order.id);
  const restocked = [];

  const cancelTx = database.transaction(() => {
    const restockStmt = database.prepare('UPDATE Product_Variants SET stock = stock + ? WHERE id = ?');
    for (const it of items) {
      restockStmt.run(it.quantity, it.variant_id);
      restocked.push({ variantId: it.variant_id, restoredQty: it.quantity });
    }

    database.prepare(`
      UPDATE Orders SET status = 'Đã hủy' WHERE id = ?
    `).run(order.id);
  });

  try {
    cancelTx();
  } catch (err) {
    console.error('[Order cancel error]', err);
    return sendError(res, 'Lỗi khi hủy đơn hàng.', 500, 'INTERNAL_ERROR');
  }

  const updatedOrder = database.prepare('SELECT * FROM Orders WHERE id = ?').get(order.id);
  return sendSuccess(
    res,
    `Đơn hàng ${order.id} đã được hủy thành công và hoàn lại tồn kho.`,
    { order: updatedOrder, restocked }
  );
});

module.exports = router;