/**
 * SNUGFIT AMAZON HOME PAGE
 * 1. Amazon Hero carousel with the 4 iconic department quad-cards
 * 2. Amazon Lightning Deals row with countdown timer & claim progress
 * 3. Amazon Product Grid (departments, search results, filters, coupons)
 * 4. "Frequently repurchased in Home & Kitchen" recommendations row
 * 5. Amazon Verified Customer Reviews with review ratings & helpful votes
 */

import React, { useState, useEffect } from 'react';
import {
  Star,
  ChevronRight,
  Sparkles,
  Clock,
  Check,
} from 'lucide-react';
import { AmazonHero } from '../components/landing/AmazonHero';
import { ProductGrid } from '../components/landing/ProductGrid';
import { Product } from '../types';
import { ROOMS, RoomId, friendlyName, amazonMetaFor } from '../lib/storefront';
import { SEED_PRODUCTS } from '../db/seed';
import { getProductDisplayImage } from '../lib/productImages';
import { useCartStore } from '../store/useCartStore';

interface HomePageProps {
  onNavigateToCustomizer: () => void;
  onCustomizeProduct: (product: Product) => void;
  onOpenDeskPlanner?: () => void;
  searchQuery: string;
  activeRoom: RoomId;
  onSelectRoom: (room: RoomId) => void;
}

