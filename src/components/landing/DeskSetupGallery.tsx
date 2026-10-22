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
    id: 'ws_tokyo_keeb',
    slug: 'tokyo-mechanical-keyboard-engineer',
    title: 'The Mechanical Keyboard Engineer',
    city: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    creatorName: 'Kenji Takahashi',
    creatorHandle: '@keeb_craft_tokyo',
    creatorRole: 'Artisanal Switch Tuner & Firmware Engineer',
    image: '/assets/workspaces/workspace-tokyo.jpg',
    quote:
      'Sub-millimeter clearances isolate high-frequency housing resonance. Formgrid’s modular trays keep 90 individual switch stems and lubed stabilizers in absolute zero-rattle alignment.',
    deskSpecs: {
      surface: 'Solid Japanese Hinoki Cypress',
      dimensions: '1800 × 800 mm',
      primaryAesthetic: 'Artisanal Cyber-Craft / Precision Akihabara',
      telemetryMetric: '54 dB Acoustic Thock',
      telemetryLabel: 'Bottom-Out Resonance Dampened',
    },
    hotspots: [
      {
        id: 'hs_tokyo_valet',
        productId: 'prod_valet_pro',
        xPercent: 32,
        yPercent: 62,
        usageContext: 'Switch Stem & Lube Valet (Cobalt Inlay)',
        curatorNote:
          'Houses Krytox 205g0 vials, titanium switch pullers, and calibrated stem holders without table vibration.',
      },
      {
        id: 'hs_tokyo_hex_tray',
        productId: 'prod_hex_bit_tray',
        xPercent: 72,
        yPercent: 68,
        usageContext: 'M2 Hardware & Standoff Organizer',
        curatorNote:
          'Neodymium magnetic wells prevent copper standoffs and gold-plated case screws from rolling across the desk.',
      },
      {
        id: 'hs_tokyo_pen_stand',
        productId: 'prod_titanium_pen_stand',
        xPercent: 82,
        yPercent: 42,
        usageContext: 'Machined Titanium Stem Holder Dock',
        curatorNote:
          'Grade 5 titanium mass anchors the brass switch stem holder upright for rapid one-handed grasping during assembly.',
      },
      {
        id: 'hs_tokyo_felt_mat',
        productId: 'prod_felt_mat',
        xPercent: 52,
        yPercent: 58,
        usageContext: 'High-Density Merino Acoustic Pad',
        curatorNote:
          '5mm German merino wool absorbs lower-mid switch ping, deepening the acoustic signature of polycarbonate plates.',
      },
      {
        id: 'hs_tokyo_cable_anchor',
        productId: 'prod_cable_anchor',
        xPercent: 20,
        yPercent: 45,
        usageContext: 'Precision Aviator Cable Anchor',
        curatorNote:
          'Weighted zinc-core channel prevents heavyweight coiled GX16 aviator connectors from sliding off the rear edge.',
      },
    ],
  },
  {
    id: 'ws_berlin_audio',
    slug: 'berlin-analog-mastering-suite',
    title: 'Audiophile Analog Mastering Suite',
    city: 'Berlin',
    country: 'Germany',
    flag: '🇩🇪',
    creatorName: 'Elena Voss',
    creatorHandle: '@voss_analog_berlin',
    creatorRole: 'Vinyl Mastering & Acoustics Engineer',
    image: '/assets/workspaces/workspace-berlin.jpg',
    quote:
      'In an analog mastering room, magnetic isolation and non-resonant plinths aren’t luxuries—they’re acoustic imperatives. The headphone plinth cradles planar diaphragms with zero foam fatigue.',
    deskSpecs: {
      surface: 'Smoked European Bog Oak Console',
      dimensions: '2400 × 950 mm',
      primaryAesthetic: 'Industrial Brutalist Acoustics / Kreuzberg Control',
      telemetryMetric: '0.18s RT60 Decay',
      telemetryLabel: 'Reference Control Room Certified',
    },
    hotspots: [
      {
        id: 'hs_berlin_plinth',
        productId: 'prod_headphone_plinth',
        xPercent: 24,
        yPercent: 48,
        usageContext: 'Planar Magnetic Headphone Plinth',
        curatorNote:
          'Curved aluminum head cradle distributes headband weight evenly, preserving memory foam earpad geometry.',
      },
      {
        id: 'hs_berlin_screenbar',
        productId: 'prod_screenbar',
        xPercent: 50,
        yPercent: 20,
        usageContext: 'Zero-Glare Console ScreenBar',
        curatorNote:
          'Asymmetric optical path casts 500 lx across analog faders and tube gear without bouncing light off meters.',
      },
      {
        id: 'hs_berlin_matrix',
        productId: 'prod_drawer_matrix',
        xPercent: 78,
        yPercent: 66,
        usageContext: 'Console Patch Cord & 1/4" Adapter Grid',
        curatorNote:
          'Tailored to 19-inch rack drawer depths to sort gold Neutrik balanced adapters and patch cables by length.',
      },
      {
        id: 'hs_berlin_dock',
        productId: 'prod_magnetic_dock',
        xPercent: 84,
        yPercent: 40,
        usageContext: 'MagSafe Audio Transport Control Dock',
        curatorNote:
          'Solid machined brass plinth anchors iPad telemetry running DAW transport meters at an ergonomic 45° angle.',
      },
    ],
  },
  {
    id: 'ws_sf_architect',
    slug: 'sf-minimalist-software-architect',
    title: 'Minimalist Software Architect',
    city: 'San Francisco, CA',
    country: 'United States',
    flag: '🇺🇸',
    creatorName: 'Marcus Vance',
    creatorHandle: '@vance_systems_sf',
    creatorRole: 'Principal Distributed Systems Lead',
    image: '/assets/workspaces/workspace-sf.jpg',
    quote:
      'Zero cognitive clutter on the surface correlates directly with architectural clarity. Elevating the laptop and locking Thunderbolt optical lines with micro-suction anchors completely freed my mental space.',
    deskSpecs: {
      surface: 'American Black Walnut Standing Desk',
      dimensions: '1600 × 750 mm',
      primaryAesthetic: 'Functionalist Monolith / Dieter Rams Purity',
      telemetryMetric: 'Single 40Gbps Optical Trunk',
      telemetryLabel: 'Hidden Zero-Wire Infrastructure',
    },
    hotspots: [
      {
        id: 'hs_sf_riser',
        productId: 'prod_laptop_riser',
        xPercent: 28,
        yPercent: 42,
        usageContext: 'Aviation Aluminum Laptop Riser',
        curatorNote:
          '15° ergonomic tilt elevates the 16" MacBook Pro display to eye height while maximizing underside convection airflow.',
      },
      {
        id: 'hs_sf_valet',
        productId: 'prod_valet_pro',
        xPercent: 74,
        yPercent: 56,
        usageContext: 'Modular EDC Desk Valet (Obsidian PLA)',
        curatorNote:
          'Custom dimensioned to dock hardware security keys, fountain pens, and ANC earbuds within arm’s reach.',
      },
      {
        id: 'hs_sf_mat',
        productId: 'prod_felt_mat',
        xPercent: 50,
        yPercent: 65,
        usageContext: 'Anthracite Merino Desk Surface',
        curatorNote:
          'High-density wool felt dampens key bottom-out while insulating wrists against cold aluminum chassis edges.',
      },
      {
        id: 'hs_sf_cable_anchor',
        productId: 'prod_cable_anchor',
        xPercent: 86,
        yPercent: 70,
        usageContext: 'Braided Optical Cable Anchor',
        curatorNote:
          'Micro-suction base immobilizes high-speed Thunderbolt optical cable without leaving sticky desk residues.',
      },
      {
        id: 'hs_sf_screenbar',
        productId: 'prod_screenbar',
        xPercent: 50,
        yPercent: 22,
        usageContext: 'Auto-Dimming Touch ScreenBar',
        curatorNote:
          'Warm 3000K evening color temperature automatically tracks circadian rhythms during late code reviews.',
      },
    ],
  },
  {
    id: 'ws_zurich_proto',
    slug: 'zurich-hardware-prototyping-bench',
    title: 'Industrial Hardware Prototyping Bench',
    city: 'Zurich',
    country: 'Switzerland',
    flag: '🇨🇭',
    creatorName: 'Dr. Beatrix Keller',
    creatorHandle: '@keller_robotics_eth',
    creatorRole: 'Mechatronics & Micro-Robotics Lead',
    image: '/assets/workspaces/workspace-zurich.jpg',
    quote:
      'Fast-turn robotics prototyping requires immediate access to SMD passives, calibrated hex bits, and digital calipers. Formgrid’s sub-millimeter custom bins fit our ESD workbench with aerospace precision.',
    deskSpecs: {
      surface: 'Grounded Anti-Static Hard Maple Lab Bench',
      dimensions: '2000 × 900 mm',
      primaryAesthetic: 'Precision Metrology / ETH Mechatronics Lab',
      telemetryMetric: '± 0.01mm Metrology',
      telemetryLabel: 'Laser Calibrated Sub-Millimeter Fit',
    },
    hotspots: [
      {
        id: 'hs_zurich_matrix',
        productId: 'prod_drawer_matrix',
        xPercent: 32,
        yPercent: 64,
        usageContext: 'SMD Passives & Stepper Driver Grid',
        curatorNote:
          'Custom 4x5 compartment matrix segregates 0402 SMD reels, micro-servos, and ceramic capacitors with instant label visibility.',
      },
      {
        id: 'hs_zurich_hex_tray',
        productId: 'prod_hex_bit_tray',
        xPercent: 68,
        yPercent: 58,
        usageContext: 'Magnetic Fastener & Bit Sorting Station',
        curatorNote:
          'Countersunk neodymium magnets prevent stainless M1.6 and M2 screws from straying into circuit assemblies.',
      },
      {
        id: 'hs_zurich_pen_stand',
        productId: 'prod_titanium_pen_stand',
        xPercent: 82,
        yPercent: 46,
        usageContext: 'Tungsten Carbide Scriber Dock',
        curatorNote:
          'Machined grade 5 titanium cylinder prevents sharp diamond scribers and tweezers from puncturing silicone ESD pads.',
      },
      {
        id: 'hs_zurich_dock',
        productId: 'prod_magnetic_dock',
        xPercent: 18,
        yPercent: 50,
        usageContext: 'Telemetry Thermal Camera Dock',
        curatorNote:
          'Holds thermal imaging diagnostic smartphone firmly locked at a 45° angle to monitor PCB power traces during stress tests.',
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
            Curated Creator Workspaces
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-3xl font-sans">
            Explore authentic creator studios tuned with Formgrid parametric modules and aerospace hardware.
            Hover or tap any interactive radar pin to inspect technical blueprints or add directly to your build.
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
              <span>DISPATCH WORKSPACE HARDWARE</span>
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
                  {activeWorkspace.hotspots.length} FORMGRID MODULES DETECTED
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
              Every Formgrid component present on {activeWorkspace.creatorName}’s desk. Click any module to preview
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
