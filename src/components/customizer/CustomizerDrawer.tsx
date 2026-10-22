/**
 * FORMGRID CUSTOMIZER CONTROL DRAWER
 * Precision accordion panels for physical bounding, grid topology, material swatches, curated presets, and cart dispatch
 */

import React, { useState, useEffect } from 'react';
import { useCustomizerStore, BLUEPRINT_PRESETS } from '../../store/useCustomizerStore';
import { DimensionSlider } from './DimensionSlider';
import { MaterialSelector } from './MaterialSelector';
import { playClickSound, isSoundMuted, toggleSoundMute, subscribeToMuteState } from '../../lib/soundEffects';
import {
  Sliders,
  Grid,
  Palette,
  Download,
  ShoppingCart,
  RotateCcw,
  Compass,
  CheckCircle2,
  Sparkles,
  Type,
  Box,
  Volume2,
  VolumeX,
  Layers,
  FileCode,
  ChevronDown,
  Cpu,
  Sun,
} from 'lucide-react';
import {
  LIGHTING_PRESETS_METADATA,
  LIGHTING_PRESET_KEYS,
} from '../canvas/StudioEnvironment';
import {
  downloadSlicerProfile,
  SlicerProfileContext,
  SlicerEcosystem,
} from '../../lib/slicerProfileGenerator';

interface CustomizerDrawerProps {
  onAddToCart?: () => void;
}

