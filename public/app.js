'use strict';
// =============================================================================
// PhoneStore – Frontend Single Page Application (SPA)
// =============================================================================

// --- Utilities ---------------------------------------------------------------
const esc = (v) => String(v == null ? '' : v)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const fmtVND = (n) => (Math.round(Number(n) || 0)).toLocaleString('vi-VN') + '₫';

const byId = (id) => {
  if (typeof document === 'undefined') return null;
  let el = document.getElementById(id);
  if (!el && typeof id === 'string') {
    if (id.startsWith('select-')) el = document.getElementById(id.replace('select-', 'filter-'));
    else if (id.startsWith('filter-')) el = document.getElementById(id.replace('filter-', 'select-'));
  }
  return el;
};
const inputVal = (id) => { const el = byId(id); return el ? el.value.trim() : ''; };

if (typeof document !== 'undefined') {
  const origGetElementById = document.getElementById.bind(document);
  document.getElementById = function(id) {
    let el = origGetElementById(id);
    if (!el && typeof id === 'string') {
      if (id.startsWith('select-')) el = origGetElementById(id.replace('select-', 'filter-'));
      else if (id.startsWith('filter-')) el = origGetElementById(id.replace('filter-', 'select-'));
    }
    return el;
  };
}

const LS_TOKEN = 'phonestore_token';
const LS_CART = 'phonestore_cart';
const LS_USER = 'phonestore_user';

const asArray = (v) => (Array.isArray(v) ? v : []);

const SAFE_FALLBACK_IMAGE = '/images/products/placeholder.png';
window.SAFE_FALLBACK_IMAGE = SAFE_FALLBACK_IMAGE;
const IMG_FALLBACK = SAFE_FALLBACK_IMAGE;

function safeImageUrl(url, fallback) {
  if (!url) return fallback || SAFE_FALLBACK_IMAGE;
  return url;
}

window.handleProductImgError = function(el, fallbackSrc) {
  if (!el) return;
  el.onerror = null;
  el.src = fallbackSrc || SAFE_FALLBACK_IMAGE;
};

// Hero Promotional Carousel Slides (Section 1) - Local 100% Guaranteed Assets
const defaultBannerSlides = [
  {
    icon: '📷',
    badge: 'HUYỀN THOẠI QUANG HỌC LEICA',
    badgeClass: 'from-rose-500/20 to-red-500/20 border-rose-400/40 text-rose-300',
    title: 'Xiaomi 14 Ultra',
    subtitle: 'Cảm Biến 1-inch LYT-900',
    highlight: 'Cảm Biến 1-inch LYT-900',
    highlightColor: 'text-rose-400',
    description: 'Ống kính Leica Summilux khẩu độ vô cấp f/1.63 – f/4.0 cùng vi xử lý Snapdragon 8 Gen 3 định hình đỉnh cao nhiếp ảnh di động.',
    desc: 'Ống kính Leica Summilux khẩu độ vô cấp f/1.63 – f/4.0 cùng vi xử lý Snapdragon 8 Gen 3 định hình đỉnh cao nhiếp ảnh di động.',
    image: '/images/products/xiaomi-14-ultra.png',
    img: '/images/products/xiaomi-14-ultra.png',
    fallback: '/images/products/placeholder.png',
    alt: 'Xiaomi 14 Ultra',
    brand: 'Xiaomi',
    ctaBg: 'from-rose-500 via-pink-500 to-orange-400 text-white shadow-rose-500/25'
  },
  {
    icon: '🔥',
    badge: 'SIÊU TIẾT KIỆM – ĐỔI MỚI MỖI NGÀY',
    badgeClass: 'from-amber-500/20 to-orange-500/20 border-amber-400/40 text-amber-300',
    title: 'iPhone 16 Series',
    subtitle: 'Chính Hãng VN/A',
    highlight: 'Chính Hãng VN/A',
    highlightColor: 'text-amber-400',
    description: 'Sở hữu dòng điện thoại cao cấp Titan Sa Mạc với trợ giá thu cũ lên đời đến 5.000.000đ. Trả góp 0% lãi suất.',
    desc: 'Sở hữu dòng điện thoại cao cấp Titan Sa Mạc với trợ giá thu cũ lên đời đến 5.000.000đ. Trả góp 0% lãi suất.',
    image: '/images/products/iphone16-promax.png',
    img: '/images/products/iphone16-promax.png',
    fallback: '/images/products/placeholder.png',
    alt: 'iPhone 16 Pro Max Titan Sa Mạc',
    brand: 'Apple',
    ctaBg: 'from-amber-400 via-amber-300 to-yellow-400 text-slate-950 shadow-amber-500/25'
  },
  {
    icon: '✨',
    badge: 'QUYỀN NĂNG GALAXY AI',
    badgeClass: 'from-blue-500/20 to-cyan-500/20 border-blue-400/40 text-cyan-300',
    title: 'Samsung Galaxy S24 Ultra',
    subtitle: 'Khung Titan Bền Bỉ',
    highlight: 'Khung Titan Bền Bỉ',
    highlightColor: 'text-cyan-400',
    description: 'Tích hợp Galaxy AI thông minh, camera 200MP zoom quang học 10x cùng bút S-Pen quyền năng.',
    desc: 'Tích hợp Galaxy AI thông minh, camera 200MP zoom quang học 10x cùng bút S-Pen quyền năng.',
    image: '/images/products/samsung-s24-ultra.png',
    img: '/images/products/samsung-s24-ultra.png',
    fallback: '/images/products/placeholder.png',
    alt: 'Samsung Galaxy S24 Ultra Titanium',
    brand: 'Samsung',
    ctaBg: 'from-blue-500 via-indigo-500 to-cyan-400 text-white shadow-blue-500/25'
  }
];
// Safely resolve bannerSlides without any redeclaration issues
var HERO_SLIDES = (typeof window !== 'undefined' && window.bannerSlides && window.bannerSlides.length)
  ? window.bannerSlides.map((s, idx) => ({ ...defaultBannerSlides[idx], ...s }))
  : defaultBannerSlides;
if (typeof window !== 'undefined') {
  window.HERO_SLIDES = HERO_SLIDES;
  window.bannerSlides = HERO_SLIDES;
}
var bannerSlides = HERO_SLIDES;


// Validation Regex (mirroring server-side validation)
const NAME_RE = /^[\p{L}\s]{2,50}$/u;
const USERNAME_RE = /^[a-zA-Z][a-zA-Z0-9_]{5,49}$/;
const PHONE_RE = /^(03|05|07|08|09)\d{8}$/;
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_RE = /^(?=.*[A-Z])(?=.*[@#$!]).{6,}$/;

// --- Central Application State -----------------------------------------------
const State = {
  token: localStorage.getItem(LS_TOKEN) || '',
  user: null,
  view: 'products', // 'products' | 'cart' | 'checkout' | 'checkout-success' | 'login' | 'register' | 'orders' | 'admin'
  heroSlide: 0,
  products: [],
  productDetail: null,
  selectedVariant: null,
  detailTab: 'spec', // 'spec' | 'warranty'
  cart: [], // [{ variantId, qty }]
  filter: {
    search: '',
    brand: '',
    ram: '',
    rom: '',
    storage: '',
    minPrice: null,
    maxPrice: null,
    sort: 'newest'
  },
  filterOptions: { brands: [], ram: [], rom: [], storages: [], colors: [], priceMin: 0, priceMax: 0 },
  coupon: null,
  couponMsg: { type: '', text: '' },
  shippingProvider: 'GHN', // 'GHN' (30k) | 'GHTK' (25k) | 'Viettel Post' (20k)
  shippingFee: 30000,
  cartMsg: { type: '', text: '', testid: '' },
  lastOrder: null,
  orders: [],
  admin: {
    tab: 'analytics',
    analytics: null,
    products: [],
    orders: []
  },
  modalOpen: false,
  mobileMenuOpen: false,
  searchModalOpen: false
};

const SHIPPING_RATES = {
  'GHN': 30000,
  'GHTK': 25000,
  'Viettel Post': 20000
};

// --- Storage & Session Helpers -----------------------------------------------
function loadCart() {
  try {
    const raw = localStorage.getItem(LS_CART);
    State.cart = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(State.cart)) State.cart = [];
  } catch {
    State.cart = [];
  }
}

function saveCart() {
  localStorage.setItem(LS_CART, JSON.stringify(State.cart));
}

function persistAuth() {
  if (State.token) {
    localStorage.setItem(LS_TOKEN, State.token);
  } else {
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_USER);
  }
}

