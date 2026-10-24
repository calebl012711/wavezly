/**
 * WAVEZLY ARCHITECTURAL BLUEPRINT & 2D TECHNICAL DRAWING SYSTEM
 * Precision CAD-grade orthographic projection schematic with real-time dynamic dimensions.
 * Features:
 * - High-contrast Blueprint Blue (#0B1B2B) & Technical White Vellum modes
 * - Real-time dimension lines, arrowheads, extension lines, leader callouts
 * - Plan View (Top-Down Orthogonal) & Elevation Cross-Section A-A
 * - Real-world drawer fit verification (100% Fit Guarantee)
 * - 1-Click standalone Vector SVG download & high-res print-to-scale / PDF export
 */

import React, { useState, useRef, useEffect, useId } from 'react';
import { useCustomizerStore } from '../../store/useCustomizerStore';
import { playClickSound } from '../../lib/soundEffects';
import {
  X,
  Download,
  Printer,
  Ruler,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Moon,
  Layers,
  Box,
  Clock,
  Weight,
  Sparkles,
} from 'lucide-react';

export interface ArchitecturalBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: () => void;
}

export const ArchitecturalBlueprintModal: React.FC<ArchitecturalBlueprintModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const {
    dimensions,
    selectedMaterial,
    telemetry,
    engravedText,
    currentProduct,
  } = useCustomizerStore();

  const [themeMode, setThemeMode] = useState<'blueprint' | 'paper'>('blueprint');
  const [unitMode, setUnitMode] = useState<'dual' | 'metric' | 'imperial'>('dual');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const modalHeadingId = useId();

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Format dimensions based on unit mode
  const formatDim = (mm: number): string => {
    const inches = (mm / 25.4).toFixed(2);
    const mmStr = mm.toFixed(1);
    if (unitMode === 'metric') return `${mmStr} mm`;
    if (unitMode === 'imperial') return `${inches} in`;
    return `${mmStr} mm / ${inches} in`;
  };

  const formatMmOnly = (mm: number): string => `${mm.toFixed(1)} mm`;

  // Dynamic Drawing Calculations
  const {
    length,
    width,
    height,
    wallThickness,
    bottomThickness,
    rows,
    cols,
    cornerFilletRadius,
  } = dimensions;

  // Cavity math
  const availLengthMm = Math.max(10, length - (cols + 1) * wallThickness);
  const availWidthMm = Math.max(10, width - (rows + 1) * wallThickness);
  const cellLengthMm = availLengthMm / cols;
  const cellWidthMm = availWidthMm / rows;
  const cavityDepthMm = Math.max(1, height - bottomThickness);

  // SVG Drawing Area setup (Canvas: 1000 x 700)
  const svgWidth = 1000;
  const svgHeight = 700;

  // Zone 1: Plan View (Top View)
  const maxPlanWidth = 440;
  const maxPlanHeight = 280;
  const planScale = Math.min(maxPlanWidth / length, maxPlanHeight / width);

  const planWidthPx = length * planScale;
  const planHeightPx = width * planScale;
  const planCenterX = 350;
  const planCenterY = 225;
  const planLeft = planCenterX - planWidthPx / 2;
  const planTop = planCenterY - planHeightPx / 2;

  const scaledWall = Math.max(2.2, wallThickness * planScale);
  const scaledFillet = Math.min(
    cornerFilletRadius * planScale,
    planWidthPx / 3,
    planHeightPx / 3
  );

  const scaledCellLen = cellLengthMm * planScale;
  const scaledCellWid = cellWidthMm * planScale;
  const scaledCavityFillet = Math.max(1.5, Math.min(scaledFillet - scaledWall * 0.5, 7));

  // Zone 2: Elevation & Section View A-A (Front Cross-Section)
  const sectionBaseY = 600;
  const maxSectionHeightPx = 80;
  const sectionScale = Math.min(planScale * 1.15, maxSectionHeightPx / Math.max(height, 20));
  const sectionHeightPx = Math.max(24, Math.min(height * sectionScale, 95));
  const sectionFloorPx = Math.max(3.5, bottomThickness * sectionScale);
  const sectionTop = sectionBaseY - sectionHeightPx;

  // Color Palette Definitions
  const isBlueprint = themeMode === 'blueprint';
  const colors = isBlueprint
    ? {
        bg: '#0B1B2B',
        paperBorder: '#1E3A5F',
        gridMinor: '#10273F',
        gridMajor: '#173656',
        centerlines: '#0EA5E9',
        outline: '#38BDF8',
        fill: '#081726',
        cavityFill: '#0D2238',
        cavityStroke: '#38BDF8',
        dimLine: '#38BDF8',
        dimText: '#E0F2FE',
        dimPillBg: '#091A2C',
        dimPillBorder: '#1E3A5F',
        leaderLine: '#38BDF8',
        calloutText: '#BAE6FD',
        titleBlockBg: '#081726',
        titleBlockBorder: '#1E3A5F',
        titleBlockHeader: '#38BDF8',
        titleBlockText: '#E0F2FE',
        titleBlockMuted: '#7DD3FC',
        hatch: '#1E3A5F',
        stampBorder: '#38BDF8',
        stampText: '#38BDF8',
      }
    : {
        bg: '#F8FAFC',
        paperBorder: '#CBD5E1',
        gridMinor: '#F1F5F9',
        gridMajor: '#E2E8F0',
        centerlines: '#94A3B8',
        outline: '#0F172A',
        fill: '#FFFFFF',
        cavityFill: '#F8FAFC',
        cavityStroke: '#0F172A',
        dimLine: '#2563EB',
        dimText: '#1E293B',
        dimPillBg: '#EFF6FF',
        dimPillBorder: '#BFDBFE',
        leaderLine: '#2563EB',
        calloutText: '#1E3A8A',
        titleBlockBg: '#FFFFFF',
        titleBlockBorder: '#CBD5E1',
        titleBlockHeader: '#0F172A',
        titleBlockText: '#1E293B',
        titleBlockMuted: '#64748B',
        hatch: '#E2E8F0',
        stampBorder: '#2563EB',
        stampText: '#2563EB',
      };

  // 1-Click Vector SVG Download Handler
  const handleDownloadSvg = () => {
    playClickSound('download');
    setIsExporting(true);
    try {
      const svgEl = svgRef.current;
      if (!svgEl) return;

      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svgEl);

      if (!svgString.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        svgString = svgString.replace(
          /^<svg/,
          '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"'
        );
      }

      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const filename = `Wavezly-Blueprint-${Math.round(length)}x${Math.round(width)}x${Math.round(height)}mm.svg`;

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsExporting(false);
      }, 150);
    } catch (err) {
      console.error('Failed to export vector SVG:', err);
      setIsExporting(false);
    }
  };

  // 1-Click Print Blueprint / Save as PDF Handler
  const handlePrint = () => {
    playClickSound('download');
    const svgEl = svgRef.current;
    if (!svgEl) {
      window.print();
      return;
    }

    try {
      const svgString = new XMLSerializer().serializeToString(svgEl);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <title>Wavezly Blueprint - ${Math.round(length)}x${Math.round(width)}mm</title>
              <style>
                @page {
                  size: landscape;
                  margin: 6mm;
                }
                * {
                  box-sizing: border-box;
                }
                html, body {
                  margin: 0;
                  padding: 0;
                  width: 100%;
                  height: 100%;
                  background: ${isBlueprint ? '#0B1B2B' : '#FFFFFF'};
                  color: ${isBlueprint ? '#E0F2FE' : '#0F172A'};
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                .blueprint-wrap {
                  width: 100%;
                  max-width: 1000px;
                  height: auto;
                  margin: 0 auto;
                }
                svg {
                  width: 100%;
                  height: auto;
                  display: block;
                }
                .footer-print-note {
                  font-size: 8px;
                  color: #888;
                  margin-top: 6px;
                  text-align: center;
                }
              </style>
            </head>
            <body>
              <div class="blueprint-wrap">
                ${svgString}
              </div>
              <div class="footer-print-note">
                Wavezly Parametric 3D Studio • 100% Fit Guarantee • Print scale verify before ordering.
              </div>
              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                    setTimeout(function() { window.close(); }, 800);
                  }, 250);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        window.print();
      }
    } catch {
      window.print();
    }
  };

  // Copy specs summary to clipboard
  const handleCopySpecs = () => {
    playClickSound('toggle');
    const specs = [
      `WAVEZLY ARCHITECTURAL SPECIFICATIONS`,
      `Product: ${currentProduct.title}`,
      `Footprint: ${length.toFixed(1)}mm × ${width.toFixed(1)}mm × ${height.toFixed(1)}mm (${(length/25.4).toFixed(2)}" × ${(width/25.4).toFixed(2)}" × ${(height/25.4).toFixed(2)}")`,
      `Grid: ${rows} Rows × ${cols} Columns (${rows * cols} Bays)`,
      `Bay Dimensions: ${cellLengthMm.toFixed(1)}mm × ${cellWidthMm.toFixed(1)}mm × ${cavityDepthMm.toFixed(1)}mm`,
      `Wall Thickness: ${wallThickness.toFixed(1)}mm | Floor Base: ${bottomThickness.toFixed(1)}mm`,
      `Corner Fillet: R${cornerFilletRadius.toFixed(1)}mm`,
      `Estimated Mass: ${telemetry.totalWeightGrams.toFixed(1)}g`,
      `Chamber Volume: ${((length * width * height) / 1000).toFixed(1)} cm³`,
      `Material Finish: ${selectedMaterial.name}`,
      `Deboss Text: ${engravedText || 'None'}`,
      `Tolerance: ±0.25mm ISO 2768-m`,
    ].join('\n');

    navigator.clipboard?.writeText(specs);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={modalHeadingId}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Click outside backdrop */}
      <div
        className="absolute inset-0"
        onClick={() => {
          playClickSound('tab');
          onClose();
        }}
      />

      {/* Main Modal Card */}
      <div
        className={`relative z-10 w-full max-w-6xl max-h-[94vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl transition-all border ${
          isBlueprint
            ? 'bg-[#0B1B2B] text-white border-sky-900/60 shadow-[0_25px_50px_-12px_rgba(7,21,36,0.9)]'
            : 'bg-[#F8FAFC] text-zinc-900 border-zinc-300 shadow-2xl'
        }`}
      >
        {/* MODAL HEADER */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b ${
            isBlueprint
              ? 'bg-[#081524] border-sky-950/80 text-white'
              : 'bg-white border-zinc-200 text-zinc-900'
          }`}
        >
          {/* Title & Badge */}
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                isBlueprint
                  ? 'bg-sky-500/10 border-sky-400/30 text-sky-400'
                  : 'bg-blue-50 border-blue-200 text-blue-600'
              }`}
            >
              <Ruler className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id={modalHeadingId}
                  className="text-sm sm:text-base font-extrabold tracking-tight"
                >
                  2D Architectural Blueprint & Fabrication Schematic
                </h2>
                <span
                  className={`hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                    isBlueprint
                      ? 'bg-sky-950/80 text-sky-300 border-sky-800/60'
                      : 'bg-zinc-100 text-zinc-700 border-zinc-300'
                  }`}
                >
                  DWG-WVZ-{Math.round(length)}X{Math.round(width)}
                </span>
              </div>
              <p
                className={`text-[11px] ${
                  isBlueprint ? 'text-sky-300/70' : 'text-zinc-500'
                }`}
              >
                Orthographic plan & section views with millimeter annotations for physical drawer verification
              </p>
            </div>
          </div>

          {/* Quick Controls: Theme Toggle, Units Toggle, Zoom & Close */}
          <div className="flex items-center gap-2 flex-wrap ml-auto">
            {/* Units Toggle */}
            <div
              className={`flex items-center p-0.5 rounded-lg border text-xs font-semibold ${
                isBlueprint
                  ? 'bg-[#0B1B2B] border-sky-900/60'
                  : 'bg-zinc-100 border-zinc-300'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  playClickSound('toggle');
                  setUnitMode('dual');
                }}
                className={`px-2 py-1 rounded text-[11px] transition ${
                  unitMode === 'dual'
                    ? isBlueprint
                      ? 'bg-sky-500 text-white font-bold'
                      : 'bg-white text-blue-600 shadow-xs font-bold'
                    : isBlueprint
                    ? 'text-sky-300/70 hover:text-white'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Dual (mm/in)
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound('toggle');
                  setUnitMode('metric');
                }}
                className={`px-2 py-1 rounded text-[11px] transition ${
                  unitMode === 'metric'
                    ? isBlueprint
                      ? 'bg-sky-500 text-white font-bold'
                      : 'bg-white text-blue-600 shadow-xs font-bold'
                    : isBlueprint
                    ? 'text-sky-300/70 hover:text-white'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                mm
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound('toggle');
                  setUnitMode('imperial');
                }}
                className={`px-2 py-1 rounded text-[11px] transition ${
                  unitMode === 'imperial'
                    ? isBlueprint
                      ? 'bg-sky-500 text-white font-bold'
                      : 'bg-white text-blue-600 shadow-xs font-bold'
                    : isBlueprint
                    ? 'text-sky-300/70 hover:text-white'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                in
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => {
                playClickSound('toggle');
                setThemeMode(isBlueprint ? 'paper' : 'blueprint');
              }}
              title={isBlueprint ? 'Switch to Paper Mode' : 'Switch to Blueprint Mode'}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition ${
                isBlueprint
                  ? 'bg-[#0B1B2B] border-sky-900/60 text-sky-300 hover:bg-sky-950/60'
                  : 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              {isBlueprint ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="text-[11px] font-medium hidden md:inline">Paper</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-sky-600" />
                  <span className="text-[11px] font-medium hidden md:inline">Blueprint</span>
                </>
              )}
            </button>

            {/* Zoom Controls */}
            <div
              className={`hidden sm:flex items-center p-0.5 rounded-lg border text-xs ${
                isBlueprint
                  ? 'bg-[#0B1B2B] border-sky-900/60 text-sky-300'
                  : 'bg-zinc-100 border-zinc-300 text-zinc-700'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  playClickSound('tick');
                  setZoomLevel((prev) => Math.max(0.75, Number((prev - 0.2).toFixed(2))));
                }}
                className="p-1 hover:text-sky-400 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 text-[10px] font-mono font-bold">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => {
                  playClickSound('tick');
                  setZoomLevel((prev) => Math.min(1.8, Number((prev + 0.2).toFixed(2))));
                }}
                className="p-1 hover:text-sky-400 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              {zoomLevel !== 1 && (
                <button
                  type="button"
                  onClick={() => {
                    playClickSound('tick');
                    setZoomLevel(1);
                  }}
                  className="p-1 ml-0.5 border-l border-sky-900/40 hover:text-sky-400 cursor-pointer"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                playClickSound('tab');
                onClose();
              }}
              className={`p-1.5 rounded-lg transition cursor-pointer ml-1 ${
                isBlueprint
                  ? 'text-sky-400 hover:text-white hover:bg-sky-950/80'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200'
              }`}
              title="Close Blueprint (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BLUEPRINT CANVAS VIEWPORT */}
        <div
          ref={containerRef}
          className={`flex-1 overflow-auto p-2 sm:p-4 flex items-center justify-center select-none min-h-[380px] max-h-[68vh] transition-colors ${
            isBlueprint ? 'bg-[#07131F]' : 'bg-[#EDF2F7]'
          }`}
        >
          <div
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out',
            }}
            className="w-full max-w-[980px] drop-shadow-xl"
          >
            <svg
              ref={svgRef}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto block rounded-lg overflow-hidden border"
              style={{
                backgroundColor: colors.bg,
                borderColor: colors.paperBorder,
              }}
            >
              <defs>
                <pattern
                  id="bpMinorGrid"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke={colors.gridMinor}
                    strokeWidth="0.6"
                  />
                </pattern>

                <pattern
                  id="bpMajorGrid"
                  width="50"
                  height="50"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="50" height="50" fill="url(#bpMinorGrid)" />
                  <path
                    d="M 50 0 L 0 0 0 50"
                    fill="none"
                    stroke={colors.gridMajor}
                    strokeWidth="1.1"
                  />
                </pattern>

                <pattern
                  id="bpHatch"
                  width="8"
                  height="8"
                  patternTransform="rotate(45 0 0)"
                  patternUnits="userSpaceOnUse"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="8"
                    stroke={colors.hatch}
                    strokeWidth="1.2"
                  />
                </pattern>
              </defs>

              <rect width={svgWidth} height={svgHeight} fill="url(#bpMajorGrid)" />

              <rect
                x="18"
                y="18"
                width={svgWidth - 36}
                height={svgHeight - 36}
                fill="none"
                stroke={colors.paperBorder}
                strokeWidth="1.5"
              />
              <rect
                x="24"
                y="24"
                width={svgWidth - 48}
                height={svgHeight - 48}
                fill="none"
                stroke={colors.paperBorder}
                strokeWidth="0.7"
              />

              {/* Sheet Header */}
              <g id="svgSheetHeader">
                <text
                  x="38"
                  y="46"
                  fill={colors.titleBlockHeader}
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                  letterSpacing="1.2"
                >
                  WAVEZLY BESPOKE 3D • ARCHITECTURAL SPECIFICATION DRAWING
                </text>
                <text
                  x="38"
                  y="60"
                  fill={colors.titleBlockMuted}
                  fontSize="9"
                  fontFamily="monospace"
                >
                  PARAMETRIC DESK ORGANIZER // CAD REVISION A.04 // STATUS: APPROVED FOR MANUFACTURE
                </text>
              </g>

              {/* PLAN VIEW */}
              <g id="topPlanView">
                <text
                  x={planLeft}
                  y={planTop - 48}
                  fill={colors.dimText}
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                  letterSpacing="0.8"
                >
                  PLAN VIEW (TOP-DOWN ORTHOGONAL)
                </text>
                <text
                  x={planLeft}
                  y={planTop - 36}
                  fill={colors.titleBlockMuted}
                  fontSize="8"
                  fontFamily="monospace"
                >
                  SCALE 1:1 FIT • CENTERED ALONG X/Z PLANE
                </text>

                {/* Centerlines */}
                <line
                  x1={planLeft - 20}
                  y1={planCenterY}
                  x2={planLeft + planWidthPx + 20}
                  y2={planCenterY}
                  stroke={colors.centerlines}
                  strokeWidth="0.8"
                  strokeDasharray="6,4,2,4"
                  opacity="0.45"
                />
                <line
                  x1={planCenterX}
                  y1={planTop - 20}
                  x2={planCenterX}
                  y2={planTop + planHeightPx + 20}
                  stroke={colors.centerlines}
                  strokeWidth="0.8"
                  strokeDasharray="6,4,2,4"
                  opacity="0.45"
                />

                {/* Exterior Shell */}
                <rect
                  x={planLeft}
                  y={planTop}
                  width={planWidthPx}
                  height={planHeightPx}
                  rx={scaledFillet}
                  ry={scaledFillet}
                  fill={colors.fill}
                  stroke={colors.outline}
                  strokeWidth="2.4"
                />

                {/* Compartment Bays */}
                {Array.from({ length: rows }).map((_, r) =>
                  Array.from({ length: cols }).map((_, c) => {
                    const cellX =
                      planLeft + scaledWall + c * (scaledCellLen + scaledWall);
                    const cellY =
                      planTop + scaledWall + r * (scaledCellWid + scaledWall);

                    return (
                      <g key={`bay-${r}-${c}`}>
                        <rect
                          x={cellX}
                          y={cellY}
                          width={scaledCellLen}
                          height={scaledCellWid}
                          rx={scaledCavityFillet}
                          ry={scaledCavityFillet}
                          fill={colors.cavityFill}
                          stroke={colors.cavityStroke}
                          strokeWidth="1.4"
                        />
                        <circle
                          cx={cellX + scaledCellLen / 2}
                          cy={cellY + scaledCellWid / 2}
                          r="1.5"
                          fill={colors.dimLine}
                          opacity="0.3"
                        />
                      </g>
                    );
                  })
                )}

                {/* Deboss Text */}
                {engravedText && (
                  <g id="debossIndicator">
                    <rect
                      x={planLeft + planWidthPx * 0.15}
                      y={planTop + planHeightPx - scaledWall * 0.85}
                      width={planWidthPx * 0.7}
                      height={scaledWall * 0.7}
                      rx="2"
                      fill={isBlueprint ? '#173656' : '#E2E8F0'}
                      stroke={colors.dimLine}
                      strokeWidth="0.7"
                      strokeDasharray="3,2"
                    />
                    <text
                      x={planCenterX}
                      y={planTop + planHeightPx - scaledWall * 0.3}
                      textAnchor="middle"
                      fill={colors.dimText}
                      fontSize="7"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      DEBOSS: "{engravedText}"
                    </text>
                  </g>
                )}

                {/* DIMENSION 1: LENGTH */}
                <g id="dimLengthCallout">
                  <line
                    x1={planLeft}
                    y1={planTop - 4}
                    x2={planLeft}
                    y2={planTop - 26}
                    stroke={colors.dimLine}
                    strokeWidth="0.8"
                    opacity="0.75"
                  />
                  <line
                    x1={planLeft + planWidthPx}
                    y1={planTop - 4}
                    x2={planLeft + planWidthPx}
                    y2={planTop - 26}
                    stroke={colors.dimLine}
                    strokeWidth="0.8"
                    opacity="0.75"
                  />
                  <line
                    x1={planLeft}
                    y1={planTop - 18}
                    x2={planLeft + planWidthPx}
                    y2={planTop - 18}
                    stroke={colors.dimLine}
                    strokeWidth="1.2"
                  />
                  <polygon
                    points={`${planLeft},${planTop - 18} ${planLeft + 6},${planTop - 21} ${planLeft + 6},${planTop - 15}`}
                    fill={colors.dimLine}
                  />
                  <polygon
                    points={`${planLeft + planWidthPx},${planTop - 18} ${planLeft + planWidthPx - 6},${planTop - 21} ${planLeft + planWidthPx - 6},${planTop - 15}`}
                    fill={colors.dimLine}
                  />

                  <rect
                    x={planCenterX - 75}
                    y={planTop - 27}
                    width="150"
                    height="18"
                    rx="4"
                    fill={colors.dimPillBg}
                    stroke={colors.dimPillBorder}
                    strokeWidth="1"
                  />
                  <text
                    x={planCenterX}
                    y={planTop - 15}
                    textAnchor="middle"
                    fill={colors.dimText}
                    fontSize="9.5"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    L: {formatDim(length)}
                  </text>
                </g>

                {/* DIMENSION 2: WIDTH */}
                <g id="dimWidthCallout">
                  <line
                    x1={planLeft - 4}
                    y1={planTop}
                    x2={planLeft - 26}
                    y2={planTop}
                    stroke={colors.dimLine}
                    strokeWidth="0.8"
                    opacity="0.75"
                  />
                  <line
                    x1={planLeft - 4}
                    y1={planTop + planHeightPx}
                    x2={planLeft - 26}
                    y2={planTop + planHeightPx}
                    stroke={colors.dimLine}
                    strokeWidth="0.8"
                    opacity="0.75"
                  />
                  <line
                    x1={planLeft - 18}
                    y1={planTop}
                    x2={planLeft - 18}
                    y2={planTop + planHeightPx}
                    stroke={colors.dimLine}
                    strokeWidth="1.2"
                  />
                  <polygon
                    points={`${planLeft - 18},${planTop} ${planLeft - 21},${planTop + 6} ${planLeft - 15},${planTop + 6}`}
                    fill={colors.dimLine}
                  />
                  <polygon
                    points={`${planLeft - 18},${planTop + planHeightPx} ${planLeft - 21},${planTop + planHeightPx - 6} ${planLeft - 15},${planTop + planHeightPx - 6}`}
                    fill={colors.dimLine}
                  />

                  <g
                    transform={`translate(${planLeft - 18}, ${planCenterY}) rotate(-90)`}
                  >
                    <rect
                      x="-70"
                      y="-9"
                      width="140"
                      height="18"
                      rx="4"
                      fill={colors.dimPillBg}
                      stroke={colors.dimPillBorder}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill={colors.dimText}
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      W: {formatDim(width)}
                    </text>
                  </g>
                </g>

                {/* LEADER 1: WALL THICKNESS */}
                <g id="wallThicknessLeader">
                  <line
                    x1={planLeft + scaledWall / 2}
                    y1={planTop + scaledWall / 2}
                    x2={planLeft - 22}
                    y2={planTop + 24}
                    stroke={colors.leaderLine}
                    strokeWidth="1.2"
                  />
                  <line
                    x1={planLeft - 22}
                    y1={planTop + 24}
                    x2={planLeft - 75}
                    y2={planTop + 24}
                    stroke={colors.leaderLine}
                    strokeWidth="1.2"
                  />
                  <circle
                    cx={planLeft + scaledWall / 2}
                    cy={planTop + scaledWall / 2}
                    r="2"
                    fill={colors.leaderLine}
                  />
                  <text
                    x={planLeft - 75}
                    y={planTop + 20}
                    textAnchor="end"
                    fill={colors.calloutText}
                    fontSize="8.5"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    WALL: {formatMmOnly(wallThickness)}
                  </text>
                </g>

                {/* LEADER 2: CORNER FILLET */}
                <g id="cornerFilletLeader">
                  <line
                    x1={planLeft + planWidthPx - scaledFillet * 0.3}
                    y1={planTop + scaledFillet * 0.3}
                    x2={planLeft + planWidthPx + 28}
                    y2={planTop - 10}
                    stroke={colors.leaderLine}
                    strokeWidth="1.2"
                  />
                  <line
                    x1={planLeft + planWidthPx + 28}
                    y1={planTop - 10}
                    x2={planLeft + planWidthPx + 85}
                    y2={planTop - 10}
                    stroke={colors.leaderLine}
                    strokeWidth="1.2"
                  />
                  <circle
                    cx={planLeft + planWidthPx - scaledFillet * 0.3}
                    cy={planTop + scaledFillet * 0.3}
                    r="2"
                    fill={colors.leaderLine}
                  />
                  <text
                    x={planLeft + planWidthPx + 32}
                    y={planTop - 14}
                    fill={colors.calloutText}
                    fontSize="8.5"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    FILLET: R{formatMmOnly(cornerFilletRadius)}
                  </text>
                </g>

                {/* LEADER 3: COMPARTMENT BAY COUNT */}
                <g id="compartmentBayLeader">
                  <circle
                    cx={planLeft + scaledWall + scaledCellLen / 2}
                    cy={planTop + scaledWall + scaledCellWid / 2}
                    r="2"
                    fill={colors.leaderLine}
                  />
                  <line
                    x1={planLeft + scaledWall + scaledCellLen / 2}
                    y1={planTop + scaledWall + scaledCellWid / 2}
                    x2={planLeft - 22}
                    y2={planTop + planHeightPx - 10}
                    stroke={colors.leaderLine}
                    strokeWidth="1.2"
                  />
                  <line
                    x1={planLeft - 22}
                    y1={planTop + planHeightPx - 10}
                    x2={planLeft - 75}
                    y2={planTop + planHeightPx - 10}
                    stroke={colors.leaderLine}
                    strokeWidth="1.2"
                  />
                  <text
                    x={planLeft - 75}
                    y={planTop + planHeightPx - 14}
                    textAnchor="end"
                    fill={colors.calloutText}
                    fontSize="8.5"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    BAY: {formatMmOnly(cellLengthMm)} × {formatMmOnly(cellWidthMm)}
                  </text>
                  <text
                    x={planLeft - 75}
                    y={planTop + planHeightPx - 3}
                    textAnchor="end"
                    fill={colors.titleBlockMuted}
                    fontSize="7.5"
                    fontFamily="monospace"
                  >
                    GRID: {rows}R × {cols}C ({rows * cols} bays)
                  </text>
                </g>
              </g>

              {/* SECTION A-A ELEVATION VIEW */}
              <g id="sectionElevationView">
                <text
                  x={planLeft}
                  y={sectionTop - 26}
                  fill={colors.dimText}
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                  letterSpacing="0.8"
                >
                  SECTION A-A (FRONT ELEVATION & INTERNAL CAVITY PROFILE)
                </text>
                <text
                  x={planLeft}
                  y={sectionTop - 14}
                  fill={colors.titleBlockMuted}
                  fontSize="8"
                  fontFamily="monospace"
                >
                  CUTTING PLANE THROUGH DIVIDER WALLS & FLOOR THICKNESS
                </text>

                <line
                  x1={planLeft - 25}
                  y1={sectionBaseY}
                  x2={planLeft + planWidthPx + 25}
                  y2={sectionBaseY}
                  stroke={colors.paperBorder}
                  strokeWidth="1.2"
                />

                <rect
                  x={planLeft}
                  y={sectionTop}
                  width={planWidthPx}
                  height={sectionHeightPx}
                  rx="3"
                  ry="3"
                  fill="url(#bpHatch)"
                  stroke={colors.outline}
                  strokeWidth="2"
                />

                <line
                  x1={planLeft}
                  y1={sectionBaseY - sectionFloorPx}
                  x2={planLeft + planWidthPx}
                  y2={sectionBaseY - sectionFloorPx}
                  stroke={colors.outline}
                  strokeWidth="1.4"
                />

                {Array.from({ length: cols }).map((_, c) => {
                  const cutX =
                    planLeft + scaledWall + c * (scaledCellLen + scaledWall);
                  const cutY = sectionTop;
                  const cutW = scaledCellLen;
                  const cutH = sectionHeightPx - sectionFloorPx;

                  return (
                    <rect
                      key={`sec-bay-${c}`}
                      x={cutX}
                      y={cutY}
                      width={cutW}
                      height={cutH}
                      fill={colors.cavityFill}
                      stroke={colors.cavityStroke}
                      strokeWidth="1.2"
                    />
                  );
                })}

                {/* Height Callout */}
                <g id="dimHeightCallout">
                  <line
                    x1={planLeft + planWidthPx + 4}
                    y1={sectionTop}
                    x2={planLeft + planWidthPx + 24}
                    y2={sectionTop}
                    stroke={colors.dimLine}
                    strokeWidth="0.8"
                    opacity="0.75"
                  />
                  <line
                    x1={planLeft + planWidthPx + 4}
                    y1={sectionBaseY}
                    x2={planLeft + planWidthPx + 24}
                    y2={sectionBaseY}
                    stroke={colors.dimLine}
                    strokeWidth="0.8"
                    opacity="0.75"
                  />
                  <line
                    x1={planLeft + planWidthPx + 18}
                    y1={sectionTop}
                    x2={planLeft + planWidthPx + 18}
                    y2={sectionBaseY}
                    stroke={colors.dimLine}
                    strokeWidth="1.2"
                  />
                  <polygon
                    points={`${planLeft + planWidthPx + 18},${sectionTop} ${planLeft + planWidthPx + 15},${sectionTop + 5} ${planLeft + planWidthPx + 21},${sectionTop + 5}`}
                    fill={colors.dimLine}
                  />
                  <polygon
                    points={`${planLeft + planWidthPx + 18},${sectionBaseY} ${planLeft + planWidthPx + 15},${sectionBaseY - 5} ${planLeft + planWidthPx + 21},${sectionBaseY - 5}`}
                    fill={colors.dimLine}
                  />

                  <rect
                    x={planLeft + planWidthPx + 26}
                    y={sectionTop + sectionHeightPx / 2 - 9}
                    width="120"
                    height="18"
                    rx="4"
                    fill={colors.dimPillBg}
                    stroke={colors.dimPillBorder}
                    strokeWidth="1"
                  />
                  <text
                    x={planLeft + planWidthPx + 32}
                    y={sectionTop + sectionHeightPx / 2 + 3.5}
                    fill={colors.dimText}
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    H: {formatDim(height)}
                  </text>
                </g>

                {/* Floor Thickness */}
                <g id="floorThicknessLeader">
                  <circle
                    cx={planLeft + scaledWall * 1.5}
                    cy={sectionBaseY - sectionFloorPx / 2}
                    r="1.8"
                    fill={colors.leaderLine}
                  />
                  <line
                    x1={planLeft + scaledWall * 1.5}
                    y1={sectionBaseY - sectionFloorPx / 2}
                    x2={planLeft - 20}
                    y2={sectionBaseY + 16}
                    stroke={colors.leaderLine}
                    strokeWidth="1.1"
                  />
                  <line
                    x1={planLeft - 20}
                    y1={sectionBaseY + 16}
                    x2={planLeft - 75}
                    y2={sectionBaseY + 16}
                    stroke={colors.leaderLine}
                    strokeWidth="1.1"
                  />
                  <text
                    x={planLeft - 75}
                    y={sectionBaseY + 13}
                    textAnchor="end"
                    fill={colors.calloutText}
                    fontSize="8"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    FLOOR: {formatMmOnly(bottomThickness)}
                  </text>
                </g>
              </g>

              {/* TITLE BLOCK & SPECIFICATIONS */}
              <g id="architecturalTitleBlock">
                <rect
                  x="690"
                  y="70"
                  width="275"
                  height="585"
                  rx="6"
                  ry="6"
                  fill={colors.titleBlockBg}
                  stroke={colors.titleBlockBorder}
                  strokeWidth="1.5"
                />

                <rect
                  x="690"
                  y="70"
                  width="275"
                  height="54"
                  rx="6"
                  ry="6"
                  fill={isBlueprint ? '#0D2238' : '#F1F5F9'}
                />
                <text
                  x="705"
                  y="92"
                  fill={colors.titleBlockHeader}
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="monospace"
                  letterSpacing="1"
                >
                  WAVEZLY ARCHITECTURE
                </text>
                <text
                  x="705"
                  y="108"
                  fill={colors.titleBlockMuted}
                  fontSize="8.5"
                  fontFamily="monospace"
                >
                  RAPID 48H BESPOKE 3D MANUFACTURING
                </text>
                <line
                  x1="690"
                  y1="124"
                  x2="965"
                  y2="124"
                  stroke={colors.titleBlockBorder}
                  strokeWidth="1"
                />

                {/* Sub-block 1: Drawing Identification */}
                <g transform="translate(705, 138)">
                  <text x="0" y="0" fill={colors.titleBlockMuted} fontSize="7.5" fontFamily="monospace">
                    DRAWING IDENTIFIER
                  </text>
                  <text x="0" y="14" fill={colors.titleBlockText} fontSize="11" fontWeight="bold" fontFamily="monospace">
                    DWG-WVZ-{Math.round(length)}X{Math.round(width)}
                  </text>
                  <text x="170" y="0" fill={colors.titleBlockMuted} fontSize="7.5" fontFamily="monospace">
                    REVISION
                  </text>
                  <text x="170" y="14" fill={colors.titleBlockText} fontSize="10" fontWeight="bold" fontFamily="monospace">
                    A.04 (PROD)
                  </text>
                </g>
                <line x1="690" y1="168" x2="965" y2="168" stroke={colors.titleBlockBorder} strokeWidth="1" />

                {/* Sub-block 2: Dimensions */}
                <g transform="translate(705, 182)">
                  <text x="0" y="0" fill={colors.titleBlockHeader} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                    ENGINEERING DIMENSIONS
                  </text>
                  <text x="0" y="18" fill={colors.titleBlockMuted} fontSize="8" fontFamily="monospace">Exterior Footprint:</text>
                  <text x="250" y="18" textAnchor="end" fill={colors.titleBlockText} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                    {length.toFixed(1)} × {width.toFixed(1)} × {height.toFixed(1)} mm
                  </text>
                  <text x="0" y="32" fill={colors.titleBlockMuted} fontSize="8" fontFamily="monospace">Imperial Envelope:</text>
                  <text x="250" y="32" textAnchor="end" fill={colors.titleBlockText} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                    {(length/25.4).toFixed(2)}" × {(width/25.4).toFixed(2)}" × {(height/25.4).toFixed(2)}"
                  </text>
                  <text x="0" y="46" fill={colors.titleBlockMuted} fontSize="8" fontFamily="monospace">Compartment Grid:</text>
                  <text x="250" y="46" textAnchor="end" fill={colors.titleBlockText} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                    {rows} Rows × {cols} Cols ({rows * cols} bays)
                  </text>
                  <text x="0" y="60" fill={colors.titleBlockMuted} fontSize="8" fontFamily="monospace">Bay Clear Cavity:</text>
                  <text x="250" y="60" textAnchor="end" fill={colors.titleBlockText} fontSize="8" fontWeight="bold" fontFamily="monospace">
                    {cellLengthMm.toFixed(1)} × {cellWidthMm.toFixed(1)} × {cavityDepthMm.toFixed(1)} mm
                  </text>
                  <text x="0" y="74" fill={colors.titleBlockMuted} fontSize="8" fontFamily="monospace">Wall / Floor Thickness:</text>
                  <text x="250" y="74" textAnchor="end" fill={colors.titleBlockText} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                    {wallThickness.toFixed(1)} mm / {bottomThickness.toFixed(1)} mm
                  </text>
                  <text x="0" y="88" fill={colors.titleBlockMuted} fontSize="8" fontFamily="monospace">Corner Fillet Radius:</text>
                  <text x="250" y="88" textAnchor="end" fill={colors.titleBlockText} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                    R{cornerFilletRadius.toFixed(1)} mm
                  </text>
                </g>
                <line x1="690" y1="284" x2="965" y2="284" stroke={colors.titleBlockBorder} strokeWidth="1" />

                {/* Sub-block 3: Telemetry */}
                <g transform="translate(705, 298)">
                  <text x="0" y="0" fill={colors.titleBlockHeader} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                    FABRICATION TELEMETRY
                  </text>
                  <text x="0" y="18" fill={colors.titleBlockMuted} fontSize="8" fontFamily="monospace">Estimated Print Mass:</text>
                  <text x="250" y="18" textAnchor="end" fill={colors.titleBlockText} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                    {telemetry.totalWeightGrams.toFixed(1)} g
                  </text>
                  <text x="0" y="32" fill={colors.titleBlockMuted} fontSize="8" fontFamily="monospace">Chamber Bounding Vol:</text>
                  <text x="250" y="32" textAnchor="end" fill={colors.titleBlockText} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                    {((length * width * height) / 1000).toFixed(1)} cm³ ({((length * width * height) / 1000000).toFixed(3)} L)
                  </text>
                  <text x="0" y="46" fill={colors.titleBlockMuted} fontSize="8" fontFamily="monospace">Solid Material Vol:</text>
                  <text x="250" y="46" textAnchor="end" fill={colors.titleBlockText} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                    {telemetry.plasticVolumeCm3.toFixed(1)} cm³
                  </text>
                  <text x="0" y="60" fill={colors.titleBlockMuted} fontSize="8" fontFamily="monospace">Estimated Build Time:</text>
                  <text x="250" y="60" textAnchor="end" fill={colors.titleBlockText} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                    ~{telemetry.estimatedPrintHours.toFixed(1)} hours
                  </text>
                  <text x="0" y="74" fill={colors.titleBlockMuted} fontSize="8" fontFamily="monospace">FDM Slicing Profile:</text>
                  <text x="250" y="74" textAnchor="end" fill={colors.titleBlockText} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                    0.20mm Structural
                  </text>
                </g>
                <line x1="690" y1="386" x2="965" y2="386" stroke={colors.titleBlockBorder} strokeWidth="1" />

                {/* Sub-block 4: Material */}
                <g transform="translate(705, 400)">
                  <text x="0" y="0" fill={colors.titleBlockHeader} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                    MATERIAL SPECIFICATION
                  </text>
                  <text x="0" y="16" fill={colors.titleBlockMuted} fontSize="8" fontFamily="monospace">Selected Finish:</text>
                  <text x="250" y="16" textAnchor="end" fill={colors.titleBlockText} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                    {selectedMaterial.name}
                  </text>
                  <text x="0" y="30" fill={colors.titleBlockMuted} fontSize="8" fontFamily="monospace">Material Class:</text>
                  <text x="250" y="30" textAnchor="end" fill={colors.titleBlockText} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                    Architectural Polymer (PLA)
                  </text>
                  <text x="0" y="44" fill={colors.titleBlockMuted} fontSize="8" fontFamily="monospace">Rim Deboss Engraving:</text>
                  <text x="250" y="44" textAnchor="end" fill={colors.titleBlockText} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                    {engravedText ? `"${engravedText}"` : 'NONE (PLAIN RIM)'}
                  </text>
                </g>
                <line x1="690" y1="458" x2="965" y2="458" stroke={colors.titleBlockBorder} strokeWidth="1" />

                {/* Sub-block 5: Quality Assurance */}
                <g transform="translate(705, 472)">
                  <rect
                    x="0"
                    y="0"
                    width="250"
                    height="76"
                    rx="4"
                    fill={isBlueprint ? '#0D2238' : '#EFF6FF'}
                    stroke={colors.stampBorder}
                    strokeWidth="1.2"
                    strokeDasharray="4,2"
                  />
                  <text
                    x="125"
                    y="18"
                    textAnchor="middle"
                    fill={colors.stampText}
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                    letterSpacing="0.8"
                  >
                    ★ 100% FIT GUARANTEE CERTIFIED ★
                  </text>
                  <text
                    x="125"
                    y="32"
                    textAnchor="middle"
                    fill={colors.titleBlockText}
                    fontSize="7.5"
                    fontFamily="monospace"
                  >
                    TOLERANCE: ±0.25mm (DIN ISO 2768-m)
                  </text>
                  <text
                    x="125"
                    y="45"
                    textAnchor="middle"
                    fill={colors.titleBlockMuted}
                    fontSize="7"
                    fontFamily="monospace"
                  >
                    Zero-Risk Millimeter Clearance Guarantee
                  </text>
                  <text
                    x="125"
                    y="58"
                    textAnchor="middle"
                    fill={colors.titleBlockMuted}
                    fontSize="7"
                    fontFamily="monospace"
                  >
                    Free Remake if Drawer Doesn't Glide Cleanly
                  </text>
                </g>

                {/* Sub-block 6: Location */}
                <g transform="translate(705, 560)">
                  <text x="0" y="12" fill={colors.titleBlockMuted} fontSize="7.5" fontFamily="monospace">
                    ORIGIN: BOISE, IDAHO (USA)
                  </text>
                  <text x="0" y="24" fill={colors.titleBlockMuted} fontSize="7" fontFamily="monospace">
                    WAVEZLY INDUSTRIAL RAPID LAB
                  </text>
                  <text x="250" y="24" textAnchor="end" fill={colors.titleBlockHeader} fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                    READY FOR PRINT
                  </text>
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* BOTTOM ACTIONS BAR */}
        <div
          className={`px-4 sm:px-6 py-3.5 border-t flex flex-col md:flex-row items-center justify-between gap-3 ${
            isBlueprint
              ? 'bg-[#081524] border-sky-950/80 text-white'
              : 'bg-white border-zinc-200 text-zinc-900'
          }`}
        >
          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs">
            <div className="flex items-center gap-1.5 font-mono">
              <Box className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
              <span className="font-bold">
                {length.toFixed(0)}×{width.toFixed(0)}×{height.toFixed(0)} mm
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-zinc-400">
              <span>•</span>
              <Weight className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{telemetry.totalWeightGrams.toFixed(0)}g Mass</span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-zinc-400 hidden sm:flex">
              <span>•</span>
              <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{((length * width * height) / 1000).toFixed(0)} cm³ Vol</span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-zinc-400 hidden md:flex">
              <span>•</span>
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>~{telemetry.estimatedPrintHours.toFixed(1)}h Print</span>
            </div>

            <button
              type="button"
              onClick={handleCopySpecs}
              className={`text-[11px] underline underline-offset-2 transition cursor-pointer ml-1 ${
                isBlueprint ? 'text-sky-400 hover:text-white' : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              {isCopied ? '✓ Copied Specs' : 'Copy All Specs'}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={handleDownloadSvg}
              disabled={isExporting}
              className={`flex-1 sm:flex-initial min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs ${
                isBlueprint
                  ? 'bg-sky-950/70 border-sky-800 text-sky-300 hover:bg-sky-900/90 hover:text-white'
                  : 'bg-zinc-100 border-zinc-300 text-zinc-700 hover:bg-zinc-200'
              }`}
              title="Download pure vector SVG for CAD or drawer fit"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Vector SVG</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className={`flex-1 sm:flex-initial min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs ${
                isBlueprint
                  ? 'bg-sky-500 hover:bg-sky-400 text-white border-sky-400 shadow-sky-500/20'
                  : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
              }`}
              title="Print 1:1 blueprint or save to PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            {onAddToCart && (
              <button
                type="button"
                onClick={() => {
                  playClickSound('cart');
                  onAddToCart();
                  onClose();
                }}
                className="hidden lg:flex min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold bg-[#FF6B00] hover:bg-[#ea5f00] text-white transition items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Add Custom Tray</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
