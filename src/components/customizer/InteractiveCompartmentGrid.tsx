/**
 * WAVEZLY INTERACTIVE COMPARTMENT GRID EDITOR
 * - Interactive 2D top-down mini-grid preview representing compartments (rows x cols)
 * - Tappable compartment preset cards with live SVG previews:
 *   * "Pen & Catchall [1 Long + 2 Small]"
 *   * "Equal Grid [2x3]"
 *   * "Cutlery Slots [4x1]"
 *   * "Single Open Bin [1x1]"
 * - Fractional inches support alongside millimeters: "9 1/2 in" and "240 mm"
 * - Furniture & drawer compatibility badges (IKEA Alex, US Kitchen 12"x18", Herman Miller Tu)
 */

import React, { useState } from 'react';
import {
  formatFractionalInches,
  getFurnitureCompatibility,
  VISUAL_COMPARTMENT_PRESETS,
  VisualCompartmentPreset,
} from '../../lib/compartmentGridUtils';
import { playClickSound } from '../../lib/soundEffects';
import { Check, Plus, Minus, Sparkles, Box } from 'lucide-react';

interface InteractiveCompartmentGridProps {
  rows: number;
  cols: number;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  wallThickness?: number;
  selectedHexColor?: string;
  hasResinInlay?: boolean;
  onLayoutChange: (rows: number, cols: number, isAsymmetric?: boolean) => void;
  onDimensionsChange?: (dims: { length: number; width: number; height?: number; rows?: number; cols?: number }) => void;
  className?: string;
  isCompact?: boolean;
}

