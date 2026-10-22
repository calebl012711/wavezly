/**
 * FORMGRID CONSUMER LUXURY HERO SECTION
 * Prioritized Light Mode, warm editorial typography, consumer benefits, and interactive 3D preview
 */

import React from 'react';
import { LiveShowcase } from './LiveShowcase';
import { ArrowRight, Sliders, ShoppingBag, CheckCircle2, ShieldCheck, Sparkles, Star, Grid } from 'lucide-react';
import { playClickSound } from '../../lib/soundEffects';

interface HeroSectionProps {
  onLaunchStudio: () => void;
  onExploreCatalog: () => void;
  onOpenDeskPlanner?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onLaunchStudio,
  onExploreCatalog,
  onOpenDeskPlanner,
}) => {
  return (
    <section className="relative pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Subtle Warm Porcelain Grid Pattern */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Consumer Luxury Editorial Copy */}
        <div className="lg:col-span-6 space-y-6">
          {/* Trust Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/50 text-xs font-sans text-orange-800 dark:text-orange-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-signal-orange animate-pulse" />
            <span className="font-semibold tracking-wide">PRECISION DESK GOODS</span>
            <span className="text-orange-300 dark:text-orange-700">•</span>
            <span>MADE TO ORDER IN 48 HOURS</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950 dark:text-white leading-[1.08] font-sans">
            The perfect desk, made to your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              exact millimeters.
            </span>
          </h1>

          {/* Consumer Value Proposition */}
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 font-normal leading-relaxed">
            Eliminate drawer clutter forever. Custom 3D-crafted trays tailored to your workspace down to the millimeter, paired with curated studio accessories and fast domestic delivery.
          </p>

          {/* Consumer Benefit Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-zinc-700 dark:text-zinc-300">
            <div className="flex items-center space-x-2.5 bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-medium">Tailored Drawer Fit (±0.25mm)</span>
            </div>
            <div className="flex items-center space-x-2.5 bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-medium">Silky Matte Bio-Polymer</span>
            </div>
            <div className="flex items-center space-x-2.5 bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-sm">
              <Sparkles className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span className="font-medium">Acoustic Resin Base Inlay</span>
            </div>
            <div className="flex items-center space-x-2.5 bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-sky-600 flex-shrink-0" />
              <span className="font-medium">Free 30-Day Fit Guarantee</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-3">
            <button
              type="button"
              onClick={() => {
                playClickSound('snap');
                onLaunchStudio();
              }}
              className="py-3.5 px-6 rounded-xl bg-signal-orange hover:bg-orange-600 text-white font-sans font-semibold text-sm tracking-wide flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>Customize Your Tray</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound('tick');
                onExploreCatalog();
              }}
              className="py-3.5 px-6 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-sans font-medium text-sm tracking-wide flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-zinc-500" />
              <span>Explore Collection</span>
            </button>
          </div>

          {/* Spatial Desk Planner Hero Banner Link */}
          {onOpenDeskPlanner && (
            <div
              onClick={() => {
                playClickSound('snap');
                onOpenDeskPlanner();
              }}
              className="p-3.5 rounded-xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-300/40 dark:border-orange-800/40 flex items-center justify-between cursor-pointer hover:border-signal-orange transition-all group shadow-xs"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-signal-orange text-white flex items-center justify-center font-bold shadow-xs">
                  <Grid className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-xs text-zinc-900 dark:text-white group-hover:text-signal-orange transition-colors">
                      Interactive 2D Desk Planner
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-signal-orange/15 text-signal-orange font-mono font-bold">
                      NEW CAD
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Arrange modular trays, check clearance & order your custom bundle in 1 click
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-signal-orange group-hover:translate-x-1 transition-transform" />
            </div>
          )}

          {/* Social Proof Bar */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center space-x-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 ml-1">4.9/5</span>
            </div>
            <span>•</span>
            <span>Over 1,840+ workspaces organized</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Free US shipping over $60</span>
          </div>
        </div>

        {/* Right Column: Live Interactive 3D Model with Light Studio Styling */}
        <div className="lg:col-span-6">
          <LiveShowcase />
        </div>
      </div>
    </section>
  );
};
