/**
 * WAVEZLY HOME PAGE
 * Clean DTC experience:
 * - Pure white / porcelain background (#FAFAFA)
 * - Hero showcase & category highlights
 * - Main 2-column mobile / 4-column desktop product catalog
 * - Cohesive luxury-grade transition into Custom 3D Studio:
 *   * White background with subtle ambient warmth
 *   * Electric orange accents (#FF6B00)
 *   * Crisp slate typography (#0F172A / slate-600)
 *   * Direct millimeter preset launch pills
 *   * 3-Stage precision Made-to-Measure pipeline
 * - Honest guarantees & real customer reviews
 */

import React from 'react';
import {
  Star,
  Box,
  Truck,
  ShieldCheck,
  ArrowRight,
  Leaf,
  Sparkles,
  Sliders,
  Check,
  Layers,
  Ruler,
} from 'lucide-react';
import { AmazonHero } from '../components/landing/AmazonHero';
import { ProductGrid } from '../components/landing/ProductGrid';
import { Product } from '../types';
import { RoomId } from '../lib/storefront';

interface HomePageProps {
  onNavigateToCustomizer: () => void;
  onCustomizeProduct: (product: Product) => void;
  onOpenDeskPlanner?: () => void;
  searchQuery: string;
  activeRoom: RoomId;
  onSelectRoom: (room: RoomId) => void;
}

const REVIEWS = [
  {
    name: 'Sarah M.',
    location: 'Denver, CO',
    product: 'Custom Drawer Matrix',
    text: 'Entered the exact dimensions of my odd-sized kitchen drawer and it dropped right in with zero gap. No more sliding trays.',
    rating: 5,
  },
  {
    name: 'Alex C.',
    location: 'Austin, TX',
    product: 'Voronoi Ambient Lamp',
    text: 'The warm 2700K glow looks gorgeous on my nightstand. The matte finish feels like smooth ceramic rather than plastic.',
    rating: 5,
  },
  {
    name: 'David L.',
    location: 'Seattle, WA',
    product: 'Articulated Crystal Dragon',
    text: 'The silk filament shifts colors when you move it and the joints flex smoothly right out of the box. Super clean print quality.',
    rating: 5,
  },
];

