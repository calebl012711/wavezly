/**
 * WAVEZLY HERO & SHOWCASE
 * Clean DTC aesthetic:
 * - Crisp human copy (no AI buzzwords or fake telemetry)
 * - 100% responsive on mobile (zero horizontal blowout)
 * - Interactive 3D preview card / instant dimension test:
 *   * Interactive mini drawer slider: users drag a slider to see an IKEA Alex drawer pull out and fit a custom tray
 *   * Instant CTAs: "Customize in Exact mm →" and "Explore 48h Print Drops"
 *   * High-converting DTC trust badges: "✦ 100% Guaranteed Fit", "✦ Free Remakes", "✦ 48h US Print Farm Dispatch"
 * - 4 Flagship showcase items with smooth switching
 * - 4 Clean category feature cards
 */

import React, { useState } from 'react';
import {
  Box,
  Star,
  ArrowRight,
  ChevronRight,
  ArrowUpRight,
  Sliders,
  Sparkles,
  Check,
  RotateCcw,
} from 'lucide-react';
import { RoomId } from '../../lib/storefront';

interface AmazonHeroProps {
  onSelectRoom: (room: RoomId) => void;
  onExploreCatalog: () => void;
  onLaunchCustomizer: () => void;
}

interface SpotlightProduct {
  id: string;
  name: string;
  category: string;
  price: string;
  listPrice?: string;
  rating: string;
  reviews: string;
  image: string;
  description: string;
  action: RoomId | 'custom';
}

const SPOTLIGHT_PRODUCTS: SpotlightProduct[] = [
  {
    id: 'crystal-dragon',
    name: 'Articulated Crystal Dragon',
    category: 'Desk Fidget & Sensory Toy',
    price: '$24.99',
    listPrice: '$32.00',
    rating: '4.9',
    reviews: '3,840',
    image: '/assets/products/crystal-dragon-real.jpg',
    description: 'A 24-inch flexible, multi-joint dragon printed in shimmering tri-color silk filament. Moves smoothly right off the print bed with zero assembly.',
    action: 'trending_3d',
  },
  {
    id: 'voronoi-lamp',
    name: 'Voronoi Ambient Table Lamp',
    category: 'Sculptural Lighting',
    price: '$36.99',
    listPrice: '$48.00',
    rating: '4.9',
    reviews: '1,680',
    image: '/assets/products/voronoi-lamp-real.jpg',
    description: 'Cellular lattice dome that casts a warm 2700K ambient glow. Includes USB-C powered warm LED fixture.',
    action: 'home_decor',
  },
  {
    id: 'impossible-cone',
    name: 'Impossible Passthrough Cone',
    category: 'Optical Kinetic Toy',
    price: '$14.99',
    listPrice: '$20.00',
    rating: '4.9',
    reviews: '2,910',
    image: '/assets/products/impossible-cone-real.jpg',
    description: 'Two interlocking spiral pieces that smoothly pass through each other in an optical illusion. Surprisingly addictive to fidget with.',
    action: 'trending_3d',
  },
  {
    id: 'drawer-matrix',
    name: 'Custom Drawer Organizer',
    category: 'Made-to-Measure Storage',
    price: 'From $39.00',
    rating: '4.9',
    reviews: '4,100',
    image: '/assets/products/drawer-matrix-real.jpg',
    description: 'Enter your drawer’s exact width and depth in millimeters. We generate the 3D model and print an exact, zero-gap fit.',
    action: 'custom',
  },
];

const CATEGORY_CARDS = [
  {
    id: 'toys',
    title: 'Desk Toys & Fidgets',
    subtitle: 'Articulated dragons, passthrough cones, and flexible creatures.',
    image: '/assets/products/crystal-dragon-real.jpg',
    price: 'From $14.99',
    action: 'trending_3d' as RoomId,
  },
  {
    id: 'home',
    title: 'Sculptural Lighting & Décor',
    subtitle: 'Warm ambient lamps, geometric planters, and desk trays.',
    image: '/assets/products/voronoi-lamp-real.jpg',
    price: 'From $28.99',
    action: 'home_decor' as RoomId,
  },
  {
    id: 'custom',
    title: 'Custom Drawer Organizers',
    subtitle: 'Made to your drawer’s exact millimeter width and depth.',
    image: '/assets/products/drawer-matrix-real.jpg',
    price: 'Custom from $39',
    action: 'custom' as const,
  },
  {
    id: 'auto',
    title: 'Car & Everyday Gear',
    subtitle: '40oz cup holder expanders, controller stands, and tool mounts.',
    image: '/assets/products/car-cup-expander-real.jpg',
    price: 'From $21.99',
    action: 'car_auto' as RoomId,
  },
];

