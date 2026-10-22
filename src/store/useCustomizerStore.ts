/**
 * FORMGRID PARAMETRIC CUSTOMIZER REACTIVE STATE STORE
 * Real-time continuous dimension recalculation, telemetry pricing, wireframe mode, and preset blueprints
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

export interface StudioBlueprintPreset {
  id: string;
  name: string;
  description: string;
  dimensions: ParametricOrganizerDimensions;
  materialId: string;
  resinId: string | null;
  engravedText: string;
}

export const BLUEPRINT_PRESETS: StudioBlueprintPreset[] = [
  {
    id: 'preset_edc_valet',
    name: 'EDC Pocket Dump & Watch Stand',
    description: 'Optimized for watch cushions, titanium folding knives, wallet, and keys.',
    dimensions: {
      length: 175,
      width: 125,
      height: 38,
      wallThickness: 2.8,
      bottomThickness: 2.4,
      rows: 2,
      cols: 3,
      cornerFilletRadius: 8,
      inlayPocketDepth: 2.5,
    },
    materialId: 'mat_pla_obsidian',
    resinId: 'mat_resin_cobalt',
    engravedText: 'EDC-VALET // 01',
  },
  {
    id: 'preset_keeb_station',
    name: 'Mechanical Keyboard Switch Matrix',
    description: 'High-density compartments for MX switch stems, springs, lubes, and keycaps.',
    dimensions: {
      length: 220,
      width: 140,
      height: 32,
      wallThickness: 3.0,
      bottomThickness: 2.4,
      rows: 3,
      cols: 5,
      cornerFilletRadius: 6,
      inlayPocketDepth: 0,
    },
    materialId: 'mat_pla_concrete',
    resinId: null,
    engravedText: 'KEEB-LAB // 68%',
  },
  {
    id: 'preset_audio_plinth',
    name: 'Audiophile DAC & IEM Dock',
    description: 'Heavy dampening walls for desktop headphone amplifiers and 3.5mm/4.4mm adapters.',
    dimensions: {
      length: 190,
      width: 130,
      height: 44,
      wallThickness: 3.4,
      bottomThickness: 2.8,
      rows: 2,
      cols: 2,
      cornerFilletRadius: 10,
      inlayPocketDepth: 3.0,
    },
    materialId: 'mat_pla_obsidian',
    resinId: 'mat_resin_amber',
    engravedText: 'AUDIO-PLINTH // 32BIT',
  },
  {
    id: 'preset_maker_bench',
    name: 'Precision Hardware & SMD Matrix',
    description: 'Deep anti-spill chambers for M2/M3 screws, soldering tips, and tweezers.',
    dimensions: {
      length: 240,
      width: 160,
      height: 48,
      wallThickness: 3.2,
      bottomThickness: 2.6,
      rows: 3,
      cols: 4,
      cornerFilletRadius: 6,
      inlayPocketDepth: 0,
    },
    materialId: 'mat_pla_signal_orange',
    resinId: null,
    engravedText: 'MAKER-BENCH // M2-M3',
  },
  {
    id: 'preset_fountain_pen',
    name: 'Minimalist Calligraphy & Pen Dock',
    description: 'Long longitudinal chambers with optical clear resin dampening bed for fine fountain pens.',
    dimensions: {
      length: 150,
      width: 75,
      height: 26,
      wallThickness: 2.8,
      bottomThickness: 2.2,
      rows: 1,
      cols: 3,
      cornerFilletRadius: 10,
      inlayPocketDepth: 2.0,
    },
    materialId: 'mat_pla_studio_white',
    resinId: 'mat_resin_clear',
    engravedText: 'PEN-DOCK // ROTRING',
  },
];

export interface CustomizerStoreState {
  currentProduct: Product;
  dimensions: ParametricOrganizerDimensions;
  selectedMaterial: MaterialOption;
  selectedResin: MaterialOption | null;
  telemetry: SlicingTelemetry;
  meshRef: THREE.Group | null;
  isExportingStl: boolean;
  autoRotate: boolean;
  wireframe: boolean;
  engravedText: string;

  // Actions
  setDimension: (key: keyof ParametricOrganizerDimensions, value: number) => void;
  setDimensions: (dims: Partial<ParametricOrganizerDimensions>) => void;
  setMaterial: (material: MaterialOption) => void;
  setResin: (resin: MaterialOption | null) => void;
  setProduct: (product: Product) => void;
  setMeshRef: (group: THREE.Group) => void;
  toggleAutoRotate: () => void;
  toggleWireframe: () => void;
  setEngravedText: (text: string) => void;
  applyPreset: (presetId: string) => void;
  resetDefaults: () => void;
  exportStlFile: (filename?: string) => Promise<{ blob: Blob; url: string }>;
  getCustomSpecs: () => CustomParametricSpecs;
}

const defaultProduct = SEED_PRODUCTS[0]; // Modular Desk Valet Pro
const defaultDims: ParametricOrganizerDimensions = {
  length: 160,
  width: 120,
  height: 40,
  wallThickness: 2.8,
  bottomThickness: 2.4,
  rows: 2,
  cols: 3,
  cornerFilletRadius: 8,
  inlayPocketDepth: 2.5,
};

const defaultFilament = SEED_MATERIALS[0]; // Obsidian Black
const defaultResin: MaterialOption | null = null; // No resin by default

const initialTelemetry = calculateSlicingTelemetry(defaultDims, defaultFilament, defaultResin);

export const useCustomizerStore = create<CustomizerStoreState>((set, get) => ({
  currentProduct: defaultProduct,
  dimensions: { ...defaultDims },
  selectedMaterial: defaultFilament,
  selectedResin: defaultResin,
  telemetry: initialTelemetry,
  meshRef: null,
  isExportingStl: false,
  autoRotate: false,
  wireframe: false,
  engravedText: 'FORMGRID // 01',

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

  applyPreset: (presetId) => {
    const preset = BLUEPRINT_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

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
      engravedText: preset.engravedText,
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
      wireframe: false,
      engravedText: 'FORMGRID // 01',
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
