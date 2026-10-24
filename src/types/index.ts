/**
 * FORMGRID INDUSTRIAL DESKTOP ARCHITECTURE - CORE TYPE REGISTRY
 * Contractual Type Freezing (Phase A)
 */

export type ProductType = 'custom_3d' | 'dropship';

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'farm_queued'
  | 'supplier_dispatched'
  | 'partially_shipped'
  | 'delivered'
  | 'cancelled';

export type SupplierChannel =
  | 'internal_farm'
  | 'slant3d'
  | 'printport'
  | 'dsers'
  | 'autods'
  | 'cjdropshipping';

export type MaterialCategory = 'filament' | 'resin';

/**
 * 3D Parametric organizer physical bounding dimensions and grid topology
 */
export interface ParametricOrganizerDimensions {
  length: number; // Exterior length in millimeters (X-axis)
  width: number;  // Exterior width in millimeters (Z-axis)
  height: number; // Exterior height in millimeters (Y-axis)
  wallThickness: number; // Perimeter and divider wall thickness in mm (min 2.4mm)
  bottomThickness: number; // Floor base thickness in mm (min 2.0mm)
  rows: number; // Division along length (Z-axis splits)
  cols: number; // Division along width (X-axis splits)
  cornerFilletRadius: number; // Outer corner radius in mm
  inlayPocketDepth?: number; // Optional cavity floor resin recess in mm
}

/**
 * Material presets for 3D PBR viewport rendering and manufacturing pricing
 */
export interface MaterialOption {
  id: string;
  name: string;
  category: MaterialCategory;
  hexColor: string;
  roughness: number;
  transmission: number;
  ior: number;
  costPerCm3: number;
  inStock: boolean;
  densityGramsPerCm3: number;
}

/**
 * Technical constraints on custom 3D parametric components
 */
export interface ParametricConstraints {
  minLengthMm: number;
  maxLengthMm: number;
  minWidthMm: number;
  maxWidthMm: number;
  minHeightMm: number;
  maxHeightMm: number;
  minWallThicknessMm: number;
  minBottomThicknessMm: number;
  maxRows: number;
  maxCols: number;
}

/**
 * External supplier dropship metadata for fast-shipping accessories
 */
export interface SupplierMeta {
  channel: SupplierChannel;
  supplierSku: string;
  aliexpressProductId?: string;
  aliexpressVariantId?: string;
  warehouseOrigin: string; // e.g. "US Domestic Warehouse (Salt Lake City, UT)"
  estimatedTransitDays: string; // e.g. "2-4 Business Days"
  inventoryCount: number;
}

/**
 * Unified product catalog item
 */
export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  type: ProductType;
  category?:
    | 'kitchen'
    | 'vanity'
    | 'bedside'
    | 'living'
    | 'workspace'
    | 'trending_3d'
    | 'electronics'
    | 'home_decor'
    | 'car_auto'
    | 'tools_workshop'
    | string;
  basePrice: number; // Base USD price
  images: string[];
  features: string[];
  technicalSpecs?: Record<string, string>;
  active: boolean;
  pipelineStage?: 'prototype' | 'voting' | 'production';
  communityVotes?: number;
  badge?: string;
  parametricConstraints?: ParametricConstraints;
  supplierMeta?: SupplierMeta;
  defaultDimensions?: ParametricOrganizerDimensions;
  inventoryCount?: number;
  supplierChannel?: SupplierChannel;
  supplierSku?: string;
}

/**
 * Active parametric state configuration captured during customization
 */
export interface CustomParametricSpecs {
  dimensions: ParametricOrganizerDimensions;
  material: MaterialOption;
  resinInlay: MaterialOption | null;
  volumePlasticCm3: number;
  volumeResinCm3: number;
  estimatedGrams: number;
  estimatedPrintHours: number;
  totalManufacturingCost: number;
}

/**
 * Individual item present in the cart
 */
export interface CartItem {
  cartItemId: string;
  productId: string;
  product: Product;
  customSpecs?: CustomParametricSpecs;
  stlBlobUrl?: string; // Local Object URL for client-side STL preview/download
  stlBlob?: Blob; // Raw binary STL blob for cloud bucket upload
  calculatedPrice: number; // Calculated dynamic price or standard static price
  quantity: number;
  createdAt: number;
}

/**
 * Customer shipping destination
 */
export interface ShippingAddress {
  fullName: string;
  email: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string; // ISO 2-letter code e.g. 'US'
  phone?: string;
}

/**
 * Order Line Item stored in database
 */
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  fulfillmentType: ProductType;
  unitPriceCents: number;
  quantity: number;
  parametricSpecs: CustomParametricSpecs | null;
  stlStorageUrl: string | null;
  farmJobId: string | null;
  dsersOrderId: string | null;
  autodsItemId: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  fulfillmentStatus: 'unfulfilled' | 'farm_queued' | 'supplier_dispatched' | 'shipped' | 'delivered';
  createdAt: string;
}

/**
 * Full Order record
 */
export interface Order {
  id: string;
  orderNumber: string;
  stripeSessionId: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
}

/**
 * Split fulfillment dispatch package for downstream production routing
 */
export interface DualFulfillmentPayload {
  orderId: string;
  orderNumber: string;
  shippingAddress: ShippingAddress;
  custom3dJobs: Array<{
    orderItemId: string;
    productTitle: string;
    specs: CustomParametricSpecs;
    stlStorageUrl: string;
    quantity: number;
    channel: SupplierChannel;
  }>;
  dropshipDispatches: Array<{
    orderItemId: string;
    productTitle: string;
    sku: string;
    aliexpressProductId?: string;
    aliexpressVariantId?: string;
    quantity: number;
    channel: SupplierChannel;
  }>;
}
