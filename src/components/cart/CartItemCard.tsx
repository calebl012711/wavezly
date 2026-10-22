/**
 * FORMGRID INDUSTRIAL CART ITEM CARD
 * Detailed component breakdown, parametric telemetry tags, and quantity steppers
 */

import React from 'react';
import { CartItem } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { Minus, Plus, Trash2, Cpu, PackageCheck, Droplets } from 'lucide-react';

interface CartItemCardProps {
  item: CartItem;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();
  const isCustom = item.product.type === 'custom_3d';
  const specs = item.customSpecs;

  return (
    <div className="p-3 bg-surface rounded-lg border border-surface-border space-y-2.5">
      {/* Header & Origin Badge */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-1.5 mb-1">
            {isCustom ? (
              <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-signal-orange/10 border border-signal-orange/30 text-[10px] font-mono text-signal-orange font-semibold">
                <Cpu className="w-3 h-3" />
                <span>ON-DEMAND 3D PRINT</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-signal-cyan/10 border border-signal-cyan/30 text-[10px] font-mono text-signal-cyan font-semibold">
                <PackageCheck className="w-3 h-3" />
                <span>FAST-SHIP US DOMESTIC</span>
              </span>
            )}
          </div>

          <h3 className="text-sm font-bold text-zinc-100 tracking-tight">
            {item.product.title}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => removeItem(item.cartItemId)}
          className="text-zinc-500 hover:text-red-400 p-1 transition"
          aria-label="Remove item"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Parametric Specs Details (if custom_3d) */}
      {isCustom && specs && (
        <div className="p-2 rounded bg-black/50 border border-zinc-800/80 font-mono text-[11px] space-y-1 text-zinc-400">
          <div className="flex justify-between">
            <span>Dimensions:</span>
            <span className="text-zinc-200">
              {specs.dimensions.length}×{specs.dimensions.width}×{specs.dimensions.height}mm ({specs.dimensions.rows}×{specs.dimensions.cols} Grid)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Material:</span>
            <div className="flex items-center space-x-1.5 text-zinc-200">
              <span
                className="w-2.5 h-2.5 rounded-full border border-white/20 inline-block"
                style={{ backgroundColor: specs.material.hexColor }}
              />
              <span>{specs.material.name}</span>
            </div>
          </div>

          {specs.resinInlay && (
            <div className="flex items-center justify-between text-signal-cyan">
              <span className="flex items-center gap-1">
                <Droplets className="w-3 h-3" /> Resin Inlay:
              </span>
              <span>{specs.resinInlay.name}</span>
            </div>
          )}

          <div className="flex justify-between text-[10px] text-zinc-500 pt-0.5 border-t border-zinc-800/60">
            <span>Weight: ~{specs.estimatedGrams}g</span>
            <span>Print: ~{specs.estimatedPrintHours}h</span>
          </div>
        </div>
      )}

      {/* Fast Ship Dropship Specs */}
      {!isCustom && item.product.supplierMeta && (
        <div className="font-mono text-[11px] text-zinc-400 space-y-0.5">
          <div className="text-zinc-300">
            {item.product.supplierMeta.warehouseOrigin}
          </div>
          <div className="text-[10px] text-zinc-500">
            Transit ETA: {item.product.supplierMeta.estimatedTransitDays}
          </div>
        </div>
      )}

      {/* Quantity Stepper & Price */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-2 bg-black/60 px-2 py-1 rounded border border-zinc-800 font-mono text-xs">
          <button
            type="button"
            onClick={() => updateQuantity(item.cartItemId, -1)}
            className="text-zinc-400 hover:text-white p-0.5 disabled:opacity-40"
            disabled={item.quantity <= 1}
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-zinc-200 px-1">{item.quantity}</span>
          <button
            type="button"
            onClick={() => updateQuantity(item.cartItemId, 1)}
            className="text-zinc-400 hover:text-white p-0.5"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <div className="text-right">
          <span className="font-mono text-sm font-bold text-precision-white">
            ${(item.calculatedPrice * item.quantity).toFixed(2)}
          </span>
          {item.quantity > 1 && (
            <div className="font-mono text-[10px] text-zinc-500">
              ${item.calculatedPrice.toFixed(2)} each
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
