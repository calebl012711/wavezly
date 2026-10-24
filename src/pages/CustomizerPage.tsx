/**
 * WAVEZLY CUSTOM 3D STUDIO PAGE
 * Clean, interactive consumer 3D customizer.
 * Removed developer jargon, raw CAD controls, and fake telemetry.
 */

import React, { useState, useEffect } from 'react';
import { useCustomizerStore } from '../store/useCustomizerStore';
import { useCartStore } from '../store/useCartStore';
import { OrganizerCanvas } from '../components/canvas/OrganizerCanvas';
import { TelemetryHUD } from '../components/customizer/TelemetryHUD';
import { CustomizerDrawer } from '../components/customizer/CustomizerDrawer';
import { ConsumerSizingWizard } from '../components/customizer/ConsumerSizingWizard';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { SEED_PRODUCTS } from '../db/seed';
import { Box, Sparkles } from 'lucide-react';

export const CustomizerPage: React.FC = () => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('wizard') === 'true' || params.get('wizard') === '1' || params.get('source') === 'ad') {
      setIsWizardOpen(true);
    }
  }, []);

  const {
    currentProduct,
    dimensions,
    selectedMaterial,
    selectedResin,
    lightingPreset,
    telemetry,
    autoRotate,
    wireframe,
    engravedText,
    sliceHeight,
    explodedOffset,
    setProduct,
    setMeshRef,
    getCustomSpecs,
  } = useCustomizerStore();

  const { addCustomItem, openCart } = useCartStore();

  const custom3dProducts = SEED_PRODUCTS.filter((p) => p.type === 'custom_3d' && p.active !== false);

  const handleAddToCart = () => {
    const specs = getCustomSpecs();
    addCustomItem(currentProduct, specs, telemetry.finalPriceUsd);
    openCart();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans">
      {/* Studio Header & Product Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200/90 gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF6B00] uppercase tracking-wider mb-1">
            <Box className="w-3.5 h-3.5" />
            <span>Wavezly 3D Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
            {currentProduct.title}
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Adjust your dimensions in real time. We 3D print and ship in 48 hours.
          </p>
        </div>

        {/* Product Model Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setIsWizardOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-[#FF6B00] text-xs font-semibold hover:bg-orange-100 transition cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3-Step Sizing Guide</span>
          </button>

          <div className="flex items-center p-1 bg-zinc-100 rounded-xl border border-zinc-200 text-xs font-medium overflow-x-auto max-w-full sm:max-w-xl no-scrollbar gap-1">
            {custom3dProducts.map((prod) => {
              const isSelected = currentProduct.id === prod.id;
              const shortTitle = prod.title
                .replace('Wavezly Custom 3D Studio ', '')
                .replace('Wavezly ', '')
                .replace('SnugDesk ', '')
                .replace('SnugFit ', '')
                .replace('FORMGRID ', '')
                .replace('Modular Desk ', '')
                .replace('Parametric ', '');

              return (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => setProduct(prod)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? 'bg-white text-[#FF6B00] font-bold shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {shortTitle}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main 3D Viewport & Customizer Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 3D Interactive Viewport */}
        <div className="lg:col-span-8 relative">
          <ErrorBoundary fallbackTitle="Wavezly 3D Studio Reset">
            <TelemetryHUD dimensions={dimensions} telemetry={telemetry} />

            <div className="h-[460px] sm:h-[540px] lg:h-[600px] w-full rounded-2xl overflow-hidden shadow-xs border border-zinc-200/90 bg-white">
              <OrganizerCanvas
                dimensions={dimensions}
                material={selectedMaterial}
                resinInlay={selectedResin}
                onMeshReady={setMeshRef}
                autoRotate={autoRotate}
                wireframe={wireframe}
                engravedText={engravedText}
                sliceHeight={sliceHeight}
                explodedOffset={explodedOffset}
                lightingPreset={lightingPreset}
              />
            </div>
          </ErrorBoundary>

          {/* Touch/Mouse Guidelines */}
          <div className="mt-2.5 flex items-center justify-between text-xs text-zinc-400 px-2">
            <span>Drag to rotate • Pinch/scroll to zoom</span>
            <span className="hidden sm:inline text-emerald-600 font-semibold">
              Guaranteed Snug Fit • Free Remakes
            </span>
          </div>
        </div>

        {/* Right: Tactile Control Drawer */}
        <div className="lg:col-span-4">
          <CustomizerDrawer onAddToCart={handleAddToCart} />
        </div>
      </div>

      {/* Sizing Wizard Modal */}
      <ConsumerSizingWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={() => setIsWizardOpen(false)}
        onAddToCart={handleAddToCart}
        isModal={true}
      />
    </div>
  );
};
