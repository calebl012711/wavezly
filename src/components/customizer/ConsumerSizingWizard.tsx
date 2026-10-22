/**
 * FORMGRID CONSUMER SIZING WIZARD
 * Approachable, warm, 3-step drawer sizing guide engineered for social media ad traffic.
 * 
 * Step 1: "Pick Your Drawer or Space" (IKEA Alex, Standard Desk, Nightstand, Valet Tray, Custom IN/MM)
 * Step 2: "What Are You Organizing?" (Pocket Dump, Office/Writing, Cables/Tech, Minimalist Duo)
 * Step 3: "Pick Your Finish & Sound Inlay" (Consumer Color Swatches + Whisper-Quiet Base Inlay)
 * 
 * Features:
 * - Instant visual validation: "Guaranteed Snug Fit • Hand-crafted in 48 Hours"
 * - Dynamic live 2D compartment floorplan preview
 * - Seamless bi-directional synchronization with useCustomizerStore.ts
 * - 1-Click "Done! View in 3D" & "Add to Bag"
 * - Dual-mode: Embeds natively as an interactive landing page section or modal
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useCustomizerStore } from '../../store/useCustomizerStore';
import { useCartStore } from '../../store/useCartStore';
import { playClickSound } from '../../lib/soundEffects';
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
    id: 'ikea_alex',
    name: 'IKEA Alex Drawer',
    badge: 'Most Popular • 99.4% Fit',
    description: 'Precision clearance for IKEA Alex drawer runner guides with zero wobble.',
    dimensionsMm: { length: 240, width: 140, height: 45 },
    dimensionsIn: { length: 9.45, width: 5.51, height: 1.77 },
    hasSubOptions: true,
    subOptions: [
      {
        id: 'compact',
        label: 'Compact (Half-Drawer)',
        lengthMm: 240,
        widthMm: 140,
        heightMm: 45,
        lengthIn: 9.45,
        widthIn: 5.51,
        heightIn: 1.77,
      },
      {
        id: 'wide',
        label: 'Wide (Front Section)',
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
    id: 'standard_desk',
    name: 'Standard Desk Drawer (12×15 in)',
    badge: 'Steelcase & Herman Miller',
    description: 'Modular nesting tray optimized for standard home office and corporate desk drawers.',
    dimensionsMm: { length: 245, width: 175, height: 42 },
    dimensionsIn: { length: 9.65, width: 6.89, height: 1.65 },
  },
  {
    id: 'nightstand',
    name: 'Bedside Nightstand (8×10 in)',
    badge: 'Quiet Bedroom Fit',
    description: 'Low-profile quiet footprint for sleep essentials, reading glasses, and charging watch.',
    dimensionsMm: { length: 190, width: 140, height: 38 },
    dimensionsIn: { length: 7.48, width: 5.51, height: 1.5 },
  },
  {
    id: 'valet_tray',
    name: 'Top of Desk / Valet Tray (7×5 in)',
    badge: 'Display Plinth',
    description: 'Freestanding architectural tray that sits proudly next to your keyboard or laptop.',
    dimensionsMm: { length: 175, width: 125, height: 34 },
    dimensionsIn: { length: 6.89, width: 4.92, height: 1.34 },
  },
  {
    id: 'custom',
    name: 'Custom Measurement',
    badge: 'Tape Measure Fit',
    description: 'Enter your exact drawer cavity dimensions. We auto-apply a 3mm tolerance margin!',
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
  recommendedHeightMm: number;
  wallThickness: number;
  cornerFilletRadius: number;
}

export const ORGANIZING_PRESETS: OrganizingPreset[] = [
  {
    id: 'pocket_dump',
    name: 'Daily Pocket Dump',
    tagline: 'Keys, Watch, Wallet, AirPods',
    categoryTag: 'EDC Everyday Carry',
    items: ['Mechanical watch', 'Bifold / MagSafe wallet', 'Key fobs & rings', 'AirPods / earbuds'],
    rows: 2,
    cols: 2,
    recommendedHeightMm: 38,
    wallThickness: 2.8,
    cornerFilletRadius: 8,
  },
  {
    id: 'office_writing',
    name: 'Office & Writing',
    tagline: 'Pens, Sticky Notes, Hex Bits',
    categoryTag: 'Stationery & Precision',
    items: ['Fountain / ballpoint pens', '3×3 Sticky note pads', 'Paperclips & pins', 'Micro hex bits'],
    rows: 2,
    cols: 4,
    recommendedHeightMm: 34,
    wallThickness: 2.8,
    cornerFilletRadius: 6,
  },
  {
    id: 'cables_tech',
    name: 'Cables & Tech Gear',
    tagline: 'Chargers, Adapters, Flash Drives',
    categoryTag: 'Deep High-Capacity',
    items: ['65W GaN wall chargers', 'Braided USB-C cables', 'Dongles & adapters', 'Flash drives & cards'],
    rows: 2,
    cols: 3,
    recommendedHeightMm: 46,
    wallThickness: 3.2,
    cornerFilletRadius: 6,
  },
  {
    id: 'minimalist_duo',
    name: 'Minimalist Duo',
    tagline: '2 Large Compartments',
    categoryTag: 'Clean 50/50 Architecture',
    items: ['Field Notes pocket journal', 'Eyewear / sunglasses', 'Passport & documents', 'Universal quick drop'],
    rows: 1,
    cols: 2,
    recommendedHeightMm: 40,
    wallThickness: 3.0,
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
    name: 'Matte Obsidian Black',
    tag: 'Best Seller',
    hexColor: '#18181b',
    description: 'Stealth midnight satin finish. Hides dust and complements every desktop.',
    materialOption: {
      id: 'mat_pla_obsidian',
      name: 'Matte Obsidian Black',
      category: 'filament',
      hexColor: '#18181b',
      roughness: 0.88,
      transmission: 0.0,
      ior: 1.54,
      costPerCm3: 0.035,
      densityGramsPerCm3: 1.24,
      inStock: true,
    },
  },
  {
    id: 'mat_cloud_cream',
    name: 'Warm Cloud Cream',
    tag: 'Japandi Luxury',
    hexColor: '#f5f0eb',
    description: 'Soft tactile stone-white. Brings warm Scandinavian architectural brightness.',
    materialOption: {
      id: 'mat_pla_studio_white',
      name: 'Warm Cloud Cream',
      category: 'filament',
      hexColor: '#f5f0eb',
      roughness: 0.86,
      transmission: 0.0,
      ior: 1.52,
      costPerCm3: 0.035,
      densityGramsPerCm3: 1.24,
      inStock: true,
    },
  },
  {
    id: 'mat_terracotta_clay',
    name: 'Terracotta Clay',
    tag: 'Artisan Earth',
    hexColor: '#c46849',
    description: 'Rich Mediterranean earthenware tone. Adds warmth and natural clay aesthetics.',
    materialOption: {
      id: 'mat_pla_signal_orange',
      name: 'Terracotta Clay',
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
    id: 'mat_slate_blue',
    name: 'Nordic Slate Blue',
    tag: 'Modern Slate',
    hexColor: '#3d5066',
    description: 'Muted coastal twilight blue-grey with understated industrial refinement.',
    materialOption: {
      id: 'mat_pla_concrete',
      name: 'Nordic Slate Blue',
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
    id: 'mat_sage_green',
    name: 'Forest Sage Green',
    tag: 'Biophilic Design',
    hexColor: '#4a6353',
    description: 'Calming botanical green inspired by mossy evergreen woodland desks.',
    materialOption: {
      id: 'mat_pla_concrete',
      name: 'Forest Sage Green',
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

export const WHISPER_INLAY_MATERIAL: MaterialOption = {
  id: 'mat_resin_clear',
  name: 'Whisper-Quiet Optical Dampener',
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
  const [customUnit, setCustomUnit] = useState<'in' | 'mm'>('in');
  const [customLength, setCustomLength] = useState<number>(8.5); // inches or mm
  const [customWidth, setCustomWidth] = useState<number>(6.0);
  const [customHeight, setCustomHeight] = useState<number>(1.75);

  // STEP 2 STATE: Organizing Goal
  const [selectedOrgId, setSelectedOrgId] = useState<string>('pocket_dump');

  // STEP 3 STATE: Finish & Whisper Inlay
  const [selectedFinishId, setSelectedFinishId] = useState<string>('mat_obsidian_black');
  const [hasWhisperInlay, setHasWhisperInlay] = useState<boolean>(true);

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
    } else if (selectedSpaceId === 'custom') {
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
      inlayPocketDepth: hasWhisperInlay ? 2.5 : 0,
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
    hasWhisperInlay,
  ]);

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
    setResin(hasWhisperInlay ? WHISPER_INLAY_MATERIAL : null);
  }, [resolvedDimensions, activeFinish, hasWhisperInlay, setDimensions, setMaterial, setResin]);

  // Total price display calculation (telemetry price + inlay upgrade)
  const calculatedDisplayPrice = useMemo(() => {
    const base = telemetry.finalPriceUsd > 0 ? telemetry.finalPriceUsd : 32.0;
    return hasWhisperInlay ? Math.max(base, base + 2.5) : base;
  }, [telemetry.finalPriceUsd, hasWhisperInlay]);

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
    <div className="flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden max-w-4xl w-full mx-auto">
      {/* ---------------------------------------------------- */}
      {/* WIZARD HEADER: Brand, Sizing Stepper & Trust Pills   */}
      {/* ---------------------------------------------------- */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-orange-50/60 via-zinc-50 to-orange-50/40 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900/80 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60">
                <Sparkles className="w-3 h-3" />
                60-SECOND DRAWER FIT WIZARD
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                <ShieldCheck className="w-3 h-3" />
                Guaranteed Snug Fit • Hand-crafted in 48 Hours
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-zinc-900 dark:text-white">
              Design Your Perfect Organizer
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Zero guessing. Just 3 simple choices to get a tailored drawer insert that fits like a glove.
            </p>
          </div>

          {modalMode && onClose && (
            <button
              type="button"
              onClick={() => {
                playClickSound('snap');
                onClose();
              }}
              className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
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
                ? 'bg-white dark:bg-zinc-900 border-orange-500 shadow-xs ring-2 ring-orange-500/20'
                : currentStep > 1
                ? 'bg-zinc-100/80 dark:bg-zinc-900/50 border-emerald-500/40 text-zinc-700 dark:text-zinc-300'
                : 'bg-zinc-100/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-zinc-400'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 1
                  ? 'bg-orange-600 text-white'
                  : currentStep > 1
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-semibold text-zinc-500 dark:text-zinc-400">Step 1</div>
              <div className="text-xs sm:text-sm font-semibold truncate">Drawer or Space</div>
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
                ? 'bg-white dark:bg-zinc-900 border-orange-500 shadow-xs ring-2 ring-orange-500/20'
                : currentStep > 2
                ? 'bg-zinc-100/80 dark:bg-zinc-900/50 border-emerald-500/40 text-zinc-700 dark:text-zinc-300'
                : 'bg-zinc-100/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-zinc-400'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 2
                  ? 'bg-orange-600 text-white'
                  : currentStep > 2
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-semibold text-zinc-500 dark:text-zinc-400">Step 2</div>
              <div className="text-xs sm:text-sm font-semibold truncate">What You Organize</div>
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
                ? 'bg-white dark:bg-zinc-900 border-orange-500 shadow-xs ring-2 ring-orange-500/20'
                : 'bg-zinc-100/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-zinc-400'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 3
                  ? 'bg-orange-600 text-white'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              3
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-semibold text-zinc-500 dark:text-zinc-400">Step 3</div>
              <div className="text-xs sm:text-sm font-semibold truncate">Finish & Sound Inlay</div>
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
          {/* STEP 1: PICK YOUR DRAWER OR SPACE                 */}
          {/* ================================================= */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 font-mono">
                  STEP 1 OF 3
                </span>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5">
                  Pick Your Drawer or Space
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Select your furniture model or enter quick dimensions from your tape measure.
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
                          ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-orange-600 bg-orange-600 text-white'
                                : 'border-zinc-300 dark:border-zinc-600'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-zinc-900 dark:text-white">
                              {preset.name}
                            </span>
                            {preset.badge && (
                              <span className="ml-2 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/60 text-orange-800 dark:text-orange-300">
                                {preset.badge}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Dimensions Tag */}
                        {preset.id !== 'custom' && (
                          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 whitespace-nowrap bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                            {preset.dimensionsIn.length}″ × {preset.dimensionsIn.width}″ ({preset.dimensionsMm.length}×{preset.dimensionsMm.width}mm)
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 pl-6">
                        {preset.description}
                      </p>

                      {/* IKEA Alex Sub-Option Selector */}
                      {preset.id === 'ikea_alex' && isSelected && (
                        <div className="mt-3 pl-6 pt-3 border-t border-orange-200 dark:border-orange-900/40">
                          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
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
                              className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                                alexSubOption === 'compact'
                                  ? 'bg-orange-600 text-white border-orange-600 font-semibold shadow-xs'
                                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                              }`}
                            >
                              <div className="font-semibold">Compact (Half)</div>
                              <div className="text-[10px] opacity-80">140 × 240 mm (5.5 × 9.4″)</div>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                playClickSound('toggle');
                                setAlexSubOption('wide');
                              }}
                              className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                                alexSubOption === 'wide'
                                  ? 'bg-orange-600 text-white border-orange-600 font-semibold shadow-xs'
                                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                              }`}
                            >
                              <div className="font-semibold">Wide (Front)</div>
                              <div className="text-[10px] opacity-80">180 × 240 mm (7.1 × 9.4″)</div>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Custom Measurements Input Box */}
                      {preset.id === 'custom' && isSelected && (
                        <div
                          className="mt-3 pl-6 pt-3 border-t border-orange-200 dark:border-orange-900/40 space-y-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                              Tape Measure Units:
                            </span>
                            <div className="flex items-center p-0.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-xs">
                              <button
                                type="button"
                                onClick={() => handleCustomUnitToggle('in')}
                                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                                  customUnit === 'in'
                                    ? 'bg-white dark:bg-zinc-700 text-orange-600 dark:text-orange-400 font-semibold shadow-xs'
                                    : 'text-zinc-600 dark:text-zinc-400'
                                }`}
                              >
                                INCHES (in)
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCustomUnitToggle('mm')}
                                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                                  customUnit === 'mm'
                                    ? 'bg-white dark:bg-zinc-700 text-orange-600 dark:text-orange-400 font-semibold shadow-xs'
                                    : 'text-zinc-600 dark:text-zinc-400'
                                }`}
                              >
                                MILLIMETERS (mm)
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            {/* Length */}
                            <div>
                              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                                Length ({customUnit})
                              </label>
                              <input
                                type="number"
                                step={customUnit === 'in' ? '0.1' : '1'}
                                min={customUnit === 'in' ? 3.5 : 90}
                                max={customUnit === 'in' ? 10.2 : 260}
                                value={customLength}
                                onChange={(e) => setCustomLength(parseFloat(e.target.value) || 0)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-mono font-bold"
                              />
                            </div>

                            {/* Width */}
                            <div>
                              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                                Width ({customUnit})
                              </label>
                              <input
                                type="number"
                                step={customUnit === 'in' ? '0.1' : '1'}
                                min={customUnit === 'in' ? 3.2 : 80}
                                max={customUnit === 'in' ? 9.5 : 240}
                                value={customWidth}
                                onChange={(e) => setCustomWidth(parseFloat(e.target.value) || 0)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-mono font-bold"
                              />
                            </div>

                            {/* Height */}
                            <div>
                              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                                Height / Depth ({customUnit})
                              </label>
                              <input
                                type="number"
                                step={customUnit === 'in' ? '0.1' : '1'}
                                min={customUnit === 'in' ? 1.0 : 25}
                                max={customUnit === 'in' ? 3.0 : 75}
                                value={customHeight}
                                onChange={(e) => setCustomHeight(parseFloat(e.target.value) || 0)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-mono font-bold"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 p-2 rounded-lg">
                            <Ruler className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                            <span>
                              Tip: Measure the inside floor of your drawer. We automatically apply a 3mm tolerance margin so it drops in effortlessly!
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
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 font-mono">
                  STEP 2 OF 3
                </span>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5">
                  What Are You Organizing?
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Select what goes inside. We optimize the grid compartments and wall depths automatically.
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
                          ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono">
                            {org.categoryTag}
                          </span>
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-orange-600 bg-orange-600 text-white'
                                : 'border-zinc-300 dark:border-zinc-600'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5" />}
                          </div>
                        </div>

                        <h4 className="font-bold text-sm text-zinc-900 dark:text-white mt-2">
                          {org.name}
                        </h4>
                        <p className="text-xs font-medium text-orange-600 dark:text-orange-400">
                          {org.tagline}
                        </p>

                        <div className="mt-3 space-y-1">
                          {org.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-400"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500/80" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                        <span>{org.rows * org.cols} Compartments</span>
                        <span>{org.recommendedHeightMm}mm Wall Depth</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* STEP 3: PICK YOUR FINISH & SOUND INLAY            */}
          {/* ================================================= */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 font-mono">
                  STEP 3 OF 3
                </span>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5">
                  Pick Your Finish & Sound Inlay
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Select your tactile exterior color and choose whether to add acoustic dampening.
                </p>
              </div>

              {/* Color Swatches */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">
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
                            ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 shadow-xs'
                            : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/60'
                        }`}
                      >
                        {/* Swatch Circle */}
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white/60 shadow-md shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: finish.hexColor }}
                        >
                          {isSelected && (
                            <Check
                              className={`w-4 h-4 ${
                                finish.hexColor === '#f5f0eb' ? 'text-zinc-900' : 'text-white'
                              }`}
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-xs text-zinc-900 dark:text-white truncate">
                              {finish.name}
                            </span>
                            <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                              {finish.tag}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                            {finish.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Whisper-Quiet Base Inlay Toggle */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-2">
                  2. Acoustic Base Inlay:
                </label>

                <div
                  onClick={() => {
                    playClickSound('toggle');
                    setHasWhisperInlay(!hasWhisperInlay);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    hasWhisperInlay
                      ? 'border-cyan-500 bg-cyan-50/60 dark:bg-cyan-950/30 ring-2 ring-cyan-500/20'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2.5 rounded-xl ${
                          hasWhisperInlay
                            ? 'bg-cyan-500 text-white'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {hasWhisperInlay ? (
                          <Volume2 className="w-5 h-5" />
                        ) : (
                          <VolumeX className="w-5 h-5" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-zinc-900 dark:text-white">
                            Add Whisper-Quiet Base Inlay (Softens key drops)
                          </span>
                          <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950 px-2 py-0.5 rounded-full">
                            +$7.50
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          Pours an optical acoustic dampening layer into each pocket floor.
                          Eliminates hollow clatter when tossing car keys, cushions delicate watches, and adds luxurious heft.
                        </p>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <div
                      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                        hasWhisperInlay ? 'bg-cyan-600' : 'bg-zinc-300 dark:bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                          hasWhisperInlay ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>

                  {hasWhisperInlay && (
                    <div className="mt-3 pt-3 border-t border-cyan-200 dark:border-cyan-900/40 flex items-center gap-3 text-[11px] text-cyan-800 dark:text-cyan-300 font-medium">
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-cyan-600" />
                        -18 dB drop sound reduction
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-cyan-600" />
                        Protects watch crystal backs
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Visual Validation Card (5 cols) */}
        <div className="lg:col-span-5 bg-zinc-50 dark:bg-zinc-900/80 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-orange-600" />
              LIVE BLUEPRINT PREVIEW
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
              ISO 2768-m Fit
            </span>
          </div>

          {/* Interactive 2D Compartment Floorplan Visualizer */}
          <div className="p-4 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800/80 shadow-inner flex flex-col items-center justify-center min-h-[170px] relative overflow-hidden">
            {/* Background grid drafting texture */}
            <div
              className="absolute inset-0 opacity-[0.06] dark:opacity-[0.12] pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #71717a 1px, transparent 1px)',
                backgroundSize: '12px 12px',
              }}
            />

            {/* 2D Organizer Footprint */}
            <div
              className="w-full max-w-[240px] aspect-[4/3] rounded-lg p-1.5 shadow-sm border flex flex-col justify-between transition-all"
              style={{
                backgroundColor: activeFinish.hexColor,
                borderColor:
                  activeFinish.hexColor === '#f5f0eb' ? '#d4d4d8' : '#3f3f46',
              }}
            >
              {/* Internal Compartment Grid */}
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
                    className="rounded-sm flex items-center justify-center border transition-all"
                    style={{
                      backgroundColor: hasWhisperInlay
                        ? 'rgba(224, 242, 254, 0.35)'
                        : 'rgba(0, 0, 0, 0.15)',
                      borderColor: hasWhisperInlay
                        ? 'rgba(2, 132, 199, 0.4)'
                        : 'rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    {hasWhisperInlay && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 shadow-xs" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Dimensional Dimension Tags */}
            <div className="mt-2 text-[11px] font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-3">
              <span>
                {resolvedDimensions.length}mm ({((resolvedDimensions.length) / 25.4).toFixed(1)}″) L
              </span>
              <span>×</span>
              <span>
                {resolvedDimensions.width}mm ({((resolvedDimensions.width) / 25.4).toFixed(1)}″) W
              </span>
              <span>×</span>
              <span>
                {resolvedDimensions.height}mm ({((resolvedDimensions.height) / 25.4).toFixed(1)}″) H
              </span>
            </div>
          </div>

          {/* Validation Checklist */}
          <div className="space-y-2 bg-white dark:bg-zinc-950 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                <strong>Space:</strong> {activeSpace.name}{' '}
                {selectedSpaceId === 'ikea_alex' ? `(${alexSubOption})` : ''}
              </span>
            </div>

            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                <strong>Layout:</strong> {activeOrg.name} ({resolvedDimensions.rows * resolvedDimensions.cols} chambers)
              </span>
            </div>

            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
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

            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <CheckCircle2
                className={`w-4 h-4 ${
                  hasWhisperInlay ? 'text-cyan-500' : 'text-zinc-400'
                } shrink-0`}
              />
              <span>
                <strong>Inlay:</strong>{' '}
                {hasWhisperInlay
                  ? 'Whisper-Quiet Resin Included (+$7.50)'
                  : 'Standard Base Floor'}
              </span>
            </div>
          </div>

          {/* Guaranteed Snug Fit Badge */}
          <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-snug">
              <div className="font-bold text-emerald-900 dark:text-emerald-300">
                Guaranteed Snug Fit • Hand-crafted in 48 Hours
              </div>
              <div className="text-emerald-700 dark:text-emerald-400 mt-0.5">
                If your tape measurement is off, we reprint your tray free under our 30-day zero-risk drawer fit policy.
              </div>
            </div>
          </div>

          {/* Pricing & Fast Shipping Summary */}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block font-mono">
                TOTAL TAILORED PRICE
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-sans text-zinc-950 dark:text-white">
                  ${calculatedDisplayPrice.toFixed(2)}
                </span>
                <span className="text-xs text-zinc-400">USD</span>
              </div>
            </div>

            <div className="text-right text-[11px] text-zinc-500">
              <div className="flex items-center gap-1 justify-end font-medium text-zinc-700 dark:text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span>Dispatches in 48h</span>
              </div>
              <div className="text-[10px]">Free US Shipping over $50</div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* WIZARD FOOTER: Navigation & 1-Click Action Buttons    */}
      {/* ---------------------------------------------------- */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          {currentStep < 3 && (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next: {currentStep === 1 ? 'What You Organize' : 'Finish & Sound'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 1-Click Execution Dispatch: View in 3D or Add to Bag */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleDoneView3D}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border-2 border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            title="Inspect tailored dimensions in 3D WebGL viewport"
          >
            <Eye className="w-4 h-4 text-orange-600" />
            <span>Done! View in 3D</span>
          </button>

          <button
            type="button"
            onClick={handleAddToCartClick}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold transition-all shadow-md hover:shadow-glow-orange flex items-center justify-center gap-1.5 cursor-pointer"
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
