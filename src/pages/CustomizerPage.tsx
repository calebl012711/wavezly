/**
 * WAVEZLY CUSTOM 3D STUDIO PAGE
 * Clean, interactive consumer 3D customizer with premier mobile viewport and native bottom sheet.
 * Prevents 3D touch hijacking, provides expandable mobile bottom sheet with compact peek view,
 * ultra-clean mobile header with home navigation and pulsing cart badge, and zero horizontal overflow.
 */

import React, { useState, useEffect } from 'react';
import { useCustomizerStore } from '../store/useCustomizerStore';
import { useCartStore } from '../store/useCartStore';
import { OrganizerCanvas } from '../components/canvas/OrganizerCanvas';
import { TelemetryHUD } from '../components/customizer/TelemetryHUD';
import { CustomizerDrawer } from '../components/customizer/CustomizerDrawer';
import { ConsumerSizingWizard } from '../components/customizer/ConsumerSizingWizard';
import { ARViewModal } from '../components/customizer/ARViewModal';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { SEED_PRODUCTS } from '../db/seed';
import { isSoundMuted, toggleSoundMute, subscribeToMuteState } from '../lib/soundEffects';
import {
  Box,
  Sparkles,
  ShoppingCart,
  Check,
  ArrowLeft,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  Eye,
  Volume2,
  VolumeX,
} from 'lucide-react';

export interface CustomizerPageProps {
  onNavigateHome?: () => void;
}

