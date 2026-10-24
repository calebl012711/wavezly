/**
 * WAVEZLY INSTANT LIVE PRICE & MANUFACTURING TELEMETRY BREAKDOWN
 * - Biopolymer Mass (grams of plant-based PLA)
 * - Continuous Print Machine Time (Bambu Lab print farm)
 * - Free US Shipping Qualification on orders over $35
 * - Transparent breakdown of base setup, materials & farm compute
 */

import React, { useState } from 'react';
import { MaterialOption } from '../../types';
import { SlicingTelemetry } from '../../lib/parametricMath';
import { calculatePriceBreakdown } from '../../lib/compartmentGridUtils';
import { playClickSound } from '../../lib/soundEffects';
import {
  Truck,
  Clock,
  Layers,
  ChevronDown,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface LivePriceBreakdownProps {
  telemetry: SlicingTelemetry;
  selectedMaterial: MaterialOption;
  hasResinInlay?: boolean;
  className?: string;
}

export const LivePriceBreakdown: React.FC<LivePriceBreakdownProps> = ({
  telemetry,
  selectedMaterial,
  hasResinInlay = false,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const breakdown = calculatePriceBreakdown(telemetry, selectedMaterial, hasResinInlay);

  const toggleExpand = () => {
    playClickSound('snap');
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`space-y-2.5 font-sans ${className}`}>
      {/* ========================================================= */}
      {/* PRIMARY PRICE & FREE US SHIPPING QUALIFIER BANNER         */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              Instant Custom Price
            </span>
            <span className="text-[9px] px-1.5 py-0.2 bg-orange-100 dark:bg-orange-950/80 text-[#FF6B00] rounded font-bold uppercase tracking-wider">
              Live Calc
            </span>
          </div>

          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
              ${breakdown.finalPriceUsd.toFixed(2)}
            </span>
            <span className="text-xs text-zinc-400 font-mono">USD</span>
          </div>
        </div>

        {/* Free US Shipping on Orders Over $35 Badge */}
        <div className="text-right">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-colors ${
              breakdown.qualifiesFreeShipping
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/50'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Free US Shipping</span>
          </div>

          <span className="block text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
            {breakdown.qualifiesFreeShipping
              ? '✓ Orders over $35 ship free (Ships in 48h)'
              : breakdown.freeShippingMessage}
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ESSENTIAL TELEMETRY SUMMARY ROW                           */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 text-[11px]">
        {/* Biopolymer Mass */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-950/80 text-[#FF6B00] flex items-center justify-center shrink-0">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-zinc-500 dark:text-zinc-400 block leading-tight text-[10px]">
              Biopolymer Mass
            </span>
            <span className="font-bold text-zinc-900 dark:text-white font-mono">
              {breakdown.biopolymerMassGrams}g PLA
            </span>
          </div>
        </div>

        {/* Print Machine Time */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-zinc-500 dark:text-zinc-400 block leading-tight text-[10px]">
              Print Machine Time
            </span>
            <span className="font-bold text-zinc-900 dark:text-white font-mono">
              {breakdown.machineTimeHours}h {breakdown.machineTimeMinutes}m
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TRANSPARENT COST BREAKDOWN ACCORDION                      */}
      {/* ========================================================= */}
      <div className="pt-0.5">
        <button
          type="button"
          onClick={toggleExpand}
          className="w-full flex items-center justify-between text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition py-1 cursor-pointer"
        >
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3 text-[#FF6B00]" />
            <span>Manufacturing Price Breakdown</span>
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isExpanded ? 'rotate-180 text-[#FF6B00]' : ''
            }`}
          />
        </button>

        {isExpanded && (
          <div className="mt-2 space-y-1.5 p-3 rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-xs">
            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
              <span>Precision Setup & Calibration Base</span>
              <span className="font-mono font-medium">${breakdown.baseFeeUsd.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
              <span>
                Biopolymer Shell ({breakdown.biopolymerMassGrams}g {selectedMaterial.name})
              </span>
              <span className="font-mono font-medium">${breakdown.biopolymerCostUsd.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
              <span>
                Farm Print Time ({breakdown.machineTimeHours}h {breakdown.machineTimeMinutes}m continuous)
              </span>
              <span className="font-mono font-medium">${breakdown.machineCostUsd.toFixed(2)}</span>
            </div>

            {hasResinInlay && (
              <div className="flex items-center justify-between text-sky-600 dark:text-sky-400 font-medium">
                <span>Sound-Dampening Resin Inlay (Optional)</span>
                <span className="font-mono">+${breakdown.resinInlayCostUsd.toFixed(2)}</span>
              </div>
            )}

            <div className="pt-2 mt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between font-bold text-zinc-900 dark:text-white">
              <span>Total Custom Fabricated</span>
              <span className="font-mono text-sm text-[#FF6B00]">
                ${breakdown.finalPriceUsd.toFixed(2)} USD
              </span>
            </div>

            <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Free US Shipping Unlocked • 100% Guaranteed Fit</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
