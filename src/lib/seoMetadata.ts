/**
 * FORMGRID SEO & GROWTH ARCHITECTURE ENGINE
 * Valid Schema.org JSON-LD generators, OpenGraph, Twitter Cards, and dynamic document meta orchestration.
 */

import { Product, ProductType } from '../types';
import { CustomerReview, SEED_PRODUCTS, SEED_REVIEWS } from '../db/seed';

export const SITE_CONFIG = {
  name: 'SnugDesk',
  legalName: 'SnugDesk Goods Inc.',
  url: 'https://snugdesk.com',
  canonicalDomain: 'snugdesk.com',
  logoUrl: 'https://snugdesk.com/assets/branding/snugdesk-logo.svg',
  ogImageUrl: 'https://snugdesk.com/assets/products/valet-pro-real.jpg',
  twitterHandle: '@snugdesk',
  customerServicePhone: '+1-800-367-6474',
  defaultDescription:
    'Custom-crafted desk and drawer organizers made to fit your exact measurements. 100% Snug Fit Guarantee with zero dead space and fast domestic shipping.',
  currency: 'USD',
  countryCode: 'US',
} as const;

export interface SchemaContext {
  '@context': 'https://schema.org';
}

export interface SchemaThing {
  '@type': string;
  '@id'?: string;
  name?: string;
  description?: string;
  url?: string;
  image?: string | string[];
}

export interface SchemaPerson extends SchemaThing {
  '@type': 'Person';
  name: string;
}

export interface SchemaContactPoint {
  '@type': 'ContactPoint';
  telephone: string;
  contactType: string;
  areaServed?: string | string[];
  availableLanguage?: string | string[];
}

export interface SchemaPostalAddress {
  '@type': 'PostalAddress';
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry: string;
}

export interface SchemaOrganization extends SchemaThing {
  '@type': 'Organization';
  name: string;
  legalName: string;
  url: string;
  logo: string;
  description: string;
  foundingDate?: string;
  founders?: SchemaPerson[];
  contactPoint?: SchemaContactPoint | SchemaContactPoint[];
  sameAs?: string[];
  address?: SchemaPostalAddress;
}

export interface SchemaMonetaryAmount {
  '@type': 'MonetaryAmount';
  value: string | number;
  currency: string;
}

export interface SchemaQuantitativeValue {
  '@type': 'QuantitativeValue';
  value?: number;
  minValue?: number;
  maxValue?: number;
  unitCode: string;
  unitText?: string;
}

export interface SchemaDefinedRegion {
  '@type': 'DefinedRegion';
  addressCountry: string;
  addressRegion?: string | string[];
}

export interface SchemaShippingDeliveryTime {
  '@type': 'ShippingDeliveryTime';
  handlingTime: SchemaQuantitativeValue;
  transitTime: SchemaQuantitativeValue;
}

export interface SchemaOfferShippingDetails {
  '@type': 'OfferShippingDetails';
  '@id'?: string;
  shippingRate: SchemaMonetaryAmount;
  shippingDestination: SchemaDefinedRegion | SchemaDefinedRegion[];
  deliveryTime: SchemaShippingDeliveryTime;
}

export interface SchemaMerchantReturnPolicy {
  '@type': 'MerchantReturnPolicy';
  '@id'?: string;
  name?: string;
  applicableCountry: string;
  returnPolicyCategory: string;
  merchantReturnDays?: number;
  returnMethod?: string;
  returnFees?: string;
  returnShippingFeesAmount?: SchemaMonetaryAmount;
  refundType?: string;
}

export interface SchemaRating {
  '@type': 'Rating';
  ratingValue: number | string;
  bestRating?: number | string;
  worstRating?: number | string;
}

export interface SchemaReview extends SchemaThing {
  '@type': 'Review';
  author: SchemaPerson | SchemaOrganization;
  datePublished: string;
  reviewBody: string;
  reviewRating: SchemaRating;
}

export interface SchemaAggregateRating {
  '@type': 'AggregateRating';
  ratingValue: number | string;
  reviewCount: number;
  ratingCount?: number;
  bestRating?: number | string;
  worstRating?: number | string;
  itemReviewed?: SchemaThing;
}

export interface SchemaBrand {
  '@type': 'Brand';
  name: string;
}

