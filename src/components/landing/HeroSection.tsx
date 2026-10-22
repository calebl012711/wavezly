/**
 * FORMGRID INDUSTRIAL HERO SECTION
 * High-impact typography, value telemetry, and live interactive 3D showcase
 */

import React from 'react';
import { LiveShowcase } from './LiveShowcase';
import { ArrowRight, Box, Cpu, CheckCircle2, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  onLaunchStudio: () => void;
  onExploreCatalog: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onLaunchStudio,
  onExploreCatalog,
}) => {
  return (
    <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Micro Precision Grid Accents */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#18181b15_1px,transparent_1px),linear-gradient(to_bottom,#18181b15_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Industrial Copy & Telemetry */}
        <div className="lg:col-span-6 space-y-6">
          {/* Top Status Pill */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-surface border border-surface-border text-xs font-mono text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-signal-orange" />
            <span className="text-signal-orange font-semibold">FORMGRID OS 3.4</span>
            <span className="text-zinc-600">/</span>
            <span>AUTONOMOUS PRINT FARM PIPELINE</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-precision-white leading-[1.08]">
            Bespoke Desktop Architecture.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-signal-orange to-amber-500">
              Engineered On-Demand.
            </span>
          </h1>

          {/* Value Proposition Prose */}
          <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
            Eliminate generic plastic clutter. Parametrically synthesize organizers tailored to your exact drawer millimeters in real-time WebGL, fused with instant-ship domestic hardware.
          </p>

          {/* Engineering Value Bullet Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-mono text-xs text-zinc-300">
            <div className="flex items-center space-x-2 bg-surface/60 p-2 rounded border border-zinc-800/80">
              <CheckCircle2 className="w-4 h-4 text-signal-lime flex-shrink-0" />
              <span>±0.25mm Laser-Gauge Tolerances</span>
            </div>
            <div className="flex items-center space-x-2 bg-surface/60 p-2 rounded border border-zinc-800/80">
              <CheckCircle2 className="w-4 h-4 text-signal-lime flex-shrink-0" />
              <span>Zero-Waste On-Demand Slicing</span>
            </div>
            <div className="flex items-center space-x-2 bg-surface/60 p-2 rounded border border-zinc-800/80">
              <CheckCircle2 className="w-4 h-4 text-signal-cyan flex-shrink-0" />
              <span>Optical Resin Inlay Pockets</span>
            </div>
            <div className="flex items-center space-x-2 bg-surface/60 p-2 rounded border border-zinc-800/80">
              <CheckCircle2 className="w-4 h-4 text-signal-orange flex-shrink-0" />
              <span>Bifurcated 2–4 Day Domestic Ship</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              type="button"
              onClick={onLaunchStudio}
              className="py-3.5 px-6 rounded-lg bg-signal-orange hover:bg-orange-600 text-black font-mono font-bold text-sm tracking-wider flex items-center justify-center space-x-2 shadow-glow-orange transition"
            >
              <Box className="w-4 h-4" />
              <span>LAUNCH PARAMETRIC STUDIO</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onExploreCatalog}
              className="py-3.5 px-6 rounded-lg border border-zinc-700 bg-surface hover:bg-surface-subtle text-precision-white font-mono text-sm tracking-wider flex items-center justify-center space-x-2 transition"
            >
              <Cpu className="w-4 h-4 text-zinc-400" />
              <span>EXPLORE ALL HARDWARE</span>
            </button>
          </div>

          {/* Telemetry Ticker */}
          <div className="pt-4 border-t border-surface-border flex items-center space-x-4 font-mono text-[11px] text-zinc-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" /> Manifold Binary STL Guarantee
            </span>
            <span>•</span>
            <span>Bambu Farm Dispatched</span>
          </div>
        </div>

        {/* Right Column: Live Procedural 3D Model */}
        <div className="lg:col-span-6">
          <LiveShowcase />
        </div>
      </div>
    </section>
  );
};
