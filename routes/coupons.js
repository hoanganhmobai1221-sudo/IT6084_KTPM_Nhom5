'use strict';
// =============================================================================
// PhoneStore – Coupon routes  (/api/coupons)
// -----------------------------------------------------------------------------
// GET /api/coupons/validate?code=SALE10&subtotal=250000
//   Returns the coupon validity and the exact discount amount computed against
//   the provided subtotal. Always answers 200 so the UI can display descriptive
//   success/error messages without exception handling.
// =============================================================================

const express = require('express');
const db = require('../data/db');

const router = express.Router();

router.get('/validate', (req, res) => {
  const code = String(req.query.code || '').trim().toUpperCase();
  const rawSubtotal = req.query.subtotal;
  const subtotal = (rawSubtotal !== undefined && rawSubtotal !== '') ? Number(rawSubtotal) : null;

  const coupon = db.getState().coupons.find((c) => c.code === code);
  if (!coupon) {
    return res.json({ valid: false, discount: 0, message: `Coupon code "${code}" is invalid or expired.` });
  }

  let discount = 0;
  if (subtotal !== null) {
    discount = coupon.type === 'percent'
      ? Math.round(subtotal * coupon.value / 100)
      : Math.min(coupon.value, Math.max(0, subtotal));
  }

  res.json({
    valid: true,
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discount,
    message: `Coupon "${coupon.code}" applied successfully – ${coupon.description}`
  });
});

module.exports = router;