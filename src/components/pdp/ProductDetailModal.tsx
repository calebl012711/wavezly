/**
 * FORMGRID INTERACTIVE PRODUCT DETAIL MODAL (PDP)
 * 5-image gallery slider, technical blueprints, split-shipping ETA estimator, and verified reviews
 */

import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useCustomizerStore } from '../../store/useCustomizerStore';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Truck,
  ShieldCheck,
  Star,
  Check,
  Box,
  MapPin,
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
    '01 // HERO 3D PERSPECTIVE',
    '02 // TOP ORTHOGRAPHIC CAD',
    '03 // MACRO LAYER STRATA',
    '04 // CALIPER BLUEPRINT',
    '05 // IN-SITU WORKSPACE',
  ];

  const handleAction = () => {
    if (isCustom) {
      setProduct(product);
      onLaunchCustomizer(product);
      onClose();
    } else {
      addStandardItem(product, 1);
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
        openCart();
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-screen px-4 text-center flex items-center justify-center p-4 sm:p-6">
        <div className="relative inline-block w-full max-w-5xl bg-surface border border-surface-border rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all my-8 font-mono">
          {/* Top Bar with System Badges */}
          <div className="px-6 py-3.5 border-b border-surface-border flex items-center justify-between bg-surface-subtle">
            <div className="flex items-center space-x-3 text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-signal-orange" />
              <span className="text-precision-white font-bold tracking-wider uppercase">
                FORMGRID HARDWARE ARCHIVE // SKU-{product.id.toUpperCase()}
              </span>
              <span className="hidden sm:inline text-zinc-600">|</span>
              <span className="hidden sm:inline text-zinc-500">
                {isCustom ? 'PARAMETRIC FABRICATION' : 'DOMESTIC WAREHOUSE'}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left 7 Cols: 5-Image Interactive Gallery */}
            <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-surface-border flex flex-col justify-between bg-black/40 space-y-4">
              {/* Primary High-Res Viewport */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#0a0a0c] border border-surface-border flex items-center justify-center group shadow-tactile">
                <img
                  src={images[activeImageIdx]}
                  alt={`${product.title} - View ${activeImageIdx + 1}`}
                  className="w-full h-full object-contain p-2 select-none"
                />

                {/* Perspective Label Watermark */}
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded border border-zinc-800 text-[10px] text-zinc-300">
                  {imageLabels[activeImageIdx] || `VIEW 0${activeImageIdx + 1}`}
                </div>

                {/* Arrow Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageIdx((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black text-zinc-300 hover:text-white border border-zinc-800 transition opacity-80 group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageIdx((prev) => (prev + 1) % images.length)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black text-zinc-300 hover:text-white border border-zinc-800 transition opacity-80 group-hover:opacity-100"
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
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative aspect-[4/3] rounded-lg overflow-hidden border transition-all ${
                        isSelected
                          ? 'border-signal-orange ring-1 ring-signal-orange shadow-glow-orange scale-[1.02]'
                          : 'border-zinc-800 bg-surface/50 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumb ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[8px] text-zinc-400">
                        0{idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Technical Tolerances Callout */}
              <div className="p-3 rounded-lg bg-surface border border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-signal-lime">
                  <ShieldCheck className="w-3.5 h-3.5" /> ISO 2768-m Precision Dimensional Guarantee
                </span>
                <span className="text-zinc-500">Watertight STL Sliced</span>
              </div>
            </div>

            {/* Right 5 Cols: Product Specs, Dispatch Calculator & CTAs */}
            <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-5">
              {/* Product Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {isCustom ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-signal-orange/10 border border-signal-orange/30 text-[10px] text-signal-orange font-semibold">
                      <Cpu className="w-3 h-3" />
                      <span>ON-DEMAND 3D PRINT FARM</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-signal-cyan/10 border border-signal-cyan/30 text-[10px] text-signal-cyan font-semibold">
                      <Truck className="w-3 h-3" />
                      <span>US WAREHOUSE (2-4 DAY)</span>
                    </span>
                  )}

                  <div className="flex items-center space-x-1 text-signal-amber text-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold">4.95</span>
                    <span className="text-zinc-500">(18 reviews)</span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-precision-white font-sans">
                  {product.title}
                </h2>
                {product.subtitle && (
                  <p className="text-xs text-zinc-400 leading-snug">
                    {product.subtitle}
                  </p>
                )}

                <div className="pt-2 text-2xl font-bold text-signal-orange font-mono">
                  ${product.basePrice.toFixed(2)}{' '}
                  <span className="text-xs text-zinc-500 font-normal">USD</span>
                </div>
              </div>

              {/* Description & Features */}
              <div className="space-y-3 text-xs">
                <p className="text-zinc-300 font-sans leading-relaxed">
                  {product.description}
                </p>

                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                    Key Specifications
                  </div>
                  {product.features.slice(0, 4).map((f, i) => (
                    <div key={i} className="flex items-start space-x-2 text-zinc-400 text-[11px]">
                      <span className="text-signal-orange mt-0.5">•</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Specifications Table */}
              <div className="p-3 rounded-lg bg-black/60 border border-zinc-800 text-[11px] space-y-1.5">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold pb-1 border-b border-zinc-800">
                  Engineering Telemetry
                </div>
                {Object.entries(product.technicalSpecs).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-zinc-300">
                    <span className="text-zinc-500">{key}:</span>
                    <span className="font-semibold">{val}</span>
                  </div>
                ))}
              </div>

              {/* Split Shipping Logistics ETA Estimator */}
              <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1 text-zinc-300 font-semibold uppercase">
                    <MapPin className="w-3.5 h-3.5 text-signal-cyan" /> Delivery Destination:
                  </span>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-16 bg-black/70 px-2 py-0.5 rounded border border-zinc-700 text-center text-precision-white text-[10px]"
                    placeholder="ZIP"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-800">
                  <span>Transit Channel:</span>
                  <span className="text-zinc-200">
                    {isCustom ? 'Print Farm Priority (2–4 Days)' : 'Domestic USPS Ground (2–3 Days)'}
                  </span>
                </div>
              </div>

              {/* Action Trigger Button */}
              <div className="pt-2">
                {isCustom ? (
                  <button
                    type="button"
                    onClick={handleAction}
                    className="w-full py-3.5 px-4 rounded-xl bg-signal-orange hover:bg-orange-600 text-black font-bold tracking-wider flex items-center justify-center space-x-2 shadow-glow-orange transition text-xs"
                  >
                    <Box className="w-4 h-4" />
                    <span>LAUNCH PARAMETRIC 3D STUDIO</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAction}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold tracking-wider flex items-center justify-center space-x-2 transition text-xs ${
                      isAdded
                        ? 'bg-signal-lime text-black shadow-glow-lime'
                        : 'bg-signal-cyan hover:bg-cyan-400 text-black shadow-glow-cyan'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>ADDED TO PRODUCTION DISPATCH QUEUE</span>
                      </>
                    ) : (
                      <>
                        <Truck className="w-4 h-4" />
                        <span>ADD FAST-SHIP ACCESSORY TO QUEUE</span>
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
