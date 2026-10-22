/**
 * FORMGRID CURATED CREATOR WORKSPACES & INTERACTIVE HOTSPOT GALLERY
 * Field-tested desk setups across Tokyo, Berlin, San Francisco, and Zurich.
 * Features tactile hotspot radar pins with real-time product cart dispatch and 3D studio customization.
 */

import React, { useState, useMemo } from 'react';
import { Product } from '../../types';
import { SEED_PRODUCTS } from '../../db/seed';
import { useCartStore } from '../../store/useCartStore';
import { useCustomizerStore } from '../../store/useCustomizerStore';
import { ProductDetailModal } from '../pdp/ProductDetailModal';
import { playClickSound } from '../../lib/soundEffects';
import {
  MapPin,
  Sparkles,
  Layers,
  Cpu,
  Truck,
  Sliders,
  Plus,
  Check,
  Eye,
  ShoppingBag,
  X,
  CornerDownRight,
} from 'lucide-react';

export interface HotspotPin {
  id: string;
  productId: string;
  xPercent: number; // 0 - 100% horizontal coordinate
  yPercent: number; // 0 - 100% vertical coordinate
  curatorNote: string;
  usageContext: string;
}

export interface CreatorWorkspace {
  id: string;
  slug: string;
  title: string;
  city: string;
  country: string;
  flag: string;
  creatorName: string;
  creatorHandle: string;
  creatorRole: string;
  image: string;
  quote: string;
  deskSpecs: {
    surface: string;
    dimensions: string;
    primaryAesthetic: string;
    telemetryMetric: string;
    telemetryLabel: string;
  };
  hotspots: HotspotPin[];
}

