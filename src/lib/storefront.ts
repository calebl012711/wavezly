/**
 * SNUGFIT STOREFRONT HELPERS
 * Shopper-friendly names, rooms, Amazon-style badges, ratings, and deal metadata.
 */

import { Product } from '../types';
import { REAL_PRODUCT_IMAGES } from './productImages';

export type RoomId = 'all' | 'kitchen' | 'vanity' | 'bedside' | 'living' | 'workspace' | 'custom' | 'deals';

export const ROOMS: { id: RoomId; label: string; short: string; amazonDept: string }[] = [
  { id: 'all', label: 'All Departments', short: 'All', amazonDept: 'All Departments' },
  { id: 'deals', label: "Today's Deals", short: 'Deals', amazonDept: "Today's Deals" },
  { id: 'kitchen', label: 'Kitchen & Coffee', short: 'Kitchen', amazonDept: 'Kitchen & Dining' },
  { id: 'vanity', label: 'Vanity & Bath', short: 'Bath', amazonDept: 'Beauty & Personal Care' },
  { id: 'bedside', label: 'Bedroom & Entry', short: 'Bedroom', amazonDept: 'Home & Bedroom' },
  { id: 'living', label: 'Living Room', short: 'Living', amazonDept: 'Living Room Furniture' },
  { id: 'workspace', label: 'Home Office', short: 'Office', amazonDept: 'Office Products' },
  { id: 'custom', label: 'Custom 3D Fit', short: 'Custom', amazonDept: 'Custom Made to Order' },
];

export const FRIENDLY_NAMES: Record<string, string> = {
  prod_valet_pro: 'SnugFit Everyday Valet Tray - Modular Catchall with Resin Dampening Inlay',
  prod_drawer_matrix: 'SnugFit Custom Modular Drawer Organizer Matrix - Flush Fit for Utensils & Tools',
  prod_headphone_plinth: 'SnugFit Heavyweight Headphone Stand & DAC Platform - Acoustic Isolation Base',
  prod_screenbar: 'SnugFit Asymmetric Glare-Free LED Monitor ScreenBar - Auto-Dimming Desk Light',
  prod_felt_mat: 'SnugFit Dual-Sided Merino Wool Eco-Felt Desk Mat (900 × 400mm) - Non-Slip Vegan Leather',
  prod_titanium_pen_stand: 'SnugFit Solid Machined Titanium Pen Stand & Desk EDC Anchor - Grade 5 Titanium',
  prod_vanity_matrix: 'SnugFit Beauty & Skincare Vanity Grid - Custom Cosmetic, Serum & Brush Organizer',
  prod_controller_dock: 'SnugFit Dual Gaming Controller & Remote Stand - Fits PS5, Xbox & Apple TV Remotes',
  prod_watch_jewelry_caddy: 'SnugFit Timepiece & Ring Cushion Caddy - Watch Saddle & Velvet Ring Slits',
  prod_pourover_coffee_tray: 'SnugFit Barista Espresso & Pour-Over Station - 58mm Tamper & Portafilter Valet',
  prod_keeb_lube_station: 'SnugFit Mechanical Switch & Modder Station - 36-Stem Switch Tester & Lube Well',
  prod_desk_vacuum: 'SnugFit Micro-Suction Cordless Desk Vacuum - USB-C Rechargeable Crumb Sweeper',
  prod_desk_coasters: 'SnugFit Solid Volcanic Basalt & Natural Cork Coasters (Set of 4) with Brass Stand',
  prod_kitchen_cutlery_matrix: 'SnugFit Custom Cutlery & Utensil Matrix - Non-Slip Silverware Drawer Insert',
  prod_spice_pantry_tier: 'SnugFit Tiered Spice & Pantry Organizer - Angled 3-Tier Cabinet Display Riser',
  prod_grooming_stand: 'SnugFit Electric Toothbrush & Grooming Plinth - Water-Draining Countertop Stand',
  prod_entryway_catchall: 'SnugFit Entryway Key & Sunglass Plinth - Contoured Catchall for Console Tables',
};

export function friendlyName(product: Product): string {
  return FRIENDLY_NAMES[product.id] || product.title;
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
  const rating = Math.round((4.6 + (h % 4) / 10) * 10) / 10;
  const count = 350 + (h % 3800);
  const boughtPastMonth = 200 + (h % 1500);

  // Deterministic badges
  let badge: AmazonProductMeta['badge'] = undefined;
  let badgeCategory = 'Drawer Organizers';
  if (h % 3 === 0) {
    badge = 'best_seller';
    badgeCategory = product.category === 'kitchen' ? 'Kitchen Utensil Trays' : product.category === 'vanity' ? 'Cosmetic Display Cases' : 'Drawer Organizers';
  } else if (h % 3 === 1) {
    badge = 'overall_pick';
  } else {
    badge = 'amazon_choice';
    badgeCategory = 'custom drawer organizers';
  }

  // Deals
  const hasDeal = (h % 2 === 0) || product.basePrice > 25;
  const discountPercent = hasDeal ? 15 + (h % 15) : undefined;
  const listPrice = discountPercent ? Math.round((product.basePrice / (1 - discountPercent / 100)) * 100) / 100 : undefined;

  // Coupon
  const couponAmount = (h % 4 === 0) ? (product.basePrice > 30 ? 5.00 : 3.00) : undefined;
  const stockLeft = (h % 5 === 0) ? 3 + (h % 5) : undefined;

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

