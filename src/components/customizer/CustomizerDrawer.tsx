/**
 * WAVEZLY CUSTOMIZER CONTROL DRAWER
 * Clean, consumer-friendly product customization panel.
 * Removed developer jargon, raw CAD toolbars, and sound ticks.
 */

import React, { useState } from 'react';
import { useCustomizerStore, BLUEPRINT_PRESETS } from '../../store/useCustomizerStore';
import { DimensionSlider } from './DimensionSlider';
import { MaterialSelector } from './MaterialSelector';
import {
  Sliders,
  Grid,
  Palette,
  ShoppingCart,
  Type,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';

interface CustomizerDrawerProps {
  onAddToCart?: () => void;
}

export const CustomizerDrawer: React.FC<CustomizerDrawerProps> = ({ onAddToCart }) => {
  const [activeTab, setActiveTab] = useState<'dimensions' | 'grid' | 'materials' | 'text'>('dimensions');
  const [isAdded, setIsAdded] = useState(false);

  const {
    currentProduct,
    dimensions,
    selectedMaterial,
    selectedResin,
    telemetry,
    engravedText,
    setDimension,
    setMaterial,
    setResin,
    resetDefaults,
    setEngravedText,
    applyPreset,
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

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart();
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  return (
    <div className="w-full bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs font-sans">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div>
            <span className="text-[10px] text-[#FF6B00] uppercase tracking-wider font-bold block">
              Made-to-Measure
            </span>
            <h2 className="text-base font-bold text-[#0F172A] tracking-tight">
              {currentProduct.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={resetDefaults}
            title="Reset dimensions"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition cursor-pointer flex items-center gap-1 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Popular Presets Chips */}
        <div className="pt-3 pb-1">
          <span className="text-[11px] text-zinc-400 font-medium block mb-1.5">
            Quick Drawer Presets:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {BLUEPRINT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-zinc-100/80 hover:bg-zinc-200/80 text-zinc-700 whitespace-nowrap transition cursor-pointer"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Clean Tabs */}
        <div className="grid grid-cols-4 gap-1 my-3 p-1 bg-zinc-100 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('dimensions')}
            className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'dimensions'
                ? 'bg-white text-[#FF6B00] font-bold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Size</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('grid')}
            className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'grid'
                ? 'bg-white text-[#FF6B00] font-bold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Layout</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('materials')}
            className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'materials'
                ? 'bg-white text-[#FF6B00] font-bold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Color</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'text'
                ? 'bg-white text-[#FF6B00] font-bold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Text</span>
          </button>
        </div>

        {/* Tab 1: Dimensions */}
        {activeTab === 'dimensions' && (
          <div className="space-y-4 py-2">
            <DimensionSlider
              label="Length (Front to Back)"
              value={dimensions.length}
              min={constraints.minLengthMm}
              max={constraints.maxLengthMm}
              step={1}
              unit="mm"
              onChange={(val) => setDimension('length', val)}
            />
            <DimensionSlider
              label="Width (Left to Right)"
              value={dimensions.width}
              min={constraints.minWidthMm}
              max={constraints.maxWidthMm}
              step={1}
              unit="mm"
              onChange={(val) => setDimension('width', val)}
            />
            <DimensionSlider
              label="Height (Depth of Tray)"
              value={dimensions.height}
              min={constraints.minHeightMm}
              max={constraints.maxHeightMm}
              step={1}
              unit="mm"
              onChange={(val) => setDimension('height', val)}
            />
          </div>
        )}

        {/* Tab 2: Layout / Compartments */}
        {activeTab === 'grid' && (
          <div className="space-y-4 py-2">
            <div>
              <span className="text-xs font-bold text-zinc-800 block mb-1">
                Compartment Dividers
              </span>
              <p className="text-[11px] text-zinc-500 mb-3">
                Adjust internal dividers to organize pens, tools, or cutlery.
              </p>
            </div>

            <DimensionSlider
              label="Rows (Horizontal Bays)"
              value={dimensions.rows}
              min={1}
              max={constraints.maxRows}
              step={1}
              unit="bays"
              onChange={(val) => setDimension('rows', val)}
            />
            <DimensionSlider
              label="Columns (Vertical Bays)"
              value={dimensions.cols}
              min={1}
              max={constraints.maxCols}
              step={1}
              unit="bays"
              onChange={(val) => setDimension('cols', val)}
            />
          </div>
        )}

        {/* Tab 3: Color & Material */}
        {activeTab === 'materials' && (
          <div className="py-2">
            <MaterialSelector
              selectedFilament={selectedMaterial}
              selectedResin={selectedResin}
              onSelectFilament={setMaterial}
              onSelectResin={setResin}
            />
          </div>
        )}

        {/* Tab 4: Custom Engraving */}
        {activeTab === 'text' && (
          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-bold text-zinc-800 block mb-1">
                Custom Rim Engraving (Optional)
              </label>
              <p className="text-[11px] text-zinc-500 mb-2">
                Personalize your piece with a name, initials, or label debossed into the front rim.
              </p>
              <input
                type="text"
                maxLength={24}
                value={engravedText}
                onChange={(e) => setEngravedText(e.target.value)}
                placeholder="e.g. CALEB • DESK 01"
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-800 font-mono focus:outline-none focus:border-[#FF6B00]"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block text-right">
                {24 - (engravedText || '').length} characters left
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Summary & Add to Cart Area */}
      <div className="pt-4 mt-4 border-t border-zinc-100 space-y-3">
        {/* Pricing & Guarantee Callout */}
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-zinc-400 block text-[11px]">Total Price</span>
            <span className="text-xl font-extrabold text-[#0F172A]">
              ${telemetry.finalPriceUsd.toFixed(2)}
            </span>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Fit Guarantee
            </span>
            <span className="text-zinc-400 block text-[10px] flex items-center justify-end gap-1">
              <Truck className="w-3 h-3" /> Ships in 48h
            </span>
          </div>
        </div>

        {/* Add to Bag Button */}
        <button
          type="button"
          onClick={handleAdd}
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            isAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-[#FF6B00] hover:bg-[#ea5f00] text-white active:scale-98'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Added to Bag</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Add Custom Tray to Bag • ${telemetry.finalPriceUsd.toFixed(2)}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
