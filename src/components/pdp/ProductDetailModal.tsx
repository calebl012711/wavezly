/**
 * FORMGRID CONSUMER PRODUCT DETAIL MODAL (PDP)
 * Prioritized Light Mode, 5-perspective high-res gallery, clear customer specs, and split-shipping ETA
 */

import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useCustomizerStore } from '../../store/useCustomizerStore';
import { playClickSound } from '../../lib/soundEffects';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Truck,
  ShieldCheck,
  Star,
  Check,
  Sliders,
  MapPin,
  ShoppingBag,
  Box,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onLaunchCustomizer: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onLaunchCustomizer,
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [zipCode, setZipCode] = useState('94107');
  const [isAdded, setIsAdded] = useState(false);

  const { addStandardItem, openCart } = useCartStore();
  const { setProduct } = useCustomizerStore();

  useEffect(() => {
    setActiveImageIdx(0);
    setIsAdded(false);
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!product) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        setActiveImageIdx((prev) => (prev + 1) % (product.images.length || 1));
      }
      if (e.key === 'ArrowLeft') {
        setActiveImageIdx((prev) =>
          prev === 0 ? (product.images.length || 1) - 1 : prev - 1
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const isCustom = product.type === 'custom_3d';
  const images = product.images.length > 0 ? product.images : ['/assets/products/valet-pro-hero.svg'];
  const imageLabels = [
    'Perspective View',
    'Top Plan Angle',
    'Macro Texture & Edges',
    'Dimension Blueprint',
    'Studio Environment',
  ];

  const handleAction = () => {
    if (isCustom) {
      playClickSound('snap');
      setProduct(product);
      onLaunchCustomizer(product);
      onClose();
    } else {
      playClickSound('success');
      addStandardItem(product, 1);
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
        openCart();
        onClose();
      }, 900);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => {
          playClickSound('tick');
          onClose();
        }}
      />

      <div className="min-h-screen px-4 text-center flex items-center justify-center p-4 sm:p-6">
        <div className="relative inline-block w-full max-w-5xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all my-8 font-sans">
          {/* Top Bar with System Badges */}
          <div className="px-6 py-4 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/60">
            <div className="flex items-center space-x-3 text-xs text-zinc-600 dark:text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-signal-orange" />
              <span className="text-zinc-900 dark:text-white font-semibold">
                {isCustom ? 'Custom On-Demand Studio Piece' : 'In-Stock Studio Hardware'}
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <span className="text-zinc-500">
                {isCustom ? 'Dispatches in 48h' : 'Dispatches in 24h'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                playClickSound('tick');
                onClose();
              }}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left 7 Cols: 5-Image Gallery */}
            <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between bg-[#fbfbfd] dark:bg-black/30 space-y-4">
              {/* Primary High-Res Viewport */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group shadow-xs">
                <img
                  src={images[activeImageIdx]}
                  alt={`${product.title} - View ${activeImageIdx + 1}`}
                  className="w-full h-full object-contain p-4 select-none"
                />

                {/* Perspective Label Watermark */}
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-zinc-200/90 dark:border-zinc-800 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 shadow-xs">
                  {imageLabels[activeImageIdx] || `View 0${activeImageIdx + 1}`}
                </div>

                {/* Arrow Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound('tick');
                        setActiveImageIdx((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1
                        );
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-black/80 hover:bg-white text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 shadow-sm transition cursor-pointer"
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-black/80 hover:bg-white text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 shadow-sm transition cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* 5-Image Thumbnail Strip */}
              <div className="grid grid-cols-5 gap-2">
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
                      className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-white dark:bg-zinc-800 ${
                        isSelected
                          ? 'border-signal-orange ring-2 ring-signal-orange/20 shadow-sm'
                          : 'border-zinc-200 dark:border-zinc-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumb ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>

              {/* Quality Guarantee Callout */}
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200/90 dark:border-zinc-700/80 text-xs text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
                <span className="flex items-center gap-2 text-emerald-600 font-medium">
                  <ShieldCheck className="w-4 h-4" /> 100% Fit Guarantee • ISO 2768-m Calibrated
                </span>
                <span className="text-zinc-500 font-medium">Free US Returns</span>
              </div>
            </div>

            {/* Right 5 Cols: Product Specs, Dispatch Calculator & CTAs */}
            <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-6">
              {/* Product Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {isCustom ? (
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/50 text-xs text-orange-800 dark:text-orange-300 font-medium">
                      <Box className="w-3.5 h-3.5" />
                      <span>Custom Sized to Fit</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/50 text-xs text-sky-800 dark:text-sky-300 font-medium">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Domestic Dispatch</span>
                    </span>
                  )}

                  <div className="flex items-center space-x-1 text-amber-500 text-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">4.9</span>
                    <span className="text-zinc-500">(24 reviews)</span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  {product.title}
                </h2>
                {product.subtitle && (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {product.subtitle}
                  </p>
                )}

                <div className="pt-2 text-3xl font-bold text-zinc-950 dark:text-white">
                  ${product.basePrice.toFixed(2)}{' '}
                  <span className="text-xs text-zinc-500 font-normal">USD</span>
                </div>
              </div>

              {/* Description & Features */}
              <div className="space-y-3 text-xs">
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
                  {product.description}
                </p>

                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">
                    Key Features
                  </div>
                  {product.features.slice(0, 4).map((f, i) => (
                    <div key={i} className="flex items-start space-x-2 text-zinc-600 dark:text-zinc-400 text-xs">
                      <span className="text-orange-600 font-bold">•</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Specs Card */}
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 text-xs space-y-1.5">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold pb-1 border-b border-zinc-200 dark:border-zinc-700">
                  Product Details
                </div>
                {Object.entries(product.technicalSpecs).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-zinc-700 dark:text-zinc-300">
                    <span className="text-zinc-500">{key}:</span>
                    <span className="font-medium">{val}</span>
                  </div>
                ))}
              </div>

              {/* Delivery Destination Estimator */}
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-sky-600" /> Deliver to ZIP:
                  </span>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-16 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-lg border border-zinc-300 dark:border-zinc-600 text-center text-zinc-900 dark:text-white font-medium text-xs"
                    placeholder="ZIP"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500 pt-1 border-t border-zinc-200 dark:border-zinc-700">
                  <span>Estimated Delivery:</span>
                  <span className="text-zinc-900 dark:text-white font-medium">
                    {isCustom ? 'Oct 26 – Oct 29 (Crafted in 48h)' : 'Oct 25 – Oct 27 (Ships in 24h)'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {isCustom ? (
                  <button
                    type="button"
                    onClick={handleAction}
                    className="w-full py-4 px-5 rounded-xl bg-signal-orange hover:bg-orange-600 text-white font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition cursor-pointer text-sm"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Customize Your Dimensions</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAction}
                    className={`w-full py-4 px-5 rounded-xl font-semibold flex items-center justify-center space-x-2 transition cursor-pointer text-sm ${
                      isAdded
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-md'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Shopping Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