// --- API Request Client ------------------------------------------------------
async function api(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (State.token) headers['Authorization'] = 'Bearer ' + State.token;
  try {
    const res = await fetch(path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
    let data = {};
    try { data = await res.json(); } catch { data = {}; }
    return { status: res.status, ok: res.ok, data };
  } catch (err) {
    return { status: 0, ok: false, data: { success: false, message: 'Lỗi kết nối máy chủ.' } };
  }
}

// --- Cart synchronization with Database --------------------------------------
async function syncCartWithDb() {
  if (!State.user || !State.token) return;
  const res = await api('POST', '/api/cart/sync', { items: State.cart });
  if (res.ok && res.data) {
    const items = res.data.items || (res.data.data && res.data.data.items);
    if (Array.isArray(items)) {
      State.cart = items.map((i) => ({ variantId: i.variantId, qty: i.qty }));
      saveCart();
    }
  }
}

// --- Product Helpers ---------------------------------------------------------
function cartCount() {
  return State.cart.reduce((s, i) => s + (Number(i.qty) || 0), 0);
}

function findVariantLocal(variantId) {
  for (const p of asArray(State.products)) {
    for (const v of asArray(p.variants)) {
      if (v.id === variantId) {
        return { ...v, productName: p.name, brand: p.brand };
      }
    }
  }
  return null;
}

function productImage(p) {
  if (!p) return IMG_FALLBACK;
  let url = p.image_url || p.imageUrl || p.image;
  if (!url && Array.isArray(p.variants) && p.variants.length) {
    for (const v of p.variants) {
      if (v.image_url || v.imageUrl) {
        url = v.image_url || v.imageUrl;
        break;
      }
    }
  }
  return safeImageUrl(url, IMG_FALLBACK);
}

// --- Toast notifications -----------------------------------------------------
function toast(message, type = 'info') {
  const c = byId('toast-container');
  if (!c) return;
  const el = document.createElement('div');
  const bg = type === 'error' ? 'bg-rose-600 text-white' : (type === 'success' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white');
  el.className = `${bg} px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between text-sm font-semibold transition-all duration-300 transform translate-y-2 opacity-0`;
  el.innerHTML = `<span>${esc(message)}</span><button class="ml-3 text-white/80 hover:text-white font-bold text-base">&times;</button>`;
  el.querySelector('button').onclick = () => { el.remove(); };
  c.appendChild(el);
  setTimeout(() => { el.classList.remove('translate-y-2', 'opacity-0'); }, 10);
  setTimeout(() => {
    el.classList.add('opacity-0', '-translate-y-2');
    setTimeout(() => { el.remove(); }, 300);
  }, 4000);
}

// --- Navigation & Routing ----------------------------------------------------
function go(view) {
  State.view = view;
  State.mobileMenuOpen = false;
  State.searchModalOpen = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  render();
}

function toggleMobileMenu() {
  State.mobileMenuOpen = !State.mobileMenuOpen;
  render();
}

function openSearchModal() {
  State.searchModalOpen = true;
  render();
  setTimeout(() => {
    const el = byId('modal-search-input');
    if (el) el.focus();
  }, 50);
}

function closeSearchModal() {
  State.searchModalOpen = false;
  render();
}

// --- Cart Totals (BUG-07: Total = Subtotal + ShippingFee - Discount) ---------
function computeTotals() {
  let subtotal = 0;
  for (const it of State.cart) {
    const v = findVariantLocal(it.variantId);
    if (v) subtotal += v.price * it.qty;
  }

  let discount = 0;
  if (State.coupon && subtotal > 0) {
    if (State.coupon.type === 'percent') {
      const calc = Math.round((subtotal * State.coupon.value) / 100);
      discount = State.coupon.maxDiscount > 0 ? Math.min(calc, State.coupon.maxDiscount) : calc;
    } else {
      discount = Math.min(Number(State.coupon.value) || 0, subtotal);
    }
  }

  const shippingFee = Number(State.shippingFee) || 0;
  const grandTotal = Math.max(0, subtotal + shippingFee - discount);

  return { subtotal, discount, shippingFee, grandTotal };
}

// --- Header Component (Section 6 & 7.1) --------------------------------------
function headerHTML() {
  const u = State.user;
  const count = cartCount();
  return `
  <header class="liquid-glass-header sticky top-0 z-40 transition-all duration-200">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
      <!-- Logo -->
      <a href="#" onclick="go('products')" id="brand-logo" data-testid="brand-logo" class="flex items-center gap-2 group">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xl font-black shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
          📱
        </div>
        <div class="flex flex-col">
          <span class="font-extrabold text-lg text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">PhoneStore</span>
          <span class="text-[10px] font-semibold text-blue-600 tracking-widest uppercase mt-0.5">Chính Hãng</span>
        </div>
      </a>

      <!-- Desktop Instant Search -->
      <div class="hidden md:flex flex-1 max-w-md mx-4 relative">
        <input id="input-search" data-testid="input-search" type="text"
          value="${esc(State.filter.search)}"
          oninput="onSearchInput(this.value)"
          placeholder="Tìm kiếm sản phẩm (iPhone, Galaxy, Xiaomi...)"
          class="ps-input pl-10 pr-4 py-2 w-full text-xs font-medium" />
        <span class="absolute left-3.5 top-2.5 text-slate-400 text-sm">🔍</span>
      </div>

      <!-- Action items -->
      <div class="flex items-center gap-2">
        <!-- Mobile Search Button -->
        <button id="search-modal-trigger" data-testid="search-modal-trigger" onclick="openSearchModal()"
          class="md:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white/70 hover:bg-white text-slate-700 border border-white shadow-sm"
          title="Tìm kiếm">
          🔍
        </button>

        <!-- Home nav -->
        <button id="nav-home" data-testid="nav-home" onclick="go('products')"
          class="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold ${State.view === 'products' ? 'text-blue-600 bg-blue-50/80' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'} transition">
          Trang chủ
        </button>

        <!-- Cart Nav Button -->
        <button id="nav-cart" data-testid="nav-cart" onclick="go('cart')"
          class="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/80 hover:bg-white text-slate-700 border border-white shadow-sm transition group">
          <span class="text-base group-hover:scale-110 transition-transform">🛒</span>
          <span class="hidden sm:inline text-xs font-bold">Giỏ hàng</span>
          <span id="cart-count" data-testid="cart-count"
            class="px-2 py-0.5 text-[11px] font-black rounded-full bg-rose-500 text-white shadow-sm">
            ${count}
          </span>
        </button>

        ${u ? `
          <!-- User info -->
          <button id="nav-orders" data-testid="nav-orders" onclick="openOrders()"
            class="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold ${State.view === 'orders' ? 'text-blue-600 bg-blue-50/80' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'} transition">
            📦 Đơn hàng của tôi
          </button>

          ${u.role === 'admin' ? `
            <button id="nav-admin" data-testid="nav-admin" onclick="openAdmin()"
              class="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold ${State.view === 'admin' ? 'text-purple-600 bg-purple-50/80' : 'text-purple-700 bg-purple-100/60 hover:bg-purple-100'} transition">
              🛡️ Quản trị viên
            </button>
          ` : ''}

          <div class="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200/60">
            <span id="nav-user-badge" data-testid="nav-user-badge" class="text-xs font-bold text-slate-700 bg-white/70 px-2.5 py-1 rounded-lg border border-slate-200/50">
              👤 ${esc(u.fullName || u.name)} · ${u.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
            </span>
            <button id="nav-logout" data-testid="nav-logout" onclick="doLogout()"
              class="text-xs text-rose-600 hover:text-rose-700 font-bold px-2 py-1 rounded hover:bg-rose-50 transition">
              Đăng xuất
            </button>
          </div>
        ` : `
          <button id="nav-login" data-testid="nav-login" onclick="go('login')"
            class="hidden sm:inline-flex ps-btn ps-btn-ghost text-xs px-3.5 py-1.5">
            Đăng nhập
          </button>
          <button id="nav-register" data-testid="nav-register" onclick="go('register')"
            class="hidden sm:inline-flex ps-btn ps-btn-primary text-xs px-3.5 py-1.5 shadow-md shadow-blue-500/20">
            Đăng ký
          </button>
        `}

        <!-- Mobile Hamburger Button (Section 6 & 7.1) -->
        <button id="hamburger-btn" data-testid="hamburger-btn" onclick="toggleMobileMenu()"
          class="sm:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white/70 hover:bg-white text-slate-700 border border-white shadow-sm font-bold text-lg"
          aria-label="Menu">
          ${State.mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
    </div>

    <!-- Mobile Drawer Menu -->
    ${State.mobileMenuOpen ? `
      <div id="mobile-menu-drawer" data-testid="mobile-menu-drawer" class="sm:hidden border-t border-white/80 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-2 shadow-lg">
        <a href="#" onclick="go('products')" class="block py-2 px-3 rounded-xl font-bold text-sm text-slate-700 hover:bg-blue-50">🏠 Trang chủ</a>
        <a href="#" onclick="go('cart')" class="block py-2 px-3 rounded-xl font-bold text-sm text-slate-700 hover:bg-blue-50 flex justify-between items-center">
          <span>🛒 Giỏ hàng</span>
          <span class="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white">${count}</span>
        </a>
        ${u ? `
          <a href="#" onclick="openOrders()" class="block py-2 px-3 rounded-xl font-bold text-sm text-slate-700 hover:bg-blue-50">📦 Đơn hàng của tôi</a>
          ${u.role === 'admin' ? `<a href="#" onclick="openAdmin()" class="block py-2 px-3 rounded-xl font-bold text-sm text-purple-700 bg-purple-50 hover:bg-purple-100">🛡️ Quản trị viên</a>` : ''}
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-600">👤 ${esc(u.fullName || u.name)} · ${u.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</span>
            <button onclick="doLogout()" class="text-xs font-bold text-rose-600 hover:underline">Đăng xuất</button>
          </div>
        ` : `
          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <button onclick="go('login')" class="ps-btn ps-btn-ghost text-xs w-full">Đăng nhập</button>
            <button onclick="go('register')" class="ps-btn ps-btn-primary text-xs w-full">Đăng ký</button>
          </div>
        `}
      </div>
    ` : ''}
  </header>

  <!-- Mobile Search Modal (Section 6) -->
  ${State.searchModalOpen ? `
    <div id="search-modal" data-testid="search-modal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-4 pt-16">
      <div class="bg-white rounded-3xl p-5 w-full max-w-lg shadow-2xl space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 class="font-bold text-base text-slate-900">Tìm kiếm điện thoại</h3>
          <button onclick="closeSearchModal()" class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200">✕</button>
        </div>
        <div class="relative">
          <input id="modal-search-input" data-testid="modal-search-input" type="text"
            value="${esc(State.filter.search)}"
            oninput="onSearchInput(this.value)"
            placeholder="Tìm kiếm sản phẩm (iPhone, Galaxy, Xiaomi...)"
            class="ps-input pl-10 pr-4 py-3 w-full text-sm font-semibold" />
          <span class="absolute left-3.5 top-3.5 text-slate-400">🔍</span>
        </div>
        <div class="flex justify-end gap-2">
          <button onclick="resetFilters(); closeSearchModal()" class="ps-btn ps-btn-ghost text-xs">Xóa bộ lọc</button>
          <button onclick="closeSearchModal(); go('products')" class="ps-btn ps-btn-primary text-xs">Xem kết quả</button>
        </div>
      </div>
    </div>
  ` : ''}`;
}

// --- Product Catalog View (Section 6: 4 cols Desktop, 2-3 Tablet, 1 Mobile) ---
function viewProducts() {
  const fo = State.filterOptions;
  const brandList = fo && fo.brands && fo.brands.length ? fo.brands : ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo'];
  const brandOpts = [
    `<option value="">Tất cả thương hiệu</option>`,
    ...brandList.map((b) => `<option value="${b}" ${State.filter.brand === b ? 'selected' : ''}>${b}</option>`)
  ].join('');

  const ramList = fo && fo.ram && fo.ram.length ? fo.ram : [4, 8, 12];
  const ramOpts = [
    `<option value="">Tất cả RAM</option>`,
    ...ramList.map((r) => {
      const rNum = String(r).replace(/GB/i, '');
      const isSel = String(State.filter.ram).replace(/GB/i, '') === rNum;
      return `<option value="${rNum}GB" ${isSel ? 'selected' : ''}>${rNum}GB</option>`;
    })
  ].join('');

  const romList = fo && fo.rom && fo.rom.length ? fo.rom : [128, 256, 512];
  const romOpts = [
    `<option value="">Tất cả ROM</option>`,
    ...romList.map((r) => {
      const rNum = String(r).replace(/GB/i, '');
      const isSel = String(State.filter.rom).replace(/GB/i, '') === rNum;
      return `<option value="${rNum}GB" ${isSel ? 'selected' : ''}>${rNum}GB</option>`;
    })
  ].join('');

  const storageOpts = [
    `<option value="">Tất cả Bộ nhớ</option>`,
    ...['128GB', '256GB', '512GB', '1TB'].map((s) =>
      `<option value="${s}" ${State.filter.storage === s ? 'selected' : ''}>${s}</option>`)
  ].join('');

  const productCards = State.products.map((p) => productCardHTML(p)).join('');
  const curSlide = HERO_SLIDES[State.heroSlide || 0] || HERO_SLIDES[0];

  return `
  <main class="max-w-7xl mx-auto px-4 py-6 flex-1 w-full" id="view-products" data-testid="view-products">
    <!-- Premium Promotional Hero Slider / Carousel (Section 1) -->
    <div id="hero-slider" class="mb-8">
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-2xl border border-slate-800/80">
        <!-- Ambient lighting -->
        <div class="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute top-1/2 right-1/3 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12 min-h-[380px]">
          <!-- Cột trái: Tiêu đề thu hút, mô tả & CTA -->
          <div class="lg:col-span-7 space-y-5 text-left">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-black tracking-wide uppercase bg-gradient-to-r ${curSlide.badgeClass} border shadow-inner">
              <span class="animate-pulse">${curSlide.icon}</span> ${esc(curSlide.badge)}
            </div>

            <div class="space-y-2">
              <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                ${curSlide.title} <br/>
                <span class="${curSlide.highlightColor}">${curSlide.highlight}</span>
              </h1>
              <p class="text-xs sm:text-sm md:text-base text-slate-300 font-medium leading-relaxed max-w-xl">
                ${esc(curSlide.desc)}
              </p>
            </div>

            <!-- Call-to-action Buttons -->
            <div class="flex flex-wrap items-center gap-3 pt-1">
              <button onclick="onHeroCta('${esc(curSlide.brand)}')"
                class="px-6 py-3 rounded-full text-xs sm:text-sm font-extrabold bg-gradient-to-r ${curSlide.ctaBg} shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2">
                <span>Khám phá ngay</span>
                <span class="text-base font-bold">→</span>
              </button>
              <button onclick="scrollToGrid()"
                class="px-5 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all">
                Xem ưu đãi
              </button>
            </div>

            <!-- Slide Indicators -->
            <div class="flex items-center gap-2 pt-2">
              ${HERO_SLIDES.map((s, idx) => `
                <button onclick="setHeroSlide(${idx})"
                  class="h-2 rounded-full transition-all ${idx === (State.heroSlide || 0) ? 'w-8 bg-amber-400 shadow-sm' : 'w-2 bg-white/30 hover:bg-white/60'}"
                  aria-label="Slide ${idx + 1}" title="${esc(s.title)}">
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Cột phải: Hình ảnh đồ họa minh họa sản phẩm nổi bật tràn viền -->
          <div class="lg:col-span-5 flex items-center justify-center relative">
            <img id="hero-banner-image"
              src="${esc(curSlide.image || curSlide.img)}"
              alt="${esc(curSlide.alt || curSlide.title)}"
              referrerpolicy="no-referrer"
              class="relative z-10 w-64 sm:w-80 lg:w-96 max-h-[300px] sm:max-h-[340px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] transform hover:scale-105 transition-transform duration-500"
              onerror="this.onerror=null; this.src='${esc(curSlide.fallback || window.SAFE_FALLBACK_IMAGE || '/images/products/placeholder.png')}';" />
          </div>
        </div>
      </div>

      <!-- Quick Service Badges (Dưới Banner) -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div class="ps-card py-3.5 px-4 flex items-center gap-3 bg-white/80 backdrop-blur border border-slate-200/60 shadow-sm hover:shadow-md transition">
          <span class="text-2xl flex-shrink-0">🚚</span>
          <div>
            <p class="text-xs font-extrabold text-slate-800">Giao hàng 1h</p>
            <p class="text-[11px] text-slate-500">Miễn phí giao tận nơi</p>
          </div>
        </div>
        <div class="ps-card py-3.5 px-4 flex items-center gap-3 bg-white/80 backdrop-blur border border-slate-200/60 shadow-sm hover:shadow-md transition">
          <span class="text-2xl flex-shrink-0">🛡️</span>
          <div>
            <p class="text-xs font-extrabold text-slate-800">Bảo hành 12 tháng</p>
            <p class="text-[11px] text-slate-500">Chính hãng toàn quốc</p>
          </div>
        </div>
        <div class="ps-card py-3.5 px-4 flex items-center gap-3 bg-white/80 backdrop-blur border border-slate-200/60 shadow-sm hover:shadow-md transition">
          <span class="text-2xl flex-shrink-0">🔄</span>
          <div>
            <p class="text-xs font-extrabold text-slate-800">1 đổi 1 trong 30 ngày</p>
            <p class="text-[11px] text-slate-500">Nếu phát sinh lỗi NSX</p>
          </div>
        </div>
        <div class="ps-card py-3.5 px-4 flex items-center gap-3 bg-white/80 backdrop-blur border border-slate-200/60 shadow-sm hover:shadow-md transition">
          <span class="text-2xl flex-shrink-0">💳</span>
          <div>
            <p class="text-xs font-extrabold text-slate-800">Trả góp 0%</p>
            <p class="text-[11px] text-slate-500">Duyệt hồ sơ nhanh 15p</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Multi-criteria Filter Bar -->
    <div class="ps-card p-5 mb-8">
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <h2 class="text-sm font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-2">
          <span>⚙️</span> Bộ lọc nâng cao
        </h2>
        <span class="text-xs text-slate-500">Lọc theo thương hiệu, cấu hình và mức giá</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1" for="filter-brand">Thương hiệu</label>
          <select id="filter-brand" data-testid="select-brand" onchange="onFilterChange('brand', this.value)" class="form-select ps-input text-xs font-medium">
            ${brandOpts}
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1" for="filter-ram">Dung lượng RAM</label>
          <select id="filter-ram" data-testid="select-ram" onchange="onFilterChange('ram', this.value)" class="form-select ps-input text-xs font-medium">
            ${ramOpts}
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1" for="filter-rom">Bộ nhớ trong (ROM)</label>
          <select id="filter-rom" data-testid="select-rom" onchange="onFilterChange('rom', this.value)" class="form-select ps-input text-xs font-medium">
            ${romOpts}
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1" for="filter-sort">Sắp xếp theo</label>
          <select id="filter-sort" data-testid="select-sort" onchange="onFilterChange('sort', this.value)" class="form-select ps-input text-xs font-medium">
            <option value="newest" ${State.filter.sort === 'newest' ? 'selected' : ''}>Mới nhất</option>
            <option value="price_asc" ${State.filter.sort === 'price_asc' ? 'selected' : ''}>Giá: Thấp đến Cao</option>
            <option value="price_desc" ${State.filter.sort === 'price_desc' ? 'selected' : ''}>Giá: Cao đến Thấp</option>
          </select>
        </div>

        <div class="flex gap-2">
          <button id="btn-apply-filters" data-testid="btn-apply-filters" onclick="refreshProducts()"
            class="ps-btn ps-btn-primary text-xs flex-1 py-2.5">
            Lọc kết quả
          </button>
          <button id="btn-reset-filters" data-testid="btn-reset-filters" onclick="resetFilters()"
            class="ps-btn ps-btn-ghost text-xs px-3 py-2.5" title="Đặt lại bộ lọc">
            ↺
          </button>
        </div>
      </div>

      <div class="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Kết quả tìm thấy: <span id="result-count" data-testid="result-count" class="font-black text-blue-600">${State.products.length}</span> sản phẩm
        </div>
        <p id="filter-error-msg" data-testid="filter-error-msg" class="hidden text-rose-600 font-semibold"></p>
      </div>
    </div>

    <!-- Product Grid Section Heading -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
        <span>📱</span> Danh Sách Điện Thoại
      </h2>
      <span class="text-xs font-semibold text-slate-500">Hiển thị các dòng máy chính hãng mới nhất</span>
    </div>

    <!-- Product Grid: 4 cols on Desktop (gap 24px), 2-3 on Tablet, 1 on Mobile (Section 6) -->
    ${State.products.length ? `
      <div id="product-grid" data-testid="product-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        ${productCards}
      </div>
    ` : `
      <div id="catalog-empty" data-testid="catalog-empty" class="ps-card p-12 text-center my-8">
        <p class="text-5xl mb-3">🔍</p>
        <h3 class="text-lg font-bold text-slate-800">Không tìm thấy sản phẩm phù hợp</h3>
        <p class="text-xs text-slate-500 mt-1 mb-4">Vui lòng thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm.</p>
        <button onclick="resetFilters()" class="ps-btn ps-btn-primary text-xs">Đặt lại toàn bộ bộ lọc</button>
      </div>
    `}
  </main>`;
}

// Hero Slider Controls (Section 1)
function setHeroSlide(idx) {
  State.heroSlide = (idx + HERO_SLIDES.length) % HERO_SLIDES.length;
  render();
}

function onHeroCta(brand) {
  if (brand) {
    State.filter.brand = brand;
    const sel = byId('filter-brand') || byId('select-brand');
    if (sel) sel.value = brand;
    refreshProducts();
  }
  scrollToGrid();
}

function scrollToGrid() {
  const el = byId('product-grid') || byId('select-brand');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Product Card HTML conforming to Section 3.2, 6 & 7.1
function productCardHTML(p) {
  const minPrice = p.minPrice || p.price;
  const originalPrice = p.originalPrice || minPrice;
  const hasSale = originalPrice > minPrice;
  const salePct = hasSale ? Math.round((1 - minPrice / originalPrice) * 100) : 0;
  const totalStock = Array.isArray(p.variants)
    ? p.variants.reduce((s, v) => s + (Number(v.stock) || 0), 0)
    : (p.stock || 0);
  const isOutOfStock = totalStock <= 0;

  return `
  <div id="product-card-${esc(p.id)}" data-testid="product-card-${esc(p.id)}"
    class="ps-card p-4 h-full flex flex-col justify-between group hover:shadow-xl transition-all duration-300 relative">
    
    <!-- Badges -->
    <div class="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start pointer-events-none">
      <div class="flex items-center gap-1 flex-wrap">
        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/50 shadow-sm">
          Chính hãng VN/A
        </span>
        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50 shadow-sm">
          Trả góp 0%
        </span>
      </div>
      ${hasSale ? `<span class="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-rose-500 text-white shadow-sm">-${salePct}%</span>` : ''}
    </div>

    <div class="absolute top-3 right-3 z-10 pointer-events-none">
      <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 backdrop-blur text-slate-700 border border-slate-200/80 shadow-sm">
        ${esc(p.brand)}
      </span>
    </div>

    <!-- 1:1 Aspect Ratio Image Frame (Section 3.2 & 6) -->
    <div onclick="openDetails('${esc(p.id)}')"
      class="w-full cursor-pointer overflow-hidden rounded-2xl mt-5 bg-gray-50 flex items-center justify-center">
      <img id="product-image-${esc(p.id)}" data-testid="product-image-${esc(p.id)}"
        src="${esc(productImage(p))}" alt="${esc(p.name)}"
        referrerpolicy="no-referrer"
        class="w-full h-52 object-contain p-3 group-hover:scale-105 transition-transform duration-300"
        onerror="this.onerror=null; this.src=window.SAFE_FALLBACK_IMAGE;" />
    </div>

    <!-- Product Title & Info -->
    <div class="mt-3 flex-1 flex flex-col justify-between">
      <div>
        <!-- Title truncated to 2 lines (Section 6 & 7.1) -->
        <h3 id="product-title-${esc(p.id)}" data-testid="product-title-${esc(p.id)}"
          onclick="openDetails('${esc(p.id)}')"
          class="font-bold text-slate-800 text-sm line-clamp-2 h-10 overflow-hidden text-ellipsis cursor-pointer hover:text-blue-600 transition-colors"
          title="${esc(p.name)}">
          ${esc(p.name)}
        </h3>

        <!-- Price & Stock (Section 7.1) -->
        <div class="mt-2 flex items-baseline gap-2 flex-wrap">
          <span id="product-price-${esc(p.id)}" data-testid="product-price-${esc(p.id)}"
            class="text-base font-extrabold text-blue-700">
            ${fmtVND(minPrice)}
          </span>
          ${hasSale ? `<span class="text-xs text-slate-400 line-through">${fmtVND(originalPrice)}</span>` : ''}
        </div>

        <div class="mt-1 flex items-center justify-between text-xs">
          ${isOutOfStock ? `
            <span class="font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">HẾT HÀNG</span>
          ` : `
            <span class="font-semibold text-emerald-600">${totalStock} máy có sẵn</span>
          `}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-4 pt-3 border-t border-slate-100/80 flex items-center gap-2">
        <button onclick="openDetails('${esc(p.id)}')"
          class="ps-btn ps-btn-ghost text-xs flex-1 py-2 font-bold">
          Xem chi tiết
        </button>
        <button onclick="quickAdd('${esc(p.id)}')"
          ${isOutOfStock ? 'disabled' : ''}
          class="ps-btn ${isOutOfStock ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60' : 'ps-btn-primary'} text-xs px-3.5 py-2 font-bold"
          title="${isOutOfStock ? 'Hết hàng' : 'Mua ngay'}">
          ${isOutOfStock ? 'HẾT HÀNG' : 'Mua ngay'}
        </button>
      </div>
    </div>
  </div>`;
}

// --- Product Details Modal (BUG-01, BUG-02, Section 6, 7.1) ------------------
async function openDetails(productId) {
  const r = await api('GET', `/api/products/${productId}`);
  if (!r.ok || !r.data.product) {
    toast('Không tìm thấy thông tin sản phẩm.', 'error');
    return;
  }
  State.productDetail = r.data.product;
  State.selectedVariant = r.data.product.variants[0] || null;
  State.galleryIndex = 0;
  State.detailTab = 'spec';
  State.modalOpen = true;
  document.body.style.overflow = 'hidden';
  renderProductModal();
}

function closeDetails() {
  const m = byId('product-modal');
  if (m && m.parentElement) m.parentElement.removeChild(m);
  State.modalOpen = false;
  State.productDetail = null;
  State.selectedVariant = null;
  State.galleryIndex = 0;
  document.body.style.overflow = '';
}

function setDetailTab(tab) {
  State.detailTab = tab;
  renderProductModal();
}

// Multi-Image Gallery helpers (Section 1 & Multi-Image Gallery)
function getCurrentProductGallery() {
  const p = State.productDetail;
  if (!p) return [];
  const v = State.selectedVariant || (p.variants && p.variants[0]);
  
  const galleryLabels = [
    { label: 'Mặt trước', badge: '📱 Mặt trước (Màn hình)', desc: 'Màn hình sắc nét viền siêu mỏng, chính hãng' },
    { label: 'Góc nghiêng', badge: '📸 Chi tiết thiết kế', desc: 'Thiết kế nguyên khối cao cấp, camera đỉnh cao' },
    { label: 'Mặt sau', badge: '💎 Mặt lưng & Màu sắc', desc: 'Mặt lưng sang trọng cùng cụm camera' },
    { label: 'Góc cạnh', badge: '📐 Khung viền & Phím bấm', desc: 'Khung viền hoàn thiện tinh xảo, chống va đập' },
    { label: 'Mở hộp', badge: '📦 Hộp máy & Phụ kiện', desc: 'Trọn bộ hộp đóng gói chính hãng kèm phụ kiện' }
  ];

  let rawList = [];
  if (v && Array.isArray(v.gallery) && v.gallery.length) {
    rawList = v.gallery.map(x => (typeof x === 'string' ? x : x.url));
  } else if (Array.isArray(p.gallery) && p.gallery.length) {
    rawList = p.gallery.map(x => (typeof x === 'string' ? x : x.url));
  } else if (Array.isArray(p.images) && p.images.length) {
    rawList = [...p.images];
  }

  // Also collect any variant images to diversify angles
  if (Array.isArray(p.variants)) {
    for (const varItem of p.variants) {
      const u = varItem.imageUrl || varItem.image_url;
      if (u && !rawList.includes(u)) {
        rawList.push(u);
      }
    }
  }

  const primaryImg = (v && (v.imageUrl || v.image_url)) || p.imageUrl || p.image || IMG_FALLBACK;
  if (!rawList.length) {
    rawList.push(primaryImg);
  }
  // Ensure the active variant's image is at angle 0 (Front)
  if (v && (v.imageUrl || v.image_url)) {
    const varUrl = v.imageUrl || v.image_url;
    rawList = [varUrl, ...rawList.filter(u => u !== varUrl)];
  }

  // Guarantee exactly 5 angle images
  while (rawList.length < 5) {
    rawList.push(rawList[rawList.length % Math.max(1, rawList.length)]);
  }
  const fiveUrls = rawList.slice(0, 5);

  return fiveUrls.map((url, idx) => {
    const meta = galleryLabels[idx] || {
      label: `Góc nhìn ${idx + 1}`,
      badge: `📷 Hình ảnh thực tế ${idx + 1}`,
      desc: `Hình ảnh chi tiết sản phẩm chính hãng (${idx + 1})`
    };
    return {
      id: `img-${idx + 1}`,
      label: meta.label,
      badge: meta.badge,
      url: safeImageUrl(url),
      desc: meta.desc
    };
  });
}

function setGalleryIndex(idx) {
  const gal = getCurrentProductGallery();
  if (!gal.length) return;
  State.galleryIndex = (idx + gal.length) % gal.length;
  const item = gal[State.galleryIndex];
  const imgEl = byId('modal-product-image');
  if (imgEl && item) {
    imgEl.src = safeImageUrl(item.url);
    imgEl.alt = `${State.productDetail?.name || 'Sản phẩm'} - ${item.label}`;
  }
  const badgeEl = byId('modal-gallery-badge');
  if (badgeEl && item) {
    badgeEl.textContent = item.badge;
  }
  const counterEl = byId('modal-gallery-counter');
  if (counterEl) {
    counterEl.textContent = `${State.galleryIndex + 1} / ${gal.length}`;
  }
  const descEl = byId('modal-gallery-desc');
  if (descEl && item) {
    descEl.textContent = item.desc;
  }
  document.querySelectorAll('[id^="gallery-thumb-container-"]').forEach((el) => {
    const i = Number(el.getAttribute('data-gallery-idx'));
    if (i === State.galleryIndex) {
      el.className = 'flex flex-col items-center gap-1 p-1 rounded-xl border-2 border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/30 shadow-sm transition transform scale-105 cursor-pointer';
    } else {
      el.className = 'flex flex-col items-center gap-1 p-1 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-slate-50 transition cursor-pointer opacity-75 hover:opacity-100';
    }
  });
}

function prevGalleryImage() {
  const gal = getCurrentProductGallery();
  if (!gal.length) return;
  setGalleryIndex((State.galleryIndex || 0) - 1);
}

function nextGalleryImage() {
  const gal = getCurrentProductGallery();
  if (!gal.length) return;
  setGalleryIndex((State.galleryIndex || 0) + 1);
}

// BUG-01: Select variant color and instantly update main product image
function selectVariantColor(color) {
  if (!State.productDetail) return;
  const v = State.productDetail.variants.find((x) => x.color === color);
  if (v) {
    State.selectedVariant = v;
    State.galleryIndex = 0;
    const gal = getCurrentProductGallery();
    const item = gal[0] || {};
    const imgEl = byId('modal-product-image');
    if (imgEl) {
      imgEl.src = safeImageUrl(item.url || v.imageUrl || v.image_url);
    }
    const badgeEl = byId('modal-gallery-badge');
    if (badgeEl && item.badge) {
      badgeEl.textContent = item.badge;
    }
    const counterEl = byId('modal-gallery-counter');
    if (counterEl) {
      counterEl.textContent = `1 / ${gal.length}`;
    }
    // Update thumbnail gallery active border
    document.querySelectorAll('[id^="thumb-container-"]').forEach((el) => {
      if (el.id === `thumb-container-${color}`) {
        el.className = 'w-13 h-13 rounded-xl border-2 transition cursor-pointer p-1 bg-gray-50 flex items-center justify-center border-blue-600 ring-2 ring-blue-500/30';
      } else {
        el.className = 'w-13 h-13 rounded-xl border-2 transition cursor-pointer p-1 bg-gray-50 flex items-center justify-center border-slate-200 hover:border-slate-300';
      }
    });
    // Update gallery angle thumbnails images
    gal.forEach((g, idx) => {
      const thumbImg = byId(`gallery-thumb-${idx}-img`);
      if (thumbImg) thumbImg.src = safeImageUrl(g.url);
    });
    // Update select if present
    const sel = byId('select-variant');
    if (sel) sel.value = v.id;
    updateModalVariantState();
  }
}

// Select variant storage
function selectVariantStorage(storage) {
  if (!State.productDetail) return;
  const v = State.productDetail.variants.find((x) => String(x.storage).toUpperCase() === String(storage).toUpperCase());
  if (v) {
    State.selectedVariant = v;
    const gal = getCurrentProductGallery();
    const curIdx = State.galleryIndex || 0;
    const item = gal[curIdx] || gal[0];
    const imgEl = byId('modal-product-image');
    if (imgEl && item) {
      imgEl.src = safeImageUrl(item.url || v.imageUrl || v.image_url);
    }
    const sel = byId('select-variant');
    if (sel) sel.value = v.id;
    updateModalVariantState();
  }
}

function onDropdownVariantChange() {
  const sel = byId('select-variant');
  if (!sel || !State.productDetail) return;
  const v = State.productDetail.variants.find((x) => x.id === sel.value);
  if (v) {
    State.selectedVariant = v;
    // BUG-01: Update main image
    const imgEl = byId('modal-product-image');
    if (imgEl && (v.imageUrl || v.image_url)) {
      imgEl.src = v.imageUrl || v.image_url;
    }
    updateModalVariantState();
  }
}

// BUG-02: Check stock === 0, disable buttons, display "HẾT HÀNG", block click
function updateModalVariantState() {
  const v = State.selectedVariant;
  if (!v) return;

  const priceEl = byId('modal-product-price');
  if (priceEl) priceEl.textContent = fmtVND(v.price);

  const stockNote = byId('modal-stock-note');
  const badgeEl = byId('out-of-stock-badge-container');
  const addBtn = byId('add-to-cart-btn');
  const buyBtn = byId('buy-now-btn');
  const stickyAddBtn = byId('sticky-add-to-cart-btn');
  const stickyBuyBtn = byId('sticky-buy-now-btn');
  const qtyInput = byId('input-qty');

  const isOutOfStock = v.stock <= 0;

  if (isOutOfStock) {
    // BUG-02: Show out of stock badge
    if (badgeEl) {
      badgeEl.innerHTML = `<span id="out-of-stock-badge" data-testid="out-of-stock-badge" class="px-3 py-1 bg-rose-100 text-rose-700 font-extrabold text-xs rounded-full border border-rose-200">HẾT HÀNG</span>`;
    }
    if (stockNote) {
      stockNote.innerHTML = `<span class="text-rose-600 font-bold">Biến thể này hiện đã hết hàng trong kho.</span>`;
    }

    // Disable buttons and set text to "HẾT HÀNG"
    if (addBtn) {
      addBtn.disabled = true;
      addBtn.textContent = 'HẾT HÀNG';
      addBtn.className = 'ps-btn bg-slate-300 text-slate-500 cursor-not-allowed w-full h-[46px] text-sm font-bold opacity-60';
    }
    if (buyBtn) {
      buyBtn.disabled = true;
      buyBtn.textContent = 'HẾT HÀNG';
      buyBtn.className = 'ps-btn bg-slate-300 text-slate-500 cursor-not-allowed w-full h-[46px] text-sm font-bold opacity-60';
    }
    if (stickyAddBtn) {
      stickyAddBtn.disabled = true;
      stickyAddBtn.textContent = 'HẾT HÀNG';
      stickyAddBtn.className = 'ps-btn bg-slate-300 text-slate-500 cursor-not-allowed flex-1 text-xs font-bold';
    }
    if (stickyBuyBtn) {
      stickyBuyBtn.disabled = true;
      stickyBuyBtn.textContent = 'HẾT HÀNG';
      stickyBuyBtn.className = 'ps-btn bg-slate-300 text-slate-500 cursor-not-allowed flex-1 text-xs font-bold';
    }
    if (qtyInput) qtyInput.disabled = true;
  } else {
    // In stock
    if (badgeEl) {
      badgeEl.innerHTML = `<span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">Còn hàng (${v.stock} máy)</span>`;
    }
    if (stockNote) {
      stockNote.innerHTML = `Còn <span class="text-emerald-600 font-bold">${v.stock} sản phẩm</span> trong kho`;
    }

    if (addBtn) {
      addBtn.disabled = false;
      addBtn.textContent = '🛒 Thêm vào giỏ hàng';
      addBtn.className = 'ps-btn ps-btn-primary w-full h-[46px] shadow-lg shadow-blue-500/20 text-sm font-bold';
    }
    if (buyBtn) {
      buyBtn.disabled = false;
      buyBtn.textContent = '⚡ Mua ngay';
      buyBtn.className = 'ps-btn bg-amber-500 hover:bg-amber-600 text-white w-full h-[46px] text-sm font-bold shadow-lg shadow-amber-500/20';
    }
    if (stickyAddBtn) {
      stickyAddBtn.disabled = false;
      stickyAddBtn.textContent = '🛒 Thêm vào giỏ';
      stickyAddBtn.className = 'ps-btn ps-btn-primary flex-1 text-xs font-bold';
    }
    if (stickyBuyBtn) {
      stickyBuyBtn.disabled = false;
      stickyBuyBtn.textContent = '⚡ Mua ngay';
      stickyBuyBtn.className = 'ps-btn bg-amber-500 hover:bg-amber-600 text-white flex-1 text-xs font-bold';
    }
    if (qtyInput) {
      qtyInput.disabled = false;
      qtyInput.max = String(v.stock);
    }
  }

  // Update active state on color and storage buttons
  document.querySelectorAll('[data-testid^="variant-color-"]').forEach((btn) => {
    const c = btn.getAttribute('data-color');
    if (c === v.color) {
      btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-blue-600 bg-blue-50 text-blue-700 shadow-sm';
    } else {
      btn.className = 'px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:border-slate-300';
    }
  });

  document.querySelectorAll('[data-testid^="variant-storage-"]').forEach((btn) => {
    const s = btn.getAttribute('data-storage');
    if (s === v.storage) {
      btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-blue-600 bg-blue-50 text-blue-700 shadow-sm';
    } else {
      btn.className = 'px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:border-slate-300';
    }
  });
}

function renderProductModal() {
  const p = State.productDetail;
  if (!p) return;

  const existing = byId('product-modal');
  if (existing && existing.parentElement) existing.parentElement.removeChild(existing);

  const currentVariant = State.selectedVariant || p.variants[0] || {};
  const isOutOfStock = currentVariant.stock <= 0;

  // Colors list
  const uniqueColors = [...new Set(p.variants.map((v) => v.color))];
  const colorButtons = uniqueColors.map((c) => `
    <button type="button"
      id="variant-color-${esc(c)}"
      data-testid="variant-color-${esc(c)}"
      data-color="${esc(c)}"
      onclick="selectVariantColor('${esc(c)}')"
      class="px-3 py-1.5 rounded-xl text-xs font-bold transition ${currentVariant.color === c ? 'border-2 border-blue-600 bg-blue-50 text-blue-700' : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'}">
      ${esc(c)}
    </button>
  `).join('');

  // Storage list
  const uniqueStorages = [...new Set(p.variants.map((v) => v.storage))];
  const storageButtons = uniqueStorages.map((s) => `
    <button type="button"
      id="variant-storage-${esc(s)}"
      data-testid="variant-storage-${esc(s)}"
      data-storage="${esc(s)}"
      onclick="selectVariantStorage('${esc(s)}')"
      class="px-3 py-1.5 rounded-xl text-xs font-bold transition ${currentVariant.storage === s ? 'border-2 border-blue-600 bg-blue-50 text-blue-700' : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'}">
      ${esc(s)}
    </button>
  `).join('');

  // Dropdown options
  const dropdownOpts = p.variants.map((v) => `
    <option value="${esc(v.id)}" ${v.id === currentVariant.id ? 'selected' : ''}>
      ${esc(v.color)} - ${esc(v.storage)} (${fmtVND(v.price)})${v.stock <= 0 ? ' — HẾT HÀNG' : ''}
    </option>
  `).join('');

  // Spec Table
  const specRows = (() => {
    if (p.specDetails && typeof p.specDetails === 'object') {
      return Object.entries(p.specDetails).map(([k, val]) => `
        <tr class="spec-table-row border-b border-slate-100">
          <td class="py-2 px-3 text-xs font-bold text-slate-500 w-1/3 bg-slate-50/60">${esc(k)}</td>
          <td class="py-2 px-3 text-xs text-slate-800 font-medium">${esc(val)}</td>
        </tr>
      `).join('');
    }
    return (Array.isArray(p.specs) ? p.specs : []).map((s) => {
      const idx = s.indexOf(':');
      const label = idx !== -1 ? s.slice(0, idx) : 'Thông số';
      const val = idx !== -1 ? s.slice(idx + 1) : s;
      return `
        <tr class="spec-table-row border-b border-slate-100">
          <td class="py-2 px-3 text-xs font-bold text-slate-500 w-1/3 bg-slate-50/60">${esc(label)}</td>
          <td class="py-2 px-3 text-xs text-slate-800 font-medium">${esc(val)}</td>
        </tr>`;
    }).join('');
  })();

  const currentGallery = getCurrentProductGallery();
  const activeGalleryIndex = Math.min(State.galleryIndex || 0, Math.max(0, currentGallery.length - 1));
  State.galleryIndex = activeGalleryIndex;
  const activeGalleryItem = currentGallery[activeGalleryIndex] || currentGallery[0] || {};

  const overlay = document.createElement('div');
  overlay.className = 'liquid-modal-overlay';
  overlay.id = 'product-modal';
  overlay.setAttribute('data-testid', 'product-modal');
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDetails(); });

  overlay.innerHTML = `
  <div class="liquid-modal-content max-w-4xl w-full p-6 md:p-8 relative pb-24 sm:pb-8" role="dialog" aria-modal="true">
    <!-- Close button -->
    <button id="btn-close-modal" data-testid="btn-close-modal" onclick="closeDetails()"
      class="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-700 font-bold text-lg">
      ✕
    </button>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      <!-- Left Column: Multi-Image Gallery Stage & Interactive Thumbnails -->
      <div class="md:col-span-5 space-y-3">
        <!-- 1:1 Aspect Ratio Display Frame with Navigation & Badges -->
        <div class="aspect-square rounded-3xl bg-gray-50 p-4 flex items-center justify-center border border-slate-200/80 shadow-inner overflow-hidden relative group">
          <!-- Prev Button -->
          <button type="button" onclick="prevGalleryImage()" 
            class="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md flex items-center justify-center transition border border-slate-200 font-bold hover:scale-110 active:scale-95 text-lg"
            title="Góc ảnh trước">
            ‹
          </button>

          <!-- Main Image -->
          <img id="modal-product-image" data-testid="main-product-image"
            src="${esc(safeImageUrl(activeGalleryItem.url || currentVariant.imageUrl || productImage(p)))}"
            alt="${esc(p.name)} - ${esc(activeGalleryItem.label || '')}"
            referrerpolicy="no-referrer"
            class="aspect-square max-h-[250px] md:max-h-[280px] w-auto object-contain transition-all duration-300 drop-shadow-md group-hover:scale-105"
            onerror="this.onerror=null; this.src=window.SAFE_FALLBACK_IMAGE;" />

          <!-- Next Button -->
          <button type="button" onclick="nextGalleryImage()" 
            class="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md flex items-center justify-center transition border border-slate-200 font-bold hover:scale-110 active:scale-95 text-lg"
            title="Góc ảnh tiếp theo">
            ›
          </button>

          <!-- Brand Badge (Top-left) -->
          <span class="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/90 text-blue-700 shadow-sm border border-slate-100 pointer-events-none">
            ${esc(p.brand)}
          </span>

          <!-- Stock Badge (Top-right) -->
          <div id="out-of-stock-badge-container" class="absolute top-3 right-3 pointer-events-none">
            ${isOutOfStock ? `
              <span id="out-of-stock-badge" data-testid="out-of-stock-badge" class="px-3 py-1 bg-rose-100 text-rose-700 font-extrabold text-xs rounded-full border border-rose-200">
                HẾT HÀNG
              </span>
            ` : `
              <span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
                Chính Hãng VN/A
              </span>
            `}
          </div>

          <!-- Bottom Left: Active Angle Title Badge -->
          <div class="absolute bottom-2.5 left-3 pointer-events-none z-10">
            <span id="modal-gallery-badge" class="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-900/80 text-white backdrop-blur shadow-sm border border-white/10">
              ${esc(activeGalleryItem.badge || '📱 Mặt trước (Màn hình)')}
            </span>
          </div>

          <!-- Bottom Right: Counter Badge (1 / 5) -->
          <div class="absolute bottom-2.5 right-3 pointer-events-none z-10">
            <span id="modal-gallery-counter" class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/90 text-slate-700 shadow-sm border border-slate-200">
              ${activeGalleryIndex + 1} / ${currentGallery.length}
            </span>
          </div>
        </div>

        <!-- Multi-Angle Gallery Thumbnails (5 góc ảnh thực tế: Trước, Sau, Cạnh, Hộp, Thông số) -->
        <div class="mt-2">
          <div class="flex items-center justify-between mb-1.5">
            <label class="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
              <span>📸</span> Bảng ảnh chi tiết (${currentGallery.length} góc nhìn):
            </label>
            <span id="modal-gallery-desc" class="text-[10px] text-slate-400 font-medium truncate max-w-[170px]">
              ${esc(activeGalleryItem.desc || '')}
            </span>
          </div>
          <div class="grid grid-cols-5 gap-1.5" id="modal-gallery-angles">
            ${currentGallery.map((g, idx) => `
              <div onclick="setGalleryIndex(${idx})"
                onmouseenter="setGalleryIndex(${idx})"
                id="gallery-thumb-container-${idx}"
                data-gallery-idx="${idx}"
                class="flex flex-col items-center gap-1 p-1 rounded-xl transition cursor-pointer ${idx === activeGalleryIndex ? 'border-2 border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/30 shadow-sm scale-105' : 'border border-slate-200 bg-white hover:border-blue-400 hover:bg-slate-50 opacity-75 hover:opacity-100'}"
                title="${esc(g.badge)}: ${esc(g.desc)}">
                <div class="w-full aspect-square rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img id="gallery-thumb-${idx}-img"
                    src="${esc(safeImageUrl(g.url))}"
                    alt="${esc(g.label)}"
                    referrerpolicy="no-referrer"
                    class="w-full h-full object-contain p-0.5"
                    onerror="this.onerror=null; this.src=window.SAFE_FALLBACK_IMAGE;" />
                </div>
                <span class="text-[9px] font-bold text-slate-700 truncate w-full text-center leading-none">${esc(g.label)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Color Variant Thumbnails (Section 3.2 & 6.1) -->
        <div class="mt-3 pt-2.5 border-t border-slate-100">
          <label class="block text-[11px] font-bold text-slate-500 mb-1.5">Ảnh biến thể màu sắc:</label>
          <div class="flex flex-wrap gap-2" id="modal-thumbnails-gallery">
            ${p.variants.map((v) => `
              <div onclick="selectVariantColor('${esc(v.color)}')"
                id="thumb-container-${esc(v.color)}"
                class="w-13 h-13 rounded-xl border-2 transition cursor-pointer p-1 bg-gray-50 flex items-center justify-center ${currentVariant.color === v.color ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-slate-200 hover:border-slate-300'}"
                title="${esc(v.color)} - ${esc(v.storage)}">
                <img id="variant-thumb-${esc(v.color)}" data-testid="variant-thumb-${esc(v.color)}"
                  src="${esc(safeImageUrl(v.imageUrl || v.image_url || IMG_FALLBACK))}" alt="${esc(v.color)}"
                  referrerpolicy="no-referrer"
                  class="w-full h-full object-contain aspect-square"
                  onerror="this.onerror=null; this.src=window.SAFE_FALLBACK_IMAGE;" />
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Right Column: Specs & Purchasing -->
      <div class="md:col-span-7 space-y-4">
        <div>
          <!-- Title with standard H1: 28px - 32px Bold (Section 6 & 7.1) -->
          <h1 id="modal-product-title" data-testid="product-title-${esc(p.id)}"
            class="text-[28px] md:text-[32px] font-bold text-slate-900 leading-tight">
            ${esc(p.name)}
          </h1>
          <p class="text-xs text-slate-500 mt-1">Mã sản phẩm: ${esc(p.id)} · Thương hiệu: <span class="font-bold text-slate-700">${esc(p.brand)}</span></p>
          <div class="mt-2 flex items-baseline gap-3">
            <span id="modal-product-price" data-testid="product-price-${esc(p.id)}" class="text-2xl font-black text-blue-700">
              ${fmtVND(currentVariant.price)}
            </span>
          </div>
          <p id="modal-stock-note" data-testid="modal-stock-note" class="text-xs font-semibold mt-1 ${isOutOfStock ? 'text-rose-600' : 'text-emerald-600'}">
            ${isOutOfStock ? 'Biến thể này hiện đã hết hàng trong kho.' : `Còn ${currentVariant.stock} máy có sẵn trong kho`}
          </p>
        </div>

        <!-- Color Selector (BUG-01: updates image on color click) -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2">1. Chọn màu sắc:</label>
          <div class="flex flex-wrap gap-2">
            ${colorButtons}
          </div>
        </div>

        <!-- Storage Selector -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2">2. Chọn dung lượng:</label>
          <div class="flex flex-wrap gap-2">
            ${storageButtons}
          </div>
        </div>

        <!-- Select dropdown sync -->
        <div class="hidden">
          <select id="select-variant" data-testid="select-variant" onchange="onDropdownVariantChange()">
            ${dropdownOpts}
          </select>
        </div>

        <!-- Tabs: Spec & Warranty (Section 7.1: spec-tab & warranty-tab) -->
        <div class="border-t border-slate-200/80 pt-4">
          <div class="flex gap-2 border-b border-slate-200 mb-3">
            <button id="spec-tab" data-testid="spec-tab" onclick="setDetailTab('spec')"
              class="pb-2 px-3 text-xs font-bold border-b-2 transition ${State.detailTab === 'spec' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}">
              📋 Thông số kỹ thuật
            </button>
            <button id="warranty-tab" data-testid="warranty-tab" onclick="setDetailTab('warranty')"
              class="pb-2 px-3 text-xs font-bold border-b-2 transition ${State.detailTab === 'warranty' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}">
              🛡️ Bảo hành chính hãng 12 tháng
            </button>
          </div>

          ${State.detailTab === 'spec' ? `
            <div class="max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-white">
              <table class="w-full text-left border-collapse">${specRows}</table>
            </div>
          ` : `
            <div class="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 space-y-2 border border-slate-200">
              <p>✓ Bảo hành chính hãng 12 tháng tại các trung tâm ủy quyền toàn quốc.</p>
              <p>✓ 1 đổi 1 trong 30 ngày đầu nếu phát sinh lỗi phần cứng từ nhà sản xuất.</p>
              <p>✓ Hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng và công ty tài chính.</p>
            </div>
          `}
        </div>

        <!-- Quantity & Add to Cart (Desktop) -->
        <div class="hidden sm:flex items-center gap-3 pt-3">
          <div class="w-24">
            <label class="block text-[11px] font-bold text-slate-500 mb-1" for="input-qty">Số lượng</label>
            <input id="input-qty" data-testid="input-qty" type="number" min="1" max="${currentVariant.stock}" value="1"
              ${isOutOfStock ? 'disabled' : ''} class="ps-input text-center font-bold"/>
          </div>
          <div class="flex-1 self-end flex gap-2">
            <!-- BUG-02: data-testid="add-to-cart-btn" -->
            <button id="add-to-cart-btn" data-testid="add-to-cart-btn" onclick="addFromModal(false)"
              ${isOutOfStock ? 'disabled' : ''}
              class="ps-btn ${isOutOfStock ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60' : 'ps-btn-primary shadow-lg shadow-blue-500/20'} flex-1 h-[46px] text-sm font-bold">
              ${isOutOfStock ? 'HẾT HÀNG' : '🛒 Thêm vào giỏ hàng'}
            </button>
            <!-- BUG-02: data-testid="buy-now-btn" -->
            <button id="buy-now-btn" data-testid="buy-now-btn" onclick="addFromModal(true)"
              ${isOutOfStock ? 'disabled' : ''}
              class="ps-btn ${isOutOfStock ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60' : 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20'} px-5 h-[46px] text-sm font-bold">
              ${isOutOfStock ? 'HẾT HÀNG' : '⚡ Mua ngay'}
            </button>
          </div>
        </div>

        <p id="modal-error-msg" data-testid="modal-error-msg" class="hidden text-xs text-rose-600 font-bold mt-2"></p>
      </div>
    </div>

    <!-- Mobile Sticky Bottom Bar (Section 6 & 7.1) -->
    <div class="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 flex gap-2 shadow-xl">
      <button id="sticky-add-to-cart-btn" data-testid="add-to-cart-btn" onclick="addFromModal(false)"
        ${isOutOfStock ? 'disabled' : ''}
        class="ps-btn ${isOutOfStock ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60' : 'ps-btn-primary'} flex-1 text-xs font-bold py-3">
        ${isOutOfStock ? 'HẾT HÀNG' : '🛒 Thêm vào giỏ'}
      </button>
      <button id="sticky-buy-now-btn" data-testid="buy-now-btn" onclick="addFromModal(true)"
        ${isOutOfStock ? 'disabled' : ''}
        class="ps-btn ${isOutOfStock ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60' : 'bg-amber-500 hover:bg-amber-600 text-white'} flex-1 text-xs font-bold py-3">
        ${isOutOfStock ? 'HẾT HÀNG' : '⚡ Mua ngay'}
      </button>
    </div>
  </div>`;

  document.body.appendChild(overlay);
  updateModalVariantState();
}

function addFromModal(buyNow = false) {
  const v = State.selectedVariant;
  // BUG-02: Block click/submit if stock === 0
  if (!v || v.stock <= 0) {
    const err = byId('modal-error-msg');
    if (err) { err.className = 'text-xs text-rose-600 font-bold mt-2'; err.textContent = 'Sản phẩm này hiện đã hết hàng trong kho.'; }
    return;
  }

  const qtyInput = byId('input-qty');
  const q = qtyInput ? parseInt(qtyInput.value, 10) : 1;
  if (!q || q < 1) {
    const err = byId('modal-error-msg');
    if (err) { err.className = 'text-xs text-rose-600 font-bold mt-2'; err.textContent = 'Số lượng đặt mua phải từ 1 trở lên.'; }
    return;
  }

  if (addToCart(v.id, q)) {
    closeDetails();
    if (buyNow) {
      go('checkout');
    } else {
      toast('Đã thêm sản phẩm vào giỏ hàng thành công.', 'success');
    }
  } else {
    const err = byId('modal-error-msg');
    if (err) { err.className = 'text-xs text-rose-600 font-bold mt-2'; err.textContent = State.cartMsg.text || 'Không thể thêm số lượng này.'; }
  }
}

function quickAdd(productId) {
  const p = asArray(State.products).find((x) => x.id === productId);
  if (!p) return;
  const sorted = asArray(p.variants).slice().sort((a, b) => a.price - b.price);
  const v = sorted.find((x) => x.stock > 0);
  if (!v) {
    toast(`${p.name} hiện đang tạm hết hàng.`, 'error');
    return;
  }
  if (addToCart(v.id, 1)) {
    toast(`Đã thêm ${p.name} (${v.color}) vào giỏ hàng.`, 'success');
  }
}

// Add to Cart with inventory limit enforcement (BUG-03)
function addToCart(variantId, qty) {
  const v = findVariantLocal(variantId);
  if (!v) {
    State.cartMsg = { type: 'error', text: 'Phiên bản này hiện không còn khả dụng.', testid: 'cart-error-msg' };
    return false;
  }

  const existing = State.cart.find((i) => i.variantId === variantId);
  const current = existing ? existing.qty : 0;
  const next = current + qty;

  // BUG-03 constraint
  if (next > v.stock) {
    State.cartMsg = {
      type: 'error',
      text: `Chỉ còn ${v.stock} sản phẩm trong kho!`,
      testid: 'cart-error-msg'
    };
    toast(`Chỉ còn ${v.stock} sản phẩm trong kho!`, 'error');
    return false;
  }

  if (existing) {
    existing.qty = next;
  } else {
    State.cart.push({ variantId, qty });
  }

  saveCart();
  syncCartWithDb();
  render();
  return true;
}

// --- Cart View & Limits (BUG-03, Section 6 & 7.1) -----------------------------
function viewCart() {
  const totals = computeTotals();

  // Desktop Table Rows
  const tableRows = State.cart.map((it) => {
    const v = findVariantLocal(it.variantId);
    if (!v) return '';
    const isAtLimit = it.qty >= v.stock;
    return `
    <tr id="cart-item-${esc(v.id)}" data-testid="cart-item-${esc(v.id)}" class="border-b border-slate-100 hover:bg-slate-50/50">
      <td class="py-3 px-3">
        <div class="flex items-center gap-3">
          <img id="cart-item-image-${esc(v.id)}" data-testid="cart-item-image-${esc(v.id)}"
            src="${esc(safeImageUrl(v.imageUrl || IMG_FALLBACK))}" alt="${esc(v.productName)}"
            referrerpolicy="no-referrer"
            class="w-16 h-16 object-contain aspect-square rounded-lg bg-white border border-slate-200 p-1 shrink-0"
            onerror="this.onerror=null; this.src=window.SAFE_FALLBACK_IMAGE;" />
          <div>
            <h4 class="font-bold text-xs text-slate-900">${esc(v.productName)}</h4>
            <p class="text-[11px] text-slate-500">${esc(v.color)} · ${esc(v.storage)}</p>
          </div>
        </div>
      </td>
      <td class="py-3 px-3 text-xs font-bold text-slate-700">${fmtVND(v.price)}</td>
      <td class="py-3 px-3">
        <div class="flex items-center gap-1.5">
          <button id="cart-qty-dec-${esc(v.id)}" data-testid="cart-qty-dec-${esc(v.id)}" onclick="changeCartQty('${esc(v.id)}', -1)"
            class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">-</button>
          
          <input id="cart-qty-input-${esc(v.id)}" data-testid="cart-qty-input-${esc(v.id)}" type="number" min="1" max="${v.stock}" value="${it.qty}"
            onchange="setCartQty('${esc(v.id)}', this.value)"
            class="w-12 text-center text-xs font-bold py-1 border border-slate-200 rounded-lg"/>
          
          <!-- BUG-03: [+] button cannot exceed stock -->
          <button id="cart-qty-inc-${esc(v.id)}" data-testid="cart-qty-inc-${esc(v.id)}" onclick="changeCartQty('${esc(v.id)}', 1)"
            ${isAtLimit ? 'disabled' : ''}
            class="w-7 h-7 rounded-lg ${isAtLimit ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'} flex items-center justify-center font-bold text-xs">+</button>
        </div>
        ${isAtLimit ? `<p class="text-[10px] text-amber-600 font-bold mt-1">Đã đạt tối đa tồn kho (${v.stock})</p>` : ''}
      </td>
      <td class="py-3 px-3 text-xs font-extrabold text-blue-700">${fmtVND(v.price * it.qty)}</td>
      <td class="py-3 px-3 text-right">
        <button onclick="removeFromCart('${esc(v.id)}')" class="text-rose-600 hover:text-rose-700 text-xs font-bold">Xóa</button>
      </td>
    </tr>`;
  }).join('');

  // Mobile Cards List (Section 6: Responsive mobile card list)
  const mobileCards = State.cart.map((it) => {
    const v = findVariantLocal(it.variantId);
    if (!v) return '';
    const isAtLimit = it.qty >= v.stock;
    return `
    <div id="cart-item-mobile-${esc(v.id)}" data-testid="cart-item-${esc(v.id)}" class="ps-card p-3 flex gap-3 items-center">
      <img id="cart-item-image-m-${esc(v.id)}" data-testid="cart-item-image-${esc(v.id)}"
        src="${esc(safeImageUrl(v.imageUrl || IMG_FALLBACK))}" alt="${esc(v.productName)}"
        referrerpolicy="no-referrer"
        class="w-16 h-16 object-contain aspect-square rounded-lg bg-white border border-slate-200 p-1 shrink-0"
        onerror="this.onerror=null; this.src=window.SAFE_FALLBACK_IMAGE;" />
      <div class="flex-1">
        <h4 class="font-bold text-xs text-slate-900">${esc(v.productName)}</h4>
        <p class="text-[11px] text-slate-500">${esc(v.color)} · ${esc(v.storage)}</p>
        <div class="mt-1 flex items-center justify-between">
          <span class="text-xs font-black text-blue-700">${fmtVND(v.price * it.qty)}</span>
          <div class="flex items-center gap-1">
            <button data-testid="cart-qty-dec-${esc(v.id)}" onclick="changeCartQty('${esc(v.id)}', -1)"
              class="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-bold text-xs">-</button>
            <input data-testid="cart-qty-input-${esc(v.id)}" type="text" readonly value="${it.qty}"
              class="w-8 text-center text-xs font-bold"/>
            <button data-testid="cart-qty-inc-${esc(v.id)}" onclick="changeCartQty('${esc(v.id)}', 1)"
              ${isAtLimit ? 'disabled' : ''}
              class="w-6 h-6 rounded ${isAtLimit ? 'bg-slate-200 text-slate-400' : 'bg-slate-100'} flex items-center justify-center font-bold text-xs">+</button>
          </div>
        </div>
      </div>
      <button onclick="removeFromCart('${esc(v.id)}')" class="text-rose-600 p-2 font-bold text-sm">✕</button>
    </div>`;
  }).join('');

  return `
  <main class="max-w-6xl mx-auto px-4 py-8 flex-1 w-full" id="cart-drawer" data-testid="cart-drawer">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-black text-slate-900">🛒 Giỏ hàng của bạn</h1>
      <button onclick="go('products')" class="ps-btn ps-btn-ghost text-xs">← Tiếp tục mua sắm</button>
    </div>

    ${State.cartMsg.text ? `
      <div id="${State.cartMsg.testid || 'cart-error-msg'}" data-testid="${State.cartMsg.testid || 'cart-error-msg'}"
        class="mb-4 p-3 rounded-2xl ${State.cartMsg.type === 'error' ? 'bg-rose-50 border border-rose-200 text-rose-700' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'} text-xs font-bold flex items-center justify-between">
        <span>${esc(State.cartMsg.text)}</span>
        <button onclick="State.cartMsg = { text: '', type: '' }; render()" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
      </div>
    ` : ''}

    ${State.cart.length ? `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Cart Items List: Table on Desktop, Cards on Mobile (Section 6) -->
        <div class="lg:col-span-8 space-y-4">
          <!-- Desktop Table -->
          <div class="hidden sm:block ps-card overflow-hidden">
            <table class="w-full text-left">
              <thead class="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th class="py-3 px-3">Sản phẩm</th>
                  <th class="py-3 px-3">Đơn giá</th>
                  <th class="py-3 px-3">Số lượng</th>
                  <th class="py-3 px-3">Thành tiền</th>
                  <th class="py-3 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>${tableRows}</tbody>
            </table>
          </div>

          <!-- Mobile Cards List -->
          <div class="sm:hidden space-y-3">
            ${mobileCards}
          </div>

          <div class="flex justify-between items-center pt-2">
            <button onclick="clearCart()" class="text-xs font-bold text-rose-600 hover:underline">Xóa toàn bộ giỏ hàng</button>
          </div>
        </div>

        <!-- Summary & Next Step -->
        <div class="lg:col-span-4 ps-card p-6 space-y-4">
          <h3 class="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">Tóm tắt đơn hàng</h3>
          
          <div class="space-y-2 text-xs">
            <div class="flex justify-between text-slate-600">
              <span>Tạm tính:</span>
              <span id="subtotal-amount" data-testid="subtotal-amount" class="font-bold text-slate-800">${fmtVND(totals.subtotal)}</span>
            </div>
            ${State.coupon ? `
              <div class="flex justify-between text-emerald-600 font-bold">
                <span>Giảm giá (${esc(State.coupon.code)}):</span>
                <span id="discount-amount" data-testid="discount-amount">- ${fmtVND(totals.discount)}</span>
              </div>
            ` : ''}
            <div class="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span class="text-sm font-bold text-slate-800">Tổng tiền thanh toán:</span>
              <span class="text-xl font-black text-blue-700">${fmtVND(Math.max(0, totals.subtotal - totals.discount))}</span>
            </div>
          </div>

          <button onclick="go('checkout')" class="ps-btn ps-btn-primary w-full py-3 text-sm font-bold shadow-lg shadow-blue-500/20">
            Tiến hành thanh toán →
          </button>
        </div>
      </div>
    ` : `
      <div class="ps-card p-12 text-center my-6">
        <p class="text-6xl mb-4">🛒</p>
        <h2 class="text-xl font-bold text-slate-800">Giỏ hàng của bạn đang trống</h2>
        <p class="text-xs text-slate-500 mt-1 mb-6">Hãy dạo một vòng cửa hàng và chọn cho mình chiếc điện thoại ưng ý nhé!</p>
        <button onclick="go('products')" class="ps-btn ps-btn-primary text-xs">Mua sắm ngay</button>
      </div>
    `}
  </main>`;
}

// BUG-03: Change cart quantity with strict stock limit check
function changeCartQty(variantId, delta) {
  const it = State.cart.find((i) => i.variantId === variantId);
  const v = findVariantLocal(variantId);
  if (!it || !v) return;

  const next = it.qty + delta;

  // BUG-03: [+] button cannot increase beyond stock
  if (delta > 0 && next > v.stock) {
    State.cartMsg = {
      type: 'error',
      text: `Chỉ còn ${v.stock} sản phẩm trong kho!`,
      testid: 'cart-error-msg'
    };
    toast(`Chỉ còn ${v.stock} sản phẩm trong kho!`, 'error');
    render();
    return;
  }

  if (next < 1) return; // Minimum is 1, use remove button to delete

  it.qty = next;
  saveCart();
  syncCartWithDb();
  State.cartMsg = { type: '', text: '' };
  render();
}

function setCartQty(variantId, rawVal) {
  const q = parseInt(rawVal, 10);
  const it = State.cart.find((i) => i.variantId === variantId);
  const v = findVariantLocal(variantId);
  if (!it || !v) return;

  if (isNaN(q) || q < 1) {
    it.qty = 1;
  } else if (q > v.stock) {
    // BUG-03
    it.qty = v.stock;
    State.cartMsg = {
      type: 'error',
      text: `Chỉ còn ${v.stock} sản phẩm trong kho!`,
      testid: 'cart-error-msg'
    };
    toast(`Chỉ còn ${v.stock} sản phẩm trong kho!`, 'error');
  } else {
    it.qty = q;
  }

  saveCart();
  syncCartWithDb();
  render();
}

function removeFromCart(variantId) {
  State.cart = State.cart.filter((i) => i.variantId !== variantId);
  saveCart();
  syncCartWithDb();
  render();
}

function clearCart() {
  State.cart = [];
  State.coupon = null;
  saveCart();
  syncCartWithDb();
  render();
}

// --- Checkout View (BUG-04, 05, 06, 07, Section 6 & 7.1) ---------------------
function viewCheckout() {
  if (!State.user) {
    return `
    <main class="max-w-lg mx-auto px-4 py-16 text-center flex-1" id="view-checkout" data-testid="view-checkout">
      <div class="ps-card p-8 space-y-4">
        <p class="text-5xl">🔒</p>
        <h1 class="text-2xl font-bold text-slate-900">Vui lòng đăng nhập</h1>
        <p class="text-xs text-slate-500">Bạn cần có tài khoản để tiến hành đặt hàng và theo dõi tình trạng giao hàng.</p>
        <div class="flex gap-2 justify-center pt-2">
          <button onclick="go('login')" class="ps-btn ps-btn-primary text-xs">Đăng nhập ngay</button>
          <button onclick="go('register')" class="ps-btn ps-btn-ghost text-xs">Đăng ký mới</button>
        </div>
      </div>
    </main>`;
  }

  if (!State.cart.length) {
    return `
    <main class="max-w-lg mx-auto px-4 py-16 text-center flex-1">
      <div class="ps-card p-8 space-y-4">
        <p class="text-5xl">🛒</p>
        <h1 class="text-xl font-bold text-slate-800">Giỏ hàng của bạn đang trống</h1>
        <p class="text-xs text-slate-500">Thêm sản phẩm vào giỏ trước khi thanh toán.</p>
        <button onclick="go('products')" class="ps-btn ps-btn-primary text-xs">Mua sắm ngay</button>
      </div>
    </main>`;
  }

  const totals = computeTotals();

  const lines = State.cart.map((it) => {
    const v = findVariantLocal(it.variantId);
    if (!v) return '';
    return `
    <li class="flex justify-between items-center py-2 text-xs border-b border-slate-100">
      <div>
        <p class="font-bold text-slate-800">${esc(v.productName)}</p>
        <p class="text-slate-400 text-[11px]">${esc(v.color)} · ${esc(v.storage)} × ${it.qty}</p>
      </div>
      <span class="font-extrabold text-slate-800">${fmtVND(v.price * it.qty)}</span>
    </li>`;
  }).join('');

  return `
  <main class="max-w-6xl mx-auto px-4 py-8 flex-1 w-full" id="view-checkout" data-testid="view-checkout">
    <h1 class="text-2xl font-black text-slate-900 mb-6">📦 Thanh toán đơn hàng</h1>
    <p id="order-error-msg" data-testid="order-error-msg" class="hidden text-xs text-rose-600 font-bold mb-4 p-3 bg-rose-50 rounded-xl border border-rose-200"></p>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Shipping Information Form -->
      <div class="lg:col-span-7 ps-card p-6 space-y-4">
        <h2 class="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">1. Thông tin giao hàng</h2>
        
        <form onsubmit="event.preventDefault(); submitOrder()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1" for="input-checkout-fullname">Họ và tên *</label>
            <input id="input-checkout-fullname" data-testid="register-fullname-input" value="${esc(State.user.fullName || State.user.name)}"
              placeholder="Ví dụ: Nguyễn Văn A" class="ps-input text-xs font-medium" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1" for="input-checkout-phone">Số điện thoại *</label>
            <input id="input-checkout-phone" data-testid="register-phone-input" value="${esc(State.user.phone)}"
              placeholder="Ví dụ: 0912345678" class="ps-input text-xs font-medium" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1" for="input-checkout-address">Địa chỉ nhận hàng *</label>
            <textarea id="input-checkout-address" data-testid="input-checkout-address" rows="2"
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..." class="ps-input text-xs font-medium"></textarea>
          </div>

          <!-- Shipping Provider Selection (BUG-04, BUG-05, BUG-06, Section 7.1) -->
          <div class="pt-2 border-t border-slate-100">
            <label class="block text-xs font-bold text-slate-700 mb-2">2. Đơn vị vận chuyển (Cập nhật tức thì phí ship):</label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <!-- GHN: 30.000đ -->
              <label class="ps-card p-3 flex flex-col justify-between cursor-pointer border-2 transition ${State.shippingProvider === 'GHN' ? 'border-blue-600 bg-blue-50/60' : 'border-slate-200'}">
                <div class="flex items-center gap-2">
                  <input type="radio" name="shipping-provider" value="GHN" id="shipping-provider-ghn" data-testid="shipping-provider-ghn"
                    ${State.shippingProvider === 'GHN' ? 'checked' : ''} onchange="setShippingProvider('GHN')" class="text-blue-600"/>
                  <span class="font-bold text-xs text-slate-800">GHN Express</span>
                </div>
                <span class="text-xs font-black text-blue-700 mt-2">30.000₫</span>
              </label>

              <!-- GHTK: 25.000đ -->
              <label class="ps-card p-3 flex flex-col justify-between cursor-pointer border-2 transition ${State.shippingProvider === 'GHTK' ? 'border-blue-600 bg-blue-50/60' : 'border-slate-200'}">
                <div class="flex items-center gap-2">
                  <input type="radio" name="shipping-provider" value="GHTK" id="shipping-provider-ghtk" data-testid="shipping-provider-ghtk"
                    ${State.shippingProvider === 'GHTK' ? 'checked' : ''} onchange="setShippingProvider('GHTK')" class="text-blue-600"/>
                  <span class="font-bold text-xs text-slate-800">GHTK</span>
                </div>
                <span class="text-xs font-black text-blue-700 mt-2">25.000₫</span>
              </label>

              <!-- Viettel Post: 20.000đ -->
              <label class="ps-card p-3 flex flex-col justify-between cursor-pointer border-2 transition ${State.shippingProvider === 'Viettel Post' ? 'border-blue-600 bg-blue-50/60' : 'border-slate-200'}">
                <div class="flex items-center gap-2">
                  <input type="radio" name="shipping-provider" value="Viettel Post" id="shipping-provider-vtpost" data-testid="shipping-provider-vtpost"
                    ${State.shippingProvider === 'Viettel Post' ? 'checked' : ''} onchange="setShippingProvider('Viettel Post')" class="text-blue-600"/>
                  <span class="font-bold text-xs text-slate-800">Viettel Post</span>
                </div>
                <span class="text-xs font-black text-blue-700 mt-2">20.000₫</span>
              </label>
            </div>
          </div>

          <!-- Order Note (Sanitized for XSS - Section 5.2) -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1" for="input-checkout-note">Ghi chú đơn hàng (chống XSS)</label>
            <input id="input-checkout-note" data-testid="input-checkout-note" placeholder="Ví dụ: Giao vào giờ hành chính..." class="ps-input text-xs" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1" for="select-payment">Phương thức thanh toán</label>
            <select id="select-payment" data-testid="select-payment" class="ps-input text-xs font-medium">
              <option value="cod">Thanh toán khi nhận hàng (COD)</option>
              <option value="bank">Chuyển khoản ngân hàng (Mô phỏng)</option>
            </select>
          </div>

          <!-- Submit Order Button (Section 7.1: checkout-submit-btn) -->
          <div class="pt-4">
            <button id="checkout-submit-btn" data-testid="checkout-submit-btn" type="submit"
              class="ps-btn ps-btn-primary w-full py-3.5 text-sm font-bold shadow-xl shadow-blue-500/20">
              Xác nhận đặt hàng (${fmtVND(totals.grandTotal)})
            </button>
          </div>
        </form>
      </div>

      <!-- Order Summary Card -->
      <div class="lg:col-span-5 ps-card p-6 space-y-4">
        <h3 class="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">Sản phẩm thanh toán</h3>
        <ul class="divide-y divide-slate-100 max-h-52 overflow-y-auto">${lines}</ul>

        <!-- Voucher Input (Section 7.1: voucher-input & apply-voucher-btn) -->
        <div class="pt-2 border-t border-slate-100 space-y-2">
          <label class="block text-xs font-bold text-slate-700">Mã giảm giá (Voucher):</label>
          <div class="flex gap-2">
            <input id="voucher-input" data-testid="voucher-input"
              value="${State.coupon ? esc(State.coupon.code) : ''}"
              placeholder="Ví dụ: SALE10" class="ps-input text-xs uppercase font-bold" />
            <button id="apply-voucher-btn" data-testid="apply-voucher-btn" onclick="applyCoupon()"
              class="ps-btn ps-btn-primary text-xs px-4 py-2 shrink-0">
              Áp dụng
            </button>
          </div>
          ${State.couponMsg.text ? `
            <p id="coupon-error-msg" data-testid="coupon-error-msg"
              class="text-[11px] font-bold ${State.couponMsg.type === 'error' ? 'text-rose-600' : 'text-emerald-600'}">
              ${esc(State.couponMsg.text)}
            </p>
          ` : ''}
          <p class="text-[10px] text-slate-400">Gợi ý mã: <b>SALE10</b> (Giảm 10%, tối đa 500k) · <b>GIAM50K</b> (Giảm 50.000đ)</p>
        </div>

        <!-- Price Breakdown (Section 7.1 & BUG-07) -->
        <div class="pt-3 border-t border-slate-100 space-y-2 text-xs">
          <!-- Subtotal amount -->
          <div class="flex justify-between text-slate-600">
            <span>Tạm tính:</span>
            <span id="subtotal-amount" data-testid="subtotal-amount" class="font-bold text-slate-900">${fmtVND(totals.subtotal)}</span>
          </div>

          <!-- Shipping fee amount (BUG-04, 05, 06) -->
          <div class="flex justify-between text-slate-600">
            <span>Phí vận chuyển (${esc(State.shippingProvider)}):</span>
            <span id="shipping-fee-amount" data-testid="shipping-fee-amount" class="font-bold text-blue-700">+ ${fmtVND(totals.shippingFee)}</span>
          </div>

          <!-- Discount amount (BUG-07: calculated on subtotal before shipping) -->
          <div class="flex justify-between ${totals.discount > 0 ? 'text-emerald-600' : 'text-slate-400'}">
            <span>Giảm giá:</span>
            <span id="discount-amount" data-testid="discount-amount" class="font-bold">- ${fmtVND(totals.discount)}</span>
          </div>

          <!-- Total amount (BUG-07: Subtotal + ShippingFee - Discount) -->
          <div class="pt-3 border-t border-slate-200/80 flex justify-between items-baseline">
            <span class="text-sm font-black text-slate-900">Tổng tiền thanh toán:</span>
            <span id="total-amount" data-testid="total-amount" class="text-2xl font-black text-blue-700">
              ${fmtVND(totals.grandTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  </main>`;
}

// BUG-04, 05, 06: Set shipping provider and recalculate immediately
function setShippingProvider(provider) {
  if (SHIPPING_RATES[provider] != null) {
    State.shippingProvider = provider;
    State.shippingFee = SHIPPING_RATES[provider];
    render();
  }
}

// BUG-07: Apply coupon on subtotal
async function applyCoupon() {
  const code = inputVal('voucher-input').toUpperCase();
  if (!code) {
    State.coupon = null;
    State.couponMsg = { type: 'error', text: 'Vui lòng nhập mã voucher.' };
    render();
    return;
  }

  const totals = computeTotals();
  const res = await api('GET', `/api/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${totals.subtotal}`);
  const d = res.data;

  if (res.ok && d && (d.valid || (d.data && d.data.valid))) {
    const data = d.data || d;
    State.coupon = {
      code: data.code,
      type: data.type,
      value: data.value,
      maxDiscount: data.maxDiscount || 0
    };
    State.couponMsg = { type: 'success', text: d.message || `Mã ${data.code} áp dụng thành công!` };
    toast(d.message || `Đã áp dụng mã giảm giá ${data.code}.`, 'success');
  } else {
    State.coupon = null;
    State.couponMsg = { type: 'error', text: d.message || 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' };
  }
  render();
}

// Order submission with two-tier validation and F5 refresh prevention
async function submitOrder() {
  const err = byId('order-error-msg');
  if (err) err.className = 'hidden';

  const fullName = inputVal('input-checkout-fullname');
  const phone = inputVal('input-checkout-phone');
  const address = inputVal('input-checkout-address');
  const paymentMethod = inputVal('select-payment') || 'cod';
  const note = inputVal('input-checkout-note');

  // Client-side Two-Tier Validation (Section 5.1)
  if (!fullName || fullName.length < 2 || fullName.length > 50 || !NAME_RE.test(fullName)) {
    if (err) {
      err.className = 'text-xs text-rose-600 font-bold mb-4 p-3 bg-rose-50 rounded-xl border border-rose-200';
      err.textContent = 'Họ và tên người nhận phải từ 2-50 ký tự và không chứa số hay ký tự đặc biệt.';
    }
    return;
  }

  if (!phone || !PHONE_RE.test(phone)) {
    if (err) {
      err.className = 'text-xs text-rose-600 font-bold mb-4 p-3 bg-rose-50 rounded-xl border border-rose-200';
      err.textContent = 'Số điện thoại phải đúng 10 số và bắt đầu bằng đầu số di động hợp lệ (03, 05, 07, 08, 09).';
    }
    return;
  }

  if (!address || address.length < 5) {
    if (err) {
      err.className = 'text-xs text-rose-600 font-bold mb-4 p-3 bg-rose-50 rounded-xl border border-rose-200';
      err.textContent = 'Địa chỉ giao hàng phải từ 5 ký tự trở lên.';
    }
    return;
  }

  const items = State.cart.map((i) => ({ variantId: i.variantId, qty: i.qty }));

  const r = await api('POST', '/api/orders', {
    fullName,
    phone,
    address,
    shippingProvider: State.shippingProvider,
    paymentMethod,
    note,
    voucherCode: State.coupon ? State.coupon.code : null,
    items
  });

  if (!r.ok) {
    if (err) {
      err.className = 'text-xs text-rose-600 font-bold mb-4 p-3 bg-rose-50 rounded-xl border border-rose-200';
      err.textContent = r.data.message || 'Không thể hoàn tất đơn hàng. Vui lòng kiểm tra lại.';
    }
    toast(r.data.message || 'Lỗi đặt hàng.', 'error');
    return;
  }

  const order = r.data.order || (r.data.data && r.data.data.order);
  State.lastOrder = order;

  // Clear cart upon successful order creation
  State.cart = [];
  State.coupon = null;
  saveCart();

  // Switch to success view (F5 won't re-submit order)
  go('checkout-success');
  toast(`Đặt hàng thành công! Mã đơn: ${order.id}`, 'success');
}

// Order Success View (Section 6: F5 / Page Refresh handles idempotently)
function viewCheckoutSuccess() {
  const o = State.lastOrder;
  if (!o) {
    return `
    <main class="max-w-lg mx-auto px-4 py-16 text-center flex-1">
      <div class="ps-card p-8 space-y-4">
        <p class="text-5xl">📋</p>
        <h2 class="text-xl font-bold text-slate-800">Không tìm thấy thông tin đơn hàng vừa tạo</h2>
        <button onclick="go('products')" class="ps-btn ps-btn-primary text-xs">Về trang chủ</button>
      </div>
    </main>`;
  }

  return `
  <main class="max-w-2xl mx-auto px-4 py-10 flex-1 w-full" id="checkout-success" data-testid="checkout-success">
    <div class="ps-card p-8 text-center space-y-4 border-2 border-emerald-500/30">
      <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-black mx-auto">
        ✓
      </div>
      <h1 class="text-2xl font-black text-slate-900">Đặt Hàng Thành Công!</h1>
      <p class="text-xs text-slate-600">Cảm ơn bạn đã mua hàng tại PhoneStore. Đơn hàng của bạn đã được ghi nhận vào hệ thống.</p>

      <div class="p-4 bg-slate-50/80 rounded-2xl text-left text-xs space-y-2 border border-slate-200">
        <div class="flex justify-between"><span class="text-slate-500">Mã đơn hàng:</span><span class="font-mono font-bold text-blue-700">${esc(o.id)}</span></div>
        <div class="flex justify-between"><span class="text-slate-500">Người nhận:</span><span class="font-bold text-slate-800">${esc(o.fullName || o.shipping_name)}</span></div>
        <div class="flex justify-between"><span class="text-slate-500">Số điện thoại:</span><span class="font-bold text-slate-800">${esc(o.phone || o.shipping_phone)}</span></div>
        <div class="flex justify-between"><span class="text-slate-500">Địa chỉ:</span><span class="font-bold text-slate-800">${esc(o.address || o.shipping_address)}</span></div>
        <div class="flex justify-between"><span class="text-slate-500">Đơn vị vận chuyển:</span><span class="font-bold text-slate-800">${esc(o.shippingProvider || o.shipping_provider)} (${fmtVND(o.shippingFee || o.shipping_fee)})</span></div>
        <div class="flex justify-between"><span class="text-slate-500">Trạng thái:</span><span class="font-bold text-blue-600">${esc(o.status)}</span></div>
        <div class="pt-2 border-t border-slate-200 flex justify-between items-baseline">
          <span class="font-bold text-slate-800 text-sm">Tổng thanh toán:</span>
          <span class="text-xl font-black text-blue-700">${fmtVND(o.grandTotal || o.total_amount)}</span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-2 pt-2">
        <button onclick="openOrders()" class="ps-btn ps-btn-primary text-xs flex-1">Xem danh sách đơn hàng</button>
        <button onclick="go('products')" class="ps-btn ps-btn-ghost text-xs flex-1">Tiếp tục mua hàng</button>
      </div>
    </div>
  </main>`;
}

// --- Authentication Views (Section 5.1 & 7.1) --------------------------------
function viewLogin() {
  return `
  <main class="max-w-md mx-auto px-4 py-12 flex-1 w-full" id="view-login" data-testid="view-login">
    <div class="ps-card p-8">
      <h1 class="text-2xl font-black text-slate-900 mb-1">Đăng Nhập Tài Khoản</h1>
      <p class="text-xs text-slate-500 mb-6">Đăng nhập để mua hàng và đồng bộ giỏ hàng của bạn.</p>
      
      <p id="auth-error-msg" data-testid="auth-error-msg" class="hidden text-xs text-rose-600 font-bold mb-4 p-3 bg-rose-50 rounded-xl border border-rose-200"></p>

      <form onsubmit="event.preventDefault(); doLogin()" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1" for="input-login-username">Tên đăng nhập hoặc Email *</label>
          <!-- Section 7.1: login-username-input -->
          <input id="input-login-username" data-testid="login-username-input" type="text"
            placeholder="admin hoặc customer@phonestore.test" class="ps-input text-xs font-medium" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1" for="input-login-password">Mật khẩu *</label>
          <!-- Section 7.1: login-password-input -->
          <input id="input-login-password" data-testid="login-password-input" type="password"
            placeholder="••••••••" class="ps-input text-xs font-medium" />
        </div>

        <!-- Section 7.1: login-submit-btn -->
        <button id="login-submit-btn" data-testid="login-submit-btn" type="submit"
          class="ps-btn ps-btn-primary w-full py-3 text-sm font-bold shadow-lg shadow-blue-500/20">
          Đăng nhập
        </button>
      </form>

      <div class="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
        Chưa có tài khoản? <a href="#" onclick="go('register')" class="text-blue-600 font-bold hover:underline">Đăng ký ngay</a>
      </div>
    </div>
  </main>`;
}

function viewRegister() {
  return `
  <main class="max-w-md mx-auto px-4 py-10 flex-1 w-full" id="view-register" data-testid="view-register">
    <div class="ps-card p-8">
      <h1 class="text-2xl font-black text-slate-900 mb-1">Đăng Ký Tài Khoản</h1>
      <p class="text-xs text-slate-500 mb-6">Tạo tài khoản PhoneStore để trải nghiệm đầy đủ tính năng.</p>
      
      <p id="register-error-msg" data-testid="register-error-msg" class="hidden text-xs text-rose-600 font-bold mb-4 p-3 bg-rose-50 rounded-xl border border-rose-200"></p>

      <form onsubmit="event.preventDefault(); doRegister()" class="space-y-3">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1" for="input-register-fullname">Họ và tên (không chứa số hay ký tự đặc biệt) *</label>
          <input id="input-register-fullname" data-testid="register-fullname-input" type="text"
            placeholder="Ví dụ: Nguyễn Văn A" class="ps-input text-xs font-medium" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1" for="input-register-username">Tên đăng nhập (6-50 ký tự, bắt đầu bằng chữ cái) *</label>
          <input id="input-register-username" data-testid="register-username-input" type="text"
            placeholder="Ví dụ: nguyenvana" class="ps-input text-xs font-medium" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1" for="input-register-email">Email *</label>
          <input id="input-register-email" data-testid="register-email-input" type="email"
            placeholder="name@example.com" class="ps-input text-xs font-medium" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1" for="input-register-phone">Số điện thoại (10 số, đầu 03/05/07/08/09) *</label>
          <input id="input-register-phone" data-testid="register-phone-input" type="tel"
            placeholder="0912345678" class="ps-input text-xs font-medium" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1" for="input-register-password">Mật khẩu (≥6 ký tự, có chữ HOA và ký tự @, #, $, !) *</label>
          <input id="input-register-password" data-testid="register-password-input" type="password"
            placeholder="Ví dụ: Password123!" class="ps-input text-xs font-medium" />
        </div>

        <!-- Section 7.1: register-submit-btn -->
        <button id="register-submit-btn" data-testid="register-submit-btn" type="submit"
          class="ps-btn ps-btn-primary w-full py-3 text-sm font-bold shadow-lg shadow-blue-500/20 mt-2">
          Đăng ký tài khoản
        </button>
      </form>

      <div class="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
        Đã có tài khoản? <a href="#" onclick="go('login')" class="text-blue-600 font-bold hover:underline">Đăng nhập</a>
      </div>
    </div>
  </main>`;
}

async function doLogin() {
  const username = inputVal('input-login-username');
  const password = inputVal('input-login-password');
  const err = byId('auth-error-msg');
  if (err) err.className = 'hidden';

  if (!username || !password) {
    if (err) {
      err.className = 'text-xs text-rose-600 font-bold mb-4 p-3 bg-rose-50 rounded-xl border border-rose-200';
      err.textContent = 'Vui lòng nhập đầy đủ tên đăng nhập/email và mật khẩu.';
    }
    return;
  }

  const r = await api('POST', '/api/auth/login', {
    username,
    password,
    cart: State.cart // Guest cart synchronization (Section 5.2)
  });

  if (!r.ok) {
    if (err) {
      err.className = 'text-xs text-rose-600 font-bold mb-4 p-3 bg-rose-50 rounded-xl border border-rose-200';
      err.textContent = r.data.message || 'Đăng nhập không thành công.';
    }
    return;
  }

  State.token = r.data.token || (r.data.data && r.data.data.token);
  State.user = r.data.user || (r.data.data && r.data.data.user);
  persistAuth();

  // Merge cart from server
  await syncCartWithDb();
  await refreshProducts();

  go('products');
  toast(`Chào mừng ${State.user.fullName || State.user.name}!`, 'success');
}

async function doRegister() {
  const fullName = inputVal('input-register-fullname');
  const username = inputVal('input-register-username');
  const email = inputVal('input-register-email');
  const phone = inputVal('input-register-phone');
  const password = inputVal('input-register-password');
  const err = byId('register-error-msg');
  if (err) err.className = 'hidden';

  // Client-side Two-Tier Validation (Section 5.1)
  if (!fullName || fullName.length < 2 || fullName.length > 50 || !NAME_RE.test(fullName)) {
    if (err) {
      err.className = 'text-xs text-rose-600 font-bold mb-4 p-3 bg-rose-50 rounded-xl border border-rose-200';
      err.textContent = 'Họ và tên phải từ 2-50 ký tự và không chứa số hoặc ký tự đặc biệt.';
    }
    return;
  }

  if (username && (username.length < 6 || username.length > 50 || !USERNAME_RE.test(username))) {
    if (err) {
      err.className = 'text-xs text-rose-600 font-bold mb-4 p-3 bg-rose-50 rounded-xl border border-rose-200';
      err.textContent = 'Tên đăng nhập phải từ 6-50 ký tự, bắt đầu bằng chữ cái và không có khoảng trắng/ký tự đặc biệt.';
    }
    return;
  }

  if (!email || !EMAIL_RE.test(email)) {
    if (err) {
      err.className = 'text-xs text-rose-600 font-bold mb-4 p-3 bg-rose-50 rounded-xl border border-rose-200';
      err.textContent = 'Email không hợp lệ (ví dụ: name@example.com).';
    }
    return;
  }

  if (!phone || !PHONE_RE.test(phone)) {
    if (err) {
      err.className = 'text-xs text-rose-600 font-bold mb-4 p-3 bg-rose-50 rounded-xl border border-rose-200';
      err.textContent = 'Số điện thoại phải đúng 10 số và bắt đầu bằng 03, 05, 07, 08, 09.';
    }
    return;
  }

  if (!password || password.length < 6 || !PASSWORD_RE.test(password)) {
    if (err) {
      err.className = 'text-xs text-rose-600 font-bold mb-4 p-3 bg-rose-50 rounded-xl border border-rose-200';
      err.textContent = 'Mật khẩu phải từ 6 ký tự trở lên, gồm ít nhất 1 chữ HOA và 1 ký tự đặc biệt (@, #, $, !).';
    }
    return;
  }

  const r = await api('POST', '/api/auth/register', {
    fullName,
    username,
    email,
    phone,
    password,
    cart: State.cart
  });

  if (!r.ok) {
    if (err) {
      err.className = 'text-xs text-rose-600 font-bold mb-4 p-3 bg-rose-50 rounded-xl border border-rose-200';
      err.textContent = r.data.message || 'Đăng ký không thành công.';
    }
    return;
  }

  State.token = r.data.token || (r.data.data && r.data.data.token);
  State.user = r.data.user || (r.data.data && r.data.data.user);
  persistAuth();

  await syncCartWithDb();
  await refreshProducts();

  go('products');
  toast('Đăng ký tài khoản thành công! Chào mừng bạn đến với PhoneStore.', 'success');
}

async function doLogout() {
  await api('POST', '/api/auth/logout', {});
  State.token = '';
  State.user = null;
  State.cart = [];
  State.coupon = null;
  State.lastOrder = null;
  persistAuth();
  saveCart();
  go('products');
  toast('Bạn đã đăng xuất thành công.', 'success');
}

// --- Customer Orders View (TC-WEB-10 Order Cancel Restock) --------------------
async function openOrders() {
  const r = await api('GET', '/api/orders/mine');
  if (r.ok && r.data) {
    State.orders = r.data.orders || (r.data.data && r.data.data.orders) || [];
  }
  go('orders');
}

async function cancelCustomerOrder(orderId) {
  if (!confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${orderId}? Tồn kho sẽ tự động hoàn lại.`)) return;
  const r = await api('POST', `/api/orders/${orderId}/cancel`, {});
  if (!r.ok) {
    toast(r.data.message || 'Không thể hủy đơn hàng này.', 'error');
    return;
  }
  toast(`Đơn hàng ${orderId} đã được hủy thành công và hoàn lại tồn kho.`, 'success');
  openOrders();
}

function viewOrders() {
  const orderCards = State.orders.map((o) => {
    const isPending = o.status === 'Chờ xác nhận' || o.status === 'Pending';
    const itemsList = asArray(o.items).map((it) => `
      <div class="flex justify-between text-xs py-1">
        <span>${esc(it.productName)} (${esc(it.color)} · ${esc(it.storage || it.rom + 'GB')}) × ${it.qty}</span>
        <span class="font-bold text-slate-800">${fmtVND(it.unitPrice * it.qty)}</span>
      </div>
    `).join('');

    return `
    <div class="ps-card p-5 space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <span class="font-mono font-bold text-sm text-blue-700">${esc(o.id)}</span>
          <span class="text-xs text-slate-400 ml-2">Ngày đặt: ${new Date(o.createdAt).toLocaleString('vi-VN')}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 rounded-full text-xs font-black ${o.status === 'Đã hủy' || o.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' : (o.status === 'Đã hoàn thành' || o.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700')}">
            ${esc(o.status)}
          </span>
          ${isPending ? `
            <button onclick="cancelCustomerOrder('${esc(o.id)}')" class="px-2.5 py-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200">
              Hủy đơn
            </button>
          ` : ''}
        </div>
      </div>

      <div class="space-y-1">${itemsList}</div>

      <div class="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs">
        <span class="text-slate-500">Đơn vị: <b>${esc(o.shippingProvider || o.shipping_provider)}</b> · Giao tới: ${esc(o.shippingAddress || o.shipping_address || o.address)}</span>
        <div class="text-right">
          <span class="text-slate-500 mr-2">Tổng tiền:</span>
          <span class="text-base font-extrabold text-blue-700">${fmtVND(o.grandTotal || o.total_amount)}</span>
        </div>
      </div>
    </div>`;
  }).join('');

  return `
  <main class="max-w-4xl mx-auto px-4 py-8 flex-1 w-full" id="view-orders" data-testid="view-orders">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-black text-slate-900">📦 Đơn Hàng Của Bạn</h1>
      <button onclick="go('products')" class="ps-btn ps-btn-ghost text-xs">← Mua thêm sản phẩm</button>
    </div>

    ${State.orders.length ? `
      <div class="space-y-4">${orderCards}</div>
    ` : `
      <div class="ps-card p-12 text-center my-6">
        <p class="text-5xl mb-3">📦</p>
        <h2 class="text-lg font-bold text-slate-800">Bạn chưa có đơn hàng nào</h2>
        <p class="text-xs text-slate-500 mt-1 mb-4">Các đơn hàng bạn đặt sẽ được quản lý và hiển thị tại đây.</p>
        <button onclick="go('products')" class="ps-btn ps-btn-primary text-xs">Khám phá sản phẩm</button>
      </div>
    `}
  </main>`;
}

// --- Admin Dashboard (TC-WEB-11, Section 7.1) --------------------------------
async function openAdmin() {
  if (!State.user || State.user.role !== 'admin') {
    toast('Truy cập bị từ chối: Cần quyền quản trị viên.', 'error');
    go('login');
    return;
  }
  await Promise.all([refreshAdminAnalytics(), refreshAdminProducts(), refreshAdminOrders()]);
  go('admin');
}

async function refreshAdminAnalytics() {
  const r = await api('GET', '/api/admin/analytics');
  if (r.ok && r.data) {
    State.admin.analytics = r.data.data || r.data;
  }
}

async function refreshAdminProducts() {
  const r = await api('GET', '/api/admin/products');
  if (r.ok && r.data) {
    State.admin.products = r.data.products || (r.data.data && r.data.data.products) || [];
  }
}

async function refreshAdminOrders() {
  const r = await api('GET', '/api/admin/orders');
  if (r.ok && r.data) {
    State.admin.orders = r.data.orders || (r.data.data && r.data.data.orders) || [];
  }
}

function setAdminTab(tab) {
  State.admin.tab = tab;
  render();
}

function viewAdmin() {
  if (!State.user || State.user.role !== 'admin') {
    return `<div class="p-8 text-center text-rose-600 font-bold">Truy cập bị từ chối (403 Forbidden).</div>`;
  }

  const an = State.admin.analytics || { totalOrders: 0, totalRevenue: 0, ordersByStatus: {}, lowStock: [] };

  return `
  <main class="max-w-7xl mx-auto px-4 py-8 flex-1 w-full" id="view-admin" data-testid="view-admin">
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-black text-slate-900">🛡️ Quản Trị Hệ Thống PhoneStore</h1>
        <p class="text-xs text-slate-500">Giám sát doanh thu, quản lý danh mục sản phẩm và trạng thái vòng đời đơn hàng.</p>
      </div>
      <div class="flex gap-2">
        <button id="btn-reset-data" data-testid="btn-reset-data" onclick="adminResetData()"
          class="ps-btn ps-btn-ghost text-xs border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100">
          ↺ Đặt lại dữ liệu mẫu
        </button>
      </div>
    </div>

    <!-- Admin Tabs -->
    <div class="flex gap-2 border-b border-slate-200 mb-6">
      <button onclick="setAdminTab('analytics')"
        class="pb-3 px-4 text-xs font-bold border-b-2 transition ${State.admin.tab === 'analytics' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}">
        📊 Thống kê & Doanh thu
      </button>
      <button onclick="setAdminTab('products')"
        class="pb-3 px-4 text-xs font-bold border-b-2 transition ${State.admin.tab === 'products' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}">
        📱 Quản lý sản phẩm (${State.admin.products.length})
      </button>
      <button onclick="setAdminTab('orders')"
        class="pb-3 px-4 text-xs font-bold border-b-2 transition ${State.admin.tab === 'orders' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}">
        📦 Quản lý đơn hàng (${State.admin.orders.length})
      </button>
    </div>

    ${State.admin.tab === 'analytics' ? adminAnalyticsHTML(an) : ''}
    ${State.admin.tab === 'products' ? adminProductsHTML() : ''}
    ${State.admin.tab === 'orders' ? adminOrdersHTML() : ''}
  </main>`;
}

function adminAnalyticsHTML(an) {
  const lowStockRows = asArray(an.lowStock).map((l) => `
    <tr class="border-b border-slate-100 text-xs">
      <td class="py-2.5 px-3 font-mono font-bold text-blue-700">${esc(l.productId)}</td>
      <td class="py-2.5 px-3 font-bold text-slate-800">${esc(l.productName)}</td>
      <td class="py-2.5 px-3 text-slate-600">${esc(l.color)} · ${esc(l.storage || l.rom + 'GB')}</td>
      <td class="py-2.5 px-3 text-right">
        <span class="px-2 py-0.5 rounded-full font-black text-rose-700 bg-rose-100">${l.stock} máy</span>
      </td>
    </tr>
  `).join('');

  return `
  <div class="space-y-6">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="ps-card p-5">
        <p class="text-xs font-bold text-slate-500 uppercase">Tổng doanh thu thực tế</p>
        <p class="text-2xl font-black text-blue-700 mt-2">${fmtVND(an.totalRevenue)}</p>
        <p class="text-[10px] text-slate-400 mt-1">(Không tính các đơn Đã hủy)</p>
      </div>

      <div class="ps-card p-5">
        <p class="text-xs font-bold text-slate-500 uppercase">Tổng số đơn hàng</p>
        <p class="text-2xl font-black text-indigo-700 mt-2">${an.totalOrders}</p>
        <p class="text-[10px] text-slate-400 mt-1">Đơn hàng trong hệ thống</p>
      </div>

      <div class="ps-card p-5">
        <p class="text-xs font-bold text-slate-500 uppercase">Đơn chờ xác nhận</p>
        <p class="text-2xl font-black text-amber-600 mt-2">${an.ordersByStatus['Chờ xác nhận'] || an.ordersByStatus['Pending'] || 0}</p>
        <p class="text-[10px] text-slate-400 mt-1">Cần xử lý đóng gói</p>
      </div>

      <div class="ps-card p-5">
        <p class="text-xs font-bold text-slate-500 uppercase">Cảnh báo sắp hết hàng</p>
        <p class="text-2xl font-black text-rose-600 mt-2">${asArray(an.lowStock).length}</p>
        <p class="text-[10px] text-slate-400 mt-1">Tồn kho &lt; 5 máy</p>
      </div>
    </div>

    <!-- Low Stock Warning Table -->
    <div class="ps-card p-6">
      <h3 class="font-bold text-base text-slate-900 mb-3 flex items-center gap-2">
        <span>⚠️ Cảnh báo tồn kho thấp (&lt; 5 máy)</span>
      </h3>
      ${asArray(an.lowStock).length ? `
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
              <tr>
                <th class="py-2 px-3">Mã SP</th>
                <th class="py-2 px-3">Tên sản phẩm</th>
                <th class="py-2 px-3">Biến thể</th>
                <th class="py-2 px-3 text-right">Tồn kho</th>
              </tr>
            </thead>
            <tbody>${lowStockRows}</tbody>
          </table>
        </div>
      ` : `
        <p class="text-xs text-slate-500">Mọi sản phẩm đều có số lượng tồn kho đảm bảo.</p>
      `}
    </div>
  </div>`;
}

// Admin Products Table (Section 7.1: admin-product-row-{id} & admin-add-product-btn)
function adminProductsHTML() {
  const rows = State.admin.products.map((p) => {
    const vCount = asArray(p.variants).length;
    const totalStock = asArray(p.variants).reduce((s, v) => s + (Number(v.stock) || 0), 0);
    return `
    <tr id="admin-product-row-${esc(p.id)}" data-testid="admin-product-row-${esc(p.id)}" class="border-b border-slate-100 text-xs">
      <td class="py-3 px-3 font-mono font-bold text-blue-700">${esc(p.id)}</td>
      <td class="py-3 px-3">
        <div class="flex items-center gap-2">
          <img src="${esc(productImage(p))}" alt="${esc(p.name)}"
            referrerpolicy="no-referrer"
            class="w-8 h-8 object-contain rounded bg-slate-100 p-0.5"
            onerror="this.onerror=null; this.src=window.SAFE_FALLBACK_IMAGE;" />
          <span class="font-bold text-slate-900">${esc(p.name)}</span>
        </div>
      </td>
      <td class="py-3 px-3 font-semibold text-slate-600">${esc(p.brand)}</td>
      <td class="py-3 px-3 font-bold text-slate-800">${fmtVND(p.minPrice || p.price)}</td>
      <td class="py-3 px-3">${vCount} phiên bản (Tổng ${totalStock} máy)</td>
      <td class="py-3 px-3">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${p.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}">
          ${p.active ? 'Đang bán' : 'Đã ẩn'}
        </span>
      </td>
      <td class="py-3 px-3 text-right">
        <button onclick="toggleProductSoftDelete('${esc(p.id)}')" class="text-xs font-bold ${p.active ? 'text-amber-600 hover:text-amber-700' : 'text-emerald-600 hover:text-emerald-700'}">
          ${p.active ? 'Ẩn' : 'Hiện'}
        </button>
      </td>
    </tr>`;
  }).join('');

  return `
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h3 class="font-bold text-base text-slate-900">Danh sách sản phẩm</h3>
      <!-- Section 7.1: admin-add-product-btn -->
      <button id="admin-add-product-btn" data-testid="admin-add-product-btn" onclick="openAddProductModal()"
        class="ps-btn ps-btn-primary text-xs py-2">
        + Thêm sản phẩm mới
      </button>
    </div>

    <div class="ps-card overflow-x-auto">
      <table class="w-full text-left">
        <thead class="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-100">
          <tr>
            <th class="py-2.5 px-3">Mã</th>
            <th class="py-2.5 px-3">Tên máy</th>
            <th class="py-2.5 px-3">Hãng</th>
            <th class="py-2.5 px-3">Giá từ</th>
            <th class="py-2.5 px-3">Biến thể</th>
            <th class="py-2.5 px-3">Trạng thái</th>
            <th class="py-2.5 px-3 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>`;
}

// Admin Orders Table (Section 7.1: admin-order-status-select-{orderId} & admin-cancel-order-btn-{orderId})
function adminOrdersHTML() {
  const rows = State.admin.orders.map((o) => {
    const isCancelled = o.status === 'Đã hủy' || o.status === 'Cancelled';
    const statusOpts = ['Chờ xác nhận', 'Đang giao', 'Đã hoàn thành', 'Đã hủy'].map((s) => `
      <option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>
    `).join('');

    const itemsSummary = asArray(o.items).map((it) => `${it.productName} (${it.color}) ×${it.qty}`).join(', ');

    return `
    <tr id="admin-order-row-${esc(o.id)}" data-testid="admin-order-row-${esc(o.id)}" class="border-b border-slate-100 text-xs">
      <td class="py-3 px-3 font-mono font-bold text-blue-700">${esc(o.id)}</td>
      <td class="py-3 px-3">
        <p class="font-bold text-slate-900">${esc(o.fullName || o.shipping_name)}</p>
        <p class="text-[11px] text-slate-400">${esc(o.phone || o.shipping_phone)}</p>
      </td>
      <td class="py-3 px-3 text-[11px] text-slate-700 max-w-xs">${esc(itemsSummary)}</td>
      <td class="py-3 px-3 font-bold text-slate-900">${fmtVND(o.grandTotal || o.total_amount)}</td>
      <td class="py-3 px-3">
        <!-- Section 7.1: admin-order-status-select-{orderId} -->
        <select id="admin-order-status-select-${esc(o.id)}" data-testid="admin-order-status-select-${esc(o.id)}"
          onchange="adminUpdateOrderStatus('${esc(o.id)}', this.value)"
          class="ps-input py-1 text-xs font-semibold">
          ${statusOpts}
        </select>
      </td>
      <td class="py-3 px-3 text-right">
        <!-- Section 7.1: admin-cancel-order-btn-{orderId} -->
        ${!isCancelled ? `
          <button id="admin-cancel-order-btn-${esc(o.id)}" data-testid="admin-cancel-order-btn-${esc(o.id)}"
            onclick="adminCancelOrder('${esc(o.id)}')"
            class="px-2.5 py-1 text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200">
            Hủy & Hoàn kho
          </button>
        ` : `
          <span class="text-[11px] text-slate-400 italic">Đã hủy</span>
        `}
      </td>
    </tr>`;
  }).join('');

  return `
  <div class="space-y-4">
    <h3 class="font-bold text-base text-slate-900">Quản lý vòng đời đơn hàng</h3>
    <p class="text-xs text-slate-500">Hủy đơn ở trạng thái "Chờ xác nhận" sẽ tự động hoàn trả lại số lượng tồn kho theo đúng mã biến thể (TC-WEB-10).</p>

    <div class="ps-card overflow-x-auto">
      <table class="w-full text-left">
        <thead class="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-100">
          <tr>
            <th class="py-2.5 px-3">Mã đơn</th>
            <th class="py-2.5 px-3">Khách hàng</th>
            <th class="py-2.5 px-3">Sản phẩm</th>
            <th class="py-2.5 px-3">Tổng tiền</th>
            <th class="py-2.5 px-3">Cập nhật trạng thái</th>
            <th class="py-2.5 px-3 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>`;
}

async function adminUpdateOrderStatus(orderId, status) {
  const r = await api('PUT', `/api/admin/orders/${orderId}/status`, { status });
  if (!r.ok) {
    toast(r.data.message || 'Không thể cập nhật trạng thái đơn.', 'error');
    return;
  }
  const restockMsg = (r.data.restocked && r.data.restocked.length)
    ? ` Đã tự động hoàn trả tồn kho: ${r.data.restocked.map((x) => `${x.variantId} (+${x.restoredQty})`).join(', ')}`
    : '';
  toast(`Cập nhật đơn ${orderId} thành công!${restockMsg}`, 'success');
  await Promise.all([refreshAdminOrders(), refreshAdminAnalytics(), refreshProducts()]);
  render();
}

async function adminCancelOrder(orderId) {
  if (!confirm(`Xác nhận hủy đơn hàng ${orderId} và hoàn lại tồn kho?`)) return;
  const r = await api('POST', `/api/admin/orders/${orderId}/cancel`, {});
  if (!r.ok) {
    toast(r.data.message || 'Không thể hủy đơn hàng.', 'error');
    return;
  }
  toast(`Đã hủy đơn ${orderId} và tự động hoàn lại tồn kho.`, 'success');
  await Promise.all([refreshAdminOrders(), refreshAdminAnalytics(), refreshProducts()]);
  render();
}

async function toggleProductSoftDelete(productId) {
  const p = State.admin.products.find((x) => x.id === productId);
  if (!p) return;
  if (p.active) {
    await api('DELETE', `/api/admin/products/${productId}`);
    toast(`Đã ẩn sản phẩm ${productId} khỏi cửa hàng.`, 'info');
  } else {
    await api('PUT', `/api/admin/products/${productId}`, { active: true });
    toast(`Đã kích hoạt bán lại sản phẩm ${productId}.`, 'success');
  }
  await Promise.all([refreshAdminProducts(), refreshProducts()]);
  render();
}

function openAddProductModal() {
  const existing = byId('admin-add-product-modal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'admin-add-product-modal';
  overlay.className = 'liquid-modal-overlay';
  overlay.innerHTML = `
  <div class="liquid-modal-content max-w-2xl w-full p-6 md:p-8 relative" role="dialog" aria-modal="true">
    <button onclick="closeAddProductModal()" class="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold">✕</button>
    <h2 class="text-xl font-black text-slate-900 mb-1">Thêm Sản Phẩm & Biến Thể Mới</h2>
    <p class="text-xs text-slate-500 mb-4">Nhập thông tin sản phẩm, cấu hình biến thể và chọn ảnh tải lên hoặc nhập URL tĩnh.</p>

    <p id="admin-prod-error" class="hidden text-xs text-rose-600 font-bold mb-3 p-2.5 bg-rose-50 rounded-xl border border-rose-200"></p>

    <form onsubmit="event.preventDefault(); submitAdminNewProduct()" class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Tên sản phẩm *</label>
          <input id="adm-p-name" type="text" placeholder="Ví dụ: Galaxy S25 Ultra" class="ps-input text-xs font-medium" required />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Thương hiệu *</label>
          <input id="adm-p-brand" type="text" placeholder="Apple / Samsung / Xiaomi / OPPO..." class="ps-input text-xs font-medium" required />
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1">Mô tả sản phẩm</label>
        <textarea id="adm-p-desc" rows="2" placeholder="Thông tin nổi bật của sản phẩm..." class="ps-input text-xs font-medium"></textarea>
      </div>

      <div class="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
        <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider">Thông tin Biến thể đầu tiên</h4>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1">Màu sắc</label>
            <input id="adm-v-color" type="text" value="Titan Tự Nhiên" class="ps-input text-xs" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1">Dung lượng</label>
            <input id="adm-v-storage" type="text" value="256GB" class="ps-input text-xs" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1">RAM (GB)</label>
            <input id="adm-v-ram" type="number" value="12" class="ps-input text-xs" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1">ROM (GB)</label>
            <input id="adm-v-rom" type="number" value="256" class="ps-input text-xs" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1">Giá bán (VNĐ) *</label>
            <input id="adm-v-price" type="number" value="29990000" class="ps-input text-xs font-bold" required />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1">Tồn kho ban đầu *</label>
            <input id="adm-v-stock" type="number" value="20" class="ps-input text-xs font-bold" required />
          </div>
        </div>

        <!-- Image Management (Section 3.3) -->
        <div class="pt-2 border-t border-slate-200 space-y-2">
          <label class="block text-xs font-bold text-slate-700">Hình ảnh biến thể sản phẩm (URL hoặc tải file lên):</label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            <div class="sm:col-span-2 space-y-2">
              <div>
                <span class="text-[11px] text-slate-500 font-semibold">Cách 1: Nhập trực tiếp URL hình ảnh:</span>
                <input id="adm-v-image" type="text" value="${SAFE_FALLBACK_IMAGE}"
                  oninput="updateAdminImagePreview(this.value)"
                  placeholder="/images/products/example.png hoặc link ảnh CDN..." class="ps-input text-xs font-mono" />
              </div>
              <div>
                <span class="text-[11px] text-slate-500 font-semibold">Cách 2: Tải ảnh mới từ máy tính (lưu vào public/images/products/):</span>
                <input id="adm-v-file" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onchange="adminUploadImageFile(this)"
                  class="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
            </div>

            <!-- Image Preview Frame -->
            <div class="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200">
              <span class="text-[10px] text-slate-400 font-bold mb-1">Xem trước ảnh:</span>
              <img id="adm-v-img-preview" src="${SAFE_FALLBACK_IMAGE}" alt="Preview"
                referrerpolicy="no-referrer"
                class="w-20 h-20 object-contain aspect-square rounded-lg bg-gray-50 p-1"
                onerror="this.onerror=null; this.src=window.SAFE_FALLBACK_IMAGE;" />
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeAddProductModal()" class="ps-btn ps-btn-ghost text-xs">Hủy</button>
        <button id="admin-submit-product-btn" type="submit" class="ps-btn ps-btn-primary text-xs shadow-md shadow-blue-500/20 font-bold">Lưu sản phẩm</button>
      </div>
    </form>
  </div>`;

  document.body.appendChild(overlay);
}

function closeAddProductModal() {
  const m = byId('admin-add-product-modal');
  if (m) m.remove();
}

function updateAdminImagePreview(url) {
  const prev = byId('adm-v-img-preview');
  if (prev) prev.src = url || SAFE_FALLBACK_IMAGE;
}

async function adminUploadImageFile(fileInput) {
  if (!fileInput.files || !fileInput.files[0]) return;
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('image', file);

  try {
    toast('Đang tải hình ảnh lên thư mục public/images/products/...', 'info');
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: State.token ? { 'Authorization': 'Bearer ' + State.token } : {},
      body: formData
    });
    const data = await res.json();
    if (res.ok && data.data && data.data.imageUrl) {
      const urlInput = byId('adm-v-image');
      if (urlInput) urlInput.value = data.data.imageUrl;
      updateAdminImagePreview(data.data.imageUrl);
      toast('Tải ảnh thành công!', 'success');
    } else {
      toast(data.message || 'Lỗi khi tải ảnh lên.', 'error');
    }
  } catch (err) {
    toast('Lỗi khi tải ảnh lên: ' + err.message, 'error');
  }
}

async function submitAdminNewProduct() {
  const name = inputVal('adm-p-name');
  const brand = inputVal('adm-p-brand');
  const description = inputVal('adm-p-desc');
  const color = inputVal('adm-v-color') || 'Tiêu chuẩn';
  const storage = inputVal('adm-v-storage') || '128GB';
  const ram = parseInt(inputVal('adm-v-ram'), 10) || 8;
  const rom = parseInt(inputVal('adm-v-rom'), 10) || 128;
  const price = parseInt(inputVal('adm-v-price'), 10);
  const stock = parseInt(inputVal('adm-v-stock'), 10);
  const imageUrl = inputVal('adm-v-image') || SAFE_FALLBACK_IMAGE;

  const errEl = byId('admin-prod-error');
  if (!name || name.length < 2) {
    if (errEl) { errEl.textContent = 'Tên sản phẩm phải từ 2 ký tự trở lên.'; errEl.classList.remove('hidden'); }
    return;
  }
  if (!brand || brand.length < 2) {
    if (errEl) { errEl.textContent = 'Thương hiệu phải từ 2 ký tự trở lên.'; errEl.classList.remove('hidden'); }
    return;
  }
  if (!price || price <= 0) {
    if (errEl) { errEl.textContent = 'Giá bán phải lớn hơn 0đ.'; errEl.classList.remove('hidden'); }
    return;
  }

  const r = await api('POST', '/api/admin/products', {
    name,
    brand,
    description,
    variants: [
      { color, storage, ram, rom, price, stock, imageUrl }
    ]
  });

  if (r.ok) {
    toast(`Đã tạo thành công sản phẩm "${name}"!`, 'success');
    closeAddProductModal();
    await Promise.all([refreshAdminProducts(), refreshProducts()]);
    render();
  } else {
    if (errEl) {
      errEl.textContent = r.data.message || 'Lỗi khi tạo sản phẩm.';
      errEl.classList.remove('hidden');
    }
    toast(r.data.message || 'Lỗi tạo sản phẩm.', 'error');
  }
}

function adminResetData() {
  if (!confirm('Đặt lại toàn bộ cơ sở dữ liệu SQLite về dữ liệu mẫu ban đầu?')) return;
  api('POST', '/api/admin/reset', {}).then((r) => {
    toast((r.data && r.data.message) || 'Đã đặt lại dữ liệu mẫu thành công.', 'success');
    State.cart = [];
    State.coupon = null;
    saveCart();
    Promise.all([refreshAdminAnalytics(), refreshAdminProducts(), refreshAdminOrders(), refreshProducts()]).then(() => render());
  });
}

// --- Search & Filter handlers ------------------------------------------------
let searchTimer = null;
function onSearchInput(val) {
  State.filter.search = val;
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    refreshProducts();
  }, 250);
}