const AMAZON_REVIEWS = [
  {
    name: 'Jessica Miller',
    badge: 'Verified Purchase',
    date: 'Reviewed in the United States on October 18, 2026',
    variation: 'Color: Matte Obsidian Black | Size: IKEA Alex Wide (Custom)',
    title: 'Finally an organizer that fits with literally ZERO gap!',
    text: 'I have tried 4 different generic organizer sets from big box stores and they always slide back and forth every time you open the drawer. I put my exact dimensions into the 3D tool, ordered, and four days later this dropped right in like a glove. The matte biopolymer feels like velvet stone. Absolutely worth every penny.',
    helpful: 142,
  },
  {
    name: 'Daniel Ramirez',
    badge: 'Verified Purchase',
    date: 'Reviewed in the United States on October 12, 2026',
    variation: 'Color: Warm Oat & Stone | Style: Barista Espresso Valet',
    title: 'Elevated our whole morning espresso routine',
    text: 'The portafilter and WDT tool recess are engineered perfectly. Water beads right off and my countertop looks like a specialty café instead of a messy science lab. High quality, heavy solid feel, no cheap plastic clatter.',
    helpful: 89,
  },
  {
    name: 'Priya Sharma',
    badge: 'Verified Purchase',
    date: 'Reviewed in the United States on October 5, 2026',
    variation: 'Color: Terracotta Clay | Style: Skincare & Beauty Vanity Matrix',
    title: 'Saved my bathroom sanity. Ordered two more for my sisters.',
    text: 'Holds my tall serum bottles, lipsticks, and brushes upright without toppling over. Super easy to wipe clean. The shipping was surprisingly fast for a custom piece. 10/10.',
    helpful: 63,
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToCustomizer,
  onCustomizeProduct,
  searchQuery,
  activeRoom,
  onSelectRoom,
}) => {
  // Lightning deal countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 18, seconds: 42 });
  const [addedDealId, setAddedDealId] = useState<string | null>(null);
  const { addStandardItem } = useCartStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 30, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToShop = () => {
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  const lightningDealProducts = SEED_PRODUCTS.slice(0, 6);

  const handleQuickAddDeal = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    addStandardItem(p, 1);
    setAddedDealId(p.id);
    setTimeout(() => setAddedDealId(null), 1800);
  };

  return (
    <div className="bg-[#e3e6e6] min-h-screen font-sans">
      {/* 1. AMAZON CAROUSEL HERO + 4 OVERLAID QUAD-CARDS */}
      <AmazonHero
        onSelectRoom={(room) => {
          onSelectRoom(room);
          setTimeout(scrollToShop, 50);
        }}
        onExploreCatalog={scrollToShop}
        onLaunchCustomizer={onNavigateToCustomizer}
      />

      {/* 2. TODAY'S LIGHTNING DEALS HORIZONTAL STRIP */}
      <section className="max-w-[1520px] mx-auto px-3 sm:px-6 my-5">
        <div className="bg-white p-4 sm:p-5 rounded-sm border border-[#d5d9d9] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#e7e7e7] gap-2">
            <div className="flex items-center gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#0f1111] flex items-center gap-2">
                <span>Today's Deals</span>
                <span className="text-[#cc0c39] font-normal text-sm sm:text-base">| Lightning Deals</span>
              </h2>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#cc0c39] text-white text-xs font-bold tracking-tight">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  Ends in {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectRoom('deals');
                scrollToShop();
              }}
              className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline font-semibold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>See all deals</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Deals Carousel Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 pt-4">
            {lightningDealProducts.map((p, idx) => {
              const meta = amazonMetaFor(p);
              const img = getProductDisplayImage(p.id, p.images[0]);
              const percentClaimed = 62 + ((idx * 7) % 28);
              const isAdded = addedDealId === p.id;

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    if (p.type === 'custom_3d') {
                      onCustomizeProduct(p);
                    } else {
                      scrollToShop();
                    }
                  }}
                  className="group bg-white p-2.5 rounded-sm border border-[#f0f0f0] hover:border-[#d5d9d9] hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-square w-full flex items-center justify-center bg-white overflow-hidden p-2">
                    <img
                      src={img}
                      alt={friendlyName(p)}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-1 left-1 bg-[#cc0c39] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-xs">
                      {meta.discountPercent ? `-${meta.discountPercent}% off` : 'Up to 25% off'}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col flex-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[#cc0c39] text-xs font-bold bg-[#cc0c39]/10 px-1 py-0.5 rounded-xs">
                        Deal
                      </span>
                      <span className="text-sm font-bold text-[#0f1111]">
                        ${p.basePrice.toFixed(2)}
                      </span>
                    </div>

                    <h3 className="text-xs text-[#0f1111] group-hover:text-[#c7511f] line-clamp-1 mt-1 leading-snug">
                      {friendlyName(p)}
                    </h3>

                    {/* Claimed progress bar */}
                    <div className="mt-2 space-y-1">
                      <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#c45500] h-full rounded-full"
                          style={{ width: `${percentClaimed}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-[#565959]">
                        {percentClaimed}% claimed
                      </div>
                    </div>

                    {/* Quick Button */}
                    <div className="mt-2 pt-1">
                      {p.type === 'custom_3d' ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCustomizeProduct(p);
                          }}
                          className="w-full py-1 text-[11px] font-bold rounded-full bg-[#ffa41c] hover:bg-[#fa8900] text-zinc-950 border border-[#ff8f00] shadow-xs cursor-pointer"
                        >
                          Customize
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleQuickAddDeal(e, p)}
                          className={`w-full py-1 text-[11px] font-bold rounded-full shadow-xs flex items-center justify-center gap-1 transition cursor-pointer ${
                            isAdded
                              ? 'bg-[#007600] text-white'
                              : 'bg-[#ffd814] hover:bg-[#f7ca00] text-zinc-950 border border-[#fcd200]'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3 h-3" /> Added
                            </>
                          ) : (
                            'Add to Cart'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. MAIN AMAZON SEARCH & PRODUCT CATALOG */}
      <ProductGrid
        onCustomizeProduct={onCustomizeProduct}
        searchQuery={searchQuery}
        activeRoom={activeRoom}
        onSelectRoom={onSelectRoom}
      />

      {/* 4. MADE-TO-MEASURE 3D WORKSHOP PROMISE (Amazon A+ Content Style) */}
      <section className="max-w-[1520px] mx-auto px-3 sm:px-6 my-6">
        <div className="bg-white border border-[#d5d9d9] rounded-sm p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#e7e7e7]">
            <div className="max-w-2xl">
              <span className="text-xs font-bold text-[#c45500] uppercase tracking-wider">
                SnugFit Precision Crafting
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1111] mt-1">
                Custom Made to Measure for Your Exact Drawers & Counters
              </h2>
              <p className="text-sm text-[#565959] mt-2 leading-relaxed">
                No two drawers are identical. Standard store-bought organizers leave sliding gaps,
                rattling cutlery, and wasted space. We craft bespoke modular organizer grids to your
                exact millimeters in Boise, Idaho, and ship directly to your door in 48 hours.
              </p>
            </div>

            <button
              type="button"
              onClick={onNavigateToCustomizer}
              className="h-11 px-6 rounded-md bg-[#ffa41c] hover:bg-[#fa8900] text-zinc-950 font-bold text-sm shadow-xs border border-[#ff8f00] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Custom 3D Studio</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-sm text-[#0f1111]">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#fef8f2] text-[#c45500] font-bold flex items-center justify-center shrink-0 border border-[#fbd8b5]">
                1
              </div>
              <div>
                <h3 className="font-bold">Measure in Seconds</h3>
                <p className="text-xs text-[#565959] mt-1 leading-relaxed">
                  Enter your drawer dimensions with a tape measure or select an IKEA drawer preset.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#fef8f2] text-[#c45500] font-bold flex items-center justify-center shrink-0 border border-[#fbd8b5]">
                2
              </div>
              <div>
                <h3 className="font-bold">Live 3D Customizer</h3>
                <p className="text-xs text-[#565959] mt-1 leading-relaxed">
                  Add dividers, pick your velvet-matte finish, and inspect the exact fit in real-time 3D.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#fef8f2] text-[#c45500] font-bold flex items-center justify-center shrink-0 border border-[#fbd8b5]">
                3
              </div>
              <div>
                <h3 className="font-bold">100% Fit Guarantee</h3>
                <p className="text-xs text-[#565959] mt-1 leading-relaxed">
                  Ships in 48 hours. If it does not slide in snugly, we remake it free or refund 100%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AMAZON VERIFIED CUSTOMER REVIEWS */}
      <section className="max-w-[1520px] mx-auto px-3 sm:px-6 mb-12">
        <div className="bg-white border border-[#d5d9d9] rounded-sm p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-4 border-b border-[#e7e7e7] gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1111]">
                Top reviews from the United States
              </h2>
              <div className="flex items-center gap-2 mt-1 text-xs text-[#565959]">
                <div className="flex items-center text-[#de7921]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-[#de7921] text-[#de7921]" />
                  ))}
                </div>
                <span className="font-bold text-[#0f1111]">4.9 out of 5 stars</span>
                <span>•</span>
                <span>4,180 global ratings</span>
              </div>
            </div>

            <button
              type="button"
              onClick={scrollToShop}
              className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline font-semibold"
            >
              See all 4,180 customer reviews
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {AMAZON_REVIEWS.map((r, i) => (
              <div key={i} className="flex flex-col justify-between bg-white space-y-3">
                <div className="space-y-2">
                  {/* Reviewer Profile */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 text-zinc-700 font-bold flex items-center justify-center text-xs">
                      {r.name.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold text-[#0f1111]">{r.name}</span>
                  </div>

                  {/* Stars + Title */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-[#de7921]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-[#de7921] text-[#de7921]" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#0f1111] leading-tight">
                      {r.title}
                    </span>
                  </div>

                  {/* Date & Verified Badge */}
                  <div className="text-[11px] text-[#565959]">
                    {r.date}
                  </div>
                  <div className="text-[11px] flex items-center gap-1.5">
                    <span className="text-[#c45500] font-bold">{r.badge}</span>
                    <span className="text-[#565959]">•</span>
                    <span className="text-[#565959]">{r.variation}</span>
                  </div>

                  {/* Review Body */}
                  <p className="text-xs text-[#0f1111] leading-relaxed pt-1">
                    {r.text}
                  </p>
                </div>

                {/* Helpful Vote */}
                <div className="pt-2 text-[11px] text-[#565959] flex items-center gap-3">
                  <span>{r.helpful} people found this helpful</span>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-sm border border-[#d5d9d9] hover:bg-[#f0f2f2] text-xs text-[#0f1111] font-medium transition cursor-pointer"
                  >
                    Helpful
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export { ROOMS };