const CREATOR_WORKSPACES: CreatorWorkspace[] = [
  {
    id: "ws_kitchen_coffee",
    slug: "modern-kitchen-and-coffee-bar",
    title: "The Modern Kitchen & Coffee Bar",
    city: "Seattle, WA",
    country: "United States",
    flag: "☕",
    creatorName: "Claire Laurent",
    creatorHandle: "@claire_coffeelab",
    creatorRole: "Coffee Specialist & Culinary Stylist",
    image: "/assets/products/pourover-coffee-tray-real.jpg",
    quote: "Having dedicated, custom-sized slots for 58mm tampers, dosing cups, and basalt coasters transformed my morning routine. Clean counters bring genuine calm.",
    deskSpecs: {
      surface: "Natural White Oak & Quartz Counter",
      dimensions: "2200 × 700 mm",
      primaryAesthetic: "Nordic Warm Minimalist / Specialty Cafe",
      telemetryMetric: "Zero Countertop Clutter",
      telemetryLabel: "Everything in its Dedicated Home",
    },
    hotspots: [
      {
        id: "hs_kitchen_valet",
        productId: "prod_pourover_coffee_tray",
        xPercent: 42,
        yPercent: 62,
        usageContext: "Barista Espresso & Tamper Valet",
        curatorNote: "Houses 58mm portafilter, WDT needle tool, and precision distributor with heat-resistant composite.",
      },
      {
        id: "hs_kitchen_coasters",
        productId: "prod_desk_coasters",
        xPercent: 78,
        yPercent: 54,
        usageContext: "Solid Basalt & Cork Coaster Set",
        curatorNote: "Volcanic basalt stone absorbs condensation while Portuguese cork protects natural timber surfaces.",
      },
      {
        id: "hs_kitchen_vacuum",
        productId: "prod_desk_vacuum",
        xPercent: 20,
        yPercent: 48,
        usageContext: "Micro-Suction Wireless Handheld Vacuum",
        curatorNote: "High-RPM micro-suction glides across countertops and drawers to whisk away stray espresso grounds and crumbs.",
      },
    ],
  },
  {
    id: "ws_vanity_skincare",
    slug: "minimalist-vanity-skincare-sanctuary",
    title: "Minimalist Vanity & Skincare Sanctuary",
    city: "Paris",
    country: "France",
    flag: "💄",
    creatorName: "Camille Dubois",
    creatorHandle: "@camille_beauty",
    creatorRole: "Cosmetic & Dermatology Stylist",
    image: "/assets/products/vanity-matrix-real.jpg",
    quote: "Zero messy drawers. The custom vanity grid holds all my tall serums, perfume bottles, and makeup brushes without a single millimeter of wasted space.",
    deskSpecs: {
      surface: "Polished Calacatta Gold Marble",
      dimensions: "1400 × 600 mm",
      primaryAesthetic: "Parisian Clean Luxury / Soft Light",
      telemetryMetric: "100% Spill-Proof",
      telemetryLabel: "Water-Repellent Composite Finish",
    },
    hotspots: [
      {
        id: "hs_vanity_matrix",
        productId: "prod_vanity_matrix",
        xPercent: 48,
        yPercent: 58,
        usageContext: "Beauty & Skincare Vanity Grid",
        curatorNote: "Tall divided wells cradle glass droppers and cosmetic tubes upright with zero tip-overs.",
      },
      {
        id: "hs_vanity_caddy",
        productId: "prod_watch_jewelry_caddy",
        xPercent: 82,
        yPercent: 46,
        usageContext: "Ring Cushion & Jewelry Valet",
        curatorNote: "Soft-touch cushion slits protect signet rings, gold bands, and earrings from scratching.",
      },
    ],
  },
  {
    id: "ws_bedside_nightstand",
    slug: "serene-bedside-nightstand-valet",
    title: "Serene Bedside & Everyday Carry",
    city: "Kyoto",
    country: "Japan",
    flag: "🌙",
    creatorName: "Kenji Sato",
    creatorHandle: "@kenji_minimal",
    creatorRole: "Architect & Watch Collector",
    image: "/assets/products/watch-jewelry-caddy-real.jpg",
    quote: "Dropping my watch, signet rings, and glasses into dedicated soft-inlay compartments when I come home brings instant peace of mind. No metal clatter.",
    deskSpecs: {
      surface: "Solid Japanese Hinoki Cypress",
      dimensions: "550 × 450 mm",
      primaryAesthetic: "Zen Architectural / Quiet Bedside",
      telemetryMetric: "Whisper-Quiet",
      telemetryLabel: "Soft Base Inlay Cushions Every Drop",
    },
    hotspots: [
      {
        id: "hs_bedside_caddy",
        productId: "prod_watch_jewelry_caddy",
        xPercent: 46,
        yPercent: 54,
        usageContext: "Timepiece & Ring Cushion Caddy",
        curatorNote: "Contoured saddle cradles automatic wristwatches while soft bays hold rings and cuff links.",
      },
      {
        id: "hs_bedside_valet",
        productId: "prod_valet_pro",
        xPercent: 78,
        yPercent: 62,
        usageContext: "Everyday Carry Valet (Liquid Resin Inlay)",
        curatorNote: "Dedicated drop zone for MagSafe wallet, car keys, and reading glasses next to the bed.",
      },
    ],
  },
  {
    id: "ws_curated_workspace",
    slug: "curated-workspace-creative-studio",
    title: "Curated Workspace & Design Studio",
    city: "San Francisco, CA",
    country: "United States",
    flag: "🖥️",
    creatorName: "Marcus Vance",
    creatorHandle: "@vance_spaces",
    creatorRole: "Product Designer & Minimalist",
    image: "/assets/products/valet-pro-real.jpg",
    quote: "A calm environment creates a clear mind. The custom-fit drawer matrix eliminated loose clutter and gave every tool its dedicated home.",
    deskSpecs: {
      surface: "American Black Walnut Standing Desk",
      dimensions: "1800 × 800 mm",
      primaryAesthetic: "Functionalist Warm Modern / Grovemade Taste",
      telemetryMetric: "Zero Desk Clutter",
      telemetryLabel: "Every Essential at Your Fingertips",
    },
    hotspots: [
      {
        id: "hs_sf_matrix",
        productId: "prod_drawer_matrix",
        xPercent: 50,
        yPercent: 55,
        usageContext: "Modular Drawer Organizer Matrix",
        curatorNote: "Sized to the millimeter to fill the entire drawer cavity with zero shifting.",
      },
      {
        id: "hs_sf_mat",
        productId: "prod_felt_mat",
        xPercent: 48,
        yPercent: 70,
        usageContext: "Dual-Sided Eco-Felt Desk Mat",
        curatorNote: "Merino wool blend provides a soft, warm resting surface for laptops and wrists.",
      },
      {
        id: "hs_sf_screenbar",
        productId: "prod_screenbar",
        xPercent: 50,
        yPercent: 18,
        usageContext: "Glare-Free LED ScreenBar",
        curatorNote: "Asymmetric optical cutoff illuminates the workspace without screen glare or eye strain.",
      },
    ],
  },
];

