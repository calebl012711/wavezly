/**
 * WAVEZLY HERO & SHOWCASE
 * Clean DTC aesthetic:
 * - Crisp human copy (no AI buzzwords or fake telemetry)
 * - 100% responsive on mobile (zero horizontal blowout)
 * - 4 Flagship showcase items with smooth switching
 * - 4 Clean category feature cards
 */

import React, { useState } from 'react';
import {
  Box,
  Star,
  Truck,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  ArrowUpRight,
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

export const AmazonHero: React.FC<AmazonHeroProps> = ({
  onSelectRoom,
  onExploreCatalog,
  onLaunchCustomizer,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeProduct = SPOTLIGHT_PRODUCTS[activeIdx];

  const handleAction = (action: RoomId | 'custom') => {
    if (action === 'custom') {
      onLaunchCustomizer();
    } else {
      onSelectRoom(action);
      onExploreCatalog();
    }
  };

  return (
    <div className="w-full bg-[#FAFAFA] text-[#0F172A] font-sans overflow-x-hidden">
      {/* 1. HERO SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Typography & Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Simple Trust Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-[#FF6B00] text-xs font-semibold self-start mb-4">
              <span>Made to order in the USA</span>
              <span className="text-zinc-300">•</span>
              <span>Ships in 48 hours</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-[1.12]">
              Everyday goods,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FF8A00]">
                3D printed to order.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-3.5 sm:mt-4 text-sm sm:text-base text-zinc-600 max-w-lg leading-relaxed">
              From viral desk fidgets and ambient sculptural lighting to custom drawer organizers that fit your space down to the millimeter.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onExploreCatalog}
                className="h-11 sm:h-12 px-6 sm:px-7 rounded-full bg-[#FF6B00] hover:bg-[#ea5f00] text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Shop All Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onLaunchCustomizer}
                className="h-11 sm:h-12 px-5 sm:px-6 rounded-full bg-white hover:bg-zinc-50 text-zinc-800 font-semibold text-xs sm:text-sm border border-zinc-200 transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-xs"
              >
                <Box className="w-4 h-4 text-[#FF6B00]" />
                <span>Custom Drawer Sizer</span>
              </button>
            </div>

            {/* Quality & Shipping Badges */}
            <div className="mt-6 pt-5 border-t border-zinc-200/80 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-600">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-[#0F172A]">4.9</span>
                <span className="text-zinc-500">(12,000+ orders)</span>
              </div>
              <span className="hidden sm:inline text-zinc-300">•</span>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Free US shipping over $35</span>
              </div>
              <span className="hidden sm:inline text-zinc-300">•</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>100% Fit Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right: Clean Spotlight Showcase Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/80 shadow-xs">
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
                        onClick={() => setActiveIdx(idx)}
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
