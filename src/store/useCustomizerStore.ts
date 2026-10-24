/**
 * FORMGRID PARAMETRIC CUSTOMIZER REACTIVE STATE STORE
 * Real-time continuous dimension recalculation, telemetry pricing, wireframe mode,
 * iconic drawer presets & real-world drawer models calibration.
 */

import { create } from 'zustand';
import * as THREE from 'three';
import {
  ParametricOrganizerDimensions,
  MaterialOption,
  Product,
  CustomParametricSpecs,
} from '../types';
import { SEED_MATERIALS, SEED_PRODUCTS } from '../db/seed';
import { calculateSlicingTelemetry, SlicingTelemetry } from '../lib/parametricMath';
import { exportMeshToBinarySTL, triggerStlDownload } from '../lib/stlExporter';

export type LightingPreset =
  | 'morning'
  | 'studio'
  | 'evening'
  | 'daylight'
  | 'laboratory'
  | 'warm'
  | 'cyberpunk';
export type CustomizerViewMode = 'desk' | 'closeup';

export interface DrawerModel {
  id: string;
  name: string;
  brand: string;
  category: 'desk' | 'kitchen' | 'workshop';
  drawerWidthMm: number;
  drawerDepthMm: number;
  drawerHeightMm: number;
  compartments: {
    cols: number;
    rows: number;
  };
  recommendedPresetId: string;
  description: string;
}

export interface StudioBlueprintPreset {
  id: string;
  name: string;
  description: string;
  dimensions: ParametricOrganizerDimensions;
  materialId: string;
  resinId: string | null;
  engravedText: string;
  lightingPreset?: LightingPreset;
  drawerModelId?: string;
}

/**
 * ICONIC REAL-WORLD DRAWER MODELS
 * Calibrated precisely for real-world drawers and furniture lines
 */
export const DRAWER_MODELS: DrawerModel[] = [
  {
    id: 'drawer_ikea_alex_shallow',
    name: 'IKEA Alex Shallow Drawer',
    brand: 'IKEA',
    category: 'desk',
    drawerWidthMm: 290,
    drawerDepthMm: 520,
    drawerHeightMm: 50,
    compartments: { cols: 3, rows: 2 },
    recommendedPresetId: 'preset_ikea_alex_shallow',
    description: 'Iconic under-desk drawer unit (290 × 520 × 50 mm). 3x2 compartments for everyday desk stationery.',
  },
  {
    id: 'drawer_ikea_alex_deep',
    name: 'IKEA Alex Deep Drawer',
    brand: 'IKEA',
    category: 'desk',
    drawerWidthMm: 290,
    drawerDepthMm: 520,
    drawerHeightMm: 110,
    compartments: { cols: 2, rows: 2 },
    recommendedPresetId: 'preset_ikea_alex_deep',
    description: 'Deep bottom Alex drawer unit (290 × 520 × 110 mm). 2x2 compartments for bulky tech gear.',
  },
  {
    id: 'drawer_kitchen_cutlery',
    name: 'Kitchen Cutlery Tray',
    brand: 'Universal Kitchen',
    category: 'kitchen',
    drawerWidthMm: 320,
    drawerDepthMm: 480,
    drawerHeightMm: 55,
    compartments: { cols: 4, rows: 1 },
    recommendedPresetId: 'preset_kitchen_cutlery',
    description: 'Standard culinary flatware drawer insert (320 × 480 × 55 mm). 4 longitudinal channels.',
  },
  {
    id: 'drawer_compact_catchall',
    name: 'Compact Desk Catchall',
    brand: 'Wavezly Studio',
    category: 'desk',
    drawerWidthMm: 220,
    drawerDepthMm: 180,
    drawerHeightMm: 40,
    compartments: { cols: 2, rows: 1 },
    recommendedPresetId: 'preset_desk_catchall',
    description: 'Compact 2-compartment catchall (220 × 180 × 40 mm) for shallow desktop trays and EDC pocket dump.',
  },
  {
    id: 'drawer_workshop_gridfinity',
    name: 'Workshop Gridfinity Drawer',
    brand: 'Gridfinity Spec',
    category: 'workshop',
    drawerWidthMm: 400,
    drawerDepthMm: 300,
    drawerHeightMm: 50,
    compartments: { cols: 3, rows: 3 },
    recommendedPresetId: 'preset_workshop_gridfinity',
    description: 'Standard 3x3 modular hardware chest drawer (400 × 300 × 50 mm) for fasteners, calipers, and hand tools.',
  },
];

/**
 * REAL-WORLD ICONIC BLUEPRINT PRESETS
 * Calibrated dimensions, wall thicknesses, and compartment divisions
 */
