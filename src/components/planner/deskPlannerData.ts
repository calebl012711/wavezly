/**
 * FORMGRID SPATIAL DESK PLANNER - DATA REGISTRY & CAD CALCULATIONS
 * Precision dimensions, modular hardware catalog, curated layout presets,
 * and real-time spatial telemetry algorithms.
 */

import { Product, CustomParametricSpecs } from '../../types';
import { SEED_PRODUCTS, SEED_MATERIALS } from '../../db/seed';

export interface DeskItemDef {
  id: string;
  name: string;
  code: string;
  category: 'foundation' | 'hardware' | 'organizer' | 'peripheral';
  productId: string;
  defaultWidthMm: number;
  defaultDepthMm: number;
  heightMm: number;
  isMat?: boolean; // Underlay layer - items on top do not collide with mat
  color: string;
  borderColor: string;
  accentColor: string;
  description: string;
  price: number;
  type: 'custom_3d' | 'dropship';
  renderShape: 'mat' | 'riser' | 'screenbar' | 'valet' | 'matrix' | 'anchor' | 'keyboard' | 'mouse';
}

export interface PlacedDeskItem {
  instanceId: string;
  defId: string;
  xMm: number;
  yMm: number;
  widthMm: number;
  depthMm: number;
  rotation: 0 | 90 | 180 | 270;
  isLocked?: boolean;
}

export interface DeskSizePreset {
  id: string;
  name: string;
  subtitle: string;
  widthMm: number;
  depthMm: number;
}

export interface DeskSurfaceFinish {
  id: string;
  name: string;
  bgColor: string;
  gridColor: string;
  borderColor: string;
  textureLabel: string;
}

export interface CollisionResult {
  hasCollision: boolean;
  collidingInstanceIds: Set<string>;
  overhangingInstanceIds: Set<string>;
  messages: string[];
}

export interface SpatialTelemetry {
  deskAreaM2: number;
  occupiedAreaM2: number;
  matAreaM2: number;
  surfaceUtilizationPercent: number;
  deadSpaceReductionPercent: number;
  clearFocusZoneM2: number;
  collisionCount: number;
  overhangCount: number;
  totalHardwareValue: number;
  bundleDiscountPercent: number;
  bundlePrice: number;
  savings: number;
  packageACount: number;
  packageBCount: number;
}

// -------------------------------------------------------------
// COMPANION PRODUCTS FOR KEYBOARD & MOUSE (CONFORMING TO Product)
// -------------------------------------------------------------
export const COMPANION_KEYBOARD: Product = {
  id: 'prod_studio_keyboard',
  slug: 'formgrid-studio-mechanical-keyboard',
  title: 'FORMGRID Studio Mechanical Keyboard (65% CNC)',
  subtitle: 'Gasket-Mounted Hot-Swap Aluminum Mechanical Deck',
  description: 'Precision milled 6063 aluminum chassis featuring custom factory-lubed linear switches, sound-dampening poron foam matrix, and Dieter Rams signal orange key accents.',
  type: 'dropship',
  basePrice: 89.00,
  images: [
    '/assets/products/keyboard-hero.svg',
    '/assets/products/felt-mat-lifestyle.svg',
  ],
  features: [
    'CNC 6063 anodized aluminum frame with magnetic top accent bar',
    'Custom PBT dye-sub keycaps with Braun-inspired typographic legend',
    'Tri-mode connectivity: 2.4GHz low-latency wireless, Bluetooth 5.2, USB-C',
    'Hot-swappable 5-pin switch sockets with sound-dampening silicone base',
  ],
  technicalSpecs: {
    'Form Factor': '65% Compact (68 Keys)',
    'Dimensions': '320 × 130 × 34 mm',
    'Weight': '1,150 g Solid Billet',
    'Battery': '4,000 mAh Li-Ion (220 Hours)',
  },
  active: true,
  supplierMeta: {
    channel: 'dsers',
    supplierSku: 'FG-65-KEYB-CNC',
    warehouseOrigin: 'US Domestic Warehouse (Salt Lake City, UT)',
    estimatedTransitDays: '2-4 Business Days',
    inventoryCount: 180,
  },
};

