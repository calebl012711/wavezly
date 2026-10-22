/**
 * FORMGRID VERIFIED PRODUCTION REVIEWS & CASE STUDIES
 * Real customer desk setups, tolerance verification scores, and split-shipping testimonials
 */

import React, { useState } from 'react';
import { SEED_REVIEWS } from '../../db/seed';
import { Star, CheckCircle2, MessageSquare } from 'lucide-react';

export const CustomerReviewsSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'custom_3d' | 'dropship'>('all');

  const filteredReviews = SEED_REVIEWS.filter((r) => {
    if (filter === 'all') return true;
    return r.productType === filter;
  });

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-surface-border font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-surface-border gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-signal-orange uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>FIELD TELEMETRY // VERIFIED CLIENTS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-precision-white font-sans">
            Client Verification & Tolerance Reports
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real desk setups fabricated to precision millimeter drawer footprints.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 p-1 bg-surface rounded-lg border border-surface-border text-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded transition ${
              filter === 'all'
                ? 'bg-zinc-800 text-precision-white shadow-tactile'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Reports [{SEED_REVIEWS.length}]
          </button>
          <button
            type="button"
            onClick={() => setFilter('custom_3d')}
            className={`px-3 py-1.5 rounded transition ${
              filter === 'custom_3d'
                ? 'bg-signal-orange/15 text-signal-orange border border-signal-orange/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Custom 3D Prints
          </button>
          <button
            type="button"
            onClick={() => setFilter('dropship')}
            className={`px-3 py-1.5 rounded transition ${
              filter === 'dropship'
                ? 'bg-signal-cyan/15 text-signal-cyan border border-signal-cyan/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Fast-Ship Hardware
          </button>
        </div>
      </div>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-xl bg-surface border border-surface-border space-y-3.5 shadow-tactile hover:border-zinc-700 transition"
          >
            {/* Review Card Top */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-1.5 text-signal-amber mb-1">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <h4 className="text-sm font-bold text-zinc-100 font-sans">
                  {rev.reviewTitle}
                </h4>
              </div>

              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-signal-lime/10 border border-signal-lime/30 text-[10px] text-signal-lime font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>VERIFIED PRODUCTION</span>
              </span>
            </div>

            {/* Comment Body */}
            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              "{rev.comment}"
            </p>

            {/* Tolerance Score Badge */}
            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
              <span className="text-zinc-400">
                {rev.author} // <span className="text-zinc-500">{rev.location}</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-black/60 border border-zinc-800 text-signal-orange">
                {rev.fitToleranceScore}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