export const BLUEPRINT_PRESETS: StudioBlueprintPreset[] = [
  {
    id: 'preset_ikea_alex_shallow',
    name: 'IKEA Alex Shallow Drawer',
    description: 'Iconic under-desk drawer fit (Width 290mm, Depth 520mm, Height 50mm, 3x2 compartments). Ideal for cables, pens, and desk essentials.',
    dimensions: {
      length: 290,
      width: 520,
      height: 50,
      wallThickness: 2.8,
      bottomThickness: 2.4,
      rows: 2,
      cols: 3,
      cornerFilletRadius: 6,
      inlayPocketDepth: 0,
    },
    materialId: 'mat_pla_obsidian',
    resinId: null,
    engravedText: 'IKEA ALEX // SHALLOW',
    lightingPreset: 'daylight',
    drawerModelId: 'drawer_ikea_alex_shallow',
  },
  {
    id: 'preset_ikea_alex_deep',
    name: 'IKEA Alex Deep Drawer',
    description: 'Deep bottom Alex drawer unit (Width 290mm, Depth 520mm, Height 110mm, 2x2 compartments). High-capacity bays for cameras, audio gear, and tools.',
    dimensions: {
      length: 290,
      width: 520,
      height: 110,
      wallThickness: 3.2,
      bottomThickness: 2.8,
      rows: 2,
      cols: 2,
      cornerFilletRadius: 8,
      inlayPocketDepth: 0,
    },
    materialId: 'mat_pla_concrete',
    resinId: null,
    engravedText: 'IKEA ALEX // DEEP',
    lightingPreset: 'warm',
    drawerModelId: 'drawer_ikea_alex_deep',
  },
  {
    id: 'preset_kitchen_cutlery',
    name: 'Kitchen Cutlery Tray',
    description: 'Standard culinary flatware insert (Width 320mm, Depth 480mm, Height 55mm, 4x1 compartments). Full-length channels for knives, forks, spoons, and utensils.',
    dimensions: {
      length: 320,
      width: 480,
      height: 55,
      wallThickness: 3.0,
      bottomThickness: 2.4,
      rows: 1,
      cols: 4,
      cornerFilletRadius: 10,
      inlayPocketDepth: 0,
    },
    materialId: 'mat_pla_studio_white',
    resinId: null,
    engravedText: 'KITCHEN // CUTLERY',
    lightingPreset: 'daylight',
    drawerModelId: 'drawer_kitchen_cutlery',
  },
  {
    id: 'preset_desk_catchall',
    name: 'Compact Desk Catchall',
    description: 'Space-saving EDC organizer (Width 220mm, Depth 180mm, Height 40mm, 2x1 compartments). Dual pocket dump for watch, keys, wallet, and AirPods.',
    dimensions: {
      length: 220,
      width: 180,
      height: 40,
      wallThickness: 2.8,
      bottomThickness: 2.4,
      rows: 1,
      cols: 2,
      cornerFilletRadius: 8,
      inlayPocketDepth: 2.5,
    },
    materialId: 'mat_pla_obsidian',
    resinId: 'mat_resin_cobalt',
    engravedText: 'DESK // CATCHALL',
    lightingPreset: 'laboratory',
    drawerModelId: 'drawer_compact_catchall',
  },
  {
    id: 'preset_workshop_gridfinity',
    name: 'Workshop Gridfinity Drawer',
    description: 'Heavy-duty modular chest drawer (Width 400mm, Depth 300mm, Height 50mm, 3x3 compartments). Rigid grid for M2/M3 screws, calipers, and hand tools.',
    dimensions: {
      length: 400,
      width: 300,
      height: 50,
      wallThickness: 3.2,
      bottomThickness: 2.6,
      rows: 3,
      cols: 3,
      cornerFilletRadius: 6,
      inlayPocketDepth: 0,
    },
    materialId: 'mat_pla_signal_orange',
    resinId: null,
    engravedText: 'WORKSHOP // GRIDFINITY',
    lightingPreset: 'cyberpunk',
    drawerModelId: 'drawer_workshop_gridfinity',
  },
];

export interface CustomizerStoreState {
  currentProduct: Product;
  dimensions: ParametricOrganizerDimensions;
  selectedMaterial: MaterialOption;
  selectedResin: MaterialOption | null;
  lightingPreset: LightingPreset;
  telemetry: SlicingTelemetry;
  meshRef: THREE.Group | null;
  isExportingStl: boolean;
  autoRotate: boolean;
  wireframe: boolean;
  engravedText: string;
  sliceHeight: number; // 0 to 100 percentage build height
  explodedOffset: number; // 0 to 80 mm lift for dividers and resin inlays

