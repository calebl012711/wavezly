/**
 * FORMGRID BEFORE / AFTER DRAWER TRANSFORMATION SLIDER
 * Interactive tactile split-screen slider comparing:
 * - LEFT: "Before: The Chaos Drawer" (disorganized, loose items sliding around, tangled cords, scratched watches, wasted gaps)
 * - RIGHT: "After: The Custom Snug Fit" (clean, satisfying compartmentalization, velvet matte finish, zero rattling, every item in its dedicated home)
 *
 * Engineered with:
 * - High visual polish: Warm light porcelain aesthetic, clean typography, sub-millimeter architectural SVG drawer cutaway
 * - Smooth pointer/touch dragging with pointer capture & keyboard accessibility (Arrow keys, Home, End)
 * - Tactile micro-sound ratcheting (playClickSound('tick'))
 * - Live percentage readout & split-view preset switches
 * - Telemetry performance comparison cards (Space Density, Rattle Decibels, Retrieval Speed, Finish Safety)
 * - High-converting CTA button below: "Fix Your Drawer in 60 Seconds" that opens the 3D customizer
 */

import React, { useState, useRef, useCallback } from 'react';
import { playClickSound } from '../../lib/soundEffects';
import {
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Volume2,
  VolumeX,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  MoveHorizontal,
  Zap,
} from 'lucide-react';

