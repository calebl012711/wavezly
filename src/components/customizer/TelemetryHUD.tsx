/**
 * WAVEZLY CUSTOM 3D STUDIO - SPECIFICATION BADGE
 * Clean consumer status tag rendering dimensions and current price.
 * Replaced developer telemetry with friendly shopping metrics.
 */

import React from 'react';
import { SlicingTelemetry } from '../../lib/parametricMath';
import { ParametricOrganizerDimensions } from '../../types';
import { Box, Truck } from 'lucide-react';

interface TelemetryHUDProps {
  dimensions: ParametricOrganizerDimensions;
  telemetry: SlicingTelemetry;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({
  dimensions,
  telemetry,
}) => {
  const inchesLength = (dimensions.length / 25.4).toFixed(1);
  const inchesWidth = (dimensions.width / 25.4).toFixed(1);
  const inchesHeight = (dimensions.height / 25.4).toFixed(1);

  return (
    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex flex-col items-end gap-1.5 pointer-events-none max-w-[calc(100%-6rem)] xs:max-w-[calc(100%-7rem)] sm:max-w-none">
      {/* Primary Pill */}
      <div className="flex items-center gap-1.5 sm:gap-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-zinc-200/90 dark:border-zinc-700 shadow-sm text-xs font-sans pointer-events-auto">
        {/* Dimensions */}
        <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 font-semibold text-[11px] sm:text-xs min-w-0">
          <Box className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
          <span className="truncate">
            {dimensions.length}×{dimensions.width}×{dimensions.height} mm
          </span>
          <span className="text-zinc-400 font-normal hidden md:inline">
            ({inchesLength}″ × {inchesWidth}″ × {inchesHeight}″)
          </span>
        </div>

        <span className="text-zinc-300 dark:text-zinc-600">•</span>

        {/* 48h Dispatch */}
        <div className="hidden sm:flex items-center gap-1 text-zinc-600 dark:text-zinc-400 text-[11px] shrink-0">
          <Truck className="w-3 h-3 text-zinc-400 shrink-0" />
          <span>Ships in 48h</span>
        </div>

        <span className="hidden sm:inline text-zinc-300 dark:text-zinc-600">•</span>

        {/* Price */}
        <div className="text-[#0F172A] dark:text-white font-extrabold text-xs sm:text-sm shrink-0">
          ${telemetry.finalPriceUsd.toFixed(2)}
        </div>
      </div>
    </div>
  );
};
