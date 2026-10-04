'use strict';
// =============================================================================
// PhoneStore – Product image generator
// -----------------------------------------------------------------------------
// Writes transparent, background-free vector "product shots" for every seed
// product into public/images/products/<ID>.svg, plus a neutral placeholder.svg.
// Vector output stays razor-sharp at any size, needs no binary assets and can
// never 404 once generated. Re-run: node scripts/gen-product-images.js
// =============================================================================
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

// [bodyTop, bodyBottom, screenTop, screenBottom, accent] per product id.
const PALETTES = {
  SP001: ['#eef2f7', '#9aa4b2', '#1e3a8a', '#38bdf8', '#cbd5e1'], // iPhone 15 Pro – titanium/silver
  SP002: ['#8b93a1', '#333a47', '#7c3aed', '#f59e0b', '#94a3b8'], // Galaxy S24 Ultra – titanium gray
  SP003: ['#6ee7b7', '#047857', '#0f766e', '#22d3ee', '#34d399'], // Xiaomi 14 Pro – green
  SP004: ['#475569', '#111827', '#2563eb', '#60a5fa', '#334155'], // Galaxy A55 – black/blue
  SP005: ['#f87171', '#b91c1c', '#111827', '#3b82f6', '#fca5a5'], // iPhone 13 – red
  SP006: ['#fdba74', '#ea580c', '#0ea5e9', '#6366f1', '#fb923c'], // Redmi Note 13 Pro – orange
  SP007: ['#4b5563', '#111827', '#64748b', '#94a3b8', '#374151'], // iPhone SE – black
  SP008: ['#52525b', '#18181b', '#4338ca', '#818cf8', '#a1a1aa'], // iPhone 18 Pro Max – cosmic black
  SP009: ['#e3cba9', '#a67c52', '#2563eb', '#22d3ee', '#c8a97e'], // iPhone 18 – desert titanium
  SP010: ['#f8fafc', '#cbd5e1', '#0f172a', '#38bdf8', '#e2e8f0'], // Xiaomi 18 Ultra – ceramic white
  SP011: ['#334155', '#0f172a', '#14b8a6', '#3b82f6', '#1e293b'], // Xiaomi 18 – phantom black
  SP012: ['#334155', '#0b1220', '#6d28d9', '#f472b6', '#475569']  // Galaxy S26 Ultra – phantom black
};

const DEFAULT_PALETTE = ['#cbd5e1', '#94a3b8', '#475569', '#cbd5e1', '#94a3b8'];

function phoneSVG(label, pal) {
  const [body1, body2, sc1, sc2, accent] = pal;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 440" width="320" height="440" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${body1}"/>
      <stop offset="1" stop-color="${body2}"/>
    </linearGradient>
    <linearGradient id="screen" x1="0" y1="0" x2="0.65" y2="1">
      <stop offset="0" stop-color="${sc1}"/>
      <stop offset="1" stop-color="${sc2}"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <filter id="ds" x="-35%" y="-35%" width="170%" height="170%">
      <feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#0f172a" flood-opacity="0.30"/>
    </filter>
  </defs>
  <g filter="url(#ds)">
    <rect x="66" y="18" width="188" height="404" rx="36" fill="url(#body)"/>
    <rect x="72" y="24" width="176" height="392" rx="30" fill="#0b1220" opacity="0.35"/>
    <rect x="78" y="30" width="164" height="380" rx="25" fill="url(#screen)"/>
    <rect x="78" y="30" width="164" height="380" rx="25" fill="url(#sheen)"/>
    <rect x="136" y="43" width="48" height="13" rx="6.5" fill="#0b1220" opacity="0.85"/>
    <rect x="256" y="118" width="5" height="34" rx="2.5" fill="${accent}"/>
    <rect x="256" y="166" width="5" height="54" rx="2.5" fill="${accent}"/>
    <rect x="59" y="138" width="5" height="62" rx="2.5" fill="${accent}"/>
  </g>
</svg>
`;
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const written = [];
  for (const [id, pal] of Object.entries(PALETTES)) {
    const file = path.join(OUT_DIR, `${id}.svg`);
    fs.writeFileSync(file, phoneSVG(`Product render ${id}`, pal), 'utf8');
    written.push(`${id}.svg`);
  }
  const ph = path.join(OUT_DIR, 'placeholder.svg');
  fs.writeFileSync(ph, phoneSVG('PhoneStore placeholder', DEFAULT_PALETTE), 'utf8');
  written.push('placeholder.svg');
  console.log(`Generated ${written.length} product images in ${OUT_DIR}`);
  console.log(written.join(', '));
}

main();