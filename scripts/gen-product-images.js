'use strict';
// =============================================================================
// PhoneStore – Product Image Generator (Vibrant Realistic Smartphone Graphics)
// -----------------------------------------------------------------------------
// Generates standalone, pixel-perfect 1:1 PNG & SVG product graphics for every phone
// variant in public/images/products/, including placeholder.png & placeholder.svg.
// =============================================================================
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

// CRC32 implementation
function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = ((c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1));
    table[i] = c;
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcVal = crc32(Buffer.concat([typeBuf, data]));
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function lerp(a, b, t) { return a + (b - a) * t; }

// Generates a 320x320 PNG with a styled, colorful flagship smartphone illustration
function createPhonePng(phoneColor, wpInfo, isPlaceholder = false) {
  const width = 320;
  const height = 320;

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = makeChunk('IHDR', ihdrData);

  const rowLen = 1 + width * 4;
  const raw = Buffer.alloc(height * rowLen);

  // Phone geometry within 320x320 canvas
  const phoneLeft = 92;
  const phoneRight = 228;
  const phoneTop = 22;
  const phoneBottom = 298;
  const cornerRadius = 26;

  // Ultra-slim bezel screen inside phone
  const screenLeft = phoneLeft + 5;
  const screenRight = phoneRight - 5;
  const screenTop = phoneTop + 5;
  const screenBottom = phoneBottom - 5;
  const screenRadius = 22;

  // Dynamic Island / Notch
  const notchLeft = 143;
  const notchRight = 177;
  const notchTop = screenTop + 6;
  const notchBottom = notchTop + 10;
  const notchRadius = 5;

  function inRoundedRect(x, y, left, right, top, bottom, radius) {
    if (x < left || x > right || y < top || y > bottom) return false;
    if (x < left + radius && y < top + radius) {
      const dx = x - (left + radius);
      const dy = y - (top + radius);
      return dx * dx + dy * dy <= radius * radius;
    }
    if (x > right - radius && y < top + radius) {
      const dx = x - (right - radius);
      const dy = y - (top + radius);
      return dx * dx + dy * dy <= radius * radius;
    }
    if (x < left + radius && y > bottom - radius) {
      const dx = x - (left + radius);
      const dy = y - (bottom - radius);
      return dx * dx + dy * dy <= radius * radius;
    }
    if (x > right - radius && y > bottom - radius) {
      const dx = x - (right - radius);
      const dy = y - (bottom - radius);
      return dx * dx + dy * dy <= radius * radius;
    }
    return true;
  }

  // Side buttons geometry
  function inSideButtons(x, y) {
    // Left action button
    if (x >= phoneLeft - 3 && x < phoneLeft && y >= phoneTop + 36 && y <= phoneTop + 50) return true;
    // Left volume up
    if (x >= phoneLeft - 3 && x < phoneLeft && y >= phoneTop + 64 && y <= phoneTop + 92) return true;
    // Left volume down
    if (x >= phoneLeft - 3 && x < phoneLeft && y >= phoneTop + 102 && y <= phoneTop + 130) return true;
    // Right power button
    if (x > phoneRight && x <= phoneRight + 3 && y >= phoneTop + 72 && y <= phoneTop + 116) return true;
    return false;
  }

  const topC = (wpInfo && wpInfo.top) || [30, 45, 75];
  const midC = (wpInfo && wpInfo.mid) || [70, 110, 180];
  const botC = (wpInfo && wpInfo.bot) || [15, 20, 35];
  const accentC = (wpInfo && wpInfo.accent) || [100, 180, 255];

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLen;
    raw[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const px = rowOffset + 1 + x * 4;

      // 1. Side buttons check
      if (inSideButtons(x, y)) {
        raw[px] = Math.max(0, phoneColor[0] - 25);
        raw[px + 1] = Math.max(0, phoneColor[1] - 25);
        raw[px + 2] = Math.max(0, phoneColor[2] - 25);
        raw[px + 3] = 255;
        continue;
      }

      // 2. Main phone body check
      if (inRoundedRect(x, y, phoneLeft, phoneRight, phoneTop, phoneBottom, cornerRadius)) {
        // A. Screen Check
        if (inRoundedRect(x, y, screenLeft, screenRight, screenTop, screenBottom, screenRadius)) {
          // Dynamic Island check
          if (inRoundedRect(x, y, notchLeft, notchRight, notchTop, notchBottom, notchRadius)) {
            // Camera lens reflection at (168, notchTop + 5)
            const lensDist = Math.hypot(x - 168, y - (notchTop + 5));
            if (lensDist <= 2.2) {
              raw[px] = 30; raw[px + 1] = 45; raw[px + 2] = 85; raw[px + 3] = 255;
            } else {
              raw[px] = 8; raw[px + 1] = 9; raw[px + 2] = 12; raw[px + 3] = 255;
            }
          } else if (isPlaceholder) {
            // Clean placeholder phone pattern
            const isCenterBox = (x >= 120 && x <= 200 && y >= 110 && y <= 190);
            const isCenterBorder = isCenterBox && (x === 120 || x === 200 || y === 110 || y === 190);
            const isCross = (x === 160 && y >= 130 && y <= 170) || (y === 150 && x >= 140 && x <= 180);
            if (isCenterBorder || isCross) {
              raw[px] = 148; raw[px + 1] = 163; raw[px + 2] = 184; raw[px + 3] = 255;
            } else {
              const bg = 240 + Math.floor(((y - screenTop) / (screenBottom - screenTop)) * 10);
              raw[px] = bg; raw[px + 1] = bg; raw[px + 2] = bg + 3; raw[px + 3] = 255;
            }
          } else {
            // --- VIBRANT COLORFUL WALLPAPER RENDERING ---
            const u = (x - screenLeft) / (screenRight - screenLeft);
            const v = (y - screenTop) / (screenBottom - screenTop);

            // Base dual-stop smooth curve
            let r, g, b;
            if (v < 0.45) {
              const t = v / 0.45;
              r = lerp(topC[0], midC[0], t);
              g = lerp(topC[1], midC[1], t);
              b = lerp(topC[2], midC[2], t);
            } else {
              const t = (v - 0.45) / 0.55;
              r = lerp(midC[0], botC[0], t);
              g = lerp(midC[1], botC[1], t);
              b = lerp(midC[2], botC[2], t);
            }

            // Central Glowing Sphere / Ribbon
            const flareDx = (u - 0.5) * 1.6;
            const flareDy = (v - 0.52);
            const flareDist = Math.sqrt(flareDx * flareDx + flareDy * flareDy);
            if (flareDist < 0.46) {
              const glow = Math.pow(1 - flareDist / 0.46, 1.8);
              r = Math.min(255, r + accentC[0] * glow * 0.85);
              g = Math.min(255, g + accentC[1] * glow * 0.85);
              b = Math.min(255, b + accentC[2] * glow * 0.85);
            }

            // Diagonal specular glass sweep across screen
            if (x + y > 150 && x + y < 195) {
              const sweep = 1 - Math.abs((x + y) - 172) / 22;
              r = Math.min(255, r + 45 * sweep);
              g = Math.min(255, g + 45 * sweep);
              b = Math.min(255, b + 55 * sweep);
            }

            // Status bar elements (Top row)
            // Clock dots (left: x 106..120, y 15..17)
            if (y >= screenTop + 8 && y <= screenTop + 10 && x >= screenLeft + 10 && x <= screenLeft + 24) {
              r = 255; g = 255; b = 255;
            }
            // Battery icon (right: x 204..216, y 14..18)
            if (y >= screenTop + 8 && y <= screenTop + 11 && x >= screenRight - 22 && x <= screenRight - 10) {
              if (x === screenRight - 22 || x === screenRight - 11 || y === screenTop + 8 || y === screenTop + 11) {
                r = 255; g = 255; b = 255;
              } else {
                r = 52; g = 211; b = 153; // green battery fill
              }
            }

            // Bottom Frosted Glass Dock (x: 104..216, y: 254..280)
            const dockTop = screenBottom - 32;
            const dockBot = screenBottom - 10;
            const dockLeft = screenLeft + 8;
            const dockRight = screenRight - 8;

            if (inRoundedRect(x, y, dockLeft, dockRight, dockTop, dockBot, 8)) {
              // Glass dock background
              r = Math.min(255, Math.floor(r * 0.65 + 255 * 0.35));
              g = Math.min(255, Math.floor(g * 0.65 + 255 * 0.35));
              b = Math.min(255, Math.floor(b * 0.65 + 255 * 0.35));

              // 4 Colorful App Icons inside dock
              const appY = dockTop + 4;
              const appH = 14;
              // App 1 (Phone: Emerald)
              if (x >= dockLeft + 6 && x <= dockLeft + 20 && y >= appY && y <= appY + appH) {
                r = 34; g = 197; b = 94;
              }
              // App 2 (Safari: Blue)
              else if (x >= dockLeft + 31 && x <= dockLeft + 45 && y >= appY && y <= appY + appH) {
                r = 59; g = 130; b = 246;
              }
              // App 3 (Messages: Teal)
              else if (x >= dockLeft + 56 && x <= dockLeft + 70 && y >= appY && y <= appY + appH) {
                r = 20; g = 184; b = 166;
              }
              // App 4 (Music: Rose)
              else if (x >= dockLeft + 81 && x <= dockLeft + 95 && y >= appY && y <= appY + appH) {
                r = 244; g = 63; b = 94;
              }
            }

            // Home indicator bar at bottom
            if (y >= screenBottom - 6 && y <= screenBottom - 4 && x >= 138 && x <= 182) {
              r = 255; g = 255; b = 255;
            }

            raw[px] = Math.round(r);
            raw[px + 1] = Math.round(g);
            raw[px + 2] = Math.round(b);
            raw[px + 3] = 255;
          }
        } else {
          // B. Phone Bezel & Metallic Chassis Rim
          const isOuterBorder = (x === phoneLeft || x === phoneRight - 1 || y === phoneTop || y === phoneBottom - 1);
          const isHighlight = (x <= phoneLeft + 2 || y <= phoneTop + 2);

          let br = phoneColor[0];
          let bg = phoneColor[1];
          let bb = phoneColor[2];

          if (isHighlight) {
            br = Math.min(255, br + 50);
            bg = Math.min(255, bg + 50);
            bb = Math.min(255, bb + 50);
          } else if (isOuterBorder) {
            br = Math.max(0, br - 30);
            bg = Math.max(0, bg - 30);
            bb = Math.max(0, bb - 30);
          } else {
            // Sleek dark inner bezel
            br = Math.max(15, Math.floor(br * 0.25));
            bg = Math.max(15, Math.floor(bg * 0.25));
            bb = Math.max(20, Math.floor(bb * 0.25));
          }

          raw[px] = br;
          raw[px + 1] = bg;
          raw[px + 2] = bb;
          raw[px + 3] = 255;
        }
      } else {
        // C. Soft ambient drop shadow around the phone
        const shadowDist = Math.hypot(
          Math.max(phoneLeft - x, 0, x - phoneRight),
          Math.max(phoneTop - y, 0, y - phoneBottom)
        );
        if (shadowDist > 0 && shadowDist < 14) {
          const shadowAlpha = Math.floor(55 * (1 - shadowDist / 14));
          raw[px] = 15;
          raw[px + 1] = 23;
          raw[px + 2] = 42;
          raw[px + 3] = shadowAlpha;
        } else {
          raw[px] = 0;
          raw[px + 1] = 0;
          raw[px + 2] = 0;
          raw[px + 3] = 0;
        }
      }
    }
  }

  const idat = makeChunk('IDAT', zlib.deflateSync(raw, { level: 9 }));
  const iend = makeChunk('IEND', Buffer.alloc(0));
  return Buffer.concat([sig, ihdr, idat, iend]);
}