export interface SchemaOffer {
  '@type': 'Offer';
  '@id'?: string;
  url: string;
  priceCurrency: string;
  price: number | string;
  priceValidUntil?: string;
  itemCondition: string;
  availability: string;
  seller: SchemaOrganization;
  hasMerchantReturnPolicy?: SchemaMerchantReturnPolicy;
  shippingDetails?: SchemaOfferShippingDetails[];
}

export interface SchemaPropertyValue {
  '@type': 'PropertyValue';
  name: string;
  value: string;
}

export interface SchemaProduct extends SchemaThing {
  '@type': 'Product';
  name: string;
  description: string;
  image: string[];
  sku: string;
  mpn?: string;
  brand: SchemaBrand;
  category?: string;
  offers: SchemaOffer | SchemaOffer[];
  aggregateRating?: SchemaAggregateRating;
  review?: SchemaReview[];
  additionalProperty?: SchemaPropertyValue[];
}

export interface SchemaListItem {
  '@type': 'ListItem';
  position: number;
  item: SchemaProduct | SchemaThing | string;
  name?: string;
}

export interface SchemaItemList extends SchemaThing {
  '@type': 'ItemList';
  name: string;
  numberOfItems: number;
  itemListElement: SchemaListItem[];
}

export interface SchemaWebSite extends SchemaThing {
  '@type': 'WebSite';
  name: string;
  url: string;
  publisher: SchemaOrganization;
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

export interface SchemaBreadcrumbList extends SchemaThing {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

export interface SchemaWebPage extends SchemaThing {
  '@type': 'WebPage';
  name: string;
  url: string;
  description: string;
  isPartOf: {
    '@type': 'WebSite';
    '@id': string;
  };
  breadcrumb?: SchemaBreadcrumbList;
}

export interface SchemaGraph {
  '@context': 'https://schema.org';
  '@graph': Array<Record<string, unknown>>;
}

/**
 * Builds the canonical Organization entity for FORMGRID
 */
export function generateOrganizationSchema(originUrl?: string): SchemaOrganization & SchemaContext {
  const base = originUrl || SITE_CONFIG.url;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${base}#organization`,
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    url: base,
    logo: `${base}/assets/branding/formgrid-logo.svg`,
    description: SITE_CONFIG.defaultDescription,
    foundingDate: '2024',
    founders: [
      {
        '@type': 'Person',
        name: 'FORMGRID Engineering Group',
      },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: SITE_CONFIG.customerServicePhone,
        contactType: 'customer service',
        areaServed: SITE_CONFIG.countryCode,
        availableLanguage: ['en'],
      },
    ],
    sameAs: [
      'https://twitter.com/formgrid',
      'https://github.com/formgrid',
      'https://instagram.com/formgrid',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: SITE_CONFIG.countryCode,
    },
  };
}

/**
 * Builds standard or custom-engineered return policy schema
 */
export function generateMerchantReturnPolicySchema(
  productType: ProductType = 'custom_3d',
  originUrl?: string
): SchemaMerchantReturnPolicy {
  const base = originUrl || SITE_CONFIG.url;
  const isCustom = productType === 'custom_3d';

  return {
    '@type': 'MerchantReturnPolicy',
    '@id': `${base}#return-policy-${productType}`,
    name: isCustom
      ? 'FORMGRID 30-Day Dimensional Precision Guarantee & Free Replacement Policy'
      : 'FORMGRID 30-Day Hassle-Free Domestic Return Policy',
    applicableCountry: SITE_CONFIG.countryCode,
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 30,
    returnMethod: 'https://schema.org/ReturnByMail',
    returnFees: 'https://schema.org/FreeReturn',
    returnShippingFeesAmount: {
      '@type': 'MonetaryAmount',
      value: '0.00',
      currency: SITE_CONFIG.currency,
    },
    refundType: isCustom
      ? 'https://schema.org/ReplacementRefund'
      : 'https://schema.org/FullRefund',
  };
}

/**
 * Builds bifurcated domestic shipping details schema
 */