interface DeskSetupGalleryProps {
  onCustomizeProduct: (product: Product) => void;
  onNavigateToCustomizer?: () => void;
}

export const DeskSetupGallery: React.FC<DeskSetupGalleryProps> = ({
  onCustomizeProduct,
  onNavigateToCustomizer,
}) => {
  const [activeWorkspaceIdx, setActiveWorkspaceIdx] = useState<number>(0);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [bundleSuccess, setBundleSuccess] = useState<boolean>(false);

  const { addStandardItem, openCart } = useCartStore();
  const { setProduct } = useCustomizerStore();

  const activeWorkspace = CREATOR_WORKSPACES[activeWorkspaceIdx];

  // Resolve products map for instant lookup
  const productsMap = useMemo(() => {
    const map = new Map<string, Product>();
    SEED_PRODUCTS.forEach((p) => map.set(p.id, p));
    return map;
  }, []);

  // Filter products featured in the current workspace
  const workspaceProducts = useMemo(() => {
    return activeWorkspace.hotspots
      .map((hs) => {
        const product = productsMap.get(hs.productId);
        return product ? { hotspot: hs, product } : null;
      })
      .filter((item): item is { hotspot: HotspotPin; product: Product } => item !== null);
  }, [activeWorkspace, productsMap]);

  // Handle workspace tab switch
  const handleSelectWorkspace = (index: number) => {
    playClickSound('tab');
    setActiveWorkspaceIdx(index);
    setActiveHotspotId(null);
  };

  // Toggle or select a hotspot pin
  const handleHotspotClick = (hotspotId: string) => {
    playClickSound('snap');
    setActiveHotspotId((prev) => (prev === hotspotId ? null : hotspotId));
  };

  // Handle immediate customization
  const handleCustomize = (product: Product) => {
    playClickSound('snap');
    setProduct(product);
    onCustomizeProduct(product);
    if (onNavigateToCustomizer) {
      onNavigateToCustomizer();
    }
  };

  // Handle immediate cart add for dropship / fast-ship item
  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    playClickSound('success');
    addStandardItem(product, 1);
    setRecentlyAddedId(product.id);
    setTimeout(() => setRecentlyAddedId(null), 2500);
  };

  // Handle "Bundle This Entire Setup" action
  const handleBundleEntireSetup = () => {
    playClickSound('cart');
    let addedCount = 0;

    // Add all in-stock fast-ship items in this setup
    workspaceProducts.forEach(({ product }) => {
      if (product.type === 'dropship') {
        addStandardItem(product, 1);
        addedCount++;
      }
    });

    setBundleSuccess(true);
    setTimeout(() => setBundleSuccess(false), 3000);
    openCart();
  };

  // Active highlighted hotspot object
  const activeHotspot = activeWorkspace.hotspots.find((h) => h.id === activeHotspotId);
  const activeHotspotProduct = activeHotspot ? productsMap.get(activeHotspot.productId) : null;

  return (
    <section
      id="creator-gallery-section"
      className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-surface-border font-mono"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-surface-border gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-signal-orange uppercase tracking-wider mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>COMMUNITY & CREATOR SPACES // LIVE FIELD STUDIES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white font-sans">
            Curated Spaces in Real Homes
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-3xl font-sans">
            Explore how customers style custom-fit organizers across modern kitchens, bathroom vanities, nightstands, and creative studios. Tap any pin to see the product.
          </p>
        </div>

        {/* Global Batch Action */}
        <button
          type="button"
          onClick={handleBundleEntireSetup}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition border ${
            bundleSuccess
              ? 'bg-signal-cyan/20 text-signal-cyan border-signal-cyan'
              : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-surface dark:hover:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-300 dark:border-surface-border'
          }`}
        >
          {bundleSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-signal-cyan" />
              <span>SETUP BUNDLE DISPATCHED TO CART</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5 text-signal-orange" />
              <span>GET THIS ROOM SETUP</span>
            </>
          )}
        </button>
      </div>

      {/* Creator Navigation Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-8">
        {CREATOR_WORKSPACES.map((ws, idx) => {
          const isActive = idx === activeWorkspaceIdx;
          return (
            <button
              key={ws.id}
              type="button"
              onClick={() => handleSelectWorkspace(idx)}
              className={`p-3.5 text-left rounded-xl border transition relative flex flex-col justify-between ${
                isActive
                  ? 'bg-white dark:bg-surface border-signal-orange text-zinc-950 dark:text-white shadow-tactile ring-1 ring-signal-orange/40'
                  : 'bg-white/80 dark:bg-surface/50 border-zinc-200 dark:border-surface-border text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-base">{ws.flag}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase tracking-wider ${
                    isActive
                      ? 'bg-signal-orange/15 text-signal-orange border border-signal-orange/30'
                      : 'bg-zinc-100 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  SET-0{idx + 1}
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-zinc-950 dark:text-white font-sans truncate mb-0.5">
                  {ws.title}
                </div>
                <div className="flex items-center space-x-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  <MapPin className="w-3 h-3 text-signal-orange shrink-0" />
                  <span className="truncate">
                    {ws.city}, {ws.country}
                  </span>
                </div>
              </div>

              {isActive && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-signal-orange rounded-full shadow-[0_0_8px_#ff4800]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage: Image Canvas & Technical HUD Overlay */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center Stage: Interactive Workspace Photo (7 Columns) */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          <div className="relative w-full rounded-2xl overflow-hidden border border-surface-border bg-surface shadow-2xl group select-none">
            {/* Top Telemetry Header Bar */}
            <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4 py-2.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
              <div className="flex items-center space-x-2 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-signal-orange animate-ping" />
                <span className="text-precision-white font-bold tracking-wider">
                  {activeWorkspace.title.toUpperCase()}
                </span>
                <span className="text-zinc-500">|</span>
                <span className="text-zinc-400">{activeWorkspace.city}</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] text-zinc-400">
                <span className="px-2 py-0.5 rounded bg-black/60 border border-zinc-800 text-signal-cyan">
                  {activeWorkspace.hotspots.length} SNUGFIT GOODS IN SETUP
                </span>
              </div>
            </div>

            {/* High-Resolution Workspace Photography */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-zinc-950">
              <img
                src={activeWorkspace.image}
                alt={`${activeWorkspace.title} workspace in ${activeWorkspace.city}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                loading="lazy"
              />

              {/* Grid Scanline Vignette Overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              />

              {/* Tactical Corner Accents */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-signal-orange/60 pointer-events-none" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-signal-orange/60 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-signal-orange/60 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-signal-orange/60 pointer-events-none" />

              {/* Hotspot Pins Anchored Directly to Workspace Coordinates */}
              {activeWorkspace.hotspots.map((hs, pinIdx) => {
                const product = productsMap.get(hs.productId);
                const isSelected = hs.id === activeHotspotId;
                if (!product) return null;

                return (
                  <div
                    key={hs.id}
                    style={{ left: `${hs.xPercent}%`, top: `${hs.yPercent}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                  >
                    {/* Hotspot Radar Button */}
                    <button
                      type="button"
                      onClick={() => handleHotspotClick(hs.id)}
                      aria-label={`Inspect ${product.title} in setup`}
                      className={`relative flex items-center justify-center transition-transform ${
                        isSelected ? 'scale-125' : 'hover:scale-115'
                      }`}
                    >
                      {/* Radiating radar pulse rings */}
                      <span
                        className={`absolute w-8 h-8 rounded-full opacity-60 animate-ping pointer-events-none ${
                          isSelected
                            ? 'bg-signal-orange'
                            : product.type === 'custom_3d'
                            ? 'bg-signal-orange'
                            : 'bg-signal-cyan'
                        }`}
                      />

                      {/* Halo ring */}
                      <span
                        className={`absolute w-6 h-6 rounded-full border opacity-80 ${
                          isSelected
                            ? 'border-signal-orange ring-2 ring-signal-orange/50'
                            : 'border-white/40 bg-black/40 backdrop-blur-sm'
                        }`}
                      />

                      {/* Tactical Pin Center */}
                      <span
                        className={`relative w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] text-black shadow-lg ${
                          isSelected
                            ? 'bg-signal-orange text-black'
                            : product.type === 'custom_3d'
                            ? 'bg-signal-orange text-black'
                            : 'bg-signal-cyan text-black'
                        }`}
                      >
                        {pinIdx + 1}
                      </span>
                    </button>
                  </div>
                );
              })}

              {/* Active Floating Hotspot HUD Callout Card */}
              {activeHotspot && activeHotspotProduct && (
                <div
                  className="absolute z-40 max-w-xs sm:max-w-sm w-72 sm:w-80 p-3.5 bg-surface/95 backdrop-blur-md rounded-xl border border-surface-border shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-150"
                  style={{
                    // Position dynamically near pin while respecting container bounds
                    left:
                      activeHotspot.xPercent > 65
                        ? `${Math.max(10, activeHotspot.xPercent - 36)}%`
                        : `${Math.min(65, activeHotspot.xPercent + 4)}%`,
                    top:
                      activeHotspot.yPercent > 65
                        ? `${Math.max(10, activeHotspot.yPercent - 34)}%`
                        : `${Math.min(65, activeHotspot.yPercent + 4)}%`,
                  }}
                >
                  <div className="flex items-start justify-between pb-2 border-b border-surface-border mb-2.5">
                    <div className="flex items-center space-x-1.5 text-[10px]">
                      {activeHotspotProduct.type === 'custom_3d' ? (
                        <span className="px-1.5 py-0.5 rounded bg-signal-orange/15 text-signal-orange border border-signal-orange/30 font-semibold flex items-center space-x-1">
                          <Cpu className="w-3 h-3" />
                          <span>3D PARAMETRIC</span>
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-signal-cyan/15 text-signal-cyan border border-signal-cyan/30 font-semibold flex items-center space-x-1">
                          <Truck className="w-3 h-3" />
                          <span>FAST-SHIP HARDWARE</span>
                        </span>
                      )}
                      <span className="text-zinc-500 font-mono">
                        ${activeHotspotProduct.basePrice.toFixed(2)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveHotspotId(null)}
                      className="p-1 text-zinc-500 hover:text-zinc-200 transition"
                      aria-label="Close tooltip"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex gap-3 mb-2.5">
                    <img
                      src={activeHotspotProduct.images[0]}
                      alt={activeHotspotProduct.title}
                      className="w-14 h-14 object-cover rounded-lg border border-surface-border bg-zinc-900 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-precision-white truncate font-sans">
                        {activeHotspotProduct.title}
                      </div>
                      <div className="text-[11px] text-signal-orange font-semibold line-clamp-1 mt-0.5">
                        {activeHotspot.usageContext}
                      </div>
                      <div className="text-[10px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                        {activeHotspot.curatorNote}
                      </div>
                    </div>
                  </div>

                  {/* Actions inside Hotspot Card */}
                  <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-surface-border">
                    {activeHotspotProduct.type === 'custom_3d' ? (
                      <button
                        type="button"
                        onClick={() => handleCustomize(activeHotspotProduct)}
                        className="col-span-2 py-1.5 px-2.5 bg-signal-orange hover:bg-orange-600 text-black text-xs font-bold rounded flex items-center justify-center space-x-1.5 transition"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>CUSTOMIZE IN 3D STUDIO</span>
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(e, activeHotspotProduct)}
                          className="py-1.5 px-2 bg-precision-white hover:bg-zinc-200 text-black text-xs font-bold rounded flex items-center justify-center space-x-1 transition"
                        >
                          {recentlyAddedId === activeHotspotProduct.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>IN CART</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>ADD TO CART</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setInspectingProduct(activeHotspotProduct)}
                          className="py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded flex items-center justify-center space-x-1 transition"
                        >
                          <Eye className="w-3 h-3" />
                          <span>INSPECT CAD</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Photo Caption Bar */}
            <div className="px-4 py-2.5 bg-white dark:bg-surface border-t border-zinc-200 dark:border-surface-border flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-zinc-950 dark:text-white font-semibold">{activeWorkspace.creatorName}</span>
                <span className="text-zinc-400 dark:text-zinc-600">/</span>
                <span className="text-signal-orange text-[11px] font-mono">{activeWorkspace.creatorHandle}</span>
                <span className="text-zinc-400 dark:text-zinc-600">/</span>
                <span className="text-zinc-500 dark:text-zinc-400 text-[11px] hidden md:inline">
                  {activeWorkspace.creatorRole}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-[11px] text-zinc-500">
                <span>{activeWorkspace.deskSpecs.surface}</span>
                <span>•</span>
                <span>{activeWorkspace.deskSpecs.dimensions}</span>
              </div>
            </div>
          </div>

          {/* Creator Testimonial & Environmental Telemetry */}
          <div className="p-4 rounded-xl bg-white dark:bg-surface/60 border border-zinc-200 dark:border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex-1">
              <div className="flex items-center space-x-1.5 text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                <CornerDownRight className="w-3 h-3 text-signal-orange" />
                <span>CREATOR MANIFESTO NOTE</span>
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 italic font-sans leading-relaxed">
                "{activeWorkspace.quote}"
              </p>
            </div>

            <div className="sm:border-l sm:border-zinc-200 dark:sm:border-surface-border sm:pl-4 sm:shrink-0 flex sm:flex-col justify-between sm:justify-center items-end text-right">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                {activeWorkspace.deskSpecs.telemetryLabel}
              </div>
              <div className="text-xs font-bold text-signal-cyan font-mono mt-0.5">
                {activeWorkspace.deskSpecs.telemetryMetric}
              </div>
            </div>
          </div>
        </div>

        {/* Right Stage: Complete Setup Equipment Manifest (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-surface border border-zinc-200 dark:border-surface-border shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-surface-border mb-3">
              <div className="flex items-center space-x-2 text-xs text-zinc-950 dark:text-white font-bold">
                <Layers className="w-4 h-4 text-signal-orange" />
                <span>EQUIPMENT MANIFEST</span>
              </div>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                [{workspaceProducts.length} MODULES]
              </span>
            </div>

            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mb-4 font-sans leading-relaxed">
              Every SnugFit component present on {activeWorkspace.creatorName}’s desk. Click any module to preview
              schematics or deploy to your cart.
            </p>

            {/* List of hardware items in setup */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {workspaceProducts.map(({ hotspot, product }) => {
                const isSelected = hotspot.id === activeHotspotId;
                const isJustAdded = recentlyAddedId === product.id;

                return (
                  <div
                    key={hotspot.id}
                    onClick={() => handleHotspotClick(hotspot.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-zinc-100 dark:bg-zinc-800/90 border-signal-orange shadow-tactile'
                        : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-surface-border hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="flex items-start space-x-3 mb-2">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded-lg border border-zinc-200 dark:border-surface-border bg-black shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-950 dark:text-white truncate font-sans">
                            {product.title}
                          </span>
                          <span className="text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-200">
                            ${product.basePrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-[10px] text-signal-orange font-medium line-clamp-1 mt-0.5">
                          {hotspot.usageContext}
                        </div>
                        <div className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                          {hotspot.curatorNote}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-surface-border/60 text-xs">
                      <div className="flex items-center space-x-1">
                        {product.type === 'custom_3d' ? (
                          <span className="text-[10px] text-signal-orange flex items-center space-x-1">
                            <Cpu className="w-3 h-3" />
                            <span>Parametric 3D</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-signal-cyan flex items-center space-x-1">
                            <Truck className="w-3 h-3" />
                            <span>Fast-Ship Stock</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {product.type === 'custom_3d' ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCustomize(product);
                            }}
                            className="px-2.5 py-1 bg-signal-orange hover:bg-orange-600 text-black text-[11px] font-bold rounded flex items-center space-x-1 transition"
                          >
                            <Sliders className="w-3 h-3" />
                            <span>Customize</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(e, product)}
                            className="px-2.5 py-1 bg-precision-white hover:bg-zinc-200 text-black text-[11px] font-bold rounded flex items-center space-x-1 transition"
                          >
                            {isJustAdded ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3" />
                                <span>Add</span>
                              </>
                            )}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectingProduct(product);
                          }}
                          className="p-1 text-zinc-400 hover:text-white transition rounded hover:bg-zinc-700"
                          title="Inspect CAD Specs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Bundle Action in Manifest Card */}
            <div className="mt-4 pt-3 border-t border-surface-border">
              <button
                type="button"
                onClick={handleBundleEntireSetup}
                className="w-full py-2.5 bg-gradient-to-r from-signal-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition shadow-tactile"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>DEPLOY IN-STOCK ACCESSORIES TO CART</span>
              </button>
              <div className="text-[10px] text-zinc-500 text-center mt-1.5 font-mono">
                ⚡ Domestic fast-ship dispatch from US warehouses in 2-4 days
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Modal for CAD Blueprints & Specs */}
      {inspectingProduct && (
        <ProductDetailModal
          product={inspectingProduct}
          onClose={() => setInspectingProduct(null)}
          onLaunchCustomizer={(p) => {
            setInspectingProduct(null);
            handleCustomize(p);
          }}
        />
      )}
    </section>
  );
};
