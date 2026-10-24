/**
 * WAVEZLY PRODUCT CATALOG & DISCOVERY GRID
 * Warm Minimalist DTC Experience:
 * - Clean airy white canvas with soft warm shadows & sleek charcoal (#0F172A) typography
 * - High-end DTC hardware cards (Grovemade / Apple accessory aesthetic)
 * - Studio product photography with generous framing
 * - Subtle electric orange accents (#FF6B00 / #FF7A00) for tags and primary actions
 * - Sleek, minimalist refinement sidebar with modern chips, filters, and toggles
 */

import React, { useMemo, useState, useEffect } from 'react';
import {
  Check,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sliders,
  RotateCcw,
  Sparkles,
  Flame,
  Package,
  Zap,
  Tag,
  Search,
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
type PriceFilter = 'all' | 'under20' | '20to35' | 'over35';
type ProductionFilter = 'all' | 'ready' | 'custom_3d';

const PAGE_SIZE = 16;

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
        /3d|toy|puzzle|fidget|skull|ornament|kids|display rack|bookshelf|gadget|dragon|articulated|cone|axolotl|katana|minifig/i.test(text)
      );
    case 'kitchen':
      return (
        p.category === 'kitchen' ||
        /kitchen|cutlery|pantry|coffee|espresso|spice|dining|utensil|snack|cooking|seasoning|plate|bowl|cup|tableware|wine|sink/i.test(text)
      );
    case 'electronics':
      return (
        p.category === 'electronics' ||
        p.category === 'workspace' ||
        /electronics|cable|charger|headphone|dac|screenbar|led|monitor|usb|controller|gaming|wireless|charging|keyboard|keeb|switch|digital|mouse|steam|quest|laptop/i.test(text)
      );
    case 'vanity':
      return (
        p.category === 'vanity' ||
        /vanity|bathroom|makeup|cosmetic|skincare|beauty|toilet|jewelry|grooming|toothbrush|perfume|bath|personal care|lipstick|airwrap/i.test(text)
      );
    case 'home_decor':
      return (
        p.category === 'home_decor' ||
        p.category === 'living' ||
        /decor|planter|vase|coaster|ornament|scary|aesthetic|cabinet|shelf|display|plant|flower|interior|voronoi|lamp|lantern/i.test(text)
      );
    case 'car_auto':
      return (
        p.category === 'car_auto' ||
        /car|automotive|seat back|vehicle|auto|trunk|visor|cup holder|headrest/i.test(text)
      );
    case 'tools_workshop':
      return (
        p.category === 'tools_workshop' ||
        /tool|pegboard|chest|hardware|hex|drill|workshop|metal tool|wrench|socket|plier|screws|workbench|gridfinity|battery/i.test(text)
      );
    case 'bedside':
      return (
        p.category === 'bedside' ||
        /bedside|bedroom|entryway|nightstand|dresser|shoe|hall tree|coat rack|valet|catchall|caddy|key|book|pet/i.test(text)
      );
    case 'living':
      return p.category === 'living' || /living|couch|sofa|coffee table|coaster/i.test(text);
    case 'workspace':
      return p.category === 'workspace' || /desk|office|workspace|screenbar|mousepad|mat|riser/i.test(text);
    default:
      return false;
  }
}

const DEPARTMENT_NAMES: Record<string, string> = {
  all: 'All Categories',
  deals: 'Featured Offers',
  trending_3d: 'Sensory & Fidgets',
  kitchen: 'Kitchen & Coffee',
  electronics: 'Desk & Tech Mounts',
  vanity: 'Vanity & Grooming',
  home_decor: 'Planters & Decor',
  car_auto: 'Automotive Accessories',
  tools_workshop: 'Workshop & Gridfinity',
  bedside: 'Bedside & Catchalls',
  custom: 'Made-to-Measure 3D',
  living: 'Living & Organization',
  workspace: 'Studio & Workspace',
};

