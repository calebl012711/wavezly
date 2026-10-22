/**
 * FORMGRID CONSUMER SPLIT-FULFILLMENT NOTICE
 * Eliminates delivery confusion with transparent package timelines
 * Prioritized Light Mode
 */

import React from 'react';
import { Truck, Box, Layers } from 'lucide-react';

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
    <div className="p-3.5 rounded-xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200/90 dark:border-orange-800/60 font-sans space-y-2">
      <div className="flex items-center space-x-1.5 text-orange-700 dark:text-orange-400 font-semibold text-xs">
        <Layers className="w-4 h-4" />
        <span>Two Dedicated Packages</span>
      </div>

      <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
        Your order includes custom pieces and in-stock accessories. Each package will ship as soon as it's ready:
      </p>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-orange-200/60 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center space-x-1.5 text-zinc-900 dark:text-white font-medium text-xs mb-0.5">
            <Box className="w-3.5 h-3.5 text-orange-600" />
            <span>Custom Made</span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-tight">
            Crafted on demand. Dispatched in 2–4 days.
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-orange-200/60 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center space-x-1.5 text-zinc-900 dark:text-white font-medium text-xs mb-0.5">
            <Truck className="w-3.5 h-3.5 text-sky-600" />
            <span>Fast-Ship</span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-tight">
            In-stock item. Dispatched in 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
};
