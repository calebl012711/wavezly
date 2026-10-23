/**
 * SNUGFIT STOREFRONT HELPERS
 * Shopper-friendly names, rooms, and rating display data for the catalog.
 */

import { Product } from '../types';
import { REAL_PRODUCT_IMAGES } from './productImages';

export type RoomId = 'all' | 'kitchen' | 'vanity' | 'bedside' | 'living' | 'workspace' | 'custom';

export const ROOMS: { id: RoomId; label: string; short: string }[] = [
  { id: 'all', label: 'All Products', short: 'All' },
  { id: 'kitchen', label: 'Kitchen & Coffee', short: 'Kitchen' },
  { id: 'vanity', label: 'Vanity & Bath', short: 'Bath' },
  { id: 'bedside', label: 'Bedroom & Entry', short: 'Bedroom' },
  { id: 'living', label: 'Living Room', short: 'Living' },
  { id: 'workspace', label: 'Home Office', short: 'Office' },
  { id: 'custom', label: 'Made to Fit', short: 'Made to Fit' },
];

const FRIENDLY_NAMES: Record<string, string> = {
  prod_valet_pro: 'Everyday Valet Tray (Made to Fit)',
  prod_drawer_matrix: 'Custom Drawer Organizer',
  prod_headphone_plinth: 'Headphone & Audio Stand',
  prod_screenbar: 'Glare-Free Desk Light Bar',
  prod_felt_mat: 'Soft Felt Desk Mat',
  prod_titanium_pen_stand: 'Titanium Pen & Key Stand',
  prod_vanity_matrix: 'Vanity & Skincare Organizer (Made to Fit)',
  prod_controller_dock: 'Game Controller & Remote Stand',
  prod_watch_jewelry_caddy: 'Watch & Ring Nightstand Tray',
  prod_pourover_coffee_tray: 'Coffee Station Organizer',
  prod_keeb_lube_station: 'Keyboard Hobby Station',
  prod_desk_vacuum: 'Mini Cordless Desk Vacuum',
  prod_desk_coasters: 'Stone & Cork Coasters (Set of 4)',
};

export function friendlyName(product: Product): string {
  return FRIENDLY_NAMES[product.id] || product.title;
}

export function hasPhoto(product: Product): boolean {
  return Boolean(REAL_PRODUCT_IMAGES[product.id]);
}

function hash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

/** Placeholder rating data (deterministic) until real reviews are wired up. */
export function ratingFor(product: Product): { rating: number; count: number } {
  const h = hash(product.id);
  return {
    rating: Math.round((4.5 + (h % 5) / 10) * 10) / 10,
    count: 180 + (h % 2400),
  };
}
