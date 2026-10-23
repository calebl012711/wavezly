/**
 * SNUGFIT HERO
 * Simple banner: one headline, one sentence, two buttons, real product photos.
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onLaunchStudio: () => void;
  onExploreCatalog: () => void;
  onOpenDeskPlanner?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onLaunchStudio, onExploreCatalog }) => (
  <section className="bg-gradient-to-b from-orange-50 to-[#f7f7f5]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      <div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 leading-tight">
          Organizers that actually fit your home.
        </h1>
        <p className="mt-4 text-lg text-zinc-600 max-w-lg">
          Shop favorites for every room, or pick your size and color and we’ll make one just for you.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onExploreCatalog}
            className="h-12 px-7 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold inline-flex items-center justify-center gap-2 transition"
          >
            Shop now <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onLaunchStudio}
            className="h-12 px-7 rounded-full bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-900 font-semibold transition"
          >
            Make one to fit
          </button>
        </div>
        <p className="mt-5 text-sm text-zinc-500">
          Free shipping over $60 · 30-day fit guarantee · Made in USA
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <img
          src="/assets/products/pourover-coffee-tray-real.jpg"
          alt="Coffee station organizer"
          className="rounded-2xl w-full h-56 sm:h-72 object-cover shadow-md"
        />
        <img
          src="/assets/products/vanity-matrix-real.jpg"
          alt="Vanity organizer"
          className="rounded-2xl w-full h-56 sm:h-72 object-cover shadow-md mt-6"
        />
      </div>
    </div>
  </section>
);
