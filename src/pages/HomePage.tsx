/**
 * SNUGDESK CONSUMER HOME PAGE
 * Complete conversion-focused storefront integrating hero showcase, before & after slider,
 * 3-step drawer sizing wizard, creator setups gallery, catalog grid, viral UGC reels,
 * verified reviews, and precision manufacturing manifesto.
 */

import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { BeforeAfterSlider } from '../components/landing/BeforeAfterSlider';
import { ConsumerSizingWizard } from '../components/customizer/ConsumerSizingWizard';
import { DeskSetupGallery } from '../components/landing/DeskSetupGallery';
import { ProductGrid } from '../components/landing/ProductGrid';
import { SocialUGCReels } from '../components/landing/SocialUGCReels';
import { ManufacturingSpecs } from '../components/landing/ManufacturingSpecs';
import { CustomerReviewsSection } from '../components/landing/CustomerReviewsSection';
import { IndustrialManifesto } from '../components/landing/IndustrialManifesto';
import { ApiDeveloperDrawer } from '../components/landing/ApiDeveloperDrawer';
import { Product } from '../types';

interface HomePageProps {
  onNavigateToCustomizer: () => void;
  onCustomizeProduct: (product: Product) => void;
  onOpenDeskPlanner?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToCustomizer,
  onCustomizeProduct,
  onOpenDeskPlanner,
}) => {
  const handleExploreCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      {/* 1. Hero Showcase */}
      <HeroSection
        onLaunchStudio={onNavigateToCustomizer}
        onExploreCatalog={handleExploreCatalog}
        onOpenDeskPlanner={onOpenDeskPlanner}
      />

      {/* 2. Before vs After Interactive Split Comparison */}
      <BeforeAfterSlider onOpenCustomizer={onNavigateToCustomizer} />

      {/* 3. Approachable 3-Step Sizing Wizard (IKEA Alex & Tape Measure) */}
      <ConsumerSizingWizard onCompleteTo3D={onNavigateToCustomizer} />

      {/* 4. Curated Creator Workspaces with Interactive Hotspot Pins */}
      <DeskSetupGallery
        onCustomizeProduct={onCustomizeProduct}
        onNavigateToCustomizer={onNavigateToCustomizer}
      />

      {/* 5. Expanded 10-Product Catalog with 5-Image PDP */}
      <ProductGrid onCustomizeProduct={onCustomizeProduct} />

      {/* 6. As Seen on TikTok & Instagram UGC Video Showcase */}
      <SocialUGCReels
        onCustomizeProduct={onCustomizeProduct}
        onNavigateToCustomizer={onNavigateToCustomizer}
      />

      {/* 7. Verified Field Reviews & Customer Stories */}
      <CustomerReviewsSection />

      {/* 8. Made-in-USA Crafting Workshop Specifications */}
      <ManufacturingSpecs />

      {/* 9. Zero-Waste On-Demand Production Manifesto */}
      <IndustrialManifesto />

      {/* 10. Optional Developer API Enclave */}
      <ApiDeveloperDrawer />
    </div>
  );
};