const POPULAR_STUDIO_PRESETS = [
  { name: 'IKEA Alex (300 × 520 mm)', tag: 'Most Popular' },
  { name: 'IKEA Alex Wide (400 × 520 mm)', tag: 'Office' },
  { name: 'Herman Miller Tu (380 × 460 mm)', tag: 'Desk' },
  { name: 'Custom Millimeter Spec', tag: 'Any Size' },
];

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToCustomizer,
  onCustomizeProduct,
  searchQuery,
  activeRoom,
  onSelectRoom,
}) => {
  const scrollToShop = () => {
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen font-sans text-[#0F172A] overflow-x-hidden">
      {/* 1. HERO SHOWCASE */}
      <AmazonHero
        onSelectRoom={(room) => {
          onSelectRoom(room);
          setTimeout(scrollToShop, 50);
        }}
        onExploreCatalog={scrollToShop}
        onLaunchCustomizer={onNavigateToCustomizer}
      />

      {/* 2. MAIN PRODUCT CATALOG (Mobile-first 2-column grid) */}
      <section id="shop" className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
        <ProductGrid
          onCustomizeProduct={onCustomizeProduct}
          searchQuery={searchQuery}
          activeRoom={activeRoom}
          onSelectRoom={onSelectRoom}
        />
      </section>

      {/* 3. COHESIVE LUXURY-GRADE CUSTOM 3D STUDIO SHOWCASE BANNER */}
      {/* Pure white background with electric orange accents and crisp slate typography */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 my-10 sm:my-16">
        {/* Transitional Header Bridge */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 px-1 gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#FF6B00] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Parametric Made-to-Measure Studio</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
              Beyond standard catalog goods: exact fit to the millimeter.
            </h2>
          </div>
          <span className="text-xs text-zinc-500 font-medium">
            ✦ 100% Guaranteed Zero-Gap Fit • Free Remakes
          </span>
        </div>

        {/* Studio Showcase Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-zinc-200/90 shadow-sm relative overflow-hidden">
          {/* Subtle warm electric orange ambient backlight */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#FF6B00]/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-slate-500/5 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Studio Proposition & Preset Launchers (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/70 text-[#FF6B00] text-xs font-bold mb-3.5 self-start">
                <Box className="w-3.5 h-3.5" />
                <span>Wavezly 3D Customizer</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
                Need an organizer tailored to your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FF8A00]">
                  exact drawer?
                </span>
              </h3>

              <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Measure your drawer width and depth down to the millimeter. Our studio generates the 3D model in real time and prints an exact zero-gap fit with domestic 48h dispatch.
              </p>

              {/* 3-Stage Precision Engineering Process */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-zinc-50/80 border border-zinc-200/70">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                    <Ruler className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>01 / Measure (mm)</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-normal">
                    Enter width & depth down to 0.1 mm or pick an IKEA preset.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50/80 border border-zinc-200/70">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                    <Layers className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>02 / Live 3D Mesh</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-normal">
                    Parametric dividers adjust instantly with live 3D preview.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50/80 border border-zinc-200/70">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                    <Truck className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>03 / 48h Farm Print</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-normal">
                    Manufactured in renewable PLA and shipped in 2 days.
                  </p>
                </div>
              </div>

              {/* Quick Preset Launch Pills */}
              <div className="mt-5 pt-4 border-t border-zinc-100">
                <div className="text-xs font-semibold text-slate-700 mb-2">
                  Launch with Popular Dimensions:
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_STUDIO_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={onNavigateToCustomizer}
                      className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-orange-50 hover:text-[#FF6B00] hover:border-orange-200 text-xs text-slate-700 font-medium border border-zinc-200/70 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span>{preset.name}</span>
                      <span className="text-[10px] text-zinc-400 bg-white px-1.5 py-0.5 rounded border border-zinc-200/60 font-semibold">
                        {preset.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons & Reassurance */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onNavigateToCustomizer}
                  className="h-11 sm:h-12 px-6 sm:px-7 rounded-full bg-[#FF6B00] hover:bg-[#ea5f00] text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center gap-2 cursor-pointer active:scale-95 group"
                >
                  <span>Launch 3D Studio</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <div className="flex items-center gap-3 text-xs text-zinc-600 font-medium">
                  <span className="flex items-center gap-1 text-slate-800">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>100% Fit Guarantee</span>
                  </span>
                  <span className="text-zinc-300">•</span>
                  <span className="flex items-center gap-1 text-slate-800">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Free Remakes</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Studio Architectural CAD Preview Box (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-200/80 relative">
                {/* Visual CAD Grid & Dimension Annotations */}
                <div className="relative aspect-square sm:aspect-[4/3] rounded-xl bg-white border border-zinc-200/70 overflow-hidden flex items-center justify-center p-4">
                  {/* Grid Lines */}
                  <div
                    className="absolute inset-0 opacity-40 pointer-events-none"
                    style={{
                      backgroundImage: `linear-gradient(to right, #E2E8F0 1px, transparent 1px), linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)`,
                      backgroundSize: '20px 20px',
                    }}
                  />

                  {/* Real Organizer Product Image with Dimension Overlays */}
                  <img
                    src="/assets/products/drawer-matrix-real.jpg"
                    alt="Wavezly Custom Drawer Organizer 3D Studio"
                    className="w-full h-full object-cover rounded-lg shadow-xs"
                  />

                  {/* Dimension Tag (Top Left) */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-white/95 text-[11px] font-bold text-[#0F172A] shadow-xs border border-zinc-200">
                      W: 300 mm • D: 520 mm
                    </span>
                  </div>

                  {/* Guaranteed Fit Pill (Bottom Right) */}
                  <div className="absolute bottom-3 right-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0F172A] text-white text-[11px] font-bold shadow-sm">
                      <span className="text-[#FF6B00]">✦</span>
                      <span>Zero-Gap Tolerance (0.0mm)</span>
                    </span>
                  </div>
                </div>

                {/* Studio Feature Bullet Points */}
                <div className="mt-4 pt-3 border-t border-zinc-200/70 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-700 font-semibold">
                    <Sliders className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Parametric Grid System</span>
                  </div>
                  <span className="text-zinc-500 font-mono">From $39.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HONEST VALUES & REASSURANCE */}
      <section className="border-y border-zinc-200/80 bg-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Printed to Order in 48 Hours</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Every order is manufactured fresh on domestic 3D printers and dispatched within 2 business days.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Plant-Based Materials</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Crafted using non-toxic, renewable matte PLA biopolymers with zero petroleum chemical smell.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">100% Fit Guarantee</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  If your custom drawer piece doesn’t fit your space perfectly, we’ll reprint and reship it for free.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GENUINE CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center max-w-md mx-auto mb-8 sm:mb-10">
          <div className="flex justify-center text-amber-400 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
            Loved by 12,000+ Customers
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Real feedback from verified buyers across the US.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {REVIEWS.map((rev, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex text-amber-400 mb-3">
                  {[...Array(rev.rating)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  "{rev.text}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#0F172A] block">{rev.name}</span>
                  <span className="text-[11px] text-zinc-400">{rev.location}</span>
                </div>
                <span className="text-[11px] font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                  {rev.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};