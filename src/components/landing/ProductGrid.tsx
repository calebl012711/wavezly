/**
 * SNUGFIT CONSUMER PRODUCT CATALOG & DUAL FULFILLMENT GRID
 * Filterable across all consumer spaces: Kitchen & Coffee, Vanity & Bath,
 * Bedside & Entryway, Living & Media, Workspace, and Made-to-Measure 3D.
 */

import React, { useState } from 'react';
import { Product } from '../../types';
import { SEED_PRODUCTS } from '../../db/seed';
import { useCartStore } from '../../store/useCartStore';
import { useCustomizerStore } from '../../store/useCustomizerStore';
import { ProductDetailModal } from '../pdp/ProductDetailModal';
import { playClickSound } from '../../lib/soundEffects';
import { getProductDisplayImage } from '../../lib/productImages';
import {
  Sliders,
  Plus,
  Check,
  Sparkles,
  Truck,
  Box,
} from 'lucide-react';

interface ProductGridProps {
  onCustomizeProduct: (product: Product) => void;
}

type CatalogCategoryFilter =
  | 'all'
  | 'kitchen'
  | 'vanity'
  | 'bedside'
  | 'living'
  | 'workspace'
  | 'custom_3d'
  | 'dropship';

export const ProductGrid: React.FC<ProductGridProps> = ({ onCustomizeProduct }) => {
  const [filter, setFilter] = useState<CatalogCategoryFilter>('all');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  const { addStandardItem } = useCartStore();
  const { setProduct } = useCustomizerStore();

  const activeProducts = SEED_PRODUCTS.filter((p) => p.active !== false);

  const filteredProducts = activeProducts.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'custom_3d') return p.type === 'custom_3d';
    if (filter === 'dropship') return p.type === 'dropship';
    return p.category === filter;
  });

  const handleCustomize = (product: Product) => {
    playClickSound('snap');
    setProduct(product);
    onCustomizeProduct(product);
  };

  const handleQuickAddDropship = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    playClickSound('success');
    addStandardItem(product, 1);
    setRecentlyAddedId(product.id);
    setTimeout(() => setRecentlyAddedId(null), 2500);
  };

  const categories: { id: CatalogCategoryFilter; label: string; emoji?: string; count?: number }[] = [
    { id: 'all', label: 'All Goods', emoji: '✨', count: activeProducts.length },
    { id: 'kitchen', label: 'Kitchen & Coffee', emoji: '🍳' },
    { id: 'vanity', label: 'Vanity & Bath', emoji: '💄' },
    { id: 'bedside', label: 'Bedside & Entry', emoji: '🌙' },
    { id: 'living', label: 'Living & Media', emoji: '🛋️' },
    { id: 'workspace', label: 'Desk & Work', emoji: '🖥️' },
    { id: 'custom_3d', label: 'Custom 3D Fit', emoji: '📐' },
    { id: 'dropship', label: 'Fast-Ship', emoji: '📦' },
  ];

  return (
    <section id="catalog-section" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Catalog Header & Room Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-5 border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WHOLE-HOME COLLECTION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white font-sans">
            Organizers & Goods for Every Room
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            Custom-made 3D organizers tailored down to your exact millimeters, paired with fast-shipping home essentials.
          </p>
        </div>

        {/* Room Category Tabs */}
        <div className="flex flex-wrap items-center p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 self-start md:self-auto text-xs font-medium gap-1">
          {categories.map((cat) => {
            const isSelected = filter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  playClickSound('snap');
                  setFilter(cat.id);
                }}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                {cat.emoji && <span>{cat.emoji}</span>}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {filteredProducts.map((product) => {
          const isCustom = product.type === 'custom_3d';
          const isAdded = recentlyAddedId === product.id;
          const heroImage = product.images[0] || '/assets/products/valet-pro-hero.svg';
          const displayImage = getProductDisplayImage(product.id, heroImage);

          const roomLabel = product.category
            ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
            : 'Home';

          return (
            <div
              key={product.id}
              onClick={() => {
                playClickSound('tick');
                setSelectedProductForModal(product);
              }}
              className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              {/* Product Visual Container */}
              <div className="relative h-60 bg-gradient-to-b from-[#fbfbfd] to-[#f4f4f7] dark:from-[#141418] dark:to-background p-4 flex flex-col justify-between border-b border-zinc-100 dark:border-zinc-800/80 overflow-hidden">
                <div className="flex items-center justify-between z-10">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-zinc-900/5 dark:bg-white/10 text-[11px] text-zinc-700 dark:text-zinc-300 font-medium border border-zinc-200/60 dark:border-zinc-700/60">
                    <span>{roomLabel}</span>
                  </span>

                  {isCustom ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/50 text-[11px] text-orange-700 dark:text-orange-300 font-medium">
                      <Box className="w-3 h-3" />
                      <span>Custom Fit</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/50 text-[11px] text-sky-700 dark:text-sky-300 font-medium">
                      <Truck className="w-3 h-3" />
                      <span>In Stock</span>
                    </span>
                  )}
                </div>

                {/* Actual Generated Image Render */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <img
                    src={displayImage}
                    alt={product.title}
                    className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-300 select-none rounded-xl"
                  />
                </div>

                {/* Bottom Snapshot Badge */}
                <div className="z-10 text-[11px] text-zinc-600 dark:text-zinc-400 bg-white/90 dark:bg-black/70 backdrop-blur-sm px-2.5 py-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 self-start font-medium shadow-xs">
                  {isCustom ? (
                    <span>Guaranteed Fit • Made in USA</span>
                  ) : (
                    <span>Fast Delivery • 2–4 Days</span>
                  )}
                </div>
              </div>

              {/* Product Info Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                <div>
                  <h3 className="text-base font-semibold text-zinc-950 dark:text-white group-hover:text-signal-orange transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                    {product.subtitle || product.description}
                  </p>
                </div>

                {/* Price and Action Row */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-400 block">
                      {isCustom ? 'Starts at' : 'Price'}
                    </span>
                    <span className="text-lg font-bold text-zinc-900 dark:text-white font-sans">
                      ${product.basePrice.toFixed(2)}
                    </span>
                  </div>

                  {isCustom ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCustomize(product);
                      }}
                      className="px-4 py-2 rounded-xl bg-signal-orange hover:bg-orange-600 text-white text-xs font-semibold tracking-wide flex items-center space-x-1.5 shadow-xs transition cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Customize</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleQuickAddDropship(e, product)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide flex items-center space-x-1.5 transition cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 shadow-xs'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      {selectedProductForModal && (
        <ProductDetailModal
          product={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
          onLaunchCustomizer={handleCustomize}
        />
      )}
    </section>
  );
};
