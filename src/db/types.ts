/**
 * Database Entity Definitions mapping 1:1 with PostgreSQL schema.sql
 */

import { ProductType, OrderStatus, SupplierChannel } from '../types';

export interface DbProductRow {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  type: ProductType;
  base_price: string; // Numeric in PostgreSQL comes as string
  images: string[];
  features: string[];
  technical_specs: Record<string, string>;
  active: boolean;
  min_length_mm: number | null;
  max_length_mm: number | null;
  min_width_mm: number | null;
  max_width_mm: number | null;
  min_height_mm: number | null;
  max_height_mm: number | null;
  min_wall_thickness_mm: string | null;
  min_bottom_thickness_mm: string | null;
  max_rows: number | null;
  max_cols: number | null;
  default_dimensions: Record<string, unknown> | null;
  supplier_channel: SupplierChannel | null;
  supplier_sku: string | null;
  aliexpress_product_id: string | null;
  aliexpress_variant_id: string | null;
  warehouse_origin: string | null;
  estimated_transit_days: string | null;
  inventory_count: number;
  created_at: string;
  updated_at: string;
}

export interface DbMaterialPresetRow {
  id: string;
  name: string;
  category: 'filament' | 'resin';
  hex_color: string;
  roughness: string;
  transmission: string;
  ior: string;
  cost_per_cm3: string;
  density_grams_per_cm3: string;
  in_stock: boolean;
  created_at: string;
}

export interface DbOrderRow {
  id: string;
  order_number: string;
  stripe_session_id: string;
  customer_email: string;
  customer_name: string;
  shipping_address_line1: string;
  shipping_address_line2: string | null;
  shipping_address_city: string;
  shipping_address_state: string;
  shipping_address_postal: string;
  shipping_address_country: string;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface DbOrderItemRow {
  id: string;
  order_id: string;
  product_id: string | null;
  product_title: string;
  fulfillment_type: ProductType;
  unit_price_cents: number;
  quantity: number;
  parametric_specs: Record<string, unknown> | null;
  stl_storage_url: string | null;
  farm_job_id: string | null;
  dsers_order_id: string | null;
  autods_item_id: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  fulfillment_status: string;
  created_at: string;
  updated_at: string;
}