  // Drawer & Environmental View Mode State
  viewMode: 'desk' | 'closeup';
  isDrawerOpen: boolean;

  // Actions
  setDimension: (key: keyof ParametricOrganizerDimensions, value: number) => void;
  setDimensions: (dims: Partial<ParametricOrganizerDimensions>) => void;
  setMaterial: (material: MaterialOption) => void;
  setResin: (resin: MaterialOption | null) => void;
  setLightingPreset: (preset: LightingPreset) => void;
  setProduct: (product: Product) => void;
  setMeshRef: (group: THREE.Group) => void;
  toggleAutoRotate: () => void;
  toggleWireframe: () => void;
  setEngravedText: (text: string) => void;
  setSliceHeight: (val: number) => void;
  setExplodedOffset: (val: number) => void;
  setViewMode: (mode: 'desk' | 'closeup') => void;
  toggleDrawerOpen: () => void;
  setIsDrawerOpen: (isOpen: boolean) => void;
  applyPreset: (presetId: string) => void;
  resetDefaults: () => void;
  exportStlFile: (filename?: string) => Promise<{ blob: Blob; url: string }>;
  getCustomSpecs: () => CustomParametricSpecs;
}

const defaultProduct = SEED_PRODUCTS[0]; // Modular Desk Valet Pro
const defaultDims: ParametricOrganizerDimensions = {
  length: 290,
  width: 520,
  height: 50,
  wallThickness: 2.8,
  bottomThickness: 2.4,
  rows: 2,
  cols: 3,
  cornerFilletRadius: 6,
  inlayPocketDepth: 0,
};

const defaultFilament = SEED_MATERIALS[0]; // Obsidian Black
const defaultResin: MaterialOption | null = null; // No resin by default

const initialTelemetry = calculateSlicingTelemetry(defaultDims, defaultFilament, defaultResin);

