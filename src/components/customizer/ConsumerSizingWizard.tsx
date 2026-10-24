/**
 * WAVEZLY CUSTOM 3D STUDIO - UNIVERSAL SIZING WIZARD
 * Approachable, warm, 3-step sizing guide engineered for all spaces & projects.
 * 
 * Step 1: "Pick Your Space or Project" (IKEA Alex, Kitchen Cutlery, Bathroom Vanity, Workshop Gridfinity, Custom MM)
 * Step 2: "What Are You Organizing?" (Pocket Dump & EDC, Kitchen Silverware, Cosmetics & Skincare, Gaming & Tech, General Storage)
 * Step 3: "Finish & Resin Inlay" (Obsidian Black, Warm Oat Stone, Terracotta, Nordic Slate, Forest Sage + Liquid Resin Sound Inlay)
 * 
 * Features:
 * - 100% Fit Guarantee badge: "Wavezly 100% Fit Guarantee • Made to Order in Boise, ID • Ships in 48h"
 * - Dynamic live 2D compartment floorplan preview
 * - Seamless bi-directional synchronization with useCustomizerStore.ts
 * - 1-Click "Done! View in 3D" & "Add to Bag"
 * - Dual-mode: Embeds natively as an interactive landing page section or modal
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useCustomizerStore } from '../../store/useCustomizerStore';
import { useCartStore } from '../../store/useCartStore';
import { playClickSound } from '../../lib/soundEffects';
import {
  formatFractionalInches,
  getFurnitureCompatibility,
  calculatePriceBreakdown,
} from '../../lib/compartmentGridUtils';
import { MaterialOption } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  Volume2,
  VolumeX,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Ruler,
  Eye,
  ShoppingBag,
  X,
  Check,
  Box,
  Clock,
  Layers,
  Truck,
} from 'lucide-react';

// ============================================================================
// CONSTANTS & CATALOG PRESETS
// ============================================================================

export interface SpacePreset {
  id: string;
  name: string;
  badge?: string;
  description: string;
  dimensionsMm: {
    length: number;
    width: number;
    height: number;
  };
  dimensionsIn: {
    length: number;
    width: number;
    height: number;
  };
  hasSubOptions?: boolean;
  subOptions?: {
    id: string;
    label: string;
    lengthMm: number;
    widthMm: number;
    heightMm: number;
    lengthIn: number;
    widthIn: number;
    heightIn: number;
  }[];
}

export const SPACE_PRESETS: SpacePreset[] = [
  {
    id: "ikea_alex",
    name: "IKEA Alex Drawer (Wide or Compact)",
    badge: "✓ Perfect Fit for IKEA Alex Drawer",
    description: "Precision clearance engineered for IKEA Alex drawer runner guides with zero wobble.",
    dimensionsMm: { length: 240, width: 140, height: 45 },
    dimensionsIn: { length: 9.45, width: 5.51, height: 1.77 },
    hasSubOptions: true,
    subOptions: [
      {
        id: "compact",
        label: "Compact (Half-Drawer)",
        lengthMm: 240,
        widthMm: 140,
        heightMm: 45,
        lengthIn: 9.45,
        widthIn: 5.51,
        heightIn: 1.77,
      },
      {
        id: "wide",
        label: "Wide (Front Section)",
        lengthMm: 240,
        widthMm: 180,
        heightMm: 45,
        lengthIn: 9.45,
        widthIn: 7.09,
        heightIn: 1.77,
      },
    ],
  },
  {
    id: "kitchen_drawer",
    name: "US Kitchen Standard (12\" × 18\") Cutlery Drawer",
    badge: "✓ Perfect Fit for US Kitchen Standard (12\" × 18\")",
    description: "Deep, rigid organizer tailored for American standard 12\" × 18\" cutlery, utensil, and flatware drawers.",
    dimensionsMm: { length: 250, width: 180, height: 45 },
    dimensionsIn: { length: 9.84, width: 7.09, height: 1.77 },
  },
  {
    id: "herman_miller_tu",
    name: "Herman Miller Tu Pedestal Drawer",
    badge: "✓ Perfect Fit for Herman Miller Tu Drawer",
    description: "Precision engineered for Herman Miller Tu & Tu Metal mobile pedestal slide runners.",
    dimensionsMm: { length: 220, width: 160, height: 45 },
    dimensionsIn: { length: 8.66, width: 6.3, height: 1.77 },
  },
  {
    id: "bathroom_vanity",
    name: "Bathroom & Vanity Organizer",
    badge: "Skincare & Cosmetics",
    description: "Waterproof, contoured bays for tall serum bottles, perfumes, makeup brushes, and toiletries.",
    dimensionsMm: { length: 220, width: 160, height: 45 },
    dimensionsIn: { length: 8.66, width: 6.3, height: 1.77 },
  },
  {
    id: "workshop_gridfinity",
    name: "Workshop & Hardware Grid (Gridfinity style)",
    badge: "Maker & Tool Grid",
    description: "Heavy-duty modular base grid designed for hex bits, machine screws, calipers, and hand tools.",
    dimensionsMm: { length: 210, width: 168, height: 45 },
    dimensionsIn: { length: 8.27, width: 6.61, height: 1.77 },
  },
  {
    id: "custom_mm",
    name: "Custom Millimeter Measurement (Enter your exact dimensions)",
    badge: "100% Fit Guarantee",
    description: "Enter your exact drawer or space dimensions. We auto-apply a 2mm safety clearance for a drop-in fit!",
    dimensionsMm: { length: 210, width: 150, height: 40 },
    dimensionsIn: { length: 8.27, width: 5.91, height: 1.57 },
  },
];

export interface OrganizingPreset {
  id: string;
  name: string;
  tagline: string;
  categoryTag: string;
  items: string[];
  rows: number;
  cols: number;
  isAsymmetric?: boolean;
  recommendedHeightMm: number;
  wallThickness: number;
  cornerFilletRadius: number;
}

export const ORGANIZING_PRESETS: OrganizingPreset[] = [
  {
    id: "pen_catchall",
    name: "Pen & Catchall [1 Long + 2 Small]",
    tagline: "1 Long Slot + 2 Small Catchalls",
    categoryTag: "EDC & Stationery",
    items: ["Apple Pencil, pens & stylus", "Wristwatch & rings", "MagSafe wallet & keys", "AirPods Pro & coins"],
    rows: 2,
    cols: 2,
    isAsymmetric: true,
    recommendedHeightMm: 45,
    wallThickness: 2.8,
    cornerFilletRadius: 8,
  },
  {
    id: "equal_grid_2x3",
    name: "Equal Grid [2x3]",
    tagline: "6 Balanced Uniform Bays",
    categoryTag: "Desk & Tech Gear",
    items: ["Controllers & tech accessories", "Braided USB-C cables", "Memory cards & dongles", "IEMs & charging docks"],
    rows: 2,
    cols: 3,
    recommendedHeightMm: 45,
    wallThickness: 2.8,
    cornerFilletRadius: 8,
  },
  {
    id: "cutlery_slots_4x1",
    name: "Cutlery Slots [4x1]",
    tagline: "4 Longitudinal Silverware Slots",
    categoryTag: "Kitchen Standard",
    items: ["Dinner knives & forks", "Teaspoons & soup spoons", "Cooking peelers & openers", "Silverware & utensils"],
    rows: 1,
    cols: 4,
    recommendedHeightMm: 48,
    wallThickness: 3.0,
    cornerFilletRadius: 10,
  },
  {
    id: "single_open_1x1",
    name: "Single Open Bin [1x1]",
    tagline: "1 Open Catchall Chamber",
    categoryTag: "Minimalist Open Tray",
    items: ["Field Notes notebooks", "iPad mini & e-readers", "Eyewear & sunnies", "Large desk accessories"],
    rows: 1,
    cols: 1,
    recommendedHeightMm: 40,
    wallThickness: 2.8,
    cornerFilletRadius: 8,
  },
  {
    id: "cosmetics_skincare",
    name: "Cosmetics & Skincare [3x3]",
    tagline: "Serums, Perfumes, Brushes",
    categoryTag: "Beauty & Bathroom",
    items: ["Glass dropper serums", "Luxury fragrances", "Cosmetic brushes", "Lipsticks & compacts"],
    rows: 3,
    cols: 3,
    recommendedHeightMm: 44,
    wallThickness: 2.8,
    cornerFilletRadius: 10,
  },
];

export interface ConsumerFinish {
  id: string;
  name: string;
  tag: string;
  hexColor: string;
  description: string;
  materialOption: MaterialOption;
}

export const CONSUMER_FINISHES: ConsumerFinish[] = [
  {
    id: 'mat_obsidian_black',
    name: 'Obsidian Black',
    tag: 'Best Seller',
    hexColor: '#18181b',
    description: 'Stealth midnight satin finish. Hides dust and complements every desktop.',
    materialOption: {
      id: 'mat_pla_obsidian',
      name: 'Obsidian Black',
      category: 'filament',
      hexColor: '#18181b',
      roughness: 0.62,
      transmission: 0.0,
      ior: 1.54,
      costPerCm3: 0.035,
      densityGramsPerCm3: 1.24,
      inStock: true,
    },
  },
  {
    id: 'mat_warm_oat_stone',
    name: 'Warm Oat Stone',
    tag: 'Warm Minimalist',
    hexColor: '#ece5db',
    description: 'Soft tactile oat-stone porcelain. Brings calm Scandinavian architectural warmth.',
    materialOption: {
      id: 'mat_pla_warm_oat',
      name: 'Warm Oat Stone',
      category: 'filament',
      hexColor: '#ece5db',
      roughness: 0.86,
      transmission: 0.0,
      ior: 1.52,
      costPerCm3: 0.035,
      densityGramsPerCm3: 1.24,
      inStock: true,
    },
  },
  {
    id: 'mat_terracotta',
    name: 'Terracotta',
    tag: 'Artisan Earth',
    hexColor: '#c46849',
    description: 'Rich Mediterranean earthenware tone. Adds warmth and natural clay aesthetics.',
    materialOption: {
      id: 'mat_pla_terracotta',
      name: 'Terracotta',
      category: 'filament',
      hexColor: '#c46849',
      roughness: 0.84,
      transmission: 0.0,
      ior: 1.53,
      costPerCm3: 0.036,
      densityGramsPerCm3: 1.24,
      inStock: true,
    },
  },
  {
    id: 'mat_nordic_slate',
    name: 'Nordic Slate',
    tag: 'Modern Slate',
    hexColor: '#3d5066',
    description: 'Muted coastal twilight blue-grey with understated industrial refinement.',
    materialOption: {
      id: 'mat_pla_nordic_slate',
      name: 'Nordic Slate',
      category: 'filament',
      hexColor: '#3d5066',
      roughness: 0.82,
      transmission: 0.0,
      ior: 1.52,
      costPerCm3: 0.036,
      densityGramsPerCm3: 1.24,
      inStock: true,
    },
  },
  {
    id: 'mat_forest_sage',
    name: 'Forest Sage',
    tag: 'Botanical Earth',
    hexColor: '#4a6353',
    description: 'Calming botanical green inspired by mossy evergreen woodland textures.',
    materialOption: {
      id: 'mat_pla_forest_sage',
      name: 'Forest Sage',
      category: 'filament',
      hexColor: '#4a6353',
      roughness: 0.85,
      transmission: 0.0,
      ior: 1.52,
      costPerCm3: 0.036,
      densityGramsPerCm3: 1.24,
      inStock: true,
    },
  },
];

export const LIQUID_RESIN_INLAY_MATERIAL: MaterialOption = {
  id: 'mat_resin_clear',
  name: 'Liquid Resin Sound-Dampening Inlay',
  category: 'resin',
  hexColor: '#e0f2fe',
  roughness: 0.12,
  transmission: 0.94,
  ior: 1.56,
  costPerCm3: 0.085,
  densityGramsPerCm3: 1.15,
  inStock: true,
};

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface ConsumerSizingWizardProps {
  isOpen?: boolean;
  onClose?: () => void;
  onComplete?: () => void;
  onCompleteTo3D?: () => void;
  onAddToCart?: () => void;
  isModal?: boolean;
  className?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ConsumerSizingWizard: React.FC<ConsumerSizingWizardProps> = ({
  isOpen,
  onClose,
  onComplete,
  onCompleteTo3D,
  onAddToCart,
  isModal,
  className = '',
}) => {
  // If isModal not specified, treat as modal if onClose is provided or isOpen is explicitly boolean
  const modalMode = isModal ?? (isOpen !== undefined && !!onClose);
  const visible = isOpen !== undefined ? isOpen : true;

  const {
    currentProduct,
    telemetry,
    setDimensions,
    setMaterial,
    setResin,
    getCustomSpecs,
  } = useCustomizerStore();

  const { addCustomItem, openCart } = useCartStore();

  // Wizard active step: 1 (Space), 2 (Organizing), 3 (Finish & Inlay)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // STEP 1 STATE: Space Selection
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>('ikea_alex');
  const [alexSubOption, setAlexSubOption] = useState<'compact' | 'wide'>('compact');
  const [customUnit, setCustomUnit] = useState<'in' | 'mm'>('mm');
  const [customLength, setCustomLength] = useState<number>(210); // in or mm
  const [customWidth, setCustomWidth] = useState<number>(150);
  const [customHeight, setCustomHeight] = useState<number>(40);

  // STEP 2 STATE: Organizing Goal
  const [selectedOrgId, setSelectedOrgId] = useState<string>('pen_catchall');

  // STEP 3 STATE: Finish & Liquid Resin Sound Inlay
  const [selectedFinishId, setSelectedFinishId] = useState<string>('mat_obsidian_black');
  const [hasResinInlay, setHasResinInlay] = useState<boolean>(true);

  // Close on Escape key if modal
  useEffect(() => {
    if (!visible || !modalMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, modalMode, onClose]);

  // Find active configurations
  const activeSpace = useMemo(
    () => SPACE_PRESETS.find((s) => s.id === selectedSpaceId) || SPACE_PRESETS[0],
    [selectedSpaceId]
  );

  const activeOrg = useMemo(
    () => ORGANIZING_PRESETS.find((o) => o.id === selectedOrgId) || ORGANIZING_PRESETS[0],
    [selectedOrgId]
  );

  const activeFinish = useMemo(
    () => CONSUMER_FINISHES.find((f) => f.id === selectedFinishId) || CONSUMER_FINISHES[0],
    [selectedFinishId]
  );

  // Calculate effective dimensions based on active space and organizing height
  const resolvedDimensions = useMemo(() => {
    let length = activeSpace.dimensionsMm.length;
    let width = activeSpace.dimensionsMm.width;
    let height = activeOrg.recommendedHeightMm;

    if (selectedSpaceId === 'ikea_alex') {
      if (alexSubOption === 'wide') {
        length = 240;
        width = 180;
        height = 45;
      } else {
        length = 240;
        width = 140;
        height = 45;
      }
    } else if (selectedSpaceId === 'custom_mm') {
      if (customUnit === 'in') {
        length = Math.max(80, Math.min(260, Math.round(customLength * 25.4)));
        width = Math.max(80, Math.min(240, Math.round(customWidth * 25.4)));
        height = Math.max(25, Math.min(75, Math.round(customHeight * 25.4)));
      } else {
        length = Math.max(80, Math.min(260, Math.round(customLength)));
        width = Math.max(80, Math.min(240, Math.round(customWidth)));
        height = Math.max(25, Math.min(75, Math.round(customHeight)));
      }
    }

    return {
      length,
      width,
      height,
      rows: activeOrg.rows,
      cols: activeOrg.cols,
      wallThickness: activeOrg.wallThickness,
      bottomThickness: 2.4,
      cornerFilletRadius: activeOrg.cornerFilletRadius,
      inlayPocketDepth: hasResinInlay ? 2.5 : 0,
    };
  }, [
    activeSpace,
    activeOrg,
    selectedSpaceId,
    alexSubOption,
    customUnit,
    customLength,
    customWidth,
    customHeight,
    hasResinInlay,
  ]);

  // Fractional inches & Furniture Compatibility
  const compatibility = useMemo(() => {
    return getFurnitureCompatibility(resolvedDimensions.length, resolvedDimensions.width, resolvedDimensions.height);
  }, [resolvedDimensions.length, resolvedDimensions.width, resolvedDimensions.height]);

  const lenFormatted = useMemo(() => formatFractionalInches(resolvedDimensions.length), [resolvedDimensions.length]);
  const widFormatted = useMemo(() => formatFractionalInches(resolvedDimensions.width), [resolvedDimensions.width]);
  const heightFormatted = useMemo(() => formatFractionalInches(resolvedDimensions.height), [resolvedDimensions.height]);

  const priceBreakdown = useMemo(() => {
    return calculatePriceBreakdown(telemetry, activeFinish.materialOption, hasResinInlay);
  }, [telemetry, activeFinish.materialOption, hasResinInlay]);

  // Synchronize store in real-time as user changes choices
  useEffect(() => {
    setDimensions({
      length: resolvedDimensions.length,
      width: resolvedDimensions.width,
      height: resolvedDimensions.height,
      rows: resolvedDimensions.rows,
      cols: resolvedDimensions.cols,
      wallThickness: resolvedDimensions.wallThickness,
      bottomThickness: resolvedDimensions.bottomThickness,
      cornerFilletRadius: resolvedDimensions.cornerFilletRadius,
      inlayPocketDepth: resolvedDimensions.inlayPocketDepth,
    });
    setMaterial(activeFinish.materialOption);
    setResin(hasResinInlay ? LIQUID_RESIN_INLAY_MATERIAL : null);
  }, [resolvedDimensions, activeFinish, hasResinInlay, setDimensions, setMaterial, setResin]);

  // Total price display calculation (telemetry price + inlay upgrade)
  const calculatedDisplayPrice = useMemo(() => {
    const base = telemetry.finalPriceUsd > 0 ? telemetry.finalPriceUsd : 32.0;
    return hasResinInlay ? Math.max(base, base + 2.5) : base;
  }, [telemetry.finalPriceUsd, hasResinInlay]);

  // Step transition handlers with haptic sound feedback
  const handleNextStep = () => {
    playClickSound('toggle');
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const handlePrevStep = () => {
    playClickSound('snap');
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const handleDoneView3D = () => {
    playClickSound('success');
    if (onCompleteTo3D) {
      onCompleteTo3D();
    } else if (onComplete) {
      onComplete();
    }
    onClose?.();
  };

  const handleAddToCartClick = () => {
    playClickSound('cart');
    const specs = getCustomSpecs();
    addCustomItem(currentProduct, specs, calculatedDisplayPrice);
    openCart();
    onAddToCart?.();
    onClose?.();
  };

  // Unit conversion helper for custom dimension inputs
  const handleCustomUnitToggle = (unit: 'in' | 'mm') => {
    playClickSound('snap');
    if (unit === customUnit) return;
    if (unit === 'mm') {
      setCustomLength(Math.round(customLength * 25.4));
      setCustomWidth(Math.round(customWidth * 25.4));
      setCustomHeight(Math.round(customHeight * 25.4));
    } else {
      setCustomLength(Math.round((customLength / 25.4) * 10) / 10);
      setCustomWidth(Math.round((customWidth / 25.4) * 10) / 10);
      setCustomHeight(Math.round((customHeight / 25.4) * 10) / 10);
    }
    setCustomUnit(unit);
  };

  if (!visible) return null;

  // The inner content of the wizard
  const wizardContent = (
    <div className="flex flex-col bg-white dark:bg-zinc-950 text-[#0F172A] dark:text-zinc-100 rounded-2xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.14)] border border-slate-200/90 dark:border-zinc-800 overflow-hidden max-w-4xl w-full mx-auto font-sans">
      {/* ---------------------------------------------------- */}
      {/* WIZARD HEADER: Brand, Sizing Stepper & Trust Pills   */}
      {/* ---------------------------------------------------- */}
      <div className="border-b border-slate-200/80 dark:border-zinc-800 bg-gradient-to-r from-orange-50/50 via-white to-amber-50/30 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900/80 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 dark:bg-orange-950/80 text-[#FF6B00] dark:text-[#FF7A00] border border-orange-200/80 dark:border-orange-800/60 font-sans shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#FF6B00]" />
                WAVEZLY CUSTOM 3D STUDIO • SIZING WIZARD
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                <ShieldCheck className="w-3 h-3" />
                Wavezly 100% Fit Guarantee • Made to Order in Boise, ID • Ships in 48h
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-[#0F172A] dark:text-white">
              Wavezly Custom 3D Studio
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-sans">
              Zero guessing. 3 tailored choices to fabricate your custom organizer for any drawer, desktop, vanity, or workshop.
            </p>
          </div>

          {modalMode && onClose && (
            <button
              type="button"
              onClick={() => {
                playClickSound('snap');
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-[#0F172A] dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
              title="Close Wizard"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 3-Step Progress Indicators */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-5">
          {/* Step 1 */}
          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              setCurrentStep(1);
            }}
            className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              currentStep === 1
                ? 'bg-white dark:bg-zinc-900 border-[#FF6B00] shadow-[0_4px_12px_rgba(255,107,0,0.12)] ring-2 ring-[#FF6B00]/20'
                : currentStep > 1
                ? 'bg-slate-50 dark:bg-zinc-900/50 border-emerald-500/40 text-[#0F172A] dark:text-zinc-300'
                : 'bg-slate-50/60 dark:bg-zinc-900/30 border-slate-200 dark:border-zinc-800 text-slate-400'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 1
                  ? 'bg-[#FF6B00] text-white shadow-2xs'
                  : currentStep > 1
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
              }`}
            >
              {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-semibold text-slate-400 dark:text-zinc-400 font-sans">Step 1</div>
              <div className="text-xs sm:text-sm font-bold truncate">Space or Project</div>
            </div>
          </button>

          {/* Step 2 */}
          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              setCurrentStep(2);
            }}
            className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              currentStep === 2
                ? 'bg-white dark:bg-zinc-900 border-[#FF6B00] shadow-[0_4px_12px_rgba(255,107,0,0.12)] ring-2 ring-[#FF6B00]/20'
                : currentStep > 2
                ? 'bg-slate-50 dark:bg-zinc-900/50 border-emerald-500/40 text-[#0F172A] dark:text-zinc-300'
                : 'bg-slate-50/60 dark:bg-zinc-900/30 border-slate-200 dark:border-zinc-800 text-slate-400'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 2
                  ? 'bg-[#FF6B00] text-white shadow-2xs'
                  : currentStep > 2
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
              }`}
            >
              {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-semibold text-slate-400 dark:text-zinc-400 font-sans">Step 2</div>
              <div className="text-xs sm:text-sm font-bold truncate">What You Organize</div>
            </div>
          </button>

          {/* Step 3 */}
          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              setCurrentStep(3);
            }}
            className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              currentStep === 3
                ? 'bg-white dark:bg-zinc-900 border-[#FF6B00] shadow-[0_4px_12px_rgba(255,107,0,0.12)] ring-2 ring-[#FF6B00]/20'
                : 'bg-slate-50/60 dark:bg-zinc-900/30 border-slate-200 dark:border-zinc-800 text-slate-400'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 3
                  ? 'bg-[#FF6B00] text-white shadow-2xs'
                  : 'bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
              }`}
            >
              3
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-semibold text-slate-400 dark:text-zinc-400 font-sans">Step 3</div>
              <div className="text-xs sm:text-sm font-bold truncate">Finish & Resin Inlay</div>
            </div>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* WIZARD BODY: Step Panels & Live Visual Feedback       */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 p-6 gap-6 items-start overflow-y-auto max-h-[68vh]">
        {/* Left Column: Interactive Step Content (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* ================================================= */}
          {/* STEP 1: PICK YOUR SPACE OR PROJECT                */}
          {/* ================================================= */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] dark:text-[#FF7A00] font-sans">
                  STEP 1 OF 3
                </span>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mt-0.5">
                  Pick Your Space or Project
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Select your space, furniture model, or enter exact custom dimensions.
                </p>
              </div>

              {/* Space Cards Grid */}
              <div className="space-y-3">
                {SPACE_PRESETS.map((preset) => {
                  const isSelected = selectedSpaceId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => {
                        playClickSound('snap');
                        setSelectedSpaceId(preset.id);
                      }}
                      className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#FF6B00] bg-orange-50/40 dark:bg-orange-950/20 shadow-[0_4px_16px_rgba(255,107,0,0.08)]'
                          : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/60 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-[#FF6B00] bg-[#FF6B00] text-white'
                                : 'border-slate-300 dark:border-zinc-600'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-[#0F172A] dark:text-white">
                              {preset.name}
                            </span>
                            {preset.badge && (
                              <span className="ml-2 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-orange-100/80 dark:bg-orange-900/60 text-[#FF6B00] dark:text-orange-300 font-sans border border-orange-200/60">
                                {preset.badge}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Dimensions Tag with clean fractional inches alongside millimeters */}
                        {preset.id !== 'custom_mm' && (
                          <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 whitespace-nowrap bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                            {formatFractionalInches(preset.dimensionsMm.length).fractionOnly} × {formatFractionalInches(preset.dimensionsMm.width).fractionOnly} ({preset.dimensionsMm.length}×{preset.dimensionsMm.width} mm)
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 pl-6">
                        {preset.description}
                      </p>

                      {/* IKEA Alex Sub-Option Selector */}
                      {preset.id === 'ikea_alex' && isSelected && (
                        <div className="mt-3 pl-6 pt-3 border-t border-orange-200/80 dark:border-orange-900/40">
                          <label className="text-xs font-semibold text-[#0F172A] dark:text-zinc-300 block mb-1.5">
                            Select Alex Drawer Fit:
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                playClickSound('toggle');
                                setAlexSubOption('compact');
                              }}
                              className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
                                alexSubOption === 'compact'
                                  ? 'bg-[#FF6B00] text-white border-[#FF6B00] font-semibold shadow-xs'
                                  : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:border-slate-300'
                              }`}
                            >
                              <div className="font-semibold">Compact (Half-Drawer)</div>
                              <div className="text-[10px] opacity-80">140 × 240 mm (5.5 × 9.4″)</div>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                playClickSound('toggle');
                                setAlexSubOption('wide');
                              }}
                              className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
                                alexSubOption === 'wide'
                                  ? 'bg-[#FF6B00] text-white border-[#FF6B00] font-semibold shadow-xs'
                                  : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:border-slate-300'
                              }`}
                            >
                              <div className="font-semibold">Wide (Front Section)</div>
                              <div className="text-[10px] opacity-80">180 × 240 mm (7.1 × 9.4″)</div>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Custom Measurements Input Box */}
                      {preset.id === 'custom_mm' && isSelected && (
                        <div
                          className="mt-3 pl-6 pt-3 border-t border-orange-200/80 dark:border-orange-900/40 space-y-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#0F172A] dark:text-zinc-300">
                              Measurement Unit:
                            </span>
                            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-zinc-800 rounded-lg text-xs border border-slate-200/80 dark:border-zinc-700">
                              <button
                                type="button"
                                onClick={() => handleCustomUnitToggle('mm')}
                                className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                                  customUnit === 'mm'
                                    ? 'bg-white dark:bg-zinc-700 text-[#FF6B00] dark:text-[#FF7A00] font-semibold shadow-xs'
                                    : 'text-slate-600 dark:text-zinc-400'
                                }`}
                              >
                                MILLIMETERS (mm)
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCustomUnitToggle('in')}
                                className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                                  customUnit === 'in'
                                    ? 'bg-white dark:bg-zinc-700 text-[#FF6B00] dark:text-[#FF7A00] font-semibold shadow-xs'
                                    : 'text-slate-600 dark:text-zinc-400'
                                }`}
                              >
                                INCHES (in)
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            {/* Length */}
                            <div>
                              <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 block mb-1">
                                Length ({customUnit})
                              </label>
                              <input
                                type="number"
                                step={customUnit === 'in' ? '0.1' : '1'}
                                min={customUnit === 'in' ? 3.5 : 90}
                                max={customUnit === 'in' ? 10.2 : 260}
                                value={customLength}
                                onChange={(e) => setCustomLength(parseFloat(e.target.value) || 0)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-mono font-bold text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]"
                              />
                            </div>

                            {/* Width */}
                            <div>
                              <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 block mb-1">
                                Width ({customUnit})
                              </label>
                              <input
                                type="number"
                                step={customUnit === 'in' ? '0.1' : '1'}
                                min={customUnit === 'in' ? 3.2 : 80}
                                max={customUnit === 'in' ? 9.5 : 240}
                                value={customWidth}
                                onChange={(e) => setCustomWidth(parseFloat(e.target.value) || 0)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-mono font-bold text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]"
                              />
                            </div>

                            {/* Height */}
                            <div>
                              <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 block mb-1">
                                Height / Depth ({customUnit})
                              </label>
                              <input
                                type="number"
                                step={customUnit === 'in' ? '0.1' : '1'}
                                min={customUnit === 'in' ? 1.0 : 25}
                                max={customUnit === 'in' ? 3.0 : 75}
                                value={customHeight}
                                onChange={(e) => setCustomHeight(parseFloat(e.target.value) || 0)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-mono font-bold text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400 bg-slate-100/80 dark:bg-zinc-800/80 p-2.5 rounded-xl border border-slate-200/60 dark:border-zinc-700">
                            <Ruler className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                            <span>
                              Tip: Measure your inner drawer or shelf footprint. Wavezly applies an automatic tolerance margin for a smooth drop-in fit.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* STEP 2: WHAT ARE YOU ORGANIZING?                  */}
          {/* ================================================= */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] dark:text-[#FF7A00] font-sans">
                  STEP 2 OF 3
                </span>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mt-0.5">
                  What Are You Organizing?
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Select your items. Wavezly automatically configures grid partitions and wall depths for optimal storage.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ORGANIZING_PRESETS.map((org) => {
                  const isSelected = selectedOrgId === org.id;
                  return (
                    <div
                      key={org.id}
                      onClick={() => {
                        playClickSound('snap');
                        setSelectedOrgId(org.id);
                      }}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#FF6B00] bg-orange-50/40 dark:bg-orange-950/20 shadow-[0_4px_16px_rgba(255,107,0,0.08)]'
                          : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/60 shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-sans">
                            {org.categoryTag}
                          </span>
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-[#FF6B00] bg-[#FF6B00] text-white'
                                : 'border-slate-300 dark:border-zinc-600'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5" />}
                          </div>
                        </div>

                        <h4 className="font-bold text-sm text-[#0F172A] dark:text-white mt-2">
                          {org.name}
                        </h4>
                        <p className="text-xs font-semibold text-[#FF6B00] dark:text-[#FF7A00]">
                          {org.tagline}
                        </p>

                        {/* Live SVG Chamber Preview */}
                        <div className="w-full h-12 rounded-lg bg-slate-100 dark:bg-zinc-800 p-1.5 my-2.5 border border-slate-200 dark:border-zinc-700/60 flex items-center justify-center">
                          {org.id === 'pen_catchall' && (
                            <svg viewBox="0 0 100 60" className="w-full h-full">
                              <rect x="2" y="2" width="96" height="56" rx="5" fill="#18181b" stroke="#71717a" strokeWidth="1.5" />
                              <rect x="6" y="6" width="88" height="20" rx="3" fill="#ffffff" opacity="0.9" />
                              <rect x="6" y="30" width="42" height="24" rx="3" fill="#ffffff" opacity="0.9" />
                              <rect x="52" y="30" width="42" height="24" rx="3" fill="#ffffff" opacity="0.9" />
                            </svg>
                          )}
                          {org.id === 'equal_grid_2x3' && (
                            <svg viewBox="0 0 100 60" className="w-full h-full">
                              <rect x="2" y="2" width="96" height="56" rx="5" fill="#18181b" stroke="#71717a" strokeWidth="1.5" />
                              <rect x="6" y="6" width="26" height="22" rx="3" fill="#ffffff" opacity="0.9" />
                              <rect x="37" y="6" width="26" height="22" rx="3" fill="#ffffff" opacity="0.9" />
                              <rect x="68" y="6" width="26" height="22" rx="3" fill="#ffffff" opacity="0.9" />
                              <rect x="6" y="32" width="26" height="22" rx="3" fill="#ffffff" opacity="0.9" />
                              <rect x="37" y="32" width="26" height="22" rx="3" fill="#ffffff" opacity="0.9" />
                              <rect x="68" y="32" width="26" height="22" rx="3" fill="#ffffff" opacity="0.9" />
                            </svg>
                          )}
                          {org.id === 'cutlery_slots_4x1' && (
                            <svg viewBox="0 0 100 60" className="w-full h-full">
                              <rect x="2" y="2" width="96" height="56" rx="5" fill="#18181b" stroke="#71717a" strokeWidth="1.5" />
                              <rect x="6" y="6" width="19" height="48" rx="3" fill="#ffffff" opacity="0.9" />
                              <rect x="29" y="6" width="19" height="48" rx="3" fill="#ffffff" opacity="0.9" />
                              <rect x="52" y="6" width="19" height="48" rx="3" fill="#ffffff" opacity="0.9" />
                              <rect x="75" y="6" width="19" height="48" rx="3" fill="#ffffff" opacity="0.9" />
                            </svg>
                          )}
                          {org.id === 'single_open_1x1' && (
                            <svg viewBox="0 0 100 60" className="w-full h-full">
                              <rect x="2" y="2" width="96" height="56" rx="5" fill="#18181b" stroke="#71717a" strokeWidth="1.5" />
                              <rect x="6" y="6" width="88" height="48" rx="4" fill="#ffffff" opacity="0.9" stroke="#FF6B00" strokeWidth="1" strokeDasharray="3 3" />
                            </svg>
                          )}
                          {org.id === 'cosmetics_skincare' && (
                            <svg viewBox="0 0 100 60" className="w-full h-full">
                              <rect x="2" y="2" width="96" height="56" rx="5" fill="#18181b" stroke="#71717a" strokeWidth="1.5" />
                              {Array.from({ length: 9 }).map((_, i) => (
                                <rect
                                  key={i}
                                  x={6 + (i % 3) * 31}
                                  y={6 + Math.floor(i / 3) * 16}
                                  width="26"
                                  height="13"
                                  rx="2"
                                  fill="#ffffff"
                                  opacity="0.9"
                                />
                              ))}
                            </svg>
                          )}
                        </div>

                        <div className="mt-3 space-y-1">
                          {org.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-zinc-400"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500 font-sans">
                        <span className="font-medium text-[#0F172A] dark:text-zinc-300">{org.rows * org.cols} Compartments</span>
                        <span>{org.recommendedHeightMm}mm Wall Depth</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* STEP 3: FINISH & RESIN INLAY                      */}
          {/* ================================================= */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] dark:text-[#FF7A00] font-sans">
                  STEP 3 OF 3
                </span>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mt-0.5">
                  Finish & Resin Inlay
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Select your tactile exterior color and choose optional liquid resin sound-dampening.
                </p>
              </div>

              {/* Color Swatches */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-[#0F172A] dark:text-zinc-300 block">
                  1. Exterior Color Finish:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CONSUMER_FINISHES.map((finish) => {
                    const isSelected = selectedFinishId === finish.id;
                    return (
                      <div
                        key={finish.id}
                        onClick={() => {
                          playClickSound('snap');
                          setSelectedFinishId(finish.id);
                        }}
                        className={`p-3 rounded-xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#FF6B00] bg-orange-50/40 dark:bg-orange-950/20 shadow-[0_4px_16px_rgba(255,107,0,0.08)]'
                            : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/60 shadow-xs'
                        }`}
                      >
                        {/* Swatch Circle */}
                        <div
                          className="w-8 h-8 rounded-full border-2 border-black/10 dark:border-white/60 shadow-xs shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: finish.hexColor }}
                        >
                          {isSelected && (
                            <Check
                              className={`w-4 h-4 ${
                                finish.hexColor === '#ece5db' ? 'text-zinc-900' : 'text-white'
                              }`}
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-[#0F172A] dark:text-white truncate">
                              {finish.name}
                            </span>
                            <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                              {finish.tag}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                            {finish.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Liquid Resin Sound-Dampening Pocket Toggle */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-[#0F172A] dark:text-zinc-300 block mb-2">
                  2. Sound-Dampening Resin Inlay:
                </label>

                <div
                  onClick={() => {
                    playClickSound('toggle');
                    setHasResinInlay(!hasResinInlay);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    hasResinInlay
                      ? 'border-sky-500/80 bg-sky-50/50 dark:bg-sky-950/30 ring-2 ring-sky-500/20 shadow-xs'
                      : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2.5 rounded-xl ${
                          hasResinInlay
                            ? 'bg-sky-500 text-white shadow-2xs'
                            : 'bg-slate-100 dark:bg-zinc-800 text-slate-500'
                        }`}
                      >
                        {hasResinInlay ? (
                          <Volume2 className="w-5 h-5" />
                        ) : (
                          <VolumeX className="w-5 h-5" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#0F172A] dark:text-white">
                            Optional Liquid Resin Sound-Dampening Pocket
                          </span>
                          <span className="text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-100/80 dark:bg-sky-950 px-2 py-0.5 rounded-full border border-sky-200/60 dark:border-sky-900/40">
                            +$7.50
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-sans">
                          Pours an optical acoustic dampening resin layer into each pocket floor.
                          Eliminates hollow clatter when tossing car keys, silverware, or metal tools, cushions delicate watches & cosmetics, and adds luxurious heft.
                        </p>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <div
                      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                        hasResinInlay ? 'bg-[#FF6B00]' : 'bg-slate-300 dark:bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                          hasResinInlay ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>

                  {hasResinInlay && (
                    <div className="mt-3 pt-3 border-t border-sky-200/60 dark:border-sky-900/40 flex items-center gap-3 text-[11px] text-sky-800 dark:text-sky-300 font-medium">
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-sky-600" />
                        -18 dB acoustic clatter reduction
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-sky-600" />
                        Protects watches, tools & glassware
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Visual Validation Card (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50/70 dark:bg-zinc-900/80 rounded-2xl p-5 border border-slate-200/90 dark:border-zinc-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between gap-1 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-sans flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-[#FF6B00]" />
              LIVE BLUEPRINT PREVIEW
            </span>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
              {compatibility.badge}
            </span>
          </div>

          {/* Interactive 2D Compartment Floorplan Visualizer */}
          <div className="p-4 bg-white dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800/80 shadow-xs flex flex-col items-center justify-center min-h-[170px] relative overflow-hidden">
            {/* Background grid drafting texture */}
            <div
              className="absolute inset-0 opacity-[0.05] dark:opacity-[0.12] pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #71717a 1px, transparent 1px)',
                backgroundSize: '12px 12px',
              }}
            />

            {/* 2D Organizer Footprint */}
            <div
              className="w-full max-w-[240px] aspect-[4/3] rounded-xl p-1.5 shadow-sm border flex flex-col justify-between transition-all"
              style={{
                backgroundColor: activeFinish.hexColor,
                borderColor:
                  activeFinish.hexColor === '#ece5db' ? '#d4d4d8' : '#3f3f46',
              }}
            >
              {/* Internal Compartment Grid (handles asymmetric pen & catchall or standard rows x cols) */}
              {activeOrg.isAsymmetric ? (
                <div className="w-full h-full flex flex-col gap-1 p-0.5">
                  {/* Top long pen channel */}
                  <div
                    className="w-full h-[40%] rounded-md flex items-center justify-center border transition-all"
                    style={{
                      backgroundColor: hasResinInlay ? 'rgba(224, 242, 254, 0.40)' : 'rgba(0, 0, 0, 0.12)',
                      borderColor: hasResinInlay ? 'rgba(2, 132, 199, 0.45)' : 'rgba(255, 255, 255, 0.18)',
                    }}
                  >
                    <span className="text-[9px] font-mono font-bold opacity-80">#1 Pen / Stylus Slot</span>
                  </div>
                  {/* Bottom 2 catchalls */}
                  <div className="w-full h-[58%] grid grid-cols-2 gap-1">
                    <div
                      className="rounded-md flex items-center justify-center border transition-all"
                      style={{
                        backgroundColor: hasResinInlay ? 'rgba(224, 242, 254, 0.40)' : 'rgba(0, 0, 0, 0.12)',
                        borderColor: hasResinInlay ? 'rgba(2, 132, 199, 0.45)' : 'rgba(255, 255, 255, 0.18)',
                      }}
                    >
                      <span className="text-[9px] font-mono font-bold opacity-80">#2 Watch</span>
                    </div>
                    <div
                      className="rounded-md flex items-center justify-center border transition-all"
                      style={{
                        backgroundColor: hasResinInlay ? 'rgba(224, 242, 254, 0.40)' : 'rgba(0, 0, 0, 0.12)',
                        borderColor: hasResinInlay ? 'rgba(2, 132, 199, 0.45)' : 'rgba(255, 255, 255, 0.18)',
                      }}
                    >
                      <span className="text-[9px] font-mono font-bold opacity-80">#3 Keys</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="w-full h-full grid gap-1 p-0.5"
                  style={{
                    gridTemplateRows: `repeat(${resolvedDimensions.rows}, minmax(0, 1fr))`,
                    gridTemplateColumns: `repeat(${resolvedDimensions.cols}, minmax(0, 1fr))`,
                  }}
                >
                  {Array.from({
                    length: resolvedDimensions.rows * resolvedDimensions.cols,
                  }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-md flex items-center justify-center border transition-all"
                      style={{
                        backgroundColor: hasResinInlay
                          ? 'rgba(224, 242, 254, 0.40)'
                          : 'rgba(0, 0, 0, 0.12)',
                        borderColor: hasResinInlay
                          ? 'rgba(2, 132, 199, 0.45)'
                          : 'rgba(255, 255, 255, 0.18)',
                      }}
                    >
                      <span className="text-[9px] font-mono font-bold opacity-80">#{i + 1}</span>
                      {hasResinInlay && (
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-xs ml-1" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dimensional Dimension Tags in Fractional Inches & Millimeters */}
            <div className="mt-2 text-[11px] font-mono text-slate-500 dark:text-zinc-400 flex items-center justify-center gap-2 flex-wrap">
              <span>{lenFormatted.combinedShort} L</span>
              <span>×</span>
              <span>{widFormatted.combinedShort} W</span>
              <span>×</span>
              <span>{heightFormatted.combinedShort} H</span>
            </div>
          </div>

          {/* Validation Checklist */}
          <div className="space-y-2 bg-white dark:bg-zinc-950 p-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-800 text-xs shadow-xs">
            <div className="flex items-center gap-2 text-[#0F172A] dark:text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                <strong>Space:</strong> {activeSpace.name}{' '}
                {selectedSpaceId === 'ikea_alex' ? `(${alexSubOption})` : ''}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[#0F172A] dark:text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                <strong>Layout:</strong> {activeOrg.name} ({resolvedDimensions.rows * resolvedDimensions.cols} chambers)
              </span>
            </div>

            <div className="flex items-center gap-2 text-[#0F172A] dark:text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="flex items-center gap-1.5">
                <span>
                  <strong>Finish:</strong> {activeFinish.name}
                </span>
                <span
                  className="w-3 h-3 rounded-full border border-black/20"
                  style={{ backgroundColor: activeFinish.hexColor }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#0F172A] dark:text-zinc-300">
              <CheckCircle2
                className={`w-4 h-4 ${
                  hasResinInlay ? 'text-sky-500' : 'text-slate-400'
                } shrink-0`}
              />
              <span>
                <strong>Inlay:</strong>{' '}
                {hasResinInlay
                  ? 'Liquid Resin Sound-Dampening Pocket (+$7.50)'
                  : 'Standard Base Floor'}
              </span>
            </div>
          </div>

          {/* 100% Fit Guarantee Badge */}
          <div className="p-3 bg-gradient-to-r from-emerald-50/90 to-teal-50/70 dark:from-emerald-950/40 dark:to-teal-950/30 rounded-xl border border-emerald-200/90 dark:border-emerald-800/50 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-snug">
              <div className="font-bold text-emerald-900 dark:text-emerald-300 font-sans">
                Wavezly 100% Fit Guarantee • Made to Order in Boise, ID • Ships in 48h
              </div>
              <div className="text-emerald-700 dark:text-emerald-400 mt-0.5 font-sans">
                If your measurement is off, we reprint your custom organizer free under our 30-day zero-risk fit policy.
              </div>
            </div>
          </div>

          {/* Manufacturing Telemetry & Live Pricing Breakdown */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-zinc-800">
            {/* Biopolymer mass & Print time chips */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/40 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 block leading-none">Biopolymer Mass</span>
                  <strong className="text-[#0F172A] dark:text-zinc-200">{priceBreakdown.biopolymerMassGrams}g PLA</strong>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 block leading-none">Print Farm Time</span>
                  <strong className="text-[#0F172A] dark:text-zinc-200">{priceBreakdown.machineTimeHours}h {priceBreakdown.machineTimeMinutes}m</strong>
                </div>
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-400 block font-sans">
                  TOTAL TAILORED PRICE
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-sans text-[#0F172A] dark:text-white">
                    ${calculatedDisplayPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">USD</span>
                </div>
              </div>

              <div className="text-right text-[11px] font-sans">
                <div className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Free US Shipping</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Orders over $35 ship free • 48h dispatch
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* WIZARD FOOTER: Navigation & 1-Click Action Buttons    */}
      {/* ---------------------------------------------------- */}
      <div className="border-t border-slate-200/80 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/90 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 text-xs font-semibold text-[#0F172A] dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          {currentStep < 3 && (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF7A00] text-white text-xs font-semibold shadow-[0_4px_14px_rgba(255,107,0,0.25)] transition-all flex items-center gap-1.5 cursor-pointer font-sans"
            >
              <span>Next: {currentStep === 1 ? 'What You Organize' : 'Finish & Resin Inlay'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 1-Click Execution Dispatch: View in 3D or Add to Bag */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleDoneView3D}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-800 text-[#0F172A] dark:text-zinc-100 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer font-sans"
            title="Inspect tailored dimensions in 3D WebGL viewport"
          >
            <Eye className="w-4 h-4 text-[#FF6B00]" />
            <span>Done! View in 3D</span>
          </button>

          <button
            type="button"
            onClick={handleAddToCartClick}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF7A00] hover:from-[#FF7A00] hover:to-[#FF851A] text-white text-xs font-bold transition-all shadow-[0_4px_20px_rgba(255,107,0,0.30)] hover:shadow-[0_6px_24px_rgba(255,107,0,0.40)] flex items-center justify-center gap-1.5 cursor-pointer font-sans"
            title="Add to shopping bag and initiate high-precision manufacturing"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Bag • ${calculatedDisplayPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );

  // If used as modal, render backdrop wrapper; otherwise render inline container
  if (modalMode) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200 ${className}`}>
        {wizardContent}
      </div>
    );
  }

  return (
    <div className={`w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 ${className}`}>
      {wizardContent}
    </div>
  );
};
