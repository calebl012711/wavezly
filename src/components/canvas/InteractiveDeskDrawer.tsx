/**
 * WAVEZLY INTERACTIVE 3D DESK & DRAWER ENCLOSURE
 * Precision architectural desk drawer casing and sliding drawer box for custom organizers.
 * Features:
 * - Direct click on drawer handle or front face to trigger smooth sliding open/close
 * - Subtle cursor pointer and glow on hover over drawer handle & front face
 * - Realistic damped sliding physics with steel slide runners
 * - Dynamically adapts to customizer organizer dimensions
 */

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ParametricOrganizerDimensions } from '../../types';

export interface InteractiveDeskDrawerProps {
  dimensions: ParametricOrganizerDimensions;
  isOpen: boolean;
  onToggle: () => void;
  onSlideChange?: (currentZ: number) => void;
  children: React.ReactNode;
}

export const InteractiveDeskDrawer: React.FC<InteractiveDeskDrawerProps> = ({
  dimensions,
  isOpen,
  onToggle,
  onSlideChange,
  children,
}) => {
  const drawerSlideGroupRef = useRef<THREE.Group>(null);
  const currentSlideZ = useRef(isOpen ? dimensions.width * 0.85 + 40 : 0);
  const [handleHovered, setHandleHovered] = useState(false);
  const [frontFaceHovered, setFrontFaceHovered] = useState(false);

  const { length, width, height } = dimensions;

  // Calculate proportional drawer and casing dimensions
  // The drawer inner cavity fits the organizer with a snug 4mm tolerance
  const cavityWidth = length + 8;
  const cavityDepth = width + 8;
  const wallThickness = 5;
  const floorThickness = 4;
  const frontFaceHeight = height + 16;
  const frontFaceWidth = length + 24;
  const frontFaceThickness = 8;
  
  // Drawer pull slide distance (slides out along +Z)
  const slideDistance = width * 0.85 + 45;

  // Handle cursor change on hover
  useEffect(() => {
    if (handleHovered || frontFaceHovered) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'auto';
    }
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [handleHovered, frontFaceHovered]);

  // Smooth lerp for drawer sliding animation
  useFrame((_, delta) => {
    const targetZ = isOpen ? slideDistance : 0;
    // Damped spring-like lerp
    const lerpSpeed = Math.min(1, delta * 7.5);
    currentSlideZ.current = THREE.MathUtils.lerp(currentSlideZ.current, targetZ, lerpSpeed);

    if (drawerSlideGroupRef.current) {
      drawerSlideGroupRef.current.position.z = currentSlideZ.current;
    }

    if (onSlideChange) {
      onSlideChange(currentSlideZ.current);
    }
  });

  // Materials
  const materials = useMemo(() => {
    return {
      // Warm Scandinavian light oak for drawer box
      drawerWood: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#E6D3BF'),
        roughness: 0.65,
        metalness: 0.05,
      }),
      // Sleek matte architectural slate for drawer front face
      frontFace: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#22262E'),
        roughness: 0.7,
        metalness: 0.15,
      }),
      frontFaceHover: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2C313C'),
        roughness: 0.6,
        metalness: 0.2,
      }),
      // Brushed champagne brass handle
      handle: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D8B06B'),
        roughness: 0.25,
        metalness: 0.85,
        emissive: new THREE.Color('#FF8C00'),
        emissiveIntensity: 0.0,
      }),
      handleHover: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#F0C87E'),
        roughness: 0.18,
        metalness: 0.9,
        emissive: new THREE.Color('#FF8C00'),
        emissiveIntensity: 0.35,
      }),
      // Stainless steel sliding tracks
      steelRunner: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#B4B9C2'),
        roughness: 0.25,
        metalness: 0.9,
      }),
      // Outer desk casing (warm architectural off-white / light birch)
      deskCasing: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#F2EFE9'),
        roughness: 0.8,
        metalness: 0.05,
      }),
      deskSurface: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#EBE7E0'),
        roughness: 0.75,
        metalness: 0.05,
      }),
    };
  }, []);

  // Handle bar dimensions
  const handleBarLength = Math.max(48, Math.min(100, length * 0.45));
  const handleStandoffX = handleBarLength * 0.36;

  return (
    <group name="InteractiveDeskEnvironment" position={[0, 0, 0]}>
      {/* 1. STATIONARY DESK CASING / HOUSING (Anchored at Z = 0) */}
      <group name="DeskCasingGroup">
        {/* Left Carcass Cheek */}
        <mesh
          position={[-(cavityWidth / 2 + wallThickness + 8), (height + 24) / 2 - 4, -10]}
          material={materials.deskCasing}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[16, height + 28, cavityDepth + 26]} />
        </mesh>

        {/* Right Carcass Cheek */}
        <mesh
          position={[cavityWidth / 2 + wallThickness + 8, (height + 24) / 2 - 4, -10]}
          material={materials.deskCasing}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[16, height + 28, cavityDepth + 26]} />
        </mesh>

        {/* Back Stop Plate */}
        <mesh
          position={[0, (height + 24) / 2 - 4, -(cavityDepth / 2 + wallThickness + 18)]}
          material={materials.deskCasing}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[cavityWidth + 36, height + 28, 12]} />
        </mesh>

        {/* Bottom Base Carcass Board */}
        <mesh
          position={[0, -10, -10]}
          material={materials.deskCasing}
          receiveShadow
        >
          <boxGeometry args={[cavityWidth + 36, 12, cavityDepth + 26]} />
        </mesh>

        {/* Desk Top Surface (Framing the niche, cut back to leave drawer open to view) */}
        <mesh
          position={[0, height + 16, -(cavityDepth * 0.25 + 16)]}
          material={materials.deskSurface}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[cavityWidth + 48, 14, cavityDepth * 0.65]} />
        </mesh>

        {/* Left Stationary Outer Slide Track */}
        <mesh
          position={[-(cavityWidth / 2 + wallThickness + 0.8), 2, -10]}
          material={materials.steelRunner}
        >
          <boxGeometry args={[1.5, 4, cavityDepth + 10]} />
        </mesh>

        {/* Right Stationary Outer Slide Track */}
        <mesh
          position={[cavityWidth / 2 + wallThickness + 0.8, 2, -10]}
          material={materials.steelRunner}
        >
          <boxGeometry args={[1.5, 4, cavityDepth + 10]} />
        </mesh>
      </group>

      {/* 2. DYNAMIC SLIDING DRAWER BOX (Travels along Z) */}
      <group ref={drawerSlideGroupRef} name="SlidingDrawerBox">
        {/* Drawer Floor Board (Organizer rests on top at Y = 0) */}
        <mesh
          position={[0, -floorThickness / 2, 0]}
          material={materials.drawerWood}
          receiveShadow
        >
          <boxGeometry args={[cavityWidth, floorThickness, cavityDepth]} />
        </mesh>

        {/* Left Side Wall */}
        <mesh
          position={[-(cavityWidth / 2 - wallThickness / 2), height / 2, 0]}
          material={materials.drawerWood}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[wallThickness, height + 4, cavityDepth]} />
        </mesh>

        {/* Right Side Wall */}
        <mesh
          position={[cavityWidth / 2 - wallThickness / 2, height / 2, 0]}
          material={materials.drawerWood}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[wallThickness, height + 4, cavityDepth]} />
        </mesh>

        {/* Back Wall */}
        <mesh
          position={[0, height / 2, -(cavityDepth / 2 - wallThickness / 2)]}
          material={materials.drawerWood}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[cavityWidth, height + 4, wallThickness]} />
        </mesh>

        {/* Left Inner Slide Runner */}
        <mesh
          position={[-(cavityWidth / 2 + 1), 2, 0]}
          material={materials.steelRunner}
        >
          <boxGeometry args={[1.5, 3.5, cavityDepth * 0.9]} />
        </mesh>

        {/* Right Inner Slide Runner */}
        <mesh
          position={[cavityWidth / 2 + 1, 2, 0]}
          material={materials.steelRunner}
        >
          <boxGeometry args={[1.5, 3.5, cavityDepth * 0.9]} />
        </mesh>

        {/* 3. DRAWER FRONT FACE (Clickable Interactive Target) */}
        <mesh
          name="DrawerFrontFace"
          position={[0, (frontFaceHeight - floorThickness) / 2, cavityDepth / 2 + frontFaceThickness / 2]}
          material={frontFaceHovered ? materials.frontFaceHover : materials.frontFace}
          castShadow
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setFrontFaceHovered(true);
          }}
          onPointerOut={() => {
            setFrontFaceHovered(false);
          }}
        >
          <boxGeometry args={[frontFaceWidth, frontFaceHeight, frontFaceThickness]} />
        </mesh>

        {/* 4. TACTILE DRAWER PULL HANDLE (Primary Click & Hover Target) */}
        <group
          name="DrawerPullHandle"
          position={[
            0,
            (frontFaceHeight - floorThickness) / 2,
            cavityDepth / 2 + frontFaceThickness + 3,
          ]}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHandleHovered(true);
          }}
          onPointerOut={() => {
            setHandleHovered(false);
          }}
        >
          {/* Left Standoff Mount */}
          <mesh
            position={[-handleStandoffX, 0, 4]}
            rotation={[Math.PI / 2, 0, 0]}
            material={handleHovered ? materials.handleHover : materials.handle}
            castShadow
          >
            <cylinderGeometry args={[2.8, 2.8, 8, 16]} />
          </mesh>

          {/* Right Standoff Mount */}
          <mesh
            position={[handleStandoffX, 0, 4]}
            rotation={[Math.PI / 2, 0, 0]}
            material={handleHovered ? materials.handleHover : materials.handle}
            castShadow
          >
            <cylinderGeometry args={[2.8, 2.8, 8, 16]} />
          </mesh>

          {/* Main Horizontal Pull Bar */}
          <mesh
            position={[0, 0, 8]}
            rotation={[0, 0, Math.PI / 2]}
            material={handleHovered ? materials.handleHover : materials.handle}
            scale={handleHovered ? [1.06, 1.06, 1.06] : [1, 1, 1]}
            castShadow
          >
            <cylinderGeometry args={[3.2, 3.2, handleBarLength, 20]} />
          </mesh>

          {/* Expanded Invisible Click Hitbox for effortless mobile / desktop clicks */}
          <mesh position={[0, 0, 8]} visible={false}>
            <boxGeometry args={[handleBarLength + 20, 26, 20]} />
          </mesh>

          {/* In-Canvas Hover Tooltip Pill */}
          {handleHovered && (
            <Html
              position={[0, 22, 10]}
              center
              distanceFactor={320}
              className="pointer-events-none select-none"
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950/90 text-white text-[11px] font-semibold tracking-tight shadow-lg border border-white/20 whitespace-nowrap backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
                <span>Click to {isOpen ? 'Close' : 'Open'} Drawer</span>
              </div>
            </Html>
          )}
        </group>

        {/* 5. ORGANIZER COMPONENT (Rests inside drawer floor at Y = 0) */}
        <group name="OrganizerInDrawer" position={[0, 0, 0]}>
          {children}
        </group>
      </group>
    </group>
  );
};