export const useCustomizerStore = create<CustomizerStoreState>((set, get) => ({
  currentProduct: defaultProduct,
  dimensions: { ...defaultDims },
  selectedMaterial: defaultFilament,
  selectedResin: defaultResin,
  lightingPreset: 'daylight',
  telemetry: initialTelemetry,
  meshRef: null,
  isExportingStl: false,
  autoRotate: false,
  wireframe: false,
  engravedText: 'IKEA ALEX // SHALLOW',
  sliceHeight: 100,
  explodedOffset: 0,

  // Environmental Drawer & View Mode State
  viewMode: 'closeup',
  isDrawerOpen: true,

  setDimension: (key, value) => {
    const { dimensions, selectedMaterial, selectedResin } = get();
    let cleanVal = Math.round(value * 10) / 10;
    if (key === 'wallThickness') cleanVal = Math.max(2.4, Math.min(6.0, cleanVal));
    if (key === 'bottomThickness') cleanVal = Math.max(2.0, Math.min(8.0, cleanVal));
    if (key === 'rows') cleanVal = Math.max(1, Math.min(6, Math.round(cleanVal)));
    if (key === 'cols') cleanVal = Math.max(1, Math.min(8, Math.round(cleanVal)));

    const updatedDims = { ...dimensions, [key]: cleanVal };
    const updatedTelemetry = calculateSlicingTelemetry(updatedDims, selectedMaterial, selectedResin);

    set({
      dimensions: updatedDims,
      telemetry: updatedTelemetry,
    });
  },

  setDimensions: (partialDims) => {
    const { dimensions, selectedMaterial, selectedResin } = get();
    const updatedDims = { ...dimensions, ...partialDims };
    const updatedTelemetry = calculateSlicingTelemetry(updatedDims, selectedMaterial, selectedResin);
    set({
      dimensions: updatedDims,
      telemetry: updatedTelemetry,
    });
  },

  setMaterial: (material) => {
    const { dimensions, selectedResin } = get();
    const updatedTelemetry = calculateSlicingTelemetry(dimensions, material, selectedResin);
    set({
      selectedMaterial: material,
      telemetry: updatedTelemetry,
    });
  },

  setResin: (resin) => {
    const { dimensions, selectedMaterial } = get();
    const updatedTelemetry = calculateSlicingTelemetry(dimensions, selectedMaterial, resin);
    set({
      selectedResin: resin,
      telemetry: updatedTelemetry,
    });
  },

  setLightingPreset: (preset) => {
    set({ lightingPreset: preset });
  },

  setProduct: (product) => {
    if (product.defaultDimensions) {
      const { selectedMaterial, selectedResin } = get();
      const updatedTelemetry = calculateSlicingTelemetry(
        product.defaultDimensions,
        selectedMaterial,
        selectedResin
      );
      set({
        currentProduct: product,
        dimensions: { ...product.defaultDimensions },
        telemetry: updatedTelemetry,
      });
    } else {
      set({ currentProduct: product });
    }
  },

  setMeshRef: (group) => {
    set({ meshRef: group });
  },

  toggleAutoRotate: () => {
    set((state) => ({ autoRotate: !state.autoRotate }));
  },

  toggleWireframe: () => {
    set((state) => ({ wireframe: !state.wireframe }));
  },

  setEngravedText: (text) => {
    set({ engravedText: text.toUpperCase().substring(0, 24) });
  },

  setSliceHeight: (val) => {
    const clamped = Math.max(0, Math.min(100, Math.round(val)));
    set({ sliceHeight: clamped });
  },

  setExplodedOffset: (val) => {
    const clamped = Math.max(0, Math.min(80, Math.round(val)));
    set({ explodedOffset: clamped });
  },

  setViewMode: (mode) => {
    set({ viewMode: mode });
  },

  toggleDrawerOpen: () => {
    set((state) => ({ isDrawerOpen: !state.isDrawerOpen }));
  },

  setIsDrawerOpen: (isOpen) => {
    set({ isDrawerOpen: isOpen });
  },

  applyPreset: (presetId) => {
    // Map legacy or shorthand IDs
    const legacyMap: Record<string, string> = {
      preset_edc_valet: 'preset_desk_catchall',
      preset_keeb_station: 'preset_workshop_gridfinity',
      preset_audio_plinth: 'preset_ikea_alex_deep',
      preset_maker_bench: 'preset_workshop_gridfinity',
      preset_fountain_pen: 'preset_desk_catchall',
      preset_ikea_alex: 'preset_ikea_alex_shallow',
      preset_cutlery: 'preset_kitchen_cutlery',
      preset_catchall: 'preset_desk_catchall',
    };

    const targetId = legacyMap[presetId] || presetId;
    const preset = BLUEPRINT_PRESETS.find((p) => p.id === targetId) || BLUEPRINT_PRESETS[0];

    const filament =
      SEED_MATERIALS.find((m) => m.id === preset.materialId) || get().selectedMaterial;
    const resin = preset.resinId
      ? SEED_MATERIALS.find((m) => m.id === preset.resinId) || null
      : null;

    const telemetry = calculateSlicingTelemetry(preset.dimensions, filament, resin);

    set({
      dimensions: { ...preset.dimensions },
      selectedMaterial: filament,
      selectedResin: resin,
      lightingPreset: preset.lightingPreset || get().lightingPreset,
      engravedText: preset.engravedText,
      sliceHeight: 100,
      explodedOffset: 0,
      telemetry,
    });
  },

  resetDefaults: () => {
    const { currentProduct } = get();
    const dims = currentProduct.defaultDimensions || defaultDims;
    const telemetry = calculateSlicingTelemetry(dims, defaultFilament, null);
    set({
      dimensions: { ...dims },
      selectedMaterial: defaultFilament,
      selectedResin: null,
      lightingPreset: 'daylight',
      wireframe: false,
      engravedText: 'IKEA ALEX // SHALLOW',
      sliceHeight: 100,
      explodedOffset: 0,
      viewMode: 'closeup',
      isDrawerOpen: true,
      telemetry,
    });
  },

  exportStlFile: async (filename) => {
    const { meshRef, currentProduct } = get();
    if (!meshRef) {
      throw new Error('3D Mesh viewport is not initialized or still compiling.');
    }

    set({ isExportingStl: true });
    try {
      const safeFilename = filename || `${currentProduct.slug}-${Date.now()}.stl`;
      const result = await exportMeshToBinarySTL(meshRef);
      triggerStlDownload(result.blob, safeFilename);
      return { blob: result.blob, url: result.objectUrl };
    } finally {
      set({ isExportingStl: false });
    }
  },

  getCustomSpecs: () => {
    const { dimensions, selectedMaterial, selectedResin, telemetry } = get();
    return {
      dimensions: { ...dimensions },
      material: selectedMaterial,
      resinInlay: selectedResin,
      volumePlasticCm3: telemetry.plasticVolumeCm3,
      volumeResinCm3: telemetry.resinVolumeCm3,
      estimatedGrams: telemetry.totalWeightGrams,
      estimatedPrintHours: telemetry.estimatedPrintHours,
      totalManufacturingCost: telemetry.finalPriceUsd,
    };
  },
}));
