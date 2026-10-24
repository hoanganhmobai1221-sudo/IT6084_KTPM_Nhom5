'use strict';
// =============================================================================
// PhoneStore – Master Product Seed Data
// 100% Local Product Images Stored in public/images/products/
// Total Products: 20 products (19 active + 1 soft-deleted test fixture)
// =============================================================================

const SEED_PRODUCTS = [
  {
    "id": "SP001",
    "name": "iPhone 16 Pro",
    "slug": "iphone-16-pro",
    "brand": "Apple",
    "description": "Đột phá với chip Apple A18 Pro tiến trình 3nm, nút Điều khiển Camera (Camera Control) mới, khung Titan tự nhiên đẳng cấp cùng hệ thống camera Pro 48MP Fusion bắt trọn mọi khoảnh khắc đỉnh cao.",
    "specs": "[\"Màn hình: 6.3 inch Super Retina XDR OLED, 120Hz ProMotion, 2000 nits, Dynamic Island\",\"Chipset: Apple A18 Pro (3nm), CPU 6 lõi, GPU 6 lõi, Neural Engine 16 lõi\",\"RAM: 8GB\",\"Bộ nhớ trong: 128GB / 256GB / 512GB / 1TB NVMe\",\"Camera sau: Chính 48MP Fusion OIS + Góc siêu rộng 48MP + Tele 12MP zoom quang 5x\",\"Camera trước: 12MP TrueDepth, tự động lấy nét, quay 4K 60fps Dolby Vision\",\"Pin & Sạc: 3.582 mAh, sạc nhanh không dây MagSafe 25W, sạc dây 50% trong 30 phút\",\"Tính năng: Nút Camera Control chuyên nghiệp, Apple Intelligence, Khung Titan chuẩn IP68\"]",
    "specDetails": "{\"Màn hình\":\"6.3\\\" Super Retina XDR OLED, 120Hz ProMotion, 2000 nits\",\"Thiết kế\":\"Khung Titan cấp 5, Kính Ceramic Shield thế hệ mới, IP68\",\"Chipset\":\"Apple A18 Pro (3nm), CPU 6 lõi, GPU 6 lõi, Neural Engine 16 lõi\",\"RAM\":\"8 GB\",\"Bộ nhớ trong\":\"128 GB / 256 GB / 512 GB / 1 TB\",\"Camera\":\"48MP Fusion OIS + 48MP Siêu rộng + 12MP Tele 5x, nút Camera Control\",\"Pin & Sạc\":\"3.582 mAh · Sạc không dây MagSafe 25W · Sạc nhanh 50% trong 30p\",\"Hệ điều hành\":\"iOS 18 (Apple Intelligence)\"}",
    "promotions": "[\"Thu cũ đổi mới trợ giá đến 3.000.000₫\",\"Tặng gói bảo hành rơi vỡ vào nước 12 tháng\",\"Trả góp 0% lãi suất qua thẻ tín dụng và công ty tài chính\"]",
    "originalPrice": 32990000,
    "active": 1,
    "createdAt": "2026-09-20T09:00:00Z",
    "image_url": "/images/products/iphone16-pro-titan-samac.png",
    "images": "[\"/images/products/iphone16-pro-titan-samac.png\",\"/images/products/iphone16-pro-titan-tunhien.png\",\"/images/products/iphone16-pro-titan-den.png\",\"/images/products/iphone16-pro-vang-gold.png\"]",
    "variants": [
      {
        "id": "VAR-SP001-DESERT-128",
        "color": "Titan Sa Mạc",
        "storage": "128GB",
        "ram": 8,
        "rom": 128,
        "price": 28990000,
        "stock": 15,
        "imageUrl": "/images/products/iphone16-pro-titan-samac.png"
      },
      {
        "id": "VAR-SP001-SILVER-256",
        "color": "Titan Tự Nhiên",
        "storage": "256GB",
        "ram": 8,
        "rom": 256,
        "price": 31990000,
        "stock": 12,
        "imageUrl": "/images/products/iphone16-pro-titan-tunhien.png"
      },
      {
        "id": "VAR-SP001-BLACK-512",
        "color": "Titan Đen",
        "storage": "512GB",
        "ram": 8,
        "rom": 512,
        "price": 37990000,
        "stock": 8,
        "imageUrl": "/images/products/iphone16-pro-titan-den.png"
      },
      {
        "id": "VAR-SP001-GOLD-1TB",
        "color": "Vàng Gold",
        "storage": "1TB",
        "ram": 8,
        "rom": 1024,
        "price": 43990000,
        "stock": 0,
        "imageUrl": "/images/products/iphone16-pro-vang-gold.png"
      }
    ]
  },
  {
    "id": "SP002",
    "name": "Samsung Galaxy S24 Ultra",
    "slug": "samsung-galaxy-s24-ultra",
    "brand": "Samsung",
    "description": "Tuyệt tác công nghệ Galaxy AI với màn hình phẳng 6.8 inch Dynamic AMOLED 2X sắc nét, khung viền Titan chuẩn hàng không, bút S-Pen tích hợp và camera mắt thần bóng đêm 200MP zoom quang 100x.",
    "specs": "[\"Màn hình: 6.8 inch Dynamic AMOLED 2X, QHD+, 1-120Hz, 2600 nits, kính Corning Gorilla Armor chống lóa\",\"Chipset: Snapdragon 8 Gen 3 for Galaxy (4nm), buồng tản nhiệt hơi lớn hơn 1.9 lần\",\"RAM: 12GB\",\"Bộ nhớ trong: 256GB / 512GB / 1TB UFS 4.0\",\"Camera sau: 200MP OIS + 50MP Zoom quang 5x (10x Optical quality) + 12MP Siêu rộng + 10MP Zoom quang 3x\",\"Camera trước: 12MP Dual Pixel AF, HDR tự động\",\"Pin & Sạc: 5.000 mAh, sạc nhanh 45W, sạc không dây 15W, sạc ngược PowerShare\",\"Tính năng: Quyền năng Galaxy AI, Khoanh tròn để tìm kiếm, Khung viền Titan, Bút S-Pen tích hợp\"]",
    "specDetails": "{\"Màn hình\":\"6.8\\\" Dynamic AMOLED 2X QHD+, 1-120Hz, 2600 nits, kính Gorilla Armor\",\"Thiết kế\":\"Khung viền Titan chuẩn hàng không, Kính chống lóa cao cấp, Kháng nước IP68\",\"Chipset\":\"Snapdragon 8 Gen 3 for Galaxy (4nm) tối ưu AI vượt trội\",\"RAM\":\"12 GB\",\"Bộ nhớ trong\":\"256 GB / 512 GB / 1 TB UFS 4.0\",\"Camera\":\"Mắt thần 200MP OIS + 50MP Zoom quang 5x + 12MP Siêu rộng\",\"Pin & Sạc\":\"5.000 mAh · Sạc siêu nhanh 45W · Sạc không dây tiện lợi\",\"Hệ điều hành\":\"One UI 6.1 (Android 14) với 7 năm cập nhật hệ điều hành\"}",
    "promotions": "[\"Tặng bao da kèm bút S-Pen chính hãng Samsung trị giá 1.500.000₫\",\"Thu cũ đổi mới trợ giá ngay 3.000.000₫\",\"Giảm 50% khi mua kèm phụ kiện củ sạc 45W chính hãng\"]",
    "originalPrice": 33990000,
    "active": 1,
    "createdAt": "2026-09-18T09:00:00Z",
    "image_url": "/images/products/samsung-s24-ultra.png",
    "images": "[\"/images/products/samsung-s24-ultra.png\",\"/images/products/s24-ultra-xam-titan.png\",\"/images/products/s24-ultra-den-titan.png\",\"/images/products/s24-ultra-vang-titan.png\",\"/images/products/s24-ultra-real.jpg\"]",
    "variants": [
      {
        "id": "VAR-SP002-GRAY-256",
        "color": "Xám Titan",
        "storage": "256GB",
        "ram": 12,
        "rom": 256,
        "price": 29990000,
        "stock": 14,
        "imageUrl": "/images/products/s24-ultra-xam-titan.png"
      },
      {
        "id": "VAR-SP002-BLACK-512",
        "color": "Đen Titan",
        "storage": "512GB",
        "ram": 12,
        "rom": 512,
        "price": 34990000,
        "stock": 10,
        "imageUrl": "/images/products/s24-ultra-den-titan.png"
      },
      {
        "id": "VAR-SP002-YELLOW-1TB",
        "color": "Vàng Titan",
        "storage": "1TB",
        "ram": 12,
        "rom": 1024,
        "price": 41990000,
        "stock": 5,
        "imageUrl": "/images/products/s24-ultra-vang-titan.png"
      }
    ]
  },
  {
    "id": "SP003",
    "name": "Xiaomi 14",
    "slug": "xiaomi-14",
    "brand": "Xiaomi",
    "description": "Flagship nhỏ gọn đỉnh cao nhất phân khúc với ống kính quang học Leica Summilux cao cấp, vi xử lý Snapdragon 8 Gen 3 tiến trình 4nm và màn hình AMOLED CrystalRes 1.5K 120Hz.",
    "specs": "[\"Màn hình: 6.36 inch OLED LTPO 1.5K (1200 x 2670), 1-120Hz, 3000 nits, Dolby Vision, HDR10+\",\"Chipset: Qualcomm Snapdragon 8 Gen 3 (4nm), hệ thống tản nhiệt IceLoop vòng lặp thông minh\",\"RAM: 12GB LPDDR5X\",\"Bộ nhớ trong: 256GB / 512GB UFS 4.0\",\"Camera sau: Hệ thống 3 camera Leica 50MP: Cảm biến Light Fusion 900 OIS + Tele 75mm OIS + Góc siêu rộng 115 độ\",\"Camera trước: 32MP góc rộng, quay phim 4K 60fps\",\"Pin & Sạc: 4.610 mAh, sạc nhanh có dây HyperCharge 90W (đầy 100% trong 31 phút), sạc không dây 50W\",\"Tính năng: Kháng nước kháng bụi IP68, Hệ điều hành Xiaomi HyperOS mượt mà thông minh\"]",
    "specDetails": "{\"Màn hình\":\"6.36\\\" OLED LTPO 1.5K, 1-120Hz, 3000 nits độ sáng tối đa\",\"Thiết kế\":\"Khung viền nhôm tinh xảo, Mặt kính lưng cong 3D, Chuẩn IP68\",\"Chipset\":\"Snapdragon 8 Gen 3 (4nm) cực đại hiệu năng gaming\",\"RAM\":\"12 GB LPDDR5X\",\"Bộ nhớ trong\":\"256 GB / 512 GB UFS 4.0 siêu tốc\",\"Camera\":\"Ống kính quang học Leica Summilux 50MP OIS + Telephoto Leica 75mm\",\"Pin & Sạc\":\"4.610 mAh · Sạc HyperCharge 90W (31 phút đầy pin) · Sạc không dây 50W\",\"Hệ điều hành\":\"Xiaomi HyperOS (Android 14)\"}",
    "promotions": "[\"Giảm trực tiếp 2.500.000₫ vào giá máy\",\"Bảo hành chính hãng 24 tháng cao cấp\",\"Tặng gói bảo hiểm rơi vỡ màn hình trong 6 tháng\"]",
    "originalPrice": 22990000,
    "active": 1,
    "createdAt": "2026-09-15T09:00:00Z",
    "image_url": "/images/products/xiaomi14-real.jpg",
    "images": "[\"/images/products/xiaomi14-real.jpg\",\"/images/products/xiaomi14-xanh-ngoc.png\",\"/images/products/xiaomi14-den-nham.png\",\"/images/products/xiaomi14-trang-tuyet.png\"]",
    "variants": [
      {
        "id": "VAR-SP003-GREEN-256",
        "color": "Xanh Ngọc",
        "storage": "256GB",
        "ram": 12,
        "rom": 256,
        "price": 19990000,
        "stock": 16,
        "imageUrl": "/images/products/xiaomi14-xanh-ngoc.png"
      },
      {
        "id": "VAR-SP003-BLACK-512",
        "color": "Đen Nhám",
        "storage": "512GB",
        "ram": 12,
        "rom": 512,
        "price": 22490000,
        "stock": 11,
        "imageUrl": "/images/products/xiaomi14-den-nham.png"
      }
    ]
  },
  {
    "id": "SP004",
    "name": "Samsung Galaxy A55 5G",
    "slug": "samsung-galaxy-a55-5g",
    "brand": "Samsung",
    "description": "Thiết kế kim loại cao cấp đầu tiên trên dòng Galaxy A, màn hình Super AMOLED 120Hz rực rỡ, chip Exynos 1480 đồ họa AMD và camera chụp đêm xuất sắc với chống rung OIS.",
    "specs": "[\"Màn hình: 6.6 inch Super AMOLED FHD+, 120Hz, Vision Booster 1000 nits, kính cường lực Gorilla Glass Victus+\",\"Chipset: Exynos 1480 (4nm) 8 nhân, GPU Xclipse 530 kiến trúc AMD RDNA\",\"RAM: 8GB\",\"Bộ nhớ trong: 128GB / 256GB, hỗ trợ thẻ nhớ microSD đến 1TB\",\"Camera sau: 50MP OIS + 12MP Siêu rộng + 5MP Chụp macro\",\"Camera trước: 32MP chụp selfie chi tiết cao\",\"Pin & Sạc: 5.000 mAh, sạc nhanh 25W, kháng nước kháng bụi chuẩn IP67\",\"Tính năng: Khung viền kim loại sang trọng, Samsung Knox Vault bảo mật phần cứng\"]",
    "specDetails": "{\"Màn hình\":\"6.6\\\" Super AMOLED, 120Hz, FHD+, Vision Booster, Kính Gorilla Glass Victus+\",\"Thiết kế\":\"Khung viền kim loại vát phẳng, Mặt lưng kính cao cấp, Chuẩn IP67\",\"Chipset\":\"Exynos 1480 (4nm) kết hợp GPU AMD Xclipse 530\",\"RAM\":\"8 GB\",\"Bộ nhớ trong\":\"128 GB / 256 GB (Hỗ trợ thẻ nhớ ngoài)\",\"Camera\":\"50MP OIS bắt nét nhanh + 12MP Góc siêu rộng + 5MP Macro cận cảnh\",\"Pin & Sạc\":\"5.000 mAh dùng đến 2 ngày · Sạc siêu tốc 25W\",\"Hệ điều hành\":\"One UI 6.1 (Android 14)\"}",
    "promotions": "[\"Tặng gói bảo hành Samsung Care+ 6 tháng\",\"Giảm 300.000₫ khi mua kèm tai nghe Galaxy Buds FE\"]",
    "originalPrice": 10990000,
    "active": 1,
    "createdAt": "2026-09-10T09:00:00Z",
    "image_url": "/images/products/galaxy-a55-real.jpg",
    "images": "[\"/images/products/galaxy-a55-real.jpg\",\"/images/products/galaxy-a55-xanh-navy.png\",\"/images/products/galaxy-a55-xanh-bang.png\",\"/images/products/galaxy-a55-tim-lilac.png\"]",
    "variants": [
      {
        "id": "VAR-SP004-NAVY-128",
        "color": "Xanh Navy",
        "storage": "128GB",
        "ram": 8,
        "rom": 128,
        "price": 9690000,
        "stock": 30,
        "imageUrl": "/images/products/galaxy-a55-xanh-navy.png"
      },
      {
        "id": "VAR-SP004-ICE-128",
        "color": "Xanh Băng",
        "storage": "128GB",
        "ram": 8,
        "rom": 128,
        "price": 9690000,
        "stock": 25,
        "imageUrl": "/images/products/galaxy-a55-xanh-bang.png"
      },
      {
        "id": "VAR-SP004-LILAC-256",
        "color": "Tím Lilac",
        "storage": "256GB",
        "ram": 8,
        "rom": 256,
        "price": 10690000,
        "stock": 18,
        "imageUrl": "/images/products/galaxy-a55-tim-lilac.png"
      }
    ]
  },
  {
    "id": "SP005",
    "name": "iPhone 15",
    "slug": "iphone-15",
    "brand": "Apple",
    "description": "Sở hữu màn hình Dynamic Island thời thượng, camera chính 48MP bắt nét siêu sắc nét với zoom 2x quang học, cổng kết nối Type-C tiêu chuẩn và mặt kính pha màu mờ ấn tượng.",
    "specs": "[\"Màn hình: 6.1 inch Super Retina XDR OLED, Dynamic Island, 2000 nits ngoài trời\",\"Chipset: Apple A16 Bionic (4nm), CPU 6 lõi, GPU 5 lõi, Neural Engine 16 lõi\",\"RAM: 6GB\",\"Bộ nhớ trong: 128GB / 256GB / 512GB\",\"Camera sau: Camera kép: Chính 48MP OIS Sensor-shift + Góc siêu rộng 12MP\",\"Camera trước: 12MP TrueDepth, tự động lấy nét Focus Pixels\",\"Pin & Sạc: 3.349 mAh, chuẩn sạc USB-C mới, sạc MagSafe 15W\",\"Tính năng: Dynamic Island tương tác linh hoạt, Mặt kính pha màu mờ chống bám vân tay\"]",
    "specDetails": "{\"Màn hình\":\"6.1\\\" Super Retina XDR OLED, Dynamic Island, 2000 nits đỉnh\",\"Thiết kế\":\"Khung nhôm chuẩn hàng không, Mặt lưng kính pha màu, Kháng nước IP68\",\"Chipset\":\"Apple A16 Bionic (4nm) tiến trình mạnh mẽ\",\"RAM\":\"6 GB\",\"Bộ nhớ trong\":\"128 GB / 256 GB / 512 GB\",\"Camera\":\"48MP thế hệ mới zoom quang học 2x + 12MP Góc siêu rộng\",\"Pin & Sạc\":\"3.349 mAh · Cổng sạc chuẩn USB-C thông dụng\",\"Hệ điều hành\":\"iOS 18 chính hãng Apple\"}",
    "promotions": "[\"Giảm ngay 2.000.000₫ khi thanh toán qua thẻ tín dụng\",\"Tặng gói bảo hành tiêu chuẩn Apple VN/A 12 tháng\"]",
    "originalPrice": 22990000,
    "active": 1,
    "createdAt": "2026-09-12T09:00:00Z",
    "image_url": "/images/products/iphone15-real.jpg",
    "images": "[\"/images/products/iphone15-real.jpg\",\"/images/products/iphone15-den-midnight.png\",\"/images/products/iphone15-xanh-lam.png\",\"/images/products/iphone15-hong-pastel.png\"]",
    "variants": [
      {
        "id": "VAR-SP005-MID-128",
        "color": "Đen Midnight",
        "storage": "128GB",
        "ram": 6,
        "rom": 128,
        "price": 19490000,
        "stock": 22,
        "imageUrl": "/images/products/iphone15-den-midnight.png"
      },
      {
        "id": "VAR-SP005-BLUE-128",
        "color": "Xanh Lam",
        "storage": "128GB",
        "ram": 6,
        "rom": 128,
        "price": 19490000,
        "stock": 18,
        "imageUrl": "/images/products/iphone15-xanh-lam.png"
      },
      {
        "id": "VAR-SP005-PINK-256",
        "color": "Hồng Pastel",
        "storage": "256GB",
        "ram": 6,
        "rom": 256,
        "price": 22490000,
        "stock": 14,
        "imageUrl": "/images/products/iphone15-hong-pastel.png"
      }
    ]
  },
  {
    "id": "SP006",
    "name": "OPPO Find X7 Ultra",
    "slug": "oppo-find-x7-ultra",
    "brand": "OPPO",
    "description": "Tuyệt tác nhiếp ảnh di động hàng đầu thế giới với hệ thống bốn camera chính 50MP hợp tác Hasselblad, màn hình 2K Diamond Screen 4500 nits và chip Snapdragon 8 Gen 3 siêu tốc.",
    "specs": "[\"Màn hình: 6.82 inch LTPO OLED 2K (1440 x 3168), 1-120Hz, 4500 nits đỉnh, Dolby Vision, ProXDR\",\"Chipset: Qualcomm Snapdragon 8 Gen 3 (4nm), chip bảo mật chuyên biệt chuẩn quốc tế\",\"RAM: 16GB LPDDR5X\",\"Bộ nhớ trong: 256GB / 512GB UFS 4.0\",\"Camera sau: Hệ thống 4 camera 50MP Hasselblad: Cảm biến 1-inch LYT-900 OIS + Siêu rộng 50MP + Kép tiềm vọng 50MP (3x và 6x)\",\"Camera trước: 32MP f/2.4 selfie đỉnh cao quay 4K 60fps\",\"Pin & Sạc: 5.000 mAh, sạc nhanh SuperVOOC 100W (đầy trong 26 phút), sạc không dây AirVOOC 50W\",\"Tính năng: Kháng nước IP68, Công tắc gạt trạng thái VIP Mode bảo mật riêng tư tuyệt đối\"]",
    "specDetails": "{\"Màn hình\":\"6.82\\\" LTPO OLED 2K, 120Hz, 4500 nits, kính Gorilla Glass Victus 2\",\"Thiết kế\":\"Mặt lưng hai tông màu kết hợp da thuần chay và kính cao cấp, Chuẩn IP68\",\"Chipset\":\"Snapdragon 8 Gen 3 (4nm) kèm chip bảo mật độc lập\",\"RAM\":\"16 GB\",\"Bộ nhớ trong\":\"256 GB / 512 GB UFS 4.0\",\"Camera\":\"Quad-Camera Hasselblad 50MP với cảm biến 1-inch Sony LYT-900 OIS\",\"Pin & Sạc\":\"5.000 mAh · Sạc siêu nhanh SuperVOOC 100W · Sạc không dây 50W\",\"Hệ điều hành\":\"ColorOS 14 (Android 14)\"}",
    "promotions": "[\"Tặng gói bảo hành mở rộng toàn cầu 24 tháng\",\"Thu cũ trợ giá ngay 4.000.000₫\"]",
    "originalPrice": 26990000,
    "active": 1,
    "createdAt": "2026-09-08T09:00:00Z",
    "image_url": "/images/products/oppo-find-x7-real.jpg",
    "images": "[\"/images/products/oppo-find-x7-real.jpg\",\"/images/products/oppo-find-x7-nau.png\",\"/images/products/oppo-find-x7-xanh.png\",\"/images/products/oppo-find-x7-den.png\"]",
    "variants": [
      {
        "id": "VAR-SP006-BLUE-256",
        "color": "Xanh Đại Dương",
        "storage": "256GB",
        "ram": 16,
        "rom": 256,
        "price": 22990000,
        "stock": 12,
        "imageUrl": "/images/products/oppo-find-x7-xanh.png"
      },
      {
        "id": "VAR-SP006-GREEN-512",
        "color": "Xanh Rừng Sâu",
        "storage": "512GB",
        "ram": 16,
        "rom": 512,
        "price": 25990000,
        "stock": 8,
        "imageUrl": "/images/products/oppo-find-x7-nau.png"
      }
    ]
  },
  {
    "id": "SP007",
    "name": "iPhone SE 2022",
    "slug": "iphone-se-2022",
    "brand": "Apple",
    "description": "Thiết kế cổ điển với nút Home Touch ID quen thuộc, trang bị chip Apple A15 Bionic mạnh mẽ và kết nối 5G tốc độ cao trong thân máy nhỏ gọn 4.7 inch.",
    "specs": "[\"Màn hình: 4.7 inch Retina HD, True Tone, dải màu rộng P3, độ sáng 625 nits\",\"Chipset: Apple A15 Bionic (5nm), CPU 6 lõi, GPU 4 lõi, Neural Engine 16 lõi\",\"RAM: 4GB\",\"Bộ nhớ trong: 64GB\",\"Camera sau: 12MP Wide f/1.8, OIS, Smart HDR 4, Deep Fusion, Chụp chân dung Portrait Mode\",\"Camera trước: 7MP FaceTime HD f/2.2\",\"Pin & Sạc: 2.018 mAh, sạc nhanh 20W (50% trong 30 phút), sạc không dây chuẩn Qi\",\"Tính năng: Cảm biến vân tay Touch ID tiện lợi, Kháng nước chuẩn IP67\"]",
    "specDetails": "{\"Màn hình\":\"4.7\\\" Retina HD IPS LCD, 625 nits, Cảm biến vân tay Touch ID\",\"Thiết kế\":\"Khung nhôm kính cường lực hai mặt, Kháng nước kháng bụi IP67\",\"Chipset\":\"Apple A15 Bionic tiến trình 5nm mạnh mẽ\",\"RAM\":\"4 GB\",\"Bộ nhớ trong\":\"64 GB\",\"Camera\":\"12MP Wide f/1.8 OIS chống rung quang học, Smart HDR 4\",\"Pin & Sạc\":\"2.018 mAh · Hỗ trợ sạc nhanh 20W\",\"Hệ điều hành\":\"iOS 17\"}",
    "promotions": "[\"Giảm ngay 1.000.000₫ khi thanh toán trực tiếp\"]",
    "originalPrice": 11990000,
    "active": 0,
    "createdAt": "2026-06-01T09:00:00Z",
    "image_url": "/images/products/iphone-se-midnight.png",
    "images": "[\"/images/products/iphone-se-midnight.png\"]",
    "variants": [
      {
        "id": "VAR-SP007-BLACK-64",
        "color": "Midnight",
        "storage": "64GB",
        "ram": 4,
        "rom": 64,
        "price": 11990000,
        "stock": 2,
        "imageUrl": "/images/products/iphone-se-midnight.png"
      }
    ]
  },
  {
    "id": "SP008",
    "name": "iPhone 16 Pro Max",
    "slug": "iphone-16-pro-max",
    "brand": "Apple",
    "description": "Chiếc iPhone đỉnh cao nhất của Apple sở hữu màn hình Super Retina XDR 6.9 inch viền siêu mỏng, thời lượng pin lên đến 33 giờ, nút Camera Control và chip Apple A18 Pro uy lực vượt bậc.",
    "specs": "[\"Màn hình: 6.9 inch Super Retina XDR OLED, 120Hz ProMotion, 2000 nits\",\"Chipset: Apple A18 Pro (3nm), GPU 6 nhân tản nhiệt graphene\",\"RAM: 8GB\",\"Bộ nhớ trong: 256GB / 512GB / 1TB\",\"Camera sau: 48MP Fusion khẩu độ f/1.78 + 48MP Ultrawide + 12MP Telephoto 5x thế hệ mới\",\"Camera trước: 12MP TrueDepth, Photonic Engine, Smart HDR 5\",\"Pin & Sạc: 4.685 mAh, sạc MagSafe 25W, Qi2 15W, thời lượng xem video liên tục 33h\",\"Tính năng: Apple Intelligence, Khung viền Titan cấp 5, Quay video 4K 120fps điện ảnh\"]",
    "specDetails": "{\"Màn hình\":\"6.9\\\" Super Retina XDR OLED, 120Hz ProMotion, viền siêu mỏng\",\"Thiết kế\":\"Khung Titan cấp 5 siêu nhẹ, Kính Ceramic Shield chính hãng, IP68\",\"Chipset\":\"Apple A18 Pro (3nm), Tản nhiệt Graphene nâng cấp hiệu năng bền bỉ\",\"RAM\":\"8 GB\",\"Bộ nhớ trong\":\"256 GB / 512 GB / 1 TB\",\"Camera\":\"48MP Fusion 24mm + 48MP Góc siêu rộng + 12MP Tiềm vọng 5x thế hệ mới\",\"Pin & Sạc\":\"4.685 mAh · Xem video liên tục 33h · Sạc MagSafe 25W, Qi2 15W\",\"Hệ điều hành\":\"iOS 18 (Apple Intelligence đầy đủ)\"}",
    "promotions": "[\"Ưu đãi đặt trước tặng củ sạc nhanh 30W chính hãng Apple\",\"Thu cũ đổi mới trợ giá ngay 4.000.000₫\",\"Giảm thêm 1.000.000₫ khi thanh toán qua VNPay/ShopeePay\"]",
    "originalPrice": 37990000,
    "active": 1,
    "createdAt": "2026-09-22T09:00:00Z",
    "image_url": "/images/products/iphone16-promax.png",
    "images": "[\"/images/products/iphone16-promax.png\",\"/images/products/iphone16-promax-desert.png\",\"/images/products/iphone16-pro-max-titan-tunhien.png\",\"/images/products/iphone16-promax-black.png\"]",
    "variants": [
      {
        "id": "VAR-SP008-DESERT-256",
        "color": "Titan Sa Mạc",
        "storage": "256GB",
        "ram": 8,
        "rom": 256,
        "price": 34990000,
        "stock": 20,
        "imageUrl": "/images/products/iphone16-promax-desert.png"
      },
      {
        "id": "VAR-SP008-NATURAL-512",
        "color": "Titan Tự Nhiên",
        "storage": "512GB",
        "ram": 8,
        "rom": 512,
        "price": 40990000,
        "stock": 10,
        "imageUrl": "/images/products/iphone16-pro-max-titan-tunhien.png"
      },
      {
        "id": "VAR-SP008-BLACK-1TB",
        "color": "Titan Đen",
        "storage": "1TB",
        "ram": 8,
        "rom": 1024,
        "price": 46990000,
        "stock": 6,
        "imageUrl": "/images/products/iphone16-promax-black.png"
      }
    ]
  },
  {
    "id": "SP009",
    "name": "iPhone 18 Pro Max",
    "slug": "iphone-18-pro-max",
    "brand": "Apple",
    "description": "Dòng điện thoại cao cấp tương lai trang bị vi xử lý Apple A20 Pro quy trình 2nm tối tân, màn hình vô cực không khuyết điểm tích hợp Face ID dưới màn hình và buồng tản nhiệt chất lỏng siêu dẫn.",
    "specs": "[\"Màn hình: 6.9 inch Super Retina XDR 2.0 OLED, 1-144Hz ProMotion, 3500 nits, Face ID ẩn dưới màn hình\",\"Chipset: Apple A20 Pro (2nm GAA), 8 nhân CPU, 8 nhân GPU Ray Tracing thế hệ 3, Neural Engine 32 nhân\",\"RAM: 12GB Unified Memory\",\"Bộ nhớ trong: 512GB / 1TB / 2TB siêu tốc\",\"Camera sau: Hệ thống thấu kính quang học: 200MP Fusion OIS + 50MP Siêu rộng + 50MP Kép tiềm vọng zoom quang 10x\",\"Camera trước: 24MP ẩn dưới màn hình với thuật toán AI khử nhiễu lượng tử\",\"Pin & Sạc: 5.200 mAh công nghệ pin thể rắn, sạc MagSafe 45W, sạc dây 65W\",\"Tính năng: Apple Intelligence thế hệ 2 xử lý tác vụ ngoại tuyến, Khung hợp kim Titan-Carbide\"]",
    "specDetails": "{\"Màn hình\":\"6.9\\\" Màn hình tràn viền vô khuyết điểm, 144Hz, 3500 nits, Kính tinh thể Sapphire\",\"Thiết kế\":\"Khung hợp kim Titan-Carbide nguyên khối, Kháng nước sâu 10 mét IP69\",\"Chipset\":\"Apple A20 Pro tiến trình 2nm kiến trúc vi mô\",\"RAM\":\"12 GB Unified LPDDR6\",\"Bộ nhớ trong\":\"512 GB / 1 TB / 2 TB NVMe\",\"Camera\":\"200MP Thấu kính lỏng OIS + 50MP Góc siêu rộng + 50MP Tiềm vọng 10x quang\",\"Pin & Sạc\":\"5.200 mAh thể rắn · Sạc MagSafe 45W · Sạc dây 65W (70% trong 20 phút)\",\"Hệ điều hành\":\"iOS 20 với Siri AI Agents độc lập\"}",
    "promotions": "[\"Đặc quyền thành viên VIP nhận máy tại nhà kèm gói dịch vụ bảo hành kim cương 24 tháng\",\"Tặng đế sạc đôi MagSafe Duo 45W chính hãng Apple\"]",
    "originalPrice": 52990000,
    "active": 1,
    "createdAt": "2026-09-25T09:00:00Z",
    "image_url": "/images/products/iphone18-pro-max-cosmic-den.png",
    "images": "[\"/images/products/iphone18-pro-max-cosmic-den.png\",\"/images/products/iphone18-pro-max-titan-xam.png\",\"/images/products/iphone18-pro-max-frost-bac.png\"]",
    "variants": [
      {
        "id": "VAR-SP009-BLUE-512",
        "color": "Titan Xanh Biển",
        "storage": "512GB",
        "ram": 12,
        "rom": 512,
        "price": 44990000,
        "stock": 8,
        "imageUrl": "/images/products/iphone18-pro-max-titan-xam.png"
      },
      {
        "id": "VAR-SP009-WHITE-1TB",
        "color": "Titan Trắng Tuyết",
        "storage": "1TB",
        "ram": 12,
        "rom": 1024,
        "price": 52990000,
        "stock": 5,
        "imageUrl": "/images/products/iphone18-pro-max-frost-bac.png"
      }
    ]
  },
  {
    "id": "SP010",
    "name": "Xiaomi 14 Ultra",
    "slug": "xiaomi-14-ultra",
    "brand": "Xiaomi",
    "description": "Đỉnh cao nhiếp ảnh di động chuyên nghiệp hợp tác cùng Leica với cụm 4 camera 50MP, cảm biến 1 inch LYT-900, khẩu độ vô cấp mượt mà và màn hình AMOLED cong 2K 120Hz rực rỡ.",
    "specs": "[\"Màn hình: 6.73 inch LTPO AMOLED 2K (1440 x 3200), 120Hz, 3000 nits, Dolby Vision, HDR10+\",\"Chipset: Qualcomm Snapdragon 8 Gen 3 (4nm), buồng tản nhiệt hai kênh IceLoop riêng biệt\",\"RAM: 16GB LPDDR5X\",\"Bộ nhớ trong: 512GB / 1TB UFS 4.0\",\"Camera sau: 4 camera Leica 50MP: Cảm biến 1-inch LYT-900 OIS khẩu vô cấp f/1.63-f/4.0 + Tele 75mm OIS + Tiềm vọng 120mm OIS + Siêu rộng 122 độ\",\"Camera trước: 32MP làm đẹp AI, quay phim 4K 60fps\",\"Pin & Sạc: 5.000 mAh, sạc nhanh HyperCharge 90W (đầy 100% trong 33 phút), sạc không dây 80W\",\"Tính năng: Khung nhôm Guardian Structure siêu bền, Kính cường lực Xiaomi Shield Glass, Kháng nước IP68\"]",
    "specDetails": "{\"Màn hình\":\"6.73\\\" LTPO AMOLED 2K, 120Hz, 3000 nits, Kính Shield Glass\",\"Thiết kế\":\"Khung nhôm nguyên khối, Mặt lưng da công nghệ nano thế hệ 3, IP68\",\"Chipset\":\"Snapdragon 8 Gen 3 (4nm) tản nhiệt hai kênh siêu dẫn\",\"RAM\":\"16 GB\",\"Bộ nhớ trong\":\"512 GB / 1 TB UFS 4.0\",\"Camera\":\"Bộ tứ Leica 50MP: Cảm biến 1-inch LYT-900 khẩu độ vô cấp\",\"Pin & Sạc\":\"5.000 mAh · Sạc có dây 90W · Sạc không dây 80W đỉnh cao\",\"Hệ điều hành\":\"Xiaomi HyperOS (Android 14)\"}",
    "promotions": "[\"Tặng gói chụp ảnh Photography Kit cao cấp trị giá 3.990.000₫\",\"Bảo hành chính hãng 24 tháng cao cấp VIP\"]",
    "originalPrice": 32990000,
    "active": 1,
    "createdAt": "2026-09-21T09:00:00Z",
    "image_url": "/images/products/xiaomi-14-ultra.png",
    "images": "[\"/images/products/xiaomi-14-ultra.png\",\"/images/products/xiaomi14-ultra-white.png\",\"/images/products/xiaomi14-ultra-den.png\",\"/images/products/xiaomi14-ultra-trang.png\"]",
    "variants": [
      {
        "id": "VAR-SP010-BLACK-512",
        "color": "Đen Gốm",
        "storage": "512GB",
        "ram": 16,
        "rom": 512,
        "price": 29990000,
        "stock": 10,
        "imageUrl": "/images/products/xiaomi14-ultra-den.png"
      },
      {
        "id": "VAR-SP010-WHITE-512",
        "color": "Trắng Gốm",
        "storage": "512GB",
        "ram": 16,
        "rom": 512,
        "price": 29990000,
        "stock": 8,
        "imageUrl": "/images/products/xiaomi14-ultra-trang.png"
      }
    ]
  },
  {
    "id": "SP011",
    "name": "Xiaomi 18 Ultra",
    "slug": "xiaomi-18-ultra",
    "brand": "Xiaomi",
    "description": "Siêu phẩm đột phá thế hệ mới sở hữu thấu kính lỏng Leica zoom quang liên tục từ 3x đến 15x, màn hình phát quang OLED 4K siêu nét và công nghệ sạc thần tốc 120W.",
    "specs": "[\"Màn hình: 6.8 inch 4K OLED LTPO 3.0, 1-165Hz, độ sáng tối đa 4000 nits\",\"Chipset: Qualcomm Snapdragon 8 Gen 5 (2nm), bộ xử lý NPU lượng tử chuyên dụng\",\"RAM: 16GB / 24GB LPDDR6\",\"Bộ nhớ trong: 1TB / 2TB UFS 4.1\",\"Camera sau: 200MP Leica Master Vision OIS + 50MP Siêu rộng + 50MP Thấu kính lỏng zoom 15x liên tục\",\"Camera trước: 40MP chân dung tự nhiên thế hệ mới\",\"Pin & Sạc: 5.500 mAh Graphene thể rắn, sạc nhanh HyperCharge 120W (đầy trong 19 phút)\",\"Tính năng: Khung gốm Titan chống trầy xước cấp 9 Mohs, Chuẩn kháng bụi nước IP69K\"]",
    "specDetails": "{\"Màn hình\":\"6.8\\\" 4K OLED LTPO 3.0, 165Hz, 4000 nits, Kính Sapphire chống vỡ\",\"Thiết kế\":\"Khung gốm Titan nguyên khối, Chuẩn quân đội IP69K\",\"Chipset\":\"Snapdragon 8 Gen 5 (2nm) dẫn đầu thế giới AI\",\"RAM\":\"16 GB\",\"Bộ nhớ trong\":\"1 TB\",\"Camera\":\"200MP Leica Master Vision OIS + Thấu kính lỏng zoom quang 15x\",\"Pin & Sạc\":\"5.500 mAh Graphene · Sạc siêu tốc HyperCharge 120W (19 phút)\",\"Hệ điều hành\":\"Xiaomi HyperOS 3.0\"}",
    "promotions": "[\"Tặng gói bảo hành độc quyền VIP Care 36 tháng\",\"Hỗ trợ trả góp 0% lãi suất toàn bộ kỳ hạn\"]",
    "originalPrice": 42990000,
    "active": 1,
    "createdAt": "2026-09-26T09:00:00Z",
    "image_url": "/images/products/xiaomi18-ultra-den.png",
    "images": "[\"/images/products/xiaomi18-ultra-den.png\",\"/images/products/xiaomi18-ultra-trang.png\"]",
    "variants": [
      {
        "id": "VAR-SP011-WHITE-1TB",
        "color": "Trắng Pha Lê",
        "storage": "1TB",
        "ram": 16,
        "rom": 1024,
        "price": 38990000,
        "stock": 6,
        "imageUrl": "/images/products/xiaomi18-ultra-trang.png"
      },
      {
        "id": "VAR-SP011-BLACK-1TB",
        "color": "Đen Titan",
        "storage": "1TB",
        "ram": 16,
        "rom": 1024,
        "price": 38990000,
        "stock": 5,
        "imageUrl": "/images/products/xiaomi18-ultra-den.png"
      }
    ]
  },
  {
    "id": "SP012",
    "name": "Samsung Galaxy S26 Ultra",
    "slug": "samsung-galaxy-s26-ultra",
    "brand": "Samsung",
    "description": "Flagship tương lai của Samsung trang bị trí tuệ nhân tạo Galaxy AI 3.0, cảm biến camera ISOCELL 200MP thế hệ mới, màn hình Dynamic AMOLED 2X không phản chiếu và bút S-Pen cử chỉ không chạm.",
    "specs": "[\"Màn hình: 6.85 inch Dynamic AMOLED 2X, QHD+, 1-144Hz, 3200 nits, kính Corning Gorilla Armor 2\",\"Chipset: Snapdragon 8 Gen 5 for Galaxy (2nm GAA), GPU Ray Tracing thế hệ 4\",\"RAM: 16GB LPDDR6\",\"Bộ nhớ trong: 512GB / 1TB UFS 4.1\",\"Camera sau: 200MP ISOCELL OIS khẩu lớn + 50MP Góc siêu rộng + 50MP Zoom quang 5x + 50MP Tiềm vọng 10x\",\"Camera trước: 16MP Dual Pixel AF ẩn dưới màn hình\",\"Pin & Sạc: 5.400 mAh, sạc nhanh 65W, sạc không dây 25W, sạc ngược không dây\",\"Tính năng: Galaxy AI thế hệ mới tự động hóa hoàn toàn, Khung viền Titan cấp 5, Bút S-Pen tích hợp\"]",
    "specDetails": "{\"Màn hình\":\"6.85\\\" Dynamic AMOLED 2X QHD+, 144Hz, 3200 nits, kính Gorilla Armor 2\",\"Thiết kế\":\"Khung viền Titan cấp 5 vát phẳng, Mặt lưng kính mờ cao cấp, Chuẩn IP68\",\"Chipset\":\"Snapdragon 8 Gen 5 for Galaxy (2nm GAA) dẫn đầu hiệu năng\",\"RAM\":\"16 GB\",\"Bộ nhớ trong\":\"512 GB / 1 TB UFS 4.1\",\"Camera\":\"200MP ISOCELL OIS + 50MP Siêu rộng + Kép tiềm vọng 50MP zoom 100x AI\",\"Pin & Sạc\":\"5.400 mAh · Sạc siêu tốc 65W · Sạc không dây nhanh 25W\",\"Hệ điều hành\":\"One UI 8.0 (Android 16)\"}",
    "promotions": "[\"Tặng gói bảo hành Samsung Care+ toàn diện 24 tháng\",\"Giảm trực tiếp 3.000.000₫ cho khách hàng lên đời máy cũ\"]",
    "originalPrice": 42990000,
    "active": 1,
    "createdAt": "2026-09-27T09:00:00Z",
    "image_url": "/images/products/s26-ultra-titanium.png",
    "images": "[\"/images/products/s26-ultra-titanium.png\",\"/images/products/s26-ultra-phantom-titanium.png\",\"/images/products/s26-ultra-silver-titanium.png\"]",
    "variants": [
      {
        "id": "VAR-SP012-BLACK-512",
        "color": "Phantom Đen",
        "storage": "512GB",
        "ram": 16,
        "rom": 512,
        "price": 38990000,
        "stock": 7,
        "imageUrl": "/images/products/s26-ultra-phantom-titanium.png"
      },
      {
        "id": "VAR-SP012-SILVER-1TB",
        "color": "Silver Bạc",
        "storage": "1TB",
        "ram": 16,
        "rom": 1024,
        "price": 44990000,
        "stock": 4,
        "imageUrl": "/images/products/s26-ultra-silver-titanium.png"
      }
    ]
  },
  {
    "id": "SP013",
    "name": "Samsung Galaxy A35 5G",
    "slug": "samsung-galaxy-a35-5g",
    "brand": "Samsung",
    "description": "Samsung Galaxy A35 5G với thiết kế mặt lưng kính cao cấp, màn hình Super AMOLED 120Hz Infinity-O, camera 50MP chống rung OIS và bảo mật phần cứng Samsung Knox Vault.",
    "specs": "[\"Màn hình: 6.6 inch Super AMOLED FHD+ (1080 x 2340), 120Hz, 1000 nits HBM, Vision Booster, Kính Gorilla Glass Victus+\",\"Chipset: Exynos 1380 (5nm) 8 nhân, GPU Mali-G68 MP5\",\"RAM: 8GB\",\"Bộ nhớ trong: 128GB / 256GB, hỗ trợ thẻ nhớ microSD đến 1TB\",\"Camera sau: 50MP OIS f/1.8 + 8MP Góc siêu rộng + 5MP Chụp cận macro\",\"Camera trước: 13MP f/2.2 selfie sắc nét\",\"Pin & Sạc: 5.000 mAh, sạc nhanh 25W, kháng nước kháng bụi chuẩn IP67\",\"Tính năng: Bảo mật phần cứng Samsung Knox Vault, Cập nhật 4 phiên bản OS và 5 năm bảo mật\"]",
    "specDetails": "{\"Màn hình\":\"6.6\\\" Super AMOLED FHD+, 120Hz, 1000 nits, Kính Gorilla Glass Victus+\",\"Thiết kế\":\"Mặt lưng kính bóng bẩy sang trọng, Viền Key Island nổi bật, Chuẩn IP67\",\"Chipset\":\"Exynos 1380 (5nm) 8 nhân đa nhiệm mượt mà\",\"RAM\":\"8 GB\",\"Bộ nhớ trong\":\"128 GB / 256 GB (Hỗ trợ thẻ nhớ ngoài 1TB)\",\"Camera\":\"50MP OIS chống rung quang học + 8MP Siêu rộng + 5MP Macro\",\"Pin & Sạc\":\"5.000 mAh dùng cả ngày dài · Sạc nhanh 25W\",\"Hệ điều hành\":\"One UI 6.1 (Android 14)\"}",
    "promotions": "[\"Tặng gói bảo hành Samsung Care+ 6 tháng\",\"Giảm 300.000₫ khi thanh toán qua thẻ ngân hàng\"]",
    "originalPrice": 8790000,
    "active": 1,
    "createdAt": "2026-09-28T09:00:00Z",
    "image_url": "/images/products/samsung-galaxy-a35-navy.png",
    "images": "[\"/images/products/samsung-galaxy-a35-navy.png\",\"/images/products/samsung-galaxy-a35-real.jpg\"]",
    "variants": [
      {
        "id": "VAR-SP013-NAVY-128",
        "color": "Xanh Đen Navy",
        "storage": "128GB",
        "ram": 8,
        "rom": 128,
        "price": 7990000,
        "stock": 20,
        "imageUrl": "/images/products/samsung-galaxy-a35-navy.png"
      },
      {
        "id": "VAR-SP013-BLUE-256",
        "color": "Xanh Băng Iceblue",
        "storage": "256GB",
        "ram": 8,
        "rom": 256,
        "price": 8990000,
        "stock": 14,
        "imageUrl": "/images/products/samsung-galaxy-a35-real.jpg"
      }
    ]
  },
  {
    "id": "SP014",
    "name": "Samsung Galaxy A15",
    "slug": "samsung-galaxy-a15",
    "brand": "Samsung",
    "description": "Samsung Galaxy A15 mang trải nghiệm màn hình Super AMOLED 90Hz mượt mà, chip MediaTek 8 nhân tốc độ cao và camera 50MP sắc nét trong phân khúc phổ thông.",
    "specs": "[\"Màn hình: 6.5 inch Super AMOLED FHD+ (1080 x 2340), 90Hz, 800 nits Vision Booster\",\"Chipset: MediaTek Helio G99 / Dimensity 6100+ (6nm) 8 nhân\",\"RAM: 8GB\",\"Bộ nhớ trong: 128GB / 256GB, hỗ trợ thẻ nhớ microSD đến 1TB\",\"Camera sau: Bộ 3 camera: 50MP Chính f/1.8 + 5MP Siêu rộng + 2MP Macro\",\"Camera trước: 13MP f/2.0 chụp chân dung làm đẹp tự nhiên\",\"Pin & Sạc: 5.000 mAh, sạc nhanh Super Fast Charging 25W\",\"Tính năng: Viền nổi Key Island độc đáo, Bảo mật Samsung Knox Vault, Cập nhật 4 năm OS\"]",
    "specDetails": "{\"Màn hình\":\"6.5\\\" Super AMOLED FHD+, 90Hz, 800 nits sống động\",\"Thiết kế\":\"Thiết kế viền nổi Key Island thời thượng, Mặt lưng bóng tinh tế\",\"Chipset\":\"MediaTek 8 nhân mượt mà tiết kiệm điện\",\"RAM\":\"8 GB\",\"Bộ nhớ trong\":\"128 GB / 256 GB\",\"Camera\":\"Bộ ba 50MP + 5MP + 2MP bắt trọn chi tiết\",\"Pin & Sạc\":\"5.000 mAh bền bỉ cả ngày · Sạc nhanh 25W\",\"Hệ điều hành\":\"One UI 6.0 (Android 14)\"}",
    "promotions": "[\"Tặng gói bảo hành chính hãng 12 tháng\",\"Giảm 200.000₫ cho học sinh, sinh viên\"]",
    "originalPrice": 6290000,
    "active": 1,
    "createdAt": "2026-09-29T09:00:00Z",
    "image_url": "/images/products/samsung-galaxy-a15-blue.png",
    "images": "[\"/images/products/samsung-galaxy-a15-blue.png\"]",
    "variants": [
      {
        "id": "VAR-SP014-BLUE-128",
        "color": "Xanh Dương",
        "storage": "128GB",
        "ram": 8,
        "rom": 128,
        "price": 5490000,
        "stock": 25,
        "imageUrl": "/images/products/samsung-galaxy-a15-blue.png"
      },
      {
        "id": "VAR-SP014-BLACK-128",
        "color": "Đen Huyền Bí",
        "storage": "128GB",
        "ram": 8,
        "rom": 128,
        "price": 5490000,
        "stock": 20,
        "imageUrl": "/images/products/samsung-galaxy-a15-blue.png"
      }
    ]
  },
  {
    "id": "SP015",
    "name": "Xiaomi Redmi Note 13 Pro 5G",
    "slug": "xiaomi-redmi-note-13-pro-5g",
    "brand": "Xiaomi",
    "description": "Redmi Note 13 Pro 5G chinh phục mọi ánh nhìn với màn hình AMOLED 1.5K 120Hz viền siêu mỏng, camera siêu phân giải 200MP chống rung OIS và vi xử lý Snapdragon 7s Gen 2 mạnh mẽ.",
    "specs": "[\"Màn hình: 6.67 inch AMOLED 1.5K (1220 x 2712), 120Hz, 1800 nits, Dolby Vision, Kính Gorilla Glass Victus\",\"Chipset: Qualcomm Snapdragon 7s Gen 2 (4nm), 8 nhân hiệu năng cao\",\"RAM: 8GB / 12GB LPDDR4X\",\"Bộ nhớ trong: 256GB / 512GB UFS 2.2\",\"Camera sau: 200MP OIS Siêu cảm biến HP3 f/1.65 + 8MP Góc siêu rộng + 2MP Macro\",\"Camera trước: 16MP làm đẹp AI, chụp đêm rực rỡ\",\"Pin & Sạc: 5.100 mAh, sạc nhanh Turbo Charge 67W (đầy 100% trong 44 phút)\",\"Tính năng: Kháng nước bụi IP54, Loa kép Dolby Atmos, Cảm biến vân tay dưới màn hình nhịp tim\"]",
    "specDetails": "{\"Màn hình\":\"6.67\\\" AMOLED 1.5K, 120Hz, 1800 nits đỉnh, Kính cường lực Gorilla Glass Victus\",\"Thiết kế\":\"Khung viền vuông vức hiện đại, Mặt lưng kính cao cấp, Chuẩn IP54\",\"Chipset\":\"Snapdragon 7s Gen 2 (4nm) đồ họa Adreno 710 mượt mà\",\"RAM\":\"8 GB / 12 GB\",\"Bộ nhớ trong\":\"256 GB / 512 GB\",\"Camera\":\"200MP OIS khẩu độ lớn f/1.65 + 8MP Siêu rộng + 2MP Macro cận cảnh\",\"Pin & Sạc\":\"5.100 mAh · Sạc siêu tốc Turbo Charge 67W\",\"Hệ điều hành\":\"Xiaomi HyperOS (Android 14)\"}",
    "promotions": "[\"Tặng gói bảo hành chính hãng 18 tháng\",\"Tặng bảo hiểm màn hình 6 tháng\"]",
    "originalPrice": 9490000,
    "active": 1,
    "createdAt": "2026-09-24T09:00:00Z",
    "image_url": "/images/products/xiaomi-redmi-note-13-pro.png",
    "images": "[\"/images/products/xiaomi-redmi-note-13-pro.png\",\"/images/products/redmi-note-13-pro-real.jpg\"]",
    "variants": [
      {
        "id": "VAR-SP015-BLACK-256",
        "color": "Đen Bán Dạ",
        "storage": "256GB",
        "ram": 8,
        "rom": 256,
        "price": 8990000,
        "stock": 18,
        "imageUrl": "/images/products/xiaomi-redmi-note-13-pro.png"
      },
      {
        "id": "VAR-SP015-PURPLE-512",
        "color": "Tím Cực Quang",
        "storage": "512GB",
        "ram": 12,
        "rom": 512,
        "price": 9990000,
        "stock": 12,
        "imageUrl": "/images/products/redmi-note-13-pro-real.jpg"
      }
    ]
  },
  {
    "id": "SP016",
    "name": "Xiaomi Redmi Note 13 4G",
    "slug": "xiaomi-redmi-note-13-4g",
    "brand": "Xiaomi",
    "description": "Xiaomi Redmi Note 13 nổi bật với camera 108MP siêu nét, màn hình AMOLED 120Hz viền siêu mỏng, chip Snapdragon 685 tiết kiệm điện và pin 5000 mAh sạc nhanh 33W.",
    "specs": "[\"Màn hình: 6.67 inch AMOLED FHD+ (1080 x 2400), 120Hz, 1800 nits đỉnh, Kính cường lực Corning Gorilla Glass 3\",\"Chipset: Qualcomm Snapdragon 685 (6nm) 8 nhân mượt mà\",\"RAM: 6GB / 8GB LPDDR4X\",\"Bộ nhớ trong: 128GB / 256GB, hỗ trợ thẻ nhớ microSD\",\"Camera sau: 108MP f/1.75 + 8MP Góc siêu rộng + 2MP Macro\",\"Camera trước: 16MP làm đẹp AI chân thực\",\"Pin & Sạc: 5.000 mAh, sạc nhanh 33W (50% trong 29 phút)\",\"Tính năng: Cảm biến vân tay dưới màn hình, Kháng nước bụi IP54, Loa kép Dolby Atmos\"]",
    "specDetails": "{\"Màn hình\":\"6.67\\\" AMOLED FHD+, 120Hz, 1800 nits, Kính Gorilla Glass 3\",\"Thiết kế\":\"Thân máy mỏng nhẹ 7.97mm, Viền màn hình mỏng cân đối, IP54\",\"Chipset\":\"Snapdragon 685 (6nm) 8 nhân hoạt động ổn định mát mẻ\",\"RAM\":\"6 GB / 8 GB\",\"Bộ nhớ trong\":\"128 GB / 256 GB\",\"Camera\":\"Camera đỉnh cao 108MP siêu chi tiết + 8MP Siêu rộng + 2MP Macro\",\"Pin & Sạc\":\"5.000 mAh · Sạc nhanh 33W tiện ích\",\"Hệ điều hành\":\"MIUI 14 (Hỗ trợ nâng cấp HyperOS)\"}",
    "promotions": "[\"Tặng gói bảo hành chính hãng 18 tháng\",\"Tặng củ sạc nhanh 33W và ốp lưng trong hộp\"]",
    "originalPrice": 4890000,
    "active": 1,
    "createdAt": "2026-09-30T09:00:00Z",
    "image_url": "/images/products/xiaomi-redmi-note-13-4g.png",
    "images": "[\"/images/products/xiaomi-redmi-note-13-4g.png\"]",
    "variants": [
      {
        "id": "VAR-SP016-BLACK-128",
        "color": "Đen Bán Dạ",
        "storage": "128GB",
        "ram": 6,
        "rom": 128,
        "price": 4490000,
        "stock": 30,
        "imageUrl": "/images/products/xiaomi-redmi-note-13-4g.png"
      },
      {
        "id": "VAR-SP016-GREEN-128",
        "color": "Xanh Bạc Hà",
        "storage": "128GB",
        "ram": 6,
        "rom": 128,
        "price": 4490000,
        "stock": 20,
        "imageUrl": "/images/products/xiaomi-redmi-note-13-4g.png"
      }
    ]
  },
  {
    "id": "SP017",
    "name": "OPPO A78",
    "slug": "oppo-a78",
    "brand": "OPPO",
    "description": "OPPO A78 nổi bật với thiết kế mỏng nhẹ hiện đại, màn hình AMOLED 90Hz sống động, sạc siêu tốc SuperVOOC 67W và dung lượng pin bền bỉ 5000 mAh.",
    "specs": "[\"Màn hình: 6.43 inch AMOLED FHD+ (1080 x 2400), 90Hz, 430 nits, kính Corning Gorilla Glass 5\",\"Chipset: Qualcomm Snapdragon 680 (6nm), 8 nhân mượt mà tiết kiệm điện\",\"RAM: 8GB (Mở rộng RAM tối đa thêm 8GB)\",\"Bộ nhớ trong: 256GB / 512GB UFS 2.2, hỗ trợ thẻ nhớ microSD đến 1TB\",\"Camera sau: Camera kép 50MP f/1.8 + 2MP đo độ sâu trường ảnh\",\"Camera trước: 8MP f/2.0 làm đẹp AI chân dung\",\"Pin & Sạc: 5.000 mAh, sạc nhanh SuperVOOC 67W (đầy 100% trong 44 phút)\",\"Tính năng: Loa kép stereo âm lượng siêu lớn 200%, Mở khóa vân tay dưới màn hình, Kháng nước IP54\"]",
    "specDetails": "{\"Màn hình\":\"6.43\\\" AMOLED FHD+, 90Hz mượt mà, kính cường lực Gorilla Glass 5\",\"Thiết kế\":\"Mặt lưng OPPO Glow lấp lánh chống bám vân tay, kháng nước IP54\",\"Chipset\":\"Snapdragon 680 (6nm) 8 nhân mượt mà, ổn định\",\"RAM\":\"8 GB (Hỗ trợ RAM ảo +8GB)\",\"Bộ nhớ trong\":\"256 GB / 512 GB\",\"Camera\":\"Chính 50MP chi tiết cao + 2MP chụp chân dung xóa phông\",\"Pin & Sạc\":\"5.000 mAh · Sạc siêu nhanh SuperVOOC 67W\",\"Hệ điều hành\":\"ColorOS 13.1 (Android 13)\"}",
    "promotions": "[\"Tặng gói bảo hành chính hãng 12 tháng\",\"Tặng củ sạc nhanh SuperVOOC 67W kèm máy\"]",
    "originalPrice": 6990000,
    "active": 1,
    "createdAt": "2026-09-08T09:00:00Z",
    "image_url": "/images/products/oppo-a78-black.png",
    "images": "[\"/images/products/oppo-a78-black.png\"]",
    "variants": [
      {
        "id": "VAR-SP017-BLACK-256",
        "color": "Đen Thạch Anh",
        "storage": "256GB",
        "ram": 8,
        "rom": 256,
        "price": 6490000,
        "stock": 15,
        "imageUrl": "/images/products/oppo-a78-black.png"
      },
      {
        "id": "VAR-SP017-GREEN-256",
        "color": "Xanh Ngọc",
        "storage": "256GB",
        "ram": 8,
        "rom": 256,
        "price": 6490000,
        "stock": 12,
        "imageUrl": "/images/products/oppo-a78-black.png"
      }
    ]
  },
  {
    "id": "SP018",
    "name": "OPPO A58",
    "slug": "oppo-a58",
    "brand": "OPPO",
    "description": "OPPO A58 sở hữu màn hình Sunlight FHD+ 6.72 inch siêu lớn, loa kép âm lượng 300% sống động, sạc nhanh SuperVOOC 33W và camera AI 50MP sắc nét.",
    "specs": "[\"Màn hình: 6.72 inch LTPS LCD FHD+ (1080 x 2400), 680 nits Sunlight Display\",\"Chipset: MediaTek Helio G85 (12nm) 8 nhân mượt mà\",\"RAM: 6GB (Mở rộng RAM ảo thêm 6GB)\",\"Bộ nhớ trong: 128GB, hỗ trợ thẻ nhớ microSD lên tới 1TB\",\"Camera sau: Camera kép: 50MP f/1.8 + 2MP f/2.4 xóa phông\",\"Camera trước: 8MP f/2.0 chụp chân dung tự nhiên\",\"Pin & Sạc: 5.000 mAh, sạc nhanh SuperVOOC 33W (52% trong 30 phút)\",\"Tính năng: Loa kép stereo chế độ siêu âm lượng 300%, Mặt lưng OPPO Silk lụa óng ánh\"]",
    "specDetails": "{\"Màn hình\":\"6.72\\\" LTPS LCD FHD+, 680 nits rực rỡ ngoài trời nắng\",\"Thiết kế\":\"Mặt lưng lụa óng ánh sang trọng, Cạnh viền vuông vức hợp xu hướng\",\"Chipset\":\"MediaTek Helio G85 8 nhân chơi game ổn định\",\"RAM\":\"6 GB (+6GB RAM ảo)\",\"Bộ nhớ trong\":\"128 GB (Hỗ trợ thẻ nhớ 1TB)\",\"Camera\":\"Chính 50MP AI + 2MP chụp chân dung Bokeh Flare\",\"Pin & Sạc\":\"5.000 mAh bền bỉ · Sạc nhanh SuperVOOC 33W\",\"Hệ điều hành\":\"ColorOS 13.1 (Android 13)\"}",
    "promotions": "[\"Tặng gói bảo hành chính hãng 12 tháng\",\"Tặng củ sạc nhanh SuperVOOC 33W kèm hộp\"]",
    "originalPrice": 4990000,
    "active": 1,
    "createdAt": "2026-10-01T09:00:00Z",
    "image_url": "/images/products/oppo-a58-black.png",
    "images": "[\"/images/products/oppo-a58-black.png\"]",
    "variants": [
      {
        "id": "VAR-SP018-BLACK-128",
        "color": "Đen Sang Trọng",
        "storage": "128GB",
        "ram": 6,
        "rom": 128,
        "price": 4690000,
        "stock": 25,
        "imageUrl": "/images/products/oppo-a58-black.png"
      }
    ]
  },
  {
    "id": "SP019",
    "name": "Vivo V30 5G",
    "slug": "vivo-v30-5g",
    "brand": "Vivo",
    "description": "Kiệt tác chân dung chuyên nghiệp với hệ thống đèn Aura Light 3.0 thông minh, cụm camera 50MP kép góc rộng, màn hình cong 3D 1.5K 120Hz và thiết kế siêu mỏng nhẹ thời thượng.",
    "specs": "[\"Màn hình: 6.78 inch AMOLED 1.5K (1260 x 2800), cong 3D, 120Hz, 2800 nits, HDR10+\",\"Chipset: Qualcomm Snapdragon 7 Gen 3 (4nm), tiết kiệm pin và tản nhiệt buồng hơi VC siêu lớn\",\"RAM: 12GB LPDDR4X (Mở rộng RAM thêm 12GB)\",\"Bộ nhớ trong: 256GB / 512GB UFS 2.2\",\"Camera sau: 50MP VCS True Color OIS + 50MP Góc siêu rộng 119 độ AF, Đèn Aura Light 3.0\",\"Camera trước: 50MP AF góc siêu rộng 92 độ, quay 4K\",\"Pin & Sạc: 5.000 mAh công nghệ pin siêu mỏng BlueOcean, sạc nhanh FlashCharge 80W (đầy 100% trong 48 phút)\",\"Tính năng: Đèn vòng Aura Light studio điều chỉnh nhiệt độ màu, Kháng nước IP54, Thân máy mỏng chỉ 7.45mm\"]",
    "specDetails": "{\"Màn hình\":\"6.78\\\" Cong 3D AMOLED 1.5K, 120Hz, 2800 nits, 1.07 tỷ màu rực rỡ\",\"Thiết kế\":\"Thân máy siêu mỏng 7.45mm, Mặt lưng kính đổi màu độc đáo, IP54\",\"Chipset\":\"Snapdragon 7 Gen 3 (4nm) 8 nhân mượt mà\",\"RAM\":\"12 GB (Mở rộng thêm 12GB RAM ảo)\",\"Bộ nhớ trong\":\"256 GB / 512 GB\",\"Camera\":\"Kép 50MP OIS + 50MP Siêu rộng, Đèn Flash vòng Aura 3.0 thông minh\",\"Pin & Sạc\":\"5.000 mAh siêu mỏng · Sạc FlashCharge 80W siêu tốc\",\"Hệ điều hành\":\"Funtouch OS 14 (Android 14)\"}",
    "promotions": "[\"Tặng gói bảo hành chính hãng 12 tháng\",\"Hỗ trợ trả góp 0% lãi suất duyệt hồ sơ nhanh trong 5 phút\"]",
    "originalPrice": 13990000,
    "active": 1,
    "createdAt": "2026-09-26T09:00:00Z",
    "image_url": "/images/products/vivo-v30-black.png",
    "images": "[\"/images/products/vivo-v30-black.png\"]",
    "variants": [
      {
        "id": "VAR-SP019-BLACK-256",
        "color": "Đen Thạch Bản",
        "storage": "256GB",
        "ram": 12,
        "rom": 256,
        "price": 12990000,
        "stock": 15,
        "imageUrl": "/images/products/vivo-v30-black.png"
      },
      {
        "id": "VAR-SP019-GREEN-512",
        "color": "Xanh Sóng Nước",
        "storage": "512GB",
        "ram": 12,
        "rom": 512,
        "price": 14490000,
        "stock": 8,
        "imageUrl": "/images/products/vivo-v30-black.png"
      }
    ]
  },
  {
    "id": "SP020",
    "name": "Vivo V29e 5G",
    "slug": "vivo-v29e-5g",
    "brand": "Vivo",
    "description": "Vivo V29e 5G gây ấn tượng mạnh với thiết kế mỏng nhẹ tinh tế, camera chân dung Aura 2.0 độc quyền, màn hình AMOLED 120Hz sắc nét và kết nối 5G tốc độ cao.",
    "specs": "[\"Màn hình: 6.67 inch AMOLED FHD+ (1080 x 2400), 120Hz, 1150 nits\",\"Chipset: Qualcomm Snapdragon 695 5G (6nm) 8 nhân ổn định mát máy\",\"RAM: 8GB (Mở rộng thêm 8GB RAM ảo)\",\"Bộ nhớ trong: 256GB UFS 2.2\",\"Camera sau: 64MP OIS Siêu cảm quang + 8MP Siêu rộng, Vòng Aura 2.0 đổi màu thông minh\",\"Camera trước: 50MP AF lấy nét tự động mắt nhóm\",\"Pin & Sạc: 4.800 mAh, sạc nhanh FlashCharge 44W an toàn\",\"Tính năng: Đèn vòng Aura Light 2.0 studio, Thân máy mỏng 7.69mm, Kháng nước IP54\"]",
    "specDetails": "{\"Màn hình\":\"6.67\\\" AMOLED FHD+, 120Hz mượt mà sắc sảo\",\"Thiết kế\":\"Thân máy siêu mỏng 7.69mm, Mặt lưng họa tiết sông băng bắt mắt\",\"Chipset\":\"Snapdragon 695 5G (6nm) tiết kiệm điện\",\"RAM\":\"8 GB (+8GB RAM ảo)\",\"Bộ nhớ trong\":\"256 GB\",\"Camera\":\"64MP OIS chống rung + 8MP Góc rộng + Đèn Aura Light 2.0\",\"Pin & Sạc\":\"4.800 mAh · Sạc nhanh FlashCharge 44W\",\"Hệ điều hành\":\"Funtouch OS 13 (Android 13)\"}",
    "promotions": "[\"Tặng phiếu mua hàng trị giá 500.000₫\",\"Bảo hành chính hãng 12 tháng tại các trung tâm Vivo toàn quốc\"]",
    "originalPrice": 8990000,
    "active": 1,
    "createdAt": "2026-10-02T09:00:00Z",
    "image_url": "/images/products/vivo-v29e-blue.png",
    "images": "[\"/images/products/vivo-v29e-blue.png\"]",
    "variants": [
      {
        "id": "VAR-SP020-BLUE-256",
        "color": "Xanh Sông Băng",
        "storage": "256GB",
        "ram": 8,
        "rom": 256,
        "price": 8490000,
        "stock": 18,
        "imageUrl": "/images/products/vivo-v29e-blue.png"
      },
      {
        "id": "VAR-SP020-BLACK-256",
        "color": "Đen Huyền Bí",
        "storage": "256GB",
        "ram": 8,
        "rom": 256,
        "price": 8490000,
        "stock": 14,
        "imageUrl": "/images/products/vivo-v29e-blue.png"
      }
    ]
  }
];

module.exports = { SEED_PRODUCTS };