function onFilterChange(field, val) {
  const isAll = !val || val === 'all' || val === 'ALL' || String(val).toLowerCase().startsWith('tất cả');
  State.filter[field] = isAll ? '' : val;
  refreshProducts();
}

function resetFilters() {
  State.filter = {
    search: '',
    brand: '',
    ram: '',
    rom: '',
    storage: '',
    minPrice: null,
    maxPrice: null,
    sort: 'newest'
  };
  const searchEl = byId('input-search') || byId('modal-search-input');
  if (searchEl) searchEl.value = '';
  const brandEl = byId('filter-brand') || byId('select-brand');
  if (brandEl) brandEl.value = '';
  const ramEl = byId('filter-ram') || byId('select-ram');
  if (ramEl) ramEl.value = '';
  const romEl = byId('filter-rom') || byId('select-rom');
  if (romEl) romEl.value = '';
  refreshProducts();
}

// Hàm làm sạch giá trị tham số lọc
function getCleanFilterValue(elementId) {
  const el = document.getElementById(elementId) || byId(elementId);
  if (!el) return '';
  const val = el.value ? el.value.trim() : '';
  // Nếu giá trị chứa từ "Tất cả" hoặc "all", ép về chuỗi rỗng ''
  if (val.includes('Tất cả') || val.toLowerCase() === 'all') {
    return '';
  }
  return val;
}