export interface BeforeAfterSliderProps {
  onOpenCustomizer?: () => void;
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  onOpenCustomizer,
  className = '',
}) => {
  // Slider position from 0 to 100 (50% default center split)
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<'chaos' | 'split' | 'snug'>('split');

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTickPosRef = useRef<number>(50);

  // Trigger tactile tick sound when moving across ~4% threshold intervals
  const handleTickSound = useCallback((pos: number) => {
    if (Math.abs(pos - lastTickPosRef.current) >= 4) {
      playClickSound('tick');
      lastTickPosRef.current = pos;
    }
  }, []);

  const updatePositionFromClientX = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const rawX = clientX - rect.left;
      const clampedX = Math.max(0, Math.min(rawX, rect.width));
      const percentage = Math.round((clampedX / rect.width) * 100);

      setSliderPos(percentage);
      handleTickSound(percentage);

      if (percentage <= 15) {
        setActivePreset('chaos');
      } else if (percentage >= 85) {
        setActivePreset('snug');
      } else {
        setActivePreset('split');
      }
    },
    [handleTickSound]
  );

  // Pointer event handlers with pointer capture for buttery smooth dragging
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    playClickSound('tick');
    updatePositionFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePositionFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignored if pointer capture already released
      }
    }
  };

  // Keyboard navigation for full accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let nextPos = sliderPos;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      nextPos = Math.max(0, sliderPos - 5);
      e.preventDefault();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      nextPos = Math.min(100, sliderPos + 5);
      e.preventDefault();
    } else if (e.key === 'Home') {
      nextPos = 0;
      e.preventDefault();
    } else if (e.key === 'End') {
      nextPos = 100;
      e.preventDefault();
    }

    if (nextPos !== sliderPos) {
      setSliderPos(nextPos);
      playClickSound('tick');
      if (nextPos <= 15) setActivePreset('chaos');
      else if (nextPos >= 85) setActivePreset('snug');
      else setActivePreset('split');
    }
  };

  const applyPreset = (preset: 'chaos' | 'split' | 'snug') => {
    playClickSound('snap');
    setActivePreset(preset);
    if (preset === 'chaos') setSliderPos(95); // Shows 95% Chaos on the left
    if (preset === 'split') setSliderPos(50); // 50/50 Split
    if (preset === 'snug') setSliderPos(5); // Shows 95% Snug fit on the right
  };

  const handleCtaClick = () => {
    playClickSound('snap');
    if (onOpenCustomizer) {
      onOpenCustomizer();
    } else {
      // Fallback: smooth scroll to customizer or catalog
      const customizerEl = document.getElementById('customizer-section');
      if (customizerEl) {
        customizerEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.search = '?route=customizer';
      }
    }
  };

  // Percentage calculations
  const chaosPercent = Math.round(sliderPos);
  const snugPercent = 100 - chaosPercent;

  return (
    <section
      aria-label="Interactive Drawer Transformation Before & After Slider"
      className={`py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans ${className}`}
    >
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-zinc-200/80 dark:border-zinc-800 gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VISUAL HOME TRANSFORMATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
            From Everyday Clutter to Millimeter Calm
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
            Drag the slider to see how custom organizers turn messy drawers across kitchens, vanities, and bedrooms into calm, glove-like storage.
          </p>
        </div>

        {/* Tactile Preset Pill Toggles */}
        <div className="flex items-center space-x-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 text-xs font-medium self-start md:self-end">
          <button
            type="button"
            onClick={() => applyPreset('chaos')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activePreset === 'chaos'
                ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 font-semibold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            The Chaos (Before)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('split')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activePreset === 'split'
                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            50/50 Split View
          </button>
          <button
            type="button"
            onClick={() => applyPreset('snug')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activePreset === 'snug'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-semibold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            Snug Fit (After)
          </button>
        </div>
      </div>

      {/* Main Interactive Stage Box */}
      <div className="relative rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-[#fbfbfe] to-[#f2f2f7] dark:from-[#141418] dark:to-[#0c0c0e] border border-zinc-200/90 dark:border-zinc-800 shadow-xl overflow-hidden">
        {/* Floating Top Telemetry Bar */}
        <div className="flex items-center justify-between px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400 mb-2">
          {/* Left Side Status */}
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              BEFORE: The Chaos Drawer
            </span>
            <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">•</span>
            <span className="text-zinc-500 hidden sm:inline">Rattling • Scratches • Tangled Cords</span>
          </div>

          {/* Center Telemetry Readout */}
          <div className="hidden md:flex items-center space-x-2 bg-white/80 dark:bg-zinc-800/80 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 text-[11px] font-mono">
            <span className="text-red-500 font-semibold">{chaosPercent}% Chaos</span>
            <span className="text-zinc-300 dark:text-zinc-600">/</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{snugPercent}% Snug</span>
          </div>

          {/* Right Side Status */}
          <div className="flex items-center space-x-2">
            <span className="text-zinc-500 hidden sm:inline">Velvet Matte PA12 • Zero Rattling</span>
            <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">•</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              AFTER: The Custom Snug Fit
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </div>

        {/* Interactive Viewport Canvas Frame */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="slider"
          aria-label="Comparison slider between chaotic drawer and organized SnugFit custom tray"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={sliderPos}
          className={`relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[21/11] max-h-[580px] rounded-2xl overflow-hidden select-none cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-inner border border-zinc-200/90 dark:border-zinc-800/90 ${
            isDragging ? 'cursor-grabbing' : ''
          }`}
        >
          {/* ============================================================ */}
          {/* LAYER 1: CHAOS DRAWER (BEFORE - LEFT BASE LAYER)            */}
          {/* ============================================================ */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
            }}
          >
            {/* Drawer Interior Backdrop: Scuffed natural wood with scratches & stains */}
            <div className="absolute inset-0 bg-[#e7dfd5] dark:bg-[#201d1a] overflow-hidden">
              {/* Wood grain & scratch overlay texture */}
              <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="chaos-scratches" width="120" height="120" patternUnits="userSpaceOnUse">
                    {/* Dark scratch marks */}
                    <path d="M10,20 L45,28 M20,22 L60,32 M80,85 L115,92 M5,90 L40,110" stroke="#8a7360" strokeWidth="0.8" strokeLinecap="round" />
                    <path d="M70,10 L105,40 M85,15 L110,35" stroke="#7a6350" strokeWidth="0.6" strokeLinecap="round" />
                    <circle cx="28" cy="74" r="1.5" fill="#665342" opacity="0.4" />
                    <circle cx="92" cy="62" r="2.2" fill="#665342" opacity="0.3" />
                    <circle cx="55" cy="45" r="1" fill="#665342" opacity="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#chaos-scratches)" />
              </svg>

              {/* Scuff and gouge vector lines */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[28%] left-[22%] w-32 h-0.5 bg-[#826b58]/50 rotate-[-12deg] rounded-full blur-[0.4px]" />
                <div className="absolute top-[65%] left-[45%] w-24 h-0.5 bg-[#826b58]/40 rotate-[24deg] rounded-full blur-[0.4px]" />
                <div className="absolute bottom-[20%] left-[12%] w-40 h-1 bg-[#826b58]/35 rotate-[5deg] rounded-full blur-[0.6px]" />
                {/* Wasted dead gap watermark */}
                <div className="absolute top-[12%] right-[22%] px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 text-[10px] font-mono tracking-tight rotate-[6deg] backdrop-blur-xs flex items-center space-x-1.5 shadow-xs">
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                  <span>34% DEAD GAP // WASTED AIRSPACE</span>
                </div>
              </div>

              {/* Vector Architectural Scene: The Disorganized Objects */}
              <svg
                viewBox="0 0 1000 600"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <filter id="shadow-chaos" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="4" dy="7" stdDeviation="5" floodOpacity="0.35" floodColor="#1e1814" />
                  </filter>
                  <linearGradient id="scratched-watch-glass" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#8ba4b4" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#1e293b" stopOpacity="0.6" />
                  </linearGradient>
                </defs>

                {/* 1. Tilted, Scratched Luxury Watch sliding across bare floor */}
                <g transform="translate(180, 220) rotate(-26)" filter="url(#shadow-chaos)">
                  {/* Leather strap splayed loose */}
                  <path d="M-18,-110 L18,-110 L14,-45 L-14,-45 Z" fill="#78350f" />
                  <path d="M-14,45 L14,45 L18,125 L-18,125 Z" fill="#78350f" />
                  {/* Stainless steel watch case */}
                  <circle cx="0" cy="0" r="48" fill="#cbd5e1" stroke="#64748b" strokeWidth="3" />
                  <circle cx="0" cy="0" r="42" fill="#0f172a" />
                  {/* Watch dial details */}
                  <circle cx="0" cy="0" r="38" fill="url(#scratched-watch-glass)" />
                  {/* Watch hands askew */}
                  <line x1="0" y1="0" x2="16" y2="-20" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="0" y1="0" x2="-22" y2="10" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" />
                  <line x1="0" y1="0" x2="24" y2="18" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
                  {/* Severe glass scratch mark across sapphire face */}
                  <path d="M-22,-18 L18,22" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
                  <path d="M-15,-20 L-6,-6" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                  {/* Watch Crown */}
                  <rect x="46" y="-7" width="8" height="14" rx="2" fill="#94a3b8" />
                </g>

                {/* 2. Loose Metal Keys & Clattering Carabiner Scratching Wood */}
                <g transform="translate(140, 390) rotate(38)" filter="url(#shadow-chaos)">
                  {/* Keyring */}
                  <circle cx="0" cy="0" r="22" fill="none" stroke="#94a3b8" strokeWidth="4.5" />
                  {/* Brass Key */}
                  <g transform="rotate(30)">
                    <circle cx="28" cy="0" r="14" fill="#d97706" />
                    <rect x="40" y="-3.5" width="46" height="7" fill="#d97706" />
                    <rect x="72" y="3.5" width="6" height="8" fill="#d97706" />
                    <rect x="80" y="3.5" width="5" height="5" fill="#d97706" />
                  </g>
                  {/* Silver Key colliding with watch strap */}
                  <g transform="rotate(-40)">
                    <circle cx="30" cy="0" r="15" fill="#cbd5e1" />
                    <rect x="42" y="-4" width="52" height="8" fill="#cbd5e1" />
                    <rect x="78" y="4" width="7" height="9" fill="#cbd5e1" />
                    <rect x="87" y="4" width="6" height="6" fill="#cbd5e1" />
                  </g>
                </g>

                {/* 3. Tangled Spaghetti of USB-C & Lightning Cables with Bent Jack */}
                <g filter="url(#shadow-chaos)">
                  {/* Tangled chaotic spline paths */}
                  <path
                    d="M320,120 C360,80 430,130 380,210 C340,270 290,190 350,280 C410,370 480,260 520,330 C560,400 480,480 390,430 C310,380 250,470 310,510"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="11"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M320,120 C360,80 430,130 380,210 C340,270 290,190 350,280 C410,370 480,260 520,330 C560,400 480,480 390,430 C310,380 250,470 310,510"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Tangled white braided cable loop */}
                  <path
                    d="M290,260 C380,220 460,330 390,390 C330,440 440,510 540,460"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  {/* Loose USB-C connector dangling upside down */}
                  <g transform="translate(320, 115) rotate(-35)">
                    <rect x="-8" y="-18" width="16" height="26" rx="4" fill="#475569" />
                    <rect x="-5" y="-30" width="10" height="12" rx="2" fill="#94a3b8" />
                  </g>
                  {/* Heavy 30W Power Adapter tossed sideways */}
                  <g transform="translate(480, 240) rotate(55)">
                    <rect x="-35" y="-35" width="70" height="70" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                    <rect x="-24" y="-35" width="8" height="18" fill="#94a3b8" />
                    <rect x="16" y="-35" width="8" height="18" fill="#94a3b8" />
                  </g>
                </g>

                {/* 4. Luxury Pen Rolling Diagonally into key cluster */}
                <g transform="translate(230, 90) rotate(42)" filter="url(#shadow-chaos)">
                  <rect x="-6" y="-90" width="12" height="180" rx="6" fill="#18181b" stroke="#71717a" strokeWidth="1" />
                  <rect x="-7" y="-30" width="14" height="10" fill="#d4af37" />
                  {/* Clip flared out loose */}
                  <rect x="6" y="-80" width="3" height="60" fill="#d4af37" rx="1" />
                  <path d="M-6,90 L6,90 L0,110 Z" fill="#d4af37" />
                </g>

                {/* 5. AirPods Case Displaced in Corner, Covered in Lint */}
                <g transform="translate(680, 140) rotate(-18)" filter="url(#shadow-chaos)">
                  <rect x="-34" y="-26" width="68" height="52" rx="18" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
                  <line x1="-33" y1="-5" x2="33" y2="-5" stroke="#94a3b8" strokeWidth="1" />
                  <circle cx="0" cy="5" r="2" fill="#22c55e" opacity="0.8" />
                </g>

                {/* 6. Loose SD Cards & Flash Drives sliding under cables */}
                <g transform="translate(620, 360) rotate(70)" filter="url(#shadow-chaos)">
                  <rect x="-16" y="-22" width="32" height="44" rx="3" fill="#1e293b" />
                  <rect x="-12" y="-18" width="24" height="20" fill="#3b82f6" rx="2" />
                  <rect x="-10" y="14" width="20" height="4" fill="#eab308" />
                </g>
                <g transform="translate(560, 420) rotate(-35)" filter="url(#shadow-chaos)">
                  <rect x="-12" y="-24" width="24" height="48" rx="4" fill="#94a3b8" />
                  <rect x="-9" y="-34" width="18" height="10" fill="#64748b" rx="1" />
                </g>
              </svg>

              {/* Floating Chaos Inspection Callouts */}
              <div className="absolute top-[32%] left-[8%] bg-red-950/85 text-red-200 border border-red-500/40 rounded-xl px-2.5 py-1.5 shadow-lg backdrop-blur-md text-[11px] font-sans flex items-center space-x-2 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <div>
                  <p className="font-semibold text-white leading-none">Scratched Watch Bezel</p>
                  <p className="text-[10px] text-red-300">Colliding with keys & bare drawer wood</p>
                </div>
              </div>

              <div className="absolute bottom-[28%] left-[26%] bg-zinc-900/90 text-zinc-200 border border-zinc-700/60 rounded-xl px-2.5 py-1.5 shadow-lg backdrop-blur-md text-[11px] font-sans flex items-center space-x-2 pointer-events-none">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <div>
                  <p className="font-semibold text-white leading-none">72 dB Violent Rattle</p>
                  <p className="text-[10px] text-zinc-400">Metal on wood acoustic resonance</p>
                </div>
              </div>

              <div className="absolute top-[16%] left-[34%] bg-zinc-900/90 text-zinc-200 border border-zinc-700/60 rounded-xl px-2.5 py-1.5 shadow-lg backdrop-blur-md text-[11px] font-sans flex items-center space-x-2 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <div>
                  <p className="font-semibold text-white leading-none">Tangled 2m Knot</p>
                  <p className="text-[10px] text-zinc-400">14.2s wasted searching every morning</p>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* LAYER 2: CUSTOM SNUG FIT (AFTER - RIGHT OVERLAY LAYER)       */}
          {/* ============================================================ */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              clipPath: `inset(0 0 0 ${sliderPos}%)`,
            }}
          >
            {/* Drawer Interior Backdrop: SnugFit warm light porcelain modular tray architecture */}
            <div className="absolute inset-0 bg-[#f4f4f7] dark:bg-[#121215] overflow-hidden">
              {/* Precision Millimeter Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:20px_20px] opacity-40" />

              {/* Vector Architectural Scene: The Precision Modular Organizer */}
              <svg
                viewBox="0 0 1000 600"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <filter id="tray-bevel" x="-5%" y="-5%" width="110%" height="110%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.08" floodColor="#000000" />
                  </filter>
                  <filter id="recess-pocket" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.18" floodColor="#000000" />
                  </filter>
                  <linearGradient id="porcelain-tray-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#f1f2f5" />
                  </linearGradient>
                  <linearGradient id="velvet-slate-bed" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                  <linearGradient id="velvet-terracotta-bed" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ea580c" />
                    <stop offset="100%" stopColor="#c2410c" />
                  </linearGradient>
                </defs>

                {/* Outer Tray Wall Perimeter: SLS Matte PA12 Nylon with micro-chamfers */}
                <rect
                  x="40"
                  y="30"
                  width="920"
                  height="540"
                  rx="16"
                  fill="url(#porcelain-tray-grad)"
                  stroke="#d4d4d8"
                  strokeWidth="2.5"
                  filter="url(#tray-bevel)"
                />

                {/* Laser-Etched Engineering Spec & Tolerance Watermark */}
                <text x="70" y="65" fill="#71717a" fontSize="11" fontFamily="JetBrains Mono, monospace" letterSpacing="1.5">
                  FORMGRID PARAMETRIC MODULAR TRAY // TOLERANCE ±0.20MM // MATTE SLS NYLON-12
                </text>
                <text x="780" y="65" fill="#71717a" fontSize="11" fontFamily="JetBrains Mono, monospace" letterSpacing="1">
                  100% VOLUME HARVEST
                </text>

                {/* ============================================================ */}
                {/* COMPARTMENT 1: Plush Velvet Watch Nest (Left Bay)            */}
                {/* ============================================================ */}
                <g filter="url(#recess-pocket)">
                  {/* Recessed cavity */}
                  <rect x="70" y="85" width="220" height="320" rx="14" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
                  {/* Velvet Microfiber Cushion Bed */}
                  <rect x="74" y="89" width="212" height="312" rx="12" fill="url(#velvet-slate-bed)" />
                  {/* Watch Crown Relief Cutout Notch */}
                  <rect x="274" y="228" width="14" height="32" rx="4" fill="#0f172a" />

                  {/* Pristine Luxury Watch Centered Perfectly */}
                  <g transform="translate(176, 244)">
                    {/* Flush Italian leather watch strap in guide canal */}
                    <path d="M-18,-115 L18,-115 L18,-46 L-18,-46 Z" fill="#92400e" rx="4" />
                    <path d="M-18,46 L18,46 L18,115 L-18,115 Z" fill="#92400e" rx="4" />
                    {/* Brushed 316L Stainless Steel Watch Case */}
                    <circle cx="0" cy="0" r="48" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2.5" />
                    <circle cx="0" cy="0" r="42" fill="#09090b" />
                    <circle cx="0" cy="0" r="40" fill="#0284c7" fillOpacity="0.08" />
                    {/* Flawless Sapphire Crystal & Polished Hands */}
                    <circle cx="0" cy="0" r="2.5" fill="#f8fafc" />
                    <line x1="0" y1="0" x2="0" y2="-28" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="0" y1="0" x2="20" y2="0" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" />
                    <line x1="0" y1="0" x2="-14" y2="18" stroke="#ff5500" strokeWidth="1.2" strokeLinecap="round" />
                    {/* Crown resting precisely in relief notch */}
                    <rect x="46" y="-8" width="12" height="16" rx="3" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
                  </g>
                </g>

                {/* Subtext under watch compartment */}
                <text x="80" y="425" fill="#71717a" fontSize="10" fontFamily="JetBrains Mono, monospace">
                  BAY 01 // SAPPHIRE CUSHION VAULT
                </text>

                {/* ============================================================ */}
                {/* COMPARTMENT 2: Dual Chamfered Pen Cradles with Finger Scoop  */}
                {/* ============================================================ */}
                <g filter="url(#recess-pocket)">
                  {/* Primary Pen Trough */}
                  <rect x="310" y="85" width="220" height="70" rx="12" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
                  <rect x="313" y="88" width="214" height="64" rx="10" fill="#1e293b" />
                  {/* Ergonomic Center Finger Extraction Scoop */}
                  <path d="M390,88 C400,105 440,105 450,88 Z" fill="#0f172a" />
                  <path d="M390,152 C400,135 440,135 450,152 Z" fill="#0f172a" />

                  {/* Precision Fountain Pen resting horizontally */}
                  <g transform="translate(420, 120)">
                    <rect x="-85" y="-6" width="170" height="12" rx="5" fill="#09090b" stroke="#e2e8f0" strokeWidth="0.8" />
                    <rect x="-35" y="-7" width="8" height="14" fill="#d4af37" rx="1" />
                    <rect x="45" y="-8" width="4" height="16" fill="#d4af37" rx="1" />
                    <path d="M-85,-6 L-100,0 L-85,6 Z" fill="#d4af37" />
                  </g>

                  {/* Secondary Stylus / Pencil Trough */}
                  <rect x="310" y="170" width="220" height="70" rx="12" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
                  <rect x="313" y="173" width="214" height="64" rx="10" fill="#1e293b" />
                  {/* Apple Pencil nestled snugly */}
                  <g transform="translate(420, 205)">
                    <rect x="-85" y="-5" width="170" height="10" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
                    <path d="M-85,-5 L-98,0 L-85,5 Z" fill="#f1f5f9" />
                    <circle cx="-95" cy="0" r="1.5" fill="#475569" />
                  </g>
                </g>

                {/* Subtext under pens */}
                <text x="315" y="260" fill="#71717a" fontSize="10" fontFamily="JetBrains Mono, monospace">
                  BAY 02 // DUAL SCOOP INSTRUMENT TROUGHS
                </text>

                {/* ============================================================ */}
                {/* COMPARTMENT 3: AirPods Pro Flush Extraction Dock             */}
                {/* ============================================================ */}
                <g filter="url(#recess-pocket)">
                  <rect x="310" y="280" width="105" height="125" rx="14" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
                  <rect x="313" y="283" width="99" height="119" rx="11" fill="url(#velvet-terracotta-bed)" />
                  {/* Flush AirPods Case in bespoke contour */}
                  <g transform="translate(362, 342)">
                    <rect x="-32" y="-24" width="64" height="48" rx="16" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.2" />
                    <line x1="-31" y1="-5" x2="31" y2="-5" stroke="#cbd5e1" strokeWidth="1" />
                    <circle cx="0" cy="6" r="2" fill="#22c55e" />
                  </g>
                </g>

                {/* ============================================================ */}
                {/* COMPARTMENT 4: Micro SD & USB-C Flash Drive Dock             */}
                {/* ============================================================ */}
                <g filter="url(#recess-pocket)">
                  <rect x="425" y="280" width="105" height="125" rx="14" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
                  <rect x="428" y="283" width="99" height="119" rx="11" fill="#1e293b" />
                  {/* 3 micro SD push-eject slots */}
                  <rect x="440" y="296" width="22" height="32" rx="2" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                  <rect x="470" y="296" width="22" height="32" rx="2" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                  <rect x="500" y="296" width="22" height="32" rx="2" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                  {/* USB-C Flash Drive nestled */}
                  <g transform="translate(477, 368)">
                    <rect x="-35" y="-10" width="70" height="20" rx="4" fill="#64748b" stroke="#cbd5e1" strokeWidth="1" />
                    <rect x="25" y="-6" width="12" height="12" rx="2" fill="#94a3b8" />
                  </g>
                </g>

                {/* ============================================================ */}
                {/* COMPARTMENT 5: Channeled Cable Raceway with Magnetic Snaps   */}
                {/* ============================================================ */}
                <g filter="url(#recess-pocket)">
                  <rect x="550" y="85" width="410" height="160" rx="14" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
                  <rect x="554" y="89" width="402" height="152" rx="11" fill="#1e293b" />

                  {/* Precision Circular Coiled Cable Bays */}
                  <g transform="translate(650, 165)">
                    <circle cx="0" cy="0" r="54" fill="none" stroke="#0f172a" strokeWidth="22" />
                    <circle cx="0" cy="0" r="54" fill="none" stroke="#ff5500" strokeWidth="14" strokeDasharray="6 3" />
                    <circle cx="0" cy="0" r="32" fill="#0f172a" />
                    {/* Magnetic Retention Clip */}
                    <rect x="-12" y="-12" width="24" height="24" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="4" fill="#ff5500" />
                  </g>

                  <g transform="translate(800, 165)">
                    <circle cx="0" cy="0" r="54" fill="none" stroke="#0f172a" strokeWidth="22" />
                    <circle cx="0" cy="0" r="54" fill="none" stroke="#38bdf8" strokeWidth="14" strokeDasharray="6 3" />
                    <circle cx="0" cy="0" r="32" fill="#0f172a" />
                    {/* Magnetic Retention Clip */}
                    <rect x="-12" y="-12" width="24" height="24" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="4" fill="#0284c7" />
                  </g>
                </g>

                <text x="560" y="260" fill="#71717a" fontSize="10" fontFamily="JetBrains Mono, monospace">
                  BAY 03 // DUAL MAGNETIC CABLE RACEWAY (ZERO TANGLE)
                </text>

                {/* ============================================================ */}
                {/* COMPARTMENT 6: EDC Tray & Dampened Key Chamber               */}
                {/* ============================================================ */}
                <g filter="url(#recess-pocket)">
                  <rect x="550" y="280" width="410" height="245" rx="14" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
                  <rect x="554" y="284" width="402" height="237" rx="11" fill="url(#velvet-slate-bed)" />

                  {/* Titanium EDC Pocket Knife nestled flush */}
                  <g transform="translate(660, 360)">
                    <rect x="-70" y="-14" width="140" height="28" rx="6" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
                    <circle cx="-50" cy="0" r="5" fill="#1e293b" />
                    <circle cx="50" cy="0" r="5" fill="#1e293b" />
                    <rect x="0" y="-12" width="45" height="6" fill="#0f172a" rx="2" />
                  </g>

                  {/* Precision Key Fob resting on velvet sound-dampening pad */}
                  <g transform="translate(830, 360)">
                    <rect x="-55" y="-28" width="110" height="56" rx="16" fill="#18181b" stroke="#cbd5e1" strokeWidth="1.2" />
                    <circle cx="-25" cy="0" r="6" fill="#ea580c" />
                    <line x1="-5" y1="-14" x2="35" y2="-14" stroke="#71717a" strokeWidth="2" strokeLinecap="round" />
                    <line x1="-5" y1="0" x2="35" y2="0" stroke="#71717a" strokeWidth="2" strokeLinecap="round" />
                    <line x1="-5" y1="14" x2="20" y2="14" stroke="#71717a" strokeWidth="2" strokeLinecap="round" />
                  </g>

                  {/* Acoustic Zero Decibel Indicator Stamp */}
                  <g transform="translate(755, 470)">
                    <rect x="-140" y="-16" width="280" height="32" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                    <text x="0" y="4" fill="#34d399" fontSize="11" fontFamily="JetBrains Mono, monospace" textAnchor="middle" letterSpacing="1">
                      ACOUSTIC FLOCKING: 0 dB SILENT GLIDE
                    </text>
                  </g>
                </g>

                {/* Subtext under EDC */}
                <text x="560" y="540" fill="#71717a" fontSize="10" fontFamily="JetBrains Mono, monospace">
                  BAY 04 // EDC HARDWARE & KEY DAMPENING PAD
                </text>
              </svg>

              {/* Floating Snug Fit Inspection Callouts */}
              <div className="absolute top-[26%] right-[8%] bg-emerald-950/85 text-emerald-200 border border-emerald-500/40 rounded-xl px-2.5 py-1.5 shadow-lg backdrop-blur-md text-[11px] font-sans flex items-center space-x-2 pointer-events-none">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <div>
                  <p className="font-semibold text-white leading-none">Channeled Cable Race</p>
                  <p className="text-[10px] text-emerald-300">Magnetic clips hold plugs ready</p>
                </div>
              </div>

              <div className="absolute bottom-[24%] right-[22%] bg-zinc-900/90 text-zinc-200 border border-zinc-700/60 rounded-xl px-2.5 py-1.5 shadow-lg backdrop-blur-md text-[11px] font-sans flex items-center space-x-2 pointer-events-none">
                <VolumeX className="w-3.5 h-3.5 text-emerald-400" />
                <div>
                  <p className="font-semibold text-white leading-none">0 dB Acoustic Dampening</p>
                  <p className="text-[10px] text-zinc-400">Zero clatter on rapid drawer slam</p>
                </div>
              </div>

              <div className="absolute top-[16%] right-[42%] bg-zinc-900/90 text-zinc-200 border border-zinc-700/60 rounded-xl px-2.5 py-1.5 shadow-lg backdrop-blur-md text-[11px] font-sans flex items-center space-x-2 pointer-events-none">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <div>
                  <p className="font-semibold text-white leading-none">±0.2mm Precision Fit</p>
                  <p className="text-[10px] text-zinc-400">Custom molded to your items</p>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* INTERACTIVE DRAG HANDLE & DIVIDER LINE                       */}
          {/* ============================================================ */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none z-30 flex items-center justify-center -translate-x-1/2"
            style={{ left: `${sliderPos}%` }}
          >
            {/* Vertical Split Line with glowing orange/porcelain core */}
            <div className="w-[2.5px] h-full bg-white dark:bg-zinc-200 shadow-[0_0_12px_rgba(255,85,0,0.6)] relative">
              {/* Subtle top indicator pip */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white dark:bg-zinc-100 border-2 border-orange-500 shadow-md" />
              {/* Subtle bottom indicator pip */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white dark:bg-zinc-100 border-2 border-orange-500 shadow-md" />
            </div>

            {/* Central Tactile Grab Pill */}
            <div
              className={`absolute flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-zinc-900 border-2 border-orange-500 shadow-xl pointer-events-auto cursor-ew-resize transition-transform duration-75 ${
                isDragging ? 'scale-115 ring-4 ring-orange-500/30' : 'hover:scale-108'
              }`}
            >
              <div className="flex items-center space-x-0.5 text-orange-600 dark:text-orange-400">
                <MoveHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>

            {/* Floating Live Percentage Tag */}
            <div className="absolute top-4 bg-zinc-950/90 text-white border border-zinc-700/80 rounded-full px-2.5 py-0.5 text-[10px] font-mono tracking-tight shadow-md backdrop-blur-xs whitespace-nowrap">
              {sliderPos < 50 ? `${100 - sliderPos}% AFTER` : `${sliderPos}% BEFORE`}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TELEMETRY PERFORMANCE AUDIT (4 COMPARISON METRIC CARDS)      */}
        {/* ============================================================ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 mt-3 pt-3 border-t border-zinc-200/80 dark:border-zinc-800">
          {/* Card 1: Space Utilization */}
          <div className="p-3 rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-[11px] font-medium mb-1">
              <span>Space Density</span>
              <Maximize2 className="w-3.5 h-3.5 text-orange-500" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-sm line-through text-red-500 font-mono">62%</span>
              <span className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white font-mono">
                98.4%
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Zero dead void or wasted airspace
            </p>
          </div>

          {/* Card 2: Acoustic Noise */}
          <div className="p-3 rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-[11px] font-medium mb-1">
              <span>Rattle Decibels</span>
              <VolumeX className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-sm line-through text-red-500 font-mono">72 dB</span>
              <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                0 dB
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Silent plush microfiber flocking
            </p>
          </div>

          {/* Card 3: Retrieval Speed */}
          <div className="p-3 rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-[11px] font-medium mb-1">
              <span>Retrieval Speed</span>
              <Zap className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-sm line-through text-red-500 font-mono">14.2s</span>
              <span className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white font-mono">
                1.4s
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Instant muscle memory access
            </p>
          </div>

          {/* Card 4: Protection Level */}
          <div className="p-3 rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-[11px] font-medium mb-1">
              <span>Finish Safety</span>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-sm line-through text-red-500 font-mono">Scuffed</span>
              <span className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white font-mono">
                100% Safe
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Sapphire & titanium protection
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* QUICK CONVERSION CTA: FIX YOUR DRAWER IN 60 SECONDS          */}
      {/* ============================================================ */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200/90 dark:border-zinc-800 shadow-md gap-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5" />
            <span>PARAMETRIC 3D CUSTOMIZER STUDIO</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Ready to end your drawer chaos?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
            Input your exact drawer width, length, and depth. Select your item compartments and watch your custom
            matte tray generate in real-time 3D WebGL. Manufactured in 48 hours.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCtaClick}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm shadow-md hover:shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>Fix Your Drawer in 60 Seconds</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
