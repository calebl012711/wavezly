/**
 * SNUGFIT AMAZON PRODUCT CATALOG & SEARCH RESULTS
 * Faithful Amazon-style search results grid with authentic #1 Best Seller ribbons,
 * Overall Pick tags, star rating breakdowns, Prime badges, coupon checkboxes,
 * deal pricing, and Amazon yellow/orange action buttons.
 */

import React, { useMemo, useState } from 'react';
import {
  Check,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  ChevronDown,
  Sliders,
  CheckSquare,
  Square,
} from 'lucide-react';
import { Product } from '../../types';
import { SEED_PRODUCTS } from '../../db/seed';
import { useCartStore } from '../../store/useCartStore';
import { useCustomizerStore } from '../../store/useCustomizerStore';
import { ProductDetailModal } from '../pdp/ProductDetailModal';
import { getProductDisplayImage } from '../../lib/productImages';
import {
  ROOMS,
  RoomId,
  friendlyName,
  hasPhoto,
  amazonMetaFor,
} from '../../lib/storefront';

interface ProductGridProps {
  onCustomizeProduct: (product: Product) => void;
  searchQuery: string;
  activeRoom: RoomId;
  onSelectRoom: (room: RoomId) => void;
}

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

export const ProductGrid: React.FC<ProductGridProps> = ({
  onCustomizeProduct,
  searchQuery,
  activeRoom,
  onSelectRoom,
}) => {
  const [sort, setSort] = useState<SortKey>('featured');
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [clippedCoupons, setClippedCoupons] = useState<Record<string, boolean>>({});

  const { addStandardItem } = useCartStore();
  const { setProduct } = useCustomizerStore();

  const toggleCoupon = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setClippedCoupons((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const products = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = SEED_PRODUCTS.filter((p) => p.active !== false && hasPhoto(p));

    if (activeRoom === 'deals') {
      list = list.filter((p) => amazonMetaFor(p).hasDeal);
    } else if (activeRoom === 'custom') {
      list = list.filter((p) => p.type === 'custom_3d');
    } else if (activeRoom !== 'all') {
      list = list.filter((p) => p.category === activeRoom);
    }

    if (q) {
      list = list.filter((p) =>
        `${friendlyName(p)} ${p.description} ${p.category ?? ''}`.toLowerCase().includes(q)
      );
    }

    const sorted = [...list];
    if (sort === 'price-asc') sorted.sort((a, b) => a.basePrice - b.basePrice);
    if (sort === 'price-desc') sorted.sort((a, b) => b.basePrice - a.basePrice);
    if (sort === 'rating') sorted.sort((a, b) => amazonMetaFor(b).rating - amazonMetaFor(a).rating);
    return sorted;
  }, [searchQuery, activeRoom, sort]);

  const currentRoomObj = ROOMS.find((r) => r.id === activeRoom);
  const amazonDept = currentRoomObj?.amazonDept ?? 'Home & Kitchen';

  const handleCustomize = (p: Product) => {
    setProduct(p);
    onCustomizeProduct(p);
  };

  const handleQuickAdd = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    addStandardItem(p, 1);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <section id="shop" className="max-w-[1520px] mx-auto px-3 sm:px-6 py-6 scroll-mt-24 font-sans">
      {/* Amazon Search Results Banner & Sort Bar */}
      <div className="bg-white border border-[#d5d9d9] rounded-sm p-3 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-sm text-[#0f1111]">
          <span className="font-bold">
            1-{products.length} of {products.length} results
          </span>
          <span className="text-[#565959]">for</span>
          <span className="text-[#c45500] font-bold">
            "{searchQuery.trim() ? searchQuery.trim() : amazonDept}"
          </span>
          {activeRoom !== 'all' && (
            <button
              type="button"
              onClick={() => onSelectRoom('all')}
              className="ml-2 text-xs text-[#007185] hover:text-[#c7511f] hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label className="text-xs text-[#565959] font-medium flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Sort by:</span>
          </label>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort products by"
              className="appearance-none bg-[#f0f2f2] hover:bg-[#e3e6e6] border border-[#d5d9d9] text-[#0f1111] text-xs font-medium rounded-md py-1.5 pl-2.5 pr-7 focus:outline-none focus:ring-1 focus:ring-[#007185] cursor-pointer shadow-xs"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Avg. Customer Review</option>
              <option value="newest">Newest Arrivals</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#565959] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Product Results Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-md border border-[#d5d9d9] shadow-xs">
          <p className="text-lg font-bold text-[#0f1111]">No results found</p>
          <p className="text-sm text-[#565959] mt-1">
            Check your spelling or try searching for another room or department.
          </p>
          <button
            type="button"
            onClick={() => onSelectRoom('all')}
            className="mt-4 px-5 py-2 rounded-md bg-[#ffd814] hover:bg-[#f7ca00] text-zinc-950 text-xs font-bold shadow-xs cursor-pointer"
          >
            Show all items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => {
            const meta = amazonMetaFor(p);
            const isCustom = p.type === 'custom_3d';
            const isAdded = addedId === p.id;
            const img = getProductDisplayImage(p.id, p.images[0]);
            const isCouponClipped = Boolean(clippedCoupons[p.id]);

            // Price calculation with coupon
            const basePrice = p.basePrice;
            const effectivePrice = isCouponClipped && meta.couponAmount
              ? Math.max(1, basePrice - meta.couponAmount)
              : basePrice;
            const priceWhole = Math.floor(effectivePrice);
            const priceFraction = Math.round((effectivePrice - priceWhole) * 100)
              .toString()
              .padStart(2, '0');

            return (
              <article
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className="group bg-white rounded-sm border border-[#e7e7e7] hover:border-[#d5d9d9] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden relative"
              >
                {/* 1. AMAZON BADGE (Best Seller / Overall Pick / Deal) */}
                <div className="min-h-[28px] px-3 pt-2.5">
                  {meta.badge === 'best_seller' ? (
                    <div className="inline-flex items-center text-[11px] font-bold tracking-tight">
                      <span className="bg-[#e67a00] text-white px-2 py-0.5 rounded-l-xs uppercase">
                        #1 Best Seller
                      </span>
                      <span className="bg-[#fef8f2] text-[#c45500] px-2 py-0.5 border border-l-0 border-[#fbd8b5] rounded-r-xs truncate max-w-[150px]">
                        in {meta.badgeCategory}
                      </span>
                    </div>
                  ) : meta.badge === 'overall_pick' ? (
                    <div className="inline-flex items-center text-[11px] font-medium">
                      <span className="bg-[#002f36] text-white font-bold px-2 py-0.5 rounded-l-xs">
                        Overall Pick
                      </span>
                      <span className="bg-[#e7f4f5] text-[#002f36] px-2 py-0.5 border border-l-0 border-[#002f36]/20 rounded-r-xs">
                        Highly rated, well-priced
                      </span>
                    </div>
                  ) : meta.hasDeal ? (
                    <span className="inline-block bg-[#cc0c39] text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-xs tracking-wider">
                      Limited time deal
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#565959] font-medium">
                      SnugFit Direct
                    </span>
                  )}
                </div>

                {/* 2. PRODUCT IMAGE */}
                <div className="relative aspect-square w-full p-4 flex items-center justify-center bg-white overflow-hidden">
                  <img
                    src={img}
                    alt={friendlyName(p)}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  {isCustom && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-zinc-900/80 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-amber-400" />
                      <span>Custom Sizing</span>
                    </div>
                  )}
                </div>

                {/* 3. PRODUCT INFO & DETAILS */}
                <div className="px-3.5 pb-4 flex flex-col flex-1">
                  {/* Product Title */}
                  <h3 className="text-sm font-medium text-[#0f1111] group-hover:text-[#c7511f] line-clamp-2 leading-snug transition-colors">
                    {friendlyName(p)}
                  </h3>

                  {/* Star Rating & Reviews */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex items-center text-[#de7921]">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i <= Math.floor(meta.rating)
                              ? 'fill-[#de7921] text-[#de7921]'
                              : i - 0.5 <= meta.rating
                              ? 'fill-[#de7921]/60 text-[#de7921]'
                              : 'text-zinc-300'
                          }`}
                        />
                      ))}
                      <ChevronDown className="w-3 h-3 text-[#565959] ml-0.5" />
                    </div>
                    <span className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline">
                      {meta.count.toLocaleString()}
                    </span>
                  </div>

                  {/* "1K+ bought in past month" */}
                  <div className="text-[11px] text-[#565959] mt-0.5">
                    {meta.boughtPastMonth.toLocaleString()}+ bought in past month
                  </div>

                  {/* Pricing Block */}
                  <div className="mt-2.5 flex items-baseline gap-2">
                    {meta.hasDeal && meta.discountPercent && (
                      <span className="text-[#cc0c39] font-light text-xl">
                        -{meta.discountPercent}%
                      </span>
                    )}

                    <div className="flex items-start text-[#0f1111]">
                      <span className="text-xs font-semibold pt-0.5">$</span>
                      <span className="text-2xl font-bold leading-none">{priceWhole}</span>
                      <span className="text-xs font-semibold pt-0.5">{priceFraction}</span>
                    </div>

                    {meta.listPrice && (
                      <span className="text-xs text-[#565959] line-through">
                        ${meta.listPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Coupon Checkbox Tag */}
                  {meta.couponAmount && (
                    <div
                      onClick={(e) => toggleCoupon(e, p.id)}
                      className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-[#0f1111] hover:text-[#c7511f] cursor-pointer w-fit select-none"
                    >
                      {isCouponClipped ? (
                        <CheckSquare className="w-3.5 h-3.5 text-[#007600] fill-[#007600]/10" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-600" />
                      )}
                      <span>
                        Save{' '}
                        <span className="bg-[#71b300] text-white font-bold px-1 py-0.2 rounded-xs text-[10px]">
                          ${meta.couponAmount.toFixed(2)}
                        </span>{' '}
                        with coupon
                      </span>
                    </div>
                  )}

                  {/* Amazon Prime Delivery Line */}
                  <div className="mt-2 text-xs flex items-center gap-1">
                    <span className="inline-flex items-center text-[#00a8e1] font-black italic tracking-tighter text-xs">
                      ✓<span className="text-[#146eb4] not-italic ml-0.5 font-bold">prime</span>
                    </span>
                    <span className="text-[#565959]">•</span>
                    <span className="text-[#0f1111] font-bold">Tomorrow, Oct 24</span>
                  </div>
                  <div className="text-[11px] text-[#565959]">
                    FREE delivery on orders shipped by SnugFit over $35
                  </div>

                  {/* Stock Left Urgency */}
                  {meta.stockLeft && (
                    <div className="text-[11px] text-[#b12704] font-medium mt-1">
                      Only {meta.stockLeft} left in stock - order soon.
                    </div>
                  )}

                  {/* Action Button: Amazon Yellow / Orange */}
                  <div className="mt-auto pt-3">
                    {isCustom ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCustomize(p);
                        }}
                        className="w-full h-9 rounded-full bg-[#ffa41c] hover:bg-[#fa8900] active:bg-[#e07e00] text-zinc-950 text-xs font-bold shadow-xs border border-[#ff8f00] flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Customize Size</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, p)}
                        className={`w-full h-9 rounded-full text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          isAdded
                            ? 'bg-[#007600] text-white border border-[#006000]'
                            : 'bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-zinc-950 border border-[#fcd200]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" /> Added to Cart
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onLaunchCustomizer={(p) => {
            setSelectedProduct(null);
            handleCustomize(p);
          }}
        />
      )}
    </section>
  );
};
