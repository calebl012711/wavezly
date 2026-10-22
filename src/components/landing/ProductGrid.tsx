/**
 * FORMGRID HARDWARE CATALOG & SPLIT-FULFILLMENT PRODUCT GRID
 * Interactive filtering between Custom 3D Fabricated goods and Fast-Ship Domestic Accessories
 * Includes 5-image perspective previews and deep Product Detail Modal integration
 */

import React, { useState } from 'react';
import { Product } from '../../types';
import { SEED_PRODUCTS } from '../../db/seed';
import { useCartStore } from '../../store/useCartStore';
import { useCustomizerStore } from '../../store/useCustomizerStore';
import { ProductDetailModal } from '../pdp/ProductDetailModal';
import {
  Cpu,
  Truck,
  Sliders,
  Plus,
  Check,
  Layers,
  Eye,
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

  const filteredProducts = SEED_PRODUCTS.filter((p) => {
    if (filter === 'all') return true;
    return p.type === filter;
  });

  const handleCustomize = (product: Product) => {
    setProduct(product);
    onCustomizeProduct(product);
  };

  const handleQuickAddDropship = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addStandardItem(product, 1);
    setRecentlyAddedId(product.id);
    setTimeout(() => setRecentlyAddedId(null), 2500);
  };

  return (
    <section id="catalog-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Catalog Header & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-surface-border gap-4">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-signal-orange uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>HARDWARE ECOSYSTEM</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-precision-white">
            Curated Desk Modules & Rapid Hardware
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Select on-demand 3D parametric components or in-stock domestic accessories. Click any module to inspect CAD schematics.
          </p>
        </div>

        {/* Tactical Filter Tabs */}
        <div className="flex items-center p-1 bg-surface rounded-lg border border-surface-border self-start md:self-auto font-mono text-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded transition ${
              filter === 'all'
                ? 'bg-zinc-800 text-precision-white shadow-tactile'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Systems [{SEED_PRODUCTS.length}]
          </button>

          <button
            type="button"
            onClick={() => setFilter('custom_3d')}
            className={`px-3 py-1.5 rounded flex items-center space-x-1.5 transition ${
              filter === 'custom_3d'
                ? 'bg-signal-orange/15 text-signal-orange border border-signal-orange/30 shadow-tactile'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Custom 3D [5]</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('dropship')}
            className={`px-3 py-1.5 rounded flex items-center space-x-1.5 transition ${
              filter === 'dropship'
                ? 'bg-signal-cyan/15 text-signal-cyan border border-signal-cyan/30 shadow-tactile'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Fast-Ship US [5]</span>
          </button>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const isCustom = product.type === 'custom_3d';
          const isAdded = recentlyAddedId === product.id;
          const heroImage = product.images[0] || '/assets/products/valet-pro-hero.svg';

          return (
            <div
              key={product.id}
              onClick={() => setSelectedProductForModal(product)}
              className="group relative bg-surface/80 rounded-xl border border-surface-border hover:border-zinc-700 flex flex-col justify-between overflow-hidden shadow-tactile hover:shadow-2xl transition-all cursor-pointer"
            >
              {/* Product Visual Container with 5-image Indicator */}
              <div className="relative h-56 bg-gradient-to-b from-[#141418] to-background p-4 flex flex-col justify-between border-b border-surface-border overflow-hidden">
                <div className="flex items-center justify-between z-10">
                  {isCustom ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-signal-orange/10 border border-signal-orange/30 font-mono text-[10px] text-signal-orange font-semibold">
                      <Cpu className="w-3 h-3" />
                      <span>ON-DEMAND 3D PRINT</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-signal-cyan/10 border border-signal-cyan/30 font-mono text-[10px] text-signal-cyan font-semibold">
                      <Truck className="w-3 h-3" />
                      <span>US WAREHOUSE (2-4 DAY)</span>
                    </span>
                  )}

                  <span className="font-mono text-[10px] text-zinc-500 bg-black/60 px-2 py-0.5 rounded border border-zinc-800 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> 5 VIEWS
                  </span>
                </div>

                {/* Actual Generated Image Render */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <img
                    src={heroImage}
                    alt={product.title}
                    className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-300 select-none"
                  />
                </div>

                {/* Bottom Spec Snapshot */}
                <div className="z-10 font-mono text-[10px] text-zinc-400 bg-black/70 backdrop-blur-sm px-2 py-1 rounded border border-zinc-800/80 self-start">
                  {isCustom ? (
                    <span>Tolerances: ±0.25mm // Continuous Parametric</span>
                  ) : (
                    <span>Origin: {product.supplierMeta?.warehouseOrigin.split('(')[1]?.replace(')', '') || 'USA Domestic'}</span>
                  )}
                </div>
              </div>

              {/* Product Info Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-100 group-hover:text-signal-orange transition-colors">
                    {product.title}
                  </h3>
                  {product.subtitle && (
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                      {product.subtitle}
                    </p>
                  )}
                  <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed font-sans">
                    {product.description}
                  </p>
                </div>

                {/* Key Spec Badges */}
                <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-zinc-400">
                  {Object.entries(product.technicalSpecs).slice(0, 3).map(([key, val]) => (
                    <span
                      key={key}
                      className="px-2 py-0.5 rounded bg-black/50 border border-zinc-800"
                    >
                      {key}: {val}
                    </span>
                  ))}
                </div>

                {/* Pricing & Action Button */}
                <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-zinc-500 uppercase block">
                      {isCustom ? 'Base Price' : 'Unit Price'}
                    </span>
                    <span className="font-mono text-base font-bold text-precision-white">
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
                      className="flex items-center space-x-1.5 py-2 px-3.5 rounded-lg bg-signal-orange hover:bg-orange-600 text-black font-mono text-xs font-bold tracking-wider shadow-glow-orange transition"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>CUSTOMIZE</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleQuickAddDropship(e, product)}
                      className={`flex items-center space-x-1.5 py-2 px-3.5 rounded-lg border font-mono text-xs font-medium transition ${
                        isAdded
                          ? 'border-signal-lime text-signal-lime bg-signal-lime/10'
                          : 'border-zinc-700 bg-surface hover:bg-zinc-800 text-zinc-200'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>QUEUED</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD ACCESSORY</span>
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