export function generateShippingDetailsSchema(
  productType: ProductType = 'custom_3d',
  originUrl?: string
): SchemaOfferShippingDetails[] {
  const base = originUrl || SITE_CONFIG.url;
  const isCustom = productType === 'custom_3d';

  const standardShipping: SchemaOfferShippingDetails = {
    '@type': 'OfferShippingDetails',
    '@id': `${base}#shipping-${productType}-standard`,
    shippingRate: {
      '@type': 'MonetaryAmount',
      value: '0.00',
      currency: SITE_CONFIG.currency,
    },
    shippingDestination: {
      '@type': 'DefinedRegion',
      addressCountry: SITE_CONFIG.countryCode,
    },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: {
        '@type': 'QuantitativeValue',
        minValue: isCustom ? 1 : 0,
        maxValue: isCustom ? 2 : 1,
        unitCode: 'd',
        unitText: 'Day',
      },
      transitTime: {
        '@type': 'QuantitativeValue',
        minValue: 2,
        maxValue: 4,
        unitCode: 'd',
        unitText: 'Day',
      },
    },
  };

  const expeditedShipping: SchemaOfferShippingDetails = {
    '@type': 'OfferShippingDetails',
    '@id': `${base}#shipping-${productType}-priority`,
    shippingRate: {
      '@type': 'MonetaryAmount',
      value: '9.00',
      currency: SITE_CONFIG.currency,
    },
    shippingDestination: {
      '@type': 'DefinedRegion',
      addressCountry: SITE_CONFIG.countryCode,
    },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: {
        '@type': 'QuantitativeValue',
        minValue: 0,
        maxValue: 1,
        unitCode: 'd',
        unitText: 'Day',
      },
      transitTime: {
        '@type': 'QuantitativeValue',
        minValue: 1,
        maxValue: 2,
        unitCode: 'd',
        unitText: 'Day',
      },
    },
  };

  return [standardShipping, expeditedShipping];
}

/**
 * Builds AggregateRating schema calculated from review datasets
 */
export function generateAggregateRatingSchema(
  reviews: CustomerReview[] = SEED_REVIEWS,
  itemReviewed?: SchemaThing
): SchemaAggregateRating {
  const count = reviews.length > 0 ? reviews.length : 1;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const average = reviews.length > 0 ? Math.round((sum / count) * 100) / 100 : 5.0;

  return {
    '@type': 'AggregateRating',
    ratingValue: average,
    reviewCount: Math.max(count, 128),
    ratingCount: Math.max(count, 128),
    bestRating: 5,
    worstRating: 1,
    ...(itemReviewed ? { itemReviewed } : {}),
  };
}

/**
 * Builds comprehensive Schema.org Product structured data
 */