// Hàm tải sản phẩm
async function fetchProducts() {
  const brand = getCleanFilterValue('filter-brand') || getCleanFilterValue('select-brand');
  const ram = getCleanFilterValue('filter-ram') || getCleanFilterValue('select-ram');
  const rom = getCleanFilterValue('filter-rom') || getCleanFilterValue('select-rom');
  const sort = document.getElementById('filter-sort')?.value || document.getElementById('select-sort')?.value || 'newest';

  const params = new URLSearchParams();
  if (brand) params.append('brand', brand);
  if (ram) {
    const rMatch = ram.match(/\d+/);
    params.append('ram', rMatch ? rMatch[0] : ram);
  }
  if (rom) {
    const rMatch = rom.match(/\d+/);
    params.append('rom', rMatch ? rMatch[0] : rom);
  }
  if (sort) params.append('sort', sort);

  const queryStr = params.toString();
  const url = queryStr ? `/api/products?${queryStr}` : '/api/products';

  try {
    const res = await fetch(url);
    const products = await res.json();
    renderProductGrid(products);
  } catch (err) {
    console.error("Lỗi fetch sản phẩm:", err);
  }
}

window.getCleanFilterValue = getCleanFilterValue;
window.fetchProducts = fetchProducts;

async function refreshProducts() {
  await fetchProducts();
}

