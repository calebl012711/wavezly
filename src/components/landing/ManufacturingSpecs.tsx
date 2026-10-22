/**
 * FORMGRID CRAFTSMANSHIP & HOW IT'S MADE
 * Prioritized Light Mode, consumer-friendly craftsmanship storytelling, and quality guarantees
 */

import React from 'react';
import { Layers, ShieldCheck, HeartHandshake, Sparkles, CheckCircle2, Sliders } from 'lucide-react';

export const ManufacturingSpecs: React.FC = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-200 dark:border-zinc-800">
      {/* Section Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">
          <HeartHandshake className="w-4 h-4" />
          <span>HOW IT'S CRAFTED</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white font-sans">
          Modern Precision, Built for Your Entire Home
        </h2>
        <p className="text-base text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
          How our on-demand studio transforms your custom measurements into velvety, made-to-measure home organizers in under 48 hours.
        </p>
      </div>

      {/* Grid of 4 Craftsmanship Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Step 1 */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-signal-orange">
              <Sliders className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 tracking-wider uppercase block">
              Step 01
            </span>
            <h3 className="text-base font-semibold text-zinc-950 dark:text-white">
              Bespoke Dimensions
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              Enter the exact measurements of your kitchen drawer, vanity, nightstand, or desk. Our 3D studio generates a custom preview with millimeter precision.
            </p>
          </div>
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 space-y-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>±0.25mm Fit Tolerance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant Real-Time 3D View</span>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase block">
              Step 02
            </span>
            <h3 className="text-base font-semibold text-zinc-950 dark:text-white">
              Studio 3D Fabrication
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              Crafted in our domestic micro-studios using high-grade matte biopolymer with seamless layer transitions and solid structural walls.
            </p>
          </div>
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 space-y-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Renewable Bio-Polymer</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Silky Micro-Texture Finish</span>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 tracking-wider uppercase block">
              Step 03
            </span>
            <h3 className="text-base font-semibold text-zinc-950 dark:text-white">
              Acoustic Dampening
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              Optional optical-grade resin is poured flush into the tray base to absorb impact sound when you set down keys, metal pens, and tools.
            </p>
          </div>
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 space-y-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Whisper-Quiet Drops</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Glass-Smooth Base Inlay</span>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase block">
              Step 04
            </span>
            <h3 className="text-base font-semibold text-zinc-950 dark:text-white">
              Hand Inspected & Shipped
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              Every unit is caliper-measured, hand-buffed, and shipped in recycled packaging directly from our domestic US hubs in 2–4 days.
            </p>
          </div>
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 space-y-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>30-Day Guaranteed Fit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>2–4 Day Domestic Transit</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
