'use strict';
// =============================================================================
// PhoneStore – Catalog routes  (/api/products)
// -----------------------------------------------------------------------------
// GET /api/products?search=&brand=&ram=&rom=&minPrice=&maxPrice=&sort=
//   Case-insensitive instant search (name or brand) + concurrent multi-criteria
//   filters + sorting (newest | price_asc | price_desc). Stateless & JMeter-ready.
// GET /api/products/filter-options -> distinct brands / RAM / ROM / colors + price bounds.
// GET /api/products/:id            -> full product detail incl. all variants.
// =============================================================================

const express = require('express');
const db = require('../data/db');

const router = express.Router();

// -----------------------------------------------------------------------------
// CellphoneS-style merchandising enrichment, keyed by product id:
//   originalPrice – list price shown struck through on cards / detail view
//   specDetails   – structured spec sheet (8 groups) rendered as the detail table
//   promotions    – active offers rendered in the dashed promo box
// Products without an entry fall back to the seed spec lines + DEFAULT_PROMOTIONS.
const DEFAULT_PROMOTIONS = [
  'Giảm thêm đến 1.000.000₫ khi thanh toán qua VNPay/Momo',
  'Trả góp 0% lãi suất lên tới 12 tháng qua thẻ tín dụng',
  'Giao hàng hỏa tốc trong 2 giờ tại Hà Nội & TP.HCM',
  'Bảo hành chính hãng 12 tháng tại trung tâm ủy quyền'
];

