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
