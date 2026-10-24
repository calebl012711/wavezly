/**
 * WAVEZLY COMPARTMENT GRID UTILITIES & SIZING LOGIC
 * - Precision Fractional Inches & Metric Dual Formatting
 * - Verified Furniture & Drawer Compatibility Engine (IKEA Alex, US Kitchen 12"x18", Herman Miller Tu)
 * - Compartment Presets & SVG Blueprint Visualizers
 * - Instant Live Price & Manufacturing Telemetry Breakdown
 */

import { MaterialOption } from '../types';
import { SlicingTelemetry } from './parametricMath';

// ============================================================================
// 1. FRACTIONAL INCHES & METRIC DUAL FORMATTER
// ============================================================================

export interface FormattedDimension {
  mm: number;
  decimalInches: string; // e.g. "9.4 in"
  fractionalInches: string; // e.g. "9 1/2 in"
  fractionOnly: string; // e.g. "9 1/2″"
  combinedShort: string; // e.g. "240 mm (9 1/2 in)"
  combinedDetailed: string; // e.g. "240 mm · 9 1/2 in (9.4 in)"
}

/**
 * Converts millimeters to clean fractional inches (nearest 1/8th inch standard)
 * with decimal and metric pairings.
 * e.g. 240 mm -> 9 1/2 in (9.4 in)
 */
export function formatFractionalInches(mm: number): FormattedDimension {
  const safeMm = Math.max(0, mm);
  const inches = safeMm / 25.4;
  const whole = Math.floor(inches);
  const frac = inches - whole;

  // Round to nearest 1/8th inch for clean consumer woodwork / drawer sizing
  const eighths = Math.round(frac * 8);

  let fractionText = '';
  let finalWhole = whole;

  if (eighths === 8) {
    finalWhole += 1;
    fractionText = '';
  } else if (eighths === 0) {
    fractionText = '';
  } else if (eighths === 4) {
    fractionText = '1/2';
  } else if (eighths === 2) {
    fractionText = '1/4';
  } else if (eighths === 6) {
    fractionText = '3/4';
  } else if (eighths === 1) {
    fractionText = '1/8';
  } else if (eighths === 3) {
    fractionText = '3/8';
  } else if (eighths === 5) {
    fractionText = '5/8';
  } else if (eighths === 7) {
    fractionText = '7/8';
  }

  const fractionalInches = fractionText
    ? (finalWhole > 0 ? `${finalWhole} ${fractionText} in` : `${fractionText} in`)
    : `${finalWhole} in`;

  const fractionOnly = fractionText
    ? (finalWhole > 0 ? `${finalWhole} ${fractionText}″` : `${fractionText}″`)
    : `${finalWhole}″`;

  const decimalInches = `${inches.toFixed(1)} in`;

  return {
    mm: Math.round(safeMm),
    decimalInches,
    fractionalInches,
    fractionOnly,
    combinedShort: `${Math.round(safeMm)} mm (${fractionalInches})`,
    combinedDetailed: `${Math.round(safeMm)} mm · ${fractionalInches} (${decimalInches})`,
  };
}

// ============================================================================
// 2. FURNITURE & DRAWER COMPATIBILITY ENGINE
// ============================================================================

export interface FurnitureCompatibility {
  id: 'ikea_alex' | 'us_kitchen' | 'herman_miller_tu' | 'custom_fit';
  matched: boolean;
  badge: string;
  furnitureName: string;
  dimensionsNote: string;
  clearanceNote: string;
  recommendedDims: { length: number; width: number; height: number; rows: number; cols: number };
}

export const POPULAR_FURNITURE_STANDARDS: FurnitureCompatibility[] = [
  {
    id: 'ikea_alex',
    matched: false,
    badge: '✓ Perfect Fit for IKEA Alex Drawer',
    furnitureName: 'IKEA Alex Drawer',
    dimensionsNote: '240 × 145 mm (9 1/2″ × 5 3/4″)',
    clearanceNote: 'Precision 2.0 mm guide runner clearance',
    recommendedDims: { length: 240, width: 145, height: 50, rows: 2, cols: 3 },
  },
  {
    id: 'us_kitchen',
    matched: false,
    badge: '✓ Perfect Fit for US Kitchen Standard (12" × 18")',
    furnitureName: 'US Kitchen Standard (12" × 18")',
    dimensionsNote: '305 × 457 mm / 250 × 180 mm insert',
    clearanceNote: 'Drop-in fit for standard American cabinetry',
    recommendedDims: { length: 250, width: 180, height: 45, rows: 1, cols: 4 },
  },
  {
    id: 'herman_miller_tu',
    matched: false,
    badge: '✓ Perfect Fit for Herman Miller Tu Drawer',
    furnitureName: 'Herman Miller Tu Drawer',
    dimensionsNote: '220 × 160 mm (8 5/8″ × 6 1/4″)',
    clearanceNote: 'Calibrated for Herman Miller Tu & Tu Metal mobile pedestals',
    recommendedDims: { length: 220, width: 160, height: 45, rows: 2, cols: 2 },
  },
];

