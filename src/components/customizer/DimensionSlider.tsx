/**
 * FORMGRID TACTILE INDUSTRIAL DIMENSION SLIDER
 * Precision millimeter control with direct numeric input and micro-steppers
 */

import React from 'react';
import { Minus, Plus } from 'lucide-react';

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
    onChange(newVal);
  };

  const handleIncrement = () => {
    const newVal = Math.min(max, Number((value + step).toFixed(1)));
    onChange(newVal);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      onChange(clamped);
    }
  };

  return (
    <div className="group p-3 bg-surface rounded-lg border border-surface-border hover:border-zinc-700 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {axisTag && (
            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono font-semibold text-signal-orange tracking-wider">
              {axisTag}
            </span>
          )}
          <span className="text-xs font-medium text-zinc-300 uppercase tracking-wider">
            {label}
          </span>
        </div>

        {/* Tactile Numeric Readout Box */}
        <div className="flex items-center space-x-1 bg-black/60 px-2 py-0.5 rounded border border-zinc-800">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleInputChange}
            className="w-12 bg-transparent text-right font-mono text-xs text-precision-white focus:outline-none focus:text-signal-orange"
          />
          <span className="font-mono text-[11px] text-zinc-500">{unit}</span>
        </div>
      </div>

      {/* Slider Bar & Micro Increment Buttons */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
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
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-signal-orange focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
          aria-label="Increase value"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {description && (
        <p className="mt-1.5 font-mono text-[10px] text-zinc-500">
          {description}
        </p>
      )}
    </div>
  );
};
