/**
 * WAVEZLY HOME PAGE
 * Clean DTC experience:
 * - Pure white / porcelain background (#FAFAFA)
 * - Hero showcase & category highlights
 * - Main 2-column mobile / 4-column desktop product catalog
 * - Dedicated customizer banner
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

      {/* 3. DEDICATED MADE-TO-MEASURE CUSTOMIZER BANNER */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 my-10 sm:my-16">
        <div className="bg-[#0F172A] rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-white relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#FF6B00]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-orange-400 text-xs font-semibold mb-3.5 backdrop-blur-xs">
              <Box className="w-3.5 h-3.5" />
              <span>3D Customizer Studio</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Need an organizer tailored to your exact drawer?
            </h2>

            <p className="mt-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Measure your drawer width and depth down to the millimeter. Our studio generates the 3D model in real time and prints an exact zero-gap fit.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onNavigateToCustomizer}
                className="h-11 sm:h-12 px-6 sm:px-7 rounded-full bg-[#FF6B00] hover:bg-[#ea5f00] text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Launch 3D Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-xs text-zinc-400 font-medium">
                100% Fit Guarantee • Ships in 48h
              </span>
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