export const COMPANION_MOUSE: Product = {
  id: 'prod_precision_mouse',
  slug: 'formgrid-precision-wireless-mouse',
  title: 'FORMGRID Precision Wireless Mouse',
  subtitle: 'Ergonomic Matte Graphite Chassis with Knurled Aluminum Dial',
  description: 'Surgical ergonomics sculpted for high-precision CAD and design workflows. Features dual electromagnetic scroll wheels, optical microswitches, and zero-gloss ceramic glide feet.',
  type: 'dropship',
  basePrice: 45.00,
  images: [
    '/assets/products/mouse-hero.svg',
    '/assets/products/laptop-riser-detail.svg',
  ],
  features: [
    'Solid CNC knurled aluminum hyper-scroll and thumb lateral navigation wheels',
    'PixArt PAW3395 26,000 DPI optical sensor calibrated for laser tracking',
    'Dual-mode wireless: 1,000Hz polling rate wireless dongle & Bluetooth',
    'Soft-touch matte vulcanized coating resisting finger oils and wear',
  ],
  technicalSpecs: {
    'Sensor': 'PixArt PAW3395 (50G acceleration)',
    'Dimensions': '125 × 70 × 42 mm',
    'Weight': '88 g Balanced',
    'Battery': '800 mAh USB-C Fast Charge (90 Hours)',
  },
  active: true,
  supplierMeta: {
    channel: 'dsers',
    supplierSku: 'FG-PREC-MOUSE-GRY',
    warehouseOrigin: 'US Domestic Warehouse (Ontario, CA)',
    estimatedTransitDays: '2-4 Business Days',
    inventoryCount: 240,
  },
};

