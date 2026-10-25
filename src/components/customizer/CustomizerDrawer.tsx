/**
 * WAVEZLY CUSTOMIZER CONTROL DRAWER
 * High-end consumer customization experience (Apple Studio / Nike By You / Grovemade).
 * Real-world drawer presets, dual mm/in dimensions, clean compartment layouts,
 * realistic consumer finishes, interactive drawer slide simulator,
 * Augmented Reality (AR) drawer quick-look handoff, and 1-click binary STL export.
 */

import React, { useState, useId, useMemo, useEffect } from 'react';
import { useCustomizerStore } from '../../store/useCustomizerStore';
import { DimensionSlider } from './DimensionSlider';
import { MaterialOption } from '../../types';
import {
  playClickSound,
  playDrawerSlideSound,
  playSnapPresetSound,
  playMaterialSwitchSound,
  isSoundMuted,
  toggleSoundMute,
  subscribeToMuteState,
} from '../../lib/soundEffects';
import { ARViewModal } from './ARViewModal';
import { ArchitecturalBlueprintModal } from './ArchitecturalBlueprintModal';
import { InteractiveCompartmentGrid } from './InteractiveCompartmentGrid';
import { LivePriceBreakdown } from './LivePriceBreakdown';
import {
  getFurnitureCompatibility,
  formatFractionalInches,
} from '../../lib/compartmentGridUtils';
import {
  estimateMeshGeometryStats,
  exportMeshToBinarySTL,
  triggerStlDownload,
  exportMeshToGLTF,
  triggerGltfDownload,
} from '../../lib/stlExporter';
import {
  Sliders,
  Grid,
  Palette,
  ShoppingCart,
  Type,
  Check,
  ShieldCheck,
  RotateCcw,
  Archive,
  Utensils,
  Sparkles,
  Briefcase,
  Layers,
  ArrowRight,
  Eye,
  QrCode,
  Download,
  Printer,
  Loader2,
  Volume2,
  VolumeX,
} from 'lucide-react';

// ==========================================
// 1. REALISTIC CONSUMER FINISHES
// ==========================================
export interface ConsumerFinish {
  id: string;
  name: string;
  subtitle: string;
  hexColor: string;
  roughness: number;
  textColor: string;
  material: MaterialOption;
}

export const CONSUMER_FINISHES: ConsumerFinish[] = [
  {
    id: 'mat_pla_obsidian',
    name: 'Matte Obsidian Black',
    subtitle: 'Stealth satin black with tactile fine grain',
    hexColor: '#18181b',
    roughness: 0.88,
    textColor: 'text-white',
    material: {
      id: 'mat_pla_obsidian',
      name: 'Matte Obsidian Black',
      category: 'filament',
      hexColor: '#18181b',
      roughness: 0.88,
      transmission: 0.0,
      ior: 1.54,
      costPerCm3: 0.035,
      densityGramsPerCm3: 1.24,
      inStock: true,
    },
  },
  {
    id: 'mat_pla_warm_stone',
    name: 'Warm Stone',
    subtitle: 'Architectural limestone with organic warmth',
    hexColor: '#d6cec2',
    roughness: 0.85,
    textColor: 'text-zinc-900',
    material: {
      id: 'mat_pla_warm_stone',
      name: 'Warm Stone',
      category: 'filament',
      hexColor: '#d6cec2',
      roughness: 0.85,
      transmission: 0.0,
      ior: 1.52,
      costPerCm3: 0.035,
      densityGramsPerCm3: 1.24,
      inStock: true,
    },
  },
  {
    id: 'mat_pla_terracotta',
    name: 'Terracotta',
    subtitle: 'Rich Mediterranean baked clay finish',
    hexColor: '#c86a4b',
    roughness: 0.82,
    textColor: 'text-white',
    material: {
      id: 'mat_pla_terracotta',
      name: 'Terracotta',
      category: 'filament',
      hexColor: '#c86a4b',
      roughness: 0.82,
      transmission: 0.0,
      ior: 1.54,
      costPerCm3: 0.036,
      densityGramsPerCm3: 1.24,
      inStock: true,
    },
  },
  {
    id: 'mat_pla_forest_sage',
    name: 'Forest Sage',
    subtitle: 'Muted botanical green with soft velvet sheen',
    hexColor: '#4a5d4e',
    roughness: 0.85,
    textColor: 'text-white',
    material: {
      id: 'mat_pla_forest_sage',
      name: 'Forest Sage',
      category: 'filament',
      hexColor: '#4a5d4e',
      roughness: 0.85,
      transmission: 0.0,
      ior: 1.53,
      costPerCm3: 0.036,
      densityGramsPerCm3: 1.24,
      inStock: true,
    },
  },
];

