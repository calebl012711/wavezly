/**
 * FORMGRID INDUSTRIAL MANUFACTURING & FABRICATION SPECIFICATIONS
 * Engineering callout detailing automated print farms, layer physics, and dual split logistics
 */

import React from 'react';
import { Cpu, Layers, Factory, GitMerge } from 'lucide-react';

export const ManufacturingSpecs: React.FC = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-surface-border">
      {/* Section Header */}
      <div className="max-w-3xl mb-12">
        <div className="flex items-center space-x-2 font-mono text-xs text-signal-orange uppercase tracking-wider mb-2">
          <Factory className="w-4 h-4" />
          <span>PRODUCTION TELEMETRY // SPEC SHEET</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-precision-white">
          Precision Engineering Standards
        </h2>
        <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
          How our procedural algorithms transform your custom dimensions into production-grade physical hardware within hours.
        </p>
      </div>

      {/* Grid of Industrial Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
        {/* Spec 1: Procedural Slicing */}
        <div className="p-5 rounded-xl bg-surface border border-surface-border space-y-3">
          <div className="w-10 h-10 rounded-lg bg-signal-orange/10 border border-signal-orange/30 flex items-center justify-center text-signal-orange">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
            01. Client-Side Slicing Math
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Mesh coordinates are procedurally verified for manifold watertightness in WebGL before reaching the printer. Normals are oriented outward with zero intersecting self-facets.
          </p>
          <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500 space-y-1">
            <div>• Algorithm: Dynamic CSG / Extrude</div>
            <div>• Layer Resolution: 0.20mm Standard</div>
            <div>• STL Structure: Binary Little-Endian</div>
          </div>
        </div>

        {/* Spec 2: Farm Thermal Bonding */}
        <div className="p-5 rounded-xl bg-surface border border-surface-border space-y-3">
          <div className="w-10 h-10 rounded-lg bg-signal-cyan/10 border border-signal-cyan/30 flex items-center justify-center text-signal-cyan">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
            02. High-Shear Gyroid Infill
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Our automated printer cluster infuses 18% 3-dimensional gyroid internal ribbing, ensuring uniform tensile strength in all directions (X, Y, and Z axes) with zero warping.
          </p>
          <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500 space-y-1">
            <div>• Perimeter Shells: 3 Solid Walls (1.2mm)</div>
            <div>• Nozzle: 0.40mm Hardened Tool Steel</div>
            <div>• Farm Dispatch: Automated Slant3D / Bambu</div>
          </div>
        </div>

        {/* Spec 3: Split Logistics Engine */}
        <div className="p-5 rounded-xl bg-surface border border-surface-border space-y-3">
          <div className="w-10 h-10 rounded-lg bg-signal-lime/10 border border-signal-lime/30 flex items-center justify-center text-signal-lime">
            <GitMerge className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
            03. Dual-Logistics Orchestration
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Orders containing both custom printed organizers and domestic accessories are routed in real-time. Accessory tracking numbers sync instantly via DSers while 3D prints slice.
          </p>
          <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500 space-y-1">
            <div>• Print Farm ETA: 2–4 Business Days</div>
            <div>• Domestic Hub ETA: 2–4 Days Transit</div>
            <div>• Transparency: Unified Split Order HUD</div>
          </div>
        </div>
      </div>
    </section>
  );
};