export const InteractiveCompartmentGrid: React.FC<InteractiveCompartmentGridProps> = ({
  rows,
  cols,
  lengthMm,
  widthMm,
  heightMm,
  selectedHexColor = '#18181b',
  hasResinInlay = false,
  onLayoutChange,
  onDimensionsChange,
  className = '',
  isCompact: _isCompact = false,
}) => {
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(() => {
    if (rows === 2 && cols === 3) return 'equal_grid_2x3';
    if (rows === 1 && cols === 4) return 'cutlery_slots_4x1';
    if (rows === 1 && cols === 1) return 'single_open_1x1';
    if (rows === 2 && cols === 2) return 'pen_catchall';
    return null;
  });

  const formattedLength = formatFractionalInches(lengthMm);
  const formattedWidth = formatFractionalInches(widthMm);
  const compatibility = getFurnitureCompatibility(lengthMm, widthMm, heightMm);

  // Compute approximate individual cell size
  const totalDividerLength = (cols - 1) * 3;
  const totalDividerWidth = (rows - 1) * 3;
  const cellLengthMm = Math.max(15, Math.round((lengthMm - 6 - totalDividerLength) / cols));
  const cellWidthMm = Math.max(15, Math.round((widthMm - 6 - totalDividerWidth) / rows));
  const cellLengthFormatted = formatFractionalInches(cellLengthMm);
  const cellWidthFormatted = formatFractionalInches(cellWidthMm);

  // Handle Preset Click
  const handleSelectPreset = (preset: VisualCompartmentPreset) => {
    setSelectedPresetId(preset.id);
    playClickSound('tick');
    onLayoutChange(preset.rows, preset.cols, preset.isAsymmetric);

    // If preset includes recommended dimensions and callback provided, gently align
    if (preset.recommendedDims && onDimensionsChange) {
      onDimensionsChange({
        length: preset.recommendedDims.length,
        width: preset.recommendedDims.width,
        height: preset.recommendedDims.height,
        rows: preset.rows,
        cols: preset.cols,
      });
    }
  };

  // Adjust Rows
  const handleStepRows = (delta: number) => {
    const nextRows = Math.max(1, Math.min(4, rows + delta));
    if (nextRows !== rows) {
      playClickSound('snap');
      setSelectedPresetId(null);
      onLayoutChange(nextRows, cols);
    }
  };

  // Adjust Columns
  const handleStepCols = (delta: number) => {
    const nextCols = Math.max(1, Math.min(6, cols + delta));
    if (nextCols !== cols) {
      playClickSound('snap');
      setSelectedPresetId(null);
      onLayoutChange(rows, nextCols);
    }
  };

  // Quick 1-click popular furniture standard selector
  const handleApplyFurnitureFit = (presetType: 'ikea_alex' | 'us_kitchen' | 'herman_miller_tu') => {
    playClickSound('success');
    if (!onDimensionsChange) return;

    if (presetType === 'ikea_alex') {
      onDimensionsChange({ length: 240, width: 145, height: 50, rows: 2, cols: 3 });
      setSelectedPresetId('equal_grid_2x3');
    } else if (presetType === 'us_kitchen') {
      onDimensionsChange({ length: 250, width: 180, height: 45, rows: 1, cols: 4 });
      setSelectedPresetId('cutlery_slots_4x1');
    } else if (presetType === 'herman_miller_tu') {
      onDimensionsChange({ length: 220, width: 160, height: 45, rows: 2, cols: 2 });
      setSelectedPresetId('pen_catchall');
    }
  };

  const isLightColor = selectedHexColor === '#ece5db' || selectedHexColor === '#d6cec2';

  return (
    <div className={`space-y-4 font-sans ${className}`}>
      {/* ========================================================= */}
      {/* 1. FURNITURE COMPATIBILITY BADGE & 1-CLICK VERIFIED FITS */}
      {/* ========================================================= */}
      <div className="rounded-xl border border-orange-200/90 dark:border-orange-950/60 bg-gradient-to-r from-orange-50/70 via-amber-50/40 to-white dark:from-orange-950/30 dark:via-zinc-900 dark:to-zinc-900 p-3 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 tracking-tight">
              {compatibility.badge}
            </span>
          </div>

          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 shadow-2xs">
            {formattedLength.fractionOnly} × {formattedWidth.fractionOnly}
          </span>
        </div>

        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 leading-snug">
          {compatibility.clearanceNote}
        </p>

        {/* 1-Click Popular Furniture Quick-Select Chips */}
        <div className="mt-2.5 pt-2 border-t border-orange-200/50 dark:border-zinc-800 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Quick Fit:
          </span>

          <button
            type="button"
            onClick={() => handleApplyFurnitureFit('ikea_alex')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition cursor-pointer ${
              compatibility.id === 'ikea_alex'
                ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-2xs'
                : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-orange-300'
            }`}
          >
            IKEA Alex (240×145mm)
          </button>

          <button
            type="button"
            onClick={() => handleApplyFurnitureFit('us_kitchen')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition cursor-pointer ${
              compatibility.id === 'us_kitchen'
                ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-2xs'
                : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-orange-300'
            }`}
          >
            US Kitchen Standard (12"×18")
          </button>

          <button
            type="button"
            onClick={() => handleApplyFurnitureFit('herman_miller_tu')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition cursor-pointer ${
              compatibility.id === 'herman_miller_tu'
                ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-2xs'
                : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-orange-300'
            }`}
          >
            Herman Miller Tu
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. INTERACTIVE 2D TOP-DOWN COMPARTMENT MINI-GRID PREVIEW  */}
      {/* ========================================================= */}
      <div className="bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-4 space-y-3 shadow-2xs relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
              Top-Down Compartment Blueprint
            </span>
          </div>

          <span className="text-[11px] font-mono text-[#FF6B00] font-bold">
            {rows} {rows === 1 ? 'Row' : 'Rows'} × {cols} {cols === 1 ? 'Col' : 'Cols'} ({rows * cols} Bays)
          </span>
        </div>

        {/* Scaled Top-Down 2D Floorplan Canvas */}
        <div className="relative p-4 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200/80 dark:border-zinc-800 flex flex-col items-center justify-center min-h-[190px] overflow-hidden select-none">
          {/* Subtle Blueprint Drafting Matrix */}
          <div
            className="absolute inset-0 opacity-[0.04] dark:opacity-[0.10] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #71717a 1px, transparent 1px)',
              backgroundSize: '14px 14px',
            }}
          />

          {/* Exterior Width Bracket (Left) */}
          <div className="absolute left-1.5 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-mono text-zinc-400 font-semibold tracking-tight whitespace-nowrap">
            {formattedWidth.combinedShort}
          </div>

          {/* Exterior Length Bracket (Top) */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-mono text-zinc-400 font-semibold tracking-tight">
            {formattedLength.combinedShort}
          </div>

          {/* Physical Organizer Tray 2D Model */}
          <div
            className="w-full max-w-[260px] aspect-[4/3] rounded-2xl p-2 shadow-md border-2 transition-all flex flex-col justify-between relative mt-2 mb-1"
            style={{
              backgroundColor: selectedHexColor,
              borderColor: isLightColor ? '#a1a1aa' : '#3f3f46',
            }}
          >
            {/* Grid Bays Container */}
            <div
              className="w-full h-full grid gap-1.5 p-1 rounded-xl bg-black/10 dark:bg-black/25"
              style={{
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: rows * cols }).map((_, index) => {
                const isHovered = hoveredCell === index;
                return (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredCell(index)}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`rounded-lg transition-all flex flex-col items-center justify-center relative cursor-pointer border ${
                      isHovered
                        ? 'ring-2 ring-[#FF6B00] scale-[1.02] z-10'
                        : ''
                    }`}
                    style={{
                      backgroundColor: hasResinInlay
                        ? 'rgba(14, 165, 233, 0.35)'
                        : isLightColor
                        ? 'rgba(255, 255, 255, 0.85)'
                        : 'rgba(24, 24, 27, 0.70)',
                      borderColor: hasResinInlay
                        ? 'rgba(2, 132, 199, 0.50)'
                        : isHovered
                        ? '#FF6B00'
                        : isLightColor
                        ? 'rgba(0,0,0,0.15)'
                        : 'rgba(255,255,255,0.12)',
                    }}
                  >
                    {/* Chamber Index & Sizing */}
                    <span
                      className={`text-[9px] font-mono font-bold leading-none ${
                        isLightColor ? 'text-zinc-800' : 'text-zinc-200'
                      }`}
                    >
                      #{index + 1}
                    </span>

                    {/* Show approximate cell size on hover or on roomy grids */}
                    {rows * cols <= 6 && (
                      <span
                        className={`text-[8px] font-mono mt-0.5 opacity-75 leading-none ${
                          isLightColor ? 'text-zinc-600' : 'text-zinc-400'
                        }`}
                      >
                        {cellLengthMm}×{cellWidthMm}mm
                      </span>
                    )}

                    {hasResinInlay && (
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-2xs mt-0.5" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Chamber Dimensions Tooltip / Readout */}
          <div className="mt-1 flex items-center gap-2 text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
            <span>Each Bay: ~{cellLengthFormatted.combinedShort} × {cellWidthFormatted.fractionalInches}</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Drop-In Ready
            </span>
          </div>
        </div>

        {/* Quick Stepper Row & Col Controls */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Row Stepper */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Rows: <strong className="text-[#FF6B00]">{rows}</strong>
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleStepRows(-1)}
                disabled={rows <= 1}
                title="Decrease rows"
                className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-100 flex items-center justify-center disabled:opacity-30 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleStepRows(1)}
                disabled={rows >= 4}
                title="Increase rows"
                className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-100 flex items-center justify-center disabled:opacity-30 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Col Stepper */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Columns: <strong className="text-[#FF6B00]">{cols}</strong>
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleStepCols(-1)}
                disabled={cols <= 1}
                title="Decrease columns"
                className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-100 flex items-center justify-center disabled:opacity-30 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleStepCols(1)}
                disabled={cols >= 6}
                title="Increase columns"
                className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-100 flex items-center justify-center disabled:opacity-30 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. TAPPABLE COMPARTMENT PRESET CARDS WITH LIVE SVG PREVIEWS*/}
      {/* ========================================================= */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 tracking-tight flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
            Compartment Layout Presets
          </span>
          <span className="text-[10px] text-zinc-400">Tap to apply layout</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {VISUAL_COMPARTMENT_PRESETS.map((preset) => {
            const isSelected =
              selectedPresetId === preset.id ||
              (!selectedPresetId &&
                rows === preset.rows &&
                cols === preset.cols &&
                (preset.id !== 'pen_catchall' || (rows === 2 && cols === 2)));

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`group relative flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#FF6B00] bg-orange-50/70 dark:bg-orange-950/25 ring-1.5 ring-[#FF6B00] shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                }`}
              >
                {/* SVG Live Graphic Preview */}
                <div className="w-full h-14 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 p-1.5 mb-2 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center transition-transform group-hover:scale-[1.02]">
                  {/* Pen & Catchall [1 Long + 2 Small] */}
                  {preset.id === 'pen_catchall' && (
                    <svg viewBox="0 0 100 60" className="w-full h-full">
                      {/* Outer Rounded Tray */}
                      <rect x="2" y="2" width="96" height="56" rx="6" fill={selectedHexColor} stroke={isLightColor ? '#a1a1aa' : '#52525b'} strokeWidth="1.5" />
                      {/* Top Long Pen Slot */}
                      <rect x="6" y="6" width="88" height="20" rx="3" fill={isLightColor ? '#ffffff' : '#27272a'} opacity="0.9" />
                      {/* Bottom Catchall Slot 1 */}
                      <rect x="6" y="30" width="42" height="24" rx="3" fill={isLightColor ? '#ffffff' : '#27272a'} opacity="0.9" />
                      {/* Bottom Catchall Slot 2 */}
                      <rect x="52" y="30" width="42" height="24" rx="3" fill={isLightColor ? '#ffffff' : '#27272a'} opacity="0.9" />
                    </svg>
                  )}

                  {/* Equal Grid [2x3] */}
                  {preset.id === 'equal_grid_2x3' && (
                    <svg viewBox="0 0 100 60" className="w-full h-full">
                      <rect x="2" y="2" width="96" height="56" rx="6" fill={selectedHexColor} stroke={isLightColor ? '#a1a1aa' : '#52525b'} strokeWidth="1.5" />
                      {/* 2 Rows x 3 Cols */}
                      <rect x="6" y="6" width="26" height="22" rx="3" fill={isLightColor ? '#ffffff' : '#27272a'} opacity="0.9" />
                      <rect x="37" y="6" width="26" height="22" rx="3" fill={isLightColor ? '#ffffff' : '#27272a'} opacity="0.9" />
                      <rect x="68" y="6" width="26" height="22" rx="3" fill={isLightColor ? '#ffffff' : '#27272a'} opacity="0.9" />
                      <rect x="6" y="32" width="26" height="22" rx="3" fill={isLightColor ? '#ffffff' : '#27272a'} opacity="0.9" />
                      <rect x="37" y="32" width="26" height="22" rx="3" fill={isLightColor ? '#ffffff' : '#27272a'} opacity="0.9" />
                      <rect x="68" y="32" width="26" height="22" rx="3" fill={isLightColor ? '#ffffff' : '#27272a'} opacity="0.9" />
                    </svg>
                  )}

                  {/* Cutlery Slots [4x1] */}
                  {preset.id === 'cutlery_slots_4x1' && (
                    <svg viewBox="0 0 100 60" className="w-full h-full">
                      <rect x="2" y="2" width="96" height="56" rx="6" fill={selectedHexColor} stroke={isLightColor ? '#a1a1aa' : '#52525b'} strokeWidth="1.5" />
                      {/* 4 Vertical Columns */}
                      <rect x="6" y="6" width="19" height="48" rx="3" fill={isLightColor ? '#ffffff' : '#27272a'} opacity="0.9" />
                      <rect x="29" y="6" width="19" height="48" rx="3" fill={isLightColor ? '#ffffff' : '#27272a'} opacity="0.9" />
                      <rect x="52" y="6" width="19" height="48" rx="3" fill={isLightColor ? '#ffffff' : '#27272a'} opacity="0.9" />
                      <rect x="75" y="6" width="19" height="48" rx="3" fill={isLightColor ? '#ffffff' : '#27272a'} opacity="0.9" />
                    </svg>
                  )}

                  {/* Single Open Bin [1x1] */}
                  {preset.id === 'single_open_1x1' && (
                    <svg viewBox="0 0 100 60" className="w-full h-full">
                      <rect x="2" y="2" width="96" height="56" rx="6" fill={selectedHexColor} stroke={isLightColor ? '#a1a1aa' : '#52525b'} strokeWidth="1.5" />
                      {/* 1 Open Cavity */}
                      <rect x="6" y="6" width="88" height="48" rx="4" fill={isLightColor ? '#ffffff' : '#27272a'} opacity="0.9" stroke="#FF6B00" strokeWidth="1" strokeDasharray="3 3" />
                    </svg>
                  )}
                </div>

                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {preset.title}
                  </span>
                  <span
                    className={`text-[8px] font-bold uppercase px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-[#FF6B00] text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {preset.badge}
                  </span>
                </div>

                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1 leading-tight">
                  {preset.subtitle}
                </span>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#FF6B00] text-white flex items-center justify-center shadow-2xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
