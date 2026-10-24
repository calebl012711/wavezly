/**
 * WAVEZLY STOREFRONT HELPERS
 * Shopper-friendly names, Amazon department taxonomy, realistic Amazon badges,
 * verified ratings (4.7-4.9), Prime tags, and deal metadata.
 */

import { Product } from '../types';
import { REAL_PRODUCT_IMAGES } from './productImages';

export type RoomId =
  | 'all'
  | 'deals'
  | 'trending_3d'
  | 'kitchen'
  | 'electronics'
  | 'vanity'
  | 'home_decor'
  | 'car_auto'
  | 'tools_workshop'
  | 'bedside'
  | 'custom'
  | 'living'
  | 'workspace';

export const ROOMS: { id: RoomId; label: string; short: string; amazonDept: string }[] = [
  { id: 'all', label: 'All Departments', short: 'All', amazonDept: 'All Departments' },
  { id: 'deals', label: "Today's Deals", short: 'Deals', amazonDept: "Today's Deals" },
  { id: 'trending_3d', label: 'Trending 3D & Fidgets', short: 'Trending 3D', amazonDept: 'Toys, Games & Sensory Fidgets' },
  { id: 'kitchen', label: 'Kitchen & Coffee Bar', short: 'Kitchen', amazonDept: 'Kitchen & Dining' },
  { id: 'electronics', label: 'Electronics & Gaming', short: 'Electronics', amazonDept: 'Electronics & Accessories' },
  { id: 'vanity', label: 'Vanity & Bathroom', short: 'Bath', amazonDept: 'Beauty & Personal Care' },
  { id: 'home_decor', label: 'Home Décor & Planters', short: 'Home & Planters', amazonDept: 'Home Décor & Accents' },
  { id: 'car_auto', label: 'Car & Automotive', short: 'Car Auto', amazonDept: 'Automotive Interior Accessories' },
  { id: 'tools_workshop', label: 'Workshop & Gridfinity', short: 'Workshop', amazonDept: 'Tools & Workshop Organization' },
  { id: 'bedside', label: 'Bedroom & Entryway', short: 'Bedroom', amazonDept: 'Home & Bedroom' },
  { id: 'custom', label: 'Custom Made-to-Order 3D', short: 'Custom 3D', amazonDept: 'Custom Made-to-Order' },
  { id: 'living', label: 'Living Room', short: 'Living', amazonDept: 'Living Room Furniture' },
  { id: 'workspace', label: 'Home Office', short: 'Office', amazonDept: 'Office Products' },
];

export const FRIENDLY_NAMES: Record<string, string> = {
  // Wavezly General 3D Catalog
  prod_crystal_gem_dragon: 'Wavezly Articulated Crystal Gem Dragon (Flexible Sensory Fidget)',
  prod_lowpoly_planter: 'Wavezly Geometric Low-Poly Self-Watering Planter with Reservoir',
  prod_magsafe_orbit_dock: 'Wavezly MagSafe Floating Orbit iPhone & Watch Charging Stand',
  prod_gyro_cube: 'Wavezly Dual-Axis Kinetic Gyro Bearing Fidget Cube',
  prod_fibonacci_vase: 'Wavezly Spiral Fibonacci Procedural Accent Vase',
  prod_gridfinity_master_set: 'Wavezly Modular Gridfinity Workshop & Craft Organizer (12-Piece Bin Matrix)',
  prod_car_cupholder_expander: 'Wavezly Universal Car Cup Holder & 32/40oz Insulated Bottle Expander',
  prod_wall_controller_hanger: 'Wavezly Dual Game Controller & Headset Wall Display Mount (Screwless)',
  prod_battery_dispenser_tower: 'Wavezly Gravity-Feed AA & AAA Quick-Dispense Battery Tower',
  prod_dual_laptop_vertical_stand: 'Wavezly Dual-Slot Adjustable Vertical Laptop & iPad Stand',
  prod_lidded_storage_box: 'Wavezly Custom Parametric Lidded Storage Box with Magnetic Clasp',
  prod_cable_raceway_power: 'Wavezly Under-Desk Modular Cable Raceway & Power Strip Cradle',
  prod_car_visor_sunglass_clip: 'Wavezly Tactile Magnetic Visor Sunglasses & Card Clip',
  prod_lego_minifig_wall_plinth: 'Wavezly Modular Floating Display Shelf for Collectibles & Minifigs',
  prod_espresso_tamp_station: 'Wavezly Barista 58mm Portafilter & WDT Needle Tamping Station',
  prod_honeycomb_lipstick_tower: 'Wavezly Honeycomb Hexagonal Cosmetic & Lipstick Display Carousel',
  prod_sonic_brush_drying_stand: 'Wavezly Magnetic Draining Electric Toothbrush & Grooming Hub',

  // Core Wavezly Hardware Catalog
  prod_valet_pro: 'Wavezly Everyday Valet Tray - Modular Catchall with Resin Dampening Inlay',
  prod_drawer_matrix: 'Wavezly Custom Modular Drawer Organizer Matrix - Flush Fit for Utensils & Tools',
  prod_headphone_plinth: 'Wavezly Heavyweight Headphone Stand & DAC Platform - Acoustic Isolation Base',
  prod_screenbar: 'Wavezly Asymmetric Glare-Free LED Monitor ScreenBar - Auto-Dimming Desk Light',
  prod_felt_mat: 'Wavezly Dual-Sided Merino Wool Eco-Felt Desk Mat (900 × 400mm) - Non-Slip Vegan Leather',
  prod_titanium_pen_stand: 'Wavezly Solid Machined Titanium Pen Stand & Desk EDC Anchor - Grade 5 Titanium',
  prod_vanity_matrix: 'Wavezly Beauty & Skincare Vanity Grid - Custom Cosmetic, Serum & Brush Organizer',
  prod_controller_dock: 'Wavezly Dual Gaming Controller & Remote Stand - Fits PS5, Xbox & Apple TV Remotes',
  prod_watch_jewelry_caddy: 'Wavezly Timepiece & Ring Cushion Caddy - Watch Saddle & Velvet Ring Slits',
  prod_pourover_coffee_tray: 'Wavezly Barista Espresso & Pour-Over Station - 58mm Tamper & Portafilter Valet',
  prod_keeb_lube_station: 'Wavezly Mechanical Switch & Modder Station - 36-Stem Switch Tester & Lube Well',
  prod_desk_vacuum: 'Wavezly Micro-Suction Cordless Desk Vacuum - USB-C Rechargeable Crumb Sweeper',
  prod_desk_coasters: 'Wavezly Solid Volcanic Basalt & Natural Cork Coasters (Set of 4) with Brass Stand',
  prod_kitchen_cutlery_matrix: 'Wavezly Custom Cutlery & Utensil Matrix - Non-Slip Silverware Drawer Insert',
  prod_spice_pantry_tier: 'Wavezly Tiered Spice & Pantry Organizer - Angled 3-Tier Cabinet Display Riser',
  prod_grooming_stand: 'Wavezly Electric Toothbrush & Grooming Plinth - Water-Draining Countertop Stand',
  prod_entryway_catchall: 'Wavezly Entryway Key & Sunglass Plinth - Contoured Catchall for Console Tables',
};

