'use strict';
// =============================================================================
// PhoneStore – Catalog routes (/api/products)
// =============================================================================
const express = require('express');
const db = require('../data/db');
const { sendSuccess, sendError } = require('../middleware/response');

const router = express.Router();

function formatPublicProduct(p, variants) {
  let specs = [];
  try { specs = typeof p.specs === 'string' ? JSON.parse(p.specs) : (p.specs || []); } catch { specs = []; }
  let specDetails = null;
  try { specDetails = typeof p.spec_details === 'string' ? JSON.parse(p.spec_details) : (p.specDetails || null); } catch { specDetails = null; }
  let promotions = [];
  try { promotions = typeof p.promotions === 'string' ? JSON.parse(p.promotions) : (p.promotions || []); } catch { promotions = []; }

  let productImages = [];
  try {
    productImages = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []);
  } catch {
    productImages = [];
  }
  if (!Array.isArray(productImages)) productImages = [];

  // Default images if empty: gather from variants
  if (productImages.length === 0) {
    const vImgs = variants.map((v) => v.image_url || v.imageUrl).filter(Boolean);
    productImages = [...new Set(vImgs)];
  }

  const galleryLabels = [
    { label: 'Mặt trước', badge: '📱 Mặt trước (Màn hình)', desc: 'Màn hình sắc nét viền siêu mỏng, camera trước chính hãng' },
    { label: 'Góc nghiêng', badge: '📸 Chi tiết thiết kế', desc: 'Thiết kế nguyên khối cao cấp, camera đỉnh cao' },
    { label: 'Mặt sau', badge: '💎 Mặt lưng & Màu sắc', desc: 'Mặt lưng kính nhám cao cấp cùng cụm camera' },
    { label: 'Góc cạnh', badge: '📐 Khung viền & Phím bấm', desc: 'Khung viền hoàn thiện tinh xảo, chống va đập' },
    { label: 'Mở hộp', badge: '📦 Hộp máy & Phụ kiện', desc: 'Trọn bộ hộp đóng gói chính hãng kèm phụ kiện' }
  ];

  const buildGallery = (primaryUrl, extraImages) => {
    const list = [];
    if (primaryUrl) list.push(primaryUrl);
    for (const u of (extraImages || [])) {
      if (u && !list.includes(u)) list.push(u);
    }
    if (list.length === 0 && primaryUrl) list.push(primaryUrl);

    return list.map((url, idx) => {
      const meta = galleryLabels[idx] || {
        label: `Góc nhìn ${idx + 1}`,
        badge: `📷 Hình ảnh thực tế ${idx + 1}`,
        desc: `Hình ảnh chi tiết sản phẩm chính hãng (${idx + 1})`
      };
      return {
        id: `img-${idx + 1}`,
        label: meta.label,
        badge: meta.badge,
        url,
        desc: meta.desc
      };
    });
  };

  const formattedVariants = variants.map((v) => ({
    id: v.id,
    productId: v.product_id || p.id,
    color: v.color,
    storage: v.storage,
    ram: v.ram,
    rom: v.rom,
    price: v.price,
    stock: v.stock,
    imageUrl: v.image_url,
    image_url: v.image_url,
    gallery: buildGallery(v.image_url, productImages)
  }));

  const prices = formattedVariants.map((v) => v.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const defaultImg = p.image_url || (formattedVariants.length && formattedVariants[0].imageUrl ? formattedVariants[0].imageUrl : (productImages[0] || ''));
  const productGallery = buildGallery(defaultImg, productImages);

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    description: p.description,
    specs,
    specDetails,
    promotions,
    price: minPrice,
    originalPrice: p.original_price || maxPrice,
    minPrice,
    maxPrice,
    createdAt: p.created_at,
    active: Boolean(p.active),
    image: defaultImg,
    imageUrl: defaultImg,
    image_url: defaultImg,
    gallery: productGallery,
    images: productGallery.map((g) => g.url),
    variants: formattedVariants
  };
}

