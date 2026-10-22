/**
 * FORMGRID PARAMETRIC SLICING HEURISTICS & VOLUME CALCULATOR
 * Mathematical models for continuous volume, layer slicing estimation, and dynamic pricing
 */

import { ParametricOrganizerDimensions, MaterialOption } from '../types';

export interface SlicingTelemetry {
  exteriorVolumeMm3: number;
  cavitiesVolumeMm3: number;
  plasticVolumeCm3: number;
  resinVolumeCm3: number;
  plasticWeightGrams: number;
  resinWeightGrams: number;
  totalWeightGrams: number;
  estimatedPrintMinutes: number;
  estimatedPrintHours: number;
  baseFee: number;
  plasticCost: number;
  resinCost: number;
  machineHourlyCost: number;
  finalPriceUsd: number;
  cellDimensions: {
    lengthMm: number;
    widthMm: number;
    depthMm: number;
  };
}

/**
 * Standard Print Farm Parameters (Bambu Lab / Slant 3D farm baseline)
 * - Volumetric flow rate: 15 mm^3/sec average on 0.4mm hardened steel nozzle
 * - Layer height: 0.20 mm
 * - Perimeter count: 3 (1.2mm solid shell)
 * - Infill density: 18% gyroid
 * - Bed heatup & purge calibration: 6 minutes
 */
const BASE_FEE_USD = 8.00;
const MACHINE_RATE_PER_HOUR_USD = 2.50;
const VOLUMETRIC_FLOW_RATE_MM3_SEC = 15.0; // mm^3/s
const CALIBRATION_OVERHEAD_MINUTES = 6.0;

/**
 * Compute rounded corner rectangular volume offset
 * Area of rounded rect = L*W - (4 - PI)*r^2
 */
function computeRoundedRectArea(length: number, width: number, radius: number): number {
  const clampedRadius = Math.min(radius, length / 2, width / 2);
  const cornerCutout = (4 - Math.PI) * Math.pow(clampedRadius, 2);
  return (length * width) - cornerCutout;
}

/**
 * Perform complete mathematical slicing heuristics and pricing evaluation
 */
