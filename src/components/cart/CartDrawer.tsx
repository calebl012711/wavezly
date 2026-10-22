/**
 * FORMGRID SLIDE-OUT CART DRAWER & SPLIT CHECKOUT INTERFACE
 * Groups items into Package A (Made-to-Order 3D) and Package B (Fast-Ship Dropship)
 */

import React, { useState } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { CartItemCard } from './CartItemCard';
import { CartSplitNotice } from './CartSplitNotice';
import { X, ShoppingBag, ArrowRight, ShieldCheck, Cpu, Truck, Loader2 } from 'lucide-react';

interface CartDrawerProps {
  onCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const {
    isOpen,
    closeCart,
    items,
    getPackageA_3DPrints,
    getPackageB_FastShip,
    getSubtotalCents,
    getShippingCents,
    getTotalCents,
  } = useCartStore();

  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const pkgA = getPackageA_3DPrints();
  const pkgB = getPackageB_FastShip();
  const subtotal = getSubtotalCents() / 100;
  const shipping = getShippingCents() / 100;
  const total = getTotalCents() / 100;

  const handleCheckoutClick = async () => {
    setIsProcessing(true);
    try {
      if (onCheckout) {
        onCheckout();
      } else {
        // Default direct checkout router simulation
        window.location.href = '/checkout';
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-background border-l border-surface-border flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-surface-border flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-signal-orange" />
              <h2 className="text-sm font-mono font-bold text-zinc-100 uppercase tracking-wider">
                Production Queue [{items.length}]
              </h2>
            </div>

            <button
              type="button"
              onClick={closeCart}
              className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Content Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3 font-mono">
                <div className="w-12 h-12 rounded-full border border-dashed border-zinc-700 flex items-center justify-center text-zinc-600">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-sm text-zinc-400">Your unified dispatch queue is empty.</p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="px-4 py-2 rounded bg-zinc-800 text-xs text-precision-white hover:bg-zinc-700 transition"
                >
                  Configure Hardware
                </button>
              </div>
            ) : (
              <>
                {/* Dual-Facility Notice */}
                <CartSplitNotice
                  hasCustom3D={pkgA.length > 0}
                  hasDropship={pkgB.length > 0}
                />

                {/* PACKAGE A: 3D PRINT FARM (Made-to-Order) */}
                {pkgA.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs text-signal-orange uppercase tracking-wider border-b border-zinc-800 pb-1">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Cpu className="w-3.5 h-3.5" /> Package A: Farm Slicing Queue
                      </span>
                      <span className="text-[10px] text-zinc-500">2–4 Day Print</span>
                    </div>
                    {pkgA.map((item) => (
                      <CartItemCard key={item.cartItemId} item={item} />
                    ))}
                  </div>
                )}

                {/* PACKAGE B: FAST-SHIP ACCESSORIES */}
                {pkgB.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs text-signal-cyan uppercase tracking-wider border-b border-zinc-800 pb-1">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Truck className="w-3.5 h-3.5" /> Package B: Domestic Hardware
                      </span>
                      <span className="text-[10px] text-zinc-500">2–4 Day Transit</span>
                    </div>
                    {pkgB.map((item) => (
                      <CartItemCard key={item.cartItemId} item={item} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer & Order Summary */}
          {items.length > 0 && (
            <div className="p-4 border-t border-surface-border bg-surface/60 backdrop-blur-md space-y-3 font-mono text-xs">
              <div className="space-y-1.5 text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-zinc-200">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Split-Logistics Shipping:</span>
                  <span className="text-zinc-200">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-zinc-800 text-sm font-bold text-precision-white">
                  <span>Total Due:</span>
                  <span className="text-signal-orange">${total.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Checkout Trigger Button */}
              <button
                type="button"
                onClick={handleCheckoutClick}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-lg bg-signal-orange hover:bg-orange-600 text-black font-bold tracking-wider flex items-center justify-center space-x-2 shadow-glow-orange transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>INITIALIZING STRIPE...</span>
                  </>
                ) : (
                  <>
                    <span>PROCEED TO SPLIT CHECKOUT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-zinc-500">
                <ShieldCheck className="w-3 h-3 text-signal-lime" />
                <span>256-Bit Encrypted Direct Stripe Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
