/**
 * WAVEZLY LUXURY HARDWARE PRODUCT DETAIL MODAL (PDP)
 * Industrial DTC Aesthetic — Teenage Engineering precision meets Apple Store minimalism.
 *
 * Features:
 * - High-resolution studio gallery with multi-angle perspectives & technical blueprints
 * - Tactile color finish selector with micro-textured descriptions & sound feedback
 * - 3D Print Farm Specs accordion (Organic PLA+, 0.16mm layer height, Boise ID, 48h dispatch)
 * - Prominent electric orange Add to Bag (#FF6B00 -> #FF7A00) with instant visual confirmation
 * - Secondary "Customize in 3D (Exact mm)" parametric CAD launcher
 * - Dynamic Free Shipping Progress meter toward the $50 threshold
 * - Mobile-first bottom sheet drawer on touch, centered luxury floating viewport on desktop
 */

import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useCustomizerStore } from '../../store/useCustomizerStore';
import { playClickSound } from '../../lib/soundEffects';
import { getAllProductImages } from '../../lib/productImages';
import { amazonMetaFor, friendlyName } from '../../lib/storefront';
import {
  X,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sliders,
  Check,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  Layers,
  Leaf,
  MapPin,
  Sparkles,
  ShoppingBag,
  Zap,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onLaunchCustomizer: (product: Product) => void;
}

interface FinishColor {
  id: string;
  name: string;
  hex: string;
  bgClass: string;
  borderClass: string;
  badge: string;
  description: string;
}

const FINISH_COLORS: FinishColor[] = [
  {
    id: 'obsidian',
    name: 'Matte Obsidian Black',
    hex: '#18181B',
    bgClass: 'bg-[#18181B]',
    borderClass: 'border-zinc-700',
    badge: 'PEI Matte Satin',
    description: 'Deep light-absorbing satin finish with micro-textured PEI bed release',
  },
  {
    id: 'stone',
    name: 'Warm Oat & Stone',
    hex: '#E5E0D8',
    bgClass: 'bg-[#E5E0D8]',
    borderClass: 'border-[#CCC5B9]',
    badge: 'Natural Mineral',
    description: 'Subtle warm Scandinavian architectural tone with natural matte texture',
  },
  {
    id: 'terracotta',
    name: 'Terracotta Clay',
    hex: '#B45339',
    bgClass: 'bg-[#B45339]',
    borderClass: 'border-[#943F2A]',
    badge: 'Architectural Earth',
    description: 'Warm earthen pigment inspired by mid-century ceramic studio pottery',
  },
  {
    id: 'sage',
    name: 'Forest Sage Green',
    hex: '#475545',
    bgClass: 'bg-[#475545]',
    borderClass: 'border-[#384336]',
    badge: 'Low-Gloss Botanic',
    description: 'Muted botanic shade engineered to blend seamlessly into clean desk setups',
  },
];

interface SpecAccordionItem {
  id: string;
  title: string;
  highlight: string;
  icon: React.ComponentType<{ className?: string }>;
  details: string[];
}

const FARM_SPECS: SpecAccordionItem[] = [
  {
    id: 'material',
    title: 'Material Composition',
    highlight: '100% Organic Corn-Derived PLA+',
    icon: Leaf,
    details: [
      '100% Organic Corn-Derived PLA+ (biodegradable, non-toxic, odorless)',
      'Derived entirely from renewable agricultural starches without fossil fuel polymers',
      'Food-contact safe base resin with zero petroleum additives or toxic off-gassing',
    ],
  },
  {
    id: 'precision',
    title: 'Print Farm Precision',
    highlight: '0.16mm Layer Height • PEI Base',
    icon: Layers,
    details: [
      'Print Precision: Layer height 0.16mm fine finish, zero stringing, textured PEI base',
      'High-speed automated CoreXY printers calibrated to ±0.15mm dimensional tolerance',
      'Bottom plate heat-cured directly on textured spring steel PEI for a tactile matte base',
    ],
  },
  {
    id: 'origin',
    title: 'Production Origin',
    highlight: 'Boise, Idaho, USA • On-Demand',
    icon: MapPin,
    details: [
      'Production Origin: 3D Printed on-demand in Boise, Idaho, USA',
      'Automated additive manufacturing farm with computer-vision optical verification',
      'Zero overproduction inventory waste — precision fabricated within minutes of order',
    ],
  },
  {
    id: 'dispatch',
    title: 'Dispatch & Shipping',
    highlight: 'Ships in 48 Hours • USPS / UPS Live Tracking',
    icon: Truck,
    details: [
      'Dispatch: Ships in 48 hours via USPS / UPS with live tracking',
      'Packaged in 100% recyclable, plastic-free kraft corrugate with shock-dampening fluting',
      'Covered by our 30-Day Zero-Risk Fit Guarantee — free immediate replacement if damaged',
    ],
  },
];

