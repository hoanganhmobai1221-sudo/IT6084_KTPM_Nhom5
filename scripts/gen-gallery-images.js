'use strict';
// =============================================================================
// PhoneStore – Multi-Angle Gallery Image Generator
// Generates standalone, pixel-perfect 500x500 SVG graphics for each product's
// gallery angles: Back, Side Profile, Unboxing (Box & Accessories), and Specs.
// =============================================================================
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'products');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const PRODUCTS = [
  {
    id: 'SP001',
    name: 'iPhone 16 Pro',
    slug: 'iphone-16-pro',
    brand: 'Apple',
    colorHex: '#d6b99b',
    accentHex: '#c79d72',
    chip: 'Apple A18 Pro (3nm)',
    screen: '6.3" 120Hz ProMotion',
    cam: '48MP Fusion + 48MP UW + 5x Tele',
    battery: '3.582 mAh · MagSafe 25W'
  },
  {
    id: 'SP008',
    name: 'iPhone 16 Pro Max',
    slug: 'iphone-16-pro-max',
    brand: 'Apple',
    colorHex: '#d6b99b',
    accentHex: '#c79d72',
    chip: 'Apple A18 Pro (3nm)',
    screen: '6.9" Super Retina XDR OLED',
    cam: '48MP Fusion + 48MP UW + 5x Tele',
    battery: '4.685 mAh · Xem video 33h'
  },
  {
    id: 'SP009',
    name: 'iPhone 18 Pro Max',
    slug: 'iphone-18-pro-max',
    brand: 'Apple',
    colorHex: '#23242c',
    accentHex: '#be4bff',
    chip: 'Apple A20 Pro (2nm)',
    screen: '6.9" Vô cực dưới màn hình',
    cam: '200MP Liquid Lens + 10x Quang',
    battery: '5.200 mAh · MagSafe 45W'
  },
  {
    id: 'SP005',
    name: 'iPhone 15',
    slug: 'iphone-15',
    brand: 'Apple',
    colorHex: '#afd7eb',
    accentHex: '#64e6ff',
    chip: 'Apple A16 Bionic (4nm)',
    screen: '6.1" Super Retina Dynamic Island',
    cam: '48MP Kép · Zoom 2x quang học',
    battery: '3.349 mAh · Cổng USB-C'
  },
  {
    id: 'SP002',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    brand: 'Samsung',
    colorHex: '#82858c',
    accentHex: '#d2a0ff',
    chip: 'Snapdragon 8 Gen 3 for Galaxy',
    screen: '6.8" QHD+ Dynamic AMOLED 2X',
    cam: '200MP OIS + 50MP 5x + 10MP 3x',
    battery: '5.000 mAh · Sạc nhanh 45W · S-Pen'
  },
  {
    id: 'SP012',
    name: 'Samsung Galaxy S26 Ultra',
    slug: 'samsung-galaxy-s26-ultra',
    brand: 'Samsung',
    colorHex: '#323744',
    accentHex: '#b973ff',
    chip: 'Snapdragon 8 Gen 5 AI Engine',
    screen: '6.9" Dynamic AMOLED 3X 144Hz',
    cam: '300MP ISOCELL AI + 100x Space Zoom',
    battery: '5.500 mAh · S-Pen Pro AI'
  },
  {
    id: 'SP004',
    name: 'Samsung Galaxy A55 5G',
    slug: 'samsung-galaxy-a55-5g',
    brand: 'Samsung',
    colorHex: '#263452',
    accentHex: '#50afff',
    chip: 'Exynos 1480 (4nm) GPU AMD',
    screen: '6.6" Super AMOLED 120Hz',
    cam: '50MP OIS + 12MP UW + 5MP Macro',
    battery: '5.000 mAh · Khung kim loại IP67'
  },
  {
    id: 'SP003',
    name: 'Xiaomi 14',
    slug: 'xiaomi-14',
    brand: 'Xiaomi',
    colorHex: '#5faf91',
    accentHex: '#22c55e',
    chip: 'Snapdragon 8 Gen 3 (4nm)',
    screen: '6.36" OLED 1.5K 120Hz LTPO',
    cam: 'Ống kính Leica Summilux 50MP',
    battery: '4.610 mAh · Sạc HyperCharge 90W'
  },
  {
    id: 'SP010',
    name: 'Xiaomi 14 Ultra',
    slug: 'xiaomi-14-ultra',
    brand: 'Xiaomi',
    colorHex: '#f1f3f6',
    accentHex: '#f59e0b',
    chip: 'Snapdragon 8 Gen 3 (4nm)',
    screen: '6.73" AMOLED 2K LTPO 120Hz',
    cam: '4 Camera Leica 50MP cảm biến 1 inch',
    battery: '5.000 mAh · Sạc 90W · Không dây 80W'
  },
  {
    id: 'SP011',
    name: 'Xiaomi 18 Ultra',
    slug: 'xiaomi-18-ultra',
    brand: 'Xiaomi',
    colorHex: '#1e222a',
    accentHex: '#38bdf8',
    chip: 'Snapdragon 8 Gen 5 Extreme',
    screen: '6.8" OLED 4K 165Hz Micro-quad',
    cam: 'Leica Quad 200MP Cảm biến 1.2 inch',
    battery: '6.000 mAh · Sạc 150W · HyperOS'
  },
  {
    id: 'SP006',
    name: 'OPPO Find X7 Ultra',
    slug: 'oppo-find-x7-ultra',
    brand: 'OPPO',
    colorHex: '#8b5a2b',
    accentHex: '#fb923c',
    chip: 'Snapdragon 8 Gen 3 (4nm)',
    screen: '6.82" 2K 120Hz LTPO 4500 nits',
    cam: 'Hasselblad Dual Periscope 50MP',
    battery: '5.000 mAh · Sạc SuperVOOC 100W'
  },
  {
    id: 'SP007',
    name: 'iPhone SE 2022',
    slug: 'iphone-se-2022',
    brand: 'Apple',
    colorHex: '#202124',
    accentHex: '#38bdf8',
    chip: 'Apple A15 Bionic (5nm)',
    screen: '4.7" Retina HD Touch ID',
    cam: '12MP Wide · Smart HDR 4',
    battery: '2.018 mAh · Sạc nhanh 20W'
  }
];

