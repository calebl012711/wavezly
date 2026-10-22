/**
 * FORMGRID SPLIT-FULFILLMENT TRANSPARENCY NOTICE
 * Eliminates delivery mismatch complaints by clarifying multi-origin dispatch
 */

import React from 'react';
import { Truck, Cpu, Layers } from 'lucide-react';

interface CartSplitNoticeProps {
  hasCustom3D: boolean;
  hasDropship: boolean;
}

export const CartSplitNotice: React.FC<CartSplitNoticeProps> = ({
  hasCustom3D,
  hasDropship,
}) => {
  if (!hasCustom3D || !hasDropship) return null;

  return (
    <div className="p-3.5 bg-surface rounded-lg border border-signal-orange/40 bg-gradient-to-r from-signal-orange/5 to-transparent text-xs font-mono space-y-2">
      <div className="flex items-center space-x-2 text-signal-orange font-semibold tracking-wider uppercase text-[11px]">
        <Layers className="w-4 h-4" />
        <span>Dual-Facility Split Dispatch</span>
      </div>

      <p className="text-zinc-300 text-[11px] leading-relaxed">
        Your order contains items from two dedicated facilities. Products are fabricated and dispatched in separate tracked packages with zero delivery confusion:
      </p>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="p-2 rounded bg-black/60 border border-zinc-800">
          <div className="flex items-center space-x-1.5 text-zinc-300 font-medium text-[10px] mb-1">
            <Cpu className="w-3.5 h-3.5 text-signal-orange" />
            <span>PACKAGE A: 3D FARM</span>
          </div>
          <p className="text-[10px] text-zinc-400">
            Fabricated on-demand. Dispatched in 2–4 business days via Bambu/Slant3D farm.
          </p>
        </div>

        <div className="p-2 rounded bg-black/60 border border-zinc-800">
          <div className="flex items-center space-x-1.5 text-zinc-300 font-medium text-[10px] mb-1">
            <Truck className="w-3.5 h-3.5 text-signal-cyan" />
            <span>PACKAGE B: US HUB</span>
          </div>
          <p className="text-[10px] text-zinc-400">
            In-stock accessories. Dispatched within 24h via Domestic Priority (2–4 days).
          </p>
        </div>
      </div>
    </div>
  );
};
