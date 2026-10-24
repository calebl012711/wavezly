/**
 * WAVEZLY MODERN PRODUCT DETAIL MODAL (PDP)
 * Concept 1: Warm Minimalist DTC
 * - Clean airy white canvas with soft rounded-2xl geometry
 * - Studio photography & multi-perspective technical gallery
 * - Refined typography (#0F172A) & warm amber star rating
 * - Clear technical specs table (Material, Production Time, Origin, Tolerances)
 * - Color finish swatches with active ring indicator
 * - Clean Buy Box: Electric Orange (#FF6B00 / #FF7A00) Add to Bag,
 *   Secondary "Customize Millimeters" button, and 100% Snug Fit Guarantee badge.
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
  Sliders,
  Sparkles,
  ShieldCheck,
  Check,
  Truck,
  Minus,
  Plus,
  Layers,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onLaunchCustomizer: (product: Product) => void;
}

const FINISH_COLORS = [
  { name: 'Matte Obsidian Black', hex: '#222222', bg: 'bg-[#222222]' },
  { name: 'Warm Oat & Stone', hex: '#e8e5dc', bg: 'bg-[#e8e5dc]' },
  { name: 'Terracotta Clay', hex: '#b3543b', bg: 'bg-[#b3543b]' },
  { name: 'Nordic Slate Blue', hex: '#445866', bg: 'bg-[#445866]' },
  { name: 'Forest Sage Green', hex: '#4a5b48', bg: 'bg-[#4a5b48]' },
];

function getCategoryPath(prod: Product): { primary: string; secondary: string } {
  const cat = (prod.category || '').toLowerCase();
  const title = (prod.title || '').toLowerCase();

  if (
    cat === 'trending_3d' ||
    cat === 'toys' ||
    cat === 'fidget' ||
    title.includes('fidget') ||
    title.includes('dragon') ||
    title.includes('articulated') ||
    title.includes('toy') ||
    title.includes('print')
  ) {
    return {
      primary: 'Articulated Prints & Toys',
      secondary: 'Kinetic Creations',
    };
  }

  if (cat === 'kitchen') {
    return {
      primary: 'Kitchen & Barista',
      secondary: 'Custom Organization',
    };
  }

  if (cat === 'vanity') {
    return {
      primary: 'Beauty & Vanity',
      secondary: 'Precision Grids',
    };
  }

  if (cat === 'workspace') {
    return {
      primary: 'Workspace & Desk',
      secondary: 'EDC Hardware',
    };
  }

  if (cat === 'bedside' || cat === 'living' || cat === 'home_decor') {
    return {
      primary: 'Home Architecture',
      secondary: 'Modular Catchalls',
    };
  }

  if (cat === 'electronics') {
    return {
      primary: 'Desk Peripherals',
      secondary: 'Audio & Cable Rails',
    };
  }

  if (cat === 'car_auto') {
    return {
      primary: 'Vehicle Organization',
      secondary: 'Console Inserts',
    };
  }

  if (cat === 'tools_workshop') {
    return {
      primary: 'Workshop & Gridfinity',
      secondary: 'Tool Systems',
    };
  }

  return {
    primary: 'Bespoke Storage',
    secondary: 'Parametric Geometry',
  };
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onLaunchCustomizer,
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(FINISH_COLORS[0]);
  const [quantity, setQuantity] = useState(1);
  const [addedStatus, setAddedStatus] = useState<'idle' | 'added'>('idle');

  const { addStandardItem, openCart } = useCartStore();
  const { setProduct } = useCustomizerStore();

  useEffect(() => {
    setActiveImageIdx(0);
    setAddedStatus('idle');
    setQuantity(1);
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!product) return;
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const meta = amazonMetaFor(product);
  const { images, labels: imageLabels } = getAllProductImages(product);

  const displayTitle = (friendlyName(product) || product.title).replace(/SnugFit/gi, 'Wavezly');
  const categoryPath = getCategoryPath(product);

  const effectivePrice = product.basePrice;

  // Technical Specs extraction with smart defaults
  const specMaterial =
    product.technicalSpecs?.['Material'] ||
    (product.type === 'custom_3d'
      ? 'Organic Matte Biopolymer (PLA+)'
      : 'Matte Architectural Biopolymer & Resin');

  const specProduction =
    product.technicalSpecs?.['Manufacturing Time'] ||
    product.technicalSpecs?.['Production Time'] ||
    (product.type === 'custom_3d'
      ? 'Made to order (2–4 hours)'
      : 'Ships within 24 hours');

  const specOrigin =
    product.technicalSpecs?.['Origin'] ||
    (product.supplierMeta?.warehouseOrigin
      ? product.supplierMeta.warehouseOrigin.split('(')[0].trim()
      : 'Boise, ID, USA (Solar Studio)');

  const specTolerances =
    product.technicalSpecs?.['Tolerances'] || '± 0.20 mm Sub-millimeter Snug Fit';

  const handleAddToCart = () => {
    playClickSound('success');
    addStandardItem(product, quantity);
    setAddedStatus('added');
    setTimeout(() => {
      setAddedStatus('idle');
      openCart();
      onClose();
    }, 700);
  };

  const handleCustomize = () => {
    playClickSound('snap');
    setProduct(product);
    onLaunchCustomizer(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
      {/* Warm Dark Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-sm transition-opacity"
        onClick={() => {
          playClickSound('tick');
          onClose();
        }}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-stone-200/80 overflow-hidden z-10 text-left my-auto max-h-[92vh] flex flex-col">
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={() => {
            playClickSound('tick');
            onClose();
          }}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-[#0F172A] flex items-center justify-center transition-all cursor-pointer shadow-xs"
          aria-label="Close product modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* ============================================================ */}
            {/* LEFT COLUMN: CLEAN GALLERY WITH STUDIO PHOTOS & BLUEPRINTS  */}
            {/* ============================================================ */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              {/* Main Image Viewport */}
              <div className="relative aspect-square w-full rounded-2xl bg-[#FAFAFA] border border-stone-200/70 p-6 sm:p-8 flex items-center justify-center group overflow-hidden">
                {/* Lens / Perspective Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[#0F172A] text-xs font-medium border border-stone-200/70 shadow-xs flex items-center gap-1.5 z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                  {imageLabels[activeImageIdx] || `Perspective ${activeImageIdx + 1}`}
                </div>

                {/* Main Product Image */}
                <img
                  src={images[activeImageIdx]}
                  alt={displayTitle}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 select-none"
                />

                {/* Prev / Next Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageIdx((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 border border-stone-200 text-stone-600 hover:text-[#0F172A] flex items-center justify-center shadow-sm hover:scale-105 transition cursor-pointer"
                      aria-label="Previous view"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageIdx((prev) => (prev + 1) % images.length)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 border border-stone-200 text-stone-600 hover:text-[#0F172A] flex items-center justify-center shadow-sm hover:scale-105 transition cursor-pointer"
                      aria-label="Next view"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails Strip */}
              {images.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-0.5">
                  {images.map((img, idx) => {
                    const isSelected = activeImageIdx === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIdx(idx)}
                        className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl border-2 p-1.5 bg-[#FAFAFA] shrink-0 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#FF6B00] ring-2 ring-[#FF6B00]/20 shadow-xs scale-102'
                            : 'border-stone-200 hover:border-stone-400 opacity-75 hover:opacity-100'
                        }`}
                        title={imageLabels[idx] || `View ${idx + 1}`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Studio PBR Lighting Note */}
              <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                  Photorealistic PBR Studio Lighting
                </span>
                <span>{images.length} Perspectives Available</span>
              </div>
            </div>

            {/* ============================================================ */}
            {/* RIGHT COLUMN: REFINED SPECS, SWATCHES & CLEAN BUY BOX       */}
            {/* ============================================================ */}
            <div className="lg:col-span-6 flex flex-col gap-5">
              {/* Category Eyebrow */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider text-[#FF6B00] uppercase">
                  Wavezly Made-to-Order
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-stone-500">
                  {categoryPath.primary}
                </span>
              </div>

              {/* Refined Product Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight leading-snug">
                {displayTitle}
              </h1>

              {/* Warm Amber Star Rating & Stock Pill */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i <= Math.floor(meta.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-200'
                      }`}
                    />
                  ))}
                  <span className="font-bold text-[#0F172A] ml-1">
                    {meta.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-stone-300">•</span>
                <span className="text-stone-500 text-xs">
                  {meta.count.toLocaleString()} verified reviews
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 ml-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  In Stock • Ready to Print
                </span>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                  ${effectivePrice.toFixed(2)}
                </span>
                {meta.listPrice && meta.listPrice > effectivePrice && (
                  <span className="text-base text-stone-400 line-through">
                    ${meta.listPrice.toFixed(2)}
                  </span>
                )}
                {meta.hasDeal && meta.discountPercent && (
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#FFF4ED] text-[#FF6B00] border border-[#FFE6D5]">
                    Save {meta.discountPercent}%
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-stone-600 leading-relaxed">
                {product.description ||
                  'Precision-crafted organizer engineered for millimeter-perfect fit. Seamlessly integrates into your workspace, vanity, or drawer layout.'}
              </p>

              {/* Color Finish Swatches */}
              <div className="space-y-2 pt-1 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">Color Finish:</span>
                  <span className="font-semibold text-[#0F172A]">
                    {selectedColor.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {FINISH_COLORS.map((c) => {
                    const isSelected = selectedColor.name === c.name;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer relative flex items-center justify-center ${c.bg} ${
                          isSelected
                            ? 'ring-2 ring-offset-2 ring-[#FF6B00] border-white scale-110 shadow-sm'
                            : 'border-white hover:scale-105 shadow-xs ring-1 ring-stone-200'
                        }`}
                        title={c.name}
                      >
                        {isSelected && (
                          <Check
                            className={`w-4 h-4 ${
                              c.hex === '#e8e5dc'
                                ? 'text-stone-800'
                                : 'text-white'
                            }`}
                            strokeWidth={3}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clear Technical Specs Table */}
              <div className="rounded-xl bg-[#FAFAFA] border border-stone-200/80 p-4">
                <div className="text-xs font-semibold text-[#0F172A] mb-3 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>Technical Specifications</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-stone-500 block text-[11px]">Material</span>
                    <span className="font-semibold text-[#0F172A]">
                      {specMaterial}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-stone-500 block text-[11px]">
                      Production Time
                    </span>
                    <span className="font-semibold text-[#0F172A]">
                      {specProduction}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-stone-500 block text-[11px]">Origin</span>
                    <span className="font-semibold text-[#0F172A]">
                      {specOrigin}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-stone-500 block text-[11px]">
                      Tolerances
                    </span>
                    <span className="font-semibold text-[#0F172A]">
                      {specTolerances}
                    </span>
                  </div>
                </div>
              </div>

              {/* Clean Buy Box Area */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center h-12 rounded-xl border border-stone-200 bg-[#FAFAFA] px-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:text-[#0F172A] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-[#0F172A]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:text-[#0F172A] hover:bg-white transition cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* High-Visibility Electric Orange "Add to Bag" Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 h-12 rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      addedStatus === 'added'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#FF6B00] hover:bg-[#FF7A00] active:scale-[0.99] text-white hover:shadow-orange-500/25'
                    }`}
                  >
                    {addedStatus === 'added' ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <span>Add to Bag</span>
                        <span className="opacity-80 font-normal">
                          • ${(effectivePrice * quantity).toFixed(2)}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {/* Secondary "Customize Millimeters" Button */}
                <button
                  type="button"
                  onClick={handleCustomize}
                  className="w-full h-11 rounded-xl border border-stone-300 hover:border-[#0F172A] bg-white hover:bg-stone-50 active:scale-[0.99] text-[#0F172A] font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-[#FF6B00]" />
                  <span>Customize Millimeters (3D Parametric Studio)</span>
                </button>
              </div>

              {/* 100% Snug Fit Guarantee Badge */}
              <div className="p-3.5 rounded-xl bg-[#FFF9F5] border border-[#FFE6D5] flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FF6B00]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-[#0F172A]">
                    100% Snug Fit Guarantee
                  </div>
                  <p className="text-stone-600 mt-0.5 leading-relaxed">
                    Tailored to your space with sub-millimeter precision. If your
                    piece doesn’t slide in perfectly, we remake it free of charge.
                  </p>
                </div>
              </div>

              {/* Shipping info */}
              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-stone-400" />
                  Free US shipping on orders over $45
                </span>
                <span>Solar-powered domestic studio</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
