-- ==============================================================================
-- FORMGRID INDUSTRIAL DATABASE SCHEMA & MIGRATION SCRIPT
-- PostgreSQL / Supabase Compatible DDL
-- ==============================================================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Strict Enum types for dual-fulfillment pipeline
DO $$ BEGIN
    CREATE TYPE product_type AS ENUM ('custom_3d', 'dropship');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'pending', 
        'paid', 
        'processing', 
        'farm_queued', 
        'supplier_dispatched', 
        'partially_shipped', 
        'delivered', 
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE supplier_channel AS ENUM (
        'internal_farm', 
        'slant3d', 
        'printport', 
        'dsers', 
        'autods'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT NOT NULL,
    type product_type NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    features TEXT[] DEFAULT ARRAY[]::TEXT[],
    technical_specs JSONB DEFAULT '{}'::JSONB,
    active BOOLEAN DEFAULT true,
    
    -- Parametric Bounds (Populated if type = 'custom_3d')
    min_length_mm INTEGER DEFAULT 60,
    max_length_mm INTEGER DEFAULT 260,
    min_width_mm INTEGER DEFAULT 60,
    max_width_mm INTEGER DEFAULT 260,
    min_height_mm INTEGER DEFAULT 20,
    max_height_mm INTEGER DEFAULT 80,
    min_wall_thickness_mm NUMERIC(3, 1) DEFAULT 2.4,
    min_bottom_thickness_mm NUMERIC(3, 1) DEFAULT 2.0,
    max_rows INTEGER DEFAULT 4,
    max_cols INTEGER DEFAULT 6,
    default_dimensions JSONB DEFAULT NULL,
    
    -- Supplier Metadata (Populated if type = 'dropship')
    supplier_channel supplier_channel DEFAULT 'internal_farm',
    supplier_sku VARCHAR(255),
    aliexpress_product_id VARCHAR(255),
    aliexpress_variant_id VARCHAR(255),
    warehouse_origin VARCHAR(255),
    estimated_transit_days VARCHAR(100),
    inventory_count INTEGER DEFAULT 100,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Material & Resin Swatches Table
CREATE TABLE IF NOT EXISTS material_presets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'filament' or 'resin'
    hex_color VARCHAR(7) NOT NULL,
    roughness NUMERIC(3, 2) DEFAULT 0.85,
    transmission NUMERIC(3, 2) DEFAULT 0.00,
    ior NUMERIC(3, 2) DEFAULT 1.50,
    cost_per_cm3 NUMERIC(6, 4) NOT NULL,
    density_grams_per_cm3 NUMERIC(4, 2) DEFAULT 1.24,
    in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(64) UNIQUE NOT NULL,
    stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    shipping_address_line1 TEXT NOT NULL,
    shipping_address_line2 TEXT,
    shipping_address_city VARCHAR(100) NOT NULL,
    shipping_address_state VARCHAR(100) NOT NULL,
    shipping_address_postal VARCHAR(20) NOT NULL,
    shipping_address_country VARCHAR(10) NOT NULL DEFAULT 'US',
    subtotal_cents INTEGER NOT NULL,
    shipping_cents INTEGER NOT NULL DEFAULT 0,
    total_cents INTEGER NOT NULL,
    status order_status DEFAULT 'paid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Order Line Items Table (Dual-Fulfillment Router Records)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_title VARCHAR(255) NOT NULL,
    fulfillment_type product_type NOT NULL,
    unit_price_cents INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    
    -- Parametric manufacturing properties (for custom_3d)
    parametric_specs JSONB DEFAULT NULL,
    stl_storage_url TEXT DEFAULT NULL,
    farm_job_id VARCHAR(255) DEFAULT NULL,
    
    -- Dropship supplier fulfillment properties (for dropship)
    dsers_order_id VARCHAR(255) DEFAULT NULL,
    autods_item_id VARCHAR(255) DEFAULT NULL,
    tracking_number VARCHAR(255) DEFAULT NULL,
    tracking_url TEXT DEFAULT NULL,
    
    fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for performant query telemetry
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_fulfillment ON order_items(fulfillment_type, fulfillment_status);
