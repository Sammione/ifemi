import fs from 'fs';
import path from 'path';

const storefrontDir = path.resolve('apps/storefront-vite/public/images/products');
const adminDir = path.resolve('apps/admin-vite/public/images/products');

fs.mkdirSync(storefrontDir, { recursive: true });
fs.mkdirSync(adminDir, { recursive: true });

function createProductSVG({ title, category, sku, bgGradient, iconPath, accentColor = '#D4AF37' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      ${bgGradient}
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.35"/>
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F3E5AB"/>
      <stop offset="50%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#AA7C11"/>
    </linearGradient>
  </defs>

  <!-- Background Base -->
  <rect width="600" height="800" fill="url(#bg)"/>
  <rect width="600" height="800" fill="url(#glow)"/>

  <!-- Subtle Luxury Geometric Frame -->
  <rect x="25" y="25" width="550" height="750" fill="none" stroke="${accentColor}" stroke-width="1" stroke-opacity="0.3"/>
  <rect x="35" y="35" width="530" height="730" fill="none" stroke="${accentColor}" stroke-width="0.5" stroke-opacity="0.15"/>

  <!-- Brand Wordmark Header -->
  <g transform="translate(300, 90)" text-anchor="middle">
    <text y="0" font-family="'Playfair Display', Georgia, serif" font-weight="900" font-size="28" fill="#FAF9F6" letter-spacing="-1">ifẹ́mi</text>
    <text y="16" font-family="Inter, sans-serif" font-weight="600" font-size="8" fill="${accentColor}" letter-spacing="4">L I F E S T Y L E</text>
    <text y="30" font-family="Inter, sans-serif" font-weight="400" font-size="7" fill="#FAF9F6" opacity="0.5" letter-spacing="2">ATELIER LAGOS</text>
  </g>

  <!-- Center Artwork Icon & Silhouette -->
  <g transform="translate(300, 390)" text-anchor="middle">
    <!-- Ambient Circle Backing -->
    <circle r="140" fill="#ffffff" fill-opacity="0.04" stroke="${accentColor}" stroke-width="1" stroke-dasharray="3 3" stroke-opacity="0.3"/>
    <circle r="110" fill="#ffffff" fill-opacity="0.03"/>
    
    <!-- Custom Vector Silhouette -->
    ${iconPath}
  </g>

  <!-- Category & Product Title Footer -->
  <g transform="translate(300, 680)" text-anchor="middle">
    <rect x="-90" y="-32" width="180" height="20" fill="${accentColor}" rx="2"/>
    <text y="-18" font-family="Inter, sans-serif" font-weight="700" font-size="8" fill="#0B132B" letter-spacing="2">${category.toUpperCase()}</text>
    
    <text y="14" font-family="'Playfair Display', Georgia, serif" font-weight="700" font-size="20" fill="#FAF9F6">${title}</text>
    <text y="36" font-family="monospace" font-weight="600" font-size="10" fill="${accentColor}" opacity="0.8" letter-spacing="1">SKU: ${sku}</text>
  </g>
</svg>`;
}

const assets = [
  {
    filename: 'kaftan-1.svg',
    title: 'Midnight Elegance Kaftan',
    category: 'Kaftan Collection',
    sku: 'KAFTAN-BLU-001',
    bgGradient: '<stop offset="0%" stop-color="#0B132B"/><stop offset="100%" stop-color="#1C2541"/>',
    iconPath: `<path d="M-60,-80 C-40,-50 -20,-70 0,-70 C20,-70 40,-50 60,-80 L85,60 C60,75 20,85 0,85 C-20,85 -60,75 -85,60 Z" fill="none" stroke="url(#gold)" stroke-width="2.5"/>
    <path d="M0,-70 L0,50" stroke="url(#gold)" stroke-width="1.5" stroke-dasharray="4 3"/>
    <circle cx="0" cy="-30" r="14" fill="none" stroke="url(#gold)" stroke-width="1.5"/>`
  },
  {
    filename: 'kaftan-2.svg',
    title: 'Filigree Silk Detail',
    category: 'Kaftan Angle 2',
    sku: 'KAFTAN-BLU-001-B',
    bgGradient: '<stop offset="0%" stop-color="#141E30"/><stop offset="100%" stop-color="#243B55"/>',
    iconPath: `<path d="M-50,-70 Q0,-40 50,-70 Q70,40 0,80 Q-70,40 -50,-70 Z" fill="none" stroke="url(#gold)" stroke-width="2"/>
    <path d="M-30,-20 Q0,20 30,-20" fill="none" stroke="url(#gold)" stroke-width="1.5"/>`
  },
  {
    filename: 'kaftan-3.svg',
    title: 'Back Drape Silhouette',
    category: 'Kaftan Angle 3',
    sku: 'KAFTAN-BLU-001-C',
    bgGradient: '<stop offset="0%" stop-color="#0B132B"/><stop offset="100%" stop-color="#4B2E83"/>',
    iconPath: `<path d="M-55,-75 L55,-75 L75,70 L-75,70 Z" fill="none" stroke="url(#gold)" stroke-width="2"/>
    <circle cx="0" cy="-10" r="30" fill="none" stroke="url(#gold)" stroke-width="1.5"/>`
  },
  {
    filename: 'trouser-1.svg',
    title: 'Royal Purple Trouser Set',
    category: 'Trouser Sets',
    sku: 'TSET-PRP-002',
    bgGradient: '<stop offset="0%" stop-color="#301934"/><stop offset="100%" stop-color="#4B2E83"/>',
    iconPath: `<path d="M-40,-80 L40,-80 L30,-10 L-30,-10 Z" fill="none" stroke="#E6E6FA" stroke-width="2"/>
    <path d="M-30,-5 L-40,80 L-10,80 L-5,10 L5,10 L10,80 L40,80 L30,-5 Z" fill="none" stroke="#E6E6FA" stroke-width="2"/>`
  },
  {
    filename: 'trouser-2.svg',
    title: 'Tailored Crepe Crossover',
    category: 'Trouser Set Detail',
    sku: 'TSET-PRP-002-B',
    bgGradient: '<stop offset="0%" stop-color="#240046"/><stop offset="100%" stop-color="#5A189A"/>',
    iconPath: `<path d="M-45,-60 L45,-60 L25,40 L-25,40 Z" fill="none" stroke="#E6E6FA" stroke-width="2"/>
    <path d="M-45,-60 L25,40 M45,-60 L-25,40" stroke="#E6E6FA" stroke-width="1.5"/>`
  },
  {
    filename: 'loungewear-1.svg',
    title: 'Lavender Whisper Silk Set',
    category: 'Loungewear',
    sku: 'LNG-LAV-003',
    bgGradient: '<stop offset="0%" stop-color="#2D1B4E"/><stop offset="100%" stop-color="#5E3A8C"/>',
    iconPath: `<path d="M-40,-70 Q0,-50 40,-70 L50,0 L-50,0 Z" fill="none" stroke="#E6E6FA" stroke-width="2"/>
    <path d="M-35,5 L-40,75 L-10,75 L-5,15 L5,15 L10,75 L40,75 L35,5 Z" fill="none" stroke="#E6E6FA" stroke-width="2"/>`
  },
  {
    filename: 'cushion-1.svg',
    title: 'Handwoven Artisanal Cushion',
    category: 'Living Accents',
    sku: 'CSH-IVO-004',
    bgGradient: '<stop offset="0%" stop-color="#1E1B18"/><stop offset="100%" stop-color="#3D342A"/>',
    iconPath: `<rect x="-60" y="-60" width="120" height="120" rx="10" fill="none" stroke="url(#gold)" stroke-width="2.5"/>
    <path d="M-40,-40 L40,40 M-40,40 L40,-40" stroke="url(#gold)" stroke-width="1.5" stroke-dasharray="3 3"/>
    <circle cx="0" cy="0" r="25" fill="none" stroke="url(#gold)" stroke-width="1.5"/>`
  },
  {
    filename: 'cushion-2.svg',
    title: 'Geometric Motif Cushion',
    category: 'Living Accents',
    sku: 'CSH-IVO-004-B',
    bgGradient: '<stop offset="0%" stop-color="#1F2421"/><stop offset="100%" stop-color="#333D29"/>',
    iconPath: `<rect x="-55" y="-55" width="110" height="110" rx="8" fill="none" stroke="url(#gold)" stroke-width="2"/>
    <polygon points="0,-40 40,0 0,40 -40,0" fill="none" stroke="url(#gold)" stroke-width="1.5"/>`
  },
  {
    filename: 'diffuser-1.svg',
    title: 'Royal Oud & Amber Diffuser',
    category: 'Home Fragrance',
    sku: 'DIF-OUD-005',
    bgGradient: '<stop offset="0%" stop-color="#1A0F00"/><stop offset="100%" stop-color="#4A2800"/>',
    iconPath: `<path d="M-25,-85 L-5,-10 M0,-90 L0,-10 M25,-85 L5,-10" stroke="url(#gold)" stroke-width="2"/>
    <rect x="-30" y="-10" width="60" height="85" rx="6" fill="none" stroke="url(#gold)" stroke-width="2.5"/>
    <rect x="-15" y="-22" width="30" height="12" rx="2" fill="url(#gold)"/>`
  },
  {
    filename: 'diffuser-2.svg',
    title: 'Sandalwood & Cedar Diffuser',
    category: 'Home Fragrance',
    sku: 'DIF-VAN-009',
    bgGradient: '<stop offset="0%" stop-color="#241400"/><stop offset="100%" stop-color="#5C3800"/>',
    iconPath: `<path d="M-20,-80 L-5,-10 M0,-85 L0,-10 M20,-80 L5,-10" stroke="url(#gold)" stroke-width="2"/>
    <circle cx="0" cy="30" r="45" fill="none" stroke="url(#gold)" stroke-width="2.5"/>
    <rect x="-12" y="-18" width="24" height="12" rx="2" fill="url(#gold)"/>`
  },
  {
    filename: 'jewellery-1.svg',
    title: 'Sculptural Brass Earrings',
    category: 'Bespoke Jewellery',
    sku: 'JWL-BRS-006',
    bgGradient: '<stop offset="0%" stop-color="#1E1E24"/><stop offset="100%" stop-color="#2E282A"/>',
    iconPath: `<circle cx="-25" cy="-50" r="6" fill="url(#gold)"/>
    <path d="M-25,-44 Q-45,10 -25,50 Q-5,10 -25,-44 Z" fill="none" stroke="url(#gold)" stroke-width="2.5"/>
    <circle cx="25" cy="-50" r="6" fill="url(#gold)"/>
    <path d="M25,-44 Q5,10 25,50 Q45,10 25,-44 Z" fill="none" stroke="url(#gold)" stroke-width="2.5"/>`
  },
  {
    filename: 'jewellery-2.svg',
    title: 'Handcrafted Brass Drop',
    category: 'Bespoke Jewellery',
    sku: 'JWL-BRS-006-B',
    bgGradient: '<stop offset="0%" stop-color="#0D1B2A"/><stop offset="100%" stop-color="#1B263B"/>',
    iconPath: `<circle cx="0" cy="-45" r="8" fill="url(#gold)"/>
    <polygon points="0,-30 35,40 -35,40" fill="none" stroke="url(#gold)" stroke-width="2.5"/>
    <circle cx="0" cy="15" r="12" fill="none" stroke="url(#gold)" stroke-width="1.5"/>`
  },
  {
    filename: 'kaftan-black.svg',
    title: 'Obsidian Velvet Kaftan',
    category: 'Kaftans',
    sku: 'KAFTAN-BLK-007',
    bgGradient: '<stop offset="0%" stop-color="#050505"/><stop offset="100%" stop-color="#1A1A1A"/>',
    iconPath: `<path d="M-60,-75 L60,-75 L80,65 L-80,65 Z" fill="none" stroke="url(#gold)" stroke-width="2.5"/>
    <path d="M-20,-75 L0,10 L20,-75" fill="none" stroke="url(#gold)" stroke-width="2"/>`
  },
  {
    filename: 'trouser-blue.svg',
    title: 'Lapis Linen Tailored Set',
    category: 'Trouser Sets',
    sku: 'TSET-BLU-008',
    bgGradient: '<stop offset="0%" stop-color="#0A192F"/><stop offset="100%" stop-color="#172A45"/>',
    iconPath: `<path d="M-40,-75 L40,-75 L30,-5 L-30,-5 Z" fill="none" stroke="#D4AF37" stroke-width="2"/>
    <path d="M-30,0 L-40,80 L-10,80 L-5,15 L5,15 L10,80 L40,80 L30,0 Z" fill="none" stroke="#D4AF37" stroke-width="2"/>`
  }
];

for (const item of assets) {
  const content = createProductSVG(item);
  fs.writeFileSync(path.join(storefrontDir, item.filename), content, 'utf8');
  fs.writeFileSync(path.join(adminDir, item.filename), content, 'utf8');
}

console.log(`Generated ${assets.length} luxury local SVG product assets into public/images/products/`);
