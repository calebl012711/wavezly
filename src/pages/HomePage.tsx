/**
 * WAVEZLY AMAZON HOME PAGE
 * 1. Split-Visual Amazon Hero Carousel + 8 Overlaid Merchandising Quad-Cards + 10-Dept Medallion Strip
 * 2. Today's Lightning Deals Horizontal Strip (with photorealistic imagery & countdown timer)
 * 3. Customers' Most-Loved 3D Prints Bestseller Shelf
 * 4. Main Amazon Search & Product Catalog (with Left Refinement Sidebar)
 * 5. Interactive Room-by-Room Custom 3D Fit Explorer & A+ Workshop Promise
 * 6. Wavezly Verified Customer Reviews
 */

import React, { useState, useEffect } from 'react';
import {
  Star,
  Sparkles,
  Clock,
  Check,
  Award,
  Ruler,
  ShoppingCart,
  ArrowRight,
  Flame,
  Quote,
  ShieldCheck,
  Layers,
  Sliders,
} from 'lucide-react';
import { AmazonHero } from '../components/landing/AmazonHero';
import { ProductGrid } from '../components/landing/ProductGrid';
import { Product } from '../types';
import { ROOMS, RoomId, amazonMetaFor, friendlyName } from '../lib/storefront';
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

// 6 Iconic General 3D Printing Lightning Deals with Photorealistic Studio Imagery
const LIGHTNING_DEAL_IDS = [
  'prod_crystal_gem_dragon',
  'prod_impossible_cone',
  'prod_voronoi_mushroom_lamp',
  'prod_car_cupholder_expander',
  'prod_gridfinity_master_set',
  'prod_pourover_coffee_tray',
];

// 4 Customers' Most-Loved Bestsellers with Real Shopper Quotes & Verified Profiles
const MOST_LOVED_ITEMS = [
  {
    id: 'prod_axolotl_fidget',
    quote: 'My kids and coworkers cannot put the pastel coral axolotl down—the joints move like silk!',
    author: 'Hannah K.',
    role: 'Product Designer',
    location: 'Austin, TX',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    soldTag: '3.4K+ crafted',
  },
  {
    id: 'prod_drawer_matrix',
    quote: 'Entered 412mm × 520mm for my kitchen drawer and it dropped in with zero gap. Pure magic.',
    author: 'Marcus T.',
    role: 'Architect',
    location: 'Seattle, WA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    soldTag: '4.1K+ custom fits',
  },
  {
    id: 'prod_controller_dock',
    quote: 'Holds both my PS5 DualSense and Xbox Elite controllers plus my Apple TV remote cleanly.',
    author: 'Devon R.',
    role: 'Creative Director',
    location: 'Brooklyn, NY',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    soldTag: '1.9K+ crafted',
  },
  {
    id: 'prod_vanity_matrix',
    quote: 'Finally a bathroom vanity organizer that actually fits tall serum dropper bottles upright.',
    author: 'Priya S.',
    role: 'Interior Stylist',
    location: 'San Francisco, CA',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
    soldTag: '2.2K+ crafted',
  },
];

