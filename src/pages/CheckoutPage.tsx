/**
 * WAVEZLY INTEGRATED DTC CHECKOUT EXPERIENCE
 * Concept 1: Warm Minimalist DTC
 * - Pure airy white canvas (#FFFFFF / #FAFAF9)
 * - Sleek dark charcoal typography (#0F172A)
 * - Electric orange primary accents (#FF6B00 / #FF7A00)
 * - Soft warm micro-shadows, zero Amazon clutter
 * - Express Checkout simulation (Apple Pay, Shop Pay, PayPal)
 * - Split Delivery schedule breakdown
 * - Sticky order summary with high-res thumbnail previews
 * - 100% Snug Fit Guarantee badge & legal ISO 2768-m assurance
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
  ChevronRight,
  Info,
  Sparkles,
  ShoppingBag,
  BadgeCheck,
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
      setAppliedDiscount({ code, percent: 15, label: '15% Off Launch Special' });
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

  // Quick load demo set if cart is empty
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
        try {
          const cachedData = JSON.stringify({
            orderNumber: response.orderNumber,
            items: orderItems.map(({ stlBlob, ...rest }) => rest),
            shippingAddress: form,
            timestamp: new Date().toISOString(),
            paymentMethod: methodLabel,
            discountApplied: appliedDiscount,
          });
          localStorage.setItem('wavezly-last-order', cachedData);
          localStorage.setItem('snugfit-last-order', cachedData);
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
    <div className="min-h-screen bg-white text-[#0F172A] font-sans selection:bg-[#FF6B00] selection:text-white">
      {/* EXPRESS CHECKOUT INTERACTIVE MODAL */}
      {activeExpressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(15,23,42,0.18)] border border-slate-100 space-y-5">
            <button
              onClick={() => setActiveExpressModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-[#0F172A] transition p-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {activeExpressModal === 'apple_pay' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold font-sans tracking-tight text-[#0F172A]"> Pay</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                    Biometric Verified
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-slate-200/70 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Card:</span>
                    <span className="font-semibold text-[#0F172A]">Apple Card (•••• 9842)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ship to:</span>
                    <span className="font-semibold text-[#0F172A]">404 Industrial Pkwy, SF CA</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200/80 pt-2 font-bold text-sm">
                    <span className="text-[#0F172A]">Pay Wavezly:</span>
                    <span className="text-[#FF6B00] font-extrabold">${finalTotal.toFixed(2)} USD</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 text-center">
                  Double Click Side Button or Confirm with Touch ID to complete order.
                </p>
                <button
                  type="button"
                  disabled={expressProcessing}
                  onClick={handleConfirmExpress}
                  className="w-full py-4 px-4 rounded-xl bg-black hover:bg-slate-900 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition cursor-pointer shadow-md active:scale-[0.99] disabled:opacity-60"
                >
                  {expressProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Authorizing Apple Pay...</span>
                    </>
                  ) : (
                    <span>Pay with  Pay • ${finalTotal.toFixed(2)}</span>
                  )}
                </button>
              </div>
            )}

            {activeExpressModal === 'shop_pay' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-[#5A31F4] text-white px-2.5 py-1 rounded-md text-xs font-bold italic tracking-tight">
                    shop Pay
                  </div>
                  <span className="text-xs text-slate-500 font-medium">1-Click Fast Checkout</span>
                </div>
                <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account:</span>
                    <span className="font-semibold text-[#0F172A]">{form.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Card:</span>
                    <span className="font-semibold text-[#0F172A]">Visa ending in 4242</span>
                  </div>
                  <div className="flex justify-between border-t border-purple-200/60 pt-2 font-bold text-sm">
                    <span className="text-[#0F172A]">Total:</span>
                    <span className="text-[#5A31F4] font-extrabold">${finalTotal.toFixed(2)} USD</span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={expressProcessing}
                  onClick={handleConfirmExpress}
                  className="w-full py-4 px-4 rounded-xl bg-[#5A31F4] hover:bg-[#4d27d9] text-white font-semibold text-sm flex items-center justify-center space-x-2 transition cursor-pointer shadow-md active:scale-[0.99] disabled:opacity-60"
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
                  <span className="text-xs text-slate-500 font-medium">Express Checkout</span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account:</span>
                    <span className="font-semibold text-[#0F172A]">{form.email}</span>
                  </div>
                  <div className="flex justify-between border-t border-amber-200/80 pt-2 font-bold text-sm">
                    <span className="text-[#0F172A]">Total:</span>
                    <span className="text-amber-700 font-extrabold">${finalTotal.toFixed(2)} USD</span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={expressProcessing}
                  onClick={handleConfirmExpress}
                  className="w-full py-4 px-4 rounded-xl bg-[#FFC439] hover:bg-[#f4b82d] text-[#003087] font-bold text-sm flex items-center justify-center space-x-2 transition cursor-pointer shadow-md active:scale-[0.99] disabled:opacity-60"
                >
                  {expressProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#003087]" />
                      <span>Authorizing PayPal...</span>
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
      <header className="border-b border-slate-100 bg-white sticky top-0 z-30 shadow-[0_1px_3px_rgba(15,23,42,0.02)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-black tracking-tight text-xl text-[#0F172A]">
              Wavezly<span className="text-[#FF6B00]">.</span>
            </span>
            <span className="hidden sm:inline-block h-4 w-px bg-slate-200" />
            <span className="hidden sm:inline-flex items-center text-xs text-slate-500 space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-medium">256-Bit SSL Encrypted Checkout</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-2 text-xs font-medium text-slate-400">
              <span className="text-slate-600">Cart</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-600">Information</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-600">Shipping</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#FF6B00] font-bold">Payment</span>
            </nav>

            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-semibold text-slate-500 hover:text-[#FF6B00] transition flex items-center space-x-1 cursor-pointer"
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
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-500">
                  Express Checkout
                </span>
                <span className="text-[11px] text-slate-500 flex items-center space-x-1 font-medium">
                  <Sparkles className="w-3 h-3 text-[#FF6B00]" />
                  <span>Instant 1-Click Verification</span>
                </span>
              </div>

              {/* Express Pills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Apple Pay Button */}
                <button
                  type="button"
                  onClick={() => handleTriggerExpress('apple_pay')}
                  className="h-12 rounded-xl bg-black hover:bg-slate-900 text-white flex items-center justify-center transition active:scale-[0.98] shadow-sm cursor-pointer"
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
                  className="h-12 rounded-xl bg-[#5A31F4] hover:bg-[#4b25df] text-white flex items-center justify-center transition active:scale-[0.98] shadow-sm cursor-pointer"
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
                  className="h-12 rounded-xl bg-[#FFC439] hover:bg-[#f5b82a] text-[#003087] flex items-center justify-center transition active:scale-[0.98] shadow-sm cursor-pointer"
                  aria-label="Pay with PayPal"
                >
                  <span className="font-extrabold text-sm italic tracking-tight text-[#003087]">
                    PayPal
                  </span>
                </button>
              </div>

              {/* Or Divider */}
              <div className="relative flex items-center justify-center pt-2">
                <div className="w-full border-t border-slate-200" />
                <span className="absolute px-3 bg-white text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                  OR PAY WITH CARD
                </span>
              </div>
            </div>

            {/* 2. SPLIT DELIVERY TIMELINE BREAKDOWN */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                    Split Delivery Schedule & Routing
                  </h2>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  DUAL-STREAM DISPATCH
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Custom made-to-measure orders and in-stock items are packaged carefully for prompt delivery:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* PACKAGE 1: HANDCRAFTED TO MEASURE */}
                <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#FF6B00] uppercase tracking-wide">
                      <Box className="w-3.5 h-3.5" />
                      <span>Package 1: Made-to-Order 3D</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#FF6B00] text-[10px] font-bold">
                      Arrives in 4–5 days
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-700">
                    <div className="font-bold text-[#0F172A]">
                      {pkgA.length > 0 ? pkgA[0].product.title : 'Custom Drawer Organizer'}
                    </div>
                    <div className="text-[11px] text-slate-500 space-y-0.5">
                      <div>• Origin: Wavezly US Print Studio</div>
                      <div>• Material: Plant-based durable matte PLA</div>
                      <div>• Guarantee: 100% Free Replacements</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-orange-200/60 flex items-center justify-between text-[11px] text-[#FF6B00] font-medium">
                    <span>Priority Production Dispatch</span>
                    <span className="font-bold">INCLUDED</span>
                  </div>
                </div>

                {/* PACKAGE 2: IN-STOCK ACCESSORY */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide">
                      <Truck className="w-3.5 h-3.5 text-slate-600" />
                      <span>Package 2: In-Stock</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 text-[10px] font-bold">
                      Arrives in 2–3 days
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-700">
                    <div className="font-bold text-[#0F172A]">
                      {pkgB.length > 0 ? pkgB[0].product.title : 'Precision Aluminum Desk ScreenBar'}
                    </div>
                    <div className="text-[11px] text-slate-500 space-y-0.5">
                      <div>• Origin: US Domestic Hub (Salt Lake City, UT)</div>
                      <div>• Courier: USPS Ground Advantage Tracked</div>
                      <div>• Handling: Picked & packed in &lt; 24 hours</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-700 font-medium">
                    <span>Domestic Courier Tracking</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. STANDARD CHECKOUT FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* CONTACT & SHIPPING DETAILS */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                    01. Contact & Shipping Address
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">US & International</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">
                      Email Address (for dispatch tracking & spec sheet)
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="alexander@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition"
                    />
                    <label className="flex items-center space-x-2 mt-2 cursor-pointer text-xs text-slate-500">
                      <input
                        type="checkbox"
                        checked={emailOffers}
                        onChange={(e) => setEmailOffers(e.target.checked)}
                        className="rounded border-slate-300 text-[#FF6B00] focus:ring-[#FF6B00]"
                      />
                      <span>Email me with manufacturing updates and future release drops</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-[#0F172A] mb-1">
                        Full Recipient Name
                      </label>
                      <input
                        type="text"
                        required
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0F172A] mb-1">
                        Country / Region
                      </label>
                      <select
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition"
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
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      value={form.line1}
                      onChange={(e) => setForm({ ...form, line1: e.target.value })}
                      placeholder="123 Industrial Parkway"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <label className="block text-xs font-bold text-[#0F172A] mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition"
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-xs font-bold text-[#0F172A] mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        required
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition"
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-xs font-bold text-[#0F172A] mb-1">
                        ZIP / Postal Code
                      </label>
                      <input
                        type="text"
                        required
                        value={form.postalCode}
                        onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* PAYMENT INFORMATION */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-[#FF6B00]" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                      02. Payment Method
                    </h2>
                  </div>
                  <span className="text-xs text-slate-500 flex items-center space-x-1 font-medium">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>Encrypted & Verified</span>
                  </span>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200/80 bg-[#FAFAF9] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="payment-card"
                        name="payment-type"
                        defaultChecked
                        className="text-[#FF6B00] focus:ring-[#FF6B00]"
                      />
                      <label htmlFor="payment-card" className="text-xs font-bold text-[#0F172A]">
                        Credit / Debit Card
                      </label>
                    </div>
                    <div className="flex space-x-1.5 opacity-90 text-[10px] font-mono font-bold text-slate-600">
                      <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200">
                        VISA
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200">
                        MC
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200">
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] font-mono transition"
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
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] font-mono transition"
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          placeholder="Security Code (CVC)"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
                          maxLength={4}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] font-mono transition"
                        />
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Name on Card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={saveInfo}
                      onChange={(e) => setSaveInfo(e.target.checked)}
                      className="rounded border-slate-300 text-[#FF6B00] focus:ring-[#FF6B00]"
                    />
                    <span>Save my information for 1-click checkout in the future</span>
                  </label>
                </div>
              </div>

              {errorMessage && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center space-x-2">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* ELECTRIC ORANGE SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-[#FF6B00] hover:bg-[#FF7A00] active:scale-[0.99] text-white font-bold text-sm tracking-wide flex items-center justify-center space-x-2 shadow-[0_10px_25px_-5px_rgba(255,107,0,0.35)] transition cursor-pointer disabled:opacity-60"
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
                {/* Guarantee 1: 100% Snug Fit Guarantee */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col justify-between space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF6B00]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#0F172A]">
                      100% Snug Fit Guarantee
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                      Fits your drawer perfectly or 100% refund. Guaranteed ±0.2mm precision.
                    </p>
                  </div>
                </div>

                {/* Guarantee 2: 30-Day Free Returns */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col justify-between space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#0F172A]">
                      30-Day Free Returns
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                      Prepaid return labels on all domestic items. Zero questions asked.
                    </p>
                  </div>
                </div>

                {/* Guarantee 3: Fast Domestic Shipping */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col justify-between space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#0F172A]">
                      Fast Domestic Shipping
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                      Dispatched in &lt;24h with tracked domestic carrier delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY ORDER SUMMARY (SHOPIFY PLUS STYLE - 5 COLS) */}
          <div className="lg:col-span-5 sticky top-20 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs uppercase tracking-wider font-bold text-[#0F172A]">
                  Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
                </span>
                {items.length === 0 && (
                  <button
                    type="button"
                    onClick={handleLoadDemoCart}
                    className="text-xs text-[#FF6B00] hover:underline font-bold cursor-pointer"
                  >
                    + Load Sample Setup
                  </button>
                )}
              </div>

              {/* Items List */}
              {items.length === 0 ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-slate-500">Your cart currently has no items.</p>
                  <button
                    type="button"
                    onClick={handleLoadDemoCart}
                    className="px-4 py-2.5 rounded-xl bg-[#FF6B00] text-white text-xs font-bold hover:bg-[#FF7A00] transition cursor-pointer shadow-sm"
                  >
                    Add Sample Custom Organizer & ScreenBar
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1 divide-y divide-slate-100">
                  {items.map((i) => {
                    const isCustom = i.product.type === 'custom_3d';
                    const specs = i.customSpecs?.dimensions;
                    return (
                      <div key={i.cartItemId} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                        <div className="relative w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200/80 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {i.product.images && i.product.images[0] ? (
                            <img
                              src={i.product.images[0]}
                              alt={i.product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Box className="w-6 h-6 text-slate-400" />
                          )}
                          {/* DTC quantity badge */}
                          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#0F172A] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                            {i.quantity}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#0F172A] truncate">
                            {i.product.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">
                            {isCustom && specs
                              ? `${specs.length}×${specs.width}×${specs.height}mm • ${i.customSpecs?.material.name || 'Matte PLA'}`
                              : 'US Domestic Fast-Ship Item'}
                          </p>
                          <span
                            className={`inline-block mt-0.5 text-[9px] px-1.5 py-0.2 rounded-md font-bold uppercase ${
                              isCustom
                                ? 'bg-orange-50 text-[#FF6B00] border border-orange-100'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {isCustom ? 'Package 1 (Farm)' : 'Package 2 (Domestic)'}
                          </span>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="text-xs font-extrabold text-[#0F172A]">
                            ${(i.calculatedPrice * i.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* DISCOUNT CODE INPUT */}
              <div className="pt-2 border-t border-slate-100">
                {appliedDiscount ? (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                    <div className="flex items-center space-x-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-bold">{appliedDiscount.code}</span>
                      <span className="text-[11px] font-semibold text-emerald-600">({appliedDiscount.percent}% OFF)</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeDiscount}
                      className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
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
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#FF6B00] uppercase font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-[#0F172A] text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {discountError && (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">{discountError}</p>
                )}
              </div>

              {/* FINANCIALS BREAKDOWN */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#0F172A]">
                    ${baseSubtotal.toFixed(2)}
                  </span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({appliedDiscount.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <div className="flex items-center space-x-1">
                    <span>Package 1 Handcrafted Delivery</span>
                    <span className="text-[10px] text-slate-400">(4–5 Days)</span>
                  </div>
                  <span className="font-semibold text-emerald-600">
                    FREE
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <div className="flex items-center space-x-1">
                    <span>Package 2 Domestic Delivery</span>
                    <span className="text-[10px] text-slate-400">(2–3 Days)</span>
                  </div>
                  <span className="font-semibold text-emerald-600">
                    FREE
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Estimated Taxes</span>
                  <span className="text-slate-400">Calculated at dispatch</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-[#0F172A]">
                      Total
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1.5 uppercase font-medium">USD</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#FF6B00] font-sans tracking-tight">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 100% SNUG FIT GUARANTEE BADGE */}
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-orange-200/60 space-y-2">
                <div className="flex items-center space-x-2 text-[#0F172A]">
                  <BadgeCheck className="w-5 h-5 text-[#FF6B00] flex-shrink-0" />
                  <span className="text-xs font-bold tracking-tight">Wavezly 100% Snug Fit Guarantee</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Precision engineered to within ±0.2mm tolerance. If your bespoke insert doesn't slide into your drawer with a satisfying snug fit, we'll recraft it at zero cost or refund 100%.
                </p>
                <div className="pt-1 flex items-center space-x-1.5 text-[10px] text-slate-500 font-mono font-medium">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>ISO 2768-m Spec Sheet & Inspection Certificate included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
