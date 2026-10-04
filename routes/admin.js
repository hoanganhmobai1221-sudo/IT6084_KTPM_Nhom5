'use strict';
// =============================================================================
// PhoneStore – Admin routes  (/api/admin, all behind requireAdmin 401/403)
// -----------------------------------------------------------------------------
// Products : GET/POST /products, PUT/DELETE /products/:id,
//            POST /products/:id/variants, PUT/DELETE /variants/:variantId
// Orders   : GET /orders, PUT /orders/:id/status
//            (Cancelled automatically restocks every item's inventory)
// Reports  : GET /analytics (revenue, order volume by status, low-stock alert)
// Utility  : POST /reset (restore the deterministic seed dataset)
// =============================================================================

const express = require('express');
const db = require('../data/db');

const router = express.Router();

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipping', 'Completed', 'Cancelled'];

// ---------------------------------------------------------------------------
// Small private helpers
// ---------------------------------------------------------------------------
function nextProductId() {
  let max = 0;
  for (const p of db.getState().products) {
    const n = parseInt(String(p.id).replace(/^SP/, ''), 10);
    if (!Number.isNaN(n) && n > max) max = n;
  }
  return 'SP' + String(max + 1).padStart(3, '0');
}

function nextVariantId(product) {
  let n = product.variants.length + 1;
  let id = `VAR-${product.id}-${String(n).padStart(2, '0')}`;
  while (product.variants.some((v) => v.id === id)) {
    n += 1;
    id = `VAR-${product.id}-${String(n).padStart(2, '0')}`;
  }
  return id;
}

function parseVariantInput(v) {
  const color = String(v.color || '').trim();
  const ram = Number(v.ram);
  const rom = Number(v.rom);
  const price = Number(v.price);
  const stock = Number(v.stock);
  if (!color || !Number.isInteger(ram) || ram < 0 || !Number.isInteger(rom) || rom < 0) return null;
  if (!Number.isFinite(price) || price < 0) return null;
  if (!Number.isInteger(stock) || stock < 0) return null;
  return { color, ram, rom, price, stock };
}

function parseSpecs(raw) {
  const list = Array.isArray(raw) ? raw : String(raw || '').split('\n');
  return list.map((s) => String(s).trim()).filter(Boolean);
}

function variantFieldError() {
  return { error: 'VALIDATION', message: 'Each variant needs a color, an integer RAM (GB), an integer ROM (GB), a non-negative price and a non-negative integer stock.' };
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
router.get('/products', (req, res) => {
  res.json({ products: db.getState().products }); // admins also see hidden items
});

router.post('/products', (req, res) => {
  const b = req.body || {};
  const name = String(b.name || '').trim();
  const brand = String(b.brand || '').trim();
  if (name.length < 2) {
    return res.status(400).json({ error: 'VALIDATION', field: 'name', message: 'Product name is required (at least 2 characters).' });
  }
  if (brand.length < 2) {
    return res.status(400).json({ error: 'VALIDATION', field: 'brand', message: 'Brand is required (at least 2 characters).' });
  }

  const incoming = Array.isArray(b.variants) ? b.variants : [];
  if (incoming.length === 0) {
    return res.status(400).json({ error: 'VALIDATION', message: 'At least one variant is required for a product.' });
  }

  const id = nextProductId();
  const variants = [];
  for (const v of incoming) {
    const parsed = parseVariantInput(v);
    if (!parsed) return res.status(400).json(variantFieldError());
    variants.push({
      id: `VAR-${id}-${String(variants.length + 1).padStart(2, '0')}`,
      productId: id,
      ...parsed
    });
  }

  const product = {
    id,
    name,
    brand,
    description: String(b.description || '').trim() || 'No description provided.',
    specs: parseSpecs(b.specs),
    createdAt: new Date().toISOString(),
    active: b.active !== false,
    variants
  };
  db.getState().products.push(product);

  res.status(201).json({ product });
});

router.put('/products/:id', (req, res) => {
  const p = db.getState().products.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'NOT_FOUND', message: `Product "${req.params.id}" was not found.` });

  const b = req.body || {};
  if (b.name !== undefined) {
    const name = String(b.name).trim();
    if (name.length < 2) return res.status(400).json({ error: 'VALIDATION', field: 'name', message: 'Product name is required (at least 2 characters).' });
    p.name = name;
  }
  if (b.brand !== undefined) {
    const brand = String(b.brand).trim();
    if (brand.length < 2) return res.status(400).json({ error: 'VALIDATION', field: 'brand', message: 'Brand is required (at least 2 characters).' });
    p.brand = brand;
  }
  if (b.description !== undefined) p.description = String(b.description).trim() || p.description;
  if (b.specs !== undefined) p.specs = parseSpecs(b.specs);
  if (b.active !== undefined) p.active = Boolean(b.active);

  // Optional "full replacement" of variants from the admin form. Existing
  // variant ids are preserved when (color, ram, rom) still match, so Selenium
  // locators built on those ids stay stable.
  if (b.variants !== undefined) {
    if (!Array.isArray(b.variants) || b.variants.length === 0) {
      return res.status(400).json({ error: 'VALIDATION', message: 'A product must keep at least one variant.' });
    }
    const out = [];
    for (const v of b.variants) {
      const parsed = parseVariantInput(v);
      if (!parsed) return res.status(400).json(variantFieldError());
      const existing = p.variants.find((e) => e.color === parsed.color && e.ram === parsed.ram && e.rom === parsed.rom);
      out.push({ id: existing ? existing.id : nextVariantId(p), productId: p.id, ...parsed });
    }
    p.variants = out;
  }

  res.json({ product: p });
});
// Soft delete – the product disappears from the storefront but stays in the DB.
router.delete('/products/:id', (req, res) => {
  const p = db.getState().products.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'NOT_FOUND', message: `Product "${req.params.id}" was not found.` });
  p.active = false;
  res.json({ product: p, message: `Product "${p.id}" hidden from the storefront (soft-deleted).` });
});

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------
router.post('/products/:id/variants', (req, res) => {
  const p = db.getState().products.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'NOT_FOUND', message: `Product "${req.params.id}" was not found.` });

  const parsed = parseVariantInput(req.body || {});
  if (!parsed) return res.status(400).json(variantFieldError());

  const variant = { id: nextVariantId(p), productId: p.id, ...parsed };
  p.variants.push(variant);
  res.status(201).json({ variant });
});