// -------------------------------------------------------------
// MODULAR DESK ITEMS CATALOG
// -------------------------------------------------------------
export const DESK_ITEMS_CATALOG: DeskItemDef[] = [
  {
    id: 'felt_mat',
    name: 'Dual-Sided Eco-Felt Desk Mat',
    code: 'MAT-9040',
    category: 'foundation',
    productId: 'prod_felt_mat',
    defaultWidthMm: 900,
    defaultDepthMm: 400,
    heightMm: 4,
    isMat: true,
    color: '#1e1e24',
    borderColor: '#3f3f46',
    accentColor: '#ff5500',
    description: '900 × 400mm High-density Merino felt & vegan saddle leather underlay.',
    price: 34.00,
    type: 'dropship',
    renderShape: 'mat',
  },
  {
    id: 'laptop_riser',
    name: 'Anodized Aluminum Laptop Riser',
    code: 'RSR-6061',
    category: 'hardware',
    productId: 'prod_laptop_riser',
    defaultWidthMm: 300,
    defaultDepthMm: 240,
    heightMm: 65,
    color: '#27272a',
    borderColor: '#52525b',
    accentColor: '#0284c7',
    description: '15° Ergonomic wedge with passive thermal flutes and cable routing channel.',
    price: 42.00,
    type: 'dropship',
    renderShape: 'riser',
  },
  {
    id: 'screenbar',
    name: 'Asymmetric Desk ScreenBar',
    code: 'LUM-450',
    category: 'hardware',
    productId: 'prod_screenbar',
    defaultWidthMm: 480,
    defaultDepthMm: 92,
    heightMm: 32,
    color: '#18181b',
    borderColor: '#3f3f46',
    accentColor: '#16a34a',
    description: '45° Optical cutoff glare-free monitor task luminaire (Ra ≥ 95).',
    price: 48.00,
    type: 'dropship',
    renderShape: 'screenbar',
  },
  {
    id: 'valet_pro',
    name: 'Modular Desk Valet Pro',
    code: 'VLT-3D',
    category: 'organizer',
    productId: 'prod_valet_pro',
    defaultWidthMm: 160,
    defaultDepthMm: 120,
    heightMm: 38,
    color: '#121215',
    borderColor: '#ff5500',
    accentColor: '#ff5500',
    description: 'Parametric 3D tray with 2x3 chamber partitions and resin inlay cavity.',
    price: 28.00,
    type: 'custom_3d',
    renderShape: 'valet',
  },
  {
    id: 'drawer_matrix',
    name: 'Parametric Drawer Matrix',
    code: 'MTX-3D',
    category: 'organizer',
    productId: 'prod_drawer_matrix',
    defaultWidthMm: 210,
    defaultDepthMm: 150,
    heightMm: 45,
    color: '#18181b',
    borderColor: '#71717a',
    accentColor: '#d97706',
    description: 'High-density orthogonal grid insert for pens, tools, and cables.',
    price: 32.00,
    type: 'custom_3d',
    renderShape: 'matrix',
  },
  {
    id: 'cable_anchor',
    name: 'Precision Cable Anchor Block',
    code: 'ANC-3D',
    category: 'organizer',
    productId: 'prod_cable_anchor',
    defaultWidthMm: 90,
    defaultDepthMm: 60,
    heightMm: 28,
    color: '#0f0f12',
    borderColor: '#52525b',
    accentColor: '#0284c7',
    description: 'Weighted 3-channel ballast block with micro-suction anti-slip base.',
    price: 19.50,
    type: 'custom_3d',
    renderShape: 'anchor',
  },
  {
    id: 'keyboard',
    name: 'Studio Mechanical Keyboard (65%)',
    code: 'KEY-65',
    category: 'peripheral',
    productId: 'prod_studio_keyboard',
    defaultWidthMm: 320,
    defaultDepthMm: 130,
    heightMm: 34,
    color: '#27272a',
    borderColor: '#3f3f46',
    accentColor: '#ff5500',
    description: '65% CNC Aluminum deck with Braun-inspired typographic legend.',
    price: 89.00,
    type: 'dropship',
    renderShape: 'keyboard',
  },
  {
    id: 'mouse',
    name: 'Precision Wireless Mouse',
    code: 'MOU-88',
    category: 'peripheral',
    productId: 'prod_precision_mouse',
    defaultWidthMm: 70,
    defaultDepthMm: 125,
    heightMm: 42,
    color: '#1c1c1f',
    borderColor: '#52525b',
    accentColor: '#16a34a',
    description: 'Matte ergonomic contour with CNC knurled aluminum lateral dial.',
    price: 45.00,
    type: 'dropship',
    renderShape: 'mouse',
  },
];

// Map from catalog item id to definition
export const DESK_ITEMS_MAP: Record<string, DeskItemDef> = Object.fromEntries(
  DESK_ITEMS_CATALOG.map((item) => [item.id, item])
);

// -------------------------------------------------------------
// DESK SURFACE SIZE PRESETS
// -------------------------------------------------------------
export const DESK_SIZE_PRESETS: DeskSizePreset[] = [
  {
    id: 'size_1400',
    name: '1400 × 700 mm',
    subtitle: 'Compact Urban Studio',
    widthMm: 1400,
    depthMm: 700,
  },
  {
    id: 'size_1600',
    name: '1600 × 800 mm',
    subtitle: 'Architectural Standard (Optimal)',
    widthMm: 1600,
    depthMm: 800,
  },
  {
    id: 'size_1800',
    name: '1800 × 800 mm',
    subtitle: 'Extended Workstation Pro',
    widthMm: 1800,
    depthMm: 800,
  },
];

// -------------------------------------------------------------
// DESK SURFACE FINISHES
// -------------------------------------------------------------
export const DESK_SURFACE_FINISHES: DeskSurfaceFinish[] = [
  {
    id: 'finish_obsidian',
    name: 'Obsidian Matte HPL',
    bgColor: '#0d0d10',
    gridColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: '#27272a',
    textureLabel: 'Anti-Fingerprint High Pressure Laminate',
  },
  {
    id: 'finish_concrete',
    name: 'Studio Concrete Grey',
    bgColor: '#18181c',
    gridColor: 'rgba(255, 255, 255, 0.07)',
    borderColor: '#3f3f46',
    textureLabel: 'Ultra-Matte Mineral Cast Finish',
  },
  {
    id: 'finish_oak',
    name: 'Nordic Smoked Oak',
    bgColor: '#161412',
    gridColor: 'rgba(217, 119, 6, 0.08)',
    borderColor: '#453526',
    textureLabel: 'FSC Solid Hardwood with Matte Oil',
  },
  {
    id: 'finish_walnut',
    name: 'Deep American Walnut',
    bgColor: '#131110',
    gridColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: '#382c22',
    textureLabel: 'Architectural Grade Bookmatched Veneer',
  },
];

