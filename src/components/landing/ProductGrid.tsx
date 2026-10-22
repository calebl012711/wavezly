/**
 * FORMGRID CONSUMER PRODUCT CATALOG & DUAL FULFILLMENT GRID
 * Prioritized Light Mode, luxury DTC product cards, 5-view perspective inspector, and bag quick-add
 */

import React, { useState } from 'react';
import { Product } from '../../types';
import { SEED_PRODUCTS } from '../../db/seed';
import { useCartStore } from '../../store/useCartStore';
import { useCustomizerStore } from '../../store/useCustomizerStore';
import { ProductDetailModal } from '../pdp/ProductDetailModal';
import { playClickSound } from '../../lib/soundEffects';
import {
  Sliders,
  Plus,
  Check,
  Star,
  Eye,
  Sparkles,
  Truck,
  Box,
} from 'lucide-react';

interface ProductGridProps {
  onCustomizeProduct: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ onCustomizeProduct }) => {
  const [filter, setFilter] = useState<'all' | 'custom_3d' | 'dropship'>('all');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  const { addStandardItem } = useCartStore();
  const { setProduct } = useCustomizerStore();

  const activeProducts = SEED_PRODUCTS.filter((p) => p.active !== false);
  const customCount = activeProducts.filter((p) => p.type === 'custom_3d').length;
  const dropshipCount = activeProducts.filter((p) => p.type === 'dropship').length;
  const upcomingCount = SEED_PRODUCTS.filter((p) => p.active === false).length;

  const filteredProducts = activeProducts.filter((p) => {
    if (filter === 'all') return true;
    return p.type === filter;
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

  return (
    <section id="catalog-section" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Catalog Header & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-5 border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STUDIO COLLECTION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white font-sans">
            Curated Desk Modules & Studio Accessories
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 max-w-2xl">
            Custom-sized 3D organizers made to your drawer’s exact millimeter, paired with instant-ship studio accessories.
          </p>
        </div>

        {/* Consumer Filter Tabs */}
        <div className="flex flex-wrap items-center p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 self-start md:self-auto text-xs font-medium gap-1">
          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              setFilter('all');
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            All Products ({activeProducts.length})
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              setFilter('custom_3d');
            }}
            className={`px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
              filter === 'custom_3d'
                ? 'bg-white dark:bg-zinc-800 text-orange-600 dark:text-orange-400 shadow-sm font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Custom Sized ({customCount})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              setFilter('dropship');
            }}
            className={`px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
              filter === 'dropship'
                ? 'bg-white dark:bg-zinc-800 text-sky-600 dark:text-sky-400 shadow-sm font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Fast-Ship ({dropshipCount})</span>
          </button>

          <a
            href="#pipeline-section"
            onClick={() => playClickSound('tick')}
            className="px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 text-amber-600 dark:text-amber-400 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Upcoming ({upcomingCount})</span>
          </a>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {filteredProducts.map((product) => {
          const isCustom = product.type === 'custom_3d';
          const isAdded = recentlyAddedId === product.id;
          const heroImage = product.images[0] || '/assets/products/valet-pro-hero.svg';

          return (
            <div
              key={product.id}
              onClick={() => {
                playClickSound('tick');
                setSelectedProductForModal(product);
              }}
              className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer"
            >
              {/* Product Visual Container with 5-image Indicator */}
              <div className="relative h-60 bg-gradient-to-b from-[#fbfbfd] to-[#f4f4f7] dark:from-[#141418] dark:to-background p-4 flex flex-col justify-between border-b border-zinc-100 dark:border-zinc-800/80 overflow-hidden">
                <div className="flex items-center justify-between z-10">
                  {isCustom ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/50 text-[11px] text-orange-700 dark:text-orange-300 font-medium">
                      <Box className="w-3 h-3" />
                      <span>Custom Fit</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/50 text-[11px] text-sky-700 dark:text-sky-300 font-medium">
                      <Truck className="w-3 h-3" />
                      <span>Ships in 24h</span>
                    </span>
                  )}

                  <span className="text-[11px] text-zinc-600 dark:text-zinc-400 bg-white/90 dark:bg-black/60 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center gap-1 font-medium shadow-xs">
                    <Eye className="w-3 h-3" /> 5 Perspectives
                  </span>
                </div>

                {/* Actual Generated Image Render */}
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <img
                    src={heroImage}
                    alt={product.title}
                    className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-300 select-none"
                  />
                </div>

                {/* Bottom Spec Snapshot */}
                <div className="z-10 text-[11px] text-zinc-600 dark:text-zinc-400 bg-white/90 dark:bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 self-start font-medium shadow-xs">
                  {isCustom ? (
                    <span>±0.25mm Fit • Made in USA</span>
                  ) : (
                    <span>Domestic Transit • 2–4 Days</span>
                  )}
                </div>
              </div>

              {/* Product Info Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-semibold text-zinc-950 dark:text-white group-hover:text-signal-orange transition-colors">
                      {product.title}
                    </h3>
                    <div className="flex items-center space-x-1 text-amber-500 text-xs">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">4.9</span>
                    </div>
                  </div>

                  {product.subtitle && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {product.subtitle}
                    </p>
                  )}
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-2 line-clamp-2 leading-relaxed font-sans">
                    {product.description}
                  </p>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-400">
                  {Object.entries(product.technicalSpecs).slice(0, 3).map(([key, val]) => (
                    <span
                      key={key}
                      className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/70 dark:border-zinc-700/60 font-medium"
                    >
                      {val}
                    </span>
                  ))}
                </div>

                {/* Pricing & Action Button */}
                <div className="pt-3.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-medium">
                      {isCustom ? 'Crafted From' : 'Price'}
                    </span>
                    <span className="text-lg font-bold text-zinc-950 dark:text-white">
                      ${product.basePrice.toFixed(2)}{' '}
                      <span className="text-xs text-zinc-500 font-normal">USD</span>
                    </span>
                  </div>

                  {isCustom ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCustomize(product);
                      }}
                      className="flex items-center space-x-1.5 py-2.5 px-4 rounded-xl bg-signal-orange hover:bg-orange-600 text-white font-sans text-xs font-semibold shadow-sm hover:shadow-md transition cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Customize Fit</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleQuickAddDropship(e, product)}
                      className={`flex items-center space-x-1.5 py-2.5 px-4 rounded-xl border text-xs font-medium transition cursor-pointer ${
                        isAdded
                          ? 'border-emerald-300 text-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
                          : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-zinc-500" />
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

      {/* Interactive Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onLaunchCustomizer={(p) => onCustomizeProduct(p)}
      />
    </section>
  );
};
