'use strict';
// =============================================================================
// PhoneStore – In-Memory Database
// -----------------------------------------------------------------------------
// Seed dataset updated with 2026/2025 flagship smartphones (iPhone 16/18 Pro,
// Galaxy S24/S26 Ultra, Xiaomi 14/18) with CellphoneS specifications and CDN images.
// =============================================================================
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

let state = null;

// --- Compact seed helpers -----------------------------------------------------
function variant(id, productId, color, ram, rom, price, stock) {
  return { id, productId, color, ram, rom, price, stock };
}

function product(id, name, brand, description, specs, createdAt, active, variants, image) {
  const fallbackCdn = 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png';
  const img = image || fallbackCdn;
  return { id, name, brand, description, specs, createdAt, active, variants, image: img, imageUrl: img };
}

function line(productId, productName, variantId, color, ram, rom, unitPrice, qty) {
  return { productId, productName, variantId, color, ram, rom, unitPrice, qty };
}

function buildSeed() {
  const users = [
    { id: 'U001', fullName: 'System Administrator', email: 'admin@phonestore.test', phone: '0912000001', passwordHash: bcrypt.hashSync('Admin123!', 10), role: 'admin' },
    { id: 'U002', fullName: 'Maria Nguyen', email: 'customer@phonestore.test', phone: '0912000002', passwordHash: bcrypt.hashSync('Customer123!', 10), role: 'customer' },
    { id: 'U003', fullName: 'Anna Le', email: 'anna.le@example.com', phone: '0912000003', passwordHash: bcrypt.hashSync('Customer123!', 10), role: 'customer' }
  ];

  const products = [
    // --- Apple Line-up --------------------------------------------------------
    product('SP001', 'iPhone 16 Pro', 'Apple',
      'Đột phá với chip Apple A18 Pro tiến trình 3nm, nút Điều khiển Camera (Camera Control) mới, khung Titan sa mạc đẳng cấp cùng hệ thống camera Pro 48MP Fusion bắt trọn mọi khoảnh khắc đỉnh cao.',
      [
        'Màn hình: 6.3 inch Super Retina XDR OLED, 120Hz ProMotion, 2000 nits, Dynamic Island',
        'Chipset: Apple A18 Pro (3nm), CPU 6 lõi, GPU 6 lõi, Neural Engine 16 lõi',
        'RAM: 8GB',
        'Bộ nhớ trong: 128GB / 256GB / 512GB / 1TB NVMe',
        'Camera sau: Chính 48MP Fusion OIS + Góc siêu rộng 48MP + Tele 12MP zoom quang 5x',
        'Camera trước: 12MP TrueDepth, tự động lấy nét, quay 4K 60fps Dolby Vision',
        'Pin & Sạc: 3.582 mAh, sạc nhanh không dây MagSafe 25W, sạc dây 50% trong 30 phút',
        'Tính năng: Nút Camera Control chuyên nghiệp, Apple Intelligence, Khung Titan chuẩn IP68'
      ],
      '2026-09-20T09:00:00Z', true, [
        variant('VAR-SP001-DESERT-128', 'SP001', 'Titan Sa Mạc', 8, 128, 28990000, 15),
        variant('VAR-SP001-SILVER-256', 'SP001', 'Titan Tự Nhiên', 8, 256, 31990000, 12),
        variant('VAR-SP001-BLACK-512', 'SP001', 'Titan Đen', 8, 512, 37990000, 8),
        variant('VAR-SP001-WHITE-1TB', 'SP001', 'Titan Trắng', 8, 1024, 43990000, 5)
      ],
      'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro_1.png'),

    product('SP008', 'iPhone 16 Pro Max', 'Apple',
      'Chiếc iPhone đỉnh cao nhất của Apple sở hữu màn hình Super Retina XDR 6.9 inch viền siêu mỏng, thời lượng pin lên đến 33 giờ, nút Camera Control và chip Apple A18 Pro uy lực vượt bậc.',
      [
        'Màn hình: 6.9 inch Super Retina XDR OLED, 120Hz ProMotion, 2000 nits',
        'Chipset: Apple A18 Pro (3nm), GPU 6 nhân tản nhiệt graphene',
        'RAM: 8GB',
        'Bộ nhớ trong: 256GB / 512GB / 1TB',
        'Camera sau: 48MP Fusion khẩu độ f/1.78 + 48MP Ultrawide + 12MP Telephoto 5x thế hệ mới',
        'Camera trước: 12MP TrueDepth, Photonic Engine, Smart HDR 5',
        'Pin & Sạc: 4.685 mAh, sạc MagSafe 25W, Qi2 15W, thời lượng xem video liên tục 33h',
        'Tính năng: Apple Intelligence, Khung viền Titan cấp 5, Quay video 4K 120fps điện ảnh'
      ],
      '2026-09-22T09:00:00Z', true, [
        variant('VAR-SP008-DESERT-256', 'SP008', 'Titan Sa Mạc', 8, 256, 34990000, 20),
        variant('VAR-SP008-NATURAL-512', 'SP008', 'Titan Tự Nhiên', 8, 512, 40990000, 10),
        variant('VAR-SP008-BLACK-1TB', 'SP008', 'Titan Đen', 8, 1024, 46990000, 6)
      ],
      'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png'),

    product('SP009', 'iPhone 18 Pro Max', 'Apple',
      'Siêu phẩm concept đỉnh cao tương lai trang bị vi xử lý Apple A20 Pro quy trình 2nm tối tân, màn hình vô cực không khuyết điểm tích hợp Face ID dưới màn hình và buồng tản nhiệt chất lỏng siêu dẫn.',
      [
        'Màn hình: 6.9 inch ProMotion LTPO 3.0, 144Hz thích ứng, độ sáng cực đại 3200 nits',
        'Chipset: Apple A20 Pro (2nm thế hệ mới) tích hợp Neural Quantum Engine',
        'RAM: 12GB LPDDR5X',
        'Bộ nhớ trong: 256GB / 512GB / 1TB / 2TB',
        'Camera sau: Bộ 3 cảm biến 48MP đồng nhất, zoom tiềm vọng 10x quang học, cảm biến LiDAR 2.0',
        'Camera trước: 24MP ẩn dưới màn hình (Under-Display TrueDepth)',
        'Pin & Sạc: 5.200 mAh thể rắn an toàn tuyệt đối, sạc nhanh 45W, sạc ngược không dây',
        'Tính năng: Face ID ẩn toàn phần, Trợ lý Apple AI thế hệ mới xử lý độc lập trên máy'
      ],
      '2026-09-25T09:00:00Z', true, [
        variant('VAR-SP009-TITAN-256', 'SP009', 'Titanium Xám', 12, 256, 44990000, 10),
        variant('VAR-SP009-COSMIC-512', 'SP009', 'Cosmic Đen', 12, 512, 49990000, 7),
        variant('VAR-SP009-FROST-1TB', 'SP009', 'Frost Bạc', 12, 1024, 55990000, 4)
      ],
      'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png'),

    product('SP005', 'iPhone 15', 'Apple',
      'Thiết kế mặt lưng kính pha màu tuyệt đẹp, Dynamic Island thông minh, camera chính 48MP nâng cấp vượt bậc cùng cổng kết nối USB-C tiện dụng.',
      [
        'Màn hình: 6.1 inch Super Retina XDR OLED, 2000 nits, Dynamic Island',
        'Chipset: Apple A16 Bionic (4nm)',
        'RAM: 6GB',
        'Bộ nhớ trong: 128GB / 256GB',
        'Camera sau: Kép 48MP Fusion + 12MP Ultra Wide góc rộng 120 độ',
        'Camera trước: 12MP TrueDepth, tự động lấy nét',
        'Pin & Sạc: 3.349 mAh, sạc nhanh 20W, sạc không dây MagSafe 15W',
        'Tính năng: Cổng USB-C, Tính năng phát hiện va chạm, Chống nước IP68'
      ],
      '2026-07-25T09:00:00Z', true, [
        variant('VAR-SP005-MID-128', 'SP005', 'Đen Midnight', 6, 128, 19490000, 15),
        variant('VAR-SP005-BLUE-128', 'SP005', 'Xanh Lam Pastel', 6, 128, 19490000, 12),
        variant('VAR-SP005-PINK-256', 'SP005', 'Hồng Pastel', 6, 256, 22490000, 8)
      ],
      'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus_1__1.png'),

    // --- Samsung Line-up ------------------------------------------------------
    product('SP002', 'Samsung Galaxy S24 Ultra', 'Samsung',
      'Quyền năng Galaxy AI dẫn đầu xu hướng, khung viền Titan sang trọng, màn hình phẳng chống phản xạ đỉnh cao Corning Gorilla Armor cùng ống kính 200MP và bút S Pen huyền thoại.',
      [
        'Màn hình: 6.8 inch Dynamic AMOLED 2X, QHD+, 1-120Hz thích ứng, 2600 nits, Kính Gorilla Armor',
        'Chipset: Snapdragon 8 Gen 3 for Galaxy (4nm), buồng tản nhiệt buồng hơi lớn hơn 1.9 lần',
        'RAM: 12GB',
        'Bộ nhớ trong: 256GB / 512GB / 1TB UFS 4.0',
        'Camera sau: 200MP OIS + 50MP Zoom quang 5x (Zoom số 100x) + 10MP Zoom quang 3x + 12MP Siêu rộng',
        'Camera trước: 12MP Dual Pixel AF, HDR',
        'Pin & Sạc: 5.000 mAh, sạc nhanh có dây 45W (65% trong 30 phút), sạc không dây 15W',
        'Tính năng: Bút S Pen tích hợp, Bộ tính năng Galaxy AI thông minh, Khung Titan chuẩn IP68'
      ],
      '2026-08-08T09:00:00Z', true, [
        variant('VAR-SP002-GRAY-256', 'SP002', 'Xám Titan', 12, 256, 27990000, 18),
        variant('VAR-SP002-BLACK-512', 'SP002', 'Đen Titan', 12, 512, 31990000, 12),
        variant('VAR-SP002-YELLOW-1TB', 'SP002', 'Vàng Titan', 12, 1024, 37990000, 5)
      ],
      'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s24-ultra_1.png'),

    product('SP012', 'Samsung Galaxy S26 Ultra', 'Samsung',
      'Siêu phẩm tương lai của Samsung định hình kỷ nguyên di động với vi xử lý Snapdragon 8 Elite Gen 2, màn hình Dynamic AMOLED 3X siêu sáng 3500 nits, camera zoom không gian 150x và S Pen trí tuệ nhân tạo.',
      [
        'Màn hình: 6.9 inch Dynamic AMOLED 3X, 144Hz thích ứng, 3500 nits, Kính Gorilla Armor 2',
        'Chipset: Snapdragon 8 Elite Gen 2 (2nm), NPU chuyên dụng cho tác vụ GenAI thời gian thực',
        'RAM: 16GB LPDDR5X',
        'Bộ nhớ trong: 512GB / 1TB UFS 4.1',
        'Camera sau: Cụm quad-camera 200MP cảm biến ISOCELL mới + 50MP Zoom quang 10x + 50MP Siêu rộng',
        'Camera trước: 16MP khẩu độ lớn f/1.8 tích hợp AI xử lý da chân thực',
        'Pin & Sạc: 5.500 mAh, sạc siêu tốc 65W, sạc không dây siêu tốc 30W',
        'Tính năng: Bút S Pen AI Pro, Hệ điều hành One UI AI tân tiến, Khung Titanium Armor 3'
      ],
      '2026-09-24T09:00:00Z', true, [
        variant('VAR-SP012-PHANTOM-512', 'SP012', 'Phantom Titanium', 16, 512, 36990000, 15),
        variant('VAR-SP012-SILVER-1TB', 'SP012', 'Silver Titanium', 16, 1024, 41990000, 8)
      ],
      'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s24-ultra_1.png'),

    product('SP004', 'Samsung Galaxy A55 5G', 'Samsung',
      'Chiếc smartphone tầm trung cao cấp sở hữu khung viền kim loại sang trọng, màn hình Super AMOLED 120Hz rực rỡ, vi xử lý Exynos 1480 có GPU kiến trúc AMD cùng bảo mật cấp độ phần cứng Samsung Knox Vault.',
      [
        'Màn hình: 6.6 inch Super AMOLED, FHD+, 120Hz, 1000 nits, Kính Gorilla Glass Victus+',
        'Chipset: Exynos 1480 8 nhân (4nm), đồ họa Xclipse 530 kiến trúc AMD RDNA2',
        'RAM: 8GB',
        'Bộ nhớ trong: 128GB / 256GB (hỗ trợ thẻ nhớ MicroSD lên đến 1TB)',
        'Camera sau: 50MP OIS khẩu độ f/1.8 + 12MP Góc siêu rộng + 5MP Macro',
        'Camera trước: 32MP làm đẹp tự nhiên',
        'Pin & Sạc: 5.000 mAh, sạc siêu nhanh 25W',
        'Tính năng: Khung viền kim loại vát phẳng, Chuẩn chống nước bụi IP67, Âm thanh vòm Dolby Atmos'
      ],
      '2026-08-01T09:00:00Z', true, [
        variant('VAR-SP004-NAVY-128', 'SP004', 'Xanh Navy', 8, 128, 9690000, 30),
        variant('VAR-SP004-ICE-256', 'SP004', 'Xanh Băng Iceblue', 8, 256, 10690000, 20),
        variant('VAR-SP004-LILAC-128', 'SP004', 'Tím Lilac', 8, 128, 9690000, 15)
      ],
      'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-a55.png'),

    // --- Xiaomi Line-up -------------------------------------------------------
    product('SP003', 'Xiaomi 14', 'Xiaomi',
      'Tuyệt tác thiết kế nhỏ gọn với ống kính quang học Leica Summilux đỉnh cao, chip Snapdragon 8 Gen 3 bứt phá hiệu năng, màn hình AMOLED 1.5K 120Hz và công nghệ sạc siêu tốc HyperCharge 90W.',
      [
        'Màn hình: 6.36 inch AMOLED C8, độ phân giải 1.5K, LTPO 1-120Hz thích ứng, 3000 nits',
        'Chipset: Qualcomm Snapdragon 8 Gen 3 (4nm), hệ thống tản nhiệt vòng lặp IceLoop độc quyền',
        'RAM: 12GB LPDDR5X',
        'Bộ nhớ trong: 256GB / 512GB UFS 4.0',
        'Camera sau: Hệ thống 3 ống kính Leica 50MP: Cảm biến chính Light Fusion 900 OIS, Tele 75mm OIS, Siêu rộng 115°',
        'Camera trước: 32MP HDR, quay video 4K',
        'Pin & Sạc: 4.610 mAh, Sạc nhanh có dây 90W (đầy 100% trong 31 phút), sạc không dây 50W',
        'Tính năng: Kháng nước IP68, Hệ điều hành Xiaomi HyperOS mượt mà, Cổng hồng ngoại điều khiển'
      ],
      '2026-08-05T09:00:00Z', true, [
        variant('VAR-SP003-GREEN-256', 'SP003', 'Xanh Ngọc Bích', 12, 256, 17990000, 25),
        variant('VAR-SP003-BLACK-256', 'SP003', 'Đen Nhám', 12, 256, 17990000, 20),
        variant('VAR-SP003-WHITE-512', 'SP003', 'Trắng Tuyết', 12, 512, 19990000, 15)
      ],
      'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14_1__1.png'),

    product('SP010', 'Xiaomi 14 Ultra', 'Xiaomi',
      'Đỉnh cao nhiếp ảnh di động chuyên nghiệp với cảm biến 1 inch Sony LYT-900 thay đổi khẩu độ vô cấp f/1.63 - f/4.0, cụm 4 camera Leica 50MP toàn dải tiêu cự và khung nhôm nguyên khối siêu cứng vững.',
      [
        'Màn hình: 6.73 inch LTPO AMOLED WQHD+, 120Hz thích ứng, 3000 nits, Kính Xiaomi Shield Glass',
        'Chipset: Snapdragon 8 Gen 3, công nghệ làm mát kênh đôi LiquidCool tản nhiệt tức thì',
        'RAM: 16GB LPDDR5X',
        'Bộ nhớ trong: 512GB UFS 4.0',
        'Camera sau: 4 camera Leica 50MP: Cảm biến 1-inch LYT-900 khẩu độ vô cấp + Tele 75mm 3.2x + Tiềm vọng 120mm 5x + Siêu rộng 12mm',
        'Camera trước: 32MP khẩu độ f/2.0, quay video 4K 60fps',
        'Pin & Sạc: 5.000 mAh, sạc nhanh HyperCharge 90W, sạc không dây 80W (đầy trong 46 phút)',
        'Tính năng: Bộ phụ kiện nhiếp ảnh báng tay cầm chuyên nghiệp, Chuẩn IP68, Dolby Vision HDR'
      ],
      '2026-09-15T09:00:00Z', true, [
        variant('VAR-SP010-BLACK-512', 'SP010', 'Đen Da Thuần Chay', 16, 512, 29990000, 14),
        variant('VAR-SP010-WHITE-512', 'SP010', 'Trắng Gốm', 16, 512, 29990000, 10)
      ],
      'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-ultra.png'),

    product('SP011', 'Xiaomi 18 Ultra', 'Xiaomi',
      'Flagship công nghệ tương lai mang tính biểu tượng kết hợp Snapdragon 8 Elite quy trình 3nm, cảm biến máy ảnh Leica Quad-Matrix 200MP, pin Silicon-Carbon 6.000 mAh và sạc thần tốc 120W HyperCharge.',
      [
        'Màn hình: 6.8 inch 2K LTPO AMOLED 144Hz, Độ sâu màu 12-bit, 3200 nits, Kính Ceramic Glass 2',
        'Chipset: Snapdragon 8 Elite (3nm), CPU Oryon lõi kép 4.32GHz + 6 lõi hiệu năng cao',
        'RAM: 16GB LPDDR5X',
        'Bộ nhớ trong: 512GB / 1TB UFS 4.1',
        'Camera sau: Cụm 4 camera Leica: Cảm biến chính 50MP thế hệ mới + 200MP Tiềm vọng Zoom quang 10x (Zoom số 120x) + 50MP Chân dung + 50MP Siêu rộng',
        'Camera trước: 32MP AI Eye Autofocus',
        'Pin & Sạc: 6.000 mAh Silicon-Carbon, Sạc siêu tốc 120W (đầy trong 19 phút), sạc không dây 80W',
        'Tính năng: Vỏ gốm Nano siêu bền, Trợ lý AI HyperOS 2 thông minh, Chuẩn IP68/IP69K'
      ],
      '2026-09-18T09:00:00Z', true, [
        variant('VAR-SP011-CERAMIC-512', 'SP011', 'Trắng Gốm Nano', 16, 512, 33990000, 16),
        variant('VAR-SP011-PHANTOM-1TB', 'SP011', 'Đen Phantom Titan', 16, 1024, 38990000, 8)
      ],
      'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-ultra.png'),

    product('SP006', 'Redmi Note 13 Pro 5G', 'Xiaomi',
      'Vua phân khúc tầm trung với camera độ phân giải siêu nét 200MP OIS, màn hình 1.5K CrystalRes AMOLED 120Hz tuyệt đẹp, chip Snapdragon 7s Gen 2 mạnh mẽ và sạc nhanh turbo 67W.',
      [
        'Màn hình: 6.67 inch AMOLED 1.5K (2712 x 1220), 120Hz, 1800 nits, Kính Gorilla Glass Victus',
        'Chipset: Qualcomm Snapdragon 7s Gen 2 (4nm)',
        'RAM: 8GB',
        'Bộ nhớ trong: 128GB / 256GB',
        'Camera sau: 200MP chống rung quang học OIS + 8MP Góc siêu rộng + 2MP Macro',
        'Camera trước: 16MP sắc nét',
        'Pin & Sạc: 5.100 mAh, sạc nhanh Turbo 67W (đầy 100% trong 44 phút)',
        'Tính năng: Cảm biến vân tay dưới màn hình, Loa kép Dolby Atmos, Chuẩn kháng bụi nước IP54'
      ],
      '2026-07-20T09:00:00Z', true, [
        variant('VAR-SP006-BLACK-128', 'SP006', 'Đen Bán Dạ', 8, 128, 7990000, 40),
        variant('VAR-SP006-BLUE-256', 'SP006', 'Xanh Biển Sâu', 8, 256, 8690000, 25)
      ],
      'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/r/e/redmi-note-13-pro.png'),

    product('SP007', 'iPhone SE 2022', 'Apple',
      'Dòng iPhone truyền thống với nút Home Touch ID và kích thước bỏ túi (sản phẩm lưu kho, ẩn khỏi mặt tiền cửa hàng).',
      [
        'Màn hình: 4.7" Retina HD, 60Hz',
        'Chipset: Apple A15 Bionic (5nm)',
        'Pin: 2.018 mAh',
        'Camera: 12MP Wide',
        'Kết nối: 5G'
      ],
      '2026-06-01T09:00:00Z', false, [
        variant('VAR-SP007-BLACK-64', 'SP007', 'Midnight', 4, 64, 11990000, 2)
      ],
      'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png')
  ];

  const coupons = [
    { code: 'SALE10', type: 'percent', value: 10, description: 'Giảm 10% tổng giá trị đơn hàng.' },
    { code: 'GIAM50K', type: 'fixed', value: 50000, description: 'Giảm trực tiếp 50.000 VNĐ cho đơn hàng.' }
  ];

  const orders = [
    { id: 'ORD-A1B2C3', userId: 'U002', fullName: 'Maria Nguyen', phone: '0912000002',
      address: '221B Baker Street, Hanoi 10001', paymentMethod: 'bank', status: 'Completed',
      createdAt: '2026-08-20T10:30:00Z',
      items: [line('SP003', 'Xiaomi 14', 'VAR-SP003-GREEN-256', 'Xanh Ngọc Bích', 12, 256, 17990000, 2)],
      subtotal: 35980000, couponCode: 'SALE10', discount: 3598000, grandTotal: 32382000 },
    { id: 'ORD-D4E5F6', userId: 'U002', fullName: 'Maria Nguyen', phone: '0912000002',
      address: '221B Baker Street, Hanoi 10001', paymentMethod: 'cod', status: 'Shipping',
      createdAt: '2026-08-21T14:00:00Z',
      items: [line('SP005', 'iPhone 15', 'VAR-SP005-MID-128', 'Đen Midnight', 6, 128, 19490000, 1)],
      subtotal: 19490000, couponCode: null, discount: 0, grandTotal: 19490000 },
    { id: 'ORD-G7H8I9', userId: 'U003', fullName: 'Anna Le', phone: '0912000003',
      address: '4 Rue Violette, Hanoi 10002', paymentMethod: 'bank', status: 'Cancelled',
      createdAt: '2026-08-18T09:15:00Z',
      items: [line('SP001', 'iPhone 16 Pro', 'VAR-SP001-SILVER-256', 'Titan Tự Nhiên', 8, 256, 31990000, 1)],
      subtotal: 31990000, couponCode: null, discount: 0, grandTotal: 31990000 }
  ];

  return { users, products, coupons, orders, sessions: {} };
}

function getState() {
  if (!state) state = buildSeed();
  if (!state.sessions) state.sessions = {};
  return state;
}

function resetDatabase() {
  const keepSessions = state && state.sessions ? state.sessions : {};
  state = buildSeed();
  state.sessions = keepSessions;
  return state;
}

const reset = resetDatabase;

function findVariant(variantId) {
  for (const p of getState().products) {
    const v = (p.variants || []).find((x) => x.id === variantId);
    if (v) return v;
  }
  return null;
}

function publicUser(u) {
  if (!u) return null;
  return { id: u.id, fullName: u.fullName, email: u.email, phone: u.phone, role: u.role };
}

function generateOrderId() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  let suffix = '';
  for (let i = 0; i < 6; i += 1) {
    suffix += alphabet[crypto.randomBytes(1)[0] % alphabet.length];
  }
  return 'ORD-' + suffix;
}

module.exports = {
  get state() { return getState(); },
  getState,
  resetDatabase,
  reset,
  buildSeed,
  findVariant,
  publicUser,
  generateOrderId
};
