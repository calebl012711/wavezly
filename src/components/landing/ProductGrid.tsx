/**
 * SNUGFIT PRODUCT CATALOG
 * Clean shopping grid: search + room filter + sort, star ratings, clear prices, one-tap add to cart.
 */

import React, { useMemo, useState } from 'react';
import { Check, ShoppingCart, SlidersHorizontal, Star } from 'lucide-react';
import { Product } from '../../types';
import { SEED_PRODUCTS } from '../../db/seed';
import { useCartStore } from '../../store/useCartStore';
import { useCustomizerStore } from '../../store/useCustomizerStore';
import { ProductDetailModal } from '../pdp/ProductDetailModal';
import { getProductDisplayImage } from '../../lib/productImages';
import { ROOMS, RoomId, friendlyName, hasPhoto, ratingFor } from '../../lib/storefront';

interface ProductGridProps {
  onCustomizeProduct: (product: Product) => void;
  searchQuery: string;
  activeRoom: RoomId;
  onSelectRoom: (room: RoomId) => void;
}

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating';

const Stars: React.FC<{ rating: number }> = ({ rating }) => (
  <span className="inline-flex" aria-hidden="true">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'
        }`}
      />
    ))}
  </span>
);

export const ProductGrid: React.FC<ProductGridProps> = ({
  onCustomizeProduct,
  searchQuery,
  activeRoom,
  onSelectRoom,
}) => {
  const [sort, setSort] = useState<SortKey>('featured');
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);

  const { addStandardItem } = useCartStore();
  const { setProduct } = useCustomizerStore();

  const products = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = SEED_PRODUCTS.filter((p) => p.active !== false && hasPhoto(p));

    if (activeRoom === 'custom') list = list.filter((p) => p.type === 'custom_3d');
    else if (activeRoom !== 'all') list = list.filter((p) => p.category === activeRoom);

    if (q) {
      list = list.filter((p) =>
        `${friendlyName(p)} ${p.description} ${p.category ?? ''}`.toLowerCase().includes(q)
      );
    }

    const sorted = [...list];
    if (sort === 'price-asc') sorted.sort((a, b) => a.basePrice - b.basePrice);
    if (sort === 'price-desc') sorted.sort((a, b) => b.basePrice - a.basePrice);
    if (sort === 'rating') sorted.sort((a, b) => ratingFor(b).rating - ratingFor(a).rating);
    return sorted;
  }, [searchQuery, activeRoom, sort]);

  const roomLabel = ROOMS.find((r) => r.id === activeRoom)?.label ?? 'All Products';

  const customize = (p: Product) => {
    setProduct(p);
    onCustomizeProduct(p);
  };

  const quickAdd = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    addStandardItem(p, 1);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 scroll-mt-28">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900">{roomLabel}</h2>
          <p className="text-sm text-zinc-500 mt-1">
            {products.length} {products.length === 1 ? 'item' : 'items'}
            {searchQuery.trim() && <> for “{searchQuery.trim()}”</>}
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-600">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="sr-only sm:not-sr-only">Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-9 rounded-lg border border-zinc-300 bg-white px-2 text-sm text-zinc-800 focus:outline-none focus:border-orange-500"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-zinc-200">
          <p className="text-lg font-semibold text-zinc-900">No products found</p>
          <p className="text-sm text-zinc-500 mt-1">Try a different search or browse everything.</p>
          <button
            type="button"
            onClick={() => onSelectRoom('all')}
            className="mt-4 px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold"
          >
            Show all products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {products.map((p, idx) => {
            const { rating, count } = ratingFor(p);
            const custom = p.type === 'custom_3d';
            const added = addedId === p.id;
            const img = getProductDisplayImage(p.id, p.images[0]);
            return (
              <article
                key={p.id}
                onClick={() => setSelected(p)}
                className="group bg-white rounded-xl border border-zinc-200 hover:shadow-lg hover:border-zinc-300 transition cursor-pointer flex flex-col overflow-hidden"
              >
                <div className="relative aspect-square bg-zinc-100 overflow-hidden">
                  <img
                    src={img}
                    alt={friendlyName(p)}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {idx < 2 && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-orange-600 text-white text-[11px] font-semibold">
                      Best seller
                    </span>
                  )}
                </div>
                <div className="p-3 sm:p-4 flex flex-col flex-1">
                  <h3 className="text-sm sm:text-base font-medium text-zinc-900 line-clamp-2 group-hover:text-orange-600 transition">
                    {friendlyName(p)}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs">
                    <Stars rating={rating} />
                    <span className="text-sky-700">{count.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    {custom && <span className="text-xs text-zinc-500">From</span>}
                    <span className="text-xl font-bold text-zinc-900">
                      ${p.basePrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {custom ? 'Custom size • Made for you' : 'Ships in 1–2 days'}
                    {p.basePrice >= 30 && <span className="text-emerald-700"> • Free shipping</span>}
                  </p>
                  <div className="mt-auto pt-3">
                    {custom ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          customize(p);
                        }}
                        className="w-full h-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition"
                      >
                        Choose size
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => quickAdd(e, p)}
                        className={`w-full h-10 rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 transition ${
                          added
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-400 hover:bg-amber-500 text-zinc-900'
                        }`}
                      >
                        {added ? (
                          <>
                            <Check className="w-4 h-4" /> Added
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" /> Add to cart
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

      {selected && (
        <ProductDetailModal
          product={selected}
          onClose={() => setSelected(null)}
          onLaunchCustomizer={(p) => {
            setSelected(null);
            customize(p);
          }}
        />
      )}
    </section>
  );
};