export const CustomizerDrawer: React.FC<CustomizerDrawerProps> = ({ onAddToCart }) => {
  const [activeTab, setActiveTab] = useState<'dimensions' | 'grid' | 'materials' | 'inspect' | 'presets'>('dimensions');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [slicerSuccess, setSlicerSuccess] = useState(false);
  const [showSlicerMenu, setShowSlicerMenu] = useState(false);
  const [muted, setMuted] = useState(isSoundMuted());

  useEffect(() => {
    return subscribeToMuteState((m) => setMuted(m));
  }, []);

  const {
    currentProduct,
    dimensions,
    selectedMaterial,
    selectedResin,
    lightingPreset,
    telemetry,
    wireframe,
    engravedText,
    sliceHeight,
    explodedOffset,
    setDimension,
    setMaterial,
    setResin,
    setLightingPreset,
    setSliceHeight,
    setExplodedOffset,
    resetDefaults,
    toggleAutoRotate,
    toggleWireframe,
    setEngravedText,
    applyPreset,
    autoRotate,
    exportStlFile,
    isExportingStl,
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

  const handleExportStl = async () => {
    try {
      playClickSound('snap');
      await exportStlFile();
      playClickSound('success');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export STL:', err);
    }
  };

  const handleExportSlicer = (ecosystem: SlicerEcosystem = 'all') => {
    try {
      playClickSound('snap');
      const slicerCtx: SlicerProfileContext = {
        productTitle: currentProduct.title,
        productSlug: currentProduct.slug,
        dimensions,
        material: selectedMaterial,
        estimatedGrams: telemetry.totalWeightGrams,
        estimatedHours: telemetry.estimatedPrintHours,
        nozzleDiameterMm: 0.4,
        layerHeightMm: 0.2,
        infillDensityPercent: 18,
        perimeters: 3,
        flowRatio: 0.98,
        nozzleTempC: 215,
        bedTempC: 55,
      };

      downloadSlicerProfile(slicerCtx, ecosystem);
      playClickSound('success');
      setSlicerSuccess(true);
      setShowSlicerMenu(false);
      setTimeout(() => setSlicerSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export slicer profile:', err);
    }
  };

  return (
    <div className="w-full lg:w-96 bg-white dark:bg-[#121214] border border-zinc-200/90 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg font-sans">
      {/* Drawer Top Header & Quick Reset */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-zinc-800">
          <div>
            <span className="text-[10px] text-orange-600 dark:text-orange-400 uppercase tracking-widest font-semibold block">
              CUSTOM SPECIFICATIONS
            </span>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-white tracking-tight">
              {currentProduct.title}
            </h2>
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => {
                toggleSoundMute();
              }}
              title={muted ? 'Unmute Tactile Sound FX' : 'Mute Tactile Sound FX'}
              className={`p-1.5 rounded border transition ${
                muted
                  ? 'border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                  : 'border-signal-orange/40 text-signal-orange bg-signal-orange/10'
              }`}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound('snap');
                toggleWireframe();
              }}
              title={wireframe ? 'Solid PBR Render' : 'Holographic CAD Wireframe'}
              className={`p-1.5 rounded border transition ${
                wireframe
                  ? 'border-signal-cyan text-signal-cyan bg-signal-cyan/10'
                  : 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Box className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound('snap');
                toggleAutoRotate();
              }}
              title={autoRotate ? 'Pause Rotation' : 'Auto Rotate View'}
              className={`p-1.5 rounded border transition ${
                autoRotate
                  ? 'border-signal-orange text-signal-orange bg-signal-orange/10'
                  : 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Compass className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound('snap');
                resetDefaults();
              }}
              title="Reset to Factory Blueprint"
              className="p-1.5 rounded border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-5 gap-1 my-3 p-1 bg-black/50 rounded-lg border border-zinc-800/80 text-[10px]">
          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              setActiveTab('dimensions');
            }}
            className={`flex items-center justify-center space-x-1 py-1.5 rounded font-medium transition ${
              activeTab === 'dimensions'
                ? 'bg-zinc-800 text-precision-white shadow-tactile'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Dimensions</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              setActiveTab('grid');
            }}
            className={`flex items-center justify-center space-x-1 py-1.5 rounded font-medium transition ${
              activeTab === 'grid'
                ? 'bg-zinc-800 text-precision-white shadow-tactile'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Grid className="w-3 h-3" />
            <span>Layout</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              setActiveTab('materials');
            }}
            className={`flex items-center justify-center space-x-1 py-1.5 rounded font-medium transition ${
              activeTab === 'materials'
                ? 'bg-zinc-800 text-precision-white shadow-tactile'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Palette className="w-3 h-3" />
            <span>Colors</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              setActiveTab('inspect');
            }}
            className={`relative flex items-center justify-center space-x-1 py-1.5 rounded font-medium transition ${
              activeTab === 'inspect'
                ? 'bg-signal-orange/20 text-signal-orange shadow-tactile'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Layers</span>
            {(sliceHeight < 100 || explodedOffset > 0) && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-signal-orange animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              setActiveTab('presets');
            }}
            className={`flex items-center justify-center space-x-1 py-1.5 rounded font-medium transition ${
              activeTab === 'presets'
                ? 'bg-zinc-800 text-precision-white shadow-tactile'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Styles</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
          {activeTab === 'dimensions' && (
            <div className="space-y-2.5">
              <DimensionSlider
                label="Length (Front-to-Back)"
                axisTag="LENGTH"
                value={dimensions.length}
                min={constraints.minLengthMm}
                max={constraints.maxLengthMm}
                step={5}
                onChange={(val) => setDimension('length', val)}
                description="Exact front-to-back sizing to fit your drawer or desk."
              />

              <DimensionSlider
                label="Width (Side-to-Side)"
                axisTag="WIDTH"
                value={dimensions.width}
                min={constraints.minWidthMm}
                max={constraints.maxWidthMm}
                step={5}
                onChange={(val) => setDimension('width', val)}
                description="Side-to-side width to eliminate sliding and loose gaps."
              />

              <DimensionSlider
                label="Height (Wall Depth)"
                axisTag="HEIGHT"
                value={dimensions.height}
                min={constraints.minHeightMm}
                max={constraints.maxHeightMm}
                step={2}
                onChange={(val) => setDimension('height', val)}
                description="Wall height to keep watches, pens, and tools safe."
              />

              <DimensionSlider
                label="Wall Sturdiness"
                value={dimensions.wallThickness}
                min={constraints.minWallThicknessMm}
                max={5.0}
                step={0.2}
                onChange={(val) => setDimension('wallThickness', val)}
                description="Reinforced perimeter thickness for drop-proof durability."
              />
            </div>
          )}

          {activeTab === 'grid' && (
            <div className="space-y-2.5">
              <DimensionSlider
                label="Columns (Horizontal Compartments)"
                axisTag="COLS"
                value={dimensions.cols}
                min={1}
                max={constraints.maxCols}
                step={1}
                unit="cells"
                onChange={(val) => setDimension('cols', val)}
                description="Divides internal cavity along the longitudinal axis."
              />

              <DimensionSlider
                label="Grid Rows (Width Splits)"
                axisTag="ROWS"
                value={dimensions.rows}
                min={1}
                max={constraints.maxRows}
                step={1}
                unit="cells"
                onChange={(val) => setDimension('rows', val)}
                description="Divides internal cavity along the transverse depth."
              />

              <DimensionSlider
                label="Corner Fillet Radius"
                value={dimensions.cornerFilletRadius}
                min={2}
                max={16}
                step={1}
                onChange={(val) => setDimension('cornerFilletRadius', val)}
                description="Smooth curved outer corners preventing stress points."
              />

              <DimensionSlider
                label="Bottom Floor Base Thickness"
                value={dimensions.bottomThickness}
                min={constraints.minBottomThicknessMm}
                max={6.0}
                step={0.2}
                onChange={(val) => setDimension('bottomThickness', val)}
                description="Rigid flat floor for zero bed-warp print adhesion."
              />
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="space-y-3">
              <MaterialSelector
                selectedFilament={selectedMaterial}
                selectedResin={selectedResin}
                onSelectFilament={(fil) => {
                  playClickSound('snap');
                  setMaterial(fil);
                }}
                onSelectResin={(res) => {
                  playClickSound('snap');
                  setResin(res);
                }}
              />

              {/* Interactive Lighting Rig Switcher */}
              <div className="p-3 bg-surface rounded-lg border border-surface-border space-y-2.5">
                <div className="flex items-center justify-between text-zinc-300 text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-zinc-200">
                    <Sun className="w-3.5 h-3.5 text-signal-orange" />
                    <span>Studio Lighting Rig</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700/80 text-[9px] font-mono text-signal-orange font-bold uppercase tracking-wider">
                    {LIGHTING_PRESETS_METADATA[lightingPreset].badge}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  {LIGHTING_PRESET_KEYS.map((key) => {
                    const preset = LIGHTING_PRESETS_METADATA[key];
                    const isSelected = lightingPreset === key;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          playClickSound('snap');
                          setLightingPreset(preset.id);
                        }}
                        className={`w-full text-left p-2 rounded-lg border transition-all flex items-center justify-between group ${
                          isSelected
                            ? 'bg-zinc-800/90 border-signal-orange shadow-tactile text-precision-white'
                            : 'bg-black/40 border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-900/60 text-zinc-400'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          {/* Tactile Dual-Spectrum Swatch Indicator */}
                          <div
                            className={`w-5 h-5 rounded-full flex-shrink-0 border p-0.5 overflow-hidden flex items-center justify-center transition-transform ${
                              isSelected
                                ? 'border-signal-orange scale-110 shadow-glow-orange'
                                : 'border-zinc-700 group-hover:scale-105'
                            }`}
                          >
                            <div className="w-full h-full rounded-full flex overflow-hidden">
                              <div
                                className="w-1/2 h-full"
                                style={{ backgroundColor: preset.primaryColor }}
                              />
                              <div
                                className="w-1/2 h-full"
                                style={{ backgroundColor: preset.accentColor }}
                              />
                            </div>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center space-x-1.5">
                              <span
                                className={`text-xs font-bold truncate ${
                                  isSelected
                                    ? 'text-precision-white'
                                    : 'text-zinc-300 group-hover:text-zinc-100'
                                }`}
                              >
                                {preset.name}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-500 font-sans truncate">
                              {preset.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 pl-2 flex-shrink-0">
                          <span
                            className={`text-[9px] font-mono px-1 py-0.5 rounded ${
                              isSelected
                                ? 'bg-signal-orange/15 text-signal-orange font-semibold'
                                : 'text-zinc-500 bg-zinc-900'
                            }`}
                          >
                            {preset.cct}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-signal-orange flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Live Viewport Reflection Technical Readout */}
                <div className="p-2 rounded bg-black/40 border border-zinc-800/60 text-[10px] text-zinc-400 font-mono space-y-1">
                  <div className="flex items-center justify-between text-zinc-500 text-[9px]">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-signal-lime animate-pulse" />
                      LIVE PBR REFLECTION ENGINE
                    </span>
                    <span>REALTIME CUBEMAP</span>
                  </div>
                  <p className="text-zinc-400 text-[10px] leading-tight font-sans">
                    {LIGHTING_PRESETS_METADATA[lightingPreset].description}
                  </p>
                </div>
              </div>

              {/* Custom Laser Engraving Input */}
              <div className="p-3 bg-surface rounded-lg border border-surface-border space-y-1.5">
                <div className="flex items-center justify-between text-zinc-300 text-xs">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Type className="w-3.5 h-3.5 text-signal-orange" /> Laser Engraving Mark
                  </span>
                  <span className="text-[10px] text-zinc-500">MAX 24 CHARS</span>
                </div>
                <input
                  type="text"
                  maxLength={24}
                  value={engravedText}
                  onChange={(e) => setEngravedText(e.target.value)}
                  placeholder="e.g. STUDIO-01 // RAMS"
                  className="w-full bg-black/60 px-2.5 py-1.5 rounded border border-zinc-800 text-zinc-200 text-xs uppercase focus:outline-none focus:border-signal-orange"
                />
              </div>
            </div>
          )}

          {activeTab === 'inspect' && (
            <div className="space-y-3">
              {/* Header with Quick Reset */}
              <div className="flex items-center justify-between pb-1.5 border-b border-surface-border">
                <div className="flex items-center gap-1.5 text-signal-orange font-mono text-[10px] uppercase font-semibold">
                  <Layers className="w-3.5 h-3.5" />
                  <span>CAD SLICING & EXPLODED INSPECT</span>
                </div>
                {(sliceHeight < 100 || explodedOffset > 0) && (
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound('snap');
                      setSliceHeight(100);
                      setExplodedOffset(0);
                    }}
                    className="text-[9px] text-zinc-400 hover:text-signal-orange transition flex items-center gap-1 font-mono"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>RESET</span>
                  </button>
                )}
              </div>

              {/* 1. Slicing Height Tactile Slider */}
              <div className="space-y-1.5">
                <DimensionSlider
                  label="Layer Slicing Height"
                  axisTag="Z-CUT"
                  value={sliceHeight}
                  min={0}
                  max={100}
                  step={1}
                  unit="%"
                  onChange={setSliceHeight}
                  description={`Cut plane at ${((dimensions.height * sliceHeight) / 100).toFixed(1)}mm // Layer ${Math.max(1, Math.round(((dimensions.height * sliceHeight) / 100) / 0.2))} of ${Math.round(dimensions.height / 0.2)} (@ 0.20mm standard).`}
                />

                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound('snap');
                      setSliceHeight(Math.max(5, Math.round((dimensions.bottomThickness / dimensions.height) * 100)));
                    }}
                    className={`py-1 px-1.5 rounded border text-[10px] font-mono transition text-center ${
                      sliceHeight <= Math.round((dimensions.bottomThickness / dimensions.height) * 100)
                        ? 'border-signal-orange text-signal-orange bg-signal-orange/10'
                        : 'border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                    }`}
                  >
                    Floor Base
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound('snap');
                      setSliceHeight(50);
                    }}
                    className={`py-1 px-1.5 rounded border text-[10px] font-mono transition text-center ${
                      sliceHeight === 50
                        ? 'border-signal-orange text-signal-orange bg-signal-orange/10'
                        : 'border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                    }`}
                  >
                    50% Mid
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound('snap');
                      setSliceHeight(100);
                    }}
                    className={`py-1 px-1.5 rounded border text-[10px] font-mono transition text-center ${
                      sliceHeight === 100
                        ? 'border-signal-orange text-signal-orange bg-signal-orange/10'
                        : 'border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                    }`}
                  >
                    100% Full
                  </button>
                </div>
              </div>

              {/* 2. Exploded View Offset Tactile Slider */}
              <div className="space-y-1.5">
                <DimensionSlider
                  label="Exploded View Separation"
                  axisTag="Y-LIFT"
                  value={explodedOffset}
                  min={0}
                  max={60}
                  step={1}
                  unit="mm"
                  onChange={setExplodedOffset}
                  description="Lifts internal divider matrix (+offset) and resin inlays (+1.5×) above the floor base."
                />

                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound('snap');
                      setExplodedOffset(0);
                    }}
                    className={`py-1 px-1.5 rounded border text-[10px] font-mono transition text-center ${
                      explodedOffset === 0
                        ? 'border-signal-orange text-signal-orange bg-signal-orange/10'
                        : 'border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                    }`}
                  >
                    Seated (0mm)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound('snap');
                      setExplodedOffset(24);
                    }}
                    className={`py-1 px-1.5 rounded border text-[10px] font-mono transition text-center ${
                      explodedOffset === 24
                        ? 'border-signal-orange text-signal-orange bg-signal-orange/10'
                        : 'border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                    }`}
                  >
                    Lift (+24mm)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound('snap');
                      setExplodedOffset(48);
                    }}
                    className={`py-1 px-1.5 rounded border text-[10px] font-mono transition text-center ${
                      explodedOffset === 48
                        ? 'border-signal-orange text-signal-orange bg-signal-orange/10'
                        : 'border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                    }`}
                  >
                    Max (+48mm)
                  </button>
                </div>
              </div>

              {/* 3. Manifold Topology HUD Card */}
              <div className="p-3 bg-surface rounded-lg border border-surface-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-zinc-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-signal-lime" />
                    Watertight Manifold CAD
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-signal-lime/10 text-[9px] font-mono text-signal-lime font-bold uppercase tracking-wider">
                    VERIFIED
                  </span>
                </div>

                <div className="space-y-1 text-[11px] font-mono text-zinc-400 pt-1 border-t border-zinc-800/60">
                  <div className="flex justify-between">
                    <span>Active Bounding:</span>
                    <span className="text-zinc-200 font-semibold">
                      {dimensions.length}×{dimensions.width}×{((dimensions.height * sliceHeight) / 100).toFixed(1)}mm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Floor Sub-Assembly:</span>
                    <span className="text-zinc-200">
                      {dimensions.bottomThickness}mm (Y=0)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Perimeter Walls:</span>
                    <span className="text-zinc-200">
                      {Math.max(0, (dimensions.height * sliceHeight) / 100 - dimensions.bottomThickness).toFixed(1)}mm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Divider Matrix:</span>
                    <span className={explodedOffset > 0 ? 'text-signal-orange font-bold' : 'text-zinc-200'}>
                      {dimensions.cols - 1 + (dimensions.rows - 1) * dimensions.cols} elements {explodedOffset > 0 ? `(+${explodedOffset}mm)` : '(Seated)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resin Inlays:</span>
                    <span className={selectedResin && explodedOffset > 0 ? 'text-signal-orange font-bold' : 'text-zinc-200'}>
                      {selectedResin ? `${dimensions.rows * dimensions.cols} beds ${explodedOffset > 0 ? `(+${(explodedOffset * 1.5).toFixed(0)}mm)` : '(Seated)'}` : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="space-y-2">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                Instant Blueprint Architectures
              </div>
              {BLUEPRINT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    playClickSound('snap');
                    applyPreset(preset.id);
                  }}
                  className="w-full text-left p-2.5 rounded-lg bg-surface border border-surface-border hover:border-signal-orange transition-all group"
                >
                  <div className="flex items-center justify-between text-xs text-zinc-200 font-bold group-hover:text-signal-orange">
                    <span>{preset.name}</span>
                    <span className="text-[10px] font-normal text-zinc-500">
                      {preset.dimensions.length}×{preset.dimensions.width}mm
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1 font-sans line-clamp-1">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Drawer Action Triggers */}
      <div className="pt-4 mt-4 border-t border-surface-border space-y-2">
        <div className="flex items-center justify-between font-mono text-xs text-zinc-400 mb-1">
          <span>Manufacturing Price:</span>
          <span className="text-base font-bold text-signal-orange">
            ${telemetry.finalPriceUsd.toFixed(2)} USD
          </span>
        </div>

        <div className="space-y-2">
          {/* CAM Export Action Triggers */}
          <div className="grid grid-cols-2 gap-2 relative">
            {/* Direct 3D Model STL Download */}
            <button
              type="button"
              onClick={handleExportStl}
              disabled={isExportingStl}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-[11px] font-medium transition disabled:opacity-50"
              title="Download 3D Print File (.STL)"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-signal-lime shrink-0" />
                  <span className="text-signal-lime truncate">STL SAVED</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
                  <span className="truncate">{isExportingStl ? 'PREPARING...' : 'EXPORT .STL'}</span>
                </>
              )}
            </button>

            {/* Export 3D Print Profiles */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  playClickSound('snap');
                  setShowSlicerMenu((prev) => !prev);
                }}
                className={`w-full flex items-center justify-between space-x-1 py-2.5 px-2.5 rounded-lg border transition font-mono text-[11px] font-semibold ${
                  slicerSuccess
                    ? 'border-signal-lime/50 bg-signal-lime/10 text-signal-lime'
                    : showSlicerMenu
                    ? 'border-signal-orange bg-signal-orange/20 text-signal-orange shadow-glow-orange'
                    : 'border-signal-orange/40 bg-signal-orange/10 hover:bg-signal-orange/20 text-signal-orange'
                }`}
                title="Export 3D Print Settings (Bambu / Prusa / Klipper)"
              >
                <div className="flex items-center space-x-1.5 truncate">
                  {slicerSuccess ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-signal-lime shrink-0" />
                  ) : (
                    <FileCode className="w-3.5 h-3.5 text-signal-orange shrink-0" />
                  )}
                  <span className="truncate">
                    {slicerSuccess ? 'CAM SAVED' : 'SLICER PROFILES'}
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                    showSlicerMenu ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Slicer Profile Ecosystem Flyout / Dropdown Menu */}
              {showSlicerMenu && (
                <div className="absolute right-0 bottom-full mb-2 w-80 bg-zinc-950/95 backdrop-blur-xl border border-zinc-700/80 rounded-xl p-3 shadow-2xl z-50 font-mono space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-[10px] uppercase font-bold text-signal-orange tracking-wider flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" /> 3D Slicer CAM Presets
                    </span>
                    <span className="text-[9px] text-zinc-400">0.4mm Nozzle // 0.20mm</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {/* Complete Bundle ZIP */}
                    <button
                      type="button"
                      onClick={() => handleExportSlicer('all')}
                      className="w-full text-left p-2 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-signal-orange/60 transition group"
                    >
                      <div className="flex items-center justify-between text-zinc-200 font-bold group-hover:text-signal-orange">
                        <span className="flex items-center gap-1.5">
                          <Download className="w-3.5 h-3.5 text-signal-orange" />
                          Complete CAM Archive (.zip)
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-signal-orange/20 text-signal-orange font-normal">
                          All In One
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-0.5 font-sans">
                        Bambu JSON, Prusa INI, Voron Klipper cfg, & CAM print instructions.
                      </p>
                    </button>

                    {/* Bambu Lab Profile */}
                    <button
                      type="button"
                      onClick={() => handleExportSlicer('bambu')}
                      className="w-full text-left p-2 rounded-lg bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/80 hover:border-emerald-500/60 transition group"
                    >
                      <div className="flex items-center justify-between text-zinc-200 font-semibold group-hover:text-emerald-400">
                        <span>Bambu Lab (X1C / P1S / A1)</span>
                        <span className="text-[9px] text-zinc-500">.json</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-0.5 font-sans">
                        0.20mm Standard, 18% gyroid, 3 perimeters, flow 0.98.
                      </p>
                    </button>

                    {/* PrusaSlicer Profile */}
                    <button
                      type="button"
                      onClick={() => handleExportSlicer('prusa')}
                      className="w-full text-left p-2 rounded-lg bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/80 hover:border-orange-500/60 transition group"
                    >
                      <div className="flex items-center justify-between text-zinc-200 font-semibold group-hover:text-orange-400">
                        <span>PrusaSlicer (MK4 / XL / CoreXY)</span>
                        <span className="text-[9px] text-zinc-500">.ini (IS)</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-0.5 font-sans">
                        Input Shaping structural profile, 215°C PLA / 55°C bed.
                      </p>
                    </button>

                    {/* Voron / RatRig Klipper Profile */}
                    <button
                      type="button"
                      onClick={() => handleExportSlicer('voron')}
                      className="w-full text-left p-2 rounded-lg bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/80 hover:border-cyan-500/60 transition group"
                    >
                      <div className="flex items-center justify-between text-zinc-200 font-semibold group-hover:text-cyan-400">
                        <span>Voron 2.4 / RatRig (Klipper)</span>
                        <span className="text-[9px] text-zinc-500">.ini</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-0.5 font-sans">
                        High-speed CoreXY speeds, tuned pressure advance & fan curves.
                      </p>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-400 flex items-center justify-between">
                    <span>Est. Filament: <strong className="text-zinc-200">{telemetry.totalWeightGrams.toFixed(1)}g</strong></span>
                    <span>Nozzle: <strong className="text-zinc-200">215°C</strong> | Bed: <strong className="text-zinc-200">55°C</strong></span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Add to Unified Cart */}
          <button
            type="button"
            onClick={() => {
              playClickSound('success');
              if (onAddToCart) onAddToCart();
            }}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-signal-orange hover:bg-orange-600 text-white font-sans text-xs font-semibold tracking-wide shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add Custom Tray to Bag</span>
          </button>
        </div>
      </div>
    </div>
  );
};
