/**
 * AMAZON-STYLE HERO SECTION FOR WAVEZLY
 * Multi-slide banner carousel celebrating Wavezly as the Amazon of 3D printing,
 * with the iconic 4 overlaid merchandising quad-cards.
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Box, Check } from 'lucide-react';
import { RoomId } from '../../lib/storefront';

interface AmazonHeroProps {
  onSelectRoom: (room: RoomId) => void;
  onExploreCatalog: () => void;
  onLaunchCustomizer: () => void;
}

const HERO_SLIDES = [
  {
    id: 1,
    badge: 'THE EVERYTHING 3D MARKETPLACE',
    title: 'The Everything 3D Print Marketplace',
    subtitle: 'Thousands of viral 3D prints, home organizers, gadgets, and toys printed on-demand in the USA.',
    highlight: 'Over 500+ industrial print farm nodes across the USA • Ships in 48 hours',
    bgGradient: 'from-[#0f172a] via-[#1e293b] to-[#0f3443]',
    ctaText: 'Shop 3D marketplace',
    action: 'all',
  },
  {
    id: 2,
    badge: 'VIRAL MAKER & TIKTOK HITS',
    title: 'Trending 3D Toys & Gadgets',
    subtitle: 'Articulated Crystal Dragons, Dual-Axis Gyro Cubes, Spiral Planters & MagSafe Docks.',
    highlight: 'Silky dual-color co-extrusion, glow filaments, and matte architectural biopolymers',
    bgGradient: 'from-[#1e1035] via-[#311054] to-[#4c1d95]',
    ctaText: 'Explore trending prints',
    action: 'toys',
  },
  {
    id: 3,
    badge: '100% FIT GUARANTEE • 48H SHIP',
    title: 'Custom Made to Measure',
    subtitle: 'Need an exact millimeter fit? Custom drawer grids, car cup adapters, and workshop brackets made in 48h.',
    highlight: 'Sub-millimeter parametric CAD • If it doesn’t fit your exact cavity, we remake it free',
    bgGradient: 'from-[#082f49] via-[#0f3b56] to-[#005f73]',
    ctaText: 'Start custom sizing',
    action: 'custom',
  },
];

export const AmazonHero: React.FC<AmazonHeroProps> = ({
  onSelectRoom,
  onExploreCatalog,
  onLaunchCustomizer,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  const handleHeroCta = () => {
    if (slide.action === 'custom') {
      onLaunchCustomizer();
    } else {
      onSelectRoom('all');
      onExploreCatalog();
    }
  };

  return (
    <div className="relative w-full bg-[#e3e6e6] pb-10 font-sans select-none overflow-hidden">
      {/* ============================================================ */}
      {/* 1. TOP CAROUSEL HERO BANNER                                  */}
      {/* ============================================================ */}
      <div
        className={`relative h-[360px] sm:h-[420px] lg:h-[480px] bg-gradient-to-r ${slide.bgGradient} text-white transition-all duration-700 ease-in-out`}
      >
        {/* Soft Radial Ambient Lighting */}
        <div className="absolute inset-0 bg-black/25" />

        {/* Amazon Bottom Gradient Fade into Gray Page Backdrop */}
        <div className="absolute inset-x-0 bottom-0 h-44 sm:h-56 bg-gradient-to-t from-[#e3e6e6] via-[#e3e6e6]/80 to-transparent pointer-events-none" />

        {/* Carousel Content */}
        <div className="relative max-w-[1520px] mx-auto px-4 sm:px-8 h-full flex flex-col justify-center pt-2 sm:pt-0 max-w-2xl sm:max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#ffd814] text-xs font-bold tracking-wider uppercase mb-3 w-fit border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-[#ffd814]" />
            <span>{slide.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-sm">
            {slide.title}
          </h1>

          <p className="mt-3 text-sm sm:text-lg text-zinc-100 font-medium max-w-xl leading-relaxed">
            {slide.subtitle}
          </p>
          <p className="mt-1 text-xs sm:text-sm text-amber-200 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ffd814] inline-block animate-pulse" />
            {slide.highlight}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleHeroCta}
              className="h-11 px-6 rounded-md bg-[#ffd814] hover:bg-[#f7ca00] text-zinc-950 font-bold text-sm shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onLaunchCustomizer}
              className="h-11 px-5 rounded-md bg-[#ffa41c] hover:bg-[#fa8900] text-zinc-950 font-bold text-sm shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Box className="w-4 h-4" />
              <span>Custom 3D Fit</span>
            </button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-28 sm:bottom-36 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {HERO_SLIDES.map((s, index) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === index ? 'w-8 bg-[#ffd814]' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Prev / Next Arrows */}
        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
          className="absolute left-2 sm:left-4 top-1/3 -translate-y-1/2 p-2 sm:p-3 rounded-md text-white/80 hover:text-white hover:bg-black/40 transition cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
        </button>
        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
          className="absolute right-2 sm:right-4 top-1/3 -translate-y-1/2 p-2 sm:p-3 rounded-md text-white/80 hover:text-white hover:bg-black/40 transition cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
        </button>
      </div>

      {/* ============================================================ */}
      {/* 2. THE ICONIC AMAZON OVERLAID 4 QUAD-CARDS                   */}
      {/* ============================================================ */}
      <div className="relative max-w-[1520px] mx-auto px-3 sm:px-6 -mt-24 sm:-mt-36 lg:-mt-44 z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* -------------------------------------------------------- */}
          {/* QUAD CARD 1: Trending 3D Prints & Toys                   */}
          {/* -------------------------------------------------------- */}
          <div className="bg-white p-4 sm:p-5 rounded-sm shadow-md flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 leading-tight mb-3">
                Trending 3D Prints & Toys
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. Crystal Dragon */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectRoom('all');
                    onExploreCatalog();
                  }}
                  className="group text-left cursor-pointer"
                >
                  <div className="aspect-square bg-zinc-900 rounded overflow-hidden relative border border-zinc-200">
                    <img
                      src="/assets/products/crystal-dragon-hero.svg"
                      alt="Articulated Crystal Dragon"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-bold text-[#ffd814]">
                      $18.99
                    </span>
                  </div>
                  <span className="text-xs text-zinc-800 font-medium line-clamp-1 mt-1 group-hover:text-[#c7511f]">
                    Crystal Dragon
                  </span>
                </button>

                {/* 2. Low-Poly Planter */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectRoom('living');
                    onExploreCatalog();
                  }}
                  className="group text-left cursor-pointer"
                >
                  <div className="aspect-square bg-zinc-900 rounded overflow-hidden relative border border-zinc-200">
                    <img
                      src="/assets/products/low-poly-planter-hero.svg"
                      alt="Low-Poly Planter"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-bold text-[#ffd814]">
                      $14.50
                    </span>
                  </div>
                  <span className="text-xs text-zinc-800 font-medium line-clamp-1 mt-1 group-hover:text-[#c7511f]">
                    Low-Poly Planter
                  </span>
                </button>

                {/* 3. Gyro Cube */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectRoom('workspace');
                    onExploreCatalog();
                  }}
                  className="group text-left cursor-pointer"
                >
                  <div className="aspect-square bg-zinc-900 rounded overflow-hidden relative border border-zinc-200">
                    <img
                      src="/assets/products/gyro-cube-hero.svg"
                      alt="Dual-Axis Gyro Cube"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-bold text-[#ffd814]">
                      $16.00
                    </span>
                  </div>
                  <span className="text-xs text-zinc-800 font-medium line-clamp-1 mt-1 group-hover:text-[#c7511f]">
                    Gyro Cube
                  </span>
                </button>

                {/* 4. MagSafe Orbit */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectRoom('workspace');
                    onExploreCatalog();
                  }}
                  className="group text-left cursor-pointer"
                >
                  <div className="aspect-square bg-zinc-900 rounded overflow-hidden relative border border-zinc-200">
                    <img
                      src="/assets/products/magsafe-orbit-hero.svg"
                      alt="MagSafe Orbit Dock"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-bold text-[#ffd814]">
                      $24.00
                    </span>
                  </div>
                  <span className="text-xs text-zinc-800 font-medium line-clamp-1 mt-1 group-hover:text-[#c7511f]">
                    MagSafe Orbit
                  </span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectRoom('all');
                onExploreCatalog();
              }}
              className="mt-4 text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline text-left block"
            >
              See more viral 3D prints & toys
            </button>
          </div>

          {/* -------------------------------------------------------- */}
          {/* QUAD CARD 2: Kitchen & Dining Essentials                 */}
          {/* -------------------------------------------------------- */}
          <div className="bg-white p-4 sm:p-5 rounded-sm shadow-md flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 leading-tight mb-3">
                Kitchen & Dining Essentials
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. Cutlery Matrix */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectRoom('kitchen');
                    onExploreCatalog();
                  }}
                  className="group text-left cursor-pointer"
                >
                  <div className="aspect-square bg-zinc-100 rounded overflow-hidden relative border border-zinc-200">
                    <img
                      src="/assets/products/kitchen-cutlery-matrix-hero.svg"
                      alt="Cutlery Matrix"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-bold text-[#ffd814]">
                      $32.00
                    </span>
                  </div>
                  <span className="text-xs text-zinc-800 font-medium line-clamp-1 mt-1 group-hover:text-[#c7511f]">
                    Cutlery Matrix
                  </span>
                </button>

                {/* 2. 3-Tier Spice Riser */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectRoom('kitchen');
                    onExploreCatalog();
                  }}
                  className="group text-left cursor-pointer"
                >
                  <div className="aspect-square bg-zinc-100 rounded overflow-hidden relative border border-zinc-200">
                    <img
                      src="/assets/products/spice-pantry-tier-hero.svg"
                      alt="3-Tier Spice Riser"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-bold text-[#ffd814]">
                      $22.50
                    </span>
                  </div>
                  <span className="text-xs text-zinc-800 font-medium line-clamp-1 mt-1 group-hover:text-[#c7511f]">
                    3-Tier Spice Riser
                  </span>
                </button>

                {/* 3. Espresso Valet */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectRoom('kitchen');
                    onExploreCatalog();
                  }}
                  className="group text-left cursor-pointer"
                >
                  <div className="aspect-square bg-zinc-100 rounded overflow-hidden relative border border-zinc-200">
                    <img
                      src="/assets/products/pourover-coffee-tray-real.jpg"
                      alt="Espresso Valet"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-bold text-[#ffd814]">
                      $28.00
                    </span>
                  </div>
                  <span className="text-xs text-zinc-800 font-medium line-clamp-1 mt-1 group-hover:text-[#c7511f]">
                    Espresso Valet
                  </span>
                </button>

                {/* 4. Fridge Storage Bins */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectRoom('kitchen');
                    onExploreCatalog();
                  }}
                  className="group text-left cursor-pointer"
                >
                  <div className="aspect-square bg-zinc-100 rounded overflow-hidden relative border border-zinc-200">
                    <img
                      src="https://oss-cf.cjdropshipping.com/product/2024/07/24/02/2d681fb9-91e7-4f45-ac40-1ff900749d44_trans.jpeg"
                      alt="Fridge Storage Bins"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-bold text-[#ffd814]">
                      $15.99
                    </span>
                  </div>
                  <span className="text-xs text-zinc-800 font-medium line-clamp-1 mt-1 group-hover:text-[#c7511f]">
                    Fridge Storage Bins
                  </span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectRoom('kitchen');
                onExploreCatalog();
              }}
              className="mt-4 text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline text-left block"
            >
              See more in Kitchen & Dining
            </button>
          </div>

          {/* -------------------------------------------------------- */}
          {/* QUAD CARD 3: Electronics & Gaming                        */}
          {/* -------------------------------------------------------- */}
          <div className="bg-white p-4 sm:p-5 rounded-sm shadow-md flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 leading-tight mb-3">
                Electronics & Gaming
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. Dual Controller Plinth */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectRoom('workspace');
                    onExploreCatalog();
                  }}
                  className="group text-left cursor-pointer"
                >
                  <div className="aspect-square bg-zinc-100 rounded overflow-hidden relative border border-zinc-200">
                    <img
                      src="/assets/products/controller-dock-real.jpg"
                      alt="Dual Controller Plinth"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-bold text-[#ffd814]">
                      $26.00
                    </span>
                  </div>
                  <span className="text-xs text-zinc-800 font-medium line-clamp-1 mt-1 group-hover:text-[#c7511f]">
                    Dual Controller Plinth
                  </span>
                </button>

                {/* 2. Headphone Stand */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectRoom('workspace');
                    onExploreCatalog();
                  }}
                  className="group text-left cursor-pointer"
                >
                  <div className="aspect-square bg-zinc-100 rounded overflow-hidden relative border border-zinc-200">
                    <img
                      src="/assets/products/headphone-plinth-real.jpg"
                      alt="Headphone Stand"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-bold text-[#ffd814]">
                      $38.00
                    </span>
                  </div>
                  <span className="text-xs text-zinc-800 font-medium line-clamp-1 mt-1 group-hover:text-[#c7511f]">
                    Headphone Stand
                  </span>
                </button>

                {/* 3. Cable Raceway */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectRoom('workspace');
                    onExploreCatalog();
                  }}
                  className="group text-left cursor-pointer"
                >
                  <div className="aspect-square bg-zinc-100 rounded overflow-hidden relative border border-zinc-200">
                    <img
                      src="/assets/products/smart-cable-spine-hero.svg"
                      alt="Cable Raceway"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-bold text-[#ffd814]">
                      $19.50
                    </span>
                  </div>
                  <span className="text-xs text-zinc-800 font-medium line-clamp-1 mt-1 group-hover:text-[#c7511f]">
                    Cable Raceway
                  </span>
                </button>

                {/* 4. Mechanical Keyboard Station */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectRoom('workspace');
                    onExploreCatalog();
                  }}
                  className="group text-left cursor-pointer"
                >
                  <div className="aspect-square bg-zinc-100 rounded overflow-hidden relative border border-zinc-200">
                    <img
                      src="/assets/products/keeb-lube-station-real.jpg"
                      alt="Mechanical Keyboard Station"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-bold text-[#ffd814]">
                      $29.00
                    </span>
                  </div>
                  <span className="text-xs text-zinc-800 font-medium line-clamp-1 mt-1 group-hover:text-[#c7511f]">
                    Keyboard Station
                  </span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectRoom('workspace');
                onExploreCatalog();
              }}
              className="mt-4 text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline text-left block"
            >
              Shop Electronics & Gaming
            </button>
          </div>

          {/* -------------------------------------------------------- */}
          {/* QUAD CARD 4: Wavezly Custom 3D Studio                    */}
          {/* -------------------------------------------------------- */}
          <div className="bg-white p-4 sm:p-5 rounded-sm shadow-md flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-block px-2 py-0.5 rounded bg-orange-100 text-orange-800 text-[10px] font-bold uppercase tracking-wider">
                  100% FIT GUARANTEE
                </span>
                <span className="text-[11px] font-semibold text-[#007600] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Ships in 48h
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 leading-tight mb-2">
                Wavezly Custom 3D Studio
              </h2>
              <p className="text-xs text-zinc-600 mb-3 leading-relaxed">
                Need an exact millimeter fit? Custom drawer grids, car cup adapters, and workshop brackets made on demand.
              </p>

              {/* Visual Showcase */}
              <div
                onClick={onLaunchCustomizer}
                className="aspect-[4/3] rounded bg-zinc-900 relative overflow-hidden group cursor-pointer border border-zinc-200"
              >
                <img
                  src="/assets/products/drawer-matrix-real.jpg"
                  alt="Custom Drawer Matrix"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-3">
                  <div className="text-white text-xs font-bold flex items-center gap-1.5 mb-0.5">
                    <Box className="w-4 h-4 text-[#ffd814]" />
                    <span>Parametric 3D Studio</span>
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    Measure any drawer or cavity to the exact millimeter
                  </p>
                </div>
              </div>

              {/* 3 Core Value Pillars */}
              <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
                <div className="bg-zinc-50 border border-zinc-200 rounded p-1.5">
                  <p className="text-[10px] font-bold text-zinc-900 leading-tight">Measure Any</p>
                  <p className="text-[9px] text-zinc-500">Drawer or Space</p>
                </div>
                <div className="bg-amber-50/70 border border-amber-200/60 rounded p-1.5">
                  <p className="text-[10px] font-bold text-amber-900 leading-tight">100% Fit</p>
                  <p className="text-[9px] text-amber-700">Guarantee</p>
                </div>
                <div className="bg-zinc-50 border border-zinc-200 rounded p-1.5">
                  <p className="text-[10px] font-bold text-zinc-900 leading-tight">Fast USA</p>
                  <p className="text-[9px] text-zinc-500">Ships in 48h</p>
                </div>
              </div>

              {/* Amazon Yellow/Orange CTA Button */}
              <button
                type="button"
                onClick={onLaunchCustomizer}
                className="mt-3.5 w-full h-9 rounded-md bg-[#ffd814] hover:bg-[#f7ca00] text-zinc-950 font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Box className="w-3.5 h-3.5" />
                <span>Launch Custom 3D Studio</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onLaunchCustomizer}
              className="mt-3 text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline text-left block"
            >
              Design your custom fit now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