// ==========================================
// 2. REAL-WORLD DRAWER PRESETS
// ==========================================
export interface ConsumerDrawerPreset {
  id: string;
  name: string;
  badge: string;
  subtitle: string;
  icon: 'alex' | 'cutlery' | 'catchall' | 'tu';
  length: number;
  width: number;
  height: number;
  rows: number;
  cols: number;
}

export const REAL_WORLD_PRESETS: ConsumerDrawerPreset[] = [
  {
    id: 'preset_ikea_alex',
    name: 'IKEA Alex',
    badge: 'Alex Fit',
    subtitle: '✓ Perfect Fit for IKEA Alex Drawer',
    icon: 'alex',
    length: 240,
    width: 145,
    height: 50,
    rows: 2,
    cols: 3,
  },
  {
    id: 'preset_cutlery',
    name: 'US Kitchen (12"×18")',
    badge: '12"×18" Fit',
    subtitle: '✓ Perfect Fit for US Kitchen Standard (12" × 18")',
    icon: 'cutlery',
    length: 250,
    width: 180,
    height: 45,
    rows: 1,
    cols: 4,
  },
  {
    id: 'preset_hm_tu',
    name: 'Herman Miller Tu',
    badge: 'Tu Fit',
    subtitle: '✓ Perfect Fit for Herman Miller Tu Drawer',
    icon: 'tu',
    length: 220,
    width: 160,
    height: 45,
    rows: 2,
    cols: 2,
  },
  {
    id: 'preset_catchall',
    name: 'Desk Catchall',
    badge: 'EDC Valet',
    subtitle: 'Keys, watch & AirPods dock',
    icon: 'catchall',
    length: 180,
    width: 120,
    height: 35,
    rows: 1,
    cols: 2,
  },
];

// ==========================================
// 3. CLEAN COMPARTMENT LAYOUT CARDS
// ==========================================
export interface CompartmentLayoutOption {
  id: string;
  name: string;
  slotsCount: number;
  rows: number;
  cols: number;
  tagline: string;
}

export const COMPARTMENT_LAYOUTS: CompartmentLayoutOption[] = [
  {
    id: 'layout_1_slot',
    name: '1 Slot',
    slotsCount: 1,
    rows: 1,
    cols: 1,
    tagline: 'Open catchall for journals, tablets & tools',
  },
  {
    id: 'layout_2_slots',
    name: '2 Slots',
    slotsCount: 2,
    rows: 1,
    cols: 2,
    tagline: 'Dual bays for pens, cords & phone',
  },
  {
    id: 'layout_4_slots',
    name: '4 Slots',
    slotsCount: 4,
    rows: 2,
    cols: 2,
    tagline: 'Balanced quad grid for keys, coins & cables',
  },
];

interface CustomizerDrawerProps {
  onAddToCart?: () => void;
  onRequestARModal?: () => void;
  onOpenBlueprint?: () => void;
  isMobileSheet?: boolean;
  onCloseSheet?: () => void;
}

