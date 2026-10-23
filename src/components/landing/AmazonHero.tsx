/**
 * AMAZON-STYLE HERO SECTION
 * Multi-slide banner carousel with the iconic 4 overlaid department quad-cards.
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Box } from 'lucide-react';
import { RoomId } from '../../lib/storefront';

interface AmazonHeroProps {
  onSelectRoom: (room: RoomId) => void;
  onExploreCatalog: () => void;
  onLaunchCustomizer: () => void;
}

const HERO_SLIDES = [
  {
    id: 1,
    title: 'Spring Organization Event',
    subtitle: 'Custom drawer organizers tailored to your exact millimeters.',
    highlight: 'Up to 25% off best-selling home and kitchen modules.',
    bgGradient: 'from-[#0f2027] via-[#203a43] to-[#2c5364]',
    ctaText: 'Shop the event',
    action: 'deals',
    badge: 'LIMITED TIME EVENT',
  },
  {
    id: 2,
    title: 'No more loose sliding bins.',
    subtitle: '100% Guaranteed Snug Fit. If it doesn’t fit, we remake it free.',
    highlight: 'Made to measure in Boise, Idaho. Ships in 48 hours.',
    bgGradient: 'from-[#1e3c72] via-[#2a5298] to-[#2e3192]',
    ctaText: 'Start custom sizing',
    action: 'custom',
    badge: 'PRIME GUARANTEE',
  },
  {
    id: 3,
    title: 'Morning Routines, Perfected.',
    subtitle: 'Dedicated stations for espresso, pour-overs, serums, and EDC gear.',
    highlight: 'Velvet-matte organic biopolymer and volcanic basalt stone.',
    bgGradient: 'from-[#3a1c71] via-[#d76d77] to-[#ffaf7b]',
    ctaText: 'Explore collections',
    action: 'kitchen',
    badge: 'NEW ARRIVALS',
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
    } else if (slide.action === 'deals') {
      onSelectRoom('deals');
      onExploreCatalog();
    } else {
      onSelectRoom('kitchen');
      onExploreCatalog();
    }
  };

  return (
    <div className="relative w-full bg-[#e3e6e6] pb-8 font-sans select-none overflow-hidden">
      {/* ============================================================ */}
      {/* 1. TOP CAROUSEL HERO BANNER                                  */}
      {/* ============================================================ */}
      <div className={`relative h-[320px] sm:h-[400px] lg:h-[460px] bg-gradient-to-r ${slide.bgGradient} text-white transition-all duration-700 ease-in-out`}>
        {/* Soft Radial Ambient Lighting */}
        <div className="absolute inset-0 bg-black/25" />

        {/* Amazon Bottom Gradient Fade into Gray Page Backdrop */}
        <div className="absolute inset-x-0 bottom-0 h-44 sm:h-56 bg-gradient-to-t from-[#e3e6e6] via-[#e3e6e6]/80 to-transparent pointer-events-none" />

        {/* Carousel Content */}
        <div className="relative max-w-[1520px] mx-auto px-4 sm:px-8 h-full flex flex-col justify-center pt-4 sm:pt-0 max-w-2xl sm:max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-300 text-xs font-bold tracking-wider uppercase mb-3 w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{slide.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {slide.title}
          </h1>

          <p className="mt-3 text-sm sm:text-lg text-zinc-100 font-medium max-w-xl">
            {slide.subtitle}
          </p>
          <p className="mt-1 text-xs sm:text-sm text-amber-200 font-semibold">
            {slide.highlight}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={handleHeroCta}
              className="h-11 px-6 rounded-md bg-[#ffd814] hover:bg-[#f7ca00] text-zinc-950 font-bold text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onLaunchCustomizer}
              className="h-11 px-5 rounded-md bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-sm border border-white/40 transition cursor-pointer"
            >
              Custom 3D Fit
            </button>
          </div>
        </div>

        {/* Prev / Next Arrows */}
        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
          className="absolute left-2 top-1/3 -translate-y-1/2 p-3 rounded text-white/80 hover:text-white hover:bg-black/30 transition cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-8 h-8 stroke-[2.5]" />
        </button>
        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
          className="absolute right-2 top-1/3 -translate-y-1/2 p-3 rounded text-white/80 hover:text-white hover:bg-black/30 transition cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-8 h-8 stroke-[2.5]" />
        </button>
      </div>

      {/* ============================================================ */}
      {/* 2. THE ICONIC AMAZON OVERLAID 4 QUAD-CARDS                   */}
      {/* ============================================================ */}
      <div className="relative max-w-[1520px] mx-auto px-3 sm:px-6 -mt-24 sm:-mt-36 lg:-mt-48 z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* CARD 1: Kitchen & Dining */}
          <div className="bg-white p-4 sm:p-5 rounded-sm shadow-md flex flex-col justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 leading-tight mb-3">
                Top picks for your kitchen
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onSelectRoom('kitchen');
                    onExploreCatalog();
                  }}
                  className="group text-left"
                >
                  <div className="aspect-square bg-zinc-100 rounded overflow-hidden">
                    <img
                      src="/assets/products/pourover-coffee-tray-real.jpg"
                      alt="Coffee Station"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <span className="text-xs text-zinc-700 font-medium line-clamp-1 mt-1 group-hover:text-[#c7511f]">
                    Coffee Station
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectRoom('kitchen');
                    onExploreCatalog();
                  }}
                  className="group text-left"
                >
                  <div className="aspect-square bg-zinc-100 rounded overflow-hidden">
                    <img
                      src="/assets/products/desk-coasters-real.jpg"
                      alt="Stone Coasters"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <span className="text-xs text-zinc-700 font-medium line-clamp-1 mt-1 group-hover:text-[#c7511f]">
                    Stone Coasters
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectRoom('kitchen');
                    onExploreCatalog();
                  }}
                  className="group text-left"
                >
                  <div className="aspect-square bg-zinc-100 rounded overflow-hidden">
                    <img
                      src="/assets/products/kitchen-cutlery-matrix-hero.svg"
                      alt="Cutlery Matrix"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <span className="text-xs text-zinc-700 font-medium line-clamp-1 mt-1 group-hover:text-[#c7511f]">
                    Cutlery Matrix
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectRoom('kitchen');
                    onExploreCatalog();
                  }}
                  className="group text-left"
                >
                  <div className="aspect-square bg-zinc-100 rounded overflow-hidden">
                    <img
                      src="/assets/products/spice-pantry-tier-hero.svg"
                      alt="Spice Pantry Tier"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <span className="text-xs text-zinc-700 font-medium line-clamp-1 mt-1 group-hover:text-[#c7511f]">
                    Spice Tier
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

          {/* CARD 2: Vanity & Skincare */}
          <div className="bg-white p-4 sm:p-5 rounded-sm shadow-md flex flex-col justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 leading-tight mb-3">
                Vanity & bathroom refresh
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onSelectRoom('vanity');
                    onExploreCatalog();
                  }}
                  className="group text-left"
                >
                  <div className="aspect-square bg-zinc-100 rounded overflow-hidden">
                    <img
                      src="/assets/products/vanity-matrix-real.jpg"
                      alt="Vanity Matrix"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <span className="text-xs text-zinc-700 font-medium line-clamp-1 mt-1 group-hover:text-[#c7511f]">
                    Skincare Grid
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectRoom('bedside');
                    onExploreCatalog();
                  }}
                  className="group text-left"
                >
                  <div className="aspect-square bg-zinc-100 rounded overflow-hidden">
                    <img
                      src="/assets/products/watch-jewelry-caddy-real.jpg"
                      alt="Ring & Watch Tray"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <span className="text-xs text-zinc-700 font-medium line-clamp-1 mt-1 group-hover:text-[#c7511f]">
                    Watch & Rings
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectRoom('vanity');
                    onExploreCatalog();
                  }}
                  className="group text-left"
                >
                  <div className="aspect-square bg-zinc-100 rounded overflow-hidden">
                    <img
                      src="/assets/products/grooming-stand-hero.svg"
                      alt="Grooming Stand"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <span className="text-xs text-zinc-700 font-medium line-clamp-1 mt-1 group-hover:text-[#c7511f]">
                    Toothbrush Stand
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectRoom('workspace');
                    onExploreCatalog();
                  }}
                  className="group text-left"
                >
                  <div className="aspect-square bg-zinc-100 rounded overflow-hidden">
                    <img
                      src="/assets/products/desk-vacuum-real.jpg"
                      alt="Mini Vacuum"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <span className="text-xs text-zinc-700 font-medium line-clamp-1 mt-1 group-hover:text-[#c7511f]">
                    Mini Vacuum
                  </span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectRoom('vanity');
                onExploreCatalog();
              }}
              className="mt-4 text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline text-left block"
            >
              Explore bathroom & vanity
            </button>
          </div>

          {/* CARD 3: Custom 3D Fit (The Made to Order Feature) */}
          <div className="bg-white p-4 sm:p-5 rounded-sm shadow-md flex flex-col justify-between">
            <div>
              <div className="inline-block px-2 py-0.5 rounded bg-orange-100 text-orange-800 text-[10px] font-bold uppercase tracking-wider mb-2">
                100% FIT GUARANTEE
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 leading-tight mb-2">
                Custom 3D Fit: Made for you
              </h2>
              <p className="text-xs text-zinc-600 mb-3 leading-relaxed">
                Enter your exact drawer or counter cavity millimeters. Handcrafted on demand in 48 hours.
              </p>

              <div
                onClick={onLaunchCustomizer}
                className="aspect-[4/3] rounded bg-zinc-900 relative overflow-hidden group cursor-pointer"
              >
                <img
                  src="/assets/products/drawer-matrix-real.jpg"
                  alt="Custom Drawer Matrix"
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <div className="text-white text-xs font-semibold flex items-center gap-1.5">
                    <Box className="w-4 h-4 text-[#febd69]" />
                    <span>Launch 3D Customizer</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onLaunchCustomizer}
              className="mt-4 text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline text-left block"
            >
              Design your custom fit now
            </button>
          </div>

          {/* CARD 4: Today's Deals Spotlight */}
          <div className="bg-white p-4 sm:p-5 rounded-sm shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-[#cc0c39] text-white text-[11px] font-bold">
                  Up to 25% off
                </span>
                <span className="text-xs font-bold text-[#cc0c39]">Limited time deal</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 leading-tight mb-2">
                Today's Deals in Home & Desk
              </h2>

              <button
                type="button"
                onClick={() => {
                  onSelectRoom('deals');
                  onExploreCatalog();
                }}
                className="w-full text-left group"
              >
                <div className="aspect-[4/3] bg-zinc-100 rounded overflow-hidden">
                  <img
                    src="/assets/products/felt-mat-real.jpg"
                    alt="Soft Felt Mat Deal"
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="mt-2.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-zinc-900">$34.00</span>
                    <span className="text-xs text-zinc-500 line-through">List: $42.00</span>
                  </div>
                  <p className="text-xs text-zinc-700 font-medium line-clamp-1 mt-0.5">
                    SnugFit Dual-Sided Merino Eco-Felt Mat
                  </p>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectRoom('deals');
                onExploreCatalog();
              }}
              className="mt-4 text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline text-left block"
            >
              See all deals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
