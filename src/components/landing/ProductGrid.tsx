/**
 * WAVEZLY PRODUCT CATALOG
 * Clean, modern DTC shopping experience:
 * - 2 columns on mobile (grid-cols-2 gap-3), 4 columns on desktop
 * - Responsive top filter pills (zero layout blowout)
 * - Clear pricing and honest product details
 * - Touch-friendly tap targets
 */

import React, { useMemo, useState, useEffect } from 'react';
import {
  ShoppingBag,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sliders,
  RotateCcw,
  Check,
  Search,
} from 'lucide-react';
import { Product } from '../../types';
import { SEED_PRODUCTS } from '../../db/seed';
import { useCartStore } from '../../store/useCartStore';
import { useCustomizerStore } from '../../store/useCustomizerStore';
import { ProductDetailModal } from '../pdp/ProductDetailModal';
import { getProductDisplayImage } from '../../lib/productImages';
import {
  RoomId,
  friendlyName,
  amazonMetaFor,
} from '../../lib/storefront';

interface ProductGridProps {
  onCustomizeProduct: (product: Product) => void;
  searchQuery: string;
  activeRoom: RoomId;
  onSelectRoom: (room: RoomId) => void;
}

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating';
type PriceFilter = 'all' | 'under20' | '20to35' | 'over35';

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
        /3d|toy|puzzle|fidget|skull|ornament|kids|dragon|articulated|cone|axolotl/i.test(text)
      );
    case 'kitchen':
      return /kitchen|cutlery|pantry|coffee|espresso|spice|dining|utensil/i.test(text);
    case 'electronics':
      return /electronics|cable|charger|headphone|dac|led|monitor|usb|controller|gaming/i.test(text);
    case 'vanity':
      return /vanity|bathroom|makeup|cosmetic|skincare|beauty/i.test(text);
    case 'home_decor':
      return /decor|planter|vase|coaster|shelf|plant|flower|interior|voronoi|lamp/i.test(text);
    case 'car_auto':
      return /car|automotive|vehicle|auto|trunk|cup holder/i.test(text);
    case 'tools_workshop':
      return /tool|pegboard|chest|hardware|hex|drill|workshop|gridfinity/i.test(text);
    case 'bedside':
      return /bedside|bedroom|nightstand|dresser|valet|catchall|caddy/i.test(text);
    case 'living':
      return /living|couch|sofa|coffee table|coaster/i.test(text);
    case 'workspace':
      return /desk|office|workspace|screenbar|mousepad/i.test(text);
    default:
      return false;
  }
}