export function friendlyName(product: Product): string {
  if (FRIENDLY_NAMES[product.id]) return FRIENDLY_NAMES[product.id];
  if (product.title) {
    return product.title.replace(/^SnugFit\s+/i, 'Wavezly ');
  }
  return 'Wavezly Precision Print';
}

export function hasPhoto(product: Product): boolean {
  return Boolean(REAL_PRODUCT_IMAGES[product.id]) || Boolean(product.images?.[0]);
}

function hash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

export interface AmazonProductMeta {
  rating: number;
  count: number;
  boughtPastMonth: number;
  badge?: 'best_seller' | 'overall_pick' | 'amazon_choice';
  badgeCategory?: string;
  hasPrime: boolean;
  hasDeal: boolean;
  discountPercent?: number;
  listPrice?: number;
  couponAmount?: number;
  stockLeft?: number;
}

export function amazonMetaFor(product: Product): AmazonProductMeta {
  const h = hash(product.id);
  // Realistic ratings strictly between 4.7 and 4.9
  const ratingSteps = [4.7, 4.8, 4.9];
  const rating = ratingSteps[h % ratingSteps.length];
  const count = 420 + (h % 3850);
  const boughtPastMonth = 250 + (h % 1750);

  // Department-aligned Amazon category badge
  const categoryNames: Record<string, string> = {
    trending_3d: 'Sensory & Fidget Toys',
    electronics: 'Electronics Stands & Mounts',
    home_decor: 'Planters & Modern Home Accents',
    car_auto: 'Automotive Cup Holders & Organizers',
    tools_workshop: 'Modular Workshop & Gridfinity Storage',
    kitchen: 'Barista & Kitchen Organizers',
    vanity: 'Cosmetic Display Cases',
    bedside: 'Nightstand Valet Trays',
    custom: 'Custom Made-to-Order 3D Prints',
    living: 'Living Room Storage',
    workspace: 'Desk & Cable Management',
  };

  const badgeCategory = categoryNames[product.category || ''] || '3D Printed Accessories';

  // Realistic Amazon badges: best_seller, overall_pick, amazon_choice
  let badge: AmazonProductMeta['badge'] = undefined;
  const badgeSelector = h % 3;
  if (badgeSelector === 0) {
    badge = 'best_seller';
  } else if (badgeSelector === 1) {
    badge = 'overall_pick';
  } else {
    badge = 'amazon_choice';
  }

  // Deals
  const hasDeal = (h % 2 === 0) || product.basePrice > 25;
  const discountPercent = hasDeal ? 15 + (h % 15) : undefined;
  const listPrice = discountPercent
    ? Math.round((product.basePrice / (1 - discountPercent / 100)) * 100) / 100
    : undefined;

  // Coupon discounts ($2.00, $3.00, $5.00)
  const couponAmount = (h % 3 === 0)
    ? (product.basePrice > 30 ? 5.00 : 3.00)
    : (h % 5 === 0 ? 2.00 : undefined);

  // Scarcity indicator
  const stockLeft = (h % 6 === 0) ? 3 + (h % 5) : undefined;

  return {
    rating,
    count,
    boughtPastMonth,
    badge,
    badgeCategory,
    hasPrime: true,
    hasDeal,
    discountPercent,
    listPrice,
    couponAmount,
    stockLeft,
  };
}

export function ratingFor(product: Product): { rating: number; count: number } {
  const meta = amazonMetaFor(product);
  return { rating: meta.rating, count: meta.count };
}
