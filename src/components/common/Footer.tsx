/**
 * FORMGRID INDUSTRIAL FOOTER
 * Engineering tolerances, Dieter Rams design philosophy credit, and split-logistics policy links
 */

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-background border-t border-surface-border py-12 px-4 sm:px-6 lg:px-8 font-mono text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-zinc-900">
        {/* Brand & Ethos */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center space-x-2 text-zinc-200 font-bold">
            <div className="w-2.5 h-2.5 bg-signal-orange rounded-sm" />
            <span>FORMGRID ARCHITECTURE</span>
          </div>
          <p className="font-sans text-xs text-zinc-400 leading-relaxed">
            Form following function. High-tolerance parametric physical desktop objects synthesized on-demand with zero surplus warehouse inventory.
          </p>
          <div className="text-[10px] text-zinc-600">
            HOMAGE: DIETER RAMS & TEENAGE ENGINEERING
          </div>
        </div>

        {/* Manufacturing & Slicing */}
        <div className="space-y-2">
          <h4 className="text-zinc-300 font-semibold uppercase tracking-wider text-[11px]">
            Fabrication
          </h4>
          <ul className="space-y-1.5 text-zinc-400 text-[11px]">
            <li>Manifold Binary STL Export</li>
            <li>0.20mm High-Detail Slicing</li>
            <li>18% Gyroid High-Shear Core</li>
            <li>Optical Resin Cast Inlays</li>
            <li>Bambu Farm API Integration</li>
          </ul>
        </div>

        {/* Dual Logistics */}
        <div className="space-y-2">
          <h4 className="text-zinc-300 font-semibold uppercase tracking-wider text-[11px]">
            Split Logistics
          </h4>
          <ul className="space-y-1.5 text-zinc-400 text-[11px]">
            <li>Package A: 3D Farm (2–4 Days)</li>
            <li>Package B: US Domestic Hub (2–4 Days)</li>
            <li>Automated DSers/AutoDS Hook</li>
            <li>USPS Priority Ground Tracking</li>
            <li>Zero-Mismatch Delivery HUD</li>
          </ul>
        </div>

        {/* Guarantees & Tolerances */}
        <div className="space-y-2">
          <h4 className="text-zinc-300 font-semibold uppercase tracking-wider text-[11px]">
            Quality Standards
          </h4>
          <div className="p-2.5 rounded bg-surface border border-zinc-800 text-[10px] text-zinc-400 space-y-1">
            <div className="flex items-center space-x-1 text-signal-lime">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>±0.25mm Dimensional Guarantee</span>
            </div>
            <p>
              If your custom print fails to fit your drawer or desktop coordinates, our farm will re-slice and reprint at zero cost.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-600 gap-3">
        <div>
          © {new Date().getFullYear()} FORMGRID TECHNOLOGIES INC. ALL RIGHTS RESERVED.
        </div>
        <div className="flex items-center space-x-4">
          <span>TERMS OF SPECIFICATION</span>
          <span>•</span>
          <span>PRIVACY ENCLAVE</span>
          <span>•</span>
          <span>SYSTEM SITEMAP</span>
        </div>
      </div>
    </footer>
  );
};
