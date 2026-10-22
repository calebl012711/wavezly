/**
 * FORMGRID INTEGRATED CHECKOUT PAGE
 * Elite DTC Checkout (Shopify Plus / Stripe Checkout style)
 * Features:
 * - Express Checkout Pills (Apple Pay, Shop Pay, PayPal simulation)
 * - Clear Split Delivery Breakdown (Package 1: Handcrafted to Measure vs Package 2: In-Stock Accessory)
 * - Prominent Consumer Trust Guarantees (30-Day Fit Guarantee, Free Returns, Carbon-Neutral Delivery)
 * - Discount / Voucher Code Engine
 * - 100% TypeScript safe & responsive
 */

import React, { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { createCheckoutSession } from '../api/checkout';
import { ShippingAddress, CartItem } from '../types';
import { SEED_PRODUCTS, SEED_MATERIALS } from '../db/seed';
import { playClickSound } from '../lib/soundEffects';
import { calculateSlicingTelemetry } from '../lib/parametricMath';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Truck,
  Box,
  CreditCard,
  Tag,
  X,
  RotateCcw,
  Leaf,
  ChevronRight,
  Info,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

interface CheckoutPageProps {
  onSuccess: (orderNumber: string) => void;
  onCancel: () => void;
}

type ExpressProvider = 'apple_pay' | 'shop_pay' | 'paypal' | null;

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onSuccess, onCancel }) => {
  const {
    items,
    getPackageA_3DPrints,
    getPackageB_FastShip,
    getSubtotalCents,
    getShippingCents,
    clearCart,
    addCustomItem,
    addStandardItem,
  } = useCartStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeExpressModal, setActiveExpressModal] = useState<ExpressProvider>(null);
  const [expressProcessing, setExpressProcessing] = useState(false);

  // Discount code state
  const [discountInput, setDiscountInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number; label: string } | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);

  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('Alexander Rams');
  const [saveInfo, setSaveInfo] = useState(true);
  const [emailOffers, setEmailOffers] = useState(true);

  // Shipping address form
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
  const baseSubtotal = getSubtotalCents() / 100;
  const shipping = getShippingCents() / 100;

  // Calculate discount
  const discountAmount = appliedDiscount
    ? Number(((baseSubtotal * appliedDiscount.percent) / 100).toFixed(2))
    : 0;

  const finalTotal = Math.max(0, Number((baseSubtotal - discountAmount + shipping).toFixed(2)));

  // Format card number with spaces (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  // Format MM/YY
  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.substring(0, 2)}/${raw.substring(2)}`;
    }
    setCardExp(raw);
  };

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    setDiscountError(null);
    const code = discountInput.trim().toUpperCase();

    if (!code) return;

    if (code === 'DRAWERFIT' || code === 'PERFECTFIT') {
      playClickSound('snap');
      setAppliedDiscount({ code, percent: 15, label: '15% Off 30-Day Fit Launch Special' });
      setDiscountInput('');
    } else if (code === 'WELCOME10') {
      playClickSound('snap');
      setAppliedDiscount({ code, percent: 10, label: '10% Off First Bespoke Order' });
      setDiscountInput('');
    } else {
      setDiscountError('Invalid promotional code. Try DRAWERFIT for 15% off.');
    }
  };

  const removeDiscount = () => {
    playClickSound('tick');
    setAppliedDiscount(null);
    setDiscountError(null);
  };

  // Quick load demo set if cart is empty so tester can review the checkout page
  const handleLoadDemoCart = () => {
    playClickSound('cart');
    const customProduct = SEED_PRODUCTS[0];
    const dropProduct = SEED_PRODUCTS[1] || SEED_PRODUCTS[0];
    const defaultMaterial = SEED_MATERIALS[0];

    const dimensions = {
      length: 160,
      width: 120,
      height: 40,
      wallThickness: 2.4,
      bottomThickness: 2.0,
      rows: 2,
      cols: 3,
      cornerFilletRadius: 4.0,
      inlayPocketDepth: 0,
    };

    const telemetry = calculateSlicingTelemetry(dimensions, defaultMaterial, null);

    addCustomItem(
      customProduct,
      {
        dimensions,
        material: defaultMaterial,
        resinInlay: null,
        volumePlasticCm3: telemetry.plasticVolumeCm3,
        volumeResinCm3: telemetry.resinVolumeCm3,
        estimatedGrams: telemetry.totalWeightGrams,
        estimatedPrintHours: telemetry.estimatedPrintHours,
        totalManufacturingCost: telemetry.finalPriceUsd,
      },
      38.5
    );

    addStandardItem(dropProduct, 1);
  };

  // Execute complete order flow
  const completeOrder = async (orderItems: CartItem[], methodLabel: string = 'Credit Card') => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await createCheckoutSession({
        items: orderItems,
        customerEmail: form.email,
        shippingAddress: form,
      });

      if (response.isMock) {
        // Cache order details in localStorage for client-side invoice and tracking specs
        try {
          localStorage.setItem(
            'snugfit-last-order',
            JSON.stringify({
              orderNumber: response.orderNumber,
              items: orderItems.map(({ stlBlob, ...rest }) => rest),
              shippingAddress: form,
              timestamp: new Date().toISOString(),
              paymentMethod: methodLabel,
              discountApplied: appliedDiscount,
            })
          );
        } catch (e) {
          console.warn('Failed to cache last order to localStorage', e);
        }

        playClickSound('success');
        clearCart();
        onSuccess(response.orderNumber);
      } else if (response.sessionUrl) {
        window.location.href = response.sessionUrl;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Failed to initiate checkout session.');
    } finally {
      setIsSubmitting(false);
      setExpressProcessing(false);
      setActiveExpressModal(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage('Your cart is empty. Please add items or load a sample order.');
      return;
    }
    await completeOrder(items, 'Credit Card');
  };

  // Express checkout simulation trigger
  const handleTriggerExpress = (provider: ExpressProvider) => {
    playClickSound('snap');
    if (items.length === 0) {
      handleLoadDemoCart();
    }
    setActiveExpressModal(provider);
  };

  const handleConfirmExpress = async () => {
    setExpressProcessing(true);
    playClickSound('snap');
    const orderItems = items.length > 0 ? items : [];
    const providerName =
      activeExpressModal === 'apple_pay'
        ? 'Apple Pay'
        : activeExpressModal === 'shop_pay'
        ? 'Shop Pay'
        : 'PayPal';

    setTimeout(async () => {
      await completeOrder(orderItems, providerName);
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* EXPRESS CHECKOUT INTERACTIVE MODAL */}
      {activeExpressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-5">
            <button
              onClick={() => setActiveExpressModal(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {activeExpressModal === 'apple_pay' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold font-sans tracking-tight"> Pay</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
                    Touch ID / Face ID
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Card:</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">Apple Card (•••• 9842)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Ship to:</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">404 Industrial Pkwy, SF CA</span>
                  </div>
                  <div className="flex justify-between border-t border-zinc-200 dark:border-zinc-700 pt-2 font-bold text-sm">
                    <span>Pay FORMGRID:</span>
                    <span className="text-orange-600 dark:text-orange-400">${finalTotal.toFixed(2)} USD</span>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500 text-center">
                  Double Click Side Button or Confirm with Touch ID to authorize order.
                </p>
                <button
                  type="button"
                  disabled={expressProcessing}
                  onClick={handleConfirmExpress}
                  className="w-full py-3.5 px-4 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition cursor-pointer shadow-lg disabled:opacity-60"
                >
                  {expressProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Authorizing Apple Pay...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay with  Pay • ${finalTotal.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {activeExpressModal === 'shop_pay' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-[#5A31F4] text-white px-2 py-0.5 rounded text-xs font-bold italic">
                    shop Pay
                  </div>
                  <span className="text-xs text-zinc-500">1-Click Fast Checkout</span>
                </div>
                <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Account:</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{form.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Default Card:</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">Visa ending in 4242</span>
                  </div>
                  <div className="flex justify-between border-t border-purple-200 dark:border-purple-800/60 pt-2 font-bold text-sm">
                    <span>Total:</span>
                    <span className="text-purple-600 dark:text-purple-400">${finalTotal.toFixed(2)} USD</span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={expressProcessing}
                  onClick={handleConfirmExpress}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#5A31F4] hover:bg-[#4d27d9] text-white font-semibold text-sm flex items-center justify-center space-x-2 transition cursor-pointer shadow-lg disabled:opacity-60"
                >
                  {expressProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Authorizing Shop Pay...</span>
                    </>
                  ) : (
                    <span>Complete with Shop Pay • ${finalTotal.toFixed(2)}</span>
                  )}
                </button>
              </div>
            )}

            {activeExpressModal === 'paypal' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-[#003087]">PayPal</span>
                  <span className="text-xs text-zinc-500">Express Checkout</span>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">PayPal Balance / Linked Bank</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">alexander@braun-audio.de</span>
                  </div>
                  <div className="flex justify-between border-t border-amber-200 dark:border-amber-800/60 pt-2 font-bold text-sm">
                    <span>Total to Authorize:</span>
                    <span className="text-amber-600 dark:text-amber-400">${finalTotal.toFixed(2)} USD</span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={expressProcessing}
                  onClick={handleConfirmExpress}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#FFC439] hover:bg-[#f4b82d] text-zinc-950 font-bold text-sm flex items-center justify-center space-x-2 transition cursor-pointer shadow-md disabled:opacity-60"
                >
                  {expressProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
                      <span>Processing PayPal Checkout...</span>
                    </>
                  ) : (
                    <span>Authorize with PayPal • ${finalTotal.toFixed(2)}</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOP HEADER: BRANDING & PROGRESS */}
      <header className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-extrabold tracking-tight text-xl text-zinc-950 dark:text-white font-display">
              FORMGRID
            </span>
            <span className="hidden sm:inline-block h-4 w-px bg-zinc-300 dark:bg-zinc-700" />
            <span className="hidden sm:inline-flex items-center text-xs text-zinc-500 space-x-1">
              <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>256-Bit SSL Encrypted Checkout</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-2 text-xs font-medium text-zinc-400">
              <span className="text-zinc-600 dark:text-zinc-400">Cart</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-zinc-600 dark:text-zinc-400">Information</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-zinc-600 dark:text-zinc-400">Shipping</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-orange-600 dark:text-orange-400 font-bold">Payment</span>
            </nav>

            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 transition flex items-center space-x-1"
            >
              <span>← Return to Catalog</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CHECKOUT CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT COLUMN: EXPRESS CHECKOUT + FORM + TRUST GUARANTEES (7 COLS) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. EXPRESS CHECKOUT PILL BUTTONS */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400">
                  Express Checkout
                </span>
                <span className="text-[11px] text-zinc-400 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-orange-500" />
                  <span>1-Click Verification</span>
                </span>
              </div>

              {/* Express Pills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Apple Pay Button */}
                <button
                  type="button"
                  onClick={() => handleTriggerExpress('apple_pay')}
                  className="h-12 rounded-xl bg-black hover:bg-zinc-800 text-white flex items-center justify-center transition active:scale-[0.98] shadow-sm group cursor-pointer"
                  aria-label="Pay with Apple Pay"
                >
                  <span className="font-semibold text-sm flex items-center space-x-1">
                    <span className="text-base leading-none"></span>
                    <span className="tracking-tight">Pay</span>
                  </span>
                </button>

                {/* Shop Pay Button */}
                <button
                  type="button"
                  onClick={() => handleTriggerExpress('shop_pay')}
                  className="h-12 rounded-xl bg-[#5A31F4] hover:bg-[#4b25df] text-white flex items-center justify-center transition active:scale-[0.98] shadow-sm group cursor-pointer"
                  aria-label="Pay with Shop Pay"
                >
                  <span className="font-bold text-sm tracking-tight italic flex items-center">
                    <span>shop</span>
                    <span className="ml-1 not-italic font-semibold">Pay</span>
                  </span>
                </button>

                {/* PayPal Button */}
                <button
                  type="button"
                  onClick={() => handleTriggerExpress('paypal')}
                  className="h-12 rounded-xl bg-[#FFC439] hover:bg-[#f5b82a] text-[#003087] flex items-center justify-center transition active:scale-[0.98] shadow-sm group cursor-pointer"
                  aria-label="Pay with PayPal"
                >
                  <span className="font-extrabold text-sm italic tracking-tight text-[#003087]">
                    PayPal
                  </span>
                </button>
              </div>

              {/* Or Divider */}
              <div className="relative flex items-center justify-center pt-2">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                <span className="absolute px-3 bg-white dark:bg-zinc-900 text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
                  OR PAY WITH CREDIT CARD
                </span>
              </div>
            </div>

            {/* 2. SPLIT DELIVERY TIMELINE BREAKDOWN */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                    Split Delivery Schedule & Routing
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-zinc-500">2 PACKAGES SHIP SEPARATELY</span>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                To guarantee zero wait time for standard items and metrology-grade tolerances for custom pieces, your order is dispatched across two dedicated logistics streams:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* PACKAGE 1: HANDCRAFTED TO MEASURE */}
                <div className="p-4 rounded-xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-800/50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wide">
                      <Box className="w-3.5 h-3.5" />
                      <span>Package 1: Handcrafted to Measure</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-[10px] font-bold">
                      Arrives in 4–5 days
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {pkgA.length > 0 ? pkgA[0].product.title : 'Custom Parametric Desk Organizer'}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 space-y-0.5">
                      <div>• Origin: Slant 3D High-Volume Cluster (Boise, ID)</div>
                      <div>• Fabrication: ISO 2768-m Precision Additive Toolpaths</div>
                      <div>• Handling: Sliced, manufactured & cured to order</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-orange-200/60 dark:border-orange-800/40 flex items-center justify-between text-[11px] text-orange-700 dark:text-orange-400 font-medium">
                    <span>Priority Production Dispatch</span>
                    <span className="font-bold">INCLUDED</span>
                  </div>
                </div>

                {/* PACKAGE 2: IN-STOCK ACCESSORY */}
                <div className="p-4 rounded-xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-800/50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wide">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Package 2: In-Stock Accessory</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-[10px] font-bold">
                      Arrives in 2–3 days
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {pkgB.length > 0 ? pkgB[0].product.title : 'Precision Aluminum Desk ScreenBar'}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 space-y-0.5">
                      <div>• Origin: US Domestic Hub (Salt Lake City, UT)</div>
                      <div>• Courier: USPS Ground Advantage Tracked</div>
                      <div>• Handling: Picked & packed in &lt; 24 hours</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-sky-200/60 dark:border-sky-800/40 flex items-center justify-between text-[11px] text-sky-700 dark:text-sky-400 font-medium">
                    <span>Domestic Courier Tracking</span>
                    <span className="font-bold">FREE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. STANDARD CHECKOUT FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* CONTACT & SHIPPING DETAILS */}
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                    01. Contact & Shipping Address
                  </h2>
                  <span className="text-xs text-zinc-400">US & International</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Email Address (for dispatch tracking & spec sheet)
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="alexander@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                    />
                    <label className="flex items-center space-x-2 mt-2 cursor-pointer text-xs text-zinc-500">
                      <input
                        type="checkbox"
                        checked={emailOffers}
                        onChange={(e) => setEmailOffers(e.target.checked)}
                        className="rounded border-zinc-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span>Email me with manufacturing updates and future release drops</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Full Recipient Name
                      </label>
                      <input
                        type="text"
                        required
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Country / Region
                      </label>
                      <select
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                      >
                        <option value="US">United States (Domestic Ground)</option>
                        <option value="CA">Canada (International Tracked)</option>
                        <option value="GB">United Kingdom</option>
                        <option value="DE">Germany (European Priority)</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      value={form.line1}
                      onChange={(e) => setForm({ ...form, line1: e.target.value })}
                      placeholder="123 Industrial Parkway"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        required
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        ZIP / Postal Code
                      </label>
                      <input
                        type="text"
                        required
                        value={form.postalCode}
                        onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* PAYMENT INFORMATION */}
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-orange-600" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                      02. Payment Method
                    </h2>
                  </div>
                  <span className="text-xs text-zinc-500 flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>Encrypted & Verified</span>
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/70 dark:bg-zinc-800/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="payment-card"
                        name="payment-type"
                        defaultChecked
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <label htmlFor="payment-card" className="text-xs font-bold text-zinc-900 dark:text-white">
                        Credit / Debit Card
                      </label>
                    </div>
                    <div className="flex space-x-1.5 opacity-80 text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400">
                      <span className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700">
                        VISA
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700">
                        MC
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700">
                        AMEX
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <div>
                      <input
                        type="text"
                        placeholder="Card Number •••• •••• •••• ••••"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono transition"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Expiration (MM / YY)"
                          value={cardExp}
                          onChange={handleExpChange}
                          maxLength={5}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono transition"
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          placeholder="Security Code (CVC)"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
                          maxLength={4}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono transition"
                        />
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Name on Card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveInfo}
                      onChange={(e) => setSaveInfo(e.target.checked)}
                      className="rounded border-zinc-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span>Save my information for 1-click checkout in the future</span>
                  </label>
                </div>
              </div>

              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 flex items-center space-x-2">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white font-bold text-sm tracking-wide flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20 transition cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>LAUNCHING FABRICATION & SLICING TOOLPATHS...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>PAY ${finalTotal.toFixed(2)} USD & AUTHORIZE DISPATCH</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>

            {/* 4. PROMINENT CONSUMER TRUST GUARANTEES */}
            <div className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Guarantee 1: 30-Day Fit Guarantee */}
                <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-white">
                      30-Day Fit Guarantee
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug mt-0.5">
                      Fits your drawer or 100% money back. Guaranteed ±0.2mm tolerance.
                    </p>
                  </div>
                </div>

                {/* Guarantee 2: Free Returns */}
                <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-white">
                      Free Returns
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug mt-0.5">
                      Prepaid return labels on all standard domestic items. Zero questions asked.
                    </p>
                  </div>
                </div>

                {/* Guarantee 3: Carbon-Neutral Domestic Delivery */}
                <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-white">
                      Carbon-Neutral Delivery
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug mt-0.5">
                      100% carbon-offset domestic transit with certified climate forestry.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY ORDER SUMMARY (SHOPIFY PLUS STYLE - 5 COLS) */}
          <div className="lg:col-span-5 sticky top-20 space-y-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-xs uppercase tracking-wider font-bold text-zinc-900 dark:text-white">
                  Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
                </span>
                {items.length === 0 && (
                  <button
                    type="button"
                    onClick={handleLoadDemoCart}
                    className="text-xs text-orange-600 hover:underline font-semibold cursor-pointer"
                  >
                    + Load Sample Setup
                  </button>
                )}
              </div>

              {/* Items List */}
              {items.length === 0 ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-zinc-500">Your cart currently has no items.</p>
                  <button
                    type="button"
                    onClick={handleLoadDemoCart}
                    className="px-4 py-2 rounded-lg bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 transition cursor-pointer"
                  >
                    Add Sample Custom Organizer & ScreenBar
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1 divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {items.map((i) => {
                    const isCustom = i.product.type === 'custom_3d';
                    const specs = i.customSpecs?.dimensions;
                    return (
                      <div key={i.cartItemId} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                        <div className="relative w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {i.product.images && i.product.images[0] ? (
                            <img
                              src={i.product.images[0]}
                              alt={i.product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Box className="w-6 h-6 text-zinc-400" />
                          )}
                          {/* Shopify style quantity badge */}
                          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-zinc-700 text-white text-[10px] font-bold flex items-center justify-center">
                            {i.quantity}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                            {i.product.title}
                          </h4>
                          <p className="text-[11px] text-zinc-500 truncate">
                            {isCustom && specs
                              ? `${specs.length}×${specs.width}×${specs.height}mm • ${i.customSpecs?.material.name || 'Matte PLA'}`
                              : 'US Domestic Fast-Ship Item'}
                          </p>
                          <span
                            className={`inline-block mt-0.5 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                              isCustom
                                ? 'bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400'
                                : 'bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400'
                            }`}
                          >
                            {isCustom ? 'Package 1 (Farm)' : 'Package 2 (Domestic)'}
                          </span>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            ${(i.calculatedPrice * i.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* DISCOUNT CODE INPUT */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                {appliedDiscount ? (
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300">
                    <div className="flex items-center space-x-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span className="font-bold">{appliedDiscount.code}</span>
                      <span className="text-[11px]">({appliedDiscount.percent}% OFF)</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeDiscount}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition cursor-pointer"
                      aria-label="Remove code"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyDiscount} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Discount code (e.g. DRAWERFIT)"
                        value={discountInput}
                        onChange={(e) => setDiscountInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 uppercase font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {discountError && (
                  <p className="text-[11px] text-red-500 mt-1">{discountError}</p>
                )}
              </div>

              {/* FINANCIALS BREAKDOWN */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    ${baseSubtotal.toFixed(2)}
                  </span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Discount ({appliedDiscount.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center space-x-1">
                    <span>Package 1 Handcrafted Delivery</span>
                    <span className="text-[10px] text-zinc-400">(4–5 Days)</span>
                  </div>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    FREE
                  </span>
                </div>

                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center space-x-1">
                    <span>Package 2 Domestic Delivery</span>
                    <span className="text-[10px] text-zinc-400">(2–3 Days)</span>
                  </div>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    FREE
                  </span>
                </div>

                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Estimated Taxes</span>
                  <span className="text-zinc-400">Calculated at dispatch</span>
                </div>

                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-[10px] text-zinc-400 ml-1.5 uppercase">USD</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-orange-600 dark:text-orange-400 font-sans tracking-tight">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECURITY & GUARANTEE CALLOUT UNDER SUMMARY */}
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1.5 text-[11px] text-zinc-500">
                <div className="flex items-center space-x-1.5 text-zinc-900 dark:text-zinc-200 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Backed by SnugFit Metrology Warranty</span>
                </div>
                <p className="leading-snug">
                  Every order includes the printable ISO 2768-m Guaranteed Fit Certificate & Spec Sheet directly after checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