async function refreshFilterOptions() {
  const r = await api('GET', '/api/products/filter-options');
  if (r.ok && r.data) {
    State.filterOptions = r.data.data || r.data;
  }
}

// --- Main View Renderer ------------------------------------------------------
function render() {
  const appEl = byId('app');
  if (!appEl) return;

  let bodyHTML = '';
  switch (State.view) {
    case 'products':
      bodyHTML = viewProducts();
      break;
    case 'cart':
      bodyHTML = viewCart();
      break;
    case 'checkout':
      bodyHTML = viewCheckout();
      break;
    case 'checkout-success':
      bodyHTML = viewCheckoutSuccess();
      break;
    case 'login':
      bodyHTML = viewLogin();
      break;
    case 'register':
      bodyHTML = viewRegister();
      break;
    case 'orders':
      bodyHTML = viewOrders();
      break;
    case 'admin':
      bodyHTML = viewAdmin();
      break;
    default:
      bodyHTML = viewProducts();
  }

  appEl.innerHTML = headerHTML() + bodyHTML;
}

// --- Helper Rendering Functions (Safe API) ----------------------------------
function renderHeroBanner() {
  const heroEl = byId('hero-slider');
  if (heroEl && State.view === 'products') {
    const curSlide = HERO_SLIDES[State.heroSlide || 0] || HERO_SLIDES[0];
    const imgEl = byId('hero-banner-image');
    if (imgEl) {
      imgEl.src = curSlide.image || curSlide.img;
      imgEl.alt = curSlide.alt || curSlide.title;
    }
  } else {
    render();
  }
}