router.put('/variants/:variantId', (req, res) => {
  const v = db.findVariant(req.params.variantId);
  if (!v) return res.status(404).json({ error: 'NOT_FOUND', message: `Variant "${req.params.variantId}" was not found.` });

  const b = req.body || {};
  if (b.color !== undefined) v.color = String(b.color).trim();
  if (b.ram !== undefined) v.ram = Number(b.ram);
  if (b.rom !== undefined) v.rom = Number(b.rom);
  if (b.price !== undefined) v.price = Number(b.price);
  if (b.stock !== undefined) v.stock = Number(b.stock);

  res.json({ variant: v });
});

router.delete('/variants/:variantId', (req, res) => {
  for (const p of db.getState().products) {
    const idx = p.variants.findIndex((v) => v.id === req.params.variantId);
    if (idx !== -1) {
      const [removed] = p.variants.splice(idx, 1);
      return res.json({ variant: removed, message: `Variant "${removed.id}" deleted.` });
    }
  }
  res.status(404).json({ error: 'NOT_FOUND', message: `Variant "${req.params.variantId}" was not found.` });
});
// ---------------------------------------------------------------------------
// Orders & lifecycle
// ---------------------------------------------------------------------------
router.get('/orders', (req, res) => {
  const orders = db.getState().orders.slice().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  res.json({ orders });
});

// MANDATORY BUSINESS CONSTRAINT: moving an order to Cancelled automatically
// replenishes the inventory of every item in that order. Restocking is
// idempotent – re-sending "Cancelled" for an already-cancelled order restores
// nothing a second time.
router.put('/orders/:id/status', (req, res) => {
  const order = db.getState().orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'NOT_FOUND', message: `Order "${req.params.id}" was not found.` });

  const status = String((req.body || {}).status || '').trim();
  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'VALIDATION', message: `Status must be one of: ${ORDER_STATUSES.join(', ')}.` });
  }

  const previous = order.status;
  const restocked = [];

  if (status === 'Cancelled' && previous !== 'Cancelled') {
    for (const item of order.items) {
      const v = db.findVariant(item.variantId);
      if (v) {
        v.stock += item.qty;
        restocked.push({ variantId: v.id, productName: item.productName, restoredQty: item.qty, newStock: v.stock });
      }
    }
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  res.json({
    order,
    message: `Order ${order.id} status updated to "${status}".`,
    restocked
  });
});

// ---------------------------------------------------------------------------
// Reporting & analytics
// ---------------------------------------------------------------------------
router.get('/analytics', (req, res) => {
  const state = db.getState();

  // Total realized revenue excludes Cancelled orders.
  const totalRevenue = state.orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const ordersByStatus = {};
  for (const st of ORDER_STATUSES) ordersByStatus[st] = 0;
  for (const o of state.orders) ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;

  const lowStock = [];
  for (const p of state.products) {
    if (!p.active) continue;
    for (const v of p.variants) {
      if (v.stock < 5) {
        lowStock.push({
          productId: p.id,
          productName: p.name,
          brand: p.brand,
          variantId: v.id,
          color: v.color,
          ram: v.ram,
          rom: v.rom,
          stock: v.stock
        });
      }
    }
  }
  lowStock.sort((a, b) => a.stock - b.stock);

  res.json({
    totalOrders: state.orders.length,
    totalRevenue,
    ordersByStatus,
    lowStock
  });
});

// ---------------------------------------------------------------------------
// Utility – restore the deterministic seed data (test-suite hygiene)
// ---------------------------------------------------------------------------
router.post('/reset', (req, res) => {
  db.resetDatabase();
  res.json({ success: true, message: 'Database reset to its original seed state.' });
});

module.exports = router;