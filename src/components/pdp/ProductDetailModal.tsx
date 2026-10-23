/**
 * SNUGFIT AMAZON PRODUCT DETAIL MODAL (PDP)
 * 3-column Amazon detail view:
 * 1. Left image gallery with interactive thumbnail list & high-res zoom viewport
 * 2. Center product details with brand link, star rating, deal price, color swatches, and "About this item"
 * 3. Right classic Amazon Buy Box with Prime delivery ETA, In Stock indicator, Qty selector,
 *    #ffd814 Add to Cart, and #ffa41c Buy Now / Customize buttons.
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
  MapPin,
  Lock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  Sliders,
  Sparkles,
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

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onLaunchCustomizer,
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(FINISH_COLORS[0]);
  const [quantity, setQuantity] = useState(1);
  const [isCouponClipped, setIsCouponClipped] = useState(false);
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
  const isCustom = product.type === 'custom_3d';
  const { images, labels: imageLabels } = getAllProductImages(product);

  const effectivePrice = isCouponClipped && meta.couponAmount
    ? Math.max(1, product.basePrice - meta.couponAmount)
    : product.basePrice;

  const priceWhole = Math.floor(effectivePrice);
  const priceFraction = Math.round((effectivePrice - priceWhole) * 100)
    .toString()
    .padStart(2, '0');

  const handleAddToCart = () => {
    playClickSound('success');
    addStandardItem(product, quantity);
    setAddedStatus('added');
    setTimeout(() => {
      setAddedStatus('idle');
      openCart();
      onClose();
    }, 800);
  };

  const handleBuyNow = () => {
    playClickSound('snap');
    addStandardItem(product, quantity);
    window.location.search = '?route=checkout';
  };

  const handleCustomize = () => {
    playClickSound('snap');
    setProduct(product);
    onLaunchCustomizer(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      {/* Dark Dim Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => {
          playClickSound('tick');
          onClose();
        }}
      />

      <div className="min-h-screen px-2 sm:px-4 py-6 flex items-center justify-center">
        <div className="relative w-full max-w-6xl bg-white rounded-md border border-[#d5d9d9] shadow-2xl text-left overflow-hidden z-10">
          {/* Top Breadcrumb & Close Bar */}
          <div className="px-4 py-2.5 bg-[#f0f2f2] border-b border-[#d5d9d9] flex items-center justify-between text-xs text-[#565959]">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">
                Home & Kitchen
              </span>
              <span>›</span>
              <span className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">
                Storage & Organization
              </span>
              <span>›</span>
              <span className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">
                Drawer Organizers
              </span>
              <span>›</span>
              <span className="text-[#0f1111] font-semibold truncate max-w-[200px]">
                {friendlyName(product)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                playClickSound('tick');
                onClose();
              }}
              className="p-1 rounded text-[#565959] hover:text-[#0f1111] hover:bg-black/5 transition cursor-pointer"
              aria-label="Close product detail"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 3-Column Amazon Layout */}
          <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white max-h-[85vh] overflow-y-auto">
            {/* ============================================================ */}
            {/* COLUMN 1: LEFT GALLERY (Cols 1-5)                             */}
            {/* ============================================================ */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="flex gap-3">
                {/* Vertical Thumbnails */}
                <div className="flex flex-col gap-2 w-14 shrink-0">
                  {images.slice(0, 5).map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onMouseEnter={() => setActiveImageIdx(idx)}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-14 h-14 rounded-sm border p-1 bg-white cursor-pointer transition ${
                        activeImageIdx === idx
                          ? 'border-[#e77600] ring-1 ring-[#e77600]'
                          : 'border-[#d5d9d9] hover:border-[#a6a6a6]'
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>

                {/* Big Main Image Viewport */}
                <div className="relative flex-1 aspect-square rounded-sm border border-[#e7e7e7] p-4 flex items-center justify-center bg-white group overflow-hidden">
                  <img
                    src={images[activeImageIdx]}
                    alt={friendlyName(product)}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Perspective badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium">
                    {imageLabels[activeImageIdx] || `Photo ${activeImageIdx + 1}`}
                  </div>

                  {/* Previous / Next Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveImageIdx((prev) =>
                            prev === 0 ? images.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-[#d5d9d9] flex items-center justify-center text-[#565959] hover:text-[#0f1111] shadow-xs cursor-pointer"
                        aria-label="Previous"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveImageIdx((prev) => (prev + 1) % images.length)
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-[#d5d9d9] flex items-center justify-center text-[#565959] hover:text-[#0f1111] shadow-xs cursor-pointer"
                        aria-label="Next"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <p className="text-center text-[11px] text-[#565959]">
                Roll over image to zoom in
              </p>
            </div>

            {/* ============================================================ */}
            {/* COLUMN 2: CENTER PRODUCT DETAILS (Cols 6-8)                  */}
            {/* ============================================================ */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {/* Brand link */}
              <div className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer font-medium">
                Visit the SnugFit Direct Store
              </div>

              {/* Title */}
              <h1 className="text-lg sm:text-xl font-bold text-[#0f1111] leading-snug">
                {friendlyName(product)}
              </h1>

              {/* Badges / Rating */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="flex items-center text-[#de7921]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i <= Math.floor(meta.rating)
                          ? 'fill-[#de7921] text-[#de7921]'
                          : 'text-zinc-300'
                      }`}
                    />
                  ))}
                  <ChevronDown className="w-3 h-3 text-[#565959] ml-0.5" />
                </div>
                <span className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">
                  {meta.count.toLocaleString()} ratings
                </span>
                <span className="text-[#565959] text-xs">|</span>
                <span className="text-xs text-[#565959]">
                  {meta.boughtPastMonth.toLocaleString()}+ bought in past month
                </span>
              </div>

              {meta.badge === 'best_seller' && (
                <div className="inline-flex items-center text-xs font-bold w-fit">
                  <span className="bg-[#e67a00] text-white px-2 py-0.5 rounded-l-xs uppercase">
                    #1 Best Seller
                  </span>
                  <span className="bg-[#fef8f2] text-[#c45500] px-2 py-0.5 border border-l-0 border-[#fbd8b5] rounded-r-xs">
                    in {meta.badgeCategory}
                  </span>
                </div>
              )}

              <hr className="border-[#e7e7e7] my-1" />

              {/* Pricing section */}
              <div className="space-y-1">
                {meta.hasDeal && meta.discountPercent && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase bg-[#cc0c39] text-white px-2 py-0.5 rounded-xs">
                      Limited time deal
                    </span>
                    <span className="text-[#cc0c39] text-sm font-semibold">
                      -{meta.discountPercent}% off
                    </span>
                  </div>
                )}

                <div className="flex items-start text-[#0f1111]">
                  <span className="text-sm font-semibold pt-0.5">$</span>
                  <span className="text-3xl font-bold leading-none">{priceWhole}</span>
                  <span className="text-sm font-semibold pt-0.5">{priceFraction}</span>
                </div>

                {meta.listPrice && (
                  <div className="text-xs text-[#565959]">
                    Typical price:{' '}
                    <span className="line-through">${meta.listPrice.toFixed(2)}</span>
                  </div>
                )}

                {/* Coupon Box */}
                {meta.couponAmount && (
                  <div
                    onClick={() => setIsCouponClipped(!isCouponClipped)}
                    className="flex items-center gap-2 pt-1 text-xs cursor-pointer select-none"
                  >
                    {isCouponClipped ? (
                      <CheckSquare className="w-4 h-4 text-[#007600] fill-[#007600]/10" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-400" />
                    )}
                    <span>
                      Apply{' '}
                      <span className="bg-[#71b300] text-white font-bold px-1 py-0.5 rounded-xs text-[11px]">
                        ${meta.couponAmount.toFixed(2)}
                      </span>{' '}
                      coupon
                    </span>
                  </div>
                )}
              </div>

              <hr className="border-[#e7e7e7] my-1" />

              {/* Color Finish Swatches */}
              <div>
                <div className="text-xs text-[#0f1111]">
                  <span className="text-[#565959]">Color: </span>
                  <span className="font-bold">{selectedColor.name}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {FINISH_COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition ${c.bg} ${
                        selectedColor.name === c.name
                          ? 'border-[#e77600] ring-2 ring-[#e77600]/30 scale-110'
                          : 'border-white ring-1 ring-zinc-300 hover:scale-105'
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* About this item (Amazon Bullets) */}
              <div className="pt-2">
                <h3 className="text-sm font-bold text-[#0f1111] mb-2">About this item</h3>
                <ul className="space-y-1.5 text-xs text-[#0f1111] list-disc list-inside leading-relaxed">
                  <li>
                    <strong className="text-zinc-900">Custom Snug Fit:</strong> Precision tailored to eliminate drawer rattle and empty gaps.
                  </li>
                  <li>
                    <strong className="text-zinc-900">Premium Organic Biopolymer:</strong> Velvety matte finish with zero glare, washable with mild soap and water.
                  </li>
                  <li>
                    <strong className="text-zinc-900">100% Guaranteed Fit:</strong> If your custom piece doesn’t slide in perfectly, we remake it free of charge.
                  </li>
                  <li>
                    <strong className="text-zinc-900">Crafted in Boise, Idaho:</strong> Made to order in our domestic solar-powered studio.
                  </li>
                </ul>
              </div>
            </div>

            {/* ============================================================ */}
            {/* COLUMN 3: THE CLASSIC AMAZON BUY BOX (Cols 9-12)             */}
            {/* ============================================================ */}
            <div className="lg:col-span-3">
              <div className="p-4 rounded-md border border-[#d5d9d9] bg-white flex flex-col gap-3 shadow-xs">
                {/* Buy Box Price */}
                <div className="flex items-start text-[#0f1111]">
                  <span className="text-xs font-semibold pt-0.5">$</span>
                  <span className="text-2xl font-bold leading-none">{priceWhole}</span>
                  <span className="text-xs font-semibold pt-0.5">{priceFraction}</span>
                </div>

                {/* Prime delivery line */}
                <div className="text-xs">
                  <div className="flex items-center gap-1 font-bold text-[#0f1111]">
                    <span className="inline-flex items-center text-[#00a8e1] font-black italic tracking-tighter">
                      ✓<span className="text-[#146eb4] not-italic ml-0.5 font-bold">prime</span>
                    </span>
                    <span>Tomorrow, Oct 24</span>
                  </div>
                  <div className="text-[11px] text-[#565959] mt-0.5">
                    Or fastest delivery <strong className="text-[#0f1111]">Today by 10 PM</strong>.
                    Order within <span className="text-[#007600]">2 hrs 45 mins</span>.
                  </div>
                </div>

                {/* Deliver to address */}
                <div className="flex items-center gap-1.5 text-xs text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">
                  <MapPin className="w-3.5 h-3.5 text-[#0f1111]" />
                  <span>Deliver to Seattle 98101</span>
                </div>

                {/* In Stock status */}
                <div className="text-base font-bold text-[#007600]">
                  In Stock
                </div>

                {/* Quantity selector */}
                {!isCustom && (
                  <div className="flex items-center gap-2">
                    <label htmlFor="pdp-qty" className="text-xs text-[#565959] font-medium">
                      Qty:
                    </label>
                    <select
                      id="pdp-qty"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="bg-[#f0f2f2] border border-[#d5d9d9] rounded-md text-xs py-1 px-2.5 text-[#0f1111] focus:ring-1 focus:ring-[#007185] cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 10].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Action Buttons: Add to Cart (Yellow) and Buy Now (Orange) */}
                <div className="space-y-2 pt-1">
                  {isCustom ? (
                    <button
                      type="button"
                      onClick={handleCustomize}
                      className="w-full h-10 rounded-full bg-[#ffa41c] hover:bg-[#fa8900] active:bg-[#e07e00] text-zinc-950 font-bold text-xs shadow-xs border border-[#ff8f00] flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Sliders className="w-4 h-4" />
                      <span>Customize Now</span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className={`w-full h-10 rounded-full text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          addedStatus === 'added'
                            ? 'bg-[#007600] text-white border border-[#006000]'
                            : 'bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-zinc-950 border border-[#fcd200]'
                        }`}
                      >
                        {addedStatus === 'added' ? 'Added to Cart' : 'Add to Cart'}
                      </button>

                      <button
                        type="button"
                        onClick={handleBuyNow}
                        className="w-full h-10 rounded-full bg-[#ffa41c] hover:bg-[#fa8900] active:bg-[#e07e00] text-zinc-950 font-bold text-xs shadow-xs border border-[#ff8f00] transition cursor-pointer"
                      >
                        Buy Now
                      </button>
                    </>
                  )}
                </div>

                {/* Fulfilled by Amazon / SnugFit Table */}
                <div className="pt-2 text-[11px] text-[#565959] space-y-1 border-t border-[#e7e7e7]">
                  <div className="flex justify-between">
                    <span>Ships from</span>
                    <span className="text-[#0f1111] font-medium">SnugFit.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sold by</span>
                    <span className="text-[#007185] font-medium hover:underline cursor-pointer">
                      SnugFit Direct
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Returns</span>
                    <span className="text-[#007185] font-medium hover:underline cursor-pointer">
                      30-day refund/replacement
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment</span>
                    <span className="text-[#007185] font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#565959]" /> Secure transaction
                    </span>
                  </div>
                </div>

                {/* Fit Guarantee Callout */}
                <div className="mt-1 p-2 rounded bg-[#f7fafa] border border-[#d5d9d9] text-[11px] text-[#0f1111] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#e67a00] shrink-0" />
                  <span>
                    <strong>100% Fit Guarantee:</strong> Fits your drawer or we remake it free.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
