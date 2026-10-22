/**
 * FORMGRID CONSUMER REVIEWS & TESTIMONIALS
 * Prioritized Light Mode, 5-star customer reviews, verified buyer badges, and real workspace stories
 */

import React, { useState } from 'react';
import { SEED_REVIEWS } from '../../db/seed';
import { Star, CheckCircle2, Sparkles } from 'lucide-react';
import { playClickSound } from '../../lib/soundEffects';

export const CustomerReviewsSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'custom_3d' | 'dropship'>('all');

  const filteredReviews = SEED_REVIEWS.filter((r) => {
    if (filter === 'all') return true;
    return r.productType === filter;
  });

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-200 dark:border-zinc-800 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-zinc-200/80 dark:border-zinc-800 gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COMMUNITY TESTIMONIALS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Loved by 1,840+ Creators & Designers
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 max-w-2xl">
            See how designers, engineers, and creators are transforming their desks with tailor-made trays and studio hardware.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 text-xs font-medium">
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
            All Reviews ({SEED_REVIEWS.length})
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              setFilter('custom_3d');
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === 'custom_3d'
                ? 'bg-white dark:bg-zinc-800 text-orange-600 dark:text-orange-400 shadow-sm font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            Custom 3D Trays
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              setFilter('dropship');
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === 'dropship'
                ? 'bg-white dark:bg-zinc-800 text-sky-600 dark:text-sky-400 shadow-sm font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            Studio Accessories
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Star Rating & Verified Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'fill-current' : 'text-zinc-300 dark:text-zinc-700'
                      }`}
                    />
                  ))}
                </div>

                <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified Purchase</span>
                </span>
              </div>

              {/* Review Text */}
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                "{review.comment}"
              </p>
            </div>

            {/* Author & Product Info */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
              <div className="font-semibold text-zinc-950 dark:text-white">
                {review.author}
              </div>
              <div className="text-zinc-500 text-[11px] mt-0.5">
                {review.reviewTitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
