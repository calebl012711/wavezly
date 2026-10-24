/**
 * SNUGDESK PRODUCT VISUAL REGISTRY
 * Maps photorealistic consumer lifestyle imagery and 5-perspective technical CAD blueprints
 */

export const REAL_PRODUCT_IMAGES: Record<string, string> = {
  'prod_valet_pro': '/assets/products/valet-pro-real.jpg',
  'prod_drawer_matrix': '/assets/products/drawer-matrix-real.jpg',
  'prod_headphone_plinth': '/assets/products/headphone-plinth-real.jpg',
  'prod_screenbar': '/assets/products/screenbar-real.jpg',
  'prod_felt_mat': '/assets/products/felt-mat-real.jpg',
  'prod_titanium_pen_stand': '/assets/products/titanium-stand-real.jpg',
  'prod_vanity_matrix': '/assets/products/vanity-matrix-real.jpg',
  'prod_controller_dock': '/assets/products/controller-dock-real.jpg',
  'prod_watch_jewelry_caddy': '/assets/products/watch-jewelry-caddy-real.jpg',
  'prod_pourover_coffee_tray': '/assets/products/pourover-coffee-tray-real.jpg',
  'prod_keeb_lube_station': '/assets/products/keeb-lube-station-real.jpg',
  'prod_desk_vacuum': '/assets/products/desk-vacuum-real.jpg',
  'prod_desk_coasters': '/assets/products/desk-coasters-real.jpg',
  // Wavezly General 3D Catalog
  'prod_crystal_gem_dragon': 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80',
  'prod_lowpoly_planter': 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=80',
  'prod_magsafe_orbit_dock': 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1200&q=80',
  'prod_gyro_cube': 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=1200&q=80',
  'prod_fibonacci_vase': 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
  'prod_gridfinity_master_set': 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1200&q=80',
  'prod_car_cupholder_expander': 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80',
  'prod_wall_controller_hanger': 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=1200&q=80',
  'prod_battery_dispenser_tower': 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=1200&q=80',
  'prod_dual_laptop_vertical_stand': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80',
  'prod_lidded_storage_box': 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
  'prod_cable_raceway_power': 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1200&q=80',
  'prod_car_visor_sunglass_clip': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80',
  'prod_lego_minifig_wall_plinth': 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=1200&q=80',
  'prod_espresso_tamp_station': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
  'prod_honeycomb_lipstick_tower': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
  'prod_sonic_brush_drying_stand': 'https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=1200&q=80',
};

/**
 * Returns primary consumer card display image (preferring photorealistic studio shot)
 */
export function getProductDisplayImage(productId: string, fallbackHeroSvg: string): string {
  return REAL_PRODUCT_IMAGES[productId] || fallbackHeroSvg;
}

/**
 * Returns full multi-perspective image suite including real photograph and 5 technical blueprints
 */
export function getAllProductImages(product: { id: string; images: string[] }): {
  images: string[];
  labels: string[];
} {
  const realImg = REAL_PRODUCT_IMAGES[product.id];
  const standardLabels = [
    'Perspective View',
    'Top-Down Layout',
    'Matte Surface Detail',
    'Sizing & Measurements',
    'Desk Setup Example',
  ];

  if (realImg) {
    return {
      images: [realImg, ...product.images],
      labels: ['Photorealistic Studio View', ...standardLabels],
    };
  }

  return {
    images: product.images.length > 0 ? product.images : ['/assets/products/valet-pro-hero.svg'],
    labels: standardLabels,
  };
}