function generateBackViewSvg(p) {
  const isApple = p.brand === 'Apple';
  const isSamsung = p.brand === 'Samsung';
  const isXiaomi = p.brand === 'Xiaomi';
  const isOppo = p.brand === 'OPPO';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad_${p.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="bodyGrad_${p.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.colorHex}"/>
      <stop offset="50%" stop-color="${p.colorHex}"/>
      <stop offset="100%" stop-color="${p.colorHex}" stop-opacity="0.85"/>
    </linearGradient>
    <filter id="shadow_${p.id}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#0f172a" flood-opacity="0.22"/>
    </filter>
    <filter id="camShadow_${p.id}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Canvas Background -->
  <rect width="500" height="500" rx="28" fill="url(#bgGrad_${p.id})"/>
  
  <!-- Subtle Grid Accent -->
  <circle cx="250" cy="250" r="190" fill="none" stroke="rgba(148,163,184,0.15)" stroke-width="1.5" stroke-dasharray="4 6"/>
  <circle cx="250" cy="250" r="140" fill="none" stroke="rgba(148,163,184,0.1)" stroke-width="1"/>

  <!-- Phone Body Back -->
  <g filter="url(#shadow_${p.id})">
    <rect x="150" y="45" width="200" height="400" rx="38" fill="url(#bodyGrad_${p.id})" stroke="rgba(255,255,255,0.7)" stroke-width="2.5"/>
    <!-- Glass Sheen Overlay -->
    <path d="M 154 50 L 346 50 C 330 180 200 320 154 440 Z" fill="rgba(255,255,255,0.08)"/>
  </g>

  ${isApple ? `
    <!-- Apple Camera Module -->
    <g filter="url(#camShadow_${p.id})">
      <rect x="165" y="60" width="85" height="85" rx="22" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
      <!-- Lens 1 (Top) -->
      <circle cx="185" cy="80" r="15" fill="#0f172a" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
      <circle cx="185" cy="80" r="10" fill="#1e293b"/>
      <circle cx="187" cy="78" r="3" fill="#38bdf8" opacity="0.8"/>
      <!-- Lens 2 (Bottom) -->
      <circle cx="185" cy="122" r="15" fill="#0f172a" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
      <circle cx="185" cy="122" r="10" fill="#1e293b"/>
      <circle cx="187" cy="120" r="3" fill="#38bdf8" opacity="0.8"/>
      <!-- Lens 3 (Right) -->
      <circle cx="225" cy="101" r="15" fill="#0f172a" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
      <circle cx="225" cy="101" r="10" fill="#1e293b"/>
      <circle cx="227" cy="99" r="3" fill="#38bdf8" opacity="0.8"/>
      <!-- Flash & LiDAR -->
      <circle cx="225" cy="74" r="5" fill="#fef08a" stroke="#ca8a04" stroke-width="1"/>
      <circle cx="225" cy="128" r="4" fill="#1e293b"/>
    </g>
    <!-- Brand Logo in Center -->
    <circle cx="250" cy="245" r="14" fill="rgba(255,255,255,0.4)"/>
    <path d="M 247 236 C 248 233 251 231 254 231 C 253 234 250 236 247 236 Z" fill="rgba(255,255,255,0.5)"/>
  ` : isSamsung ? `
    <!-- Samsung Vertical Lenses -->
    <g filter="url(#camShadow_${p.id})">
      <circle cx="185" cy="80" r="15" fill="#0f172a" stroke="rgba(255,255,255,0.7)" stroke-width="2.5"/>
      <circle cx="185" cy="80" r="9" fill="#1e293b"/><circle cx="187" cy="78" r="3" fill="#818cf8"/>
      
      <circle cx="185" cy="122" r="15" fill="#0f172a" stroke="rgba(255,255,255,0.7)" stroke-width="2.5"/>
      <circle cx="185" cy="122" r="9" fill="#1e293b"/><circle cx="187" cy="120" r="3" fill="#818cf8"/>

      <circle cx="185" cy="164" r="15" fill="#0f172a" stroke="rgba(255,255,255,0.7)" stroke-width="2.5"/>
      <circle cx="185" cy="164" r="9" fill="#1e293b"/><circle cx="187" cy="162" r="3" fill="#818cf8"/>

      <circle cx="222" cy="100" r="10" fill="#0f172a" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
      <circle cx="222" cy="76" r="4" fill="#fef08a"/>
    </g>
    <text x="250" y="415" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="12" fill="rgba(255,255,255,0.55)" letter-spacing="4">SAMSUNG</text>
  ` : (isXiaomi || isOppo) ? `
    <!-- Large Circular Camera Dome -->
    <g filter="url(#camShadow_${p.id})">
      <circle cx="250" cy="140" r="54" fill="#0f172a" stroke="rgba(255,255,255,0.8)" stroke-width="3"/>
      <circle cx="250" cy="140" r="48" fill="#1e293b"/>
      <!-- 4 Quad Lenses -->
      <circle cx="232" cy="124" r="11" fill="#020617" stroke="#334155" stroke-width="1.5"/><circle cx="233" cy="123" r="2.5" fill="#38bdf8"/>
      <circle cx="268" cy="124" r="11" fill="#020617" stroke="#334155" stroke-width="1.5"/><circle cx="269" cy="123" r="2.5" fill="#38bdf8"/>
      <circle cx="232" cy="156" r="11" fill="#020617" stroke="#334155" stroke-width="1.5"/><circle cx="233" cy="155" r="2.5" fill="#38bdf8"/>
      <circle cx="268" cy="156" r="11" fill="#020617" stroke="#334155" stroke-width="1.5"/><circle cx="269" cy="155" r="2.5" fill="#38bdf8"/>
      <text x="250" y="143" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="8" fill="#f87171" letter-spacing="1">${isXiaomi ? 'LEICA' : 'HASSELBLAD'}</text>
    </g>
    <text x="250" y="415" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="13" fill="rgba(255,255,255,0.55)" letter-spacing="3">${p.brand.toUpperCase()}</text>
  ` : `
    <circle cx="250" cy="245" r="20" fill="rgba(255,255,255,0.3)"/>
  `}

  <!-- Badge at bottom -->
  <g transform="translate(145, 460)">
    <rect width="210" height="28" rx="14" fill="#0f172a" opacity="0.85"/>
    <text x="105" y="18" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="11" fill="#ffffff">
      📸 Mặt lưng &amp; Cụm Camera
    </text>
  </g>
</svg>`;
}

function generateSideViewSvg(p) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGradSide_${p.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="frameGrad_${p.id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#94a3b8"/>
      <stop offset="35%" stop-color="${p.colorHex}"/>
      <stop offset="70%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#64748b"/>
    </linearGradient>
    <filter id="sideShadow_${p.id}" x="-30%" y="-10%" width="160%" height="130%">
      <feDropShadow dx="8" dy="16" stdDeviation="18" flood-color="#0f172a" flood-opacity="0.25"/>
    </filter>
  </defs>

  <rect width="500" height="500" rx="28" fill="url(#bgGradSide_${p.id})"/>
  <circle cx="250" cy="250" r="170" fill="none" stroke="rgba(148,163,184,0.18)" stroke-width="1.5" stroke-dasharray="6 6"/>

  <g filter="url(#sideShadow_${p.id})">
    <!-- Camera Extrusion on Left -->
    <rect x="226" y="70" width="8" height="90" rx="4" fill="#334155"/>
    
    <!-- Main Titanium / Armor Frame Profile -->
    <rect x="234" y="50" width="32" height="390" rx="14" fill="url(#frameGrad_${p.id})" stroke="rgba(255,255,255,0.8)" stroke-width="1.5"/>

    <!-- Antenna Lines -->
    <line x1="234" y1="95" x2="266" y2="95" stroke="#475569" stroke-width="2"/>
    <line x1="234" y1="395" x2="266" y2="395" stroke="#475569" stroke-width="2"/>

    <!-- Action Button (Left side upper) -->
    <rect x="229" y="115" width="5" height="18" rx="2" fill="#475569"/>

    <!-- Volume Buttons -->
    <rect x="229" y="148" width="5" height="36" rx="2" fill="#475569"/>
    <rect x="229" y="196" width="5" height="36" rx="2" fill="#475569"/>

    <!-- Power / Camera Control Button (Right side) -->
    <rect x="266" y="155" width="5" height="48" rx="2" fill="#475569"/>
    <rect x="266" y="275" width="4" height="30" rx="2" fill="#38bdf8"/>
    
    <!-- Bottom USB-C and Speaker cutouts -->
    <rect x="246" y="426" width="8" height="3" rx="1.5" fill="#1e293b"/>
  </g>

  <!-- Descriptive Callouts -->
  <g font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700">
    <!-- Camera bump callout -->
    <path d="M 224 100 L 140 100" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="3 3"/>
    <circle cx="224" cy="100" r="3" fill="#0284c7"/>
    <rect x="35" y="86" width="100" height="28" rx="6" fill="#ffffff" stroke="#bae6fd" stroke-width="1"/>
    <text x="85" y="104" text-anchor="middle" fill="#0369a1">Cụm Camera</text>

    <!-- Titanium Frame callout -->
    <path d="M 268 200 L 350 200" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="3 3"/>
    <circle cx="268" cy="200" r="3" fill="#0284c7"/>
    <rect x="355" y="186" width="110" height="28" rx="6" fill="#ffffff" stroke="#bae6fd" stroke-width="1"/>
    <text x="410" y="204" text-anchor="middle" fill="#0369a1">Khung viền Titan</text>

    <!-- Camera Control / USB-C callout -->
    <path d="M 268 290 L 350 290" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="3 3"/>
    <circle cx="268" cy="290" r="3" fill="#0284c7"/>
    <rect x="355" y="276" width="115" height="28" rx="6" fill="#ffffff" stroke="#bae6fd" stroke-width="1"/>
    <text x="412" y="294" text-anchor="middle" fill="#0369a1">Camera Control</text>
  </g>

  <!-- Badge at bottom -->
  <g transform="translate(140, 460)">
    <rect width="220" height="28" rx="14" fill="#0f172a" opacity="0.85"/>
    <text x="110" y="18" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="11" fill="#ffffff">
      📐 Khung viền &amp; Nút bấm
    </text>
  </g>
</svg>`;
}

function generateBoxViewSvg(p) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGradBox_${p.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <filter id="boxShadow_${p.id}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#0f172a" flood-opacity="0.2"/>
    </filter>
  </defs>

  <rect width="500" height="500" rx="28" fill="url(#bgGradBox_${p.id})"/>

  <!-- Retail Packaging Box (Left) -->
  <g filter="url(#boxShadow_${p.id})">
    <!-- Box Base -->
    <rect x="70" y="60" width="200" height="370" rx="24" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    
    <!-- Phone outline embossed on box lid -->
    <rect x="95" y="90" width="150" height="280" rx="22" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
    <circle cx="170" cy="230" r="18" fill="none" stroke="#cbd5e1" stroke-width="1.5"/>
    
    <!-- Box Title Typography -->
    <text x="170" y="395" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="13" fill="#334155" letter-spacing="1">
      ${p.name.toUpperCase()}
    </text>
    <text x="170" y="412" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="9" fill="#94a3b8">
      CHÍNH HÃNG VN/A
    </text>
  </g>

  <!-- Coiled Braided USB-C Cable (Right Top) -->
  <g filter="url(#boxShadow_${p.id})">
    <rect x="295" y="65" width="145" height="155" rx="20" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Coiled Cable Graphic -->
    <circle cx="367" cy="135" r="42" fill="none" stroke="#e2e8f0" stroke-width="12"/>
    <circle cx="367" cy="135" r="42" fill="none" stroke="#f1f5f9" stroke-width="8" stroke-dasharray="2 3"/>
    <rect x="360" y="80" width="14" height="22" rx="3" fill="#cbd5e1"/>
    <rect x="363" y="74" width="8" height="6" rx="1.5" fill="#94a3b8"/>
    <text x="367" y="195" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="10" fill="#475569">
      Cáp USB-C bện dù 1m
    </text>
  </g>

  <!-- SIM Tool & Quick Guide (Right Bottom) -->
  <g filter="url(#boxShadow_${p.id})">
    <rect x="295" y="240" width="145" height="190" rx="20" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    
    <!-- Documentation Sleeve -->
    <rect x="315" y="260" width="105" height="105" rx="10" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
    <text x="367" y="318" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="11" fill="#64748b">
      Sách HDSD
    </text>

    <!-- SIM Pin Tool -->
    <circle cx="367" cy="385" r="8" fill="none" stroke="#64748b" stroke-width="2"/>
    <line x1="367" y1="393" x2="367" y2="408" stroke="#64748b" stroke-width="2"/>
    <text x="367" y="422" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="10" fill="#475569">
      Que lấy SIM
    </text>
  </g>

  <!-- Badge at bottom -->
  <g transform="translate(135, 460)">
    <rect width="230" height="28" rx="14" fill="#0f172a" opacity="0.85"/>
    <text x="115" y="18" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="11" fill="#ffffff">
      📦 Mở hộp &amp; Phụ kiện kèm theo
    </text>
  </g>
</svg>`;
}

function generateSpecsViewSvg(p) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGradSpecs_${p.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="cardGrad_${p.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.08)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.03)"/>
    </linearGradient>
  </defs>

  <!-- Dark Tech Infographic Background -->
  <rect width="500" height="500" rx="28" fill="url(#bgGradSpecs_${p.id})"/>

  <!-- Radial Glow Header -->
  <circle cx="250" cy="50" r="160" fill="${p.accentHex}" opacity="0.15"/>

  <!-- Header Title -->
  <text x="250" y="55" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="20" fill="#ffffff">
    ${p.name}
  </text>
  <text x="250" y="80" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="11" fill="${p.accentHex}" letter-spacing="2">
    THÔNG SỐ KỸ THUẬT CHÍNH HÃNG
  </text>

  <!-- 4 Feature Cards Grid -->
  <!-- 1. Chipset -->
  <g transform="translate(45, 110)">
    <rect width="195" height="135" rx="18" fill="url(#cardGrad_${p.id})" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    <text x="20" y="38" font-size="22">⚡</text>
    <text x="20" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="12" fill="#94a3b8">VI XỬ LÝ</text>
    <text x="20" y="95" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="13" fill="#ffffff">${p.chip}</text>
    <text x="20" y="118" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="10" fill="#38bdf8">Tiến trình tối tân</text>
  </g>

  <!-- 2. Display -->
  <g transform="translate(260, 110)">
    <rect width="195" height="135" rx="18" fill="url(#cardGrad_${p.id})" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    <text x="20" y="38" font-size="22">📱</text>
    <text x="20" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="12" fill="#94a3b8">MÀN HÌNH</text>
    <text x="20" y="95" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="12" fill="#ffffff">${p.screen}</text>
    <text x="20" y="118" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="10" fill="#38bdf8">Tần số quét cao</text>
  </g>

  <!-- 3. Camera -->
  <g transform="translate(45, 265)">
    <rect width="195" height="135" rx="18" fill="url(#cardGrad_${p.id})" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    <text x="20" y="38" font-size="22">📸</text>
    <text x="20" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="12" fill="#94a3b8">HỆ THỐNG CAMERA</text>
    <text x="20" y="95" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="11" fill="#ffffff">${p.cam}</text>
    <text x="20" y="118" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="10" fill="#38bdf8">Chụp đêm &amp; Zoom quang</text>
  </g>

  <!-- 4. Battery & Charging -->
  <g transform="translate(260, 265)">
    <rect width="195" height="135" rx="18" fill="url(#cardGrad_${p.id})" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    <text x="20" y="38" font-size="22">🔋</text>
    <text x="20" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="12" fill="#94a3b8">PIN &amp; CÔNG NGHỆ SẠC</text>
    <text x="20" y="95" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="11" fill="#ffffff">${p.battery}</text>
    <text x="20" y="118" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="10" fill="#38bdf8">Thời lượng bền bỉ cả ngày</text>
  </g>

  <!-- Official Warranty Bar -->
  <g transform="translate(45, 420)">
    <rect width="410" height="34" rx="10" fill="rgba(37,99,235,0.2)" stroke="#2563eb" stroke-width="1"/>
    <text x="205" y="21" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="11" fill="#93c5fd">
      🛡️ Bảo hành chính hãng 12 tháng · 1 đổi 1 trong 30 ngày
    </text>
  </g>

  <!-- Badge at bottom -->
  <g transform="translate(135, 465)">
    <rect width="230" height="25" rx="12.5" fill="#0f172a" opacity="0.85"/>
    <text x="115" y="17" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="11" fill="#ffffff">
      📊 Thông số &amp; Điểm nổi bật
    </text>
  </g>
</svg>`;
}

let count = 0;
for (const p of PRODUCTS) {
  const backSvg = generateBackViewSvg(p);
  const sideSvg = generateSideViewSvg(p);
  const boxSvg = generateBoxViewSvg(p);
  const specsSvg = generateSpecsViewSvg(p);

  fs.writeFileSync(path.join(OUT_DIR, `${p.slug}-back.svg`), backSvg);
  fs.writeFileSync(path.join(OUT_DIR, `${p.slug}-side.svg`), sideSvg);
  fs.writeFileSync(path.join(OUT_DIR, `${p.slug}-box.svg`), boxSvg);
  fs.writeFileSync(path.join(OUT_DIR, `${p.slug}-specs.svg`), specsSvg);
  count += 4;
}

console.log(`Generated ${count} gallery SVG images successfully in ${OUT_DIR}`);