interface DrawerPreset {
  id: string;
  label: string;
  model: string;
  width: number;
  depth: number;
  height: number;
  price: string;
}

const DRAWER_PRESETS: DrawerPreset[] = [
  {
    id: 'alex',
    label: 'IKEA Alex',
    model: 'IKEA Alex Standard',
    width: 300,
    depth: 520,
    height: 65,
    price: '$39.00',
  },
  {
    id: 'alex-wide',
    label: 'IKEA Alex Wide',
    model: 'IKEA Alex Wide Unit',
    width: 400,
    depth: 520,
    height: 65,
    price: '$45.00',
  },
  {
    id: 'custom',
    label: 'Custom Sizing',
    model: 'Your Exact Spec',
    width: 340,
    depth: 460,
    height: 60,
    price: 'From $39.00',
  },
];

interface ColorOption {
  id: string;
  name: string;
  fill: string;
  accent: string;
  border: string;
}

const COLOR_OPTIONS: ColorOption[] = [
  {
    id: 'obsidian',
    name: 'Matte Obsidian',
    fill: '#242831',
    accent: '#373E4D',
    border: '#4B5563',
  },
  {
    id: 'orange',
    name: 'Wavezly Orange',
    fill: '#FF6B00',
    accent: '#FF8A00',
    border: '#E05D00',
  },
  {
    id: 'white',
    name: 'Porcelain White',
    fill: '#F1F5F9',
    accent: '#E2E8F0',
    border: '#CBD5E1',
  },
  {
    id: 'terracotta',
    name: 'Terracotta Silk',
    fill: '#C86D51',
    accent: '#D97E63',
    border: '#A85338',
  },
];

