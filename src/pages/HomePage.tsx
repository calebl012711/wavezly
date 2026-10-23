/**
 * SNUGFIT HOME PAGE
 * Hero → trust bar → shop by room → catalog → how custom works → reviews.
 */

import React from 'react';
import { Star, Truck, ShieldCheck, RotateCcw, Lock } from 'lucide-react';
import { HeroSection } from '../components/landing/HeroSection';
import { ProductGrid } from '../components/landing/ProductGrid';
import { Product } from '../types';
import { ROOMS, RoomId } from '../lib/storefront';

interface HomePageProps {
  onNavigateToCustomizer: () => void;
  onCustomizeProduct: (product: Product) => void;
  onOpenDeskPlanner?: () => void;
  searchQuery: string;
  activeRoom: RoomId;
  onSelectRoom: (room: RoomId) => void;
}

const ROOM_TILES: { id: RoomId; title: string; image: string }[] = [
  { id: 'kitchen', title: 'Kitchen & Coffee', image: '/assets/products/pourover-coffee-tray-real.jpg' },
  { id: 'vanity', title: 'Vanity & Bath', image: '/assets/products/vanity-matrix-real.jpg' },
  { id: 'bedside', title: 'Bedroom & Entry', image: '/assets/products/watch-jewelry-caddy-real.jpg' },
  { id: 'living', title: 'Living Room', image: '/assets/products/controller-dock-real.jpg' },
  { id: 'workspace', title: 'Home Office', image: '/assets/products/valet-pro-real.jpg' },
];

const REVIEWS = [
  {
    name: 'Jessica M.',
    title: 'Finally fits my kitchen drawer',
    text: 'I measured once, picked a color, and it arrived in four days. Zero sliding around. I wish I had done this years ago.',
  },
  {
    name: 'Daniel R.',
    title: 'Nice enough to leave on the nightstand',
    text: 'The watch tray looks great and feels solid. My keys don’t clatter anymore either.',
  },
  {
    name: 'Priya S.',
    title: 'My vanity looks so much calmer',
    text: 'Everything has a spot. Customer service helped me with sizing in minutes.',
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToCustomizer,
  onCustomizeProduct,
  searchQuery,
  activeRoom,
  onSelectRoom,
}) => {
  const scrollToShop = () =>
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="bg-[#f7f7f5]">
      <HeroSection onLaunchStudio={onNavigateToCustomizer} onExploreCatalog={scrollToShop} />

      {/* Trust bar */}
      <div className="bg-white border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-zinc-700">
          {[
            { icon: Truck, t: 'Free shipping', s: 'On orders over $60' },
            { icon: ShieldCheck, t: 'Fit guarantee', s: 'Fits or we remake it' },
            { icon: RotateCcw, t: 'Easy returns', s: '30 days, no hassle' },
            { icon: Lock, t: 'Secure checkout', s: 'Your info stays private' },
          ].map(({ icon: Icon, t, s }) => (
            <div key={t} className="flex items-center gap-3">
              <Icon className="w-6 h-6 text-orange-500 flex-shrink-0" />
              <div>
                <div className="font-semibold text-zinc-900 leading-tight">{t}</div>
                <div className="text-xs text-zinc-500">{s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shop by room */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-5">Shop by room</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          {ROOM_TILES.map((tile) => (
            <button
              key={tile.id}
              type="button"
              onClick={() => {
                onSelectRoom(tile.id);
                setTimeout(scrollToShop, 50);
              }}
              className="group text-left bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg transition"
            >
              <div className="aspect-[4/3] overflow-hidden bg-zinc-100">
                <img
                  src={tile.image}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="px-3 py-3 font-semibold text-zinc-900 text-sm">{tile.title}</div>
            </button>
          ))}
        </div>
      </section>

      <ProductGrid
        onCustomizeProduct={onCustomizeProduct}
        searchQuery={searchQuery}
        activeRoom={activeRoom}
        onSelectRoom={onSelectRoom}
      />

      {/* How custom works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900">Made to fit, in 3 easy steps</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {[
              ['1', 'Measure your space', 'Use a tape measure, or pick a common size like an IKEA drawer.'],
              ['2', 'Pick your style', 'Choose the layout and color. Preview it in 3D before you buy.'],
              ['3', 'We make it for you', 'Ships in about 4 days. If it doesn’t fit, we remake it free.'],
            ].map(([n, t, s]) => (
              <div key={n} className="flex gap-4">
                <div className="w-9 h-9 flex-shrink-0 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center">
                  {n}
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900">{t}</h3>
                  <p className="text-sm text-zinc-600 mt-1">{s}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={onNavigateToCustomizer}
            className="mt-7 h-11 px-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
          >
            Start designing
          </button>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-5">What customers say</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="bg-white rounded-xl border border-zinc-200 p-5">
              <div className="flex text-amber-400" aria-label="5 out of 5 stars">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <figcaption className="mt-2 font-semibold text-zinc-900">{r.title}</figcaption>
              <p className="mt-1 text-sm text-zinc-600">{r.text}</p>
              <div className="mt-3 text-xs text-zinc-500">
                {r.name} · Verified buyer
              </div>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
};

// Re-exported for convenience of consumers needing the room list.
export { ROOMS };
