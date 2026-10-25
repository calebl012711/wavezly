/**
 * WAVEZLY 3D CAMERA CONTROLLER
 * Smooth camera viewpoint transition using Three.js lerp & OrbitControls.
 * Seamlessly transitions between:
 * - "Desk View": wide angle displaying full desk casing, drawer extension, and proportions
 * - "Close-up View": macro perspective focused directly on organizer compartments & inlay details
 */

import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { ParametricOrganizerDimensions } from '../../types';

export type CameraViewMode = 'desk' | 'closeup';

export interface CameraControllerProps {
  viewMode: CameraViewMode;
  drawerOffsetZ: number;
  dimensions: ParametricOrganizerDimensions;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  viewMode,
  drawerOffsetZ,
  dimensions,
  controlsRef,
}) => {
  const { camera } = useThree();
  const isTransitioning = useRef(true);
  const prevViewMode = useRef<CameraViewMode>(viewMode);
  const prevOffsetZ = useRef<number>(drawerOffsetZ);

  // Trigger smooth transition on mount and whenever viewMode or drawer open state changes
  useEffect(() => {
    if (
      prevViewMode.current !== viewMode ||
      Math.abs(prevOffsetZ.current - drawerOffsetZ) > 5
    ) {
      isTransitioning.current = true;
      prevViewMode.current = viewMode;
      prevOffsetZ.current = drawerOffsetZ;
    }
  }, [viewMode, drawerOffsetZ]);

  // Release control if user manually starts dragging OrbitControls
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleUserStart = () => {
      isTransitioning.current = false;
    };

    controls.addEventListener('start', handleUserStart);
    return () => {
      controls.removeEventListener('start', handleUserStart);
    };
  }, [controlsRef]);

  // Calculate target vectors based on mode and current organizer dimensions
  const getTargets = () => {
    const maxDim = Math.max(dimensions.length, dimensions.width);

    if (viewMode === 'closeup') {
      const closeDist = Math.max(155, maxDim * 0.92);
      return {
        camPos: new THREE.Vector3(
          -closeDist * 0.22,
          closeDist * 0.85,
          closeDist * 0.78 + drawerOffsetZ
        ),
        lookAt: new THREE.Vector3(
          0,
          dimensions.height * 0.45,
          drawerOffsetZ
        ),
      };
    }

    // 'desk' view: Editorial 3/4 front-left perspective matching desk_3d_customizer_concept.jpg
    // Shows open oak drawer + custom two-tone organizer in foreground, Voronoi lamp & stoneware mug on right desktop
    const deskDist = Math.max(365, maxDim * 1.68);
    return {
      camPos: new THREE.Vector3(
        -deskDist * 0.52,
        deskDist * 0.72,
        deskDist * 0.94 + drawerOffsetZ * 0.82
      ),
      lookAt: new THREE.Vector3(
        48,
        dimensions.height * 0.98,
        drawerOffsetZ * 0.35
      ),
    };
  };

  useFrame((_, delta) => {
    if (!isTransitioning.current) return;

    const { camPos, lookAt } = getTargets();
    const lerpFactor = Math.min(1, delta * 4.8);

    camera.position.lerp(camPos, lerpFactor);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(lookAt, lerpFactor);
      controlsRef.current.update();
    }

    // Check completion threshold
    const camDist = camera.position.distanceTo(camPos);
    const targetDist = controlsRef.current
      ? controlsRef.current.target.distanceTo(lookAt)
      : 0;

    if (camDist < 0.8 && targetDist < 0.8) {
      camera.position.copy(camPos);
      if (controlsRef.current) {
        controlsRef.current.target.copy(lookAt);
        controlsRef.current.update();
      }
      isTransitioning.current = false;
    }
  });

  return null;
};