const PRODUCT_ENRICHMENT = {
  SP001: {
    originalPrice: 32990000,
    specDetails: {
      'Màn hình': '6.3" Super Retina XDR OLED, 120Hz ProMotion, 2000 nits',
      'Thiết kế': 'Khung Titan sa mạc cấp 5, Kính Ceramic Shield thế hệ mới, IP68',
      'Chipset': 'Apple A18 Pro (3nm), CPU 6 lõi, GPU 6 lõi, Neural Engine 16 lõi',
      'RAM': '8 GB',
      'Bộ nhớ trong': '128 GB / 256 GB / 512 GB / 1 TB',
      'Camera': '48MP Fusion OIS + 48MP Siêu rộng + 12MP Tele 5x, nút Camera Control',
      'Pin & Sạc': '3.582 mAh · Sạc không dây MagSafe 25W · Sạc nhanh 50% trong 30p',
      'Hệ điều hành': 'iOS 18 (Apple Intelligence)'
    },
    promotions: [
      'Thu cũ đổi mới trợ giá đến 3.000.000₫',
      'Tặng gói bảo hành rơi vỡ vào nước 12 tháng',
      'Trả góp 0% lãi suất qua thẻ tín dụng và công ty tài chính'
    ]
  },
  SP008: {
    originalPrice: 37990000,
    specDetails: {
      'Màn hình': '6.9" Super Retina XDR OLED, 120Hz ProMotion, viền siêu mỏng',
      'Thiết kế': 'Khung Titan cấp 5 siêu nhẹ, Kính Ceramic Shield 2026, IP68',
      'Chipset': 'Apple A18 Pro (3nm), Tản nhiệt Graphene nâng cấp hiệu năng bền bỉ',
      'RAM': '8 GB',
      'Bộ nhớ trong': '256 GB / 512 GB / 1 TB',
      'Camera': '48MP Fusion 24mm + 48MP Góc siêu rộng + 12MP Tiềm vọng 5x thế hệ mới',
      'Pin & Sạc': '4.685 mAh · Xem video liên tục 33h · Sạc MagSafe 25W, Qi2 15W',
      'Hệ điều hành': 'iOS 18 (Apple Intelligence đầy đủ)'
    },
    promotions: [
      'Ưu đãi đặt trước tặng củ sạc nhanh 30W chính hãng Apple',
      'Thu cũ đổi mới trợ giá ngay 4.000.000₫',
      'Giảm thêm 1.000.000₫ khi thanh toán qua VNPay/ShopeePay'
    ]
  },
  SP009: {
    originalPrice: 52990000,
    specDetails: {
      'Màn hình': '6.9" LTPO 3.0 ProMotion 144Hz, Độ sáng kỷ lục 3200 nits',
      'Thiết kế': 'Khung Liquid Titanium nguyên khối, Chống nước sâu IP69K',
      'Chipset': 'Apple A20 Pro (2nm) tích hợp Neural Quantum Engine siêu tốc',
      'RAM': '12 GB LPDDR5X',
      'Bộ nhớ trong': '256 GB / 512 GB / 1 TB / 2 TB',
      'Camera': 'Bộ 3 cảm biến 48MP đồng nhất, Zoom tiềm vọng 10x quang học, LiDAR 2.0',
      'Pin & Sạc': '5.200 mAh thể rắn cực an toàn · Sạc nhanh 45W có dây, 30W MagSafe',
      'Hệ điều hành': 'iOS 20 với Trợ lý AI thế hệ mới xử lý độc lập trên máy'
    },
    promotions: [
      'Đặc quyền thành viên VIP: Tặng tai nghe AirPods Pro 2',
      'Bảo hành AppleCare+ chính hãng trọn đời 2 năm',
      'Trả góp 0% trả trước 0 đồng qua kỳ hạn 12 tháng'
    ]
  },
  SP002: {
    originalPrice: 33990000,
    specDetails: {
      'Màn hình': '6.8" Dynamic AMOLED 2X, QHD+, 1-120Hz, 2600 nits, Kính Gorilla Armor',
      'Thiết kế': 'Khung viền Titan phẳng cao cấp, Bút S Pen tích hợp sẵn, IP68',
      'Chipset': 'Snapdragon 8 Gen 3 for Galaxy (4nm) ép xung 3.39GHz, tản nhiệt lớn x1.9',
      'RAM': '12 GB LPDDR5X',
      'Bộ nhớ trong': '256 GB / 512 GB / 1 TB UFS 4.0',
      'Camera': '200MP OIS + 50MP Zoom 5x (Zoom 100x AI) + 10MP Zoom 3x + 12MP Siêu rộng',
      'Pin & Sạc': '5.000 mAh · Sạc siêu nhanh 45W (65% trong 30p) · Sạc không dây 15W',
      'Hệ điều hành': 'Android 14, One UI 6.1.1 (Quyền năng trọn vẹn Galaxy AI)'
    },
    promotions: [
      'Tặng gói bảo hành Samsung Care+ 1 năm toàn diện',
      'Giảm trực tiếp 3.000.000₫ khi tham gia thu cũ lên đời',
      'Tặng ốp lưng chính hãng kèm ngòi bút S Pen thay thế'
    ]
  },
  SP012: {
    originalPrice: 42990000,
    specDetails: {
      'Màn hình': '6.9" Dynamic AMOLED 3X, 144Hz LTPO, 3500 nits, Kính Gorilla Armor 2',
      'Thiết kế': 'Khung Titanium Armor thế hệ 3, Thiết kế cạnh phẳng công thái học',
      'Chipset': 'Qualcomm Snapdragon 8 Elite Gen 2 (2nm), NPU chuyên dụng GenAI',
      'RAM': '16 GB LPDDR5X',
      'Bộ nhớ trong': '512 GB / 1 TB UFS 4.1',
      'Camera': 'Hệ thống 4 camera 200MP thế hệ mới + 50MP Zoom quang 10x (150x Space Zoom)',
      'Pin & Sạc': '5.500 mAh · Sạc siêu tốc 65W · Sạc không dây siêu tốc 30W',
      'Hệ điều hành': 'Android 16, One UI 8 (AI toàn năng đa nhiệm thế hệ mới)'
    },
    promotions: [
      'Tặng đồng hồ thông minh Galaxy Watch 7 trị giá 7.990.000₫',
      'Trợ giá lên đời máy mới đến 5.000.000₫',
      'Bảo hành 2 năm 1 đổi 1 lỗi nhà sản xuất'
    ]
  },
  SP003: {
    originalPrice: 22990000,
    specDetails: {
      'Màn hình': '6.36" AMOLED C8 1.5K, LTPO 1-120Hz, 3000 nits, Viền siêu mỏng 1.61mm',
      'Thiết kế': 'Mặt lưng kính bóng cao cấp, Khung kim loại phẳng bóng bẩy, IP68',
      'Chipset': 'Snapdragon 8 Gen 3 (4nm), Hệ thống tản nhiệt buồng hơi IceLoop',
      'RAM': '12 GB LPDDR5X',
      'Bộ nhớ trong': '256 GB / 512 GB UFS 4.0',
      'Camera': 'Hệ thống 3 camera Leica 50MP Summilux: Cảm biến chính Light Fusion 900',
      'Pin & Sạc': '4.610 mAh · Sạc nhanh 90W HyperCharge (100% trong 31p) · Không dây 50W',
      'Hệ điều hành': 'Xiaomi HyperOS, Android 14 tối ưu mượt mà'
    },
    promotions: [
      'Giảm ngay 2.000.000₫ cho khách hàng đặt mua online',
      'Tặng củ sạc nhanh HyperCharge 90W kèm sẵn trong hộp',
      'Trả góp 0% lãi suất qua Home Credit/Shinhan'
    ]
  },
  SP010: {
    originalPrice: 32990000,
    specDetails: {
      'Màn hình': '6.73" LTPO AMOLED WQHD+ (3200x1440), 120Hz, 3000 nits, Xiaomi Shield Glass',
      'Thiết kế': 'Mặt lưng da công nghệ Nano kháng bẩn hoặc Gốm cao cấp, Khung nhôm Unibody',
      'Chipset': 'Snapdragon 8 Gen 3 (4nm), Tản nhiệt 2 kênh LiquidCool',
      'RAM': '16 GB LPDDR5X',
      'Bộ nhớ trong': '512 GB UFS 4.0',
      'Camera': '4 Camera Leica 50MP: Cảm biến 1-inch LYT-900 thay đổi khẩu vô cấp f/1.63 - f/4.0',
      'Pin & Sạc': '5.000 mAh · Sạc có dây 90W · Sạc không dây 80W (đầy trong 46p)',
      'Hệ điều hành': 'Xiaomi HyperOS, Android 14 chuyên sâu nhiếp ảnh'
    },
    promotions: [
      'Tặng kèm bộ phụ kiện nhiếp ảnh Photography Kit chuyên nghiệp',
      'Bảo hành rơi vỡ màn hình miễn phí 6 tháng đầu',
      'Tặng voucher mua phụ kiện Xiaomi trị giá 1.500.000₫'
    ]
  },
  SP011: {
    originalPrice: 40990000,
    specDetails: {
      'Màn hình': '6.8" 2K LTPO AMOLED 144Hz, 12-bit màu, 3200 nits, Kính Ceramic Glass 2',
      'Thiết kế': 'Vỏ Gốm Nano siêu bền, Chống bụi nước chuẩn quân sự IP68/IP69K',
      'Chipset': 'Qualcomm Snapdragon 8 Elite (3nm), CPU kiến trúc Oryon lõi kép 4.32GHz',
      'RAM': '16 GB LPDDR5X',
      'Bộ nhớ trong': '512 GB / 1 TB UFS 4.1',
      'Camera': 'Quad-Camera Leica: 50MP chính + 200MP Tiềm vọng 10x quang (120x kỹ thuật số)',
      'Pin & Sạc': '6.000 mAh Silicon-Carbon · Sạc thần tốc 120W (đầy trong 19p) · 80W không dây',
      'Hệ điều hành': 'Xiaomi HyperOS 2 thông minh, Android 16'
    },
    promotions: [
      'Tặng sạc không dây 80W kiêm giá đỡ tản nhiệt',
      'Ưu đãi thành viên Mi Fan giảm trực tiếp 3.000.000₫',
      'Gói bảo hành vàng 24 tháng toàn diện cả nguồn và màn hình'
    ]
  },
  SP005: {
    originalPrice: 22990000,
    specDetails: {
      'Màn hình': '6.1" Super Retina XDR OLED, Dynamic Island, 2000 nits',
      'Thiết kế': 'Mặt lưng kính pha màu, Khung nhôm tái chế, IP68',
      'Chipset': 'Apple A16 Bionic (4nm)',
      'RAM': '6 GB',
      'Bộ nhớ trong': '128 GB / 256 GB',
      'Camera': 'Kép 48MP Fusion + 12MP Góc siêu rộng, chụp chân dung thế hệ mới',
      'Pin & Sạc': '3.349 mAh · Sạc nhanh 20W · Sạc MagSafe 15W · Cổng USB-C tiện dụng',
      'Hệ điều hành': 'iOS 17 (hỗ trợ nâng cấp iOS 18)'
    },
    promotions: [
      'Trợ giá lên đời 1.500.000₫',
      'Tặng kính cường lực KingKong cao cấp',
      'Trả góp 0% lên tới 12 tháng'
    ]
  },
  SP004: {
    originalPrice: 10990000,
    specDetails: {
      'Màn hình': '6.6" Super AMOLED FHD+, 120Hz, 1000 nits, Gorilla Glass Victus+',
      'Thiết kế': 'Khung viền kim loại sang trọng, Mặt lưng kính bóng, IP67',
      'Chipset': 'Exynos 1480 (4nm), Đồ họa AMD Xclipse 530 kiến trúc RDNA2',
      'RAM': '8 GB',
      'Bộ nhớ trong': '128 GB / 256 GB (hỗ trợ thẻ MicroSD đến 1TB)',
      'Camera': '50MP OIS + 12MP Siêu rộng + 5MP Macro',
      'Pin & Sạc': '5.000 mAh · Sạc siêu nhanh 25W',
      'Hệ điều hành': 'Android 14, One UI 6.1 (Bảo mật phần cứng Samsung Knox Vault)'
    },
    promotions: [
      'Ưu đãi học sinh - sinh viên giảm ngay 500.000₫',
      'Tặng củ sạc nhanh 25W chính hãng Samsung',
      'Trả góp 0% duyệt hồ sơ nhanh trong 15 phút'
    ]
  },
  SP006: {
    originalPrice: 8990000,
    specDetails: {
      'Màn hình': '6.67" AMOLED 1.5K CrystalRes, 120Hz, 1800 nits, Kính Gorilla Glass Victus',
      'Thiết kế': 'Mặt lưng kính mờ AG chống bám vân tay, Viền siêu mỏng, IP54',
      'Chipset': 'Snapdragon 7s Gen 2 (4nm), tiến trình tiết kiệm điện',
      'RAM': '8 GB',
      'Bộ nhớ trong': '128 GB / 256 GB',
      'Camera': '200MP siêu sắc nét OIS + 8MP Siêu rộng + 2MP Macro',
      'Pin & Sạc': '5.100 mAh · Sạc nhanh Turbo 67W (đầy 100% trong 44 phút)',
      'Hệ điều hành': 'Android 13 / Xiaomi HyperOS'
    },
    promotions: [
      'Giảm ngay 500.000₫ khi thanh toán quét mã VNPAY',
      'Bảo hành chính hãng 18 tháng DGC',
      'Tặng tai nghe có dây chất lượng cao'
    ]
  }
};