// -------------------------------------------------------------
// CURATED LAYOUT TEMPLATES
// -------------------------------------------------------------
export interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  deskWidthMm: number;
  deskDepthMm: number;
  items: PlacedDeskItem[];
}

export const CURATED_LAYOUT_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'tpl_architectural_master',
    name: 'Architectural Master Setup',
    description: 'Complete 8-piece symmetrical workspace: Desk Mat center anchor, ScreenBar illumination, flanked Laptop Riser, and modular 3D organizers.',
    deskWidthMm: 1600,
    deskDepthMm: 800,
    items: [
      // 1. Desk Mat (Center bottom, 900x400)
      {
        instanceId: 'item_mat_1',
        defId: 'felt_mat',
        xMm: 350,
        yMm: 350,
        widthMm: 900,
        depthMm: 400,
        rotation: 0,
      },
      // 2. ScreenBar (Top center, 480x92)
      {
        instanceId: 'item_scr_1',
        defId: 'screenbar',
        xMm: 560,
        yMm: 30,
        widthMm: 480,
        depthMm: 92,
        rotation: 0,
      },
      // 3. Laptop Riser (Left flank, 300x240)
      {
        instanceId: 'item_rsr_1',
        defId: 'laptop_riser',
        xMm: 60,
        yMm: 220,
        widthMm: 300,
        depthMm: 240,
        rotation: 0,
      },
      // 4. Keyboard (On mat center-left, 320x130)
      {
        instanceId: 'item_key_1',
        defId: 'keyboard',
        xMm: 480,
        yMm: 490,
        widthMm: 320,
        depthMm: 130,
        rotation: 0,
      },
      // 5. Mouse (On mat right, 70x125)
      {
        instanceId: 'item_mou_1',
        defId: 'mouse',
        xMm: 880,
        yMm: 495,
        widthMm: 70,
        depthMm: 125,
        rotation: 0,
      },
      // 6. Modular Desk Valet (Right upper flank, 160x120)
      {
        instanceId: 'item_vlt_1',
        defId: 'valet_pro',
        xMm: 1360,
        yMm: 230,
        widthMm: 160,
        depthMm: 120,
        rotation: 0,
      },
      // 7. Drawer Matrix (Right lower flank, 210x150)
      {
        instanceId: 'item_mtx_1',
        defId: 'drawer_matrix',
        xMm: 1330,
        yMm: 450,
        widthMm: 210,
        depthMm: 150,
        rotation: 0,
      },
      // 8. Cable Anchor (Top right rear edge, 90x60)
      {
        instanceId: 'item_anc_1',
        defId: 'cable_anchor',
        xMm: 1150,
        yMm: 40,
        widthMm: 90,
        depthMm: 60,
        rotation: 0,
      },
    ],
  },
  {
    id: 'tpl_minimal_focus',
    name: 'Minimal Focus Cadence',
    description: 'Reduced Dieter Rams essentialist footprint: Felt Mat, Keyboard, Mouse, and Modular Desk Valet for zero cognitive friction.',
    deskWidthMm: 1400,
    deskDepthMm: 700,
    items: [
      {
        instanceId: 'item_mat_2',
        defId: 'felt_mat',
        xMm: 250,
        yMm: 260,
        widthMm: 900,
        depthMm: 400,
        rotation: 0,
      },
      {
        instanceId: 'item_scr_2',
        defId: 'screenbar',
        xMm: 460,
        yMm: 20,
        widthMm: 480,
        depthMm: 92,
        rotation: 0,
      },
      {
        instanceId: 'item_key_2',
        defId: 'keyboard',
        xMm: 380,
        yMm: 400,
        widthMm: 320,
        depthMm: 130,
        rotation: 0,
      },
      {
        instanceId: 'item_mou_2',
        defId: 'mouse',
        xMm: 780,
        yMm: 405,
        widthMm: 70,
        depthMm: 125,
        rotation: 0,
      },
      {
        instanceId: 'item_vlt_2',
        defId: 'valet_pro',
        xMm: 1180,
        yMm: 260,
        widthMm: 160,
        depthMm: 120,
        rotation: 0,
      },
      {
        instanceId: 'item_anc_2',
        defId: 'cable_anchor',
        xMm: 1040,
        yMm: 30,
        widthMm: 90,
        depthMm: 60,
        rotation: 0,
      },
    ],
  },
  {
    id: 'tpl_dual_screen_workstation',
    name: 'Extended Dual-Display Workstation',
    description: '1800mm High-throughput workstation setup with full modular 3D storage matrix, dual hardware staging zones, and cable anchor bus.',
    deskWidthMm: 1800,
    deskDepthMm: 800,
    items: [
      {
        instanceId: 'item_mat_3',
        defId: 'felt_mat',
        xMm: 450,
        yMm: 350,
        widthMm: 900,
        depthMm: 400,
        rotation: 0,
      },
      {
        instanceId: 'item_scr_3',
        defId: 'screenbar',
        xMm: 660,
        yMm: 30,
        widthMm: 480,
        depthMm: 92,
        rotation: 0,
      },
      {
        instanceId: 'item_rsr_3',
        defId: 'laptop_riser',
        xMm: 80,
        yMm: 240,
        widthMm: 300,
        depthMm: 240,
        rotation: 0,
      },
      {
        instanceId: 'item_key_3',
        defId: 'keyboard',
        xMm: 580,
        yMm: 490,
        widthMm: 320,
        depthMm: 130,
        rotation: 0,
      },
      {
        instanceId: 'item_mou_3',
        defId: 'mouse',
        xMm: 980,
        yMm: 495,
        widthMm: 70,
        depthMm: 125,
        rotation: 0,
      },
      {
        instanceId: 'item_vlt_3',
        defId: 'valet_pro',
        xMm: 1520,
        yMm: 180,
        widthMm: 160,
        depthMm: 120,
        rotation: 0,
      },
      {
        instanceId: 'item_mtx_3',
        defId: 'drawer_matrix',
        xMm: 1480,
        yMm: 400,
        widthMm: 210,
        depthMm: 150,
        rotation: 0,
      },
      {
        instanceId: 'item_anc_3',
        defId: 'cable_anchor',
        xMm: 1240,
        yMm: 40,
        widthMm: 90,
        depthMm: 60,
        rotation: 0,
      },
    ],
  },
];