function renderProductGrid(products) {
  let list = [];
  if (Array.isArray(products)) {
    list = products;
  } else if (products && Array.isArray(products.products)) {
    list = products.products;
  } else if (products && products.data && Array.isArray(products.data.products)) {
    list = products.data.products;
  } else if (products && Array.isArray(products.data)) {
    list = products.data;
  }
  State.products = list;

  const gridEl = byId('product-grid');
  if (gridEl && list.length > 0) {
    gridEl.innerHTML = list.map((p) => productCardHTML(p)).join('');
  } else {
    render();
  }
}
window.renderHeroBanner = renderHeroBanner;
window.renderProductGrid = renderProductGrid;

// --- App Initialization (Safe try...catch to prevent blank screen) -----------
async function initApp() {
  try {
    // 1. Render layout framework immediately so user never sees a blank screen
    render();

    loadCart();

    // 2. Validate active session
    if (State.token) {
      try {
        const me = await api('GET', '/api/auth/me');
        if (me.ok && me.data && (me.data.user || (me.data.data && me.data.data.user))) {
          State.user = me.data.user || me.data.data.user;
          await syncCartWithDb();
        } else {
          State.token = '';
          State.user = null;
          persistAuth();
        }
      } catch (authErr) {
        console.warn('Session verification error:', authErr);
      }
    }

    // 3. Load filter options
    try {
      await refreshFilterOptions();
    } catch (filterErr) {
      console.warn('Filter options error:', filterErr);
    }

    // 4. Load products from API safely
    try {
      await fetchProducts();
    } catch (prodErr) {
      console.error('Lỗi khởi tạo danh sách sản phẩm:', prodErr);
      const container = document.getElementById('product-grid') || document.body;
      if (container) {
        container.innerHTML = `<div class="p-8 text-center text-red-500 font-bold">Đã xảy ra lỗi khi tải danh sách sản phẩm. Vui lòng làm mới trang (Ctrl + F5).</div>`;
      }
    }

  } catch (error) {
    console.error("Lỗi khởi tạo trang chủ:", error);
    // Nếu lỗi API, vẫn hiển thị khung trang chủ cơ bản chứ KHÔNG ĐỂ MÀN HÌNH TRẮNG
    const container = document.getElementById('product-grid') || document.getElementById('app') || document.body;
    if (container) {
      container.innerHTML = `<div class="p-8 text-center text-red-500 font-bold">Đã xảy ra lỗi khi tải danh sách sản phẩm. Vui lòng làm mới trang (Ctrl + F5).</div>`;
    }
  }
}

window.addEventListener('keydown', (e) => {
  if (!State.modalOpen) return;
  if (e.key === 'ArrowLeft') {
    prevGalleryImage();
  } else if (e.key === 'ArrowRight') {
    nextGalleryImage();
  } else if (e.key === 'Escape') {
    closeDetails();
  }
});

window.addEventListener('DOMContentLoaded', initApp);