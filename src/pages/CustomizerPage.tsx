/**
 * WAVEZLY CUSTOM 3D STUDIO PAGE
 * Clean, interactive consumer 3D customizer with premier mobile viewport and touch controls.
 * Prevents 3D touch hijacking, provides sticky mobile checkout bar and responsive drawer.
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
import { Box, Sparkles, ShoppingCart, Check } from 'lucide-react';

export const CustomizerPage: React.FC = () => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isMobileAdded, setIsMobileAdded] = useState(false);

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
    toggleAutoRotate,
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

  const displayPriceUsd = Math.max(39.00, Number(telemetry.finalPriceUsd.toFixed(2)));

  const handleAddToCart = () => {
    const specs = getCustomSpecs();
    addCustomItem(currentProduct, specs, telemetry.finalPriceUsd);
    setIsMobileAdded(true);
    setTimeout(() => setIsMobileAdded(false), 2200);
    openCart();
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 pb-28 sm:pb-8 space-y-4 sm:space-y-6 font-sans overflow-x-hidden">
      {/* Studio Header & Product Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200/90 dark:border-zinc-800 gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF6B00] uppercase tracking-wider mb-1">
            <Box className="w-3.5 h-3.5 shrink-0" />
            <span>Wavezly 3D Studio</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] dark:text-white">
            {currentProduct.title}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Adjust your dimensions in real time. We 3D print and ship in 48 hours.
          </p>
        </div>

        {/* Product Model Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap max-w-full">
          <button
            type="button"
            onClick={() => setIsWizardOpen(true)}
            className="min-h-[44px] sm:min-h-0 flex items-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 text-[#FF6B00] text-xs font-semibold hover:bg-orange-100 transition cursor-pointer shadow-xs active:scale-95 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>3-Step Sizing Guide</span>
          </button>

          <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium overflow-x-auto max-w-full sm:max-w-xl no-scrollbar gap-1">
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
                  className={`min-h-[40px] sm:min-h-0 px-3 py-2 sm:py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer active:scale-95 flex items-center ${
                    isSelected
                      ? 'bg-white dark:bg-zinc-800 text-[#FF6B00] font-bold shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left: 3D Interactive Viewport with Touch Scroll Protection */}
        <div className="lg:col-span-8 relative">
          <ErrorBoundary fallbackTitle="Wavezly 3D Studio Reset">
            <TelemetryHUD dimensions={dimensions} telemetry={telemetry} />

            <div className="h-[360px] xs:h-[390px] sm:h-[500px] lg:h-[580px] w-full rounded-2xl overflow-hidden shadow-xs border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950 relative">
              <OrganizerCanvas
                dimensions={dimensions}
                material={selectedMaterial}
                resinInlay={selectedResin}
                onMeshReady={setMeshRef}
                autoRotate={autoRotate}
                onToggleAutoRotate={toggleAutoRotate}
                wireframe={wireframe}
                engravedText={engravedText}
                sliceHeight={sliceHeight}
                explodedOffset={explodedOffset}
                lightingPreset={lightingPreset}
              />
            </div>
          </ErrorBoundary>

          {/* Touch/Mouse Guidelines */}
          <div className="mt-2 flex items-center justify-between text-xs text-zinc-400 px-1">
            <span>Tap "Touch to Rotate 3D" to orbit • Page scrolls freely</span>
            <span className="hidden sm:inline text-emerald-600 font-semibold">
              Guaranteed Snug Fit • Free Remakes
            </span>
          </div>
        </div>

        {/* Right: Tactile Control Drawer */}
        <div className="lg:col-span-4 w-full min-w-0">
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

      {/* ==========================================
          STICKY MOBILE "ADD TO BAG • $XX" BAR
          Fixed to bottom on mobile (sm:hidden) with safe area padding
          ========================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-200/90 dark:border-zinc-800 px-4 py-3 sm:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          {/* Live Specs & Price */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              <span className="font-bold text-[#FF6B00]">
                {dimensions.length}×{dimensions.width} mm
              </span>
              <span>•</span>
              <span className="truncate">{selectedMaterial.name.split(' ')[0]}</span>
            </div>
            <div className="text-xl font-black text-[#0F172A] dark:text-white leading-tight mt-0.5">
              ${displayPriceUsd.toFixed(2)}
            </div>
          </div>

          {/* Direct Mobile Add to Bag Action */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 min-h-[48px] px-4 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
              isMobileAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#FF6B00] hover:bg-[#ea5f00] text-white shadow-orange-500/20'
            }`}
          >
            {isMobileAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Bag • ${displayPriceUsd.toFixed(2)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
