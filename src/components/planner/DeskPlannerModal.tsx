/**
 * FORMGRID SPATIAL DESK PLANNER MODAL
 * Interactive 2D drag-and-drop top-down layout canvas for bespoke workspace architecture.
 * Features real-time CAD coordinate scaling, surface utilization telemetry,
 * dead space reduction analytics, collision detection, and 1-click split-cart bundling.
 *
 * Dieter Rams Industrial Aesthetic:
 * - 100mm / 50mm drafting paper grid
 * - High-contrast telemetry gauges
 * - Tactile microswitch sound effects
 * - ISO 2768-m millimeter precision
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  X,
  RotateCw,
  Trash2,
  Copy,
  Sparkles,
  ShoppingBag,
  AlertTriangle,
  CheckCircle2,
  Grid,
  Magnet,
  ZoomIn,
  ZoomOut,
  Check,
  Package,
  Cpu,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { playClickSound } from '../../lib/soundEffects';
import {
  DeskItemDef,
  PlacedDeskItem,
  DESK_ITEMS_CATALOG,
  DESK_ITEMS_MAP,
  DESK_SIZE_PRESETS,
  DESK_SURFACE_FINISHES,
  CURATED_LAYOUT_TEMPLATES,
  checkCollisionsAndBounds,
  calculateSpatialTelemetry,
  resolveCartProduct,
  createDefaultSpecsFor3DItem,
} from './deskPlannerData';

interface DeskPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeskPlannerModal: React.FC<DeskPlannerModalProps> = ({ isOpen, onClose }) => {
  const { addCustomItem, addStandardItem, openCart } = useCartStore();

  // Desk Configuration State
  const [selectedSizePreset, setSelectedSizePreset] = useState<string>('size_1600');
  const [deskWidthMm, setDeskWidthMm] = useState<number>(1600);
  const [deskDepthMm, setDeskDepthMm] = useState<number>(800);
  const [selectedFinishId, setSelectedFinishId] = useState<string>('finish_obsidian');

  // Interactive Canvas State
  const [placedItems, setPlacedItems] = useState<PlacedDeskItem[]>(
    CURATED_LAYOUT_TEMPLATES[0].items
  );
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [snapGridSizeMm] = useState<number>(10);
  const [zoomFactor, setZoomFactor] = useState<number>(1.0);
  const [activeTab, setActiveTab] = useState<'catalog' | 'presets' | 'surface' | 'telemetry'>('catalog');
  const [addedToCartToast, setAddedToCartToast] = useState<boolean>(false);

  // Dragging State
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{
    instanceId: string;
    startX: number;
    startY: number;
    itemStartX: number;
    itemStartY: number;
  } | null>(null);

  // Surface finish object
  const currentFinish = useMemo(
    () => DESK_SURFACE_FINISHES.find((f) => f.id === selectedFinishId) || DESK_SURFACE_FINISHES[0],
    [selectedFinishId]
  );

  // Collision and Boundary Telemetry
  const collisionResult = useMemo(
    () => checkCollisionsAndBounds(placedItems, deskWidthMm, deskDepthMm),
    [placedItems, deskWidthMm, deskDepthMm]
  );

  // Spatial Telemetry
  const telemetry = useMemo(
    () => calculateSpatialTelemetry(placedItems, deskWidthMm, deskDepthMm, collisionResult),
    [placedItems, deskWidthMm, deskDepthMm, collisionResult]
  );

  // Selected Item details
  const selectedItem = useMemo(
    () => placedItems.find((i) => i.instanceId === selectedInstanceId) || null,
    [placedItems, selectedInstanceId]
  );
  const selectedItemDef = useMemo(
    () => (selectedItem ? DESK_ITEMS_MAP[selectedItem.defId] : null),
    [selectedItem]
  );

  // Canvas scaling factor: calculate pixels per mm to fit the desk neatly inside the canvas container
  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({
    width: 800,
    height: 480,
  });

  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasDimensions({
          width: Math.max(300, rect.width - 48),
          height: Math.max(260, rect.height - 48),
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [isOpen]);

  // Dynamic Scale: mm -> pixels
  const baseScale = useMemo(() => {
    const scaleX = canvasDimensions.width / deskWidthMm;
    const scaleY = canvasDimensions.height / deskDepthMm;
    return Math.min(scaleX, scaleY) * 0.92;
  }, [canvasDimensions, deskWidthMm, deskDepthMm]);

  const scale = baseScale * zoomFactor;

  // Handle Preset Desk Change
  const handleSizePresetSelect = (presetId: string) => {
    playClickSound('tick');
    setSelectedSizePreset(presetId);
    const preset = DESK_SIZE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setDeskWidthMm(preset.widthMm);
      setDeskDepthMm(preset.depthMm);
    }
  };

  // Handle Curated Layout Load
  const handleApplyTemplate = (template: typeof CURATED_LAYOUT_TEMPLATES[0]) => {
    playClickSound('snap');
    setDeskWidthMm(template.deskWidthMm);
    setDeskDepthMm(template.deskDepthMm);
    const matchedPreset = DESK_SIZE_PRESETS.find(
      (p) => p.widthMm === template.deskWidthMm && p.depthMm === template.deskDepthMm
    );
    if (matchedPreset) setSelectedSizePreset(matchedPreset.id);
    setPlacedItems(template.items);
    setSelectedInstanceId(null);
  };

  // Add Item to Desk from Catalog
  const handleAddItemToDesk = (def: DeskItemDef) => {
    playClickSound('snap');
    const newId = `item_${def.id}_${Date.now().toString(36)}`;

    // Calculate smart initial spawn coordinates (center of desk, offset slightly if occupied)
    const centerX = Math.max(0, Math.round((deskWidthMm - def.defaultWidthMm) / 2));
    const centerY = Math.max(0, Math.round((deskDepthMm - def.defaultDepthMm) / 2));
    const jitter = (placedItems.length % 5) * 30;

    const newItem: PlacedDeskItem = {
      instanceId: newId,
      defId: def.id,
      xMm: Math.min(deskWidthMm - def.defaultWidthMm, Math.max(20, centerX + jitter)),
      yMm: Math.min(deskDepthMm - def.defaultDepthMm, Math.max(20, centerY + jitter)),
      widthMm: def.defaultWidthMm,
      depthMm: def.defaultDepthMm,
      rotation: 0,
    };

    // If adding a mat, place it at the back (beginning of array) so other items sit on top
    if (def.isMat) {
      setPlacedItems([newItem, ...placedItems]);
    } else {
      setPlacedItems([...placedItems, newItem]);
    }
    setSelectedInstanceId(newId);
  };

  // Remove Item
  const handleRemoveItem = (instanceId: string) => {
    playClickSound('tick');
    setPlacedItems((prev) => prev.filter((i) => i.instanceId !== instanceId));
    if (selectedInstanceId === instanceId) {
      setSelectedInstanceId(null);
    }
  };

  // Duplicate Item
  const handleDuplicateItem = (instance: PlacedDeskItem) => {
    playClickSound('snap');
    const newId = `item_${instance.defId}_${Date.now().toString(36)}`;
    const newItem: PlacedDeskItem = {
      ...instance,
      instanceId: newId,
      xMm: Math.min(deskWidthMm - instance.widthMm, instance.xMm + 40),
      yMm: Math.min(deskDepthMm - instance.depthMm, instance.yMm + 40),
    };
    setPlacedItems([...placedItems, newItem]);
    setSelectedInstanceId(newId);
  };

  // Rotate Item by 90 degrees
  const handleRotateItem = (instanceId: string) => {
    playClickSound('snap');
    setPlacedItems((prev) =>
      prev.map((item) => {
        if (item.instanceId !== instanceId) return item;
        const nextRotation = ((item.rotation + 90) % 360) as 0 | 90 | 180 | 270;
        return {
          ...item,
          rotation: nextRotation,
        };
      })
    );
  };

  // Pointer Drag-and-Drop Implementation
  const handlePointerDownItem = (
    e: React.PointerEvent<HTMLDivElement>,
    instanceId: string
  ) => {
    e.stopPropagation();
    setSelectedInstanceId(instanceId);
    playClickSound('tick');

    const item = placedItems.find((i) => i.instanceId === instanceId);
    if (!item) return;

    setIsDragging(true);
    dragStartRef.current = {
      instanceId,
      startX: e.clientX,
      startY: e.clientY,
      itemStartX: item.xMm,
      itemStartY: item.yMm,
    };

    // Capture pointer to track smoothly outside item bounds
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;

    const { instanceId, startX, startY, itemStartX, itemStartY } = dragStartRef.current;
    const deltaXPixels = e.clientX - startX;
    const deltaYPixels = e.clientY - startY;

    // Convert pixel delta to mm
    const deltaXMm = deltaXPixels / scale;
    const deltaYMm = deltaYPixels / scale;

    let targetX = itemStartX + deltaXMm;
    let targetY = itemStartY + deltaYMm;

    // Grid Snapping
    if (snapToGrid) {
      targetX = Math.round(targetX / snapGridSizeMm) * snapGridSizeMm;
      targetY = Math.round(targetY / snapGridSizeMm) * snapGridSizeMm;
    }

    setPlacedItems((prev) =>
      prev.map((item) => {
        if (item.instanceId !== instanceId) return item;
        return {
          ...item,
          xMm: Math.round(targetX),
          yMm: Math.round(targetY),
        };
      })
    );
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = null;
      playClickSound('snap');
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
    }
  };

  // 1-Click "Add Entire Desk Setup to Cart" with Bundled Pricing
  const handleAddEntireSetupToCart = () => {
    if (placedItems.length === 0) return;

    playClickSound('cart');
    playClickSound('success');

    // Add each placed item to store
    for (const item of placedItems) {
      const def = DESK_ITEMS_MAP[item.defId];
      if (!def) continue;

      const product = resolveCartProduct(def);

      // Apply bundle discount to unit price
      const bundleUnitPrice = Number(
        (def.price * (1 - telemetry.bundleDiscountPercent / 100)).toFixed(2)
      );

      if (def.type === 'custom_3d') {
        const customSpecs = createDefaultSpecsFor3DItem(
          product,
          item.widthMm,
          item.depthMm
        );
        addCustomItem(product, customSpecs, bundleUnitPrice);
      } else {
        // Standard dropship item
        addStandardItem(product, 1);
      }
    }

    setAddedToCartToast(true);
    setTimeout(() => {
      setAddedToCartToast(false);
      onClose();
      openCart();
    }, 1100);
  };

  if (!isOpen) return null;

  const deskPixelWidth = deskWidthMm * scale;
  const deskPixelHeight = deskDepthMm * scale;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-2 sm:p-4 md:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main CAD Window Container */}
      <div className="relative w-full max-w-7xl h-[92vh] max-h-[950px] bg-[#0c0c0e] border border-zinc-800 rounded-xl flex flex-col shadow-2xl overflow-hidden font-mono z-10">
        {/* ========================================================= */}
        {/* TOP CONTROL / TELEMETRY STATUS BAR                        */}
        {/* ========================================================= */}
        <div className="flex-shrink-0 px-4 py-2.5 bg-[#121215] border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Brand & Mode Indicator */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center text-signal-orange">
                <Grid className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white tracking-tight text-sm font-sans">
                    FORMGRID SPATIAL STUDIO
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-signal-orange/15 text-signal-orange font-semibold border border-signal-orange/30">
                    2D CAD v3.4
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500">
                  RAMS SPECIFICATION: TOP-DOWN MODULAR DESK ARCHITECTURE
                </div>
              </div>
            </div>
          </div>

          {/* Center Telemetry Pills */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Surface Utilization */}
            <div className="px-2.5 py-1 rounded bg-zinc-900/90 border border-zinc-800 flex items-center space-x-2">
              <span className="text-[10px] text-zinc-400">SURFACE UTILIZATION:</span>
              <span className="font-bold text-precision-white">
                {telemetry.surfaceUtilizationPercent}%
              </span>
              <div className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-signal-orange transition-all duration-300"
                  style={{ width: `${telemetry.surfaceUtilizationPercent}%` }}
                />
              </div>
            </div>

            {/* Dead Space Recaptured */}
            <div className="px-2.5 py-1 rounded bg-zinc-900/90 border border-zinc-800 flex items-center space-x-1.5">
              <span className="text-[10px] text-zinc-400">DEAD SPACE RECAPTURED:</span>
              <span className="font-bold text-signal-lime">
                +{telemetry.deadSpaceReductionPercent}%
              </span>
            </div>

            {/* Collision Status */}
            <div
              className={`px-2.5 py-1 rounded border flex items-center space-x-1.5 ${
                collisionResult.hasCollision
                  ? 'bg-amber-950/40 border-amber-600/50 text-amber-300'
                  : 'bg-zinc-900/90 border-zinc-800 text-signal-lime'
              }`}
            >
              {collisionResult.hasCollision ? (
                <>
                  <AlertTriangle className="w-3 h-3 text-amber-400 animate-pulse" />
                  <span className="font-bold text-[10px]">
                    {collisionResult.collidingInstanceIds.size + collisionResult.overhangingInstanceIds.size} CONFLICTS
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 text-signal-lime" />
                  <span className="font-bold text-[10px] text-zinc-300">
                    CAD TOLERANCE OK (0 CONFLICTS)
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right Action Icons & Close */}
          <div className="flex items-center space-x-2">
            {/* Snap To Grid Toggle */}
            <button
              type="button"
              onClick={() => {
                playClickSound('toggle');
                setSnapToGrid(!snapToGrid);
              }}
              title={snapToGrid ? 'Snap to 10mm CAD Grid (Active)' : 'Freeform Placement'}
              className={`px-2.5 py-1 rounded border text-xs flex items-center space-x-1 transition ${
                snapToGrid
                  ? 'bg-signal-orange/15 border-signal-orange/50 text-signal-orange'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Magnet className="w-3 h-3" />
              <span className="hidden sm:inline text-[10px]">10mm SNAP</span>
            </button>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center border border-zinc-800 bg-zinc-900 rounded overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  playClickSound('tick');
                  setZoomFactor((z) => Math.max(0.6, z - 0.15));
                }}
                className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <span className="px-1.5 text-[10px] text-zinc-400 border-x border-zinc-800">
                {Math.round(zoomFactor * 100)}%
              </span>
              <button
                type="button"
                onClick={() => {
                  playClickSound('tick');
                  setZoomFactor((z) => Math.min(1.6, z + 0.15));
                }}
                className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                playClickSound('snap');
                onClose();
              }}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition"
              aria-label="Close Desk Planner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN BODY: 2D CANVAS VIEWPORT (CENTER) & DRAWER (SIDE)     */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          {/* ------------------------------------------------------- */}
          {/* 1. LEFT / DESK CAD CANVAS VIEWPORT                       */}
          {/* ------------------------------------------------------- */}
          <div
            ref={canvasRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="flex-1 relative bg-[#09090b] flex items-center justify-center p-6 select-none overflow-hidden"
            style={{
              backgroundImage: `
                radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0),
                linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px, 120px 120px, 120px 120px',
            }}
            onClick={() => setSelectedInstanceId(null)}
          >
            {/* Top CAD Dimensions Callout */}
            <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-[10px] text-zinc-500 font-mono pointer-events-none z-10">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
                <span>ACTIVE SURFACE: {deskWidthMm} × {deskDepthMm} MM</span>
                <span>•</span>
                <span>AREA: {telemetry.deskAreaM2} M²</span>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <span>SCALE: {(scale * 100).toFixed(1)} PX / 100MM</span>
                <span>•</span>
                <span>ORTHOGONAL TOP-DOWN 2D</span>
              </div>
            </div>

            {/* Desk Surface Bounding Box */}
            <div
              className="relative transition-all duration-200 shadow-2xl rounded-sm"
              style={{
                width: `${deskPixelWidth}px`,
                height: `${deskPixelHeight}px`,
                backgroundColor: currentFinish.bgColor,
                border: `2px solid ${currentFinish.borderColor}`,
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), inset 0 0 0 1px rgba(255,255,255,0.05)',
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {/* Millimeter Grid Overlay on Desk Surface */}
              <div
                className="absolute inset-0 pointer-events-none opacity-60"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, ${currentFinish.gridColor} 1px, transparent 1px),
                    linear-gradient(to bottom, ${currentFinish.gridColor} 1px, transparent 1px)
                  `,
                  backgroundSize: `${100 * scale}px ${100 * scale}px`,
                }}
              />

              {/* 50mm Minor Subdivision Grid */}
              <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, ${currentFinish.gridColor} 1px, transparent 1px),
                    linear-gradient(to bottom, ${currentFinish.gridColor} 1px, transparent 1px)
                  `,
                  backgroundSize: `${50 * scale}px ${50 * scale}px`,
                }}
              />

              {/* Rear Edge Cable Pass-Through Notch Indicator */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-2 bg-zinc-950 border-b border-x border-zinc-700/80 rounded-b-sm flex items-center justify-center pointer-events-none">
                <span className="text-[7px] text-zinc-500 font-mono tracking-widest uppercase">
                  CABLE PORT
                </span>
              </div>

              {/* Corner CAD Chamfer Markers */}
              <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-zinc-600/70 pointer-events-none" />
              <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-zinc-600/70 pointer-events-none" />
              <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-zinc-600/70 pointer-events-none" />
              <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-zinc-600/70 pointer-events-none" />

              {/* Dimension Witness Lines (CAD Overlays) */}
              <div className="absolute -top-6 left-0 right-0 flex items-center justify-between text-[9px] text-zinc-500 font-mono pointer-events-none">
                <span className="w-2 h-px bg-zinc-700" />
                <span className="px-1 bg-[#09090b] text-zinc-400">
                  ← {deskWidthMm} mm →
                </span>
                <span className="w-2 h-px bg-zinc-700" />
              </div>

              <div className="absolute top-0 bottom-0 -right-8 flex flex-col items-center justify-between text-[9px] text-zinc-500 font-mono pointer-events-none">
                <span className="h-2 w-px bg-zinc-700" />
                <span className="py-1 bg-[#09090b] text-zinc-400 rotate-90 origin-center whitespace-nowrap">
                  {deskDepthMm} mm
                </span>
                <span className="h-2 w-px bg-zinc-700" />
              </div>

              {/* --------------------------------------------------- */}
              {/* RENDER PLACED MODULAR ITEMS                          */}
              {/* --------------------------------------------------- */}
              {placedItems.map((item) => {
                const def = DESK_ITEMS_MAP[item.defId];
                if (!def) return null;

                const isSelected = item.instanceId === selectedInstanceId;
                const isColliding = collisionResult.collidingInstanceIds.has(item.instanceId);
                const isOverhanging = collisionResult.overhangingInstanceIds.has(item.instanceId);

                const isRotated = item.rotation === 90 || item.rotation === 270;
                const renderedW = (isRotated ? item.depthMm : item.widthMm) * scale;
                const renderedD = (isRotated ? item.widthMm : item.depthMm) * scale;
                const posX = item.xMm * scale;
                const posY = item.yMm * scale;

                return (
                  <div
                    key={item.instanceId}
                    onPointerDown={(e) => handlePointerDownItem(e, item.instanceId)}
                    className={`absolute cursor-grab active:cursor-grabbing transition-shadow rounded ${
                      isSelected
                        ? 'ring-2 ring-signal-orange shadow-lg z-30'
                        : isColliding || isOverhanging
                        ? 'ring-2 ring-amber-500 animate-pulse z-20'
                        : def.isMat
                        ? 'z-0 hover:ring-1 hover:ring-zinc-600'
                        : 'z-10 hover:ring-1 hover:ring-zinc-400'
                    }`}
                    style={{
                      left: `${posX}px`,
                      top: `${posY}px`,
                      width: `${renderedW}px`,
                      height: `${renderedD}px`,
                      backgroundColor: def.color,
                      border: `1.5px solid ${
                        isColliding || isOverhanging
                          ? '#f59e0b'
                          : isSelected
                          ? '#ff5500'
                          : def.borderColor
                      }`,
                      touchAction: 'none',
                    }}
                  >
                    {/* Render Specific Dieter Rams Aesthetic Visuals */}
                    {def.renderShape === 'mat' && (
                      <div className="w-full h-full p-2 flex flex-col justify-between text-[9px] text-zinc-400 relative overflow-hidden pointer-events-none">
                        {/* Felt Border Stitching */}
                        <div className="absolute inset-1 border border-dashed border-zinc-600/40 rounded-sm pointer-events-none" />
                        <div className="flex items-center justify-between text-[8px] tracking-widest text-zinc-400 font-mono">
                          <span>FORMGRID // ECO-FELT MAT</span>
                          <span>900×400</span>
                        </div>
                        <div className="flex items-center justify-between text-[7px] text-zinc-400">
                          <span>MERINO DAMPENING CORE</span>
                          <span className="w-2 h-2 rounded-full border border-signal-orange/60" />
                        </div>
                      </div>
                    )}

                    {def.renderShape === 'riser' && (
                      <div className="w-full h-full p-1.5 flex flex-col justify-between text-zinc-300 pointer-events-none overflow-hidden">
                        <div className="flex items-center justify-between text-[8px] text-signal-cyan font-bold">
                          <span>LAPTOP RISER</span>
                          <span>15° WEDGE</span>
                        </div>
                        {/* Passive Cooling Flute Slots */}
                        <div className="flex flex-col space-y-1 my-auto opacity-70">
                          <div className="h-1 bg-zinc-700/80 rounded" />
                          <div className="h-1 bg-zinc-700/80 rounded" />
                          <div className="h-1 bg-zinc-700/80 rounded" />
                        </div>
                        <div className="text-[7px] text-zinc-500 font-mono">
                          6061 ALUMINUM // 300×240MM
                        </div>
                      </div>
                    )}

                    {def.renderShape === 'screenbar' && (
                      <div className="w-full h-full px-2 py-1 flex items-center justify-between text-zinc-200 pointer-events-none overflow-hidden">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-signal-lime animate-pulse" />
                          <span className="text-[8px] font-bold text-zinc-200 font-mono">
                            SCREENBAR (CRI ≥ 95)
                          </span>
                        </div>
                        <div className="h-1 w-16 bg-gradient-to-r from-signal-lime/20 via-signal-lime/80 to-signal-lime/20 rounded-full" />
                        <span className="text-[7px] text-zinc-400 font-mono">480MM</span>
                      </div>
                    )}

                    {def.renderShape === 'valet' && (
                      <div className="w-full h-full p-1 grid grid-cols-3 grid-rows-2 gap-1 pointer-events-none">
                        <div className="border border-zinc-700/80 bg-zinc-900/60 rounded-xs flex items-center justify-center text-[7px] text-zinc-400">
                          EDC
                        </div>
                        <div className="border border-zinc-700/80 bg-zinc-900/60 rounded-xs flex items-center justify-center text-[7px] text-zinc-400">
                          PENS
                        </div>
                        <div className="border border-signal-orange/40 bg-signal-orange/10 rounded-xs flex items-center justify-center text-[7px] text-signal-orange">
                          RESIN
                        </div>
                        <div className="col-span-2 border border-zinc-700/80 bg-zinc-900/60 rounded-xs flex items-center justify-center text-[7px] text-zinc-400">
                          CHAMBER A
                        </div>
                        <div className="border border-zinc-700/80 bg-zinc-900/60 rounded-xs flex items-center justify-center text-[7px] text-zinc-400">
                          KEYS
                        </div>
                      </div>
                    )}

                    {def.renderShape === 'matrix' && (
                      <div className="w-full h-full p-1 grid grid-cols-4 grid-rows-3 gap-0.5 pointer-events-none">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div
                            key={i}
                            className="border border-zinc-800 bg-zinc-900/80 rounded-xs flex items-center justify-center text-[6px] text-zinc-500"
                          >
                            {i + 1}
                          </div>
                        ))}
                      </div>
                    )}

                    {def.renderShape === 'anchor' && (
                      <div className="w-full h-full p-1 flex flex-col justify-between items-center pointer-events-none">
                        <div className="w-full flex justify-around">
                          <span className="w-1.5 h-1.5 rounded-full bg-signal-cyan" />
                          <span className="w-1.5 h-1.5 rounded-full bg-signal-cyan" />
                          <span className="w-1.5 h-1.5 rounded-full bg-signal-cyan" />
                        </div>
                        <span className="text-[7px] text-zinc-400 font-bold">ANCHOR</span>
                        <span className="text-[6px] text-zinc-500">90×60</span>
                      </div>
                    )}

                    {def.renderShape === 'keyboard' && (
                      <div className="w-full h-full p-1 flex flex-col justify-between pointer-events-none">
                        <div className="flex items-center justify-between text-[7px] text-zinc-400">
                          <span className="font-bold text-signal-orange">ESC</span>
                          <span className="text-zinc-500">65% CNC DECK</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-signal-lime" />
                        </div>
                        <div className="grid grid-cols-12 gap-0.5 my-auto">
                          {Array.from({ length: 24 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-1.5 rounded-xs ${
                                i === 0 || i === 23
                                  ? 'bg-signal-orange'
                                  : 'bg-zinc-700/60'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="h-1.5 bg-zinc-600/70 rounded-xs mx-auto w-16" />
                      </div>
                    )}

                    {def.renderShape === 'mouse' && (
                      <div className="w-full h-full p-1 flex flex-col items-center justify-between pointer-events-none">
                        <div className="w-2.5 h-4 bg-zinc-700 border border-zinc-500 rounded-xs mt-1" />
                        <span className="text-[7px] text-zinc-400 font-bold">PRECISION</span>
                        <span className="text-[6px] text-zinc-500 mb-1">MOU-88</span>
                      </div>
                    )}

                    {/* Collision or Overhang Alert Indicator */}
                    {(isColliding || isOverhanging) && (
                      <div className="absolute -top-2.5 -right-2.5 bg-amber-500 text-black p-0.5 rounded-full shadow-md z-40">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                    )}

                    {/* Floating Item Size Tag when Selected */}
                    {isSelected && (
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[8px] text-white whitespace-nowrap shadow-md pointer-events-none z-40">
                        {item.widthMm} × {item.depthMm}mm @ ({item.xMm}, {item.yMm})
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Floating Canvas Utility Bar */}
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between pointer-events-none">
              {/* Selected Item Floating Controller */}
              {selectedItem && selectedItemDef ? (
                <div className="pointer-events-auto bg-zinc-900/95 border border-zinc-700 px-3 py-1.5 rounded-lg flex items-center space-x-2 shadow-2xl backdrop-blur-md text-xs">
                  <div className="flex items-center space-x-1.5 pr-2 border-r border-zinc-700">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedItemDef.accentColor }} />
                    <span className="font-bold text-white text-[11px]">{selectedItemDef.name}</span>
                    <span className="text-[10px] text-zinc-400">${selectedItemDef.price.toFixed(2)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRotateItem(selectedItem.instanceId)}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition flex items-center space-x-1"
                    title="Rotate 90°"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-signal-orange" />
                    <span className="text-[10px]">{selectedItem.rotation}°</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDuplicateItem(selectedItem)}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition"
                    title="Duplicate Item"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(selectedItem.instanceId)}
                    className="p-1 rounded hover:bg-red-950/60 text-red-400 hover:text-red-300 transition"
                    title="Delete Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="text-[10px] text-zinc-500 bg-zinc-950/80 px-2 py-1 rounded border border-zinc-800/80 pointer-events-auto">
                  CLICK TO SELECT • DRAG TO POSITION • 10MM CAD ALIGNMENT
                </div>
              )}

              {/* Reset Canvas Button */}
              <div className="pointer-events-auto flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound('snap');
                    setPlacedItems([]);
                    setSelectedInstanceId(null);
                  }}
                  className="px-2.5 py-1 rounded bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-[10px] transition"
                >
                  CLEAR DESK
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate(CURATED_LAYOUT_TEMPLATES[0])}
                  className="px-2.5 py-1 rounded bg-zinc-900/90 hover:bg-zinc-800 text-signal-orange hover:text-orange-400 border border-zinc-800 text-[10px] transition flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>RESET CURATED RAMS</span>
                </button>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------- */}
          {/* 2. RIGHT / CONFIGURATION & TELEMETRY SIDEBAR             */}
          {/* ------------------------------------------------------- */}
          <div className="w-full md:w-96 flex-shrink-0 bg-[#121215] border-t md:border-t-0 md:border-l border-zinc-800 flex flex-col h-72 md:h-auto overflow-hidden">
            {/* Sidebar Navigation Tabs */}
            <div className="flex border-b border-zinc-800 bg-zinc-950/60 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  playClickSound('tab');
                  setActiveTab('catalog');
                }}
                className={`flex-1 py-2.5 px-2 text-center transition font-semibold border-b-2 ${
                  activeTab === 'catalog'
                    ? 'border-signal-orange text-signal-orange bg-zinc-900/50'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                MODULAR ITEMS
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound('tab');
                  setActiveTab('surface');
                }}
                className={`flex-1 py-2.5 px-2 text-center transition font-semibold border-b-2 ${
                  activeTab === 'surface'
                    ? 'border-signal-orange text-signal-orange bg-zinc-900/50'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                DESK SIZE
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound('tab');
                  setActiveTab('presets');
                }}
                className={`flex-1 py-2.5 px-2 text-center transition font-semibold border-b-2 ${
                  activeTab === 'presets'
                    ? 'border-signal-orange text-signal-orange bg-zinc-900/50'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                LAYOUTS
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound('tab');
                  setActiveTab('telemetry');
                }}
                className={`flex-1 py-2.5 px-2 text-center transition font-semibold border-b-2 ${
                  activeTab === 'telemetry'
                    ? 'border-signal-orange text-signal-orange bg-zinc-900/50'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                CAD STATS
              </button>
            </div>

            {/* Sidebar Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* TAB 1: MODULAR ITEMS CATALOG */}
              {activeTab === 'catalog' && (
                <div className="space-y-3">
                  <div className="text-[11px] text-zinc-400 flex items-center justify-between pb-1 border-b border-zinc-800">
                    <span>CLICK ITEM TO ADD TO DESK SURFACE:</span>
                    <span className="text-[10px] text-zinc-500">
                      {DESK_ITEMS_CATALOG.length} MODULES
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {DESK_ITEMS_CATALOG.map((item) => {
                      const countOnDesk = placedItems.filter((i) => i.defId === item.id).length;

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleAddItemToDesk(item)}
                          className="group p-2.5 rounded-lg bg-zinc-900/70 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            {/* Color Accent Pill */}
                            <div
                              className="w-3.5 h-7 rounded-sm flex-shrink-0"
                              style={{ backgroundColor: item.accentColor }}
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-white text-xs group-hover:text-signal-orange transition-colors">
                                  {item.name}
                                </span>
                                {item.type === 'custom_3d' ? (
                                  <span className="px-1 py-0.2 rounded text-[9px] bg-orange-950/60 text-signal-orange border border-signal-orange/30">
                                    3D PRINT
                                  </span>
                                ) : (
                                  <span className="px-1 py-0.2 rounded text-[9px] bg-blue-950/60 text-signal-cyan border border-signal-cyan/30">
                                    FAST-SHIP
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-zinc-400 flex items-center space-x-2 mt-0.5">
                                <span>
                                  {item.defaultWidthMm} × {item.defaultDepthMm} mm
                                </span>
                                <span>•</span>
                                <span className="font-semibold text-zinc-300">
                                  ${item.price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {countOnDesk > 0 && (
                              <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-bold flex items-center justify-center border border-zinc-700">
                                {countOnDesk}
                              </span>
                            )}
                            <button
                              type="button"
                              className="px-2 py-1 rounded bg-zinc-800 group-hover:bg-signal-orange group-hover:text-black text-zinc-300 text-[10px] font-semibold transition"
                            >
                              + ADD
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: DESK SURFACE SIZE & FINISH */}
              {activeTab === 'surface' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-2 font-semibold">
                      DESK TOPOLOGY PRESETS:
                    </label>
                    <div className="space-y-2">
                      {DESK_SIZE_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSizePresetSelect(preset.id)}
                          className={`w-full p-2.5 rounded-lg border text-left transition flex items-center justify-between ${
                            selectedSizePreset === preset.id
                              ? 'bg-signal-orange/15 border-signal-orange text-white'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-xs">{preset.name}</div>
                            <div className="text-[10px] text-zinc-500">{preset.subtitle}</div>
                          </div>
                          {selectedSizePreset === preset.id && (
                            <Check className="w-4 h-4 text-signal-orange" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Dimensions */}
                  <div className="pt-3 border-t border-zinc-800 space-y-3">
                    <span className="text-[11px] text-zinc-400 font-semibold block">
                      CUSTOM MILLIMETER PARAMETERS:
                    </span>

                    <div>
                      <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                        <span>WIDTH (LENGTH):</span>
                        <span className="font-bold text-white">{deskWidthMm} mm</span>
                      </div>
                      <input
                        type="range"
                        min={1200}
                        max={2200}
                        step={50}
                        value={deskWidthMm}
                        onChange={(e) => {
                          setSelectedSizePreset('custom');
                          setDeskWidthMm(Number(e.target.value));
                        }}
                        className="w-full accent-signal-orange h-1.5 bg-zinc-800 rounded"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                        <span>DEPTH:</span>
                        <span className="font-bold text-white">{deskDepthMm} mm</span>
                      </div>
                      <input
                        type="range"
                        min={600}
                        max={1000}
                        step={50}
                        value={deskDepthMm}
                        onChange={(e) => {
                          setSelectedSizePreset('custom');
                          setDeskDepthMm(Number(e.target.value));
                        }}
                        className="w-full accent-signal-orange h-1.5 bg-zinc-800 rounded"
                      />
                    </div>
                  </div>

                  {/* Surface Material Finish */}
                  <div className="pt-3 border-t border-zinc-800">
                    <label className="text-[11px] text-zinc-400 block mb-2 font-semibold">
                      SURFACE ARCHITECTURAL FINISH:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {DESK_SURFACE_FINISHES.map((finish) => (
                        <button
                          key={finish.id}
                          type="button"
                          onClick={() => {
                            playClickSound('tick');
                            setSelectedFinishId(finish.id);
                          }}
                          className={`p-2 rounded-lg border text-left transition ${
                            selectedFinishId === finish.id
                              ? 'bg-zinc-800 border-signal-orange text-white'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5 mb-1">
                            <div
                              className="w-3 h-3 rounded-full border border-zinc-700"
                              style={{ backgroundColor: finish.bgColor }}
                            />
                            <span className="text-[10px] font-bold truncate">
                              {finish.name}
                            </span>
                          </div>
                          <div className="text-[8px] text-zinc-500 truncate">
                            {finish.textureLabel}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CURATED LAYOUT TEMPLATES */}
              {activeTab === 'presets' && (
                <div className="space-y-3">
                  <div className="text-[11px] text-zinc-400 pb-1 border-b border-zinc-800">
                    DIETER RAMS ARCHITECTURAL TEMPLATES:
                  </div>

                  {CURATED_LAYOUT_TEMPLATES.map((tpl) => (
                    <div
                      key={tpl.id}
                      className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{tpl.name}</span>
                        <span className="text-[10px] text-signal-orange font-mono">
                          {tpl.items.length} ITEMS
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-relaxed">
                        {tpl.description}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-zinc-500">
                          {tpl.deskWidthMm} × {tpl.deskDepthMm} mm
                        </span>
                        <button
                          type="button"
                          onClick={() => handleApplyTemplate(tpl)}
                          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-signal-orange hover:text-black text-xs font-semibold text-white transition"
                        >
                          LOAD LAYOUT
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: REAL-TIME CAD STATS & CONFLICT LOG */}
              {activeTab === 'telemetry' && (
                <div className="space-y-3 text-xs">
                  <div className="text-[11px] text-zinc-400 pb-1 border-b border-zinc-800">
                    REAL-TIME SPATIAL TELEMETRY (ISO 2768-m):
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800">
                      <div className="text-[10px] text-zinc-500">SURFACE UTILIZATION</div>
                      <div className="text-lg font-bold text-white mt-0.5">
                        {telemetry.surfaceUtilizationPercent}%
                      </div>
                      <div className="text-[9px] text-zinc-400">
                        {telemetry.occupiedAreaM2} m² of {telemetry.deskAreaM2} m²
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800">
                      <div className="text-[10px] text-zinc-500">DEAD SPACE RECAPTURED</div>
                      <div className="text-lg font-bold text-signal-lime mt-0.5">
                        +{telemetry.deadSpaceReductionPercent}%
                      </div>
                      <div className="text-[9px] text-zinc-400">Rectilinear grid alignment</div>
                    </div>

                    <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800">
                      <div className="text-[10px] text-zinc-500">CLEAR FOCUS ZONE</div>
                      <div className="text-lg font-bold text-precision-white mt-0.5">
                        {telemetry.clearFocusZoneM2} m²
                      </div>
                      <div className="text-[9px] text-zinc-400">Ergonomic sweep clearance</div>
                    </div>

                    <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800">
                      <div className="text-[10px] text-zinc-500">COLLISION STATE</div>
                      <div
                        className={`text-lg font-bold mt-0.5 ${
                          collisionResult.hasCollision ? 'text-amber-400' : 'text-signal-lime'
                        }`}
                      >
                        {collisionResult.hasCollision ? 'INTERFERENCE' : 'CLEAN'}
                      </div>
                      <div className="text-[9px] text-zinc-400">
                        {collisionResult.collidingInstanceIds.size} conflicts detected
                      </div>
                    </div>
                  </div>

                  {/* Conflict Log */}
                  {collisionResult.messages.length > 0 && (
                    <div className="p-2.5 rounded bg-amber-950/30 border border-amber-600/40 text-[10px] text-amber-300 space-y-1">
                      <div className="font-bold flex items-center space-x-1 text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>INTERFERENCE DETECTED:</span>
                      </div>
                      {collisionResult.messages.map((msg, i) => (
                        <div key={i} className="pl-4">
                          • {msg}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Package Bifurcation Summary */}
                  <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800 text-[10px] space-y-1.5">
                    <div className="font-bold text-zinc-300">SPLIT-FULFILLMENT DISTRIBUTION:</div>
                    <div className="flex justify-between text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-signal-orange" /> Package A (3D Print Farm):
                      </span>
                      <span className="font-bold text-white">{telemetry.packageACount} items</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3 text-signal-cyan" /> Package B (Fast-Ship US):
                      </span>
                      <span className="font-bold text-white">{telemetry.packageBCount} items</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ===================================================== */}
            {/* 1-CLICK BUNDLE CHECKOUT FOOTER (STICKY BOTTOM)        */}
            {/* ===================================================== */}
            <div className="flex-shrink-0 p-4 bg-zinc-950 border-t border-zinc-800 space-y-3 font-mono">
              {/* Bundle Pricing Ticker */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>PLACED HARDWARE [{placedItems.length}]:</span>
                  <span className={telemetry.bundleDiscountPercent > 0 ? 'line-through text-zinc-500' : 'text-white'}>
                    ${telemetry.totalHardwareValue.toFixed(2)}
                  </span>
                </div>

                {telemetry.bundleDiscountPercent > 0 && (
                  <div className="flex items-center justify-between text-xs text-signal-lime">
                    <span className="flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-signal-lime" />
                      <span>ARCHITECTURAL BUNDLE (-{telemetry.bundleDiscountPercent}%):</span>
                    </span>
                    <span>-${telemetry.savings.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm font-bold text-white pt-1 border-t border-zinc-800/80">
                  <span>BUNDLE TOTAL:</span>
                  <span className="text-signal-orange font-display text-base">
                    ${telemetry.bundlePrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* 1-Click "Add Entire Desk Setup to Cart" CTA */}
              <button
                type="button"
                onClick={handleAddEntireSetupToCart}
                disabled={placedItems.length === 0}
                className={`w-full py-3 px-4 rounded-lg font-bold text-xs flex items-center justify-center space-x-2 transition ${
                  placedItems.length === 0
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-signal-orange hover:bg-orange-600 text-black shadow-glow-orange cursor-pointer'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD ENTIRE DESK SETUP TO CART</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Toast Notification */}
              {addedToCartToast && (
                <div className="p-2 rounded bg-signal-lime/20 border border-signal-lime text-signal-lime text-center text-[10px] font-bold animate-pulse">
                  ✓ SETUP QUEUED TO SPLIT-FULFILLMENT CART (OPENING DISPATCH...)
                </div>
              )}

              <div className="flex items-center justify-between text-[9px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-zinc-400" /> SnugFit Fit Guarantee
                </span>
                <span>Dual-Facility Split Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