const FREE_SHIPPING_THRESHOLD = 50.0;

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onLaunchCustomizer,
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<FinishColor>(FINISH_COLORS[0]);
  const [quantity, setQuantity] = useState(1);
  const [addedStatus, setAddedStatus] = useState<'idle' | 'added'>('idle');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    material: true,
    precision: false,
    origin: false,
    dispatch: false,
  });

  const { addStandardItem, openCart, getSubtotalCents } = useCartStore();
  const { setProduct } = useCustomizerStore();

  useEffect(() => {
    setActiveImageIdx(0);
    setAddedStatus('idle');
    setQuantity(1);
    setSelectedColor(FINISH_COLORS[0]);
    setOpenSections({
      material: true,
      precision: false,
      origin: false,
      dispatch: false,
    });
  }, [product]);

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!product) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveImageIdx((prev) => (prev + 1) % images.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const meta = amazonMetaFor(product);
  const { images, labels } = getAllProductImages(product);
  const displayTitle = (friendlyName(product) || product.title).replace(/SnugFit/gi, 'Wavezly');
  const isCustom = product.type === 'custom_3d';

  // Free shipping progress calculation
  const currentSubtotal = getSubtotalCents() / 100;
  const currentItemTotal = product.basePrice * quantity;
  const projectedTotal = currentSubtotal + currentItemTotal;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - projectedTotal);
  const shippingProgressPct = Math.min(100, Math.round((projectedTotal / FREE_SHIPPING_THRESHOLD) * 100));

  const toggleAccordion = (id: string) => {
    playClickSound('toggle');
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectColor = (color: FinishColor) => {
    playClickSound('snap');
    setSelectedColor(color);
  };

  const handleAddToCart = () => {
    playClickSound('success');
    addStandardItem(product, quantity);
    setAddedStatus('added');
    setTimeout(() => {
      setAddedStatus('idle');
      openCart();
      onClose();
    }, 600);
  };

  const handleCustomize = () => {
    playClickSound('snap');
    setProduct(product);
    onLaunchCustomizer(product);
    onClose();
  };

  const currentAngleLabel = labels[activeImageIdx] || `Perspective 0${activeImageIdx + 1}`;

  return (
    <div className="fixed inset-0 z-50 flex sm:items-center justify-center sm:p-4 lg:p-6 font-sans">
      {/* High-Fidelity Studio Blur Backdrop */}
      <div
        className="fixed inset-0 bg-zinc-950/70 backdrop-blur-md transition-opacity duration-300"
        onClick={() => {
          playClickSound('tick');
          onClose();
        }}
      />

      {/* Floating Hardware Modal Container */}
      <div className="relative w-full sm:max-w-4xl lg:max-w-5xl bg-white text-zinc-900 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-zinc-200/90 overflow-hidden z-10 text-left self-end sm:self-auto max-h-[92vh] flex flex-col transition-all duration-200">
        {/* Mobile Tactile Drag Pill */}
        <div className="sm:hidden w-12 h-1.5 bg-zinc-300 rounded-full mx-auto my-2.5 shrink-0" />

        {/* Top Hardware Navigation Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-zinc-100 bg-zinc-50/70 shrink-0">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider text-zinc-500 uppercase">
            <span className="inline-block w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
            <span className="font-semibold text-zinc-900">Wavezly Studio</span>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-600">ID-PRD-{(product.id || '001').slice(-6).toUpperCase()}</span>
          </div>

          {/* Close Trigger */}
          <button
            type="button"
            onClick={() => {
              playClickSound('tick');
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-zinc-200/60 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Main Hardware Showcase */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-8 pb-28 sm:pb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* LEFT COLUMN: Studio Photography & Multi-Angle Technical Gallery (5 Cols) */}
            <div className="md:col-span-6 lg:col-span-6 flex flex-col gap-3">
              {/* Primary Viewport with Technical Corner Markers */}
              <div className="relative aspect-square w-full rounded-xl bg-[#F8F9FA] border border-zinc-200/80 p-6 flex items-center justify-center overflow-hidden group shadow-inner">
                {/* TE-Inspired Technical Angle Watermark */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-zinc-200/80 px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider uppercase text-zinc-600 shadow-2xs">
                  <span className="text-[#FF6B00] font-bold">0{activeImageIdx + 1}</span>
                  <span className="text-zinc-300">•</span>
                  <span>{currentAngleLabel}</span>
                </div>

                {/* Technical Accuracy Pill */}
                <div className="hidden sm:flex absolute bottom-3 left-3 z-10 items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-zinc-200/80 px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider uppercase text-zinc-500 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-[#FF6B00]" />
                  <span>1:1 CAD Model</span>
                </div>

                {/* Primary Image */}
                <img
                  src={images[activeImageIdx]}
                  alt={`${displayTitle} - ${currentAngleLabel}`}
                  className="max-h-full max-w-full object-contain select-none transition-transform duration-300 group-hover:scale-102 drop-shadow-sm"
                />

                {/* Perspective Steppers */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound('tick');
                        setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                      }}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 border border-zinc-200/90 text-zinc-700 hover:text-zinc-950 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition cursor-pointer"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound('tick');
                        setActiveImageIdx((prev) => (prev + 1) % images.length);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 border border-zinc-200/90 text-zinc-700 hover:text-zinc-950 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Gallery Thumbnails Strip */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {images.map((img, idx) => {
                    const isSelected = activeImageIdx === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          playClickSound('tick');
                          setActiveImageIdx(idx);
                        }}
                        className={`relative w-15 h-15 rounded-lg border-2 p-1 bg-[#F8F9FA] shrink-0 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#FF6B00] ring-2 ring-[#FF6B00]/20 shadow-xs'
                            : 'border-zinc-200/80 opacity-70 hover:opacity-100 hover:border-zinc-300'
                        }`}
                        title={labels[idx] || `Angle ${idx + 1}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-contain" />
                        <span className="absolute bottom-0.5 right-1 text-[9px] font-mono text-zinc-400">
                          0{idx + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Hardware Guarantee Strip */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/70 text-zinc-700 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px] font-medium leading-tight">
                    30-Day Zero-Risk Fit Guarantee
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/70 text-zinc-700 text-xs">
                  <Zap className="w-4 h-4 text-[#FF6B00] shrink-0" />
                  <span className="text-[11px] font-medium leading-tight">
                    0.16mm Precision Farm Layer
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Architecture, Color Finish, Specs Accordion & Checkout (6 Cols) */}
            <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Micro-Header: Category & Rating */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-orange-100 text-[#FF6B00]">
                      {product.category?.replace('_', ' ') || '3D PRINT FARM'}
                    </span>
                    {isCustom && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-zinc-100 text-zinc-700 border border-zinc-200">
                        Parametric CAD
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-700 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-200/80">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{meta.rating.toFixed(1)}</span>
                    <span className="text-zinc-400">({meta.count})</span>
                  </div>
                </div>

                {/* Primary Title */}
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                  {displayTitle}
                </h2>

                {/* Price Display */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
                    ${product.basePrice.toFixed(2)}
                  </span>
                  <span className="text-xs font-mono uppercase text-zinc-400">USD • On-Demand</span>
                </div>

                {/* Editorial Product Description */}
                <p className="mt-3 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Free Shipping Progress Meter */}
                <div className="mt-5 p-3 rounded-xl bg-orange-50/70 border border-orange-200/80">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                    <span className="flex items-center gap-1.5 text-zinc-800">
                      <Truck className="w-3.5 h-3.5 text-[#FF6B00]" />
                      {remainingForFreeShipping === 0 ? (
                        <span className="text-emerald-700 font-bold">
                          Free US Shipping Unlocked!
                        </span>
                      ) : (
                        <span>
                          Add <strong className="text-[#FF6B00]">${remainingForFreeShipping.toFixed(2)}</strong> more for Free Shipping
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-zinc-500">
                      ${projectedTotal.toFixed(2)} / ${FREE_SHIPPING_THRESHOLD.toFixed(2)}
                    </span>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="w-full h-2 bg-orange-200/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        remainingForFreeShipping === 0
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                          : 'bg-gradient-to-r from-[#FF6B00] to-amber-500'
                      }`}
                      style={{ width: `${shippingProgressPct}%` }}
                    />
                  </div>
                </div>

                {/* Tactile Color Finish Selector */}
                <div className="mt-5 pt-4 border-t border-zinc-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-bold text-zinc-900">
                      Color Finish:{' '}
                      <span className="font-normal text-zinc-600">{selectedColor.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">
                      {selectedColor.badge}
                    </span>
                  </div>

                  {/* Swatches */}
                  <div className="flex items-center gap-2.5">
                    {FINISH_COLORS.map((c) => {
                      const isSelected = selectedColor.id === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleSelectColor(c)}
                          className={`group relative w-8 h-8 rounded-full transition-all duration-150 cursor-pointer flex items-center justify-center ${c.bgClass} ${
                            isSelected
                              ? 'ring-2 ring-[#FF6B00] ring-offset-2 scale-110 shadow-xs'
                              : 'opacity-85 hover:opacity-100 hover:scale-105 border border-zinc-300'
                          }`}
                          title={`${c.name} - ${c.description}`}
                          aria-label={`Select ${c.name}`}
                        >
                          {isSelected && (
                            <Check
                              className={`w-3.5 h-3.5 stroke-[3] ${
                                c.id === 'stone' ? 'text-zinc-900' : 'text-white'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Micro-textured finish description */}
                  <p className="mt-2 text-[11px] text-zinc-500 italic">
                    {selectedColor.description}
                  </p>
                </div>

                {/* 3D Print Farm Specs Accordion */}
                <div className="mt-5 pt-4 border-t border-zinc-100">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                      3D Print Farm Specifications
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 font-semibold">
                      Boise Node Verified
                    </span>
                  </div>

                  <div className="space-y-2">
                    {FARM_SPECS.map((spec) => {
                      const isOpen = !!openSections[spec.id];
                      const IconComponent = spec.icon;

                      return (
                        <div
                          key={spec.id}
                          className="rounded-xl border border-zinc-200/90 overflow-hidden bg-zinc-50/50 transition-colors"
                        >
                          <button
                            type="button"
                            onClick={() => toggleAccordion(spec.id)}
                            className="w-full p-3 flex items-center justify-between text-left hover:bg-zinc-100/60 transition cursor-pointer"
                            aria-expanded={isOpen}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-6 h-6 rounded-md bg-white border border-zinc-200 flex items-center justify-center text-[#FF6B00] shrink-0">
                                <IconComponent className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-zinc-900 block leading-tight">
                                  {spec.title}
                                </span>
                                <span className="text-[11px] text-zinc-500 font-mono">
                                  {spec.highlight}
                                </span>
                              </div>
                            </div>

                            <div className="w-6 h-6 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 shrink-0">
                              {isOpen ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </div>
                          </button>

                          {isOpen && (
                            <div className="px-3.5 pb-3.5 pt-1 text-xs text-zinc-600 border-t border-zinc-200/60 bg-white space-y-1.5 animate-fadeIn">
                              {spec.details.map((detail, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <span className="text-[#FF6B00] mt-0.5">•</span>
                                  <span className="leading-relaxed">{detail}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Desktop Action Section */}
              <div className="hidden sm:block mt-6 pt-5 border-t border-zinc-200/80 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Tactile Quantity Stepper */}
                  <div className="flex items-center h-12 rounded-xl border border-zinc-300 bg-zinc-50 px-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound('tick');
                        setQuantity((q) => Math.max(1, q - 1));
                      }}
                      disabled={quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-zinc-950 disabled:opacity-30 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-mono font-bold text-zinc-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound('tick');
                        setQuantity((q) => Math.min(10, q + 1));
                      }}
                      className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-zinc-950 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Primary Electric Orange Add to Bag Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 h-12 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                      addedStatus === 'added'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#FF6B00] hover:bg-[#FF7A00] active:scale-[0.98] text-white shadow-orange-500/20'
                    }`}
                  >
                    {addedStatus === 'added' ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag</span>
                        <span className="opacity-90 font-mono font-normal">
                          • ${(product.basePrice * quantity).toFixed(2)}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {/* Secondary "Customize in 3D (Exact mm)" Trigger */}
                <button
                  type="button"
                  onClick={handleCustomize}
                  className="w-full h-11 rounded-xl border border-zinc-900 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs tracking-wide transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>Customize in 3D (Exact mm)</span>
                  <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">
                    LIVE CAD
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Bottom Action Bar */}
        <div className="sm:hidden absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-zinc-200 p-3 z-20 space-y-2 shadow-lg">
          <div className="flex items-center gap-2.5">
            {/* Stepper */}
            <div className="flex items-center h-12 rounded-xl border border-zinc-300 bg-zinc-50 px-1 shrink-0">
              <button
                type="button"
                onClick={() => {
                  playClickSound('tick');
                  setQuantity((q) => Math.max(1, q - 1));
                }}
                disabled={quantity <= 1}
                className="w-8 h-8 flex items-center justify-center text-zinc-600 disabled:opacity-30 cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-xs font-mono font-bold text-zinc-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => {
                  playClickSound('tick');
                  setQuantity((q) => Math.min(10, q + 1));
                }}
                className="w-8 h-8 flex items-center justify-center text-zinc-600 cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Electric Orange Add to Bag */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 h-12 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                addedStatus === 'added'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#FF6B00] hover:bg-[#FF7A00] active:scale-[0.98] text-white shadow-orange-500/25'
              }`}
            >
              {addedStatus === 'added' ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                  <span className="font-mono">• ${(product.basePrice * quantity).toFixed(2)}</span>
                </>
              )}
            </button>
          </div>

          {/* Secondary Mobile Customize Button */}
          <button
            type="button"
            onClick={handleCustomize}
            className="w-full h-10 rounded-xl bg-zinc-900 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Customize in 3D (Exact mm)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
