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
import { OrganizerGearLoadout } from './OrganizerGearLoadout';
import { ParametricOrganizerDimensions, MaterialOption } from '../../types';
import { LightingPreset, useCustomizerStore } from '../../store/useCustomizerStore';
import { playDrawerSlideSound, playSnapPresetSound } from '../../lib/soundEffects';
import { LightingPresetSwitcher } from './StudioEnvironment';
import { Eye, ZoomIn, Rotate3d, Lock, Sparkles, QrCode, Box } from 'lucide-react';

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
  showGearLoadout?: boolean;
  onToggleDrawer?: () => void;
  onViewModeChange?: (mode: CameraViewMode) => void;
  onToggleGearLoadout?: () => void;
  onRequestARModal?: () => void;
  priceUsd?: number;
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
  showGearLoadout: propsShowGearLoadout,
  onToggleDrawer,
  onViewModeChange,
  onToggleGearLoadout,
  onRequestARModal,
  priceUsd,
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
  const storeShowGearLoadout = useCustomizerStore((state) => state.showGearLoadout);
  const storeToggleGearLoadout = useCustomizerStore((state) => state.toggleGearLoadout);

  const [localDrawerOpen, setLocalDrawerOpen] = useState(initialDrawerOpen);
  const [localViewMode, setLocalViewMode] = useState<CameraViewMode>('desk');
  const [localShowGearLoadout, setLocalShowGearLoadout] = useState(true);

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

  const showGearLoadout =
    propsShowGearLoadout !== undefined
      ? propsShowGearLoadout
      : storeShowGearLoadout !== undefined
      ? storeShowGearLoadout
      : localShowGearLoadout;

  const toggleGearLoadout = useCallback(() => {
    if (onToggleGearLoadout) {
      onToggleGearLoadout();
    } else if (storeToggleGearLoadout) {
      storeToggleGearLoadout();
    } else {
      setLocalShowGearLoadout((prev) => !prev);
    }
    playSnapPresetSound();
  }, [onToggleGearLoadout, storeToggleGearLoadout]);

  // Precision-locked drawer & desk geometry coordinates (in mm)
  const drawerWidth = dimensions.length + 12;
  const drawerDepth = dimensions.width + 16;
  const drawerHeight = dimensions.height + 8;
  const drawerWallThickness = 12;
  const drawerBottomThickness = 8;
  const totalBoxWidth = drawerWidth + 2 * drawerWallThickness;
  const slideDistance = Math.round(drawerDepth * 0.86);
  const targetSlideZ = drawerOpen ? slideDistance : 0;

  // Desk carcass proportions locked to the drawer cavity
  const topThickness = 25;
  const drawerHousingHeight = drawerHeight + 34;
  const deskWidth = Math.max(760, 2 * (totalBoxWidth + 32) + 80);
  const deskDepth = Math.max(420, drawerDepth + 140);
  // Top surface of the solid white-oak desktop slab in world coordinates
  const deskTopSurfaceY = drawerHeight + 8 + topThickness;
  // Center Z of the desktop slab in world coordinates (since front edge is at +drawerDepth/2 + 22)
  const deskCenterZ = -(deskDepth / 2 - 22 - drawerDepth / 2);

  const toggleDrawer = useCallback(() => {
    const nextState = !drawerOpen;
    if (onToggleDrawer) {
      onToggleDrawer();
    } else if (storeToggleDrawer) {
      storeToggleDrawer();
    } else {
      setLocalDrawerOpen((prev) => !prev);
    }
    playDrawerSlideSound(nextState);
  }, [drawerOpen, onToggleDrawer, storeToggleDrawer]);

  const handleViewModeChange = useCallback(
    (mode: CameraViewMode) => {
      if (onViewModeChange) {
        onViewModeChange(mode);
      } else if (storeSetViewMode) {
        storeSetViewMode(mode);
      } else {
        setLocalViewMode(mode);
      }
      playSnapPresetSound();
    },
    [onViewModeChange, storeSetViewMode]
  );

  // Dynamic shadow scale based on longest dimension & desk footprint
  const maxDim = Math.max(dimensions.length, dimensions.width);
  const shadowScale = Math.max(420, maxDim * 2.8);

  const inchesLen = (dimensions.length / 25.4).toFixed(1);
  const inchesWid = (dimensions.width / 25.4).toFixed(1);
  const inchesHgt = (dimensions.height / 25.4).toFixed(1);

  return (
    <div className="relative w-full h-full min-h-[340px] xs:min-h-[380px] sm:min-h-[460px] bg-gradient-to-b from-[#FAF7F2] via-[#F2ECE1] to-[#E6DEC8] dark:from-[#161514] dark:via-[#11100F] dark:to-[#0B0A09] rounded-2xl overflow-hidden border border-stone-200/90 dark:border-zinc-800 select-none">
      {/* Unified Top-Left Live Spec & Price Pill */}
      <div className="absolute top-3 left-3 sm:left-4 z-20 pointer-events-none flex items-center gap-2 font-sans text-xs bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-200/80 dark:border-zinc-800 shadow-xs">
        <Box className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
        <span className="font-bold text-[#0F172A] dark:text-zinc-100">
          {dimensions.length}×{dimensions.width}×{dimensions.height} mm
        </span>
        <span className="text-zinc-400 hidden md:inline font-normal">
          ({inchesLen}″ × {inchesWid}″ × {inchesHgt}″)
        </span>
        {priceUsd !== undefined && (
          <>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="font-extrabold text-[#FF6B00]">${priceUsd.toFixed(2)}</span>
          </>
        )}
      </div>

      {/* Cinematic Lighting Atmosphere Switcher (Bottom-Left) */}
      <div className="absolute bottom-9 sm:bottom-8 left-3 sm:left-4 z-20 pointer-events-auto">
        <LightingPresetSwitcher />
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

      {/* Unified Top-Right Interactive In-Canvas Viewport Toolbar */}
      {showDrawerControls && (
        <div className="absolute top-3 right-3 sm:right-4 z-20 flex flex-wrap items-center justify-end gap-1.5 pointer-events-auto max-w-[calc(100%-10rem)] sm:max-w-none">
          {/* View Mode Switcher (Desk Environment vs Close-up Product) */}
          <div className="flex items-center p-0.5 rounded-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-stone-200/90 dark:border-zinc-700/90 shadow-xs">
            <button
              type="button"
              onClick={() => handleViewModeChange('desk')}
              title="Scandinavian Desk View (shows oak desk, open drawer, lamp & mug)"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer min-h-[34px] ${
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
              title="Close-up Tray View (360° macro inspection)"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer min-h-[34px] ${
                viewMode === 'closeup'
                  ? 'bg-[#FF6B00] text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Close-up</span>
            </button>
          </div>

          {/* Open / Close Drawer Button */}
          {enableDrawer && (
            <button
              type="button"
              onClick={toggleDrawer}
              title={drawerOpen ? 'Slide drawer closed' : 'Slide drawer open'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-xs border min-h-[36px] ${
                drawerOpen
                  ? 'bg-white/95 dark:bg-zinc-900/95 text-zinc-900 dark:text-zinc-100 border-stone-200/90 dark:border-zinc-700/90 hover:bg-stone-50'
                  : 'bg-zinc-900/95 dark:bg-zinc-100/95 text-white dark:text-zinc-900 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <DrawerSlideIcon
                isOpen={drawerOpen}
                className={`w-3.5 h-3.5 ${
                  drawerOpen ? 'text-[#FF6B00]' : 'text-zinc-300 dark:text-zinc-600'
                }`}
              />
              <span className="hidden xs:inline">{drawerOpen ? 'Slide Close' : 'Slide Open'}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  drawerOpen ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'
                }`}
              />
            </button>
          )}

          {/* Staged EDC Gear Loadout Toggle */}
          <button
            type="button"
            onClick={toggleGearLoadout}
            title={showGearLoadout ? 'Hide staged EDC gear items' : 'Stage EDC gear items in tray compartments'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-xs border min-h-[36px] ${
              showGearLoadout
                ? 'bg-white/95 dark:bg-zinc-900/95 text-[#FF6B00] border-[#FF6B00]/40 shadow-xs'
                : 'bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-300 border-stone-200/80 dark:border-zinc-700/80 hover:bg-white'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${showGearLoadout ? 'text-[#FF6B00]' : 'text-zinc-400'}`} />
            <span className="hidden md:inline">EDC Gear: {showGearLoadout ? 'On' : 'Off'}</span>
          </button>

          {/* 360 Spin Toggle */}
          {onToggleAutoRotate && (
            <button
              type="button"
              onClick={onToggleAutoRotate}
              title={autoRotate ? 'Pause 360° spin' : 'Auto-spin 360°'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-xs border min-h-[36px] ${
                autoRotate
                  ? 'bg-orange-50 text-[#FF6B00] border-orange-300 shadow-xs'
                  : 'bg-white/95 dark:bg-zinc-900/95 text-zinc-700 dark:text-zinc-300 border-stone-200/80 dark:border-zinc-700/80 hover:bg-white'
              }`}
            >
              <Rotate3d className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span className="hidden lg:inline">{autoRotate ? 'Spinning' : '360°'}</span>
            </button>
          )}

          {/* AR Quick Look Button */}
          {onRequestARModal && (
            <button
              type="button"
              onClick={onRequestARModal}
              title="Preview in your physical drawer with AR Quick Look"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-xs border min-h-[36px] bg-zinc-900/95 dark:bg-white/95 text-white dark:text-zinc-900 border-zinc-800 hover:bg-[#FF6B00] hover:border-[#FF6B00]"
            >
              <QrCode className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span className="hidden sm:inline">AR View</span>
            </button>
          )}
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
            toneMappingExposure: 1.08,
            powerPreference: 'high-performance',
          }}
          camera={{
            position: [-165, 225, 365],
            fov: 38,
            near: 2,
            far: 2500,
          }}
        >
          <Suspense fallback={null}>
            {/* 1. Photorealistic Studio Environment Lighting */}
            <StudioEnvironment shadowScale={shadowScale} preset={lightingPreset} />

            {/* 2. Realistic Scandinavian White-Oak Desk (Visible in Desk View or when drawer is enabled) */}
            {enableDrawer && (
              <RealisticDeskModel
                deskWidth={deskWidth}
                deskDepth={deskDepth}
                topThickness={topThickness}
                drawerHousingHeight={drawerHousingHeight}
                woodFinish="whiteOak"
                centerOnDrawer={true}
                hideLeftDrawer={true}
                activeDrawerDepth={drawerDepth}
                showAccessories={false}
                showShadows={false}
              />
            )}

            {/* 3. Interactive Sliding Drawer Unit holding the Parametric Organizer Mesh */}
            {enableDrawer ? (
              <SlidingDrawerUnit
                isOpen={drawerOpen}
                onToggle={toggleDrawer}
                drawerWidth={drawerWidth}
                drawerDepth={drawerDepth}
                drawerHeight={drawerHeight}
                wallThickness={drawerWallThickness}
                bottomThickness={drawerBottomThickness}
                slideDistance={slideDistance}
                showDeskHousing={false}
                finish="oak"
                handleStyle="anodized_lip"
                handleColor="#6E5B4B"
              >
                <group position={[0, 0.5, 0]}>
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
                  <OrganizerGearLoadout
                    dimensions={dimensions}
                    visible={showGearLoadout}
                  />
                </group>
              </SlidingDrawerUnit>
            ) : (
              <>
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
                <OrganizerGearLoadout
                  dimensions={dimensions}
                  visible={showGearLoadout}
                />
              </>
            )}

            {/* 4. Desk Lifestyle Props Sitting Flush ON TOP of the Solid White-Oak Desktop Surface */}
            {enableDrawer && (
              <DeskLifestyleProps
                position={[0, deskTopSurfaceY, deskCenterZ * 0.65]}
                organizerDimensions={dimensions}
                showLamp={true}
                showMug={true}
                showNotebook={true}
                showPen={true}
                showDeskMat={true}
                showEarbuds={true}
                lampIntensity={
                  lightingPreset === 'evening'
                    ? 6.0
                    : lightingPreset === 'warm'
                    ? 5.0
                    : lightingPreset === 'cyberpunk'
                    ? 2.8
                    : 4.5
                }
                lampLightColor={
                  lightingPreset === 'evening'
                    ? '#FFA858'
                    : lightingPreset === 'warm'
                    ? '#F59E0B'
                    : lightingPreset === 'cyberpunk'
                    ? '#FB923C'
                    : '#FFA84C'
                }
                visible={true}
              />
            )}

            {/* 5. Smooth Camera Controller */}
            <CameraController
              viewMode={viewMode}
              drawerOffsetZ={enableDrawer ? targetSlideZ : 0}
              dimensions={dimensions}
              controlsRef={controlsRef}
            />

            {/* 6. OrbitControls for 360-degree rotation (target managed by CameraController) */}
            <OrbitControls
              ref={controlsRef}
              enabled={!isTouchDevice || isTouchActive}
              enableDamping
              dampingFactor={0.07}
              minDistance={90}
              maxDistance={850}
              maxPolarAngle={Math.PI / 2.04}
              minPolarAngle={0.08}
              autoRotate={autoRotate}
              autoRotateSpeed={1.2}
              touches={{
                ONE: THREE.TOUCH.ROTATE,
                TWO: THREE.TOUCH.DOLLY_PAN,
              }}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Viewport Scale & Interaction Guidance (Bottom) */}
      <div className="absolute bottom-3 left-4 right-4 z-10 pointer-events-none flex items-center justify-between font-sans text-[11px] text-stone-500 dark:text-zinc-400">
        <span className="hidden sm:inline">
          Click drawer handle to slide • Click lamp to toggle glow • Drag to orbit 360°
        </span>
        <span className="ml-auto font-medium">1:1 Millimeter Scale • Guaranteed Fit</span>
      </div>
    </div>
  );
};
