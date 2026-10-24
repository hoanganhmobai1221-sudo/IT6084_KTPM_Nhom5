'use strict';
// =============================================================================
// PhoneStore – Coupon / Voucher routes (/api/coupons)
// =============================================================================
const express = require('express');
const db = require('../data/db');
const { sendSuccess } = require('../middleware/response');

const router = express.Router();

router.get('/validate', (req, res) => {
  const code = String(req.query.code || '').trim().toUpperCase();
  const rawSubtotal = req.query.subtotal;
  const subtotal = (rawSubtotal !== undefined && rawSubtotal !== '') ? Number(rawSubtotal) : null;

  const database = db.getDb();
  const voucher = database.prepare('SELECT * FROM Vouchers WHERE code = ?').get(code);

  if (!voucher) {
    return res.json({
      success: false,
      valid: false,
      discount: 0,
      message: `Mã giảm giá "${code}" không hợp lệ hoặc không tồn tại.`,
      data: { valid: false, discount: 0 }
    });
  }

  if (voucher.expiration_date && new Date(voucher.expiration_date) < new Date()) {
    return res.json({
      success: false,
      valid: false,
      discount: 0,
      message: `Mã giảm giá "${code}" đã hết hạn sử dụng.`,
      data: { valid: false, discount: 0 }
    });
  }

  if (subtotal !== null && subtotal < (voucher.min_order_value || 0)) {
    return res.json({
      success: false,
      valid: false,
      discount: 0,
      message: `Mã giảm giá "${code}" yêu cầu giá trị đơn hàng tối thiểu ${(voucher.min_order_value).toLocaleString('vi-VN')}đ.`,
      data: { valid: false, discount: 0 }
    });
  }

  let discount = 0;
  if (subtotal !== null) {
    if (voucher.discount_type === 'percent') {
      const calc = Math.round((subtotal * voucher.discount_percent) / 100);
      discount = voucher.max_discount > 0 ? Math.min(calc, voucher.max_discount) : calc;
    } else {
      discount = Math.min(voucher.fixed_amount || 0, Math.max(0, subtotal));
    }
  }

  const desc = voucher.discount_type === 'percent'
    ? (voucher.max_discount > 0 ? `Giảm ${voucher.discount_percent}% (tối đa ${(voucher.max_discount).toLocaleString('vi-VN')}đ)` : `Giảm ${voucher.discount_percent}%`)
    : `Giảm ${(voucher.fixed_amount).toLocaleString('vi-VN')}đ`;

  return sendSuccess(res, `Áp dụng mã giảm giá "${voucher.code}" thành công – ${desc}`, {
    valid: true,
    code: voucher.code,
    type: voucher.discount_type,
    value: voucher.discount_type === 'percent' ? voucher.discount_percent : voucher.fixed_amount,
    discount,
    maxDiscount: voucher.max_discount,
    minOrderValue: voucher.min_order_value
  });
});

module.exports = router;