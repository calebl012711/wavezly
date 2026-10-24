/**
 * WAVEZLY MODERN DTC HERO & EDITORIAL SHOWCASE
 * Concept 1: Warm Minimalist DTC
 * - Clean, airy warm off-white canvas with subtle ambient radial gradients
 * - Bold modern typography (#0F172A) with electric orange highlights (#FF6B00 / #FF7A00)
 * - Floating value prop pills: 100% Fit Guarantee, Made to Measure, 48h US Print Farm
 * - Primary CTAs: Vibrant electric orange "Explore Collections →" & "Custom 3D Sizer (Exact mm)"
 * - Hero Spotlight layout showcasing 4 real photorealistic studio products with LCP fetchPriority="high"
 * - 4 Spacious, modern editorial collection cards (rounded-2xl, soft shadows, electric orange tags, clean pricing)
 * - Minimalist department navigation ribbon
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Check,
  Star,
  Truck,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Flame,
  ArrowUpRight,
  Layers,
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
  tag: string;
  tagColor: string;
  category: string;
  price: string;
  listPrice: string;
  discount: string;
  rating: string;
  reviews: string;
  image: string;
  description: string;
  spec: string;
  action: RoomId | 'custom';
}

const SPOTLIGHT_PRODUCTS: SpotlightProduct[] = [
  {
    id: 'crystal-dragon',
    name: 'Wavezly Articulated Crystal Gem Dragon',
    tag: '✦ VIRAL MAKER HIT',
    tagColor: 'text-[#FF6B00] bg-orange-50/90 border-orange-200/80',
    category: 'Print-in-Place Kinetic Sensory Toy',
    price: '$24.99',
    listPrice: '$34.99',
    discount: '-29%',
    rating: '4.9',
    reviews: '3,842',
    image: '/assets/products/crystal-dragon-real.jpg',
    description: '24" flexible articulated spine printed in shimmering silk tri-color biopolymer with zero assembly required.',
    spec: 'Silk Tri-Color PLA+ • 48h US Farm Dispatch',
    action: 'trending_3d',
  },
  {
    id: 'voronoi-lamp',
    name: 'Voronoi Mushroom LED Ambient Table Lamp',
    tag: '✦ ARCHITECTURAL LIGHTING',
    tagColor: 'text-[#FF6B00] bg-orange-50/90 border-orange-200/80',
    category: 'Sculptural Home & Ambient Décor',
    price: '$36.99',
    listPrice: '$49.99',
    discount: '-26%',
    rating: '4.9',
    reviews: '1,680',
    image: '/assets/products/voronoi-lamp-real.jpg',
    description: 'Generative cellular lattice diffusing warm 2700K ambient glow. Includes USB-C power and warm white LED fixture.',
    spec: 'Warm 2700K LED • Matte Stoneware Finish',
    action: 'home_decor',
  },
  {
    id: 'impossible-cone',
    name: 'Wavezly Impossible Spiral Passthrough Cone',
    tag: '✦ HYPNOTIC DESK PHYSICS',
    tagColor: 'text-[#FF6B00] bg-orange-50/90 border-orange-200/80',
    category: 'Optical Kinetic Desktop Fidget',
    price: '$14.99',
    listPrice: '$21.99',
    discount: '-32%',
    rating: '4.9',
    reviews: '2,910',
    image: '/assets/products/impossible-cone-real.jpg',
    description: 'Dual helical geometry that appears to pass through solid matter. Micro-calibrated ±0.15mm slip tolerance.',
    spec: 'Dual-Color Biopolymer • Ultra-Low Friction',
    action: 'trending_3d',
  },
  {
    id: 'drawer-matrix',
    name: 'Wavezly Custom Modular Drawer Matrix System',
    tag: '✦ 100% SNUG FIT GUARANTEE',
    tagColor: 'text-[#FF6B00] bg-orange-50/90 border-orange-200/80',
    category: 'Parametric Made-to-Measure Storage',
    price: '$39.00',
    listPrice: '$54.00',
    discount: '-28%',
    rating: '4.9',
    reviews: '4,120',
    image: '/assets/products/drawer-matrix-real.jpg',
    description: 'Custom sized to your exact millimeter width and depth. Drops in flush with zero sliding gap in kitchen or desk drawers.',
    spec: '±0.20mm Tolerance • Free Remake Guarantee',
    action: 'custom',
  },
];

interface EditorialCard {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  image: string;
  secondaryImage: string;
  price: string;
  action: RoomId | 'custom';
  buttonText: string;
  badges: string[];
}

const EDITORIAL_CARDS: EditorialCard[] = [
  {
    id: 'kinetic-toys',
    tag: 'VIRAL DESIGN',
    title: 'Kinetic Fidgets & Articulated Art',
    subtitle: 'Print-in-place multi-joint dragons, tactile kawaii axolotls, and optical passthrough cones crafted with silk biopolymers.',
    image: '/assets/products/crystal-dragon-real.jpg',
    secondaryImage: '/assets/products/impossible-cone-real.jpg',
    price: 'From $14.99',
    action: 'trending_3d',
    buttonText: 'Shop Viral Toys',
    badges: ['Zero Assembly', 'Silk Tri-Color', 'Child-Safe PLA+'],
  },
  {
    id: 'sculptural-home',
    tag: 'SCULPTURAL DÉCOR',
    title: 'Warm Ambient Lighting & Décor',
    subtitle: 'Warm 2700K Voronoi mushroom table lamps, geometric self-watering planters, and barista espresso stations.',
    image: '/assets/products/voronoi-lamp-real.jpg',
    secondaryImage: '/assets/products/pourover-coffee-tray-real.jpg',
    price: 'From $28.99',
    action: 'home_decor',
    buttonText: 'Shop Living & Décor',
    badges: ['USB-C 2700K LED', 'Matte Finish', 'Barista Grade'],
  },
  {
    id: 'custom-sizer',
    tag: 'MADE TO MEASURE',
    title: 'Millimeter-Perfect Custom Fit Studio',
    subtitle: 'Enter your exact millimeter width & depth for any kitchen drawer, IKEA Alex, or workshop chest with zero sliding gap.',
    image: '/assets/products/drawer-matrix-real.jpg',
    secondaryImage: '/assets/products/valet-pro-real.jpg',
    price: 'Custom from $39.00',
    action: 'custom',
    buttonText: 'Launch Custom 3D Sizer',
    badges: ['100% Fit Guarantee', '±0.2mm Precision', 'Ships in 48h'],
  },
  {
    id: 'functional-edc',
    tag: 'FUNCTIONAL GEAR',
    title: 'Everyday Carry, Auto & Workshop',
    subtitle: 'Universal 40oz car tumbler expanders that never wobble, weighted controller plinths, and modular Gridfinity systems.',
    image: '/assets/products/car-cup-expander-real.jpg',
    secondaryImage: '/assets/products/controller-dock-real.jpg',
    price: 'From $21.99',
    action: 'car_auto',
    buttonText: 'Shop Functional Gear',
    badges: ['High-Temp Carbon PETG', 'Won’t Warp in Cars', 'Gridfinity Ready'],
  },
];

const DTC_DEPARTMENTS: {
  id: RoomId | 'custom_studio';
  label: string;
  sub: string;
  image: string;
  pill?: string;
}[] = [
  {
    id: 'trending_3d',
    label: 'Viral 3D Toys',
    sub: 'Dragons & Fidgets',
    image: '/assets/products/crystal-dragon-real.jpg',
    pill: 'Trending',
  },
  {
    id: 'custom_studio',
    label: 'Custom 3D Sizer',
    sub: 'Exact mm Fit',
    image: '/assets/products/drawer-matrix-real.jpg',
    pill: 'Custom',
  },
  {
    id: 'kitchen',
    label: 'Kitchen & Barista',
    sub: 'Coffee & Trays',
    image: '/assets/products/pourover-coffee-tray-real.jpg',
  },
  {
    id: 'home_decor',
    label: 'Lamps & Décor',
    sub: 'Voronoi & Vases',
    image: '/assets/products/voronoi-lamp-real.jpg',
  },
  {
    id: 'electronics',
    label: 'Gaming & Tech',
    sub: 'Docks & Stands',
    image: '/assets/products/controller-dock-real.jpg',
  },
  {
    id: 'car_auto',
    label: 'Car & EDC',
    sub: '40oz Expander',
    image: '/assets/products/car-cup-expander-real.jpg',
  },
  {
    id: 'tools_workshop',
    label: 'Gridfinity & Tools',
    sub: 'Bins & Mounts',
    image: '/assets/products/gridfinity-kit-real.jpg',
  },
  {
    id: 'vanity',
    label: 'Beauty & Bath',
    sub: 'Vanity Grids',
    image: '/assets/products/vanity-matrix-real.jpg',
  },
  {
    id: 'bedside',
    label: 'Bedside EDC',
    sub: 'Watch Plinths',
    image: '/assets/products/watch-jewelry-caddy-real.jpg',
  },
  {
    id: 'deals',
    label: 'Special Drops',
    sub: 'Up to 35% Off',
    image: '/assets/products/impossible-cone-real.jpg',
    pill: 'Sale',
  },
];

export const AmazonHero: React.FC<AmazonHeroProps> = ({
  onSelectRoom,
  onExploreCatalog,
  onLaunchCustomizer,
}) => {
  const [activeSpotlightIdx, setActiveSpotlightIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle through spotlight products every 6.5s unless hovered
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSpotlightIdx((prev) => (prev + 1) % SPOTLIGHT_PRODUCTS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const activeProduct = SPOTLIGHT_PRODUCTS[activeSpotlightIdx];

  const handleSpotlightAction = (action: RoomId | 'custom') => {
    if (action === 'custom') {
      onLaunchCustomizer();
    } else {
      onSelectRoom(action);
      onExploreCatalog();
    }
  };

  return (
    <div className="relative w-full bg-[#FAFAF9] text-[#0F172A] font-sans selection:bg-[#FF6B00]/20 selection:text-[#FF6B00] overflow-hidden">
      {/* Subtle Warm Ambient Glow Radians */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-[640px] bg-[radial-gradient(circle_at_top,rgba(255,107,0,0.06)_0%,rgba(255,122,0,0.02)_40%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-36 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,107,0,0.035)_0%,transparent_60%)] pointer-events-none" />

      {/* ============================================================ */}
      {/* 1. HERO SPOTLIGHT SHOWCASE (WARM DTC ARCHITECTURE)          */}
      {/* ============================================================ */}
      <div className="relative max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-12 pb-14 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT COLUMN: Editorial Typography & DTC CTAs (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center z-10">
            {/* Floating Value Prop Pills */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-5 sm:mb-6">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-50/80 border border-orange-200/70 text-[#FF6B00] text-xs font-semibold tracking-wide shadow-xs">
                <span>✦ 100% Fit Guarantee</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-50/80 border border-orange-200/70 text-[#FF6B00] text-xs font-semibold tracking-wide shadow-xs">
                <span>✦ Made to Measure</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-50/80 border border-orange-200/70 text-[#FF6B00] text-xs font-semibold tracking-wide shadow-xs">
                <span>✦ 48h US Print Farm</span>
              </span>
            </div>

            {/* Bold Modern Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-[#0F172A] leading-[1.08]">
              Every 3D Print &amp;{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF7A00] to-[#FF8A00]">
                Custom Fit Imaginable.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-600 font-normal max-w-xl leading-relaxed">
              Curated viral kinetic fidgets, warm 2700K Voronoi lighting, custom millimeter drawer matrices, and vehicle gear—precision manufactured on-demand with biopolymers in our US farm.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={onExploreCatalog}
                className="h-12 px-7 rounded-full bg-[#FF6B00] hover:bg-[#FF7A00] text-white font-bold text-sm shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95 group"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onLaunchCustomizer}
                className="h-12 px-6 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm shadow-xs border border-slate-200/90 hover:border-slate-300 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Box className="w-4 h-4 text-[#FF6B00]" />
                <span>Custom 3D Sizer (Exact mm)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectRoom('deals');
                  onExploreCatalog();
                }}
                className="h-12 px-4 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 font-medium text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Flame className="w-4 h-4 text-[#FF6B00]" />
                <span>Drops &amp; Deals</span>
              </button>
            </div>

            {/* Modern Clean Trust Row */}
            <div className="mt-8 pt-5 border-t border-slate-200/70 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <div className="flex text-[#FF7A00]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-3.5 h-3.5 fill-[#FF7A00] stroke-none" />
                  ))}
                </div>
                <span className="font-bold text-[#0F172A]">4.9/5</span>
                <span className="text-slate-500">(4,180+ verified reviews)</span>
              </div>
              <div className="hidden sm:block h-3.5 w-px bg-slate-200" />
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Truck className="w-4 h-4 text-[#FF6B00]" />
                <span>FREE 48h US Shipping</span>
              </div>
              <div className="hidden sm:block h-3.5 w-px bg-slate-200" />
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
                <span>100% Fit Guarantee (Free Remakes)</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Spacious Spotlight Product Showcase (5 cols) */}
          <div
            className="lg:col-span-5 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Spotlight Showcase Container */}
            <div className="relative rounded-3xl bg-white p-4 sm:p-5 shadow-[0_16px_45px_rgba(15,23,42,0.06)] border border-slate-100 overflow-hidden">
              {/* Product Visual Stage */}
              <div
                onClick={() => handleSpotlightAction(activeProduct.action)}
                className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl bg-[#F8FAFC] overflow-hidden group cursor-pointer border border-slate-100"
              >
                {/* LCP Optimized Hero Image with fetchPriority="high" for primary product */}
                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  fetchPriority={activeSpotlightIdx === 0 ? 'high' : 'auto'}
                  loading={activeSpotlightIdx === 0 ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Floating Tags */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide shadow-xs border ${activeProduct.tagColor}`}>
                    {activeProduct.tag}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#0F172A]/85 text-white text-[11px] font-bold shadow-xs backdrop-blur-xs">
                    {activeProduct.discount}
                  </span>
                </div>

                {/* Bottom Overlay Pill on Hover */}
                <div className="absolute bottom-3 right-3 opacity-90 group-hover:opacity-100 transition-opacity">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/95 text-[#0F172A] text-xs font-semibold shadow-md backdrop-blur-sm group-hover:bg-[#FF6B00] group-hover:text-white transition-colors">
                    <span>{activeProduct.action === 'custom' ? 'Launch Sizer' : 'View Product'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Spotlight Product Details */}
              <div className="mt-4 px-1">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-medium text-slate-600">{activeProduct.category}</span>
                  <div className="flex items-center gap-1 text-slate-700 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-[#FF7A00] text-[#FF7A00]" />
                    <span>{activeProduct.rating}</span>
                    <span className="text-slate-400 font-normal">({activeProduct.reviews})</span>
                  </div>
                </div>

                <h3
                  onClick={() => handleSpotlightAction(activeProduct.action)}
                  className="text-base sm:text-lg font-bold text-[#0F172A] hover:text-[#FF6B00] transition cursor-pointer line-clamp-1"
                >
                  {activeProduct.name}
                </h3>

                <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {activeProduct.description}
                </p>

                {/* Price & Spec Row */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-[#0F172A]">
                      {activeProduct.price}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {activeProduct.listPrice}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
                    {activeProduct.spec}
                  </span>
                </div>
              </div>

              {/* 4 Interactive Spotlight Product Thumbs Switcher */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-4 gap-2">
                {SPOTLIGHT_PRODUCTS.map((prod, index) => {
                  const isActive = index === activeSpotlightIdx;
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => setActiveSpotlightIdx(index)}
                      className={`relative aspect-square rounded-xl overflow-hidden p-0.5 transition-all cursor-pointer ${
                        isActive
                          ? 'ring-2 ring-[#FF6B00] ring-offset-2 scale-[1.02] shadow-sm'
                          : 'opacity-70 hover:opacity-100 hover:scale-[1.01]'
                      }`}
                      aria-label={`Show ${prod.name}`}
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        loading="lazy"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-[#FF6B00]/10 rounded-lg pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. REPLACED AMAZON QUAD-CARDS -> 4 EDITORIAL DTC CARDS       */}
      {/* ============================================================ */}
      <div className="relative max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 pb-14">
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6B00] mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Curated Collections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Designed for Daily Living &amp; Play
            </h2>
          </div>
          <button
            type="button"
            onClick={onExploreCatalog}
            className="text-xs sm:text-sm font-semibold text-[#FF6B00] hover:text-[#FF7A00] flex items-center gap-1 group cursor-pointer self-start sm:self-auto"
          >
            <span>View All 180+ Products</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 4 Spacious Modern Editorial Collection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EDITORIAL_CARDS.map((card) => (
            <div
              key={card.id}
              className="group bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_40px_rgba(255,107,0,0.08)] border border-slate-200/80 hover:border-orange-200/80 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header Tag & Price */}
                <div className="flex items-center justify-between mb-3.5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-50/90 text-[#FF6B00] text-[10px] font-extrabold tracking-wider border border-orange-200/70">
                    {card.tag}
                  </span>
                  <span className="text-xs font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
                    {card.price}
                  </span>
                </div>

                {/* Primary Visual Showcase */}
                <div
                  onClick={() => handleSpotlightAction(card.action)}
                  className="relative aspect-[4/3] rounded-xl bg-slate-50 overflow-hidden mb-4 border border-slate-100 cursor-pointer"
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Secondary Floating Mini Thumbnail */}
                  <div className="absolute bottom-2.5 right-2.5 w-12 h-12 rounded-lg bg-white/95 p-0.5 shadow-md border border-slate-200/80 overflow-hidden">
                    <img
                      src={card.secondaryImage}
                      alt="Companion"
                      loading="lazy"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                </div>

                {/* Card Title & Description */}
                <h3
                  onClick={() => handleSpotlightAction(card.action)}
                  className="text-lg font-bold text-[#0F172A] group-hover:text-[#FF6B00] transition cursor-pointer leading-snug"
                >
                  {card.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {card.subtitle}
                </p>

                {/* Feature Pills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {card.badges.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60"
                    >
                      <Check className="w-2.5 h-2.5 text-[#FF6B00]" />
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleSpotlightAction(card.action)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 group-hover:bg-[#FF6B00] text-slate-700 group-hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>{card.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. MINIMALIST DEPARTMENT QUICK EXPLORER STRIP                */}
      {/* ============================================================ */}
      <div className="relative max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 pb-12">
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#0F172A]">
                Shop by Department
              </h3>
              <p className="text-xs text-slate-500 hidden sm:block">
                180+ on-demand 3D printed products ready for every room
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onSelectRoom('all');
                onExploreCatalog();
              }}
              className="text-xs font-semibold text-[#FF6B00] hover:text-[#FF7A00] hover:underline cursor-pointer"
            >
              Browse all departments →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-3">
            {DTC_DEPARTMENTS.map((dept) => (
              <button
                key={dept.id}
                type="button"
                onClick={() => {
                  if (dept.id === 'custom_studio') {
                    onLaunchCustomizer();
                  } else {
                    onSelectRoom(dept.id);
                    onExploreCatalog();
                  }
                }}
                className="group flex flex-col items-center text-center p-2 rounded-xl hover:bg-orange-50/50 transition cursor-pointer border border-transparent hover:border-orange-200/50"
              >
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-slate-50 border border-slate-200 group-hover:border-[#FF6B00] shadow-xs transition duration-300">
                  <img
                    src={dept.image}
                    alt={dept.label}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  {dept.pill && (
                    <span className="absolute bottom-0 inset-x-0 bg-[#FF6B00] text-white text-[8px] font-extrabold uppercase tracking-wider py-0.5">
                      {dept.pill}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-[#FF6B00] mt-2 leading-tight line-clamp-1">
                  {dept.label}
                </span>
                <span className="text-[10px] text-slate-500 leading-tight line-clamp-1">
                  {dept.sub}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
