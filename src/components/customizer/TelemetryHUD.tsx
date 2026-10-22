/**
 * FORMGRID TELEMETRY HUD OVERLAY
 * Floating industrial status pill rendering live physical metrics, extrusion time, and dynamic price
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
      <div className="flex items-center space-x-2 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-surface-border shadow-2xl text-xs font-mono">
        {/* Dimensions Badge */}
        <div className="flex items-center space-x-1 text-zinc-300">
          <Box className="w-3.5 h-3.5 text-zinc-500" />
          <span>
            {dimensions.length}×{dimensions.width}×{dimensions.height}
            <span className="text-zinc-500 text-[10px]">mm</span>
          </span>
        </div>

        <span className="text-zinc-700">•</span>

        {/* Weight Badge */}
        <div className="flex items-center space-x-1 text-zinc-300">
          <Scale className="w-3.5 h-3.5 text-zinc-500" />
          <span>
            ~{telemetry.totalWeightGrams}
            <span className="text-zinc-500 text-[10px]">g</span>
          </span>
        </div>

        <span className="text-zinc-700">•</span>

        {/* Print Duration Badge */}
        <div className="flex items-center space-x-1 text-zinc-300">
          <Clock className="w-3.5 h-3.5 text-signal-amber" />
          <span>{formatPrintTime(telemetry.estimatedPrintMinutes)}</span>
        </div>

        <span className="text-zinc-700">•</span>

        {/* Price Badge */}
        <div className="flex items-center space-x-0.5 text-signal-orange font-semibold">
          <DollarSign className="w-3.5 h-3.5" />
          <span>{telemetry.finalPriceUsd.toFixed(2)}</span>
        </div>

        {/* Expand Details Trigger */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="ml-1 p-0.5 text-zinc-500 hover:text-white transition"
          aria-label="Toggle telemetry details"
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Breakdown Drawer */}
      {expanded && (
        <div className="mt-2 w-72 bg-surface/95 backdrop-blur-md p-3 rounded-lg border border-surface-border shadow-2xl font-mono text-xs space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800 text-[11px] text-zinc-400 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Info className="w-3 h-3 text-signal-orange" /> Slicing Telemetry
            </span>
            <span>Watertight BBox</span>
          </div>

          <div className="space-y-1 text-[11px] text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-500">Plastic Volume:</span>
              <span>{telemetry.plasticVolumeCm3} cm³ ({telemetry.plasticWeightGrams}g)</span>
            </div>
            {telemetry.resinVolumeCm3 > 0 && (
              <div className="flex justify-between text-signal-cyan">
                <span>Resin Inlay:</span>
                <span>{telemetry.resinVolumeCm3} cm³ ({telemetry.resinWeightGrams}g)</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-zinc-500">Cell Inner Cavity:</span>
              <span>
                {telemetry.cellDimensions.lengthMm} × {telemetry.cellDimensions.widthMm} × {telemetry.cellDimensions.depthMm} mm
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Machine Slicing Rate:</span>
              <span>15 mm³/s (0.2mm layers)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800/80 space-y-1 text-[10px] text-zinc-400">
            <div className="flex justify-between">
              <span>Setup & Prep Base:</span>
              <span>${telemetry.baseFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Polymer Cost:</span>
              <span>${telemetry.plasticCost.toFixed(2)}</span>
            </div>
            {telemetry.resinCost > 0 && (
              <div className="flex justify-between text-signal-cyan">
                <span>Resin Inlay Cost:</span>
                <span>${telemetry.resinCost.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Farm Machine Time:</span>
              <span>${telemetry.machineHourlyCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-zinc-800 font-semibold text-signal-orange text-xs">
              <span>Total Calculated:</span>
              <span>${telemetry.finalPriceUsd.toFixed(2)} USD</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
