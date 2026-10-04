'use strict';
// =============================================================================
// PhoneStore – Order routes  (/api/orders)
// -----------------------------------------------------------------------------
// POST /api/orders  -> requires authentication; re-validates every line item
//                      against the *server-side* stock (authoritative source),
//                      applies the coupon, generates ORD-XXXXXX, persists the
//                      order and atomically deducts inventory.
// GET  /api/orders/mine -> the current customer's orders, newest first.
// =============================================================================

const express = require('express');
const db = require('../data/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

const PHONE_RE = /^[0-9+\-\s()]{7,20}$/;

router.get('/mine', (req, res) => {
  const orders = db.getState().orders
    .filter((o) => o.userId === req.user.id)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  res.json({ orders });
});

router.post('/', (req, res) => {
  const b = req.body || {};
  const items = Array.isArray(b.items) ? b.items : [];
  const fullName = String(b.fullName || '').trim();
  const phone = String(b.phone || '').trim();
  const address = String(b.address || '').trim();
  const paymentMethod = String(b.paymentMethod || '').toLowerCase();
  const couponCode = String(b.couponCode || '').trim().toUpperCase();

  // --- Client-side field validation (mirrored on the UI forms) ---------------
  if (fullName.length < 2) {
    return res.status(400).json({ error: 'VALIDATION', field: 'fullName', message: 'Full name is required (at least 2 characters).' });
  }
  if (!PHONE_RE.test(phone)) {
    return res.status(400).json({ error: 'VALIDATION', field: 'phone', message: 'Please enter a valid phone number (7–20 digits).' });
  }
  if (address.length < 5) {
    return res.status(400).json({ error: 'VALIDATION', field: 'address', message: 'Shipping address is required (at least 5 characters).' });
  }
  if (paymentMethod !== 'cod' && paymentMethod !== 'bank') {
    return res.status(400).json({ error: 'VALIDATION', field: 'paymentMethod', message: 'Payment method must be either "cod" or "bank".' });
  }
  if (items.length === 0) {
    return res.status(400).json({ error: 'EMPTY_CART', message: 'Your cart is empty. Add at least one item before checking out.' });
  }

  const state = db.getState();
  const lines = [];
  const shortages = [];
  let subtotal = 0;

  // --- Authoritative server-side stock validation + price calculation ---------
  for (const it of items) {
    const qty = Number(it.qty);
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ error: 'INVALID_QUANTITY', message: 'Each cart item must have a positive integer quantity.' });
    }

    const variant = db.findVariant(String(it.variantId || ''));
    if (!variant) {
      return res.status(400).json({ error: 'INVALID_VARIANT', message: `Product variant "${it.variantId}" does not exist.` });
    }
    const prod = state.products.find((p) => p.id === variant.productId);
    if (!prod || !prod.active) {
      return res.status(400).json({ error: 'INVALID_VARIANT', message: `The product "${prod ? prod.name : variant.productId}" is no longer available.` });
    }
    if (qty > variant.stock) {
      shortages.push({
        variantId: variant.id,
        productName: prod.name,
        color: variant.color,
        ram: variant.ram,
        rom: variant.rom,
        requested: qty,
        available: variant.stock
      });
      continue;
    }

    subtotal += variant.price * qty;
    lines.push({
      productId: prod.id,
      productName: prod.name,
      brand: prod.brand,
      variantId: variant.id,
      color: variant.color,
      ram: variant.ram,
      rom: variant.rom,
      unitPrice: variant.price,
      qty
    });
  }

  if (shortages.length > 0) {
    const parts = shortages.map((s) =>
      `${s.productName} (${s.color} ${s.ram}GB / ${s.rom}GB) – only ${s.available} left, ${s.requested} requested`);
    return res.status(409).json({
      error: 'INSUFFICIENT_STOCK',
      message: 'Insufficient stock. ' + parts.join('; ') + '.',
      shortages
    });
  }

  // --- Coupon application (deductions are always computed server-side) --------
  let discount = 0;
  let appliedCoupon = null;
  if (couponCode) {
    const coupon = state.coupons.find((c) => c.code === couponCode);
    if (!coupon) {
      return res.status(400).json({ error: 'INVALID_COUPON', message: `Coupon code "${couponCode}" is invalid or expired.` });
    }
    discount = coupon.type === 'percent'
      ? Math.round(subtotal * coupon.value / 100)
      : Math.min(coupon.value, subtotal);
    if (discount <= 0) {
      return res.status(400).json({ error: 'INVALID_COUPON', message: 'This coupon does not reduce your order total.' });
    }
    appliedCoupon = coupon.code;
  }

  const grandTotal = Math.max(0, subtotal - discount);

  // --- Persist the order and deduct stock for every purchased item ------------
  for (const l of lines) {
    const v = db.findVariant(l.variantId);
    v.stock -= l.qty;
  }

  const order = {
    id: db.generateOrderId(),
    userId: req.user.id,
    fullName,
    phone,
    address,
    paymentMethod,
    status: 'Pending', // every fresh order enters the lifecycle at Pending
    createdAt: new Date().toISOString(),
    items: lines,
    subtotal,
    couponCode: appliedCoupon,
    discount,
    grandTotal
  };
  state.orders.unshift(order);

  res.status(201).json({ order });
});

module.exports = router;