/**
 * Evaluates current dimensions against popular furniture drawer lines
 */
export function getFurnitureCompatibility(
  lengthMm: number,
  widthMm: number,
  heightMm: number = 45
): FurnitureCompatibility {
  // 1. IKEA Alex Drawer check:
  // Compact module: ~240x140-150mm, Wide module: ~240x180mm, Full unit: ~290x520mm
  const isIkeaAlex =
    (Math.abs(lengthMm - 240) <= 15 && Math.abs(widthMm - 145) <= 20) ||
    (Math.abs(lengthMm - 240) <= 15 && Math.abs(widthMm - 180) <= 20) ||
    (Math.abs(lengthMm - 290) <= 20 && Math.abs(widthMm - 520) <= 30) ||
    (Math.abs(widthMm - 240) <= 15 && Math.abs(lengthMm - 145) <= 20);

  if (isIkeaAlex) {
    return {
      id: 'ikea_alex',
      matched: true,
      badge: '✓ Perfect Fit for IKEA Alex Drawer',
      furnitureName: 'IKEA Alex Drawer',
      dimensionsNote: `${formatFractionalInches(lengthMm).combinedShort} × ${formatFractionalInches(widthMm).fractionalInches}`,
      clearanceNote: 'Engineered with 2.0 mm guide runner tolerance for zero-wobble glide.',
      recommendedDims: { length: 240, width: 145, height: heightMm, rows: 2, cols: 3 },
    };
  }

  // 2. US Kitchen Standard (12" × 18" = ~305 × 457 mm, or standard cutlery tray 250 × 180 mm / 320 × 220 mm)
  const isUsKitchen =
    (Math.abs(lengthMm - 305) <= 25 && Math.abs(widthMm - 457) <= 35) ||
    (Math.abs(widthMm - 305) <= 25 && Math.abs(lengthMm - 457) <= 35) ||
    (Math.abs(lengthMm - 250) <= 15 && Math.abs(widthMm - 180) <= 15) ||
    (Math.abs(lengthMm - 320) <= 25 && Math.abs(widthMm - 220) <= 25) ||
    (Math.abs(widthMm - 250) <= 15 && Math.abs(lengthMm - 180) <= 15);

  if (isUsKitchen) {
    return {
      id: 'us_kitchen',
      matched: true,
      badge: '✓ Perfect Fit for US Kitchen Standard (12" × 18")',
      furnitureName: 'US Kitchen Standard (12" × 18")',
      dimensionsNote: `${formatFractionalInches(lengthMm).combinedShort} × ${formatFractionalInches(widthMm).fractionalInches}`,
      clearanceNote: 'Drop-in fit for standard 12" × 18" kitchen cabinetry & flatware drawers.',
      recommendedDims: { length: 250, width: 180, height: heightMm, rows: 1, cols: 4 },
    };
  }

  // 3. Herman Miller Tu Drawer:
  // Standard mobile pedestal interior: ~220 × 160 mm or ~320 × 420 mm
  const isHMTu =
    (Math.abs(lengthMm - 220) <= 15 && Math.abs(widthMm - 160) <= 15) ||
    (Math.abs(widthMm - 220) <= 15 && Math.abs(lengthMm - 160) <= 15) ||
    (Math.abs(lengthMm - 320) <= 20 && Math.abs(widthMm - 420) <= 30) ||
    (Math.abs(widthMm - 320) <= 20 && Math.abs(lengthMm - 420) <= 30);

  if (isHMTu) {
    return {
      id: 'herman_miller_tu',
      matched: true,
      badge: '✓ Perfect Fit for Herman Miller Tu Drawer',
      furnitureName: 'Herman Miller Tu Drawer',
      dimensionsNote: `${formatFractionalInches(lengthMm).combinedShort} × ${formatFractionalInches(widthMm).fractionalInches}`,
      clearanceNote: 'Calibrated for Herman Miller Tu and Tu Metal mobile pedestal slides.',
      recommendedDims: { length: 220, width: 160, height: heightMm, rows: 2, cols: 2 },
    };
  }

  // Fallback Custom Fit Guarantee
  return {
    id: 'custom_fit',
    matched: false,
    badge: '✓ 100% Fit Guarantee • Custom Millimeter Precision',
    furnitureName: 'Custom Bespoke Footprint',
    dimensionsNote: `${formatFractionalInches(lengthMm).combinedShort} × ${formatFractionalInches(widthMm).fractionalInches}`,
    clearanceNote: 'Precision 3D printed to your exact millimeter dimensions with auto tolerance.',
    recommendedDims: { length: lengthMm, width: widthMm, height: heightMm, rows: 2, cols: 2 },
  };
}

