/**
 * FORMGRID HOME PAGE
 * Complete industrial storefront integrating hero showcase, catalog grid, customer reviews,
 * manufacturing manifesto, and developer API connection console
 */

import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { ProductGrid } from '../components/landing/ProductGrid';
import { ManufacturingSpecs } from '../components/landing/ManufacturingSpecs';
import { CustomerReviewsSection } from '../components/landing/CustomerReviewsSection';
import { IndustrialManifesto } from '../components/landing/IndustrialManifesto';
import { ApiDeveloperDrawer } from '../components/landing/ApiDeveloperDrawer';
import { Product } from '../types';

interface HomePageProps {
  onNavigateToCustomizer: () => void;
  onCustomizeProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToCustomizer,
  onCustomizeProduct,
}) => {
  const handleExploreCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen space-y-4">
      {/* 1. Hero Showcase */}
      <HeroSection
        onLaunchStudio={onNavigateToCustomizer}
        onExploreCatalog={handleExploreCatalog}
      />

      {/* 2. Expanded 10-Product Catalog with 5-Image PDP */}
      <ProductGrid onCustomizeProduct={onCustomizeProduct} />

      {/* 3. Verified Field Reviews & Tolerance Reports */}
      <CustomerReviewsSection />

      {/* 4. Manufacturing Specifications */}
      <ManufacturingSpecs />

      {/* 5. Dieter Rams Manifesto & Zero-Inventory Calculator */}
      <IndustrialManifesto />

      {/* 6. Headless API & Webhook Connection Enclave */}
      <ApiDeveloperDrawer />
    </div>
  );
};
