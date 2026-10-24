/**
 * WAVEZLY PRODUCT DETAIL MODAL (PDP)
 * Mobile-first bottom sheet on mobile, clean modal on desktop.
 * - Sticky bottom Add to Bag bar on mobile
 * - Multi-perspective photo gallery
 * - Clean swatches & straightforward specifications
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
  Check,
  Minus,
  Plus,
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
  { name: 'Forest Sage Green', hex: '#4a5b48', bg: 'bg-[#4a5b48]' },
];

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
  const { images } = getAllProductImages(product);
  const displayTitle = (friendlyName(product) || product.title).replace(/SnugFit/gi, 'Wavezly');
  const isCustom = product.type === 'custom_3d';

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

  return (
    <div className="fixed inset-0 z-50 flex sm:items-center justify-center sm:p-4 font-sans">
      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => {
          playClickSound('tick');
          onClose();
        }}
      />

      {/* Modal / Bottom Sheet Container */}
      <div className="relative w-full sm:max-w-4xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden z-10 text-left self-end sm:self-auto max-h-[92vh] flex flex-col">
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-12 h-1.5 bg-zinc-300 rounded-full mx-auto my-2.5 shrink-0" />

        {/* Floating Close Button */}
        <button
          type="button"
          onClick={() => {
            playClickSound('tick');
            onClose();
          }}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 sm:pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-start">
            {/* Gallery */}
            <div className="flex flex-col gap-3">
              <div className="relative aspect-square w-full rounded-xl bg-zinc-50 border border-zinc-200/80 p-4 flex items-center justify-center overflow-hidden">
                <img
                  src={images[activeImageIdx]}
                  alt={displayTitle}
                  className="max-h-full max-w-full object-contain select-none"
                />

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageIdx((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-zinc-200 text-zinc-700 flex items-center justify-center shadow-xs cursor-pointer"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageIdx((prev) => (prev + 1) % images.length)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-zinc-200 text-zinc-700 flex items-center justify-center shadow-xs cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-14 h-14 rounded-lg border-2 p-1 bg-zinc-50 shrink-0 cursor-pointer ${
                        activeImageIdx === idx
                          ? 'border-[#FF6B00]'
                          : 'border-zinc-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details & Actions */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Category & Rating */}
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
                  <span className="font-semibold uppercase tracking-wider text-[#FF6B00]">
                    {product.category?.replace('_', ' ') || '3D Print'}
                  </span>
                  <div className="flex items-center gap-1 font-semibold text-zinc-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{meta.rating.toFixed(1)}</span>
                    <span className="text-zinc-400">({meta.count})</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-2xl font-extrabold text-[#0F172A] leading-snug">
                  {displayTitle}
                </h2>

                {/* Price */}
                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-[#0F172A]">
                    ${product.basePrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-zinc-400">USD</span>
                </div>

                {/* Description */}
                <p className="mt-3 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Color Swatches */}
                <div className="mt-4 pt-4 border-t border-zinc-100">
                  <span className="text-xs font-bold text-zinc-800 block mb-2">
                    Color: <span className="font-normal text-zinc-600">{selectedColor.name}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {FINISH_COLORS.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`w-7 h-7 rounded-full border-2 transition cursor-pointer ${c.bg} ${
                          selectedColor.name === c.name
                            ? 'ring-2 ring-[#FF6B00] ring-offset-2 border-white'
                            : 'border-zinc-300'
                        }`}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Honest Specs */}
                <div className="mt-4 pt-4 border-t border-zinc-100 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Material</span>
                    <span className="font-semibold text-zinc-800">Plant-Based Matte PLA</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Fulfillment</span>
                    <span className="font-semibold text-zinc-800">Printed in 48 Hours</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Origin</span>
                    <span className="font-semibold text-zinc-800">Boise, Idaho, USA</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Guarantee</span>
                    <span className="font-semibold text-zinc-800">100% Free Replacements</span>
                  </div>
                </div>
              </div>

              {/* Desktop Action Area */}
              <div className="hidden sm:block mt-6 pt-5 border-t border-zinc-100 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-zinc-900 disabled:opacity-30 cursor-pointer"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-xs font-bold text-zinc-800">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-zinc-900 cursor-pointer"
                      aria-label="Increase"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 h-11 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                      addedStatus === 'added'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#FF6B00] hover:bg-[#ea5f00] text-white active:scale-98'
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
                        <span className="opacity-90 font-normal">
                          • ${(product.basePrice * quantity).toFixed(2)}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {isCustom && (
                  <button
                    type="button"
                    onClick={handleCustomize}
                    className="w-full h-10 rounded-xl border border-zinc-300 hover:border-zinc-900 text-zinc-800 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Enter Custom Millimeters</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Bottom Action Bar */}
        <div className="sm:hidden absolute bottom-0 inset-x-0 bg-white border-t border-zinc-200 p-3 flex items-center gap-2.5 z-20">
          {isCustom ? (
            <button
              type="button"
              onClick={handleCustomize}
              className="flex-1 h-12 rounded-xl bg-[#0F172A] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-[#FF6B00]" />
              <span>Customize Millimeters</span>
            </button>
          ) : (
            <>
              {/* Stepper */}
              <div className="flex items-center h-12 rounded-xl border border-zinc-200 bg-zinc-50 px-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center text-zinc-600 disabled:opacity-30 cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-bold text-zinc-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="w-8 h-8 flex items-center justify-center text-zinc-600 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Add Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 h-12 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                  addedStatus === 'added'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#FF6B00] active:bg-[#ea5f00] text-white'
                }`}
              >
                {addedStatus === 'added' ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <span>Add to Bag</span>
                    <span>• ${(product.basePrice * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