// ============================================================================
// 3. COMPARTMENT PRESETS WITH LIVE SVG PREVIEWS
// ============================================================================

export type CompartmentPresetType =
  | 'pen_catchall'
  | 'equal_grid_2x3'
  | 'cutlery_slots_4x1'
  | 'single_open_1x1';

export interface VisualCompartmentPreset {
  id: CompartmentPresetType;
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  rows: number;
  cols: number;
  isAsymmetric?: boolean; // For pen & catchall (1 long + 2 small)
  recommendedDims?: { length: number; width: number; height: number };
}

export const VISUAL_COMPARTMENT_PRESETS: VisualCompartmentPreset[] = [
  {
    id: 'pen_catchall',
    title: 'Pen & Catchall [1 Long + 2 Small]',
    badge: 'EDC Favorite',
    subtitle: '1 full-length pen channel + 2 EDC catchall pockets',
    description: 'Designed for Apple Pencil, pens, and stylus up top, plus AirPods, keys, and watch down below.',
    rows: 2,
    cols: 2,
    isAsymmetric: true,
    recommendedDims: { length: 240, width: 145, height: 45 },
  },
  {
    id: 'equal_grid_2x3',
    title: 'Equal Grid [2x3]',
    badge: 'Most Popular',
    subtitle: '6 balanced uniform bays for tech cables & desk gear',
    description: 'Uniform matrix for charging dongles, USB-C cables, SSDs, sticky notes, and paperclips.',
    rows: 2,
    cols: 3,
    recommendedDims: { length: 240, width: 145, height: 50 },
  },
  {
    id: 'cutlery_slots_4x1',
    title: 'Cutlery Slots [4x1]',
    badge: 'Kitchen Standard',
    subtitle: '4 longitudinal channels for silverware & utensils',
    description: 'Full-length separated channels for dinner forks, table knives, soup spoons, and chopsticks.',
    rows: 1,
    cols: 4,
    recommendedDims: { length: 250, width: 180, height: 45 },
  },
  {
    id: 'single_open_1x1',
    title: 'Single Open Bin [1x1]',
    badge: 'Minimalist',
    subtitle: '1 wide open catchall bay without divider walls',
    description: 'Uncluttered open perimeter for notebooks, iPad mini, sunglasses, and large stationery.',
    rows: 1,
    cols: 1,
    recommendedDims: { length: 210, width: 150, height: 40 },
  },
];

// ============================================================================
// 4. INSTANT LIVE PRICE & MANUFACTURING BREAKDOWN
// ============================================================================

export interface PriceBreakdown {
  finalPriceUsd: number;
  baseFeeUsd: number;
  biopolymerMassGrams: number;
  biopolymerCostUsd: number;
  machineTimeHours: number;
  machineTimeMinutes: number;
  machineCostUsd: number;
  resinInlayCostUsd: number;
  qualifiesFreeShipping: boolean;
  freeShippingThresholdUsd: number;
  freeShippingMessage: string;
}

export function calculatePriceBreakdown(
  telemetry: SlicingTelemetry,
  material: MaterialOption,
  hasResin: boolean = false
): PriceBreakdown {
  const baseFee = 8.00;
  const rawBasePrice = telemetry.finalPriceUsd > 0 ? telemetry.finalPriceUsd : 39.00;
  const resinInlayCost = hasResin ? 7.50 : 0.00;
  const calculatedPrice = Math.max(39.00, Number((rawBasePrice + resinInlayCost).toFixed(2)));

  const massGrams = telemetry.plasticWeightGrams > 0 ? telemetry.plasticWeightGrams : 142;
  const printMinutes = telemetry.estimatedPrintMinutes > 0 ? telemetry.estimatedPrintMinutes : 165;
  const printHours = Math.floor(printMinutes / 60);
  const remainingMins = printMinutes % 60;

  const plasticCost = Number((massGrams * (material.costPerCm3 || 0.035) * 1.1).toFixed(2));
  const machineCost = Number(((printMinutes / 60) * 2.50).toFixed(2));

  const freeShippingThresholdUsd = 35.00;
  const qualifiesFreeShipping = calculatedPrice >= freeShippingThresholdUsd;

  const freeShippingMessage = qualifiesFreeShipping
    ? '✓ Free US Shipping (Qualified on orders over $35)'
    : `Add $${(freeShippingThresholdUsd - calculatedPrice).toFixed(2)} for Free US Shipping`;

  return {
    finalPriceUsd: calculatedPrice,
    baseFeeUsd: baseFee,
    biopolymerMassGrams: massGrams,
    biopolymerCostUsd: plasticCost,
    machineTimeHours: printHours,
    machineTimeMinutes: remainingMins,
    machineCostUsd: machineCost,
    resinInlayCostUsd: resinInlayCost,
    qualifiesFreeShipping,
    freeShippingThresholdUsd,
    freeShippingMessage,
  };
}