// -------------------------------------------------------------
// COLLISION & BOUNDARY DETECTION ALGORITHM
// -------------------------------------------------------------
export function checkCollisionsAndBounds(
  items: PlacedDeskItem[],
  deskWidthMm: number,
  deskDepthMm: number
): CollisionResult {
  const collidingInstanceIds = new Set<string>();
  const overhangingInstanceIds = new Set<string>();
  const messages: string[] = [];

  // Check Boundary Overhangs
  for (const item of items) {
    const isRotated = item.rotation === 90 || item.rotation === 270;
    const effectiveW = isRotated ? item.depthMm : item.widthMm;
    const effectiveD = isRotated ? item.widthMm : item.depthMm;

    const overhangLeft = item.xMm < 0;
    const overhangTop = item.yMm < 0;
    const overhangRight = item.xMm + effectiveW > deskWidthMm;
    const overhangBottom = item.yMm + effectiveD > deskDepthMm;

    if (overhangLeft || overhangTop || overhangRight || overhangBottom) {
      overhangingInstanceIds.add(item.instanceId);
      const def = DESK_ITEMS_MAP[item.defId];
      const itemName = def ? def.name : item.defId;
      messages.push(`${itemName} exceeds desk perimeter boundaries.`);
    }
  }

  // Check Inter-Item Collisions (excluding Mat-underlay collisions)
  // Desk Mat is an underlay layer; items placed on top of it do NOT collide with it.
  const physicalItems = items.filter((item) => {
    const def = DESK_ITEMS_MAP[item.defId];
    return def && !def.isMat;
  });

  for (let i = 0; i < physicalItems.length; i++) {
    const a = physicalItems[i];
    const defA = DESK_ITEMS_MAP[a.defId];
    const aRot = a.rotation === 90 || a.rotation === 270;
    const aW = aRot ? a.depthMm : a.widthMm;
    const aD = aRot ? a.widthMm : a.depthMm;
    const aRight = a.xMm + aW;
    const aBottom = a.yMm + aD;

    for (let j = i + 1; j < physicalItems.length; j++) {
      const b = physicalItems[j];
      const defB = DESK_ITEMS_MAP[b.defId];
      const bRot = b.rotation === 90 || b.rotation === 270;
      const bW = bRot ? b.depthMm : b.widthMm;
      const bD = bRot ? b.widthMm : b.depthMm;
      const bRight = b.xMm + bW;
      const bBottom = b.yMm + bD;

      // Axis-Aligned Bounding Box (AABB) intersection test with 2mm clearance tolerance
      const tolerance = 2; // mm
      const overlapX = a.xMm < bRight - tolerance && aRight > b.xMm + tolerance;
      const overlapY = a.yMm < bBottom - tolerance && aBottom > b.yMm + tolerance;

      if (overlapX && overlapY) {
        collidingInstanceIds.add(a.instanceId);
        collidingInstanceIds.add(b.instanceId);
        messages.push(
          `Collision: ${defA?.name || a.defId} overlaps with ${defB?.name || b.defId}.`
        );
      }
    }
  }

  return {
    hasCollision: collidingInstanceIds.size > 0 || overhangingInstanceIds.size > 0,
    collidingInstanceIds,
    overhangingInstanceIds,
    messages,
  };
}

