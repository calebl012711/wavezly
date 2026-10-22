/**
 * FORMGRID ASSET GENERATION ENGINE
 * Synthesizes 50 high-resolution industrial product images:
 * 5 perspectives per product (Hero Perspective, Top CAD, Macro Detail, Caliper Schematic, Lifestyle In-Situ)
 * Aesthetic: Dieter Rams / Teenage Engineering matte black, signal orange, technical telemetry
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, '../public/assets/products');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

interface ProductImageSpec {
  slug: string;
  name: string;
  type: 'custom_3d' | 'dropship';
  primaryColor: string;
  accentColor: string;
  materialTag: string;
  dimensionsTag: string;
  category: string;
}

const products: ProductImageSpec[] = [
  {
    slug: 'valet-pro',
    name: 'MODULAR DESK VALET PRO',
    type: 'custom_3d',
    primaryColor: '#18181b',
    accentColor: '#ff5500',
    materialTag: 'MATTE OBSIDIAN PLA + OPTICAL RESIN',
    dimensionsTag: '160 × 120 × 40 MM',
    category: 'PARAMETRIC FABRICATION',
  },
  {
    slug: 'drawer-matrix',
    name: 'PARAMETRIC DRAWER MATRIX',
    type: 'custom_3d',
    primaryColor: '#27272a',
    accentColor: '#ff5500',
    materialTag: 'HIGH-SHEAR IMPACT PLA',
    dimensionsTag: '210 × 150 × 45 MM',
    category: 'MODULAR STORAGE MATRIX',
  },
  {
    slug: 'cable-anchor',
    name: 'PRECISION CABLE ANCHOR BLOCK',
    type: 'custom_3d',
    primaryColor: '#141416',
    accentColor: '#ff5500',
    materialTag: 'DENSE GYROID BALLAST CORE',
    dimensionsTag: '100 × 65 × 28 MM',
    category: 'CABLE ARCHITECTURE',
  },
  {
    slug: 'hex-bit-tray',
    name: 'HEX KEY & TOOL MATRIX TRAY',
    type: 'custom_3d',
    primaryColor: '#1c1917',
    accentColor: '#f59e0b',
    materialTag: 'CARBON FIBER ENFORCED PLA',
    dimensionsTag: '140 × 90 × 24 MM',
    category: 'PRECISION TOOLING',
  },
  {
    slug: 'headphone-plinth',
    name: 'AUDIOPHILE DAC & IEM PLINTH',
    type: 'custom_3d',
    primaryColor: '#09090b',
    accentColor: '#00e5ff',
    materialTag: 'RESONANCE DAMPENED POLYMER',
    dimensionsTag: '220 × 140 × 35 MM',
    category: 'ACOUSTIC HARDWARE',
  },
  {
    slug: 'screenbar',
    name: 'ASYMMETRIC DESK SCREENBAR',
    type: 'dropship',
    primaryColor: '#18181b',
    accentColor: '#00e5ff',
    materialTag: 'CNC 6063 ANODIZED ALUMINUM',
    dimensionsTag: '450 × 92 × 32 MM',
    category: 'OPTICAL LUMINAIRE',
  },
  {
    slug: 'felt-mat',
    name: 'DUAL-SIDED ECO-FELT DESK MAT',
    type: 'dropship',
    primaryColor: '#3f3f46',
    accentColor: '#a3e635',
    materialTag: 'RECYCLED MERINO + VEGAN SADDLE',
    dimensionsTag: '900 × 400 × 4 MM',
    category: 'DESK SURFACE FOUNDATION',
  },
  {
    slug: 'magnetic-dock',
    name: 'MAGNETIC SILICONE CABLE DOCK',
    type: 'dropship',
    primaryColor: '#18181b',
    accentColor: '#ff5500',
    materialTag: 'N52 NEODYMIUM + LIQUID SILICONE',
    dimensionsTag: '85 × 20 × 12 MM (4-PK)',
    category: 'MAGNETIC MANAGEMENT',
  },
  {
    slug: 'laptop-riser',
    name: 'ANODIZED ALUMINUM LAPTOP RISER',
    type: 'dropship',
    primaryColor: '#27272a',
    accentColor: '#00e5ff',
    materialTag: 'AEROSPACE 6061-T6 ALLOY',
    dimensionsTag: '260 × 225 × 65 MM',
    category: 'ERGONOMIC ELEVATION',
  },
  {
    slug: 'titanium-pen-stand',
    name: 'CNC TITANIUM EDC STAND & PULLER',
    type: 'dropship',
    primaryColor: '#18181b',
    accentColor: '#f59e0b',
    materialTag: 'GRADE 5 BILLET TITANIUM',
    dimensionsTag: '60 × 60 × 30 MM',
    category: 'MECHANICAL HARDWARE',
  },
];

function generateSVG(
  p: ProductImageSpec,
  variant: 'hero' | 'top' | 'detail' | 'schematic' | 'lifestyle'
): string {
  const is3D = p.type === 'custom_3d';
  const variantTitle = {
    hero: '01 // PERSPECTIVE HERO VIEW',
    top: '02 // ORTHOGONAL PLAN CAD',
    detail: '03 // MACRO TEXTURE & CHAMFER',
    schematic: '04 // CALIPER TOLERANCE BLUEPRINT',
    lifestyle: '05 // IN-SITU WORKSPACE CONTEXT',
  }[variant];

  // Common high-tech grid background and Dieter Rams markings
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900" style="background:#09090b; font-family:'JetBrains Mono', monospace;">
  <defs>
    <!-- Background Grid Pattern -->
    <pattern id="grid-${p.slug}-${variant}" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#18181b" stroke-width="1"/>
      <circle cx="0" cy="0" r="1.5" fill="#27272a"/>
    </pattern>
    <!-- Radial Spotlight -->
    <radialGradient id="spot-${p.slug}-${variant}" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="#1f1f23" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#09090b" stop-opacity="1"/>
    </radialGradient>
    <!-- Linear Product Gradient -->
    <linearGradient id="bodyGrad-${p.slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2c2c31"/>
      <stop offset="50%" stop-color="#18181b"/>
      <stop offset="100%" stop-color="#101012"/>
    </linearGradient>
    <filter id="shadow-${p.slug}" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="25" stdDeviation="25" flood-color="#000000" flood-opacity="0.75"/>
    </filter>
  </defs>

  <!-- Background Layer -->
  <rect width="1200" height="900" fill="url(#spot-${p.slug}-${variant})"/>
  <rect width="1200" height="900" fill="url(#grid-${p.slug}-${variant})"/>

  <!-- Technical Frame & Crop Marks -->
  <g stroke="#3f3f46" stroke-width="1" opacity="0.6">
    <path d="M 40 60 L 40 40 L 60 40"/>
    <path d="M 1160 60 L 1160 40 L 1140 40"/>
    <path d="M 40 840 L 40 860 L 60 860"/>
    <path d="M 1160 840 L 1160 860 L 1140 860"/>
    <line x1="600" y1="40" x2="600" y2="55" stroke-dasharray="3,3"/>
    <line x1="600" y1="845" x2="600" y2="860" stroke-dasharray="3,3"/>
    <line x1="40" y1="450" x2="55" y2="450" stroke-dasharray="3,3"/>
    <line x1="1145" y1="450" x2="1160" y2="450" stroke-dasharray="3,3"/>
  </g>

  <!-- Header Telemetry Readouts -->
  <text x="60" y="70" fill="${p.accentColor}" font-size="12" font-weight="700" letter-spacing="2">FORMGRID ARCHITECTURE // ${p.category}</text>
  <text x="1140" y="70" text-anchor="end" fill="#71717a" font-size="11">SYSTEM ID: FG-${p.slug.toUpperCase()}</text>
  <line x1="60" y1="85" x2="1140" y2="85" stroke="#27272a" stroke-width="1"/>

  <!-- Product Name Banner -->
  <text x="60" y="125" fill="#f4f4f5" font-size="24" font-weight="800" font-family="'Space Grotesk', sans-serif" letter-spacing="-0.5">${p.name}</text>
  <text x="60" y="148" fill="#a1a1aa" font-size="12" letter-spacing="1">${variantTitle}</text>

  <!-- ================= VARIANT GRAPHICS ================= -->
  ${renderVariantIllustration(p, variant)}

  <!-- Footer Specs & Telemetry -->
  <line x1="60" y1="810" x2="1140" y2="810" stroke="#27272a" stroke-width="1"/>
  <g fill="#71717a" font-size="11">
    <text x="60" y="835">MATERIAL: <tspan fill="#f4f4f5">${p.materialTag}</tspan></text>
    <text x="500" y="835">DIMENSIONS: <tspan fill="#f4f4f5">${p.dimensionsTag}</tspan></text>
    <text x="1140" y="835" text-anchor="end">FULFILLMENT: <tspan fill="${p.accentColor}">${is3D ? 'AUTOMATED 3D PRINT FARM (2–4D)' : 'US DOMESTIC PRIORITY (2–4D)'}</tspan></text>
  </g>
</svg>`;
}

function renderVariantIllustration(p: ProductImageSpec, variant: string): string {
  switch (variant) {
    case 'hero':
      return `
      <!-- 3D Perspective Hero Render with Chamfers and Inlay -->
      <g transform="translate(600, 470) scale(1.15)" filter="url(#shadow-${p.slug})">
        <!-- Main Chassis Body Isometric Base -->
        <polygon points="-280,-40 0,-180 280,-40 0,100" fill="url(#bodyGrad-${p.slug})" stroke="#3f3f46" stroke-width="2"/>
        
        <!-- Extruded Depth Side Faces -->
        <polygon points="-280,-40 0,100 0,160 -280,20" fill="#141417" stroke="#27272a" stroke-width="1.5"/>
        <polygon points="0,100 280,-40 280,20 0,160" fill="#1e1e22" stroke="#27272a" stroke-width="1.5"/>

        <!-- Top Compartment Cavities (Chamfered Dividers) -->
        <!-- Cavity 1 -->
        <polygon points="-220,-45 -40,-135 -40,-35 -220,55" fill="#0d0d0f" stroke="#3f3f46" stroke-width="1.5"/>
        <!-- Optional Resin Pool Layer -->
        <polygon points="-210,-40 -50,-120 -50,-40 -210,40" fill="${p.accentColor}" opacity="0.35"/>
        
        <!-- Cavity 2 -->
        <polygon points="40,-135 220,-45 220,55 40,-35" fill="#0d0d0f" stroke="#3f3f46" stroke-width="1.5"/>
        <polygon points="50,-120 210,-40 210,40 50,-40" fill="${p.accentColor}" opacity="0.2"/>

        <!-- Front Long Cavity -->
        <polygon points="-180,60 180,60 0,135" fill="#0c0c0e" stroke="#3f3f46" stroke-width="1.5"/>

        <!-- High-Tech Axis Coordinates Indicator -->
        <circle cx="0" cy="100" r="4" fill="${p.accentColor}"/>
        <line x1="0" y1="100" x2="60" y2="125" stroke="${p.accentColor}" stroke-width="1.5"/>
        <text x="70" y="130" fill="${p.accentColor}" font-size="10">X:0 Y:0 Z:0</text>
      </g>
      `;

    case 'top':
      return `
      <!-- Orthogonal CAD Top-Down Blueprint View -->
      <g transform="translate(600, 460)" filter="url(#shadow-${p.slug})">
        <!-- Exterior Bounding Box with Fillet Radii -->
        <rect x="-300" y="-190" width="600" height="380" rx="20" ry="20" fill="#121215" stroke="#3f3f46" stroke-width="2.5"/>
        
        <!-- Internal Grid Compartments -->
        <rect x="-270" y="-160" width="250" height="180" rx="10" ry="10" fill="#09090b" stroke="${p.accentColor}" stroke-width="1.5" stroke-dasharray="2,2"/>
        <text x="-145" y="-60" text-anchor="middle" fill="#71717a" font-size="12">CHAMBER A1</text>
        
        <rect x="20" y="-160" width="250" height="180" rx="10" ry="10" fill="#09090b" stroke="${p.accentColor}" stroke-width="1.5" stroke-dasharray="2,2"/>
        <text x="145" y="-60" text-anchor="middle" fill="#71717a" font-size="12">CHAMBER A2</text>
        
        <rect x="-270" y="50" width="540" height="110" rx="10" ry="10" fill="#09090b" stroke="#3f3f46" stroke-width="1.5"/>
        <text x="0" y="110" text-anchor="middle" fill="#71717a" font-size="12">CHAMBER B1 // FULL SPAN EDC</text>

        <!-- Dimension Callout Arrows -->
        <line x1="-300" y1="-215" x2="300" y2="-215" stroke="#71717a" stroke-width="1.5"/>
        <line x1="-300" y1="-225" x2="-300" y2="-205" stroke="#71717a" stroke-width="1.5"/>
        <line x1="300" y1="-225" x2="300" y2="-205" stroke="#71717a" stroke-width="1.5"/>
        <text x="0" y="-225" text-anchor="middle" fill="#f4f4f5" font-size="12">${p.dimensionsTag.split('×')[0]} mm (EXTERIOR LENGTH)</text>

        <line x1="325" y1="-190" x2="325" y2="190" stroke="#71717a" stroke-width="1.5"/>
        <line x1="315" y1="-190" x2="335" y2="-190" stroke="#71717a" stroke-width="1.5"/>
        <line x1="315" y1="190" x2="335" y2="190" stroke="#71717a" stroke-width="1.5"/>
        <text x="345" y="5" fill="#f4f4f5" font-size="12">${p.dimensionsTag.split('×')[1] || '120 MM'}</text>
      </g>
      `;

    case 'detail':
      return `
      <!-- Macro Texture, Layer Bonding & Infill Close-up -->
      <g transform="translate(600, 460)">
        <!-- Magnifying Circular Reticle -->
        <circle cx="0" cy="0" r="240" fill="#121216" stroke="#3f3f46" stroke-width="3"/>
        <circle cx="0" cy="0" r="230" fill="none" stroke="${p.accentColor}" stroke-width="1" stroke-dasharray="4,4" opacity="0.6"/>

        <!-- Micro Layer Strata (0.20mm Layer Lines) -->
        ${Array.from({ length: 18 })
          .map(
            (_, i) =>
              `<line x1="-220" y1="${-170 + i * 20}" x2="220" y2="${-170 + i * 20}" stroke="#27272a" stroke-width="2"/>`
          )
          .join('\n')}

        <!-- Chamfer Cut Edge Accent -->
        <path d="M -160 -180 L 160 140" stroke="${p.accentColor}" stroke-width="3"/>
        <circle cx="0" cy="-20" r="6" fill="${p.accentColor}"/>
        
        <!-- Callout Banner -->
        <rect x="-180" y="70" width="360" height="60" rx="6" fill="#09090b" stroke="#3f3f46" stroke-width="1.5"/>
        <text x="0" y="95" text-anchor="middle" fill="#f4f4f5" font-size="12" font-weight="700">0.20MM LAYER STEPPING</text>
        <text x="0" y="115" text-anchor="middle" fill="#71717a" font-size="10">SUB-MILLIMETER BOND STRENGTH</text>

        <!-- Reticle Crosshairs -->
        <line x1="-260" y1="0" x2="-230" y2="0" stroke="#71717a" stroke-width="1.5"/>
        <line x1="230" y1="0" x2="260" y2="0" stroke="#71717a" stroke-width="1.5"/>
        <line x1="0" y1="-260" x2="0" y2="-230" stroke="#71717a" stroke-width="1.5"/>
        <line x1="0" y1="230" x2="0" y2="260" stroke="#71717a" stroke-width="1.5"/>
      </g>
      `;

    case 'schematic':
      return `
      <!-- Technical Tolerances & Caliper Blueprint -->
      <g transform="translate(600, 460)">
        <!-- Engineering Blueprint Lines -->
        <rect x="-320" y="-180" width="640" height="360" fill="none" stroke="#27272a" stroke-width="1"/>
        <circle cx="0" cy="0" r="140" fill="none" stroke="#27272a" stroke-width="1" stroke-dasharray="5,5"/>

        <!-- Digital Caliper Tool Jaws Rendering -->
        <path d="M -300 -140 L -250 -140 L -250 -30 L -290 -30 Z" fill="#3f3f46"/>
        <path d="M 300 -140 L 250 -140 L 250 -30 L 290 -30 Z" fill="#3f3f46"/>
        <line x1="-250" y1="-85" x2="250" y2="-85" stroke="${p.accentColor}" stroke-width="2"/>

        <!-- Digital Caliper HUD Readout -->
        <rect x="-120" y="-120" width="240" height="70" rx="8" fill="#000000" stroke="${p.accentColor}" stroke-width="2"/>
        <text x="0" y="-90" text-anchor="middle" fill="#71717a" font-size="10">DIGITAL GAUGE</text>
        <text x="0" y="-65" text-anchor="middle" fill="${p.accentColor}" font-size="22" font-weight="700">± 0.25 MM</text>

        <!-- Tolerances Table Card -->
        <g transform="translate(-280, 50)" font-size="11" fill="#a1a1aa">
          <text x="0" y="20">• MIN WALL THICKNESS: 2.40 MM</text>
          <text x="0" y="45">• MIN FLOOR BASE: 2.00 MM</text>
          <text x="0" y="70">• TENSILE SHEAR STRENGTH: 48 MPA</text>
          <text x="320" y="20">• INFILL CORE: 18% GYROID</text>
          <text x="320" y="45">• ISO 2768-m PASS GUARANTEE</text>
          <text x="320" y="70">• ZERO BED WARPAGE SPEC</text>
        </g>
      </g>
      `;

    case 'lifestyle':
      return `
      <!-- In-Situ Modern Industrial Desk Setup Context -->
      <g transform="translate(600, 480)">
        <!-- Minimal Desk Mat Surface -->
        <rect x="-420" y="-190" width="840" height="380" rx="16" fill="#18181b" stroke="#27272a" stroke-width="2"/>

        <!-- Product Sitting on Desk Mat -->
        <g transform="translate(-120, -10)" filter="url(#shadow-${p.slug})">
          <rect x="-160" y="-110" width="320" height="220" rx="12" fill="#222226" stroke="#3f3f46" stroke-width="2"/>
          <rect x="-140" y="-90" width="130" height="90" rx="6" fill="#09090b" stroke="${p.accentColor}" stroke-width="1"/>
          <rect x="10" y="-90" width="130" height="90" rx="6" fill="#09090b" stroke="#3f3f46" stroke-width="1"/>
          <rect x="-140" y="20" width="280" height="70" rx="6" fill="#09090b" stroke="#3f3f46" stroke-width="1"/>
        </g>

        <!-- Mechanical Keyboard Accompaniment -->
        <g transform="translate(220, -10)" opacity="0.45">
          <rect x="-140" y="-120" width="280" height="240" rx="10" fill="#121214" stroke="#27272a" stroke-width="1.5"/>
          ${Array.from({ length: 4 })
            .map((_, r) =>
              Array.from({ length: 7 })
                .map(
                  (__, c) =>
                    `<rect x="${-120 + c * 35}" y="${-100 + r * 35}" width="28" height="28" rx="4" fill="#1f1f23"/>`
                )
                .join('')
            )
            .join('')}
        </g>

        <!-- Minimalist Machined Brass Pen in Tray -->
        <line x1="-240" y1="45" x2="-20" y2="45" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"/>

        <!-- Context Stamp -->
        <text x="380" y="160" text-anchor="end" fill="#52525b" font-size="10">DESKTOP CURATION // FORMGRID V3</text>
      </g>
      `;

    default:
      return '';
  }
}

console.log('Generating 50 industrial product image assets...');
const variants: Array<'hero' | 'top' | 'detail' | 'schematic' | 'lifestyle'> = [
  'hero',
  'top',
  'detail',
  'schematic',
  'lifestyle',
];

let generatedCount = 0;
for (const p of products) {
  for (const v of variants) {
    const filename = `${p.slug}-${v}.svg`;
    const filepath = path.join(outputDir, filename);
    const svgContent = generateSVG(p, v);
    fs.writeFileSync(filepath, svgContent, 'utf-8');
    generatedCount++;
  }
}

console.log(`[✓] Successfully synthesized ${generatedCount} product images in ${outputDir}!`);
