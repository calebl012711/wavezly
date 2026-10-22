/**
 * FORMGRID CONSUMER FOOTER
 * Prioritized Light Mode, clean luxury typography, customer guarantees, and studio links
 */

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-[#09090b] border-t border-zinc-200 dark:border-zinc-800 py-14 px-4 sm:px-6 lg:px-8 font-sans text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-zinc-200 dark:border-zinc-800">
        {/* Brand & Ethos */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center space-x-2 text-zinc-900 dark:text-white font-bold text-sm">
            <div className="w-2.5 h-2.5 bg-signal-orange rounded-sm" />
            <span>FORMGRID</span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            Minimal, purposeful desk architecture. Custom 3D-crafted organizers made to your exact millimeter, paired with curated studio accessories.
          </p>
          <div className="text-[11px] text-zinc-400">
            Crafted with pride in the United States.
          </div>
        </div>

        {/* Studio Products */}
        <div className="space-y-2.5">
          <h4 className="text-zinc-900 dark:text-white font-semibold uppercase tracking-wider text-[11px]">
            Custom 3D Studio
          </h4>
          <ul className="space-y-2 text-zinc-600 dark:text-zinc-400 text-xs">
            <li>Bespoke Desk Valet Pro</li>
            <li>Modular Workbench Drawer Matrix</li>
            <li>Audiophile Headphone Plinth</li>
            <li>Hex Bit & Fastener Organizer</li>
            <li>Cable Management Rail</li>
          </ul>
        </div>

        {/* Studio Accessories */}
        <div className="space-y-2.5">
          <h4 className="text-zinc-900 dark:text-white font-semibold uppercase tracking-wider text-[11px]">
            Fast-Ship Accessories
          </h4>
          <ul className="space-y-2 text-zinc-600 dark:text-zinc-400 text-xs">
            <li>Asymmetric ScreenBar Luminaire</li>
            <li>High-Density Merino Wool Desk Mat</li>
            <li>Solid Titanium Pen Stand</li>
            <li>Solid Brass Heavyweight Dock</li>
            <li>Aviation Aluminum Laptop Riser</li>
          </ul>
        </div>

        {/* Guarantees & Tolerances */}
        <div className="space-y-2.5">
          <h4 className="text-zinc-900 dark:text-white font-semibold uppercase tracking-wider text-[11px]">
            Our Guarantee
          </h4>
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 shadow-2xs">
            <div className="flex items-center space-x-1.5 text-emerald-600 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Guaranteed Fit</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              If your custom organizer fails to fit your drawer or workspace perfectly, we’ll re-craft and dispatch a replacement at zero charge.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-3">
        <div>
          © {new Date().getFullYear()} Formgrid Technologies Inc. All rights reserved.
        </div>
        <div className="flex items-center space-x-4">
          <span className="hover:text-zinc-900 dark:hover:text-white cursor-pointer transition">Terms of Service</span>
          <span>•</span>
          <span className="hover:text-zinc-900 dark:hover:text-white cursor-pointer transition">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-zinc-900 dark:hover:text-white cursor-pointer transition">Shipping & Returns</span>
        </div>
      </div>
    </footer>
  );
};