export const CustomizerPage: React.FC<CustomizerPageProps> = ({ onNavigateHome }) => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isARModalOpen, setIsARModalOpen] = useState(false);
  const [isMobileAdded, setIsMobileAdded] = useState(false);
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(isSoundMuted());

  useEffect(() => {
    return subscribeToMuteState((muted) => setIsMuted(muted));
  }, []);

  const handleToggleMute = () => {
    const nextMuted = toggleSoundMute();
    setIsMuted(nextMuted);
  };

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
    meshRef,
    setProduct,
    setDimensions,
    setMeshRef,
    getCustomSpecs,
  } = useCustomizerStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('wizard') === 'true' || params.get('wizard') === '1' || params.get('source') === 'ad') {
      setIsWizardOpen(true);
    }
    if (params.get('ar') === 'true' || params.get('ar') === '1') {
      setIsARModalOpen(true);
    }
    const len = Number(params.get('len'));
    const wid = Number(params.get('wid'));
    const hgt = Number(params.get('hgt'));
    const rows = Number(params.get('rows'));
    const cols = Number(params.get('cols'));
    if (len > 0 && wid > 0 && hgt > 0) {
      setDimensions({
        length: len,
        width: wid,
        height: hgt,
        rows: rows > 0 ? rows : dimensions.rows,
        cols: cols > 0 ? cols : dimensions.cols,
      });
    }
  }, []);

  const { addCustomItem, openCart, getItemCount } = useCartStore();
  const cartItemCount = getItemCount();

  const custom3dProducts = SEED_PRODUCTS.filter((p) => p.type === 'custom_3d' && p.active !== false);
  const displayPriceUsd = Math.max(39.00, Number(telemetry.finalPriceUsd.toFixed(2)));

  const handleAddToCart = () => {
    const specs = getCustomSpecs();
    addCustomItem(currentProduct, specs, telemetry.finalPriceUsd);
    setIsMobileAdded(true);
    setTimeout(() => setIsMobileAdded(false), 2200);
    openCart();
  };

  const handleBack = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.search = '';
      window.location.pathname = '/';
    }
  };

  // Touch gesture handlers for swipe expand / collapse
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY;
    if (deltaY < -35 && !isBottomSheetExpanded) {
      setIsBottomSheetExpanded(true);
    } else if (deltaY > 35 && isBottomSheetExpanded) {
      setIsBottomSheetExpanded(false);
    }
    setTouchStartY(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-2 sm:py-6 pb-28 sm:pb-8 space-y-3 sm:space-y-6 font-sans overflow-x-hidden">
      {/* ==========================================
          1. ULTRA-CLEAN MOBILE TOP HEADER (sm:hidden)
          Easy back to home, product badge, and quick cart with pulsing badge
          ========================================== */}
      <div className="flex sm:hidden items-center justify-between pb-2.5 border-b border-zinc-200/90 dark:border-zinc-800 gap-2">
        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="min-h-[44px] px-2.5 py-1.5 -ml-1 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold active:scale-95 shrink-0"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          <span>Home</span>
        </button>

        {/* Center Product Title & 3D Studio Tag */}
        <div className="text-center min-w-0 flex-1 px-1">
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-[#FF6B00] uppercase tracking-wider">
            <Box className="w-3 h-3 shrink-0" />
            <span>Wavezly 3D Studio</span>
          </div>
          <div className="text-xs font-bold text-zinc-900 dark:text-white truncate">
            {currentProduct.title.replace('Wavezly ', '').replace('Custom 3D Studio ', '')}
          </div>
        </div>

        {/* Audio Mute Button & Quick Cart with Pulsing Badge */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleToggleMute}
            className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer flex items-center justify-center active:scale-95 shrink-0"
            aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
            title={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-zinc-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#FF6B00]" />
            )}
          </button>

          <button
            type="button"
            onClick={openCart}
            className="min-h-[44px] min-w-[44px] relative p-2 -mr-1 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer flex items-center justify-center active:scale-95 shrink-0"
            aria-label={`Cart with ${cartItemCount} items`}
          >
            <div className="relative flex items-center">
              <ShoppingCart className="w-5 h-5 text-zinc-800 dark:text-white" />
              {cartItemCount > 0 && (
                <>
                  <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5 pointer-events-none">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF6B00]"></span>
                  </span>
                  <span className="absolute -top-2 -right-2 min-w-[16px] h-[16px] px-0.5 rounded-full bg-[#FF6B00] text-white text-[9px] font-extrabold flex items-center justify-center animate-pulse">
                    {cartItemCount}
                  </span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* ==========================================
          2. DESKTOP / TABLET STUDIO HEADER
          ========================================== */}
      <div className="hidden sm:flex flex-row items-center justify-between pb-4 border-b border-zinc-200/90 dark:border-zinc-800 gap-4">
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

        {/* Product Model Switcher (Desktop/Tablet) */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleToggleMute}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer shadow-xs active:scale-95 shrink-0 ${
              isMuted
                ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-600'
                : 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900/60 text-[#FF6B00] hover:bg-orange-100'
            }`}
            title={isMuted ? 'Unmute tactile sound effects' : 'Mute tactile sound effects'}
            aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-zinc-400">Audio Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Tactile Audio</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsWizardOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 text-[#FF6B00] text-xs font-semibold hover:bg-orange-100 transition cursor-pointer shadow-xs active:scale-95 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>3-Step Sizing Guide</span>
          </button>

          <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium overflow-x-auto max-w-xl no-scrollbar gap-1">
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
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer active:scale-95 flex items-center ${
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

      {/* Mobile Horizontal Model Switcher Bar */}
      <div className="sm:hidden flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          type="button"
          onClick={() => setIsWizardOpen(true)}
          className="min-h-[38px] flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 text-[#FF6B00] text-[11px] font-bold shrink-0 shadow-xs"
        >
          <Sparkles className="w-3 h-3 shrink-0" />
          <span>Sizing Guide</span>
        </button>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
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
                className={`min-h-[38px] px-3 py-1 rounded-xl whitespace-nowrap transition cursor-pointer text-xs font-semibold shrink-0 flex items-center ${
                  isSelected
                    ? 'bg-[#FF6B00] text-white font-bold shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {shortTitle}
              </button>
            );
          })}
        </div>
      </div>

      {/* ==========================================
          3. MAIN 3D VIEWPORT & DESKTOP CONTROLS
          ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left / Full: 3D Interactive Viewport */}
        <div className="lg:col-span-8 relative w-full">
          <ErrorBoundary fallbackTitle="Wavezly 3D Studio Reset">
            <TelemetryHUD dimensions={dimensions} telemetry={telemetry} />

            <div className="h-[44vh] min-h-[330px] xs:h-[48vh] sm:h-[500px] lg:h-[580px] w-full rounded-2xl overflow-hidden shadow-xs border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950 relative">
              {/* Floating AR View Pill Button */}
              <button
                type="button"
                onClick={() => setIsARModalOpen(true)}
                className="absolute top-3 right-3 z-20 min-h-[38px] px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200/90 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs font-bold shadow-md hover:bg-white dark:hover:bg-zinc-800 transition flex items-center gap-1.5 cursor-pointer active:scale-95 group"
                title="View in your physical desk drawer with AR"
              >
                <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
                <Eye className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>AR View in Drawer</span>
              </button>

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

        {/* Right: Tactile Control Drawer (Desktop Only - lg:block) */}
        <div className="hidden lg:block lg:col-span-4 w-full min-w-0">
          <CustomizerDrawer
            onAddToCart={handleAddToCart}
            onRequestARModal={() => setIsARModalOpen(true)}
          />
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
          4. EXPANDABLE MOBILE NATIVE BOTTOM SHEET (lg:hidden)
          - Compact peek view with live price, current dimensions, and "Configure" tap button.
          - Smooth swipe/tap expansion to full drawer controls without obstructing 3D viewport.
          ========================================== */}

      {/* Dimmed backdrop when sheet is expanded */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity duration-300 lg:hidden ${
          isBottomSheetExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsBottomSheetExpanded(false)}
        aria-hidden={!isBottomSheetExpanded}
      />

      {/* Expanded Bottom Sheet Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-950 rounded-t-3xl shadow-2xl border-t border-zinc-200/90 dark:border-zinc-800 max-h-[85vh] h-[82vh] flex flex-col transition-transform duration-300 ease-out lg:hidden transform ${
          isBottomSheetExpanded ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
      >
        {/* Sheet Grab Handle & Header */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="pt-2.5 pb-2 px-4 border-b border-zinc-100 dark:border-zinc-800/80 shrink-0 cursor-grab active:cursor-grabbing select-none"
        >
          {/* Grab Pill */}
          <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto mb-2" />

          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                <span className="text-[10px] text-[#FF6B00] uppercase tracking-wider font-extrabold">
                  3D Customizer Controls
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-base font-bold text-zinc-900 dark:text-white">
                  ${displayPriceUsd.toFixed(2)}
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">
                  {dimensions.length}×{dimensions.width}×{dimensions.height} mm
                </span>
              </div>
            </div>

            {/* Collapse / Done Button */}
            <button
              type="button"
              onClick={() => setIsBottomSheetExpanded(false)}
              className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <span>View 3D</span>
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            </button>
          </div>
        </div>

        {/* Sheet Scrollable Controls Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3 overscroll-contain no-scrollbar">
          <CustomizerDrawer
            onAddToCart={handleAddToCart}
            onRequestARModal={() => setIsARModalOpen(true)}
            isMobileSheet={true}
            onCloseSheet={() => setIsBottomSheetExpanded(false)}
          />
        </div>
      </div>

      {/* ==========================================
          5. COMPACT MOBILE PEEK VIEW (lg:hidden)
          Always docked at bottom when collapsed: shows live price,
          current dimensions, "Configure" expander button, and "Add to Bag".
          ========================================== */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-200/90 dark:border-zinc-800 px-4 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden shadow-[0_-6px_25px_rgba(0,0,0,0.10)] transition-transform duration-300 ${
          isBottomSheetExpanded ? 'translate-y-full pointer-events-none' : 'translate-y-0'
        }`}
      >
        {/* Drag handle */}
        <div
          onClick={() => setIsBottomSheetExpanded(true)}
          className="w-12 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mb-2 cursor-pointer active:scale-95 transition"
          aria-label="Expand customizer controls"
        />

        <div className="flex items-center justify-between gap-2.5 max-w-md mx-auto">
          {/* Live Specs & Price */}
          <div
            onClick={() => setIsBottomSheetExpanded(true)}
            className="min-w-0 cursor-pointer flex-1"
          >
            <div className="flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              <span className="font-bold text-[#FF6B00]">
                {dimensions.length}×{dimensions.width} mm
              </span>
              <span>•</span>
              <span className="truncate">{selectedMaterial.name.split(' ')[0]}</span>
            </div>
            <div className="text-lg font-black text-[#0F172A] dark:text-white leading-tight mt-0.5">
              ${displayPriceUsd.toFixed(2)}
            </div>
          </div>

          {/* "Configure" Tap Button (Expands Bottom Sheet) */}
          <button
            type="button"
            onClick={() => setIsBottomSheetExpanded(true)}
            className="min-h-[46px] px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0 border border-zinc-200 dark:border-zinc-700"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Configure</span>
            <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {/* Quick Mobile Add to Bag Action */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`min-h-[46px] px-3.5 py-2 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0 ${
              isMobileAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#FF6B00] hover:bg-[#ea5f00] text-white shadow-orange-500/20'
            }`}
          >
            {isMobileAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span className="hidden xs:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Augmented Reality (AR) Drawer Quick Look Modal */}
      <ARViewModal
        isOpen={isARModalOpen}
        onClose={() => setIsARModalOpen(false)}
        dimensions={dimensions}
        material={selectedMaterial}
        meshRef={meshRef}
      />
    </div>
  );
};