// Generate high quality SVG version
function createPhoneSvg(title, bodyHex, hex1, hex2, accentHex) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="320" height="320" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="bodyGrad_${title.replace(/[^a-zA-Z0-9]/g, '')}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
      <stop offset="15%" stop-color="${bodyHex}"/>
      <stop offset="85%" stop-color="${bodyHex}"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.6"/>
    </linearGradient>
    <linearGradient id="screenGrad_${title.replace(/[^a-zA-Z0-9]/g, '')}" x1="0" y1="0" x2="0.8" y2="1">
      <stop offset="0%" stop-color="${hex1}"/>
      <stop offset="45%" stop-color="${accentHex}"/>
      <stop offset="100%" stop-color="${hex2}"/>
    </linearGradient>
    <radialGradient id="screenGlow_${title.replace(/[^a-zA-Z0-9]/g, '')}" cx="50%" cy="52%" r="45%">
      <stop offset="0%" stop-color="${accentHex}" stop-opacity="0.9"/>
      <stop offset="60%" stop-color="${accentHex}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${hex2}" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#shadow)">
    <!-- Side Buttons -->
    <rect x="89" y="58" width="3" height="14" rx="1.5" fill="${bodyHex}"/>
    <rect x="89" y="86" width="3" height="28" rx="1.5" fill="${bodyHex}"/>
    <rect x="89" y="124" width="3" height="28" rx="1.5" fill="${bodyHex}"/>
    <rect x="228" y="94" width="3" height="44" rx="1.5" fill="${bodyHex}"/>
    
    <!-- Phone Chassis -->
    <rect x="92" y="22" width="136" height="276" rx="26" fill="url(#bodyGrad_${title.replace(/[^a-zA-Z0-9]/g, '')})" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/>
    <rect x="94" y="24" width="132" height="272" rx="24" fill="#090d16"/>
    
    <!-- OLED Screen -->
    <rect x="97" y="27" width="126" height="266" rx="22" fill="url(#screenGrad_${title.replace(/[^a-zA-Z0-9]/g, '')})"/>
    <circle cx="160" cy="165" r="54" fill="url(#screenGlow_${title.replace(/[^a-zA-Z0-9]/g, '')})"/>
    
    <!-- Status Bar -->
    <rect x="107" y="35" width="18" height="3" rx="1" fill="#ffffff" opacity="0.9"/>
    <rect x="199" y="34" width="12" height="5" rx="1.5" fill="#ffffff" opacity="0.9"/>
    <rect x="201" y="35.5" width="6" height="2" rx="0.5" fill="#10b981"/>

    <!-- Dynamic Island -->
    <rect x="143" y="33" width="34" height="10" rx="5" fill="#08090d"/>
    <circle cx="168" cy="38" r="2" fill="#2563eb" opacity="0.7"/>

    <!-- Frosted Glass Dock -->
    <rect x="105" y="258" width="110" height="24" rx="8" fill="rgba(255, 255, 255, 0.28)" stroke="rgba(255, 255, 255, 0.4)" stroke-width="0.5"/>
    <rect x="111" y="263" width="14" height="14" rx="3.5" fill="#22c55e"/>
    <rect x="139" y="263" width="14" height="14" rx="3.5" fill="#3b82f6"/>
    <rect x="167" y="263" width="14" height="14" rx="3.5" fill="#14b8a6"/>
    <rect x="195" y="263" width="14" height="14" rx="3.5" fill="#f43f5e"/>

    <!-- Home Indicator -->
    <rect x="138" y="286" width="44" height="3" rx="1.5" fill="#ffffff" opacity="0.95"/>
    
    <!-- Diagonal Glass Sheen -->
    <path d="M 97 45 L 180 27 L 110 160 Z" fill="#ffffff" opacity="0.10"/>
  </g>
