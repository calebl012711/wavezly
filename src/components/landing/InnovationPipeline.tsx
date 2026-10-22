/**
 * SNUGDESK COMMUNITY INNOVATION PIPELINE & PRE-ORDER LAB
 * 5 upcoming hardware systems with community voting, notify modals,
 * and pre-configured DSers / AutoDS / 3D Farm integration hooks
 */

import React, { useState } from 'react';
import { SEED_PRODUCTS } from '../../db/seed';
import { Product } from '../../types';
import { playClickSound } from '../../lib/soundEffects';
import {
  Sparkles,
  ThumbsUp,
  Bell,
  CheckCircle2,
  Lock,
  Layers,
  Radio,
  Flame,
  X,
  Send,
} from 'lucide-react';

export const InnovationPipeline: React.FC = () => {
  const upcomingProducts = SEED_PRODUCTS.filter((p) => p.active === false);

  const [votes, setVotes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    upcomingProducts.forEach((p) => {
      initial[p.id] = p.communityVotes || 250;
    });
    return initial;
  });

  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});
  const [notifyModalProduct, setNotifyModalProduct] = useState<Product | null>(null);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);

  const handleVote = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (hasVoted[productId]) return;

    playClickSound('snap');
    setVotes((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
    setHasVoted((prev) => ({
      ...prev,
      [productId]: true,
    }));
  };

  const handleOpenNotify = (product: Product) => {
    playClickSound('tick');
    setNotifyModalProduct(product);
    setNotifySuccess(false);
    setNotifyEmail('');
  };

  const handleSubmitNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail) return;

    playClickSound('success');
    setNotifySuccess(true);
    setTimeout(() => {
      setNotifyModalProduct(null);
      setNotifySuccess(false);
      setNotifyEmail('');
    }, 2200);
  };

  return (
    <section id="pipeline-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-200/80 dark:border-zinc-800">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-5 border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5" />
            <span>COMMUNITY INNOVATION PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white font-sans">
            What Should We Craft Next?
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 max-w-2xl">
            Vote on upcoming prototypes. The highest-voted designs get pushed to our USA workshop and fast-ship hubs first. Backers receive 20% off at drop.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-3.5 py-2 rounded-xl border border-zinc-200/70 dark:border-zinc-800 self-start md:self-auto">
          <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span>Stage 01: Community Sizing & Sourcing</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingProducts.map((product) => {
          const currentVotes = votes[product.id] || 0;
          const userVoted = hasVoted[product.id];
          const is3D = product.type === 'custom_3d';

          return (
            <div
              key={product.id}
              className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 hover:border-amber-400/50 dark:hover:border-amber-500/40 p-5 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-200"
            >
              {/* Top Meta Badges */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center space-x-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                    <Sparkles className="w-3 h-3" />
                    <span>{product.badge || 'Prototype'}</span>
                  </span>

                  <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                    Est. ${product.basePrice.toFixed(2)}
                  </span>
                </div>

                {/* Hero Illustration */}
                <div className="relative h-44 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/80 flex items-center justify-center p-3 overflow-hidden mb-4 group-hover:scale-[1.01] transition-transform">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md opacity-90 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-white/90">
                    {is3D ? (
                      <>
                        <Layers className="w-2.5 h-2.5 text-orange-400" />
                        <span>3D Farm Pipeline</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-2.5 h-2.5 text-sky-400" />
                        <span>DSers Domestic Hub</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white leading-snug">
                  {product.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                  {product.description}
                </p>

                {/* Sourcing / Specs Pill */}
                <div className="mt-3.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>
                    {is3D ? 'Parametric Biopolymer' : product.supplierMeta?.warehouseOrigin?.split('(')[0] || 'Domestic Hub'}
                  </span>
                  <span className="font-mono text-zinc-400">
                    {is3D ? '±0.20mm Spec' : product.supplierMeta?.supplierSku || 'SKU Ready'}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Vote & Notify */}
              <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleVote(e, product.id)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                    userVoted
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${userVoted ? 'fill-current' : ''}`} />
                  <span>{userVoted ? 'Voted' : 'Vote'}</span>
                  <span className="font-mono ml-1 text-[11px] opacity-80">({currentVotes})</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenNotify(product)}
                  className="py-2 px-3.5 rounded-xl text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-300/40 dark:border-amber-700/40 flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Notify Me</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notify Early-Bird Modal */}
      {notifyModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setNotifyModalProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {notifySuccess ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 animate-bounce" />
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">You're on the VIP List!</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
                  We'll email you 24 hours before <span className="font-semibold text-zinc-800 dark:text-zinc-200">{notifyModalProduct.title}</span> goes live, along with an exclusive 20% early-bird code.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1.5">
                  <Bell className="w-3.5 h-3.5" />
                  <span>VIP Pre-Order Alert</span>
                </div>
                <h3 className="text-xl font-bold text-zinc-950 dark:text-white leading-snug">
                  Get Notified for {notifyModalProduct.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  Be first in line when our Boise workshop begins production. Zero spam, just one email when the drop opens.
                </p>

                <form onSubmit={handleSubmitNotify} className="mt-5 space-y-3">
                  <div>
                    <label htmlFor="vip-email" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Your Email Address
                    </label>
                    <input
                      id="vip-email"
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Join Early-Bird Waitlist</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
