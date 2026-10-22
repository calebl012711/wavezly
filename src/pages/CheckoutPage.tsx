/**
 * FORMGRID INTEGRATED CHECKOUT PAGE
 * Collects shipping details, verifies server-side prices, and dispatches Stripe Checkout Sessions
 */

import React, { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { createCheckoutSession } from '../api/checkout';
import { ShippingAddress } from '../types';
import { CartSplitNotice } from '../components/cart/CartSplitNotice';
import { ShieldCheck, Lock, ArrowRight, Loader2 } from 'lucide-react';

interface CheckoutPageProps {
  onSuccess: (orderNumber: string) => void;
  onCancel: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onSuccess, onCancel }) => {
  const {
    items,
    getPackageA_3DPrints,
    getPackageB_FastShip,
    getSubtotalCents,
    getShippingCents,
    getTotalCents,
    clearCart,
  } = useCartStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [form, setForm] = useState<ShippingAddress>({
    fullName: 'Alexander Rams',
    email: 'alexander@braun-audio.de',
    line1: '404 Industrial Parkway, Suite 100',
    line2: 'Unit 4B',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94107',
    country: 'US',
  });

  const pkgA = getPackageA_3DPrints();
  const pkgB = getPackageB_FastShip();
  const subtotal = getSubtotalCents() / 100;
  const shipping = getShippingCents() / 100;
  const total = getTotalCents() / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await createCheckoutSession({
        items,
        customerEmail: form.email,
        shippingAddress: form,
      });

      if (response.isMock) {
        // Cache order details in localStorage for client-side invoice and tracking specs
        try {
          localStorage.setItem(
            'formgrid-last-order',
            JSON.stringify({
              orderNumber: response.orderNumber,
              items: items.map(({ stlBlob, ...rest }) => rest),
              shippingAddress: form,
              timestamp: new Date().toISOString(),
            })
          );
        } catch (e) {
          console.warn('Failed to cache last order to localStorage', e);
        }

        // In local/sandbox mode, clear cart and navigate directly to Success
        clearCart();
        onSuccess(response.orderNumber);
      } else if (response.sessionUrl) {
        // Live Stripe checkout redirect
        window.location.href = response.sessionUrl;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Failed to initiate Stripe session.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-mono text-xs">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-surface-border">
        <div>
          <span className="text-[10px] text-signal-orange uppercase tracking-wider font-semibold">
            DISPATCH PIPELINE
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-precision-white font-sans">
            Split-Fulfillment Checkout
          </h1>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-zinc-400 hover:text-white transition"
        >
          ← Cancel & Edit Cart
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Shipping Address Form */}
        <form onSubmit={handleSubmit} className="md:col-span-7 space-y-4">
          <div className="p-4 bg-surface rounded-xl border border-surface-border space-y-3">
            <div className="flex items-center justify-between text-zinc-300 font-bold uppercase pb-2 border-b border-zinc-800">
              <span>01. Destination Logistics</span>
              <span className="text-zinc-500 font-normal">US DOMESTIC PRIORITY</span>
            </div>

            <div>
              <label className="text-zinc-400 uppercase text-[10px] block mb-1">
                Full Name / Recipient
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full bg-black/60 px-3 py-2 rounded border border-zinc-800 text-zinc-200 focus:outline-none focus:border-signal-orange"
              />
            </div>

            <div>
              <label className="text-zinc-400 uppercase text-[10px] block mb-1">
                Dispatch Notification Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-black/60 px-3 py-2 rounded border border-zinc-800 text-zinc-200 focus:outline-none focus:border-signal-orange"
              />
            </div>

            <div>
              <label className="text-zinc-400 uppercase text-[10px] block mb-1">
                Street Address
              </label>
              <input
                type="text"
                required
                value={form.line1}
                onChange={(e) => setForm({ ...form, line1: e.target.value })}
                className="w-full bg-black/60 px-3 py-2 rounded border border-zinc-800 text-zinc-200 focus:outline-none focus:border-signal-orange"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-zinc-400 uppercase text-[10px] block mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-black/60 px-3 py-2 rounded border border-zinc-800 text-zinc-200 focus:outline-none focus:border-signal-orange"
                />
              </div>
              <div>
                <label className="text-zinc-400 uppercase text-[10px] block mb-1">
                  State
                </label>
                <input
                  type="text"
                  required
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full bg-black/60 px-3 py-2 rounded border border-zinc-800 text-zinc-200 focus:outline-none focus:border-signal-orange"
                />
              </div>
              <div>
                <label className="text-zinc-400 uppercase text-[10px] block mb-1">
                  Zip / Postal
                </label>
                <input
                  type="text"
                  required
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  className="w-full bg-black/60 px-3 py-2 rounded border border-zinc-800 text-zinc-200 focus:outline-none focus:border-signal-orange"
                />
              </div>
            </div>
          </div>

          {/* Transparent Notice */}
          <CartSplitNotice
            hasCustom3D={pkgA.length > 0}
            hasDropship={pkgB.length > 0}
          />

          {errorMessage && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || items.length === 0}
            className="w-full py-3.5 px-4 rounded-lg bg-signal-orange hover:bg-orange-600 text-black font-bold tracking-wider flex items-center justify-center space-x-2 shadow-glow-orange transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>ROUTING TO PRODUCTION ENCLAVE...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>CONFIRM ORDER & LAUNCH FABRICATION</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Right Column: Order Summary */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-4 bg-surface rounded-xl border border-surface-border space-y-3">
            <div className="flex items-center justify-between text-zinc-300 font-bold uppercase pb-2 border-b border-zinc-800">
              <span>02. Order Summary</span>
              <span className="text-zinc-500 font-normal">[{items.length} ITEMS]</span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {items.map((i) => (
                <div
                  key={i.cartItemId}
                  className="flex items-center justify-between py-1 border-b border-zinc-900 text-zinc-300"
                >
                  <div className="truncate mr-2">
                    <div className="font-semibold">{i.product.title}</div>
                    <div className="text-[10px] text-zinc-500">
                      Qty {i.quantity} • {i.product.type === 'custom_3d' ? '3D Farm' : 'US Stock'}
                    </div>
                  </div>
                  <div className="font-bold text-zinc-100 flex-shrink-0">
                    ${(i.calculatedPrice * i.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-800 space-y-1 text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Split Logistics Transit:</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-zinc-800 text-sm font-bold text-precision-white">
                <span>Total Amount:</span>
                <span className="text-signal-orange">${total.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center space-x-1.5 text-[10px] text-zinc-500">
              <ShieldCheck className="w-3.5 h-3.5 text-signal-lime" />
              <span>Full Precision Fit Dimensional Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
