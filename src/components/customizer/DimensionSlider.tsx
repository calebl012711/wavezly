/**
 * WAVEZLY CUSTOM 3D STUDIO - TACTILE INDUSTRIAL DIMENSION SLIDER
 * Precision millimeter control with direct numeric input and micro-steppers
 */

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { playClickSound } from '../../lib/soundEffects';

interface DimensionSliderProps {
  label: string;
  axisTag?: string; // e.g. "X-AXIS"
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
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
  onChange,
  description,
}) => {
  const handleDecrement = () => {
    const newVal = Math.max(min, Number((value - step).toFixed(1)));
    playClickSound('tick');
    onChange(newVal);
  };

  const handleIncrement = () => {
    const newVal = Math.min(max, Number((value + step).toFixed(1)));
    playClickSound('tick');
    onChange(newVal);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      playClickSound('tick');
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

        {/* Tactile Numeric Readout Box */}
        <div className="flex items-center space-x-1 bg-white dark:bg-zinc-950 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-2xs">
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
        </div>
      </div>

      {/* Slider Bar & Micro Increment Buttons */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-2xs"
          aria-label="Decrease value"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <div className="relative flex-1 flex items-center">
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
            className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF6B00] focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-2xs"
          aria-label="Increase value"
        >
          <Plus className="w-3.5 h-3.5" />
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
