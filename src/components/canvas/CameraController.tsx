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
  const isTransitioning = useRef(false);
  const prevViewMode = useRef<CameraViewMode>(viewMode);

  // Trigger smooth transition whenever viewMode changes
  useEffect(() => {
    if (prevViewMode.current !== viewMode) {
      isTransitioning.current = true;
      prevViewMode.current = viewMode;
    }
  }, [viewMode]);

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
      const closeDist = Math.max(130, maxDim * 0.95);
      return {
        camPos: new THREE.Vector3(
          0,
          closeDist * 0.72,
          closeDist * 0.95 + drawerOffsetZ
        ),
        lookAt: new THREE.Vector3(
          0,
          dimensions.height * 0.65,
          drawerOffsetZ
        ),
      };
    }

    // 'desk' view: 45-degree perspective showing warm desk, glowing lamp, mug, and open drawer
    const deskDist = Math.max(300, maxDim * 2.1);
    return {
      camPos: new THREE.Vector3(
        deskDist * 0.72,
        deskDist * 0.78,
        deskDist * 0.92 + drawerOffsetZ * 0.4
      ),
      lookAt: new THREE.Vector3(
        -15,
        dimensions.height * 0.4,
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