// ---------------------------------------------------------------------------
// GET /api/products
// ---------------------------------------------------------------------------
router.get('/', (req, res) => {
  const q = req.query;
  const isAllOrEmpty = (val) => {
    if (val === undefined || val === null) return true;
    const s = String(val).trim().toLowerCase();
    return s === '' || s === 'all' || s.includes('tất cả') || s.includes('tat ca') || s === 'undefined' || s === 'null';
  };

  const search = String(q.search || '').trim().toLowerCase();
  const brand = isAllOrEmpty(q.brand) ? null : String(q.brand).trim();

  let ram = null;
  if (!isAllOrEmpty(q.ram)) {
    const match = String(q.ram).match(/\d+/);
    if (match) ram = Number(match[0]);
  }

  let rom = null;
  if (!isAllOrEmpty(q.rom)) {
    const match = String(q.rom).match(/\d+/);
    if (match) rom = Number(match[0]);
  }

  let storage = null;
  if (!isAllOrEmpty(q.storage)) {
    const sVal = String(q.storage).trim().toUpperCase();
    if (sVal !== 'ALL') storage = sVal;
  }

  const minPrice = (q.minPrice !== undefined && q.minPrice !== '') ? Number(q.minPrice) : null;
  const maxPrice = (q.maxPrice !== undefined && q.maxPrice !== '') ? Number(q.maxPrice) : null;
  const sort = String(q.sort || 'newest');

  const database = db.getDb();
  const allProducts = database.prepare('SELECT * FROM Products WHERE active = 1').all();
  const allVariants = database.prepare('SELECT * FROM Product_Variants').all();

  const results = [];

  for (const p of allProducts) {
    if (search && !(p.name.toLowerCase().includes(search) || p.brand.toLowerCase().includes(search))) {
      continue;
    }
    if (brand && p.brand.toLowerCase() !== brand.toLowerCase()) {
      continue;
    }

    let pVariants = allVariants.filter((v) => v.product_id === p.id);
    if (ram !== null) pVariants = pVariants.filter((v) => v.ram === ram);
    if (rom !== null) pVariants = pVariants.filter((v) => v.rom === rom);
    if (storage && storage !== 'ALL') {
      pVariants = pVariants.filter((v) => String(v.storage).toUpperCase() === storage);
    }

    if (pVariants.length === 0) continue;

    const priceOk = (v) =>
      (minPrice === null || v.price >= minPrice) &&
      (maxPrice === null || v.price <= maxPrice);

    if (!pVariants.some(priceOk)) continue;

    const formatted = formatPublicProduct(p, pVariants);
    results.push(formatted);
  }

  if (sort === 'price_asc') {
    results.sort((a, b) => a.minPrice - b.minPrice);
  } else if (sort === 'price_desc') {
    results.sort((a, b) => b.minPrice - a.minPrice);
  } else {
    // Newest
    results.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  }

  return sendSuccess(res, 'Danh sách sản phẩm', { total: results.length, products: results });
});

// ---------------------------------------------------------------------------
// GET /api/products/filter-options
// ---------------------------------------------------------------------------
router.get('/filter-options', (req, res) => {
  const database = db.getDb();
  const activeProducts = database.prepare('SELECT * FROM Products WHERE active = 1').all();
  const activeVariants = database.prepare(`
    SELECT v.* FROM Product_Variants v
    JOIN Products p ON v.product_id = p.id
    WHERE p.active = 1
  `).all();

  const brands = [...new Set(activeProducts.map((p) => p.brand).filter(Boolean))].sort();
  const ram = [...new Set(activeVariants.map((v) => v.ram))].sort((a, b) => a - b);
  const rom = [...new Set(activeVariants.map((v) => v.rom))].sort((a, b) => a - b);
  const storages = [...new Set(activeVariants.map((v) => v.storage).filter(Boolean))].sort();
  const colors = [...new Set(activeVariants.map((v) => v.color).filter(Boolean))].sort();
  const prices = activeVariants.map((v) => Number(v.price)).filter((n) => Number.isFinite(n));
  const priceMin = prices.length ? Math.min(...prices) : 0;
  const priceMax = prices.length ? Math.max(...prices) : 0;

  return sendSuccess(res, 'Các tùy chọn bộ lọc', {
    brands,
    ram,
    rom,
    storages,
    colors,
    priceMin,
    priceMax,
    minPrice: priceMin,
    maxPrice: priceMax
  });
});

// ---------------------------------------------------------------------------
// GET /api/products/:id
// ---------------------------------------------------------------------------
router.get('/:id', (req, res) => {
  const database = db.getDb();
  const p = database.prepare('SELECT * FROM Products WHERE id = ?').get(req.params.id);

  if (!p || !p.active) {
    return sendError(
      res,
      `Sản phẩm "${req.params.id}" không tồn tại hoặc đã ngừng kinh doanh.`,
      404,
      'PRODUCT_NOT_FOUND'
    );
  }

  const variants = database.prepare('SELECT * FROM Product_Variants WHERE product_id = ?').all(p.id);
  const product = formatPublicProduct(p, variants);

  return sendSuccess(res, 'Chi tiết sản phẩm', { product });
});

module.exports = router;