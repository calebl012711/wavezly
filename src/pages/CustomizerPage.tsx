/**
 * FORMGRID PARAMETRIC STUDIO PAGE
 * Real-time continuous 3D organizer customizer with live PBR WebGL viewport and specification controls
 */

import React from 'react';
import { useCustomizerStore } from '../store/useCustomizerStore';
import { useCartStore } from '../store/useCartStore';
import { OrganizerCanvas } from '../components/canvas/OrganizerCanvas';
import { TelemetryHUD } from '../components/customizer/TelemetryHUD';
import { CustomizerDrawer } from '../components/customizer/CustomizerDrawer';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { SEED_PRODUCTS } from '../db/seed';
import { Sliders } from 'lucide-react';

export const CustomizerPage: React.FC = () => {
  const {
    currentProduct,
    dimensions,
    selectedMaterial,
    selectedResin,
    telemetry,
    autoRotate,
    setProduct,
    setMeshRef,
    getCustomSpecs,
  } = useCustomizerStore();

  const { addCustomItem, openCart } = useCartStore();

  const custom3dProducts = SEED_PRODUCTS.filter((p) => p.type === 'custom_3d');

  const handleAddToCart = () => {
    const specs = getCustomSpecs();
    addCustomItem(currentProduct, specs, telemetry.finalPriceUsd);
    openCart();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Studio Model Switcher Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-border gap-4">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-signal-orange uppercase tracking-wider mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>STUDIO WORKBENCH</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-precision-white">
            {currentProduct.title}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {currentProduct.subtitle || 'Continuous parametric geometry generator'}
          </p>
        </div>

        {/* Model Tabs */}
        <div className="flex items-center p-1 bg-surface rounded-lg border border-surface-border font-mono text-xs self-start sm:self-auto">
          {custom3dProducts.map((prod) => {
            const isSelected = currentProduct.id === prod.id;
            return (
              <button
                key={prod.id}
                type="button"
                onClick={() => setProduct(prod)}
                className={`px-3 py-1.5 rounded transition ${
                  isSelected
                    ? 'bg-zinc-800 text-signal-orange font-semibold shadow-tactile border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {prod.title.split(' ')[0]} {prod.title.split(' ')[1]}
              </button>
            );
          })}
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
              />
            </div>
          </ErrorBoundary>

          {/* Viewport Under-Bar Guidelines */}
          <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-zinc-500 px-2">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
              Left Click + Drag: Orbit Camera // Right Click: Pan // Scroll: Zoom
            </span>
            <span className="hidden sm:inline">
              Extrusion Mesh: Procedural CSG Watertight
            </span>
          </div>
        </div>

        {/* Right: Tactile Dimension & Material Control Drawer */}
        <div className="lg:col-span-4">
          <CustomizerDrawer onAddToCart={handleAddToCart} />
        </div>
      </div>
    </div>
  );
};