// Interactive Room-by-Room Custom 3D Preset Explorer
const CUSTOM_SPACE_PRESETS = [
  {
    id: 'kitchen',
    tabLabel: 'Kitchen Cutlery',
    label: 'Kitchen Cutlery & Utensil Drawer',
    dimensions: '420 × 510 × 55 mm',
    material: 'Food-Safe Matte Oat PLA+',
    turnaround: 'Ships in 48 Hours',
    price: '$42.00',
    image: '/assets/products/drawer-matrix-real.jpg',
    description: 'Precision-measured matrix organizer tailored flush to your cutlery drawer cavity without rattle or wasted border space.',
    bullets: [
      'Zero sliding gap from left wall to right wall',
      'Curved finger-scoop wells for knives, forks, and spatulas',
      'Washable hydrophobic biopolymer surface',
    ],
  },
  {
    id: 'ikea',
    tabLabel: 'IKEA Alex Desk',
    label: 'IKEA Alex Desk & Office Drawer',
    dimensions: '292 × 520 × 50 mm',
    material: 'Matte Obsidian Carbon Biopolymer',
    turnaround: 'Ships in 48 Hours',
    price: '$39.00',
    image: '/assets/products/valet-pro-real.jpg',
    description: 'Pre-calibrated drop-in modular organizer engineered specifically for iconic IKEA Alex shallow and deep drawer units.',
    bullets: [
      'Pre-calibrated 1-click preset for IKEA Alex Wide & Narrow units',
      'Dedicated bays for SD cards, AirPods, pens, and hard drives',
      'Optional acoustic liquid-resin sound-dampening inlay',
    ],
  },
  {
    id: 'car',
    tabLabel: 'Car Console & 40oz Cup',
    label: 'Car Center Console & 40oz Cup Adapter',
    dimensions: '195 × 240 × 65 mm',
    material: 'High-Temp UV Carbon PETG (Up to 85°C)',
    turnaround: 'Ships in 48 Hours',
    price: '$29.99',
    image: '/assets/products/car-cup-expander-real.jpg',
    description: 'Custom vehicle console drop-in with dual 40oz oversized tumbler holder that never tilts on sharp turns or warps in heat.',
    bullets: [
      'Engineered from high-temp PETG—never warps in hot summer cabins',
      'Custom coin, key fob, sunglass, and charging cable pass-through',
      'Available for Tesla, Ford F-150, Tacoma, RAV4, or custom mm',
    ],
  },
  {
    id: 'workshop',
    tabLabel: 'Workshop Gridfinity',
    label: 'Garage Tool Chest & Gridfinity Matrix',
    dimensions: '560 × 400 × 45 mm (42mm Grid)',
    material: 'Impact-Resistant Slate & Safety Orange PETG',
    turnaround: 'Ships in 48 Hours',
    price: '$39.99',
    image: '/assets/products/gridfinity-kit-real.jpg',
    description: 'Heavy-duty modular baseplate and bin system fully interoperable with the 42mm Gridfinity open standard.',
    bullets: [
      '100% compatible with open-source 42mm Gridfinity magnetic baseplates',
      'Oil and solvent resistant industrial polymer construction',
      'Built-in label ledges for metric/SAE fasteners and sockets',
    ],
  },
];