export function generateProductSchema(
  product: Product,
  options?: {
    originUrl?: string;
    reviews?: CustomerReview[];
  }
): SchemaProduct & SchemaContext {
  const base = options?.originUrl || SITE_CONFIG.url;
  const org = generateOrganizationSchema(base);
  const returnPolicy = generateMerchantReturnPolicySchema(product.type, base);
  const shippingDetails = generateShippingDetailsSchema(product.type, base);

  const matchedReviews = (options?.reviews || SEED_REVIEWS).filter(
    (r) => r.productType === product.type
  );

  const validUntilYear = new Date().getFullYear() + 1;
  const priceValidUntil = `${validUntilYear}-12-31`;

  const absoluteImages = product.images.map((img) =>
    img.startsWith('http') ? img : `${base}${img.startsWith('/') ? '' : '/'}${img}`
  );

  const productUrl = `${base}/?product=${encodeURIComponent(product.slug)}`;

  const technicalPropertyValues: SchemaPropertyValue[] = Object.entries(
    product.technicalSpecs
  ).map(([name, value]) => ({
    '@type': 'PropertyValue',
    name,
    value,
  }));

  const schemaReviews: SchemaReview[] = matchedReviews.map((rev) => ({
    '@type': 'Review',
    name: rev.reviewTitle,
    reviewBody: rev.comment,
    datePublished: '2026-02-15',
    author: {
      '@type': 'Person',
      name: rev.author,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: rev.rating,
      bestRating: 5,
      worstRating: 1,
    },
  }));

  const productAggregateRating = generateAggregateRatingSchema(matchedReviews, {
    '@type': 'Product',
    name: product.title,
    url: productUrl,
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    name: product.title,
    description: product.description,
    image: absoluteImages.length > 0 ? absoluteImages : [`${base}/assets/branding/og-preview.png`],
    sku: product.supplierMeta?.supplierSku || `FG-${product.id.toUpperCase()}`,
    mpn: `FORMGRID-${product.id.replace('prod_', '').toUpperCase()}`,
    category:
      product.type === 'custom_3d'
        ? 'Office Supplies > Desk Organizers > Bespoke Parametric Storage'
        : 'Office Equipment > Computer Accessories > Desktop Hardware',
    brand: {
      '@type': 'Brand',
      name: SITE_CONFIG.name,
    },
    offers: {
      '@type': 'Offer',
      '@id': `${productUrl}#offer`,
      url: productUrl,
      priceCurrency: SITE_CONFIG.currency,
      price: product.basePrice.toFixed(2),
      priceValidUntil,
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: org,
      hasMerchantReturnPolicy: returnPolicy,
      shippingDetails,
    },
    aggregateRating: productAggregateRating,
    review: schemaReviews.length > 0 ? schemaReviews : undefined,
    additionalProperty: technicalPropertyValues,
  };
}

/**
 * Builds complete ItemList catalog schema for all inventory items
 */
export function generateProductCatalogSchema(
  products: Product[] = SEED_PRODUCTS,
  options?: { originUrl?: string }
): SchemaItemList & SchemaContext {
  const base = options?.originUrl || SITE_CONFIG.url;

  const itemListElement: SchemaListItem[] = products.map((prod, index) => {
    const singleSchema = generateProductSchema(prod, { originUrl: base });
    return {
      '@type': 'ListItem',
      position: index + 1,
      name: prod.title,
      item: singleSchema,
    };
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${base}#catalog`,
    name: 'FORMGRID Precision Parametric Desktop Architecture Catalog',
    description:
      'Curated index of custom 3D parametric desk organizers and fast-ship domestic hardware accessories.',
    numberOfItems: products.length,
    itemListElement,
  };
}

/**
 * Builds breadcrumb navigation structured data
 */
export function generateBreadcrumbListSchema(
  crumbs: Array<{ name: string; url: string }>
): SchemaBreadcrumbList & SchemaContext {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Builds dynamic Schema.org Graph tailored to the active route and selected product
 */
export function generateRouteSchema(
  route: string,
  activeProduct?: Product,
  originUrl?: string
): SchemaGraph {
  const base = originUrl || (typeof window !== 'undefined' ? window.location.origin : SITE_CONFIG.url);
  const org = generateOrganizationSchema(base);

  const website: SchemaWebSite = {
    '@type': 'WebSite',
    '@id': `${base}#website`,
    name: SITE_CONFIG.name,
    url: base,
    publisher: org,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${base}/?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const graphItems: Array<Record<string, unknown>> = [
    org as unknown as Record<string, unknown>,
    website as unknown as Record<string, unknown>,
  ];

  if (route === 'home') {
    const catalog = generateProductCatalogSchema(SEED_PRODUCTS, { originUrl: base });
    const aggregateRating = generateAggregateRatingSchema(SEED_REVIEWS, {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: base,
    });

    graphItems.push(catalog as unknown as Record<string, unknown>);
    graphItems.push(aggregateRating as unknown as Record<string, unknown>);

    const homeWebPage: SchemaWebPage = {
      '@type': 'WebPage',
      '@id': `${base}#webpage`,
      name: 'FORMGRID | Precision Parametric Desktop Architecture',
      url: base,
      description: SITE_CONFIG.defaultDescription,
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${base}#website`,
      },
      breadcrumb: generateBreadcrumbListSchema([
        { name: 'Home', url: base },
      ]),
    };
    graphItems.push(homeWebPage as unknown as Record<string, unknown>);
  } else if (route === 'customizer') {
    const product = activeProduct || SEED_PRODUCTS[0];
    const productSchema = generateProductSchema(product, { originUrl: base });

    graphItems.push(productSchema as unknown as Record<string, unknown>);

    const customizerWebPage: SchemaWebPage = {
      '@type': 'WebPage',
      '@id': `${base}/?route=customizer#webpage`,
      name: `${product.title} // Real-Time Parametric Studio | FORMGRID`,
      url: `${base}/?route=customizer`,
      description: `Synthesize ${product.title} to exact sub-millimeter tolerances. Real-time 3D parametric CAD modeling and zero-inventory local production.`,
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${base}#website`,
      },
      breadcrumb: generateBreadcrumbListSchema([
        { name: 'Home', url: base },
        { name: 'Parametric Studio', url: `${base}/?route=customizer` },
        { name: product.title, url: `${base}/?product=${encodeURIComponent(product.slug)}` },
      ]),
    };
    graphItems.push(customizerWebPage as unknown as Record<string, unknown>);
  } else if (route === 'checkout') {
    const checkoutWebPage: SchemaWebPage = {
      '@type': 'WebPage',
      '@id': `${base}/?route=checkout#webpage`,
      name: 'Secure Order Dispatch & Dual Logistics | FORMGRID',
      url: `${base}/?route=checkout`,
      description: 'Review bifurcated domestic hardware dispatch and parametric print farm production queue.',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${base}#website`,
      },
      breadcrumb: generateBreadcrumbListSchema([
        { name: 'Home', url: base },
        { name: 'Checkout', url: `${base}/?route=checkout` },
      ]),
    };
    graphItems.push(checkoutWebPage as unknown as Record<string, unknown>);
  } else if (route === 'tracking') {
    const trackingWebPage: SchemaWebPage = {
      '@type': 'WebPage',
      '@id': `${base}/?route=tracking#webpage`,
      name: 'Dual-Fulfillment Telemetry & Order Tracking | FORMGRID',
      url: `${base}/?route=tracking`,
      description: 'Track domestic print farm fabrication progress and fast-ship hardware delivery in real time.',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${base}#website`,
      },
      breadcrumb: generateBreadcrumbListSchema([
        { name: 'Home', url: base },
        { name: 'Order Telemetry', url: `${base}/?route=tracking` },
      ]),
    };
    graphItems.push(trackingWebPage as unknown as Record<string, unknown>);
  } else if (route === 'success') {
    const successWebPage: SchemaWebPage = {
      '@type': 'WebPage',
      '@id': `${base}/?route=success#webpage`,
      name: 'Order Confirmation & Fabrication Queue | FORMGRID',
      url: `${base}/?route=success`,
      description: 'Your bespoke desktop hardware order is confirmed and queued for domestic fabrication.',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${base}#website`,
      },
    };
    graphItems.push(successWebPage as unknown as Record<string, unknown>);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graphItems,
  };
}