export const AmazonHero: React.FC<AmazonHeroProps> = ({
  onSelectRoom,
  onExploreCatalog,
  onLaunchCustomizer,
}) => {
  // Hero right card view: 'test' (Interactive 3D mini drawer) or 'drops' (Curated products)
  const [activeTab, setActiveTab] = useState<'test' | 'drops'>('test');
  const [activeIdx, setActiveIdx] = useState(0);

  // Interactive Mini Drawer State
  const [drawerPull, setDrawerPull] = useState(70); // 0 to 100%
  const [selectedPreset, setSelectedPreset] = useState<DrawerPreset>(DRAWER_PRESETS[0]);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(COLOR_OPTIONS[0]);

  const activeProduct = SPOTLIGHT_PRODUCTS[activeIdx];

  const handleAction = (action: RoomId | 'custom') => {
    if (action === 'custom') {
      onLaunchCustomizer();
    } else {
      onSelectRoom(action);
      onExploreCatalog();
    }
  };

  // Isometric slide translation calculations
  // Max pull displacement in isometric projection (down and to the left)
  const pullFactor = drawerPull / 100;
  const slideX = -pullFactor * 68;
  const slideY = pullFactor * 42;
  const extensionMm = Math.round(pullFactor * (selectedPreset.depth * 0.72));

  return (
    <div className="w-full bg-[#FAFAFA] text-[#0F172A] font-sans overflow-x-hidden">
      {/* 1. HERO SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left: Typography, CTAs & DTC Trust Badges (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Top DTC Trust Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-[#FF6B00] text-xs font-semibold self-start mb-4 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-[#FF6B00] animate-pulse" />
              <span>48h US Print Farm Dispatch</span>
              <span className="text-zinc-300">•</span>
              <span>100% Fit Guarantee</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-[1.12]">
              Everyday goods,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FF8A00]">
                3D printed to order.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-3.5 sm:mt-4 text-sm sm:text-base text-zinc-600 max-w-xl leading-relaxed">
              From viral desk fidgets and ambient sculptural lighting to custom drawer organizers that fit your space down to the millimeter.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onLaunchCustomizer}
                className="h-11 sm:h-12 px-6 sm:px-7 rounded-full bg-[#FF6B00] hover:bg-[#ea5f00] text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95 group"
              >
                <span>Customize in Exact mm</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onExploreCatalog}
                className="h-11 sm:h-12 px-5 sm:px-6 rounded-full bg-white hover:bg-zinc-50 text-zinc-800 font-semibold text-xs sm:text-sm border border-zinc-200 transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-xs"
              >
                <Box className="w-4 h-4 text-[#FF6B00]" />
                <span>Explore 48h Print Drops</span>
              </button>
            </div>

            {/* High-Converting DTC Trust Badges */}
            <div className="mt-6 pt-5 border-t border-zinc-200/80 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2.5 text-xs text-zinc-700 font-medium">
              <div className="flex items-center gap-1.5 text-slate-800">
                <span className="text-[#FF6B00] font-bold">✦</span>
                <span className="font-semibold">100% Guaranteed Fit</span>
              </div>
              <span className="text-zinc-300">•</span>
              <div className="flex items-center gap-1.5 text-slate-800">
                <span className="text-[#FF6B00] font-bold">✦</span>
                <span className="font-semibold">Free Remakes</span>
              </div>
              <span className="text-zinc-300">•</span>
              <div className="flex items-center gap-1.5 text-slate-800">
                <span className="text-[#FF6B00] font-bold">✦</span>
                <span className="font-semibold">48h US Print Farm Dispatch</span>
              </div>
            </div>

            {/* Star Rating Reassurance */}
            <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-[#0F172A]">4.9 / 5</span>
              <span>(12,000+ orders delivered with zero-gap fit)</span>
            </div>
          </div>

          {/* Right: Interactive 3D Mini Drawer & Curated Showcase Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/90 shadow-sm relative">
              {/* Header Mode Switcher Tabs */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100">
                <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('test')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'test'
                        ? 'bg-white text-[#0F172A] shadow-xs font-bold'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>✦ IKEA Alex 3D Test</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('drops')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'drops'
                        ? 'bg-white text-[#0F172A] shadow-xs font-bold'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    <span>Curated Drops ({SPOTLIGHT_PRODUCTS.length})</span>
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>0.0 mm Gap</span>
                </div>
              </div>

              {/* TAB 1: INTERACTIVE 3D MINI DRAWER SLIDER & DIMENSION TEST */}
              {activeTab === 'test' && (
                <div>
                  {/* Preset Quick Selectors */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Preset Model
                    </span>
                    <div className="flex items-center gap-1">
                      {DRAWER_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setSelectedPreset(preset)}
                          className={`text-[11px] px-2.5 py-1 rounded-md transition font-medium cursor-pointer ${
                            selectedPreset.id === preset.id
                              ? 'bg-orange-50 text-[#FF6B00] border border-orange-200 font-bold'
                              : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100 border border-zinc-200/60'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3D Isometric Viewport Container */}
                  <div className="relative aspect-[16/11] sm:aspect-[4/3] rounded-xl bg-gradient-to-b from-zinc-50 via-zinc-100/70 to-zinc-50 border border-zinc-200/70 overflow-hidden flex items-center justify-center select-none">
                    {/* Architectural Grid Background */}
                    <div
                      className="absolute inset-0 opacity-40 pointer-events-none"
                      style={{
                        backgroundImage: `radial-gradient(#94A3B8 0.75px, transparent 0.75px)`,
                        backgroundSize: '16px 16px',
                      }}
                    />

                    {/* Millimeter Callout Badge (Top Left) */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/95 text-[11px] font-bold text-slate-800 shadow-xs border border-zinc-200/80">
                        <Box className="w-3 h-3 text-[#FF6B00]" />
                        <span>{selectedPreset.width} × {selectedPreset.depth} × {selectedPreset.height} mm</span>
                      </span>
                    </div>

                    {/* Zero-Gap Status Badge (Top Right) */}
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold shadow-xs">
                        <Check className="w-3 h-3" />
                        <span>100% Zero-Gap Snug</span>
                      </span>
                    </div>

                    {/* SVG Isometric 3D Drawer Simulation */}
                    <svg
                      viewBox="0 0 460 300"
                      className="w-full h-full max-h-[260px] drop-shadow-md overflow-visible"
                    >
                      <defs>
                        {/* Metallic rail gradient */}
                        <linearGradient id="steelRail" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#CBD5E1" />
                          <stop offset="50%" stopColor="#94A3B8" />
                          <stop offset="100%" stopColor="#64748B" />
                        </linearGradient>

                        {/* Cabinet shadow */}
                        <radialGradient id="cabinetGlow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="rgba(0,0,0,0.14)" />
                          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                        </radialGradient>
                      </defs>

                      {/* Floor Ambient Contact Shadow */}
                      <ellipse cx="230" cy="245" rx="170" ry="32" fill="url(#cabinetGlow)" />

                      {/* 1. OUTER ALEX CABINET CASING (Fixed In Place) */}
                      <g id="alex-casing">
                        {/* Cabinet Top Face */}
                        <polygon
                          points="230,55 365,120 250,175 115,110"
                          fill="#FFFFFF"
                          stroke="#E2E8F0"
                          strokeWidth="1.5"
                        />
                        {/* Cabinet Right Outer Wall */}
                        <polygon
                          points="365,120 365,220 250,275 250,175"
                          fill="#E2E8F0"
                          stroke="#CBD5E1"
                          strokeWidth="1.5"
                        />
                        {/* Cabinet Left Face / Cavity Frame */}
                        <polygon
                          points="115,110 250,175 250,275 115,210"
                          fill="#CBD5E1"
                          stroke="#94A3B8"
                          strokeWidth="1.5"
                        />
                        {/* Inner Cavity Dark Interior (Where drawer slides out from) */}
                        <polygon
                          points="125,120 240,175 240,250 125,195"
                          fill="#1E2229"
                        />

                        {/* Metallic Side Slide Rails (Left & Right) */}
                        <path
                          d="M 128,155 L 240,210"
                          stroke="url(#steelRail)"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 238,212 L 350,157"
                          stroke="url(#steelRail)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          opacity="0.4"
                        />
                      </g>

                      {/* 2. SLIDING DRAWER BOX & MODULAR TRAY (Slides along isometric axis) */}
                      <g
                        id="sliding-unit"
                        style={{
                          transform: `translate(${slideX}px, ${slideY}px)`,
                          transition: 'transform 0.08s ease-out',
                        }}
                      >
                        {/* Extended Steel Runner Slide Arm */}
                        {drawerPull > 5 && (
                          <line
                            x1="130"
                            y1="165"
                            x2={130 + slideX * -0.5}
                            y2={165 + slideY * 0.5}
                            stroke="url(#steelRail)"
                            strokeWidth="3.5"
                            strokeDasharray="4 2"
                          />
                        )}

                        {/* Drawer Outer Wooden Box (Light Birch / Oak) */}
                        {/* Drawer Bottom Slab */}
                        <polygon
                          points="128,125 245,180 245,240 128,185"
                          fill="#EAD9C6"
                          stroke="#D8C2AC"
                          strokeWidth="1.2"
                        />
                        {/* Drawer Right Outer Flank */}
                        <polygon
                          points="245,180 345,130 345,190 245,240"
                          fill="#D8C2AC"
                          stroke="#C4AC94"
                          strokeWidth="1.2"
                        />

                        {/* 3. PRECISION 3D PRINTED ORGANIZER TRAY (Snug Fit inside Drawer) */}
                        <g id="custom-printed-tray">
                          {/* Tray Floor */}
                          <polygon
                            points="134,130 240,180 338,132 232,82"
                            fill={selectedColor.fill}
                            stroke={selectedColor.border}
                            strokeWidth="1.5"
                          />

                          {/* Modular Grid Dividers (Internal Compartments) */}
                          {/* Longitudinal Divider */}
                          <line
                            x1="183"
                            y1="155"
                            x2="285"
                            y2="107"
                            stroke={selectedColor.accent}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                          {/* Transverse Dividers */}
                          <line
                            x1="180"
                            y1="108"
                            x2="236"
                            y2="134"
                            stroke={selectedColor.accent}
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <line
                            x1="230"
                            y1="131"
                            x2="286"
                            y2="157"
                            stroke={selectedColor.accent}
                            strokeWidth="2"
                            strokeLinecap="round"
                          />

                          {/* Stored Desk Items: Stylus Pen & AirPods in Tray */}
                          <line
                            x1="200"
                            y1="160"
                            x2="265"
                            y2="130"
                            stroke="#FFFFFF"
                            strokeWidth="2"
                            strokeLinecap="round"
                            opacity="0.85"
                          />
                          <circle cx="210" cy="120" r="5" fill="#FFFFFF" opacity="0.9" />
                        </g>

                        {/* 4. IKEA ALEX DRAWER FRONT FACE (Signature Beveled Finger Scoop) */}
                        {/* Drawer Front Face */}
                        <polygon
                          points="120,185 245,245 245,268 120,208"
                          fill="#FFFFFF"
                          stroke="#CBD5E1"
                          strokeWidth="1.5"
                        />
                        {/* Signature IKEA Alex Oval Finger Pull Scoop */}
                        <path
                          d="M 165,198 Q 182,210 200,218 Q 182,214 165,198"
                          fill="#1E293B"
                          stroke="#475569"
                          strokeWidth="1"
                        />
                        {/* Front Face Left Edge Thickness */}
                        <polygon
                          points="116,183 120,185 120,208 116,206"
                          fill="#CBD5E1"
                        />

                        {/* Dimension Caliper Line: Width across front */}
                        <g opacity={drawerPull > 25 ? '1' : '0.4'} className="transition-opacity">
                          <line
                            x1="110"
                            y1="220"
                            x2="235"
                            y2="280"
                            stroke="#FF6B00"
                            strokeWidth="1.5"
                            strokeDasharray="3 2"
                          />
                          <circle cx="110" cy="220" r="2.5" fill="#FF6B00" />
                          <circle cx="235" cy="280" r="2.5" fill="#FF6B00" />
                          <text
                            x="172"
                            y="262"
                            fill="#FF6B00"
                            fontSize="11"
                            fontWeight="bold"
                            textAnchor="middle"
                            transform="rotate(25, 172, 262)"
                          >
                            {selectedPreset.width} mm
                          </text>
                        </g>

                        {/* Dimension Caliper Line: Depth along right flank */}
                        <g opacity={drawerPull > 25 ? '1' : '0.4'} className="transition-opacity">
                          <line
                            x1="255"
                            y1="250"
                            x2="355"
                            y2="200"
                            stroke="#FF6B00"
                            strokeWidth="1.5"
                            strokeDasharray="3 2"
                          />
                          <circle cx="255" cy="250" r="2.5" fill="#FF6B00" />
                          <circle cx="355" cy="200" r="2.5" fill="#FF6B00" />
                          <text
                            x="310"
                            y="218"
                            fill="#FF6B00"
                            fontSize="10"
                            fontWeight="bold"
                            textAnchor="middle"
                            transform="rotate(-26, 310, 218)"
                          >
                            {selectedPreset.depth} mm
                          </text>
                        </g>
                      </g>
                    </svg>

                    {/* Interactive Pull Indicator Pill (Bottom Left) */}
                    <div className="absolute bottom-2.5 left-2.5 z-10">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 text-[11px] font-semibold text-zinc-700 shadow-xs border border-zinc-200/80">
                        <Sliders className="w-3 h-3 text-[#FF6B00]" />
                        <span>Extension: <strong>{extensionMm} mm</strong> ({drawerPull}%)</span>
                      </span>
                    </div>

                    {/* Reset Button */}
                    <button
                      type="button"
                      onClick={() => setDrawerPull(70)}
                      title="Reset slider to 70%"
                      className="absolute bottom-2.5 right-2.5 z-10 p-1.5 rounded-md bg-white/90 hover:bg-white text-zinc-500 hover:text-zinc-800 shadow-xs border border-zinc-200/80 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Interactive Slider Bar */}
                  <div className="mt-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#0F172A]">
                      <span className="flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-[#FF6B00]" />
                        <span>Drag Slider to Pull Drawer:</span>
                      </span>
                      <span className="text-[#FF6B00] font-mono font-bold">
                        {drawerPull === 0 ? 'Closed (0 mm)' : `${drawerPull}% (${extensionMm} mm)`}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={drawerPull}
                      onChange={(e) => setDrawerPull(Number(e.target.value))}
                      className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#FF6B00] focus:outline-none"
                    />

                    <div className="flex justify-between text-[10px] text-zinc-400 font-medium">
                      <span>0% (Flush Closed)</span>
                      <span>50% (Standard View)</span>
                      <span>100% (Full Pull)</span>
                    </div>
                  </div>

                  {/* Color & Material Swatches */}
                  <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-medium text-zinc-500">Filament:</span>
                      <div className="flex items-center gap-1.5">
                        {COLOR_OPTIONS.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedColor(c)}
                            title={c.name}
                            className={`w-4 h-4 rounded-full transition-transform cursor-pointer border ${
                              selectedColor.id === c.id
                                ? 'scale-125 ring-2 ring-[#FF6B00] ring-offset-1 border-white'
                                : 'border-zinc-300 opacity-80 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: c.fill }}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-700 hidden sm:inline">
                        {selectedColor.name}
                      </span>
                    </div>

                    {/* Instant Customizer CTA */}
                    <button
                      type="button"
                      onClick={onLaunchCustomizer}
                      className="px-3.5 py-1.5 rounded-full bg-[#FF6B00] hover:bg-[#ea5f00] text-white text-xs font-bold shadow-xs transition flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <span>Customize in Exact mm</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: CURATED PRINT DROPS SHOWCASE */}
              {activeTab === 'drops' && (
                <div>
                  {/* Product Visual Container */}
                  <div
                    onClick={() => handleAction(activeProduct.action)}
                    className="relative aspect-square sm:aspect-[4/3] rounded-xl bg-zinc-50 overflow-hidden cursor-pointer group border border-zinc-100"
                  >
                    <img
                      src={activeProduct.image}
                      alt={activeProduct.name}
                      fetchPriority="high"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-white/95 text-[#0F172A] text-xs font-semibold shadow-xs">
                        {activeProduct.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0F172A] text-white text-xs font-semibold shadow-sm group-hover:bg-[#FF6B00] transition-colors">
                        <span>{activeProduct.action === 'custom' ? 'Customize in 3D' : 'Quick View'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="mt-3.5">
                    <div className="flex items-center justify-between">
                      <h3
                        onClick={() => handleAction(activeProduct.action)}
                        className="text-base font-bold text-[#0F172A] hover:text-[#FF6B00] transition cursor-pointer"
                      >
                        {activeProduct.name}
                      </h3>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-[#0F172A]">
                          {activeProduct.price}
                        </span>
                        {activeProduct.listPrice && (
                          <span className="text-xs text-zinc-400 line-through ml-1.5">
                            {activeProduct.listPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="mt-1 text-xs text-zinc-500 leading-relaxed line-clamp-2">
                      {activeProduct.description}
                    </p>

                    {/* 4 Mini Switcher Thumbnails */}
                    <div className="mt-3.5 pt-3 border-t border-zinc-100 grid grid-cols-4 gap-2">
                      {SPOTLIGHT_PRODUCTS.map((prod, idx) => {
                        const isSelected = idx === activeIdx;
                        return (
                          <button
                            key={prod.id}
                            type="button"
                            onClick={() => {
                              setActiveIdx(idx);
                              if (prod.action === 'custom') {
                                setActiveTab('test');
                              }
                            }}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition cursor-pointer p-0.5 ${
                              isSelected
                                ? 'border-[#FF6B00] ring-1 ring-[#FF6B00]/30'
                                : 'border-zinc-200 opacity-60 hover:opacity-100'
                            }`}
                            aria-label={prod.name}
                          >
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY COLLECTION CARDS (2 cols on mobile, 4 on desktop) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
            Popular Categories
          </h2>
          <button
            type="button"
            onClick={onExploreCatalog}
            className="text-xs font-semibold text-[#FF6B00] hover:text-[#ea5f00] flex items-center gap-1 cursor-pointer"
          >
            <span>See all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {CATEGORY_CARDS.map((card) => (
            <div
              key={card.id}
              onClick={() => handleAction(card.action)}
              className="group bg-white rounded-xl p-3 sm:p-4 border border-zinc-200/80 hover:border-orange-200 shadow-xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="aspect-square rounded-lg bg-zinc-50 overflow-hidden mb-3 border border-zinc-100">
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-[#FF6B00] transition leading-snug">
                  {card.title}
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500 line-clamp-2 leading-relaxed hidden sm:block">
                  {card.subtitle}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-700">
                  {card.price}
                </span>
                <span className="text-[11px] font-bold text-[#FF6B00] flex items-center">
                  Shop <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};