function publicProduct(p) {
  const prices = p.variants.map((v) => v.price);
  const extra = PRODUCT_ENRICHMENT[p.id] || {};
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    description: p.description,
    specs: p.specs,
    specDetails: extra.specDetails || null,
    promotions: extra.promotions || DEFAULT_PROMOTIONS,
    price: Math.min(...prices),
    originalPrice: extra.originalPrice || Math.max(...prices),
    createdAt: p.createdAt,
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    image: p.image || p.imageUrl || '',
    imageUrl: p.imageUrl || p.image || '',
    variants: p.variants
  };
}

// ---------------------------------------------------------------------------
// GET /api/products  (catalog + instant search + filters + sort)
// ---------------------------------------------------------------------------
router.get('/', (req, res) => {
  const q = req.query;
  const search = String(q.search || '').trim().toLowerCase();
  const brand = String(q.brand || '').trim();
  const ram = (q.ram !== undefined && q.ram !== '' && q.ram !== 'all') ? Number(q.ram) : null;
  const rom = (q.rom !== undefined && q.rom !== '' && q.rom !== 'all') ? Number(q.rom) : null;
  const minPrice = (q.minPrice !== undefined && q.minPrice !== '') ? Number(q.minPrice) : null;
  const maxPrice = (q.maxPrice !== undefined && q.maxPrice !== '') ? Number(q.maxPrice) : null;
  const sort = String(q.sort || 'newest');

  let results = [];

  for (const p of db.getState().products) {
    if (!p.active) continue; // soft-deleted products never appear on the storefront

    if (search && !(p.name.toLowerCase().includes(search) || p.brand.toLowerCase().includes(search))) continue;
    if (brand && p.brand.toLowerCase() !== brand.toLowerCase()) continue;

    // Apply RAM / ROM filters at variant granularity; a product only matches
    // when at least one of its variants satisfies every applied criterion.
    let variants = p.variants;
    if (ram !== null) variants = variants.filter((v) => v.ram === ram);
    if (rom !== null) variants = variants.filter((v) => v.rom === rom);
    if (variants.length === 0) continue;

    const priceOk = (v) =>
      (minPrice === null || v.price >= minPrice) &&
      (maxPrice === null || v.price <= maxPrice);
    if (!variants.some(priceOk)) continue;

    results.push(Object.assign(publicProduct(p), { variants }));
  }

  if (sort === 'price_asc') {
    results.sort((a, b) => Math.min(...a.variants.map((v) => v.price)) - Math.min(...b.variants.map((v) => v.price)));
  } else if (sort === 'price_desc') {
    results.sort((a, b) => Math.min(...b.variants.map((v) => v.price)) - Math.min(...a.variants.map((v) => v.price)));
  } else {
    // default / newest
    results.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  }

  res.json({ total: results.length, products: results });
});