// -------------------------------------------------------------
// TELEMETRY & SPATIAL EFFICIENCY CALCULATOR
// -------------------------------------------------------------
export function calculateSpatialTelemetry(
  items: PlacedDeskItem[],
  deskWidthMm: number,
  deskDepthMm: number,
  collisionResult: CollisionResult
): SpatialTelemetry {
  const deskAreaMm2 = deskWidthMm * deskDepthMm;
  const deskAreaM2 = Number((deskAreaMm2 / 1_000_000).toFixed(3));

  let occupiedAreaMm2 = 0;
  let matAreaMm2 = 0;
  let totalHardwareValue = 0;
  let packageACount = 0;
  let packageBCount = 0;

  for (const item of items) {
    const def = DESK_ITEMS_MAP[item.defId];
    if (!def) continue;

    const itemArea = item.widthMm * item.depthMm;
    totalHardwareValue += def.price;

    if (def.isMat) {
      matAreaMm2 += itemArea;
    } else {
      occupiedAreaMm2 += itemArea;
    }

    if (def.type === 'custom_3d') {
      packageACount++;
    } else {
      packageBCount++;
    }
  }

  const occupiedAreaM2 = Number((occupiedAreaMm2 / 1_000_000).toFixed(3));
  const matAreaM2 = Number((matAreaMm2 / 1_000_000).toFixed(3));

  // Surface utilization percentage (occupied physical hardware relative to desk area)
  const surfaceUtilizationPercent = Math.min(
    100,
    Math.round((occupiedAreaMm2 / deskAreaMm2) * 100)
  );

  // Dead Space Reduction Telemetry
  // Baseline unorganized clutter leaves ~58% fragmented unusable dead space.
  // When organized into rectilinear zones + underlay mat + 3D matrix,
  // dead space is recaptured significantly.
  const organizedBonus = Math.min(
    48,
    Math.round(
      (items.length * 4.5) +
      (matAreaMm2 > 0 ? 12 : 0) +
      (collisionResult.hasCollision ? -10 : 8)
    )
  );
  const deadSpaceReductionPercent = Math.max(10, Math.min(85, organizedBonus));

  // Usable clear focus zone (ergonomic sweep area)
  const clearFocusZoneM2 = Math.max(
    0.1,
    Number((deskAreaM2 - occupiedAreaM2).toFixed(3))
  );

  // Bundled pricing (15% savings on 3+ items, 10% on 2 items)
  let bundleDiscountPercent = 0;
  if (items.length >= 4) {
    bundleDiscountPercent = 15;
  } else if (items.length >= 2) {
    bundleDiscountPercent = 10;
  }

  const savings = Number(((totalHardwareValue * bundleDiscountPercent) / 100).toFixed(2));
  const bundlePrice = Number((totalHardwareValue - savings).toFixed(2));

  return {
    deskAreaM2,
    occupiedAreaM2,
    matAreaM2,
    surfaceUtilizationPercent,
    deadSpaceReductionPercent,
    clearFocusZoneM2,
    collisionCount: collisionResult.collidingInstanceIds.size,
    overhangCount: collisionResult.overhangingInstanceIds.size,
    totalHardwareValue: Number(totalHardwareValue.toFixed(2)),
    bundleDiscountPercent,
    bundlePrice,
    savings,
    packageACount,
    packageBCount,
  };
}