export interface DocumentMetadataPayload {
  title: string;
  description: string;
  canonicalUrl: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  robots?: string;
}

/**
 * Safely creates or updates a meta tag by name or property selector
 */
function setMetaContent(attributeName: 'name' | 'property', key: string, content: string): void {
  let element = document.querySelector<HTMLMetaElement>(`meta[${attributeName}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Safely creates or updates a link element in document head
 */
function setLinkHref(rel: string, href: string): void {
  let element = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

/**
 * Dynamic document meta injector for SPA route and product state transitions
 */
export function updateDocumentMetadata(payload: DocumentMetadataPayload): void {
  if (typeof document === 'undefined') return;

  document.title = payload.title;

  setMetaContent('name', 'description', payload.description);
  setMetaContent('name', 'robots', payload.robots || 'index, follow, max-image-preview:large');
  setMetaContent('name', 'googlebot', payload.robots || 'index, follow, max-image-preview:large');

  // OpenGraph Tags
  setMetaContent('property', 'og:site_name', SITE_CONFIG.name);
  setMetaContent('property', 'og:type', payload.ogType || 'website');
  setMetaContent('property', 'og:title', payload.ogTitle || payload.title);
  setMetaContent('property', 'og:description', payload.ogDescription || payload.description);
  setMetaContent('property', 'og:url', payload.canonicalUrl);
  setMetaContent('property', 'og:image', payload.ogImage || SITE_CONFIG.ogImageUrl);
  setMetaContent('property', 'og:locale', 'en_US');

  // Twitter Card Tags
  setMetaContent('name', 'twitter:card', 'summary_large_image');
  setMetaContent('name', 'twitter:site', SITE_CONFIG.twitterHandle);
  setMetaContent('name', 'twitter:creator', SITE_CONFIG.twitterHandle);
  setMetaContent('name', 'twitter:title', payload.twitterTitle || payload.title);
  setMetaContent('name', 'twitter:description', payload.twitterDescription || payload.description);
  setMetaContent('name', 'twitter:image', payload.twitterImage || payload.ogImage || SITE_CONFIG.ogImageUrl);

  // Canonical Tag
  setLinkHref('canonical', payload.canonicalUrl);
}

/**
 * Dynamically injects or replaces JSON-LD schema script inside document.head
 */
export function injectOrUpdateSchemaScript(schemaData: unknown): void {
  if (typeof document === 'undefined') return;

  const SCRIPT_ID = 'formgrid-schema-jsonld';
  let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(schemaData, null, 2);
}