const CATEGORY_CHIPS: { id: RoomId; label: string }[] = [
  { id: 'all', label: 'All Products' },
  { id: 'trending_3d', label: 'Toys & Fidgets' },
  { id: 'home_decor', label: 'Lamps & Décor' },
  { id: 'kitchen', label: 'Coffee & Kitchen' },
  { id: 'electronics', label: 'Gaming & Desk' },
  { id: 'car_auto', label: 'Car Gear' },
  { id: 'custom', label: 'Custom Fit' },
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { addStandardItem } = useCartStore();
  const { setProduct } = useCustomizerStore();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeRoom, sort, priceFilter, minRating]);

  const resetAllFilters = () => {
    onSelectRoom('all');
    setPriceFilter('all');
    setMinRating(0);
    setSort('featured');
  };

  const hasActiveFilters =
    activeRoom !== 'all' ||
    priceFilter !== 'all' ||
    minRating > 0 ||
    Boolean(searchQuery.trim());

  // Filter products
  const filteredProducts = useMemo(() => {
    return SEED_PRODUCTS.filter((p) => {
      if (activeRoom !== 'all' && !matchesDepartment(p, activeRoom)) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const searchCorpus = `${friendlyName(p)} ${p.title} ${p.subtitle || ''} ${p.description || ''} ${p.category || ''}`.toLowerCase();
        if (!searchCorpus.includes(q)) return false;
      }

      if (priceFilter === 'under20' && p.basePrice >= 20) return false;
      if (priceFilter === '20to35' && (p.basePrice < 20 || p.basePrice > 35)) return false;
      if (priceFilter === 'over35' && p.basePrice <= 35) return false;

      const meta = amazonMetaFor(p);
      if (minRating > 0 && meta.rating < minRating) return false;

      return true;
    });
  }, [activeRoom, searchQuery, priceFilter, minRating]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sort) {
      case 'price-asc':
        return list.sort((a, b) => a.basePrice - b.basePrice);
      case 'price-desc':
        return list.sort((a, b) => b.basePrice - a.basePrice);
      case 'rating':
        return list.sort((a, b) => amazonMetaFor(b).rating - amazonMetaFor(a).rating);
      case 'featured':
      default:
        return list;
    }
  }, [filteredProducts, sort]);

  const totalCount = sortedProducts.length;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;
  const displayedProducts = sortedProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleQuickAdd = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    if (p.type === 'custom_3d') {
      setProduct(p);
      onCustomizeProduct(p);
      return;
    }
    addStandardItem(p, 1);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="w-full">
      {/* 1. TOP RESPONSIVE FILTER BAR */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-zinc-200/80 p-3 sm:p-4 mb-6 shadow-xs">
        {/* Category Filter Pills (Horizontal scroll on mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2.5 mb-2.5 border-b border-zinc-100">
          {CATEGORY_CHIPS.map((cat) => {
            const isSelected = activeRoom === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectRoom(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#FF6B00] text-white shadow-xs'
                    : 'bg-zinc-100/80 hover:bg-zinc-200/70 text-zinc-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Controls (Price, Rating, Sort) */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Left: Quick Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-zinc-400 font-medium hidden sm:inline">Filter:</span>
            <button
              type="button"
              onClick={() => setPriceFilter(priceFilter === 'under20' ? 'all' : 'under20')}
              className={`px-2.5 py-1 rounded-lg border font-medium transition cursor-pointer ${
                priceFilter === 'under20'
                  ? 'bg-orange-50 border-orange-200 text-[#FF6B00]'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Under $20
            </button>
            <button
              type="button"
              onClick={() => setPriceFilter(priceFilter === '20to35' ? 'all' : '20to35')}
              className={`px-2.5 py-1 rounded-lg border font-medium transition cursor-pointer ${
                priceFilter === '20to35'
                  ? 'bg-orange-50 border-orange-200 text-[#FF6B00]'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-900'
              }`}
            >
              $20–$35
            </button>
            <button
              type="button"
              onClick={() => setMinRating(minRating === 4.8 ? 0 : 4.8)}
              className={`px-2.5 py-1 rounded-lg border font-medium transition cursor-pointer flex items-center gap-1 ${
                minRating === 4.8
                  ? 'bg-orange-50 border-orange-200 text-[#FF6B00]'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>4.8★+</span>
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[11px] font-semibold text-zinc-500 hover:text-[#FF6B00] ml-1 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Right: Results Count & Sort Dropdown */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-zinc-500 text-[11px] hidden sm:inline">
              {totalCount} items
            </span>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Sort products"
                className="appearance-none bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs font-semibold rounded-lg py-1.5 pl-2.5 pr-7 focus:outline-none focus:border-[#FF6B00] cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. PRODUCT GRID (2 COLS MOBILE, 4 COLS DESKTOP) */}
      {displayedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200 p-6">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-[#FF6B00] flex items-center justify-center mx-auto mb-3">
            <Search className="w-5 h-5" />
          </div>
          <p className="text-base font-bold text-[#0F172A]">No products found</p>
          <p className="text-xs text-zinc-500 mt-1">
            Try resetting your filters to see all available designs.
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="mt-4 px-5 py-2 rounded-full bg-[#0F172A] hover:bg-zinc-800 text-white text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {displayedProducts.map((p) => {
            const isCustom = p.type === 'custom_3d';
            const isAdded = addedId === p.id;
            const img = getProductDisplayImage(p.id, p.images[0]);
            const displayName = friendlyName(p).replace(/\bSnugFit\b/g, 'Wavezly');
            const meta = amazonMetaFor(p);

            return (
              <article
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className="group bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-zinc-200/80 hover:border-orange-200/80 shadow-xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-square rounded-lg sm:rounded-xl bg-zinc-50 overflow-hidden mb-2.5 sm:mb-3 border border-zinc-100">
                    <img
                      src={img}
                      alt={displayName}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                    />

                    {/* Clean Badges */}
                    {isCustom ? (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-zinc-900/85 text-white text-[9px] sm:text-[10px] font-semibold tracking-wide backdrop-blur-xs">
                        Custom Size
                      </span>
                    ) : meta.rating >= 4.9 ? (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#FF6B00] text-white text-[9px] sm:text-[10px] font-bold tracking-wide">
                        Popular
                      </span>
                    ) : null}
                  </div>

                  {/* Title */}
                  <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-[#FF6B00] transition line-clamp-2 leading-snug">
                    {displayName}
                  </h3>

                  {/* Category & Rating */}
                  <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-500">
                    <span className="truncate max-w-[90px] sm:max-w-[120px]">
                      {p.category ? p.category.replace('_', ' ') : 'Maker Good'}
                    </span>
                    <div className="flex items-center gap-0.5 font-semibold text-zinc-700">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{meta.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Price & Action Row */}
                <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between gap-1.5">
                  <div>
                    <span className="text-xs sm:text-sm font-extrabold text-[#0F172A]">
                      ${p.basePrice.toFixed(2)}
                    </span>
                  </div>

                  {isCustom ? (
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, p)}
                      className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#FF6B00] text-[11px] sm:text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Sliders className="w-3 h-3" />
                      <span className="hidden sm:inline">Fit mm</span>
                      <span className="sm:hidden">Fit</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, p)}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#0F172A] hover:bg-[#FF6B00] text-white active:scale-95'
                      }`}
                      aria-label={`Add ${displayName} to cart`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span className="hidden sm:inline">Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3 h-3" />
                          <span>+ Bag</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* 3. PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1));
              document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-2 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-semibold text-zinc-700 px-3">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => {
              setCurrentPage((p) => Math.min(totalPages, p + 1));
              document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-2 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onLaunchCustomizer={(p) => {
          setSelectedProduct(null);
          onCustomizeProduct(p);
        }}
      />
    </div>
  );
};