// -------------------------------------------------------------
// HELPER TO LOOK UP OR BUILD PRODUCT OBJECT FOR CART
// -------------------------------------------------------------
export function resolveCartProduct(def: DeskItemDef): Product {
  if (def.productId === 'prod_studio_keyboard') {
    return COMPANION_KEYBOARD;
  }
  if (def.productId === 'prod_precision_mouse') {
    return COMPANION_MOUSE;
  }

  const found = SEED_PRODUCTS.find((p) => p.id === def.productId);
  if (found) return found;

  // Fallback safe product
  return {
    id: def.productId,
    slug: def.code.toLowerCase(),
    title: def.name,
    description: def.description,
    type: def.type,
    basePrice: def.price,
    images: ['/assets/products/valet-pro-hero.svg'],
    features: [def.description],
    technicalSpecs: { Dimensions: `${def.defaultWidthMm} × ${def.defaultDepthMm} mm` },
    active: true,
  };
}

// -------------------------------------------------------------
// BUILD CUSTOM PARAMETRIC SPECS FOR 3D PRINT FARM ITEMS
// -------------------------------------------------------------
export function createDefaultSpecsFor3DItem(
  product: Product,
  placedWidthMm: number,
  placedDepthMm: number
): CustomParametricSpecs {
  const defaultMat = SEED_MATERIALS[0] || {
    id: 'mat_pla_obsidian',
    name: 'Obsidian Black PLA',
    category: 'filament',
    hexColor: '#18181b',
    roughness: 0.88,
    transmission: 0.0,
    ior: 1.54,
    costPerCm3: 0.035,
    densityGramsPerCm3: 1.24,
    inStock: true,
  };

  const dimensions = product.defaultDimensions || {
    length: placedWidthMm,
    width: placedDepthMm,
    height: 38,
    wallThickness: 2.8,
    bottomThickness: 2.4,
    rows: 2,
    cols: 3,
    cornerFilletRadius: 8,
  };

  const volumePlastic = Math.round((dimensions.length * dimensions.width * 8) / 1000);
  const grams = Math.round(volumePlastic * defaultMat.densityGramsPerCm3);

  return {
    dimensions: {
      ...dimensions,
      length: placedWidthMm,
      width: placedDepthMm,
    },
    material: defaultMat,
    resinInlay: null,
    volumePlasticCm3: volumePlastic,
    volumeResinCm3: 0,
    estimatedGrams: grams,
    estimatedPrintHours: 3.2,
    totalManufacturingCost: Number((volumePlastic * defaultMat.costPerCm3 * 1.5 + 4.5).toFixed(2)),
  };
}