const DEPARTMENT_CHIPS: { id: RoomId; label: string }[] = [
  { id: 'all', label: 'All Products' },
  { id: 'deals', label: 'Offers' },
  { id: 'trending_3d', label: 'Sensory & Fidgets' },
  { id: 'kitchen', label: 'Kitchen & Barista' },
  { id: 'electronics', label: 'Desk & Tech' },
  { id: 'vanity', label: 'Vanity & Bath' },
  { id: 'home_decor', label: 'Planters & Décor' },
  { id: 'car_auto', label: 'Car Accessories' },
  { id: 'tools_workshop', label: 'Gridfinity & Tools' },
  { id: 'bedside', label: 'Bedside & Trays' },
  { id: 'custom', label: 'Custom Millimeter' },
];

export const ProductGrid: React.FC<ProductGridProps> = ({
  onCustomizeProduct,
  searchQuery,
  activeRoom,
  onSelectRoom,
}) => {
  const [sort, setSort] = useState<SortKey>('featured');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyCoupons, setOnlyCoupons] = useState<boolean>(false);
  const [onlyDeals, setOnlyDeals] = useState<boolean>(false);
  const [productionFilter, setProductionFilter] = useState<ProductionFilter>('all');
  const [readyToShipOnly, setReadyToShipOnly] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [clippedCoupons, setClippedCoupons] = useState<Record<string, boolean>>({});

  const { addStandardItem } = useCartStore();
  const { setProduct } = useCustomizerStore();

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    activeRoom,
    sort,
    priceFilter,
    minRating,
    onlyCoupons,
    onlyDeals,
    productionFilter,
    readyToShipOnly,
  ]);

  const toggleCoupon = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setClippedCoupons((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const resetAllFilters = () => {
    onSelectRoom('all');
    setPriceFilter('all');
    setMinRating(0);
    setOnlyCoupons(false);
    setOnlyDeals(false);
    setProductionFilter('all');
    setReadyToShipOnly(false);
    setShowAll(false);
  };

  const hasActiveRefinements =
    activeRoom !== 'all' ||
    priceFilter !== 'all' ||
    minRating > 0 ||
    onlyCoupons ||
    onlyDeals ||
    productionFilter !== 'all' ||
    readyToShipOnly;

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = SEED_PRODUCTS.filter((p) => p.active !== false && hasPhoto(p));

    // Department filtering
    list = list.filter((p) => matchesDepartment(p, activeRoom));

    // Price bracket refinement
    if (priceFilter === 'under20') {
      list = list.filter((p) => p.basePrice < 20);
    } else if (priceFilter === '20to35') {
      list = list.filter((p) => p.basePrice >= 20 && p.basePrice <= 35);
    } else if (priceFilter === 'over35') {
      list = list.filter((p) => p.basePrice > 35);
    }

    // Customer Rating refinement
    if (minRating > 0) {
      list = list.filter((p) => amazonMetaFor(p).rating >= minRating);
    }

    // Coupon filter
    if (onlyCoupons) {
      list = list.filter((p) => Boolean(amazonMetaFor(p).couponAmount));
    }

    // Deal filter
    if (onlyDeals) {
      list = list.filter((p) => Boolean(amazonMetaFor(p).hasDeal));
    }

    // Production type filter
    if (productionFilter === 'custom_3d') {
      list = list.filter((p) => p.type === 'custom_3d');
    } else if (productionFilter === 'ready' || readyToShipOnly) {
      list = list.filter((p) => p.type !== 'custom_3d');
    }

    // Text search query
    if (q) {
      list = list.filter((p) =>
        `${friendlyName(p)} ${p.description} ${p.category ?? ''} ${p.subtitle ?? ''}`
          .toLowerCase()
          .includes(q)
      );
    }

    // Sort order
    const sorted = [...list];
    if (sort === 'featured') {
      sorted.sort((a, b) => {
        const aLocal = getProductDisplayImage(a.id, a.images[0]).startsWith('/assets/products/');
        const bLocal = getProductDisplayImage(b.id, b.images[0]).startsWith('/assets/products/');
        if (aLocal && !bLocal) return -1;
        if (!aLocal && bLocal) return 1;
        return 0;
      });
    } else if (sort === 'price-asc') {
      sorted.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sort === 'price-desc') {
      sorted.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sort === 'rating') {
      sorted.sort((a, b) => amazonMetaFor(b).rating - amazonMetaFor(a).rating);
    }
    return sorted;
  }, [
    searchQuery,
    activeRoom,
    sort,
    priceFilter,
    minRating,
    onlyCoupons,
    onlyDeals,
    productionFilter,
    readyToShipOnly,
  ]);

  const totalCount = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const displayedProducts = useMemo(() => {
    if (showAll) return filteredProducts;
    const startIndex = (validPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredProducts, showAll, validPage]);

  const startItem = totalCount === 0 ? 0 : showAll ? 1 : (validPage - 1) * PAGE_SIZE + 1;
  const endItem = showAll ? totalCount : Math.min(validPage * PAGE_SIZE, totalCount);

  const currentDeptName =
    DEPARTMENT_NAMES[activeRoom] ||
    ROOMS.find((r) => r.id === activeRoom)?.label ||
    'All Categories';

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
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="shop" className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-24 font-sans text-[#0F172A]">
      {/* 1. Sleek Department Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
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
              className={`px-4 py-2 rounded-full whitespace-nowrap text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer border ${
                isActive
                  ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm'
                  : 'bg-white hover:bg-zinc-50 text-zinc-600 hover:text-[#0F172A] border-zinc-200/80 shadow-xs'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* 2. Refined Discovery Header & Sort Control */}
      <div className="bg-white rounded-2xl border border-zinc-200/70 p-4 sm:p-5 mb-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {totalCount === 0 ? (
            <span className="font-bold text-[#0F172A]">0 designs found</span>
          ) : (
            <span className="font-bold text-[#0F172A] tracking-tight">
              Showing {startItem}–{endItem} of {totalCount} designs
            </span>
          )}
          <span className="text-zinc-400">in</span>
          <span className="font-semibold text-[#FF6B00]">“{summaryQueryText}”</span>
          {hasActiveRefinements && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-zinc-600 hover:text-[#FF6B00] bg-zinc-100 hover:bg-orange-50 border border-zinc-200/60 transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 self-end sm:self-auto">
          {totalCount > PAGE_SIZE && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="text-xs text-zinc-500 hover:text-[#0F172A] hover:underline cursor-pointer font-medium"
            >
              {showAll ? 'Show 16 per page' : `View all ${totalCount}`}
            </button>
          )}

          <div className="flex items-center gap-2">
            <label className="text-xs text-zinc-500 font-medium flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </label>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Sort products by"
                className="appearance-none bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/90 text-[#0F172A] text-xs font-semibold rounded-xl py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] cursor-pointer shadow-xs transition"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated (4.8★+)</option>
                <option value="newest">New Releases</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN DTC LAYOUT: Minimalist Refinement Sidebar + Modern Product Grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ============================================================ */}
        {/* SLEEK DTC REFINEMENT SIDEBAR                                 */}
        {/* ============================================================ */}
        <aside className="w-full lg:w-64 shrink-0 bg-white rounded-2xl border border-zinc-200/70 p-5 space-y-6 shadow-xs hidden lg:block sticky top-24">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Refine Search
            </span>
            {hasActiveRefinements && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[11px] font-semibold text-[#FF6B00] hover:text-[#FF7A00] cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          {/* 1. Fulfillment & Perks */}
          <div className="space-y-2 pb-5 border-b border-zinc-100">
            <span className="text-xs font-semibold text-[#0F172A] block mb-2">
              Dispatch & Offers
            </span>
            
            {/* 48h Ready to ship toggle */}
            <label
              onClick={() => setReadyToShipOnly((prev) => !prev)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition ${
                readyToShipOnly
                  ? 'bg-orange-50/70 border-orange-200 text-[#FF6B00]'
                  : 'bg-zinc-50 hover:bg-zinc-100/70 border-zinc-200/60 text-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>48h Quick Dispatch</span>
              </div>
              <span className={`w-2 h-2 rounded-full ${readyToShipOnly ? 'bg-[#FF6B00]' : 'bg-zinc-300'}`} />
            </label>

            {/* Deals */}
            <label
              onClick={() => setOnlyDeals((prev) => !prev)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition ${
                onlyDeals
                  ? 'bg-orange-50/70 border-orange-200 text-[#FF6B00]'
                  : 'bg-zinc-50 hover:bg-zinc-100/70 border-zinc-200/60 text-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Limited Deals</span>
              </div>
              <span className={`w-2 h-2 rounded-full ${onlyDeals ? 'bg-[#FF6B00]' : 'bg-zinc-300'}`} />
            </label>

            {/* Coupons */}
            <label
              onClick={() => setOnlyCoupons((prev) => !prev)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition ${
                onlyCoupons
                  ? 'bg-orange-50/70 border-orange-200 text-[#FF6B00]'
                  : 'bg-zinc-50 hover:bg-zinc-100/70 border-zinc-200/60 text-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Eligible Discounts</span>
              </div>
              <span className={`w-2 h-2 rounded-full ${onlyCoupons ? 'bg-[#FF6B00]' : 'bg-zinc-300'}`} />
            </label>
          </div>

          {/* 2. Manufacturing Format */}
          <div className="space-y-1.5 pb-5 border-b border-zinc-100">
            <span className="text-xs font-semibold text-[#0F172A] block mb-2">
              Production Mode
            </span>
            {[
              { id: 'all', label: 'All Catalog' },
              { id: 'ready', label: 'Standard Batch (Fast Ship)' },
              { id: 'custom_3d', label: 'Made-to-Measure (Parametric)' },
            ].map((mode) => {
              const active = productionFilter === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setProductionFilter(mode.id as ProductionFilter)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                    active
                      ? 'bg-orange-50 text-[#FF6B00] font-semibold'
                      : 'text-zinc-600 hover:text-[#0F172A] hover:bg-zinc-50 font-normal'
                  }`}
                >
                  <span>{mode.label}</span>
                  {active && <Check className="w-3.5 h-3.5 text-[#FF6B00]" />}
                </button>
              );
            })}
          </div>

          {/* 3. Price Bracket Filter */}
          <div className="space-y-1.5 pb-5 border-b border-zinc-100">
            <span className="text-xs font-semibold text-[#0F172A] block mb-2">
              Price Range
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'all', label: 'Any' },
                { id: 'under20', label: 'Under $20' },
                { id: '20to35', label: '$20 – $35' },
                { id: 'over35', label: '$35+' },
              ].map((p) => {
                const active = priceFilter === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriceFilter(p.id as PriceFilter)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition cursor-pointer ${
                      active
                        ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs'
                        : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200/70'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Curated Rating */}
          <div className="space-y-1.5 pb-2">
            <span className="text-xs font-semibold text-[#0F172A] block mb-2">
              Customer Satisfaction
            </span>
            <button
              type="button"
              onClick={() => setMinRating((prev) => (prev === 4.8 ? 0 : 4.8))}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition cursor-pointer ${
                minRating === 4.8
                  ? 'bg-orange-50 text-[#FF6B00] font-semibold'
                  : 'text-zinc-600 hover:text-[#0F172A] hover:bg-zinc-50'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <span>4.8★ & Above</span>
              </div>
              <span className="text-[11px] text-zinc-400">Top Rated</span>
            </button>
            <button
              type="button"
              onClick={() => setMinRating((prev) => (prev === 4.5 ? 0 : 4.5))}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition cursor-pointer ${
                minRating === 4.5
                  ? 'bg-orange-50 text-[#FF6B00] font-semibold'
                  : 'text-zinc-600 hover:text-[#0F172A] hover:bg-zinc-50'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <span>4.5★ & Above</span>
              </div>
              <span className="text-[11px] text-zinc-400">Verified</span>
            </button>
          </div>
        </aside>

        {/* ============================================================ */}
        {/* MODERN CLEAN PRODUCT GRID                                    */}
        {/* ============================================================ */}
        <div className="flex-1 min-w-0 w-full">
          {displayedProducts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-zinc-200/70 shadow-xs px-4">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-[#FF6B00] flex items-center justify-center mx-auto mb-3">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-base font-bold text-[#0F172A]">No designs match your criteria</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Try widening your price bracket or selecting "All Products" to browse the entire collection.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-5 px-6 py-2.5 rounded-xl bg-[#0F172A] hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {displayedProducts.map((p) => {
                const meta = amazonMetaFor(p);
                const isCustom = p.type === 'custom_3d';
                const isAdded = addedId === p.id;
                const img = getProductDisplayImage(p.id, p.images[0]);
                const isCouponClipped = Boolean(clippedCoupons[p.id]);

                const basePrice = p.basePrice;
                const effectivePrice =
                  isCouponClipped && meta.couponAmount
                    ? Math.max(1, basePrice - meta.couponAmount)
                    : basePrice;

                const displayName = friendlyName(p).replace(/\bSnugFit\b/g, 'Wavezly');

                // Modern badge styling
                let badgeNode = null;
                if (isCustom) {
                  badgeNode = (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tight bg-orange-50 text-[#FF6B00] border border-orange-200/60 shadow-2xs">
                      <Sliders className="w-2.5 h-2.5" />
                      Made-to-Measure
                    </span>
                  );
                } else if (meta.badge === 'best_seller') {
                  badgeNode = (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF6B00] text-white shadow-2xs">
                      <Sparkles className="w-2.5 h-2.5" />
                      Bestseller
                    </span>
                  );
                } else if (meta.badge === 'overall_pick') {
                  badgeNode = (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0F172A] text-white shadow-2xs">
                      <Flame className="w-2.5 h-2.5 text-[#FF6B00]" />
                      Viral Hit
                    </span>
                  );
                } else if (meta.hasDeal) {
                  badgeNode = (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200/80 shadow-2xs">
                      <Zap className="w-2.5 h-2.5" />
                      Limited Deal
                    </span>
                  );
                }

                return (
                  <article
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className="group bg-white rounded-2xl border border-zinc-200/70 hover:border-zinc-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden relative"
                  >
                    {/* Generous Product Photography Container */}
                    <div className="relative aspect-square w-full p-6 flex items-center justify-center bg-zinc-50/70 group-hover:bg-zinc-100/50 transition-colors duration-300 overflow-hidden">
                      {/* Floating Badge (Top Left) */}
                      {badgeNode && (
                        <div className="absolute top-3 left-3 z-10">
                          {badgeNode}
                        </div>
                      )}

                      {/* Ready-to-Ship indicator (Top Right) */}
                      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-zinc-200/60 text-[10px] font-medium text-zinc-600 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>48h</span>
                      </div>

                      {/* High-End Studio Product Photography */}
                      <img
                        src={img}
                        alt={displayName}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>

                    {/* Product Card Content Body */}
                    <div className="p-4 sm:p-5 flex flex-col flex-1">
                      {/* Department / Category kicker */}
                      <div className="flex items-center justify-between text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-1">
                        <span>{p.category?.replace(/_/g, ' ') || '3D Hardware'}</span>
                        {meta.boughtPastMonth && (
                          <span className="text-[10px] text-zinc-500 font-normal lowercase">
                            {meta.boughtPastMonth.toLocaleString()}+ shipped
                          </span>
                        )}
                      </div>

                      {/* Product Title */}
                      <h3 className="text-sm font-semibold text-[#0F172A] group-hover:text-[#FF6B00] line-clamp-2 leading-snug transition-colors">
                        {displayName}
                      </h3>

                      {/* Rating & Reviews Bar */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        </div>
                        <span className="text-xs font-bold text-zinc-800">
                          {meta.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-zinc-400">
                          ({meta.count.toLocaleString()} reviews)
                        </span>
                      </div>

                      {/* Pricing Block */}
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-xl font-bold tracking-tight text-[#0F172A]">
                          ${effectivePrice.toFixed(2)}
                        </span>

                        {meta.listPrice && meta.listPrice > effectivePrice && (
                          <>
                            <span className="text-xs font-normal text-zinc-400 line-through">
                              ${meta.listPrice.toFixed(2)}
                            </span>
                            {meta.discountPercent && (
                              <span className="text-[11px] font-bold text-[#FF6B00] bg-orange-50 px-1.5 py-0.5 rounded">
                                -{meta.discountPercent}%
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      {/* Coupon Discount Pill */}
                      {meta.couponAmount && (
                        <div
                          onClick={(e) => toggleCoupon(e, p.id)}
                          className={`mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer select-none w-fit border ${
                            isCouponClipped
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-orange-50 hover:border-orange-200 hover:text-[#FF6B00]'
                          }`}
                          title={isCouponClipped ? 'Coupon applied' : 'Click to apply coupon code'}
                        >
                          {isCouponClipped ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <span className="w-3.5 h-3.5 rounded border border-zinc-300 bg-white flex items-center justify-center text-[9px] font-bold text-zinc-400">
                              %
                            </span>
                          )}
                          <span>
                            Save{' '}
                            <strong className="font-semibold">
                              ${meta.couponAmount.toFixed(2)}
                            </strong>{' '}
                            at checkout
                          </span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-auto pt-4">
                        {isCustom ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCustomize(p);
                            }}
                            className="w-full h-10 rounded-xl border border-zinc-200/90 hover:border-[#0F172A] bg-white hover:bg-zinc-50 active:bg-zinc-100 text-[#0F172A] text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition duration-200 cursor-pointer"
                          >
                            <Sliders className="w-3.5 h-3.5 text-[#FF6B00]" />
                            <span>Customize mm</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(e, p)}
                            className={`w-full h-10 rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition duration-200 cursor-pointer ${
                              isAdded
                                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                                : 'bg-[#FF6B00] hover:bg-[#FF7A00] active:bg-[#e05e00] text-white shadow-[#FF6B00]/20'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-4 h-4" /> Added to Bag
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-4 h-4" /> Add to Bag
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

          {/* Clean DTC Minimalist Pagination */}
          {!showAll && totalPages > 1 && (
            <div className="mt-10 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-zinc-500">
              <span className="text-xs text-zinc-500">
                Page {validPage} of {totalPages}
              </span>

              <div className="inline-flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={validPage <= 1}
                  onClick={() => handlePageChange(validPage - 1)}
                  className="px-3 py-2 rounded-xl border border-zinc-200/80 bg-white hover:bg-zinc-50 text-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition shadow-xs cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= validPage - 1 && page <= validPage + 1)
                  )
                  .map((page, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev && page - prev > 1;
                    const isSelected = page === validPage;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && (
                          <span className="px-2 py-1 text-zinc-400">...</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handlePageChange(page)}
                          className={`w-9 h-9 rounded-xl font-semibold transition cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#0F172A] text-white shadow-xs'
                              : 'bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200/80'
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
                  className="px-3 py-2 rounded-xl border border-zinc-200/80 bg-white hover:bg-zinc-50 text-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition shadow-xs cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

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