</svg>`;
}

// Master color definitions with radiant OLED wallpapers
const IMAGES = {
  // iPhone 16 Pro (SP001)
  'iphone16-pro-titan-samac.png': {
    rgb: [214, 185, 155], hex: '#d6b99b',
    wp: { top: [55, 35, 25], mid: [195, 125, 70], bot: [20, 15, 30], accent: [255, 195, 110] },
    svgHex: ['#372319', '#140f1e', '#ffc36e']
  },
  'iphone16-pro-titan-tunhien.png': {
    rgb: [175, 172, 166], hex: '#afaca6',
    wp: { top: [30, 42, 65], mid: [90, 130, 185], bot: [12, 18, 30], accent: [140, 200, 255] },
    svgHex: ['#1e2a41', '#0c121e', '#8cc8ff']
  },
  'iphone16-pro-titan-den.png': {
    rgb: [48, 50, 54], hex: '#303236',
    wp: { top: [18, 20, 32], mid: [45, 60, 100], bot: [8, 10, 18], accent: [0, 210, 255] },
    svgHex: ['#121420', '#080a12', '#00d2ff']
  },
  'iphone16-pro-vang-gold.png': {
    rgb: [230, 205, 140], hex: '#e6cd8c',
    wp: { top: [65, 45, 20], mid: [225, 165, 60], bot: [25, 18, 12], accent: [255, 225, 120] },
    svgHex: ['#412d14', '#19120c', '#ffe178']
  },

  // iPhone 16 Pro Max (SP008)
  'iphone16-pro-max-titan-samac.png': {
    rgb: [214, 185, 155], hex: '#d6b99b',
    wp: { top: [55, 35, 25], mid: [195, 125, 70], bot: [20, 15, 30], accent: [255, 195, 110] },
    svgHex: ['#372319', '#140f1e', '#ffc36e']
  },
  'iphone16-pro-max-titan-tunhien.png': {
    rgb: [175, 172, 166], hex: '#afaca6',
    wp: { top: [30, 42, 65], mid: [90, 130, 185], bot: [12, 18, 30], accent: [140, 200, 255] },
    svgHex: ['#1e2a41', '#0c121e', '#8cc8ff']
  },
  'iphone16-pro-max-titan-den.png': {
    rgb: [48, 50, 54], hex: '#303236',
    wp: { top: [18, 20, 32], mid: [45, 60, 100], bot: [8, 10, 18], accent: [0, 210, 255] },
    svgHex: ['#121420', '#080a12', '#00d2ff']
  },

  // iPhone 18 Pro Max (SP009)
  'iphone18-pro-max-titan-xam.png': {
    rgb: [140, 145, 155], hex: '#8c919b',
    wp: { top: [35, 45, 75], mid: [80, 150, 235], bot: [15, 20, 35], accent: [100, 210, 255] },
    svgHex: ['#232d4b', '#0f1423', '#64d2ff']
  },
  'iphone18-pro-max-cosmic-den.png': {
    rgb: [35, 36, 44], hex: '#23242c',
    wp: { top: [25, 15, 45], mid: [95, 45, 160], bot: [10, 8, 20], accent: [190, 75, 255] },
    svgHex: ['#190f2d', '#0a0814', '#be4bff']
  },
  'iphone18-pro-max-frost-bac.png': {
    rgb: [225, 230, 240], hex: '#e1e6f0',
    wp: { top: [40, 60, 95], mid: [120, 180, 245], bot: [20, 30, 50], accent: [160, 230, 255] },
    svgHex: ['#283c5f', '#141e32', '#a0e6ff']
  },

  // iPhone 15 (SP005)
  'iphone15-den-midnight.png': {
    rgb: [42, 46, 56], hex: '#2a2e38',
    wp: { top: [20, 25, 40], mid: [50, 75, 120], bot: [10, 12, 20], accent: [70, 160, 250] },
    svgHex: ['#141928', '#0a0c14', '#46a0fa']
  },
  'iphone15-xanh-lam.png': {
    rgb: [175, 215, 235], hex: '#afd7eb',
    wp: { top: [25, 65, 95], mid: [75, 175, 235], bot: [15, 35, 55], accent: [100, 230, 255] },
    svgHex: ['#19415f', '#0f2337', '#64e6ff']
  },
  'iphone15-hong-pastel.png': {
    rgb: [240, 195, 205], hex: '#f0c3cd',
    wp: { top: [75, 30, 45], mid: [225, 105, 135], bot: [30, 12, 20], accent: [255, 155, 185] },
    svgHex: ['#4b1e2d', '#1e0c14', '#ff9bb9']
  },

  // Samsung Galaxy S24 Ultra (SP002)
  's24-ultra-xam-titan.png': {
    rgb: [130, 133, 140], hex: '#82858c',
    wp: { top: [45, 35, 65], mid: [130, 100, 185], bot: [18, 15, 30], accent: [210, 160, 255] },
    svgHex: ['#2d2341', '#120f1e', '#d2a0ff']
  },
  's24-ultra-den-titan.png': {
    rgb: [45, 48, 52], hex: '#2d3034',
    wp: { top: [20, 22, 32], mid: [60, 70, 110], bot: [10, 10, 16], accent: [80, 170, 255] },
    svgHex: ['#141620', '#0a0a10', '#50aaff']
  },
  's24-ultra-vang-titan.png': {
    rgb: [225, 208, 160], hex: '#e1d0a0',
    wp: { top: [65, 50, 25], mid: [215, 170, 70], bot: [25, 20, 12], accent: [255, 230, 120] },
    svgHex: ['#413219', '#19140c', '#ffe678']
  },

  // Samsung Galaxy S26 Ultra (SP012)
  's26-ultra-phantom-titanium.png': {
    rgb: [50, 55, 68], hex: '#323744',
    wp: { top: [35, 25, 60], mid: [110, 65, 180], bot: [15, 12, 28], accent: [185, 115, 255] },
    svgHex: ['#23193c', '#0f0c1c', '#b973ff']
  },
  's26-ultra-silver-titanium.png': {
    rgb: [200, 205, 215], hex: '#c8cdd7',
    wp: { top: [30, 50, 80], mid: [85, 145, 225], bot: [15, 22, 38], accent: [120, 210, 255] },
    svgHex: ['#1e3250', '#0f1626', '#78d2ff']
  },

  // Samsung Galaxy A55 5G (SP004)
  'galaxy-a55-xanh-navy.png': {
    rgb: [38, 52, 82], hex: '#263452',
    wp: { top: [20, 35, 65], mid: [50, 100, 180], bot: [10, 18, 35], accent: [80, 175, 255] },
    svgHex: ['#142341', '#0a1223', '#50afff']
  },
  'galaxy-a55-xanh-bang.png': {
    rgb: [180, 220, 240], hex: '#b4dcf0',
    wp: { top: [25, 70, 100], mid: [80, 185, 240], bot: [15, 40, 60], accent: [120, 235, 255] },
    svgHex: ['#194664', '#0f283c', '#78ebff']
  },
  'galaxy-a55-tim-lilac.png': {
    rgb: [205, 190, 225], hex: '#cdbee1',
    wp: { top: [55, 35, 75], mid: [160, 110, 215], bot: [22, 15, 32], accent: [215, 165, 255] },
    svgHex: ['#37234b', '#160f20', '#d7a5ff']
  },

  // Xiaomi 14 (SP003)
  'xiaomi14-xanh-ngoc.png': {
    rgb: [95, 175, 145], hex: '#5faf91',
    wp: { top: [20, 60, 48], mid: [60, 175, 135], bot: [12, 32, 26], accent: [95, 245, 195] },
    svgHex: ['#143c30', '#0c201a', '#5ff5c3']
  },
  'xiaomi14-den-nham.png': {
    rgb: [42, 45, 50], hex: '#2a2d32',
    wp: { top: [40, 15, 20], mid: [140, 45, 55], bot: [15, 8, 10], accent: [255, 75, 90] },
    svgHex: ['#280f14', '#0f080a', '#ff4b5a']
  },
  'xiaomi14-trang-tuyet.png': {
    rgb: [240, 242, 246], hex: '#f0f2f6',
    wp: { top: [35, 45, 70], mid: [100, 140, 210], bot: [18, 22, 38], accent: [150, 200, 255] },
    svgHex: ['#232d46', '#121626', '#96c8ff']
  },

  // Xiaomi 14 Ultra (SP010)
  'xiaomi14-ultra-den.png': {
    rgb: [36, 38, 42], hex: '#24262a',
    wp: { top: [45, 25, 15], mid: [170, 85, 40], bot: [18, 10, 8], accent: [255, 140, 65] },
    svgHex: ['#2d190f', '#120a08', '#ff8c41']
  },
  'xiaomi14-ultra-trang.png': {
    rgb: [238, 240, 245], hex: '#eef0f5',
    wp: { top: [30, 48, 80], mid: [85, 140, 225], bot: [14, 22, 38], accent: [125, 205, 255] },
    svgHex: ['#1e3050', '#0e1626', '#7dcdff']
  },

  // Xiaomi 18 Ultra (SP011)
  'xiaomi18-ultra-trang.png': {
    rgb: [242, 244, 248], hex: '#f2f4f8',
    wp: { top: [25, 55, 85], mid: [75, 160, 235], bot: [12, 25, 42], accent: [110, 220, 255] },
    svgHex: ['#193755', '#0c192a', '#6edcff']
  },
  'xiaomi18-ultra-den.png': {
    rgb: [40, 42, 50], hex: '#282a32',
    wp: { top: [15, 30, 50], mid: [45, 95, 165], bot: [8, 14, 26], accent: [60, 185, 255] },
    svgHex: ['#0f1e32', '#080e1a', '#3cb9ff']
  },

  // OPPO Find X7 Ultra (SP006)
  'oppo-find-x7-nau.png': {
    rgb: [168, 110, 65], hex: '#a86e41',
    wp: { top: [65, 35, 18], mid: [210, 115, 50], bot: [26, 14, 8], accent: [255, 175, 90] },
    svgHex: ['#412312', '#1a0e08', '#ffaf5a']
  },
  'oppo-find-x7-xanh.png': {
    rgb: [48, 112, 138], hex: '#30708a',
    wp: { top: [18, 48, 70], mid: [50, 140, 195], bot: [10, 24, 38], accent: [75, 215, 255] },
    svgHex: ['#123046', '#0a1826', '#4bd7ff']
  },
  'oppo-find-x7-den.png': {
    rgb: [38, 40, 44], hex: '#26282c',
    wp: { top: [22, 24, 35], mid: [60, 75, 115], bot: [10, 12, 18], accent: [90, 165, 255] },
    svgHex: ['#161823', '#0a0c12', '#5aa5ff']
  },

  // iPhone SE (SP007)
  'iphone-se-midnight.png': {
    rgb: [45, 48, 56], hex: '#2d3038',
    wp: { top: [20, 30, 50], mid: [60, 90, 145], bot: [12, 15, 25], accent: [80, 170, 255] },
    svgHex: ['#141e32', '#0c0f19', '#50aaff']
  },

  // Prompt canonical aliases
  'iphone16-promax-desert.png': {
    rgb: [214, 185, 155], hex: '#d6b99b',
    wp: { top: [55, 35, 25], mid: [195, 125, 70], bot: [20, 15, 30], accent: [255, 195, 110] },
    svgHex: ['#372319', '#140f1e', '#ffc36e']
  },
  'iphone16-promax-black.png': {
    rgb: [48, 50, 54], hex: '#303236',
    wp: { top: [18, 20, 32], mid: [45, 60, 100], bot: [8, 10, 18], accent: [0, 210, 255] },
    svgHex: ['#121420', '#080a12', '#00d2ff']
  },
  's26-ultra-titanium.png': {
    rgb: [50, 55, 68], hex: '#323744',
    wp: { top: [35, 25, 60], mid: [110, 65, 180], bot: [15, 12, 28], accent: [185, 115, 255] },
    svgHex: ['#23193c', '#0f0c1c', '#b973ff']
  },
  'xiaomi-14-ultra-white.png': {
    rgb: [238, 240, 245], hex: '#eef0f5',
    wp: { top: [30, 48, 80], mid: [85, 140, 225], bot: [14, 22, 38], accent: [125, 205, 255] },
    svgHex: ['#1e3050', '#0e1626', '#7dcdff']
  }
};

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const written = [];

  // 1. Placeholder PNG & SVG
  const phPng = createPhonePng([203, 213, 225], null, true);
  fs.writeFileSync(path.join(OUT_DIR, 'placeholder.png'), phPng);
  written.push('placeholder.png');

  const phSvg = createPhoneSvg('PhoneStore Placeholder', '#cbd5e1', '#f1f5f9', '#94a3b8', '#cbd5e1');
  fs.writeFileSync(path.join(OUT_DIR, 'placeholder.svg'), phSvg, 'utf8');
  written.push('placeholder.svg');

  // 2. All variant PNGs & SVGs
  for (const [filename, info] of Object.entries(IMAGES)) {
    const pngBuf = createPhonePng(info.rgb, info.wp);
    fs.writeFileSync(path.join(OUT_DIR, filename), pngBuf);
    written.push(filename);

    const baseName = filename.replace(/\.png$/, '');
    const svgHex = info.svgHex || ['#1e293b', '#0f172a', '#3b82f6'];
    const svgContent = createPhoneSvg(baseName, info.hex, svgHex[0], svgHex[1], svgHex[2]);
    fs.writeFileSync(path.join(OUT_DIR, `${baseName}.svg`), svgContent, 'utf8');
    written.push(`${baseName}.svg`);
  }

  // 3. Legacy SP001.svg .. SP012.svg
  const legacyMap = {
    SP001: ['#eef2f7', '#1e293b', '#0f172a', '#3b82f6'],
    SP002: ['#8b93a1', '#23193c', '#0f0c1c', '#b973ff'],
    SP003: ['#6ee7b7', '#143c30', '#0c201a', '#5ff5c3'],
    SP004: ['#475569', '#142341', '#0a1223', '#50afff'],
    SP005: ['#f87171', '#4b1e2d', '#1e0c14', '#ff9bb9'],
    SP006: ['#ea580c', '#412312', '#1a0e08', '#ffaf5a'],
    SP007: ['#4b5563', '#141e32', '#0c0f19', '#50aaff'],
    SP008: ['#52525b', '#372319', '#140f1e', '#ffc36e'],
    SP009: ['#e3cba9', '#232d4b', '#0f1423', '#64d2ff'],
    SP010: ['#f8fafc', '#1e3050', '#0e1626', '#7dcdff'],
    SP011: ['#334155', '#193755', '#0c192a', '#6edcff'],
    SP012: ['#334155', '#23193c', '#0f0c1c', '#b973ff']
  };
  for (const [id, [color, h1, h2, ac]] of Object.entries(legacyMap)) {
    const svgFile = path.join(OUT_DIR, `${id}.svg`);
    fs.writeFileSync(svgFile, createPhoneSvg(id, color, h1, h2, ac), 'utf8');
    written.push(`${id}.svg`);
  }

  console.log(`Generated ${written.length} vibrant product images in ${OUT_DIR}`);
}

main();