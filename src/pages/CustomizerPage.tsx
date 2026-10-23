/**
 * FORMGRID PARAMETRIC STUDIO PAGE
 * Real-time continuous 3D organizer customizer with live PBR WebGL viewport and specification controls
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
import { Sliders, Sparkles } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Studio Model Switcher Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 font-sans text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>3D CUSTOMIZER STUDIO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white font-sans">
            {currentProduct.title}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-sans">
            {currentProduct.subtitle || 'Real-time parametric dimensions & tailored fit'}
          </p>
        </div>

        {/* Model Tabs & Quick Sizing Wizard */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setIsWizardOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 text-xs font-semibold hover:bg-orange-100 dark:hover:bg-orange-900/80 transition-colors shadow-xs cursor-pointer"
            title="Launch 3-step drawer sizing guide"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Sizing Wizard</span>
          </button>

          <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 font-sans text-xs font-medium overflow-x-auto max-w-full sm:max-w-xl scrollbar-none gap-1">
            {custom3dProducts.map((prod) => {
              const isSelected = currentProduct.id === prod.id;
              // Clean short display name
              const shortTitle = prod.title
                .replace('SnugFit ', '')
                .replace('Modular Desk ', '')
                .replace('Parametric ', '')
                .replace('Precision ', '')
                .replace('Audiophile ', '');

              return (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => setProduct(prod)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-zinc-800 text-orange-600 dark:text-orange-400 font-semibold shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                  }`}
                >
                  {shortTitle}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Studio Viewport & Control Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 3D Interactive Viewport with Floating Telemetry HUD */}
        <div className="lg:col-span-8 relative">
          <ErrorBoundary fallbackTitle="Studio 3D Viewport Reset">
            <TelemetryHUD dimensions={dimensions} telemetry={telemetry} />

            <div className="h-[520px] lg:h-[620px] w-full">
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

          {/* Viewport Under-Bar Guidelines */}
          <div className="mt-3 flex items-center justify-between font-sans text-xs text-zinc-500 px-2">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
              Left Click + Drag to Rotate • Scroll to Zoom • Right Click to Pan
            </span>
            <span className="hidden sm:inline text-emerald-600 font-medium">
              100% Manifold 3D Blueprint
            </span>
          </div>
        </div>

        {/* Right: Tactile Dimension & Material Control Drawer */}
        <div className="lg:col-span-4">
          <CustomizerDrawer onAddToCart={handleAddToCart} />
        </div>
      </div>

      {/* Consumer Sizing Wizard Modal */}
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
