/**
 * WAVEZLY AMAZON PRODUCT CATALOG & SEARCH RESULTS
 * Faithful Amazon-style search results grid with authentic #1 Best Seller ribbons,
 * Overall Pick tags, star rating breakdowns, Prime badges, coupon checkboxes,
 * deal pricing, and Amazon yellow/orange action buttons.
 */

import React, { useMemo, useState, useEffect } from 'react';
import {
  Check,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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

const PAGE_SIZE = 16;

/**
 * Filter products across all required departments:
 * - all: All Departments (150+ products)
 * - deals: Today's Deals (discounted items)
 * - trending_3d: Trending 3D Prints & Toys
 * - kitchen: Kitchen & Dining
 * - electronics: Electronics & Gaming
 * - vanity: Beauty & Personal Care
 * - home_decor: Home Décor & Planters
 * - car_auto: Car & Automotive
 * - tools_workshop: Tools & Workshop
 * - bedside: Bedroom & Entryway
 * - custom: Custom 3D Fit
 */
function matchesDepartment(p: Product, dept: RoomId): boolean {
  if (dept === 'all') return true;
  if (dept === 'deals') return Boolean(amazonMetaFor(p).hasDeal);
  if (dept === 'custom') return p.type === 'custom_3d';
  if (p.category === dept) return true;

  const text = `${friendlyName(p)} ${p.title} ${p.subtitle || ''} ${p.description || ''} ${p.category || ''}`.toLowerCase();

  switch (dept) {
    case 'trending_3d':
      return (
        p.type === 'custom_3d' ||
        /3d|toy|puzzle|fidget|skull|ornament|kids|display rack|bookshelf|gadget|dragon|articulated/i.test(text)
      );
    case 'kitchen':
      return (
        p.category === 'kitchen' ||
        /kitchen|cutlery|pantry|coffee|espresso|spice|dining|utensil|snack|cooking|seasoning|plate|bowl|cup|tableware/i.test(text)
      );
    case 'electronics':
      return (
        p.category === 'electronics' ||
        p.category === 'workspace' ||
        /electronics|cable|charger|headphone|dac|screenbar|led|monitor|usb|controller|gaming|wireless|charging|keyboard|keeb|switch|digital|mouse/i.test(text)
      );
    case 'vanity':
      return (
        p.category === 'vanity' ||
        /vanity|bathroom|makeup|cosmetic|skincare|beauty|toilet|jewelry|grooming|toothbrush|perfume|bath|personal care/i.test(text)
      );
    case 'home_decor':
      return (
        p.category === 'home_decor' ||
        p.category === 'living' ||
        /decor|planter|vase|coaster|ornament|scary|aesthetic|cabinet|shelf|display|plant|flower|interior/i.test(text)
      );
    case 'car_auto':
      return (
        p.category === 'car_auto' ||
        /car|automotive|seat back|vehicle|auto|trunk|visor|cup holder/i.test(text)
      );
    case 'tools_workshop':
      return (
        p.category === 'tools_workshop' ||
        /tool|pegboard|chest|hardware|hex|drill|workshop|metal tool|wrench|socket|plier|screws|workbench/i.test(text)
      );
    case 'bedside':
      return (
        p.category === 'bedside' ||
        /bedside|bedroom|entryway|nightstand|dresser|shoe|hall tree|coat rack|valet|catchall|caddy|key/i.test(text)
      );
    case 'living':
      return p.category === 'living' || /living|couch|sofa|coffee table|coaster/i.test(text);
    case 'workspace':
      return p.category === 'workspace' || /desk|office|workspace|screenbar|mousepad|mat|riser/i.test(text);
    default:
      return false;
  }
}

// Canonical department display names for summary banner
const DEPARTMENT_NAMES: Record<string, string> = {
  all: 'All Departments',
  deals: "Today's Deals",
  trending_3d: 'Trending 3D Prints & Toys',
  kitchen: 'Kitchen & Dining',
  electronics: 'Electronics & Gaming',
  vanity: 'Beauty & Personal Care',
  home_decor: 'Home Décor & Planters',
  car_auto: 'Car & Automotive',
  tools_workshop: 'Tools & Workshop',
  bedside: 'Bedroom & Entryway',
  custom: 'Custom 3D Fit',
  living: 'Living Room Furniture',
  workspace: 'Office Products',
};

// Department chip filters
const DEPARTMENT_CHIPS: { id: RoomId; label: string }[] = [
  { id: 'all', label: 'All Departments' },
  { id: 'deals', label: "Today's Deals" },
  { id: 'trending_3d', label: 'Trending 3D Prints' },
  { id: 'kitchen', label: 'Kitchen & Dining' },
  { id: 'electronics', label: 'Electronics & Gaming' },
  { id: 'vanity', label: 'Beauty & Personal Care' },
  { id: 'home_decor', label: 'Home Décor & Planters' },
  { id: 'car_auto', label: 'Car & Automotive' },
  { id: 'tools_workshop', label: 'Tools & Workshop' },
  { id: 'bedside', label: 'Bedroom & Entryway' },
  { id: 'custom', label: 'Custom 3D Fit' },
];

export const ProductGrid: React.FC<ProductGridProps> = ({
  onCustomizeProduct,
  searchQuery,
  activeRoom,
  onSelectRoom,
}) => {
  const [sort, setSort] = useState<SortKey>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [clippedCoupons, setClippedCoupons] = useState<Record<string, boolean>>({});

  const { addStandardItem } = useCartStore();
  const { setProduct } = useCustomizerStore();

  // Reset to page 1 whenever search query, department, or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeRoom, sort]);

  const toggleCoupon = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setClippedCoupons((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = SEED_PRODUCTS.filter((p) => p.active !== false && hasPhoto(p));

    // Department filtering
    list = list.filter((p) => matchesDepartment(p, activeRoom));

    // Text search query
    if (q) {
      list = list.filter((p) =>
        `${friendlyName(p)} ${p.description} ${p.category ?? ''} ${p.subtitle ?? ''}`
          .toLowerCase()
          .includes(q)
      );
    }

    // Sorting
    const sorted = [...list];
    if (sort === 'price-asc') sorted.sort((a, b) => a.basePrice - b.basePrice);
    if (sort === 'price-desc') sorted.sort((a, b) => b.basePrice - a.basePrice);
    if (sort === 'rating') sorted.sort((a, b) => amazonMetaFor(b).rating - amazonMetaFor(a).rating);
    return sorted;
  }, [searchQuery, activeRoom, sort]);

  // Pagination calculation
  const totalCount = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const displayedProducts = useMemo(() => {
    if (showAll) return filteredProducts;
    const startIndex = (validPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredProducts, showAll, validPage]);

  // Display range for Amazon summary banner
  const startItem = totalCount === 0 ? 0 : showAll ? 1 : (validPage - 1) * PAGE_SIZE + 1;
  const endItem = showAll
    ? totalCount
    : Math.min(validPage * PAGE_SIZE, totalCount);

  // Department / search label for authentic Amazon search summary
  const currentDeptName =
    DEPARTMENT_NAMES[activeRoom] ||
    ROOMS.find((r) => r.id === activeRoom)?.label ||
    'All Departments';

  const summaryQueryText = searchQuery.trim() ? searchQuery.trim() : currentDeptName;

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setShowAll(false);
    const shopElem = document.getElementById('shop');
    if (shopElem) {
      shopElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="shop" className="max-w-[1520px] mx-auto px-3 sm:px-6 py-6 scroll-mt-24 font-sans">
      {/* Department Quick Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 scrollbar-none text-xs">
        {DEPARTMENT_CHIPS.map((chip) => {
          const isActive = activeRoom === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => {
                onSelectRoom(chip.id);
                setShowAll(false);
              }}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition cursor-pointer border ${
                isActive
                  ? 'bg-[#0f1111] text-white border-[#0f1111] font-bold shadow-xs'
                  : 'bg-white hover:bg-zinc-100 text-[#0f1111] border-[#d5d9d9] font-medium'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Amazon Search Results Banner & Sort Bar */}
      <div className="bg-white border border-[#d5d9d9] rounded-sm p-3 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#0f1111]">
          {totalCount === 0 ? (
            <span className="font-bold">0 results</span>
          ) : (
            <span className="font-bold">
              {startItem}-{endItem} of {totalCount} results
            </span>
          )}
          <span className="text-[#565959]">for</span>
          <span className="text-[#c45500] font-bold">"{summaryQueryText}"</span>
          {activeRoom !== 'all' && (
            <button
              type="button"
              onClick={() => {
                onSelectRoom('all');
                setShowAll(false);
              }}
              className="ml-2 text-xs text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {totalCount > PAGE_SIZE && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer font-medium"
            >
              {showAll ? 'Show 16 per page' : `View all ${totalCount}`}
            </button>
          )}

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
      {displayedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-md border border-[#d5d9d9] shadow-xs">
          <p className="text-lg font-bold text-[#0f1111]">No results found</p>
          <p className="text-sm text-[#565959] mt-1">
            Check your spelling or try searching for another department.
          </p>
          <button
            type="button"
            onClick={() => {
              onSelectRoom('all');
              setShowAll(false);
            }}
            className="mt-4 px-5 py-2 rounded-md bg-[#ffd814] hover:bg-[#f7ca00] text-zinc-950 text-xs font-bold shadow-xs cursor-pointer"
          >
            Show all items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedProducts.map((p) => {
            const meta = amazonMetaFor(p);
            const isCustom = p.type === 'custom_3d';
            const isAdded = addedId === p.id;
            const img = getProductDisplayImage(p.id, p.images[0]);
            const isCouponClipped = Boolean(clippedCoupons[p.id]);

            // Price calculation with coupon
            const basePrice = p.basePrice;
            const effectivePrice =
              isCouponClipped && meta.couponAmount
                ? Math.max(1, basePrice - meta.couponAmount)
                : basePrice;
            const priceWhole = Math.floor(effectivePrice);
            const priceFraction = Math.round((effectivePrice - priceWhole) * 100)
              .toString()
              .padStart(2, '0');

            const displayName = friendlyName(p).replace(/\bSnugFit\b/g, 'Wavezly');

            return (
              <article
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className="group bg-white rounded-sm border border-[#e7e7e7] hover:border-[#d5d9d9] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden relative"
              >
                {/* 1. AMAZON BADGE (Best Seller / Overall Pick / Deal / Wavezly Direct) */}
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
                      Wavezly Direct
                    </span>
                  )}
                </div>

                {/* 2. PRODUCT IMAGE */}
                <div className="relative aspect-square w-full p-4 flex items-center justify-center bg-white overflow-hidden">
                  <img
                    src={img}
                    alt={displayName}
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
                    {displayName}
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
                      <div className="text-xs text-[#565959]">
                        Typical: <span className="line-through">${meta.listPrice.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {/* Coupon Checkbox Tag */}
                  {meta.couponAmount && (
                    <div
                      onClick={(e) => toggleCoupon(e, p.id)}
                      className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-[#0f1111] hover:text-[#c7511f] cursor-pointer w-fit select-none"
                      title={isCouponClipped ? 'Coupon applied' : 'Click to clip coupon'}
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
                    FREE delivery on orders shipped by Wavezly over $35
                  </div>

                  {/* Stock Left Urgency */}
                  {meta.stockLeft && (
                    <div className="text-[11px] text-[#b12704] font-medium mt-1">
                      Only {meta.stockLeft} left in stock - order soon.
                    </div>
                  )}

                  {/* Action Buttons: Amazon Yellow / Orange */}
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

      {/* Authentic Amazon Pagination Bar */}
      {!showAll && totalPages > 1 && (
        <div className="mt-8 pt-4 border-t border-[#e7e7e7] flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="inline-flex items-center rounded-md border border-[#d5d9d9] shadow-xs bg-white overflow-hidden text-xs font-medium">
            <button
              type="button"
              disabled={validPage <= 1}
              onClick={() => handlePageChange(validPage - 1)}
              className="px-3 py-2 border-r border-[#d5d9d9] hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-[#0f1111]"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === totalPages ||
                  (p >= validPage - 2 && p <= validPage + 2)
              )
              .map((page, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && page - prev > 1;
                const isSelected = page === validPage;
                return (
                  <React.Fragment key={page}>
                    {showEllipsis && (
                      <span className="px-2 py-2 text-[#565959] border-r border-[#d5d9d9]">
                        ...
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={`px-3.5 py-2 border-r border-[#d5d9d9] transition ${
                        isSelected
                          ? 'bg-[#f0f2f2] font-bold text-[#0f1111] border-b-2 border-b-[#e77600]'
                          : 'hover:bg-zinc-100 text-[#007185] hover:text-[#c7511f]'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              type="button"
              disabled={validPage >= totalPages}
              onClick={() => handlePageChange(validPage + 1)}
              className="px-3 py-2 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-[#0f1111]"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
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