// ---------------------------------------------------------------------------
// GET /api/products/filter-options -> deterministic dropdown options
// ---------------------------------------------------------------------------
router.get('/filter-options', (req, res) => {
  const active = db.getState().products.filter((p) => p.active);
  const variants = active.flatMap((p) => (Array.isArray(p.variants) ? p.variants : []));
  const brands = [...new Set(active.map((p) => p.brand).filter(Boolean))].sort();
  const ram = [...new Set(variants.map((v) => v.ram))].sort((a, b) => a - b);
  const rom = [...new Set(variants.map((v) => v.rom))].sort((a, b) => a - b);
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))].sort();
  const prices = variants.map((v) => Number(v.price)).filter((n) => Number.isFinite(n));
  const priceMin = prices.length ? Math.min(...prices) : 0;
  const priceMax = prices.length ? Math.max(...prices) : 0;
  // minPrice / maxPrice are aliases of priceMin / priceMax so both naming
  // contracts hold for API consumers (frontend defaults use priceMin/priceMax).
  res.json({ brands, ram, rom, colors, priceMin, priceMax, minPrice: priceMin, maxPrice: priceMax });
});

// ---------------------------------------------------------------------------
// GET /api/products/:id -> single active product (all variants)
// ---------------------------------------------------------------------------
router.get('/:id', (req, res) => {
  const p = db.getState().products.find((x) => x.id === req.params.id);
  if (!p || !p.active) {
    return res.status(404).json({
      error: 'PRODUCT_NOT_FOUND',
      message: `Product "${req.params.id}" was not found or is no longer available.`
    });
  }
  res.json({ product: publicProduct(p) });
});

module.exports = router;