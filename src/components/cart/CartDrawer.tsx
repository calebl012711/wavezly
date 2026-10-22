/**
 * FORMGRID CONSUMER SHOPPING BAG & SPLIT CHECKOUT DRAWER
 * Prioritized Light Mode, clean luxury typography, transparent dual-package timeline, and Stripe checkout
 */

import React, { useState } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { CartItemCard } from './CartItemCard';
import { CartSplitNotice } from './CartSplitNotice';
import { X, ShoppingBag, ArrowRight, ShieldCheck, Box, Truck, Loader2 } from 'lucide-react';
import { playClickSound } from '../../lib/soundEffects';

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
    playClickSound('snap');
    setIsProcessing(true);
    try {
      if (onCheckout) {
        onCheckout();
      } else {
        window.location.href = '/checkout';
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => {
          playClickSound('tick');
          closeCart();
        }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#121214] border-l border-zinc-200 dark:border-zinc-800 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/60">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-orange-600" />
              <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">
                Your Shopping Bag ({items.length})
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                playClickSound('tick');
                closeCart();
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              aria-label="Close bag"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Content Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-full border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-sm text-zinc-500">Your shopping bag is currently empty.</p>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound('tick');
                    closeCart();
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-xs font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 transition cursor-pointer"
                >
                  Explore Collection
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
                    <div className="flex items-center justify-between text-xs text-orange-600 dark:text-orange-400 border-b border-zinc-200 dark:border-zinc-800 pb-1 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Box className="w-3.5 h-3.5" /> Package A: Made to Measure
                      </span>
                      <span className="text-[11px] text-zinc-500 font-normal">2–4 Day Dispatch</span>
                    </div>
                    {pkgA.map((item) => (
                      <CartItemCard key={item.cartItemId} item={item} />
                    ))}
                  </div>
                )}

                {/* PACKAGE B: FAST-SHIP ACCESSORIES */}
                {pkgB.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-sky-600 dark:text-sky-400 border-b border-zinc-200 dark:border-zinc-800 pb-1 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5" /> Package B: Studio Hardware
                      </span>
                      <span className="text-[11px] text-zinc-500 font-normal">Ships in 24 Hours</span>
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
            <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 space-y-3 text-xs">
              <div className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-semibold text-emerald-600">
                    {shipping === 0 ? 'FREE US DELIVERY' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800 text-sm font-bold text-zinc-950 dark:text-white">
                  <span>Total:</span>
                  <span className="text-orange-600">${total.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Checkout Trigger Button */}
              <button
                type="button"
                onClick={handleCheckoutClick}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold flex items-center justify-center space-x-2 shadow-md transition disabled:opacity-50 cursor-pointer text-sm"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to Stripe...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-zinc-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>30-Day Fit Guarantee • Secure Stripe Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