export const CustomizerDrawer: React.FC<CustomizerDrawerProps> = ({
  onAddToCart,
  onRequestARModal,
  onOpenBlueprint,
  isMobileSheet: _isMobileSheet,
  onCloseSheet: _onCloseSheet,
}) => {
  const [activeTab, setActiveTab] = useState<'dimensions' | 'grid' | 'materials' | 'text'>('dimensions');
  const [isAdded, setIsAdded] = useState(false);
  const [isARModalOpen, setIsARModalOpen] = useState(false);
  const [isInternalBlueprintOpen, setIsInternalBlueprintOpen] = useState(false);
  const [isDownloadingStl, setIsDownloadingStl] = useState(false);
  const [isDownloadingGlb, setIsDownloadingGlb] = useState(false);
  const [stlSuccess, setStlSuccess] = useState(false);
  const [isMuted, setIsMuted] = useState(isSoundMuted());
  const customRimDebossInputId = useId();

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
    telemetry,
    engravedText,
    isDrawerOpen,
    meshRef,
    toggleDrawerOpen,
    setDimension,
    setDimensions,
    setMaterial,
    resetDefaults,
    setEngravedText,
  } = useCustomizerStore();

  const constraints = currentProduct.parametricConstraints || {
    minLengthMm: 60,
    maxLengthMm: 260,
    minWidthMm: 60,
    maxWidthMm: 240,
    minHeightMm: 20,
    maxHeightMm: 80,
    minWallThicknessMm: 2.4,
    minBottomThicknessMm: 2.0,
    maxRows: 4,
    maxCols: 6,
  };

  // Real-time geometry and file size statistics
  const geometryStats = useMemo(() => {
    return estimateMeshGeometryStats(meshRef, dimensions);
  }, [meshRef, dimensions]);

  // Toggle Drawer Open / Close with simulated 3D physical slide
  const handleToggleDrawerSlide = () => {
    const nextOpen = !isDrawerOpen;
    toggleDrawerOpen();
    playDrawerSlideSound(nextOpen);
  };

  // Apply a real-world preset
  const handleApplyPreset = (preset: ConsumerDrawerPreset) => {
    setDimensions({
      length: preset.length,
      width: preset.width,
      height: preset.height,
      rows: preset.rows,
      cols: preset.cols,
    });
    playSnapPresetSound();
  };

  // Check if current dims match a preset
  const activePreset = REAL_WORLD_PRESETS.find(
    (p) =>
      p.length === dimensions.length &&
      p.width === dimensions.width &&
      p.height === dimensions.height &&
      p.rows === dimensions.rows &&
      p.cols === dimensions.cols
  );

  // Handle Add to Cart
  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart();
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2200);
    }
  };

  // 1-Click Binary STL Download with Instant Haptic Feedback
  const handleDownloadSTL = async () => {
    if (!meshRef) {
      alert('3D viewport model is initializing. Please wait a moment.');
      return;
    }

    try {
      setIsDownloadingStl(true);
      // Instant tactile haptic feedback & confirmation chime
      playClickSound('download');
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.([15, 30, 15]);
      }

      const safeFilename = `${currentProduct.slug || 'wavezly-organizer'}-${dimensions.length}x${dimensions.width}mm.stl`;
      const result = await exportMeshToBinarySTL(meshRef);
      triggerStlDownload(result.blob, safeFilename);

      setStlSuccess(true);
      setTimeout(() => setStlSuccess(false), 2400);
    } catch (err) {
      console.error('Failed to export binary STL:', err);
      alert('Unable to generate binary STL: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsDownloadingStl(false);
    }
  };

  // 1-Click GLTF / GLB Export
  const handleDownloadGLTF = async () => {
    if (!meshRef) return;
    try {
      setIsDownloadingGlb(true);
      playClickSound('download');
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.([15, 30, 15]);
      }

      const safeFilename = `${currentProduct.slug || 'wavezly-organizer'}-${dimensions.length}x${dimensions.width}mm.glb`;
      const result = await exportMeshToGLTF(meshRef, { binary: true });
      triggerGltfDownload(result.blob, safeFilename);
    } catch (err) {
      console.error('Failed to export GLB:', err);
    } finally {
      setIsDownloadingGlb(false);
    }
  };

  // Live price calculation (benchmark $39.00 or telemetry price)
  const displayPriceUsd = Math.max(39.00, Number(telemetry.finalPriceUsd.toFixed(2)));

  // Furniture and drawer compatibility assessment
  const compatibility = getFurnitureCompatibility(dimensions.length, dimensions.width, dimensions.height);
  const lenFormatted = formatFractionalInches(dimensions.length);
  const widFormatted = formatFractionalInches(dimensions.width);
  const heightFormatted = formatFractionalInches(dimensions.height);

  return (
    <>
      <div className="w-full bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs font-sans transition-colors">
        <div>
          {/* ==========================================
              HEADER: Brand & Made-to-Measure Title
              ========================================== */}
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-800/80">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                <span className="text-[10px] text-[#FF6B00] uppercase tracking-wider font-extrabold">
                  Bespoke Precision Sizing
                </span>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
                  {compatibility.badge}
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#0F172A] dark:text-white tracking-tight mt-0.5">
                {currentProduct.title}
              </h2>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium font-mono">
                Overall: {lenFormatted.combinedShort} × {widFormatted.combinedShort} × {heightFormatted.combinedShort}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Tactile Audio Mute / Unmute Toggle */}
              <button
                type="button"
                onClick={handleToggleMute}
                title={isMuted ? 'Unmute tactile sound FX' : 'Mute tactile sound FX'}
                aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
                className={`min-h-[44px] px-2.5 py-1.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 text-xs font-semibold ${
                  isMuted
                    ? 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    : 'text-[#FF6B00] hover:bg-orange-50 dark:hover:bg-orange-950/40 bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/40'
                }`}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-zinc-400" />
                    <span className="text-[11px] text-zinc-400 hidden sm:inline">Muted</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-[#FF6B00]" />
                    <span className="text-[11px] text-[#FF6B00] hidden sm:inline">Sound ON</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  playSnapPresetSound();
                  resetDefaults();
                }}
                title="Reset to factory baseline"
                className="min-h-[44px] min-w-[44px] px-2.5 py-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer flex items-center justify-center gap-1 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* ==========================================
              REAL-WORLD DRAWER PRESETS
              ========================================== */}
          <div className="pt-3 pb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 tracking-tight">
                Real-World Drawer Presets
              </span>
              <span className="text-[10px] font-medium text-zinc-400">
                One-click standard sizes
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {REAL_WORLD_PRESETS.map((preset) => {
                const isSelected = activePreset?.id === preset.id;
                const presetLen = formatFractionalInches(preset.length);
                const presetWid = formatFractionalInches(preset.width);
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`group relative flex flex-col items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#FF6B00] bg-orange-50/60 dark:bg-orange-950/20 ring-1 ring-[#FF6B00] shadow-xs'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#FF6B00] text-white'
                            : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 group-hover:bg-zinc-300'
                        }`}
                      >
                        {preset.icon === 'alex' && <Archive className="w-3.5 h-3.5" />}
                        {preset.icon === 'cutlery' && <Utensils className="w-3.5 h-3.5" />}
                        {preset.icon === 'catchall' && <Sparkles className="w-3.5 h-3.5" />}
                        {preset.icon === 'tu' && <Briefcase className="w-3.5 h-3.5" />}
                      </div>

                      <span
                        className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isSelected
                            ? 'bg-orange-500 text-white'
                            : 'bg-zinc-200/60 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                        }`}
                      >
                        {preset.badge}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate w-full">
                      {preset.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight mt-0.5 line-clamp-1">
                      {preset.subtitle}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 mt-1 block">
                      {presetLen.combinedShort} × {presetWid.fractionOnly}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ==========================================
              AR QUICK LOOK BUTTON (VIEW IN YOUR DRAWER)
              Mobile Camera Quick Look + Desktop QR Handoff
              ========================================== */}
          <div className="my-2">
            <button
              type="button"
              onClick={() => {
                if (onRequestARModal) {
                  onRequestARModal();
                } else {
                  setIsARModalOpen(true);
                }
                playClickSound('snap');
                if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                  navigator.vibrate?.([15, 30, 15]);
                }
              }}
              className="w-full min-h-[46px] p-2.5 rounded-xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 hover:from-orange-500/15 hover:via-amber-500/15 hover:to-orange-500/10 dark:from-orange-950/40 dark:via-amber-950/30 dark:to-orange-950/20 border border-orange-300/80 dark:border-orange-800/80 transition-all cursor-pointer flex items-center justify-between group active:scale-98 shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      AR View (View in Your Drawer)
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">
                    Place inside physical desk drawer • 1:1 scale
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-semibold text-[#FF6B00] bg-orange-100 dark:bg-orange-900/60 px-2.5 py-1 rounded-md flex items-center gap-1 shrink-0">
                <QrCode className="w-3 h-3" />
                <span>Launch AR</span>
              </span>
            </button>
          </div>

          {/* ==========================================
              INTERACTIVE SLIDE DRAWER OPEN / CLOSE BUTTON
              With animated glide rail indicator
              ========================================== */}
          <div className="my-2 p-2.5 bg-gradient-to-r from-zinc-50 via-zinc-100/70 to-zinc-50 dark:from-zinc-900 dark:via-zinc-900/60 dark:to-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {/* Animated visual drawer glyph */}
                <div className="relative w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden shadow-2xs">
                  <div
                    className={`w-5 h-3 rounded-xs border transition-all duration-300 ease-out flex items-center justify-center ${
                      isDrawerOpen
                        ? 'translate-x-1 border-[#FF6B00] bg-orange-500/20'
                        : 'translate-x-0 border-zinc-400 dark:border-zinc-500 bg-zinc-200 dark:bg-zinc-700'
                    }`}
                  >
                    <div className="w-1.5 h-0.5 rounded-full bg-zinc-600 dark:bg-zinc-300" />
                  </div>
                  {/* Visual sliding rails */}
                  <div className="absolute bottom-1 w-6 h-[1.5px] bg-zinc-300 dark:bg-zinc-600 rounded-full" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full transition-colors ${
                        isDrawerOpen ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'
                      }`}
                    />
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">
                      {isDrawerOpen ? 'Drawer Open (Slid Forward)' : 'Drawer Closed (Flush)'}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">
                    Simulate glide rail clearance & fit
                  </span>
                </div>
              </div>

              {/* Interactive Toggle Button */}
              <button
                type="button"
                onClick={handleToggleDrawerSlide}
                className={`min-h-[44px] sm:min-h-0 px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95 ${
                  isDrawerOpen
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-zinc-900 hover:bg-black text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white'
                }`}
              >
                <span>{isDrawerOpen ? 'Slide Close' : 'Slide Open'}</span>
                <ArrowRight
                  className={`w-3 h-3 transition-transform duration-300 ${
                    isDrawerOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* ==========================================
              4 CLEAN CONSUMER TABS (>= 44px Mobile Tap Targets)
              ========================================== */}
          <div className="grid grid-cols-4 gap-1 sm:gap-1.5 my-3 p-1 sm:p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-xl sm:rounded-2xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('dimensions');
                playClickSound('tab');
              }}
              className={`min-h-[44px] flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-1 rounded-lg sm:rounded-xl transition cursor-pointer active:scale-95 ${
                activeTab === 'dimensions'
                  ? 'bg-white dark:bg-zinc-800 text-[#FF6B00] font-bold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 shrink-0" />
              <span>Size</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('grid');
                playClickSound('tab');
              }}
              className={`min-h-[44px] flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-1 rounded-lg sm:rounded-xl transition cursor-pointer active:scale-95 ${
                activeTab === 'grid'
                  ? 'bg-white dark:bg-zinc-800 text-[#FF6B00] font-bold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5 shrink-0" />
              <span>Layout</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('materials');
                playClickSound('tab');
              }}
              className={`min-h-[44px] flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-1 rounded-lg sm:rounded-xl transition cursor-pointer active:scale-95 ${
                activeTab === 'materials'
                  ? 'bg-white dark:bg-zinc-800 text-[#FF6B00] font-bold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5 shrink-0" />
              <span>Finish</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('text');
                playClickSound('tab');
              }}
              className={`min-h-[44px] flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-1 rounded-lg sm:rounded-xl transition cursor-pointer active:scale-95 ${
                activeTab === 'text'
                  ? 'bg-white dark:bg-zinc-800 text-[#FF6B00] font-bold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5 shrink-0" />
              <span>Engrave</span>
            </button>
          </div>

          {/* ==========================================
              TAB 1: DIMENSIONS (DUAL MM / INCHES)
              ========================================== */}
          {activeTab === 'dimensions' && (
            <div className="space-y-3.5 py-1">
              <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 px-0.5">
                <span>Precision Outer Footprint</span>
                <span className="font-mono text-[#FF6B00] font-semibold">
                  Dual Metric & Clean Fractional Readout
                </span>
              </div>

              <DimensionSlider
                label="Width (Left to Right)"
                value={dimensions.length}
                min={constraints.minLengthMm}
                max={constraints.maxLengthMm}
                step={1}
                unit="mm"
                secondaryDisplay={`${lenFormatted.fractionalInches} (${lenFormatted.decimalInches})`}
                onChange={(val) => setDimension('length', val)}
                description={`Custom fit: ${lenFormatted.combinedDetailed} drawer width`}
              />

              <DimensionSlider
                label="Depth (Front to Back)"
                value={dimensions.width}
                min={constraints.minWidthMm}
                max={constraints.maxWidthMm}
                step={1}
                unit="mm"
                secondaryDisplay={`${widFormatted.fractionalInches} (${widFormatted.decimalInches})`}
                onChange={(val) => setDimension('width', val)}
                description={`Custom fit: ${widFormatted.combinedDetailed} drawer depth`}
              />

              <DimensionSlider
                label="Height (Tray Depth)"
                value={dimensions.height}
                min={constraints.minHeightMm}
                max={constraints.maxHeightMm}
                step={1}
                unit="mm"
                secondaryDisplay={`${heightFormatted.fractionalInches} (${heightFormatted.decimalInches})`}
                onChange={(val) => setDimension('height', val)}
                description={`Custom fit: ${heightFormatted.combinedDetailed} rim depth`}
              />
            </div>
          )}

          {/* ==========================================
              TAB 2: INTERACTIVE COMPARTMENT GRID & PRESETS
              ========================================== */}
          {activeTab === 'grid' && (
            <div className="py-1">
              <InteractiveCompartmentGrid
                rows={dimensions.rows}
                cols={dimensions.cols}
                lengthMm={dimensions.length}
                widthMm={dimensions.width}
                heightMm={dimensions.height}
                wallThickness={dimensions.wallThickness}
                selectedHexColor={selectedMaterial.hexColor}
                hasResinInlay={false}
                onLayoutChange={(newRows, newCols) => {
                  setDimensions({ rows: newRows, cols: newCols });
                }}
                onDimensionsChange={(newDims) => {
                  setDimensions(newDims);
                }}
              />
            </div>
          )}

          {/* ==========================================
              TAB 3: COLOR SWATCHES (REALISTIC CONSUMER FINISHES)
              ========================================== */}
          {activeTab === 'materials' && (
            <div className="space-y-3 py-1">
              <div>
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block mb-0.5">
                  Architectural Finishes
                </span>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Silky matte biopolymer, finger-print resistant with tactile grain.
                </p>
              </div>

              {/* 4 Realistic Consumer Finish Swatches */}
              <div className="grid grid-cols-2 gap-2.5">
                {CONSUMER_FINISHES.map((finish) => {
                  const isSelected =
                    selectedMaterial.hexColor.toLowerCase() === finish.hexColor.toLowerCase() ||
                    selectedMaterial.id === finish.id;

                  return (
                    <button
                      key={finish.id}
                      type="button"
                      onClick={() => {
                        setMaterial(finish.material);
                        playMaterialSwitchSound();
                      }}
                      className={`group relative flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#FF6B00] bg-white dark:bg-zinc-900 ring-1 ring-[#FF6B00] shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/30 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-900'
                      }`}
                    >
                      {/* Realistic Physical Swatch Puck */}
                      <div
                        className="w-8 h-8 rounded-full shadow-inner border border-black/15 dark:border-white/20 shrink-0 flex items-center justify-center transition-transform group-hover:scale-105"
                        style={{
                          backgroundColor: finish.hexColor,
                          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.25), 0 2px 4px rgba(0,0,0,0.15)',
                        }}
                      >
                        {isSelected && (
                          <Check className={`w-3.5 h-3.5 stroke-[3] ${finish.textColor}`} />
                        )}
                      </div>

                      <div className="overflow-hidden">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block truncate">
                          {finish.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block line-clamp-1 leading-tight mt-0.5">
                          {finish.subtitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Material Guarantee Callout */}
              <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/70 dark:border-zinc-800 flex items-center gap-2 text-zinc-600 dark:text-zinc-300 text-[11px]">
                <Layers className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                <span>Plant-derived architectural polymer • Non-toxic & UV stable</span>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 4: PERSONALIZED RIM ENGRAVING
              ========================================== */}
          {activeTab === 'text' && (
            <div className="space-y-3 py-1">
              <div>
                <label htmlFor={customRimDebossInputId} className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block mb-0.5">
                  Personalized Rim Deboss (Optional)
                </label>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-2">
                  Personalize your tray with your initials, name, or room label debossed on the front lip.
                </p>
                <input
                  id={customRimDebossInputId}
                  type="text"
                  maxLength={24}
                  value={engravedText}
                  onChange={(e) => setEngravedText(e.target.value)}
                  placeholder="e.g. CALEB • STUDIO 01"
                  className="w-full min-h-[44px] px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm sm:text-xs text-zinc-900 dark:text-white font-mono focus:outline-none focus:border-[#FF6B00] transition"
                />
                <span className="text-[10px] text-zinc-400 mt-1 block text-right font-mono">
                  {24 - (engravedText || '').length} characters remaining
                </span>
              </div>
            </div>
          )}

          {/* ==========================================
              3D PRINTING & BINARY STL / GLTF EXPORT SECTION
              With real-time file size estimation & instant haptic sound effect
              ========================================== */}
          <div className="my-3.5 p-3 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  3D Print Farm File Delivery
                </span>
              </div>
              <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500">
                IEEE 754 Little-Endian
              </span>
            </div>

            {/* Real-time file size & triangle telemetry banner */}
            <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 flex items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-200 font-medium truncate">
                <span className="font-extrabold text-[#FF6B00]">{geometryStats.stlSizeFormatted}</span>
                <span className="text-zinc-500 dark:text-zinc-400">Binary STL</span>
                <span className="text-zinc-300 dark:text-zinc-600">•</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {geometryStats.triangleCount.toLocaleString()} Triangles
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded shrink-0">
                Ready for Bambu / Prusa
              </span>
            </div>

            {/* 1-Click Download 3D Printable STL Button + GLTF / GLB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDownloadSTL}
                disabled={isDownloadingStl}
                className="min-h-[44px] py-2 px-3 rounded-xl bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isDownloadingStl ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF6B00]" />
                    <span>Generating STL...</span>
                  </>
                ) : stlSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Downloaded STL!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Download 3D STL</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadGLTF}
                disabled={isDownloadingGlb}
                className="min-h-[44px] py-2 px-3 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isDownloadingGlb ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF6B00]" />
                    <span>Exporting GLB...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Export .GLB ({geometryStats.glbSizeFormatted})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ==========================================
            FOOTER AREA:
            Live Price Calculation ($39.00), Free Shipping Tag,
            100% Fit Guarantee Stamp, and Add to Cart
            ========================================== */}
        <div className="pt-3.5 mt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3">
          {/* 100% Fit Guarantee Stamp Box */}
          <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-900 dark:text-emerald-300 tracking-tight">
                  100% PERFECT FIT GUARANTEE
                </span>
                <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
                  Risk-Free
                </span>
              </div>
              <p className="text-[10px] text-emerald-800/80 dark:text-emerald-400/80 leading-normal mt-0.5">
                If this custom tray doesn't glide into your drawer with seamless millimeter clearance, we will remake and reship it at zero cost.
              </p>
            </div>
          </div>

          {/* Live Pricing Breakdown with Biopolymer Mass, Print Time, and Free US Shipping */}
          <LivePriceBreakdown
            telemetry={telemetry}
            selectedMaterial={selectedMaterial}
            hasResinInlay={false}
          />

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAdd}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#FF6B00] hover:bg-[#ea5f00] text-white active:scale-98 shadow-orange-500/10'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Added to Your Bag</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add Custom Tray to Cart • ${displayPriceUsd.toFixed(2)}</span>
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

      {/* 2D Architectural Blueprint Modal */}
      {!onOpenBlueprint && (
        <ArchitecturalBlueprintModal
          isOpen={isInternalBlueprintOpen}
          onClose={() => setIsInternalBlueprintOpen(false)}
          onAddToCart={onAddToCart}
        />
      )}
    </>
  );
};
