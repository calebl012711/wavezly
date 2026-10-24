/**
 * WAVEZLY 3D DESK & CUSTOMIZER CANVAS ORCHESTRATOR
 * Assembles the full photorealistic 3D environment:
 * - StudioEnvironment: Warm directional sunlight, sky ambient fill, and soft contact shadows
 * - RealisticDeskModel: Solid Scandinavian white-oak desk slab, steel frame, and apron cabinet
 * - SlidingDrawerUnit: Interactive pull-out drawer with 60fps damped kinematics holding ParametricMesh
 * - DeskLifestyleProps: Sculptural Voronoi table lamp (with warm 2700K point light), ceramic coffee mug, notebook & pen
 * - CameraController: Smooth lerp transitions between:
 *    * Mode 1: "Desk Environment View" (45-degree angle showing desk, glowing lamp, mug & sliding drawer)
 *    * Mode 2: "Close-up Product View" (tight macro camera for 360-degree millimeter inspection)
 * - In-viewport controls: Interactive Open/Close Drawer toggle and View Mode switcher
 */

import React, { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { ParametricMesh } from './ParametricMesh';
import { StudioEnvironment } from './StudioEnvironment';
import { RealisticDeskModel } from './RealisticDeskModel';
import { SlidingDrawerUnit } from './SlidingDrawerUnit';
import { DeskLifestyleProps } from './DeskLifestyleProps';
import { CameraController, CameraViewMode } from './CameraController';
import { ParametricOrganizerDimensions, MaterialOption } from '../../types';
import { LightingPreset, useCustomizerStore } from '../../store/useCustomizerStore';
import { playClickSound } from '../../lib/soundEffects';
import { Eye, ZoomIn, Rotate3d, Lock } from 'lucide-react';

export interface OrganizerCanvasProps {
  dimensions: ParametricOrganizerDimensions;
  material: MaterialOption;
  resinInlay: MaterialOption | null;
  onMeshReady?: (meshGroup: THREE.Group) => void;
  autoRotate?: boolean;
  onToggleAutoRotate?: () => void;
  wireframe?: boolean;
  engravedText?: string;
  sliceHeight?: number;
  explodedOffset?: number;
  lightingPreset?: LightingPreset;
  initialDrawerOpen?: boolean;
  showDrawerControls?: boolean;
  enableDrawer?: boolean;
  viewMode?: CameraViewMode;
  isDrawerOpen?: boolean;
  onToggleDrawer?: () => void;
  onViewModeChange?: (mode: CameraViewMode) => void;
}

/**
 * Architectural SVG Drawer Slide Icon with dynamic open/closed state
 */
const DrawerSlideIcon: React.FC<{ isOpen: boolean; className?: string }> = ({
  isOpen,
  className = 'w-4 h-4',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Desk Carcass Outline */}
    <rect x="2" y="3" width="20" height="6" rx="1.5" />
    <line x1="10" y1="6" x2="14" y2="6" strokeWidth="2.5" />
    {/* Sliding Drawer Body */}
    <rect
      x={isOpen ? '3' : '4'}
      y={isOpen ? '13' : '11'}
      width={isOpen ? '18' : '16'}
      height="8"
      rx="1.5"
      className="transition-all duration-300 ease-out"
    />
    {/* Drawer Handle */}
    <line
      x1="10"
      y1={isOpen ? '17' : '15'}
      x2="14"
      y2={isOpen ? '17' : '15'}
      strokeWidth="2.5"
      className="transition-all duration-300 ease-out"
    />
    {/* Motion Arrow Indicator */}
    <path
      d={isOpen ? 'M12 11l-2 2h4l-2-2z' : 'M12 11l2-2h-4l2 2z'}
      fill="currentColor"
      stroke="none"
      className="transition-transform duration-300 opacity-70"
    />
  </svg>
);

export const OrganizerCanvas: React.FC<OrganizerCanvasProps> = ({
  dimensions,
  material,
  resinInlay,
  onMeshReady,
  autoRotate = false,
  onToggleAutoRotate,
  wireframe = false,
  engravedText,
  sliceHeight,
  explodedOffset,
  lightingPreset,
  initialDrawerOpen = true,
  showDrawerControls = true,
  enableDrawer = true,
  viewMode: propsViewMode,
  isDrawerOpen: propsIsDrawerOpen,
  onToggleDrawer,
  onViewModeChange,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [isTouchActive, setIsTouchActive] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 768
      );
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  // Store bindings with fallback to local state / props
  const storeIsDrawerOpen = useCustomizerStore((state) => state.isDrawerOpen);
  const storeToggleDrawer = useCustomizerStore((state) => state.toggleDrawerOpen);
  const storeViewMode = useCustomizerStore((state) => state.viewMode);
  const storeSetViewMode = useCustomizerStore((state) => state.setViewMode);

  const [localDrawerOpen, setLocalDrawerOpen] = useState(initialDrawerOpen);
  const [localViewMode, setLocalViewMode] = useState<CameraViewMode>('desk');

  const drawerOpen =
    propsIsDrawerOpen !== undefined
      ? propsIsDrawerOpen
      : storeIsDrawerOpen !== undefined
      ? storeIsDrawerOpen
      : localDrawerOpen;

  const viewMode =
    propsViewMode !== undefined
      ? propsViewMode
      : (storeViewMode as CameraViewMode) !== undefined
      ? (storeViewMode as CameraViewMode)
      : localViewMode;

  const slideDistance = dimensions.width * 0.82 + 45;
  const [drawerSlideZ, setDrawerSlideZ] = useState(drawerOpen ? slideDistance : 0);

  // Keep slide offset synced when drawer state changes externally
  useEffect(() => {
    setDrawerSlideZ(drawerOpen ? slideDistance : 0);
  }, [drawerOpen, slideDistance]);

  const toggleDrawer = useCallback(() => {
    if (onToggleDrawer) {
      onToggleDrawer();
    } else if (storeToggleDrawer) {
      storeToggleDrawer();
    } else {
      setLocalDrawerOpen((prev) => !prev);
    }
    playClickSound('snap');
  }, [onToggleDrawer, storeToggleDrawer]);

  const handleViewModeChange = useCallback(
    (mode: CameraViewMode) => {
      if (onViewModeChange) {
        onViewModeChange(mode);
      } else if (storeSetViewMode) {
        storeSetViewMode(mode);
      } else {
        setLocalViewMode(mode);
      }
      playClickSound('tab');
    },
    [onViewModeChange, storeSetViewMode]
  );

  const handleSlideChange = useCallback((offsetZ: number) => {
    setDrawerSlideZ(offsetZ);
  }, []);

  // Dynamic shadow scale based on longest dimension & desk footprint
  const maxDim = Math.max(dimensions.length, dimensions.width);
  const shadowScale = Math.max(420, maxDim * 2.8);

  return (
    <div className="relative w-full h-full min-h-[340px] xs:min-h-[380px] sm:min-h-[460px] bg-gradient-to-b from-[#FFFFFF] via-[#F8F9FA] to-[#EFF1F5] dark:from-[#111317] dark:to-[#090A0D] rounded-2xl overflow-hidden border border-slate-200/90 dark:border-zinc-800 select-none">
      {/* Precision Grid Coordinates Overlay (Top-Left) */}
      <div className="absolute top-3 left-3 sm:left-4 z-10 pointer-events-none flex items-center space-x-2 font-sans text-xs text-slate-500 dark:text-zinc-400 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-slate-200/60 dark:border-zinc-800 shadow-xs hidden xs:flex">
        <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
        <span className="font-semibold text-[#0F172A] dark:text-zinc-200">
          3D Studio
        </span>
      </div>

      {/* Mobile Touch to Rotate / Lock Scroll Pill */}
      {isTouchDevice && (
        <div className="absolute inset-x-0 bottom-3.5 z-30 flex justify-center pointer-events-none px-4 sm:hidden">
          {isTouchActive ? (
            <button
              type="button"
              onClick={() => setIsTouchActive(false)}
              className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0F172A]/90 dark:bg-zinc-800/95 backdrop-blur-md border border-zinc-700 shadow-md text-xs font-bold text-white hover:bg-[#0F172A] active:scale-95 transition cursor-pointer min-h-[44px]"
            >
              <Lock className="w-4 h-4 text-[#FF6B00]" />
              <span>3D Active • Tap to Lock Scroll</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsTouchActive(true)}
              className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200/90 dark:border-zinc-700 shadow-md text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-white active:scale-95 transition cursor-pointer min-h-[44px]"
            >
              <Rotate3d className="w-4 h-4 text-[#FF6B00]" />
              <span>Touch to Rotate 3D</span>
            </button>
          )}
        </div>
      )}

      {/* Interactive In-Canvas Viewport Pills (Top-Right) */}
      {showDrawerControls && (
        <div className="absolute top-3 right-3 sm:right-4 z-20 flex flex-wrap items-center gap-1.5 sm:gap-2 pointer-events-auto max-w-[calc(100%-1rem)]">
          {/* 360 Spin Toggle */}
          {onToggleAutoRotate && (
            <button
              type="button"
              onClick={onToggleAutoRotate}
              title={autoRotate ? 'Pause 360° spin' : 'Auto-spin 360°'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-xs border min-h-[38px] ${
                autoRotate
                  ? 'bg-orange-50 text-[#FF6B00] border-orange-200 shadow-xs'
                  : 'bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-700/80 hover:bg-white'
              }`}
            >
              <span>{autoRotate ? 'Spinning' : '360°'}</span>
            </button>
          )}

          {/* Pill 1: Open / Close Drawer Button */}
          {enableDrawer && (
            <button
              type="button"
              onClick={toggleDrawer}
              title={drawerOpen ? 'Click to close drawer' : 'Click to open drawer'}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-xs border min-h-[38px] ${
                drawerOpen
                  ? 'bg-white/95 dark:bg-zinc-900/95 text-zinc-900 dark:text-zinc-100 border-zinc-200/90 dark:border-zinc-700/90 hover:bg-zinc-50'
                  : 'bg-zinc-900/90 dark:bg-zinc-100/95 text-white dark:text-zinc-900 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <DrawerSlideIcon
                isOpen={drawerOpen}
                className={`w-3.5 h-3.5 ${
                  drawerOpen ? 'text-[#FF6B00]' : 'text-zinc-300 dark:text-zinc-600'
                }`}
              />
              <span className="hidden xs:inline">{drawerOpen ? 'Close Drawer' : 'Open Drawer'}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  drawerOpen ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'
                }`}
              />
            </button>
          )}

          {/* Pill 2: View Mode Switcher (Desk Environment vs Close-up Product) */}
          <div className="flex items-center p-0.5 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-700/80 shadow-xs">
            <button
              type="button"
              onClick={() => handleViewModeChange('desk')}
              title="Desk Environment View (45° warm desk perspective)"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer min-h-[36px] ${
                viewMode === 'desk'
                  ? 'bg-[#FF6B00] text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desk View</span>
            </button>

            <button
              type="button"
              onClick={() => handleViewModeChange('closeup')}
              title="Close-up Product View (360° millimeter inspection)"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer min-h-[36px] ${
                viewMode === 'closeup'
                  ? 'bg-[#FF6B00] text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Close-up View</span>
            </button>
          </div>
        </div>
      )}

      {/* 3D WebGL Canvas with Touch Hijack Prevention */}
      <div
        className={`w-full h-full ${
          isTouchDevice && !isTouchActive
            ? 'touch-pan-y pointer-events-none'
            : 'touch-none pointer-events-auto'
        }`}
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
            powerPreference: 'high-performance',
          }}
          camera={{
            position: [180, 260, 360],
            fov: 42,
            near: 1,
            far: 2500,
          }}
        >
          <Suspense fallback={null}>
            {/* 1. Photorealistic Studio Environment Lighting */}
            <StudioEnvironment shadowScale={shadowScale} preset={lightingPreset} />

            {/* 2. Realistic Scandinavian Wood Desk Setup */}
            <RealisticDeskModel
              deskWidth={Math.max(840, dimensions.length * 2.2)}
              deskDepth={Math.max(560, dimensions.width * 1.5)}
              woodFinish="whiteOak"
              centerOnDrawer={true}
              hideLeftDrawer={true}
              showAccessories={false}
              showShadows={true}
            />

            {/* 3. Interactive Sliding Drawer Unit holding the Parametric Organizer Mesh */}
            {enableDrawer ? (
              <SlidingDrawerUnit
                isOpen={drawerOpen}
                onToggle={toggleDrawer}
                onSlideChange={handleSlideChange}
                drawerWidth={Math.max(dimensions.length + 24, 280)}
                drawerDepth={Math.max(dimensions.width + 32, 320)}
                drawerHeight={Math.max(dimensions.height + 16, 60)}
                slideDistance={slideDistance}
                showDeskHousing={false}
                finish="oak"
                handleStyle="anodized_lip"
              >
                <ParametricMesh
                  dimensions={dimensions}
                  material={material}
                  resinInlay={resinInlay}
                  wireframe={wireframe}
                  engravedText={engravedText}
                  sliceHeight={sliceHeight}
                  explodedOffset={explodedOffset}
                  onMeshReady={onMeshReady}
                />
              </SlidingDrawerUnit>
            ) : (
              <ParametricMesh
                dimensions={dimensions}
                material={material}
                resinInlay={resinInlay}
                wireframe={wireframe}
                engravedText={engravedText}
                sliceHeight={sliceHeight}
                explodedOffset={explodedOffset}
                onMeshReady={onMeshReady}
              />
            )}

            {/* 4. Desk Lifestyle Props (Glowing Voronoi Lamp, Ceramic Mug, Notebook, Pen) */}
            <DeskLifestyleProps
              organizerDimensions={dimensions}
              showLamp={true}
              showMug={true}
              showNotebook={true}
              showPen={true}
              showDeskMat={true}
              showEarbuds={true}
              lampIntensity={3.8}
              visible={true}
            />

            {/* 5. Smooth Camera Controller */}
            <CameraController
              viewMode={viewMode}
              drawerOffsetZ={enableDrawer ? drawerSlideZ : 0}
              dimensions={dimensions}
              controlsRef={controlsRef}
            />

            {/* 6. OrbitControls for 360-degree rotation */}
            <OrbitControls
              ref={controlsRef}
              enabled={!isTouchDevice || isTouchActive}
              enableDamping
              dampingFactor={0.06}
              minDistance={80}
              maxDistance={700}
              maxPolarAngle={Math.PI / 2.05}
              minPolarAngle={0.05}
              autoRotate={autoRotate}
              autoRotateSpeed={1.2}
              target={[
                0,
                dimensions.height / 2,
                enableDrawer && drawerOpen ? drawerSlideZ * 0.35 : 0,
              ]}
              touches={{
                ONE: THREE.TOUCH.ROTATE,
                TWO: THREE.TOUCH.DOLLY_PAN,
              }}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Viewport Scale & Interaction Guidance (Bottom) */}
      <div className="absolute bottom-3 left-4 right-4 z-10 pointer-events-none flex items-center justify-between font-sans text-xs text-zinc-400 dark:text-zinc-500">
        <span className="hidden sm:inline">
          Click 3D drawer handle or use top button to slide open/close • 45° Desk & 360° Macro Views
        </span>
        <span className="ml-auto">1:1 Millimeter Scale • Guaranteed Fit</span>
      </div>
    </div>
  );
};
