/**
 * FORMGRID INTERACTIVE WEBGL THREE.JS CANVAS
 * OrbitControls, dampened physics, bounded camera angles, and high-DPR rendering
 */

import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { ParametricMesh } from './ParametricMesh';
import { StudioEnvironment } from './StudioEnvironment';
import { ParametricOrganizerDimensions, MaterialOption } from '../../types';
import { LightingPreset } from '../../store/useCustomizerStore';

interface OrganizerCanvasProps {
  dimensions: ParametricOrganizerDimensions;
  material: MaterialOption;
  resinInlay: MaterialOption | null;
  onMeshReady?: (meshGroup: THREE.Group) => void;
  autoRotate?: boolean;
  wireframe?: boolean;
  engravedText?: string;
  sliceHeight?: number;
  explodedOffset?: number;
  lightingPreset?: LightingPreset;
}

export const OrganizerCanvas: React.FC<OrganizerCanvasProps> = ({
  dimensions,
  material,
  resinInlay,
  onMeshReady,
  autoRotate = false,
  wireframe = false,
  engravedText,
  sliceHeight,
  explodedOffset,
  lightingPreset,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Dynamic shadow scale based on longest dimension
  const maxDim = Math.max(dimensions.length, dimensions.width);
  const shadowScale = Math.max(300, maxDim * 2.2);

  return (
    <div className="relative w-full h-full min-h-[420px] bg-gradient-to-b from-[#fbfbfd] to-[#f0f0f4] dark:bg-[#0c0c0e] rounded-xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800">
      {/* Precision Grid Coordinates Overlay (Clean Consumer Style) */}
      <div className="absolute top-3 left-4 z-10 pointer-events-none flex items-center space-x-2 font-sans text-xs text-zinc-500 dark:text-zinc-400">
        <span className="w-2 h-2 rounded-full bg-signal-orange animate-pulse" />
        <span className="font-medium">3D Studio Viewport</span>
      </div>

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
          position: [0, 160, 240],
          fov: 42,
          near: 1,
          far: 2000,
        }}
      >
        <Suspense fallback={null}>
          <StudioEnvironment shadowScale={shadowScale} preset={lightingPreset} />
          
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

          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.06}
            minDistance={80}
            maxDistance={500}
            // Lock polar angle above ground level so user cannot look from underneath
            maxPolarAngle={Math.PI / 2.05}
            minPolarAngle={0.05}
            autoRotate={autoRotate}
            autoRotateSpeed={1.2}
            target={[0, dimensions.height / 2, 0]}
          />
        </Suspense>
      </Canvas>

      {/* Viewport Scale Indicator */}
      <div className="absolute bottom-3 right-4 z-10 pointer-events-none font-sans text-xs text-zinc-400 dark:text-zinc-500">
        1:1 Millimeter Scale • Guaranteed Fit
      </div>
    </div>
  );
};