export function calculateSlicingTelemetry(
  dimensions: ParametricOrganizerDimensions,
  plasticMaterial: MaterialOption,
  resinMaterial: MaterialOption | null
): SlicingTelemetry {
  const {
    length,
    width,
    height,
    wallThickness,
    bottomThickness,
    rows,
    cols,
    cornerFilletRadius,
    inlayPocketDepth = 0,
  } = dimensions;

  // 1. Exterior Bounding Volume (accounting for corner fillets)
  const outerFootprintArea = computeRoundedRectArea(length, width, cornerFilletRadius);
  const exteriorVolumeMm3 = outerFootprintArea * height;

  // 2. Interior Compartment Grid Dimensions
  // Total dividers: (cols - 1) vertical, (rows - 1) horizontal
  const totalLengthDividers = Math.max(0, cols - 1);
  const totalWidthDividers = Math.max(0, rows - 1);

  const availableLengthForCells = length - (2 * wallThickness) - (totalLengthDividers * wallThickness);
  const availableWidthForCells = width - (2 * wallThickness) - (totalWidthDividers * wallThickness);

  const cellLength = Math.max(10, availableLengthForCells / Math.max(1, cols));
  const cellWidth = Math.max(10, availableWidthForCells / Math.max(1, rows));
  const cellDepth = Math.max(5, height - bottomThickness);

  // Corner fillet for inside pocket cells
  const innerCellFillet = Math.max(1, cornerFilletRadius * 0.4);
  const singleCellArea = computeRoundedRectArea(cellLength, cellWidth, innerCellFillet);
  const totalCellsCount = rows * cols;
  const cavitiesVolumeMm3 = totalCellsCount * singleCellArea * cellDepth;

  // 3. Net Plastic Shell Volume in mm^3 and cm^3
  // Net volume is outer shell minus cavities
  const netPlasticVolumeMm3 = Math.max(1000, exteriorVolumeMm3 - cavitiesVolumeMm3);
  const plasticVolumeCm3 = Number((netPlasticVolumeMm3 / 1000).toFixed(2));

  // 4. Resin Inlay Volume (if resin material chosen and pocket depth > 0)
  let resinVolumeCm3 = 0;
  if (resinMaterial && inlayPocketDepth > 0) {
    const activeResinDepth = Math.min(inlayPocketDepth, cellDepth * 0.5);
    const totalResinMm3 = totalCellsCount * singleCellArea * activeResinDepth;
    resinVolumeCm3 = Number((totalResinMm3 / 1000).toFixed(2));
  }

  // 5. Weight Estimation
  const plasticDensity = plasticMaterial.densityGramsPerCm3 || 1.24;
  const resinDensity = resinMaterial?.densityGramsPerCm3 || 1.15;
  const plasticWeightGrams = Number((plasticVolumeCm3 * plasticDensity).toFixed(1));
  const resinWeightGrams = Number((resinVolumeCm3 * resinDensity).toFixed(1));
  const totalWeightGrams = Number((plasticWeightGrams + resinWeightGrams).toFixed(1));

  // 6. Print Time Estimation Heuristic
  // Outer perimeter (100% solid) + bottom floor (100% solid) + gyroid infill (18%)
  const floorVolumeMm3 = outerFootprintArea * bottomThickness;
  const wallsVolumeMm3 = netPlasticVolumeMm3 - floorVolumeMm3;
  // Effective extruded volume assuming 18% gyroid infill for interior core
  const effectiveExtrusionVolumeMm3 = floorVolumeMm3 + (wallsVolumeMm3 * 0.45);
  
  const extrusionSeconds = effectiveExtrusionVolumeMm3 / VOLUMETRIC_FLOW_RATE_MM3_SEC;
  const totalPrintMinutes = Math.round((extrusionSeconds / 60) + CALIBRATION_OVERHEAD_MINUTES);
  const estimatedPrintHours = Number((totalPrintMinutes / 60).toFixed(2));

  // 7. Manufacturing Pricing Formula:
  // Price = BaseFee ($8.00) + (V_plastic * MaterialCostPerCm3) + (V_resin * ResinCostPerCm3) + (EstHours * $2.50)
  const plasticUnitCost = plasticMaterial.costPerCm3 || 0.035;
  const resinUnitCost = resinMaterial?.costPerCm3 || 0.080;

  const plasticCost = Number((plasticVolumeCm3 * plasticUnitCost).toFixed(2));
  const resinCost = Number((resinVolumeCm3 * resinUnitCost).toFixed(2));
  const machineHourlyCost = Number((estimatedPrintHours * MACHINE_RATE_PER_HOUR_USD).toFixed(2));

  const rawFinalPrice = BASE_FEE_USD + plasticCost + resinCost + machineHourlyCost;
  // Round to high-end industrial price point (e.g. *.00 or *.50)
  const finalPriceUsd = Number(rawFinalPrice.toFixed(2));

  return {
    exteriorVolumeMm3,
    cavitiesVolumeMm3,
    plasticVolumeCm3,
    resinVolumeCm3,
    plasticWeightGrams,
    resinWeightGrams,
    totalWeightGrams,
    estimatedPrintMinutes: totalPrintMinutes,
    estimatedPrintHours,
    baseFee: BASE_FEE_USD,
    plasticCost,
    resinCost,
    machineHourlyCost,
    finalPriceUsd,
    cellDimensions: {
      lengthMm: Number(cellLength.toFixed(1)),
      widthMm: Number(cellWidth.toFixed(1)),
      depthMm: Number(cellDepth.toFixed(1)),
    },
  };
}

/**
 * Format hours and minutes to concise monospaced industrial telemetry
 */
export function formatPrintTime(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h ${mins.toString().padStart(2, '0')}m`;
}
