/**
 * SNUGFIT FOOTER
 */

import React from 'react';

export const Footer: React.FC = () => (
  <footer className="bg-zinc-900 text-zinc-300 text-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid md:grid-cols-3 gap-8">
      <div>
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <span className="w-7 h-7 rounded-md bg-orange-500 text-white flex items-center justify-center text-sm">
            S
          </span>
          SnugFit
        </div>
        <p className="mt-3 text-zinc-400 max-w-xs">
          Organizers for every room, made to fit your space.
        </p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3">Our promise</h4>
        <ul className="space-y-2 text-zinc-400">
          <li>30-day fit guarantee</li>
          <li>Free shipping over $60</li>
          <li>Easy returns</li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3">Made in the USA</h4>
        <p className="text-zinc-400">
          Every custom piece is made to order in our U.S. workshop and shipped within a few days.
        </p>
      </div>
    </div>
    <div className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-500">
      © {new Date().getFullYear()} SnugFit. All rights reserved.
    </div>
  </footer>
);
