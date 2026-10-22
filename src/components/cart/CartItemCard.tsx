/**
 * FORMGRID CONSUMER CART ITEM CARD
 * Clear product title, tailored millimeter specs, and quantity controls
 * Prioritized Light Mode
 */

import React from 'react';
import { CartItem } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { Minus, Plus, Trash2, Box, PackageCheck, Droplets } from 'lucide-react';
import { playClickSound } from '../../lib/soundEffects';

interface CartItemCardProps {
  item: CartItem;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();
  const isCustom = item.product.type === 'custom_3d';
  const specs = item.customSpecs;

  return (
    <div className="p-3.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/90 dark:border-zinc-800 shadow-2xs space-y-2.5 font-sans">
      {/* Header & Origin Badge */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-1.5 mb-1">
            {isCustom ? (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/50 text-[10px] text-orange-700 dark:text-orange-300 font-medium">
                <Box className="w-3 h-3" />
                <span>Custom Made</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/50 text-[10px] text-sky-700 dark:text-sky-300 font-medium">
                <PackageCheck className="w-3 h-3" />
                <span>In-Stock US</span>
              </span>
            )}
          </div>

          <h3 className="text-sm font-semibold text-zinc-950 dark:text-white tracking-tight">
            {item.product.title}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => {
            playClickSound('snap');
            removeItem(item.cartItemId);
          }}
          className="text-zinc-400 hover:text-red-500 p-1 transition cursor-pointer"
          aria-label="Remove item"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Parametric Specs Details (if custom_3d) */}
      {isCustom && specs && (
        <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-black/40 border border-zinc-200/70 dark:border-zinc-800 text-[11px] space-y-1 text-zinc-600 dark:text-zinc-400">
          <div className="flex justify-between">
            <span className="text-zinc-500">Dimensions:</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-200">
              {specs.dimensions.length}×{specs.dimensions.width}×{specs.dimensions.height}mm ({specs.dimensions.rows}×{specs.dimensions.cols} Grid)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-zinc-500">Material & Color:</span>
            <div className="flex items-center space-x-1.5 text-zinc-900 dark:text-zinc-200 font-medium">
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                style={{ backgroundColor: specs.material.hexColor }}
              />
              <span>{specs.material.name}</span>
            </div>
          </div>

          {specs.resinInlay && (
            <div className="flex items-center justify-between text-sky-600 dark:text-sky-400">
              <span className="flex items-center gap-1 font-medium">
                <Droplets className="w-3 h-3" /> Acoustic Resin:
              </span>
              <span>{specs.resinInlay.name}</span>
            </div>
          )}
        </div>
      )}

      {/* Price & Quantity Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-2 border border-zinc-200 dark:border-zinc-700 rounded-lg p-0.5 bg-zinc-50 dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => {
              playClickSound('tick');
              updateQuantity(item.cartItemId, item.quantity - 1);
            }}
            className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-300 transition cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="px-1.5 text-xs font-semibold text-zinc-900 dark:text-white">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => {
              playClickSound('tick');
              updateQuantity(item.cartItemId, item.quantity + 1);
            }}
            className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-300 transition cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <div className="text-right">
          <span className="text-sm font-bold text-zinc-950 dark:text-white">
            ${(item.calculatedPrice * item.quantity).toFixed(2)} USD
          </span>
        </div>
      </div>
    </div>
  );
};