const AMAZON_REVIEWS = [
  {
    name: 'Jessica Miller',
    badge: 'Verified Purchase',
    date: 'Reviewed in the United States on October 18, 2026',
    variation: 'Color: Matte Obsidian Black | Style: Custom Drawer Matrix',
    title: "Wavezly delivered the exact snug fit I couldn't find anywhere else!",
    text: "I have tried 4 different generic organizer sets from big box stores and they always slide back and forth every time you open the drawer. I put my exact dimensions into Wavezly's 3D tool, ordered, and four days later this dropped right in like a glove. The matte biopolymer feels like velvet stone. Fast delivery and zero plastic odor—worth every penny.",
    helpful: 142,
  },
  {
    name: 'Daniel Ramirez',
    badge: 'Verified Purchase',
    date: 'Reviewed in the United States on October 12, 2026',
    variation: 'Color: Warm Oat & Stone | Style: Barista Espresso Station',
    title: 'Super fast delivery and flawless biopolymer craftsmanship',
    text: 'The portafilter and WDT tool recess are engineered perfectly to the millimeter. Water beads right off and my countertop looks like a specialty café instead of a messy science lab. High-density biopolymer feels heavy and solid with a snug fit—no cheap plastic clatter. Wavezly shipped in under 48 hours.',
    helpful: 98,
  },
  {
    name: 'Marcus Vance',
    badge: 'Verified Purchase',
    date: 'Reviewed in the United States on October 8, 2026',
    variation: 'Color: Silk Dual-Tone Emerald | Style: Articulated Crystal Gem Dragon',
    title: 'The Amazon of 3D printing—unbeatable quality & packaging',
    text: "Ordered the crystal gem dragon, impossible spiral cone, and Voronoi mushroom lamp for my home office, plus a 40oz car cup expander. Every single piece fits with zero wobble. Wavezly's high-density biopolymers have zero visible seam defects and the articulated joints move like liquid silk.",
    helpful: 84,
  },
  {
    name: 'Priya Sharma',
    badge: 'Verified Purchase',
    date: 'Reviewed in the United States on October 5, 2026',
    variation: 'Color: Terracotta Matte | Style: Skincare & Beauty Vanity Matrix',
    title: 'Wavezly 100% Fit Guarantee is real. Saved my bathroom sanity.',
    text: 'Holds my tall serum bottles, lipsticks, and brushes upright without toppling over when opening the vanity drawer. Super easy to wipe clean. The shipping was surprisingly fast for a custom 3D piece (arrived in 3 days via Wavezly Direct). The biopolymer is silky smooth, stain resistant, and sturdy. 10/10.',
    helpful: 67,
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
  const [activeSpacePreset, setActiveSpacePreset] = useState<string>('kitchen');
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

  // Resolve Lightning Deal products from SEED_PRODUCTS
  const lightningDealProducts: Product[] = LIGHTNING_DEAL_IDS.map((id) =>
    SEED_PRODUCTS.find((p) => p.id === id)
  ).filter((p): p is Product => Boolean(p));

  // Resolve Most-Loved products from SEED_PRODUCTS
  const mostLovedProducts = MOST_LOVED_ITEMS.map((item) => {
    const product = SEED_PRODUCTS.find((p) => p.id === item.id);
    return product ? { ...item, product } : null;
  }).filter((x): x is NonNullable<typeof x> => Boolean(x));

  const currentPreset =
    CUSTOM_SPACE_PRESETS.find((s) => s.id === activeSpacePreset) || CUSTOM_SPACE_PRESETS[0];

  const handleQuickAddDeal = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    addStandardItem(p, 1);
    setAddedDealId(p.id);
    setTimeout(() => setAddedDealId(null), 1800);
  };

  return (
    <div className="bg-[#e3e6e6] min-h-screen font-sans">
      {/* 1. SPLIT-VISUAL AMAZON CAROUSEL HERO + 8 QUAD-CARDS + 10-DEPT STRIP */}
      <AmazonHero
        onSelectRoom={(room) => {
          onSelectRoom(room);
          setTimeout(scrollToShop, 50);
        }}
        onExploreCatalog={scrollToShop}
        onLaunchCustomizer={onNavigateToCustomizer}
      />

      {/* 2. CURATED DROPS & LIMITED RUNS (Warm Minimalist DTC Showcase) */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-6 my-6">
        <div className="bg-white rounded-2xl border border-orange-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 sm:p-7 relative overflow-hidden">
          {/* Subtle warm electric orange gradient accent line across top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B00] via-[#FF7A00] to-amber-400" />

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-semibold uppercase tracking-wider mb-2">
                <Flame className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Curated Drops & Limited Runs</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0F172A]">
                Small-Batch Precision Releases
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Limited edition biopolymer runs crafted on demand in the USA. Batch secures your allocation before production dies cycle.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Minimalist Countdown Timer with Clean Orange Badge */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50/80 border border-orange-200/70 text-xs shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span className="text-slate-600 font-medium hidden sm:inline">Drop Closes In:</span>
                <span className="font-mono font-bold text-[#FF6B00] tracking-wider text-xs sm:text-sm">
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectRoom('deals');
                  scrollToShop();
                }}
                className="text-xs font-bold text-[#FF6B00] hover:text-[#e05600] flex items-center gap-1 group transition cursor-pointer"
              >
                <span>View all drops</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </button>
            </div>
          </div>

          {/* Product Cards Grid with Studio Photography & Clean Progress Pill */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 pt-5">
            {lightningDealProducts.map((p, idx) => {
              const meta = amazonMetaFor(p);
              const img = getProductDisplayImage(p.id, p.images[0]);
              const percentClaimed = 64 + ((idx * 7) % 26);
              const isAdded = addedDealId === p.id;
              const name = friendlyName(p);

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
                  className="group bg-white rounded-xl border border-slate-100 hover:border-orange-300 hover:shadow-lg transition-all duration-300 p-3 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Studio Photography Container */}
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-50 mb-3">
                      <img
                        src={img}
                        alt={name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[#FF6B00] border border-orange-200/80 text-[10px] font-bold shadow-xs">
                        {meta.discountPercent ? `-${meta.discountPercent}%` : '-25%'}
                      </div>
                    </div>

                    {/* Price and Details */}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm sm:text-base font-extrabold text-[#0F172A]">
                        ${p.basePrice.toFixed(2)}
                      </span>
                      {meta.listPrice && (
                        <span className="text-[11px] text-slate-400 line-through">
                          ${meta.listPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xs font-semibold text-[#0F172A] group-hover:text-[#FF6B00] line-clamp-2 mt-1 leading-snug transition-colors">
                      {name}
                    </h3>

                    {/* Clean Progress Pill ("64% claimed") */}
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
                        <span className="font-semibold text-slate-700">{percentClaimed}% claimed</span>
                        <span className="text-[#FF7A00] font-bold text-[10px]">Batch #{idx + 12}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#FF6B00] to-[#FF7A00] h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentClaimed}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Action Button */}
                  <div className="mt-3 pt-2.5 border-t border-slate-50">
                    {p.type === 'custom_3d' ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCustomizeProduct(p);
                        }}
                        className="w-full py-1.5 sm:py-2 text-[11px] font-bold rounded-lg bg-orange-50 hover:bg-orange-100 text-[#FF6B00] border border-orange-200/80 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Ruler className="w-3.5 h-3.5" />
                        <span>Custom Size</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleQuickAddDeal(e, p)}
                        className={`w-full py-1.5 sm:py-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#0F172A] hover:bg-[#FF6B00] text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3 h-3" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CUSTOMERS' MOST-LOVED 3D PRINTS (Warm Minimalist DTC Editorial Showcase) */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-6 my-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#FF7A00] text-xs font-semibold uppercase tracking-wider mb-2">
                <Award className="w-3.5 h-3.5 text-[#FF7A00]" />
                <span>Editorial Showcase</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0F172A]">
                Customers' Most-Loved Editions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                4.9★ rated community staples with verified real-world reviews, aerospace biopolymers, and zero defects.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectRoom('trending_3d');
                scrollToShop();
              }}
              className="text-xs font-bold text-[#FF6B00] hover:text-[#e05600] flex items-center gap-1 group transition cursor-pointer self-start sm:self-auto"
            >
              <span>Explore top-rated favorites</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pt-5">
            {mostLovedProducts.map(({ id, quote, author, role, location, avatar, soldTag, product }) => {
              const img = getProductDisplayImage(product.id, product.images[0]);
              const isAdded = addedDealId === id;
              const name = friendlyName(product);

              return (
                <div
                  key={id}
                  className="group bg-white rounded-2xl border border-slate-100 hover:border-orange-200/90 hover:shadow-xl transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Buyer Profile & Verified Avatar */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={avatar}
                          alt={author}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-orange-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#0F172A] leading-tight truncate">
                            {author}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">
                            {role} • {location}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100 shrink-0">
                        <Check className="w-2.5 h-2.5" /> Verified
                      </span>
                    </div>

                    {/* Editorial Quote Bubble */}
                    <div className="relative mb-3.5 bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                      <Quote className="w-3.5 h-3.5 text-[#FF7A00]/50 mb-1" />
                      <p className="text-xs text-slate-700 italic leading-relaxed">
                        "{quote}"
                      </p>
                    </div>

                    {/* Product Presentation */}
                    <div className="flex gap-3 items-center mb-3">
                      <div className="relative w-18 h-18 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100 group-hover:border-orange-200 transition">
                        <img
                          src={img}
                          alt={name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-orange-50 text-[#FF6B00] text-[10px] font-bold mb-1">
                          {soldTag}
                        </span>
                        <h3 className="text-xs font-bold text-[#0F172A] group-hover:text-[#FF6B00] transition-colors truncate">
                          {name}
                        </h3>
                        {/* Rating Stars in Warm Amber-Orange */}
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex text-[#FF7A00]">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className="w-3 h-3 fill-[#FF7A00] text-[#FF7A00]" />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-[#0F172A]">4.9</span>
                          <span className="text-[10px] text-slate-400">• 100% Fit</span>
                        </div>
                        <div className="mt-1 text-sm font-extrabold text-[#0F172A]">
                          ${product.basePrice.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Cart Action */}
                  <div className="pt-2">
                    {product.type === 'custom_3d' ? (
                      <button
                        type="button"
                        onClick={() => onCustomizeProduct(product)}
                        className="w-full h-9 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF6B00] border border-orange-200/90 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Ruler className="w-3.5 h-3.5" />
                        <span>Custom Size This Item</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleQuickAddDeal(e, product)}
                        className={`w-full h-9 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#0F172A] hover:bg-[#FF6B00] text-white'
                        }`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>{isAdded ? 'Added to Cart' : '1-Click Add to Cart'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. MAIN AMAZON SEARCH & PRODUCT CATALOG */}
      <ProductGrid
        onCustomizeProduct={onCustomizeProduct}
        searchQuery={searchQuery}
        activeRoom={activeRoom}
        onSelectRoom={onSelectRoom}
      />

      {/* 5. INTERACTIVE ROOM-BY-ROOM CUSTOM 3D FIT EXPLORER (Warm Minimalist DTC Studio) */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 my-10 sm:my-14">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_30px_-4px_rgba(15,23,42,0.06)] p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          {/* Subtle Ambient Studio Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-100/40 via-amber-50/20 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-slate-100/50 to-transparent rounded-full blur-2xl pointer-events-none -ml-16 -mb-16" />

          {/* Section Header */}
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-100">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-[#FF6B00] text-xs font-bold tracking-wide uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Custom 3D Fit Studio • Sub-Millimeter Parametric Precision</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                Engineered to Fit Any Drawer, Console, or Workspace
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
                Mass-market bins leave sloppy dead spaces and rattle loose. Wavezly delivers bespoke 
                parametric inserts measured to your exact cavity—3D printed in California and delivered in 48 hours.
              </p>
            </div>

            <button
              type="button"
              onClick={onNavigateToCustomizer}
              className="group inline-flex items-center justify-center gap-2.5 h-12 px-7 rounded-2xl bg-[#FF6B00] hover:bg-[#FF7A00] text-white font-semibold text-sm shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200 cursor-pointer shrink-0"
            >
              <span>Launch Custom 3D Studio</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Clean Pill Tabs */}
          <div className="relative z-10 flex flex-wrap gap-2.5 pt-8 pb-6">
            {CUSTOM_SPACE_PRESETS.map((preset) => {
              const active = preset.id === activeSpacePreset;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setActiveSpacePreset(preset.id)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                    active
                      ? 'bg-[#0F172A] text-white shadow-sm ring-1 ring-slate-900'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/70 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${active ? 'bg-[#FF6B00]' : 'bg-slate-300'}`} />
                  <span>{preset.tabLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Showcase Panel */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 sm:p-8">
            {/* Visual Photography Column */}
            <div className="lg:col-span-6 relative group">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-sm relative">
                <img
                  src={currentPreset.image}
                  alt={currentPreset.label}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                />

                {/* Floating Dimension Overlay Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-md flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-[#FF6B00]" />
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">
                      Millimeter Spec
                    </span>
                    <span className="text-xs font-extrabold text-[#0F172A] leading-tight">
                      {currentPreset.dimensions}
                    </span>
                  </div>
                </div>

                {/* Material Pill Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-white text-xs flex items-center gap-2 shadow-lg">
                  <Layers className="w-3.5 h-3.5 text-[#FF7A00]" />
                  <span className="font-medium truncate">{currentPreset.material}</span>
                </div>
              </div>
            </div>

            {/* Spec & Guarantee Column */}
            <div className="lg:col-span-6 space-y-5">
              {/* 100% Fit Guarantee Badge */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#FF6B00] text-xs font-bold tracking-wide shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
                  <span>100% Fit Guarantee</span>
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Tolerance: <span className="text-[#0F172A] font-bold">±0.2mm precision</span>
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                  {currentPreset.label}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  {currentPreset.description}
                </p>
              </div>

              {/* Spec Metric Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                    Biopolymer
                  </span>
                  <span className="font-bold text-[#0F172A] block leading-tight">{currentPreset.material}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                    Production Speed
                  </span>
                  <span className="font-bold text-emerald-600 block leading-tight">{currentPreset.turnaround}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                    Starting Price
                  </span>
                  <span className="font-extrabold text-[#0F172A] text-base block leading-tight">{currentPreset.price}</span>
                </div>
              </div>

              {/* Feature Bullets */}
              <ul className="space-y-2 pt-1">
                {currentPreset.bullets.map((b, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-orange-100 text-[#FF6B00] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Action Row */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                  type="button"
                  onClick={onNavigateToCustomizer}
                  className="group inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-all duration-150 shadow-sm cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#FF7A00]" />
                  <span>Customize Dimensions</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free remake or refund if your print doesn't fit flush</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. AMAZON VERIFIED CUSTOMER REVIEWS */}
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
              className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline font-semibold cursor-pointer"
            >
              See all 4,180 customer reviews
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
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
                  <div className="text-[11px] text-[#565959]">{r.date}</div>
                  <div className="text-[11px] flex items-center gap-1.5">
                    <span className="text-[#c45500] font-bold">{r.badge}</span>
                    <span className="text-[#565959]">•</span>
                    <span className="text-[#565959]">{r.variation}</span>
                  </div>

                  {/* Review Body */}
                  <p className="text-xs text-[#0f1111] leading-relaxed pt-1">{r.text}</p>
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
