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
    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex flex-col items-end gap-1.5 pointer-events-none">
      {/* Primary Pill */}
      <div className="flex items-center gap-2 sm:gap-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 sm:py-2 rounded-full border border-zinc-200/90 shadow-sm text-xs font-sans pointer-events-auto">
        {/* Dimensions */}
        <div className="flex items-center gap-1.5 text-zinc-800 font-semibold text-[11px] sm:text-xs">
          <Box className="w-3.5 h-3.5 text-[#FF6B00]" />
          <span>
            {dimensions.length}×{dimensions.width}×{dimensions.height} mm
          </span>
          <span className="text-zinc-400 font-normal hidden sm:inline">
            ({inchesLength}″ × {inchesWidth}″ × {inchesHeight}″)
          </span>
        </div>

        <span className="text-zinc-300">•</span>

        {/* 48h Dispatch */}
        <div className="hidden sm:flex items-center gap-1 text-zinc-600 text-[11px]">
          <Truck className="w-3 h-3 text-zinc-400" />
          <span>Ships in 48h</span>
        </div>

        <span className="hidden sm:inline text-zinc-300">•</span>

        {/* Price */}
        <div className="text-[#0F172A] font-extrabold text-xs sm:text-sm">
          ${telemetry.finalPriceUsd.toFixed(2)}
        </div>
      </div>
    </div>
  );
};
