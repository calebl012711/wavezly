/**
 * FORMGRID TELEMETRY HUD OVERLAY
 * Floating status pill rendering live physical metrics, extrusion time, and dynamic price
 * Prioritized Light Mode support with crisp backdrop blur
 */

import React, { useState } from 'react';
import { SlicingTelemetry, formatPrintTime } from '../../lib/parametricMath';
import { ParametricOrganizerDimensions } from '../../types';
import { Info, Box, Scale, Clock, DollarSign, ChevronUp, ChevronDown } from 'lucide-react';

interface TelemetryHUDProps {
  dimensions: ParametricOrganizerDimensions;
  telemetry: SlicingTelemetry;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({
  dimensions,
  telemetry,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col items-end">
      {/* Primary Floating Telemetry Pill */}
      <div className="flex items-center space-x-2.5 bg-white/90 dark:bg-black/85 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-200/90 dark:border-zinc-800 shadow-md text-xs font-sans">
        {/* Dimensions Badge */}
        <div className="flex items-center space-x-1.5 text-zinc-800 dark:text-zinc-200 font-medium">
          <Box className="w-3.5 h-3.5 text-zinc-400" />
          <span>
            {dimensions.length}×{dimensions.width}×{dimensions.height}
            <span className="text-zinc-400 text-[10px] ml-0.5">mm</span>
          </span>
        </div>

        <span className="text-zinc-300 dark:text-zinc-700">•</span>

        {/* Weight Badge */}
        <div className="flex items-center space-x-1.5 text-zinc-800 dark:text-zinc-200 font-medium">
          <Scale className="w-3.5 h-3.5 text-zinc-400" />
          <span>
            ~{telemetry.totalWeightGrams}
            <span className="text-zinc-400 text-[10px] ml-0.5">g</span>
          </span>
        </div>

        <span className="text-zinc-300 dark:text-zinc-700">•</span>

        {/* Print Duration Badge */}
        <div className="flex items-center space-x-1.5 text-zinc-800 dark:text-zinc-200 font-medium">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>{formatPrintTime(telemetry.estimatedPrintMinutes)}</span>
        </div>

        <span className="text-zinc-300 dark:text-zinc-700">•</span>

        {/* Price Badge */}
        <div className="flex items-center space-x-0.5 text-orange-600 font-bold">
          <DollarSign className="w-3.5 h-3.5" />
          <span>{telemetry.finalPriceUsd.toFixed(2)}</span>
        </div>

        {/* Expand Details Trigger */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="ml-1 p-0.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
          aria-label="Toggle telemetry details"
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Breakdown Drawer */}
      {expanded && (
        <div className="mt-2 w-72 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl text-xs space-y-2.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">
            <span className="flex items-center gap-1.5 text-orange-600">
              <Info className="w-3.5 h-3.5" /> Physical Specifications
            </span>
            <span>Watertight Mesh</span>
          </div>

          <div className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-500">Biopolymer Volume:</span>
              <span className="font-medium">{telemetry.plasticVolumeCm3} cm³ ({telemetry.plasticWeightGrams}g)</span>
            </div>
            {telemetry.resinVolumeCm3 > 0 && (
              <div className="flex justify-between text-sky-600 dark:text-sky-400">
                <span>Resin Inlay:</span>
                <span className="font-medium">{telemetry.resinVolumeCm3} cm³ ({telemetry.resinWeightGrams}g)</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-zinc-500">Compartment Cavity:</span>
              <span className="font-medium">
                {telemetry.cellDimensions.lengthMm} × {telemetry.cellDimensions.widthMm} × {telemetry.cellDimensions.depthMm} mm
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Infill Density:</span>
              <span className="font-medium">18% Gyroid Solid</span>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between text-[11px] text-zinc-500">
            <span>Dimensional Caliber:</span>
            <span className="text-emerald-600 font-semibold">±0.25mm Guaranteed</span>
          </div>
        </div>
      )}
    </div>
  );
};
