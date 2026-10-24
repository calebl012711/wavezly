/**
 * WAVEZLY CUSTOM 3D STUDIO - TACTILE INDUSTRIAL DIMENSION SLIDER
 * Precision millimeter control with direct numeric input and micro-steppers
 */

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { playClickSound, playSnapPresetSound } from '../../lib/soundEffects';

interface DimensionSliderProps {
  label: string;
  axisTag?: string; // e.g. "X-AXIS"
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  showInches?: boolean;
  secondaryDisplay?: string;
  onChange: (val: number) => void;
  description?: string;
}

export const DimensionSlider: React.FC<DimensionSliderProps> = ({
  label,
  axisTag,
  value,
  min,
  max,
  step = 1,
  unit = 'mm',
  showInches = false,
  secondaryDisplay,
  onChange,
  description,
}) => {
  const inchesDisplay = showInches || unit === 'mm' ? `${(value / 25.4).toFixed(1)} in` : null;
  const handleDecrement = () => {
    const newVal = Math.max(min, Number((value - step).toFixed(1)));
    playSnapPresetSound();
    onChange(newVal);
  };

  const handleIncrement = () => {
    const newVal = Math.min(max, Number((value + step).toFixed(1)));
    playSnapPresetSound();
    onChange(newVal);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      playSnapPresetSound();
      onChange(clamped);
    }
  };

  return (
    <div className="group p-3 bg-slate-50/70 dark:bg-zinc-900/60 rounded-xl border border-slate-200/80 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-all shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {axisTag && (
            <span className="px-1.5 py-0.5 rounded bg-orange-50 dark:bg-orange-950/60 text-[10px] font-mono font-semibold text-[#FF6B00] dark:text-[#FF7A00] tracking-wider border border-orange-200/60 dark:border-orange-900/40">
              {axisTag}
            </span>
          )}
          <span className="text-xs font-semibold text-[#0F172A] dark:text-zinc-200 tracking-wide">
            {label}
          </span>
        </div>

        {/* Tactile Numeric Readout Box with Dual mm / in Display */}
        <div className="flex items-center space-x-1.5 bg-white dark:bg-zinc-950 px-2.5 py-1 sm:py-0.5 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-2xs min-h-[36px] sm:min-h-0">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleInputChange}
            className="w-12 bg-transparent text-right font-mono text-xs text-[#0F172A] dark:text-white font-bold focus:outline-none focus:text-[#FF6B00]"
          />
          <span className="font-mono text-[11px] text-slate-400 dark:text-zinc-500">{unit}</span>
          {(secondaryDisplay || inchesDisplay) && (
            <span className="font-sans text-[10px] text-zinc-400 dark:text-zinc-500 border-l border-zinc-200 dark:border-zinc-700 pl-1.5">
              {secondaryDisplay || inchesDisplay}
            </span>
          )}
        </div>
      </div>

      {/* Slider Bar & Micro Increment Buttons with 44x44px Mobile Tap Targets */}
      <div className="flex items-center space-x-2.5 sm:space-x-3">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-2xs shrink-0 cursor-pointer"
          aria-label="Decrease value"
        >
          <Minus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
        </button>

        <div className="relative flex-1 flex items-center py-2">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => {
              playClickSound('tick');
              onChange(parseFloat(e.target.value));
            }}
            className="w-full h-2 sm:h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF6B00] focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-2xs shrink-0 cursor-pointer"
          aria-label="Increase value"
        >
          <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>

      {description && (
        <p className="mt-1.5 font-sans text-[11px] text-slate-500 dark:text-zinc-400">
          {description}
        </p>
      )}
    </div>
  );
};
