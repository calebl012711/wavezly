/**
 * WAVEZLY 3D DESK SLIDING DRAWER UNIT & KINEMATICS ENGINE
 * Photorealistic Scandinavian / Japanese warm oak desk drawer with 60fps damped slide kinematics.
 * Supports:
 * - Dynamic drawer box sizing adapting to custom 3D parametric organizer trays.
 * - Smooth frame-rate independent spring kinematics via THREE.MathUtils.damp.
 * - Interactive click-to-slide & hover state highlighting on anodized metal lip handle.
 * - Precision-aligned interior cavity (top of drawer floor at Y=0) for nesting children.
 * - Realistic wood grain PBR finish, brushed metal glides, and optional desk housing carcass.
 */

import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export type DrawerFinish = 'oak' | 'walnut' | 'matte_black' | 'white_lacquer';
export type HandleStyle = 'anodized_lip' | 'minimal_notch' | 'brass_pull' | 'none';

export interface SlidingDrawerUnitProps {
  /** Whether the drawer is currently extended / pulled open */
  isOpen?: boolean;
  /** Explicit sliding progress [0.0 to 1.0], overrides isOpen if provided */
  openProgress?: number;
  /** Callback fired when user clicks the drawer front or handle to toggle */
  onToggle?: () => void;
  /** Callback notifying real-time slide offset (mm) and normalized progress (0-1) */
  onSlideChange?: (offsetZ: number, progress: number) => void;

  /** Internal cavity width along X axis in mm (default: 220) */
  drawerWidth?: number;
  /** Internal cavity depth along Z axis in mm (default: 180) */
  drawerDepth?: number;
  /** Internal cavity height along Y axis in mm (default: 45) */
  drawerHeight?: number;

  /** Drawer box side/front/back wall thickness in mm (default: 12) */
  wallThickness?: number;
  /** Drawer box bottom floor slab thickness in mm (default: 8) */
  bottomThickness?: number;
  /** Distance in mm to slide out forward along +Z (default: drawerDepth * 0.78) */
  slideDistance?: number;

  /** Wood or lacquer finish preset (default: 'oak') */
  finish?: DrawerFinish;
  /** Custom wood color override */
  customWoodColor?: string;

  /** Handle hardware style (default: 'anodized_lip') */
  handleStyle?: HandleStyle;
  /** Anodized metal handle hex color (default: dark bronze/brass '#2D2926') */
  handleColor?: string;

  /** Whether to render brushed steel runner glides on the sides (default: true) */
  showSideRails?: boolean;
  /** Whether to render desk carcass / tabletop housing around the drawer (default: false) */
  showDeskHousing?: boolean;
  /** Color of soft interior felt lining on cavity floor (null to disable, default: '#1F2328') */
  feltLiningColor?: string | null;

  /** Spring damping lambda coefficient for 60fps smooth glide (default: 8.5) */
  dampingSpeed?: number;

  /** World coordinate transform position [x, y, z] */
  position?: [number, number, number];
  /** World rotation Euler angles [x, y, z] */
  rotation?: [number, number, number];
  /** Scale factor or vector */
  scale?: number | [number, number, number];

  /** Child elements placed flush inside the drawer cavity (e.g. <ParametricMesh />) */
  children?: React.ReactNode;
}

/**
 * Creates high-fidelity procedural wood grain and bump textures using HTML5 Canvas.
 * Fallback gracefully if running in headless / SSR environments.
 */
function createProceduralWoodMaps(finish: DrawerFinish, customColor?: string) {
  if (typeof document === 'undefined') {
    return { diffuseMap: null, bumpMap: null };
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { diffuseMap: null, bumpMap: null };

  let baseHex = '#C89968';
  let grainHex = '#A77848';

  if (customColor) {
    baseHex = customColor;
    grainHex = '#553E2A';
  } else if (finish === 'walnut') {
    baseHex = '#5B4033';
    grainHex = '#3D2B22';
  } else if (finish === 'matte_black') {
    baseHex = '#1E1E1E';
    grainHex = '#141414';
  } else if (finish === 'white_lacquer') {
    baseHex = '#F5F5F7';
    grainHex = '#E5E5EA';
  }

  // 1. Base coat
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 512, 512);

  // 2. Natural organic grain wave contours
  const numRings = 16;
  for (let r = 0; r < numRings; r++) {
    const yCenter = -80 + r * 45;
    ctx.strokeStyle = grainHex;
    ctx.lineWidth = 1.2 + Math.random() * 2.2;
    ctx.globalAlpha = finish === 'matte_black' ? 0.03 : 0.12;
    ctx.beginPath();
    for (let x = 0; x <= 512; x += 16) {
      const wave = Math.sin(x * 0.015 + r * 0.7) * 14 + Math.sin(x * 0.06) * 4;
      const y = yCenter + Math.pow(x - 256, 2) * 0.0014 + wave;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // 3. Fine longitudinal micro-pores
  ctx.globalAlpha = finish === 'matte_black' ? 0.02 : 0.06;
  ctx.fillStyle = grainHex;
  for (let i = 0; i < 450; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const len = 20 + Math.random() * 60;
    ctx.fillRect(x, y, 1.2, len);
  }

  const diffuseMap = new THREE.CanvasTexture(canvas);
  diffuseMap.wrapS = THREE.RepeatWrapping;
  diffuseMap.wrapT = THREE.RepeatWrapping;
  diffuseMap.repeat.set(1.5, 1.5);

  // 4. Create matching micro-grain bump map
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 256;
  bumpCanvas.height = 256;
  const bCtx = bumpCanvas.getContext('2d');
  let bumpMap: THREE.CanvasTexture | null = null;

  if (bCtx) {
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, 256, 256);
    bCtx.fillStyle = '#404040';
    bCtx.globalAlpha = 0.15;
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      bCtx.fillRect(x, y, 1, 15 + Math.random() * 30);
    }
    bumpMap = new THREE.CanvasTexture(bumpCanvas);
    bumpMap.wrapS = THREE.RepeatWrapping;
    bumpMap.wrapT = THREE.RepeatWrapping;
    bumpMap.repeat.set(2, 2);
  }

  return { diffuseMap, bumpMap };
}

export const SlidingDrawerUnit: React.FC<SlidingDrawerUnitProps> = ({
  isOpen,
  openProgress,
  onToggle,
  onSlideChange,
  drawerWidth = 220,
  drawerDepth = 180,
  drawerHeight = 45,
  wallThickness = 12,
  bottomThickness = 8,
  slideDistance,
  finish = 'oak',
  customWoodColor,
  handleStyle = 'anodized_lip',
  handleColor = '#2D2926',
  showSideRails = true,
  showDeskHousing = false,
  feltLiningColor = '#1F2328',
  dampingSpeed = 8.5,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  children,
}) => {
  // Kinematic animation refs
  const movingAssemblyRef = useRef<THREE.Group>(null);
  const currentSlideZ = useRef<number>(0);

  // Fallback internal open state if isOpen is uncontrolled
  const [internalOpen, setInternalOpen] = useState(false);
  const [isHandleHovered, setIsHandleHovered] = useState(false);

  const effectiveIsOpen = isOpen !== undefined ? isOpen : internalOpen;
  const maxSlideZ = slideDistance ?? drawerDepth * 0.78;

  // Generate procedural PBR wood textures
  const { diffuseMap, bumpMap } = useMemo(
    () => createProceduralWoodMaps(finish, customWoodColor),
    [finish, customWoodColor]
  );

  // Exterior & Interior PBR Materials
  const materials = useMemo(() => {
    let baseColor = '#C89968';
    let roughness = 0.62;
    let metalness = 0.02;

    if (customWoodColor) {
      baseColor = customWoodColor;
    } else if (finish === 'walnut') {
      baseColor = '#5B4033';
      roughness = 0.58;
    } else if (finish === 'matte_black') {
      baseColor = '#1E1E1E';
      roughness = 0.85;
      metalness = 0.05;
    } else if (finish === 'white_lacquer') {
      baseColor = '#F7F7F8';
      roughness = 0.35;
      metalness = 0.01;
    }

    const woodMaterial = new THREE.MeshStandardMaterial({
      color: diffuseMap ? '#FFFFFF' : baseColor,
      map: diffuseMap,
      bumpMap: bumpMap,
      bumpScale: 0.25,
      roughness,
      metalness,
    });

    // Dark interior cavity wood (subtle contact shadow depth)
    const interiorWoodMaterial = new THREE.MeshStandardMaterial({
      color: diffuseMap ? '#EAEAEA' : baseColor,
      map: diffuseMap,
      bumpMap: bumpMap,
      bumpScale: 0.15,
      roughness: roughness * 1.05,
      metalness,
    });

    // Anodized Aluminum / Brass Hardware Material
    const hardwareMaterial = new THREE.MeshStandardMaterial({
      color: isHandleHovered ? '#FF6B00' : handleColor,
      roughness: 0.28,
      metalness: 0.92,
      envMapIntensity: 1.4,
    });

    // Steel Slide Runners
    const railSteelMaterial = new THREE.MeshStandardMaterial({
      color: '#656A70',
      roughness: 0.22,
      metalness: 0.88,
    });

    // Felt Lining Base Mat
    const feltMaterial = feltLiningColor
      ? new THREE.MeshStandardMaterial({
          color: feltLiningColor,
          roughness: 0.98,
          metalness: 0.0,
        })
      : null;

    // Outer Desk Carcass Oak
    const deskCarcassMaterial = new THREE.MeshStandardMaterial({
      color: diffuseMap ? '#FFFFFF' : baseColor,
      map: diffuseMap,
      bumpMap: bumpMap,
      bumpScale: 0.2,
      roughness: 0.55,
      metalness: 0.02,
    });

    return {
      woodMaterial,
      interiorWoodMaterial,
      hardwareMaterial,
      railSteelMaterial,
      feltMaterial,
      deskCarcassMaterial,
    };
  }, [finish, customWoodColor, diffuseMap, bumpMap, handleColor, feltLiningColor, isHandleHovered]);

  // Derived Geometry Dimensions
  const totalBoxWidth = drawerWidth + 2 * wallThickness;
  const frontFaceWidth = totalBoxWidth + 14; // Modern clean overlay edge
  const frontFaceHeight = drawerHeight + 16;
  const frontFaceThickness = 18;

  // Smooth 60fps Kinematics via frame-rate independent spring damping
  useFrame((_, delta) => {
    if (!movingAssemblyRef.current) return;

    const targetZ =
      openProgress !== undefined ? openProgress * maxSlideZ : effectiveIsOpen ? maxSlideZ : 0;

    const clampedDelta = Math.min(delta, 0.1);
    currentSlideZ.current = THREE.MathUtils.damp(
      currentSlideZ.current,
      targetZ,
      dampingSpeed,
      clampedDelta
    );

    movingAssemblyRef.current.position.z = currentSlideZ.current;

    if (onSlideChange && Math.abs(currentSlideZ.current - targetZ) > 0.01) {
      onSlideChange(currentSlideZ.current, currentSlideZ.current / (maxSlideZ || 1));
    }
  });

  const handlePointerToggle = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen((prev) => !prev);
    }
  };

  return (
    <group position={position} rotation={rotation} scale={scale} name="SlidingDrawerRoot">
      {/* 1. Optional Outer Desk Housing / Carcass Surround */}
      {showDeskHousing && (
        <group name="DeskHousingCarcass" position={[0, 0, 0]}>
          {/* Desktop Top Surface */}
          <mesh
            position={[0, drawerHeight + 16 + 12, 0]}
            material={materials.deskCarcassMaterial}
            receiveShadow
            castShadow
          >
            <boxGeometry args={[totalBoxWidth + 60, 24, drawerDepth + 60]} />
          </mesh>

          {/* Left Carcass Panel */}
          <mesh
            position={[-totalBoxWidth / 2 - 12, drawerHeight / 2, 0]}
            material={materials.deskCarcassMaterial}
            receiveShadow
          >
            <boxGeometry args={[18, frontFaceHeight + 24, drawerDepth + 30]} />
          </mesh>

          {/* Right Carcass Panel */}
          <mesh
            position={[totalBoxWidth / 2 + 12, drawerHeight / 2, 0]}
            material={materials.deskCarcassMaterial}
            receiveShadow
          >
            <boxGeometry args={[18, frontFaceHeight + 24, drawerDepth + 30]} />
          </mesh>

          {/* Back Stop Panel */}
          <mesh
            position={[0, drawerHeight / 2, -drawerDepth / 2 - wallThickness - 10]}
            material={materials.deskCarcassMaterial}
            receiveShadow
          >
            <boxGeometry args={[totalBoxWidth + 42, frontFaceHeight + 24, 18]} />
          </mesh>

          {/* Static Carcass Slide Rails (Left & Right) */}
          {showSideRails && (
            <>
              <mesh position={[-totalBoxWidth / 2 - 2, drawerHeight * 0.45, 0]} material={materials.railSteelMaterial}>
                <boxGeometry args={[3, 12, drawerDepth * 0.9]} />
              </mesh>
              <mesh position={[totalBoxWidth / 2 + 2, drawerHeight * 0.45, 0]} material={materials.railSteelMaterial}>
                <boxGeometry args={[3, 12, drawerDepth * 0.9]} />
              </mesh>
            </>
          )}
        </group>
      )}

      {/* 2. Moving Drawer Assembly (Sliding forward along +Z) */}
      <group ref={movingAssemblyRef} name="MovingDrawerAssembly" position={[0, 0, 0]}>
        {/* A. Bottom Floor Base Slab (Top surface rests exactly at Y = 0) */}
        <mesh
          position={[0, -bottomThickness / 2, 0]}
          material={materials.woodMaterial}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[drawerWidth + 2 * wallThickness, bottomThickness, drawerDepth]} />
        </mesh>

        {/* Optional Felt / Cork Cushion Liner on Drawer Floor */}
        {materials.feltMaterial && (
          <mesh position={[0, 0.4, 0]} material={materials.feltMaterial} receiveShadow>
            <boxGeometry args={[drawerWidth - 1, 0.8, drawerDepth - 1]} />
          </mesh>
        )}

        {/* B. Left Wall */}
        <mesh
          position={[-drawerWidth / 2 - wallThickness / 2, drawerHeight / 2, 0]}
          material={materials.interiorWoodMaterial}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[wallThickness, drawerHeight, drawerDepth]} />
        </mesh>

        {/* C. Right Wall */}
        <mesh
          position={[drawerWidth / 2 + wallThickness / 2, drawerHeight / 2, 0]}
          material={materials.interiorWoodMaterial}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[wallThickness, drawerHeight, drawerDepth]} />
        </mesh>

        {/* D. Back Wall */}
        <mesh
          position={[0, drawerHeight / 2, -drawerDepth / 2 - wallThickness / 2]}
          material={materials.interiorWoodMaterial}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[drawerWidth + 2 * wallThickness, drawerHeight, wallThickness]} />
        </mesh>

        {/* E. Sub-Front Inner Wall */}
        <mesh
          position={[0, drawerHeight / 2, drawerDepth / 2 + wallThickness / 2]}
          material={materials.interiorWoodMaterial}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[drawerWidth + 2 * wallThickness, drawerHeight, wallThickness]} />
        </mesh>

        {/* F. Exterior Front Façade (Solid Oak Face Panel with Bevel & Edge Reveal) */}
        <mesh
          name="DrawerFrontFace"
          position={[
            0,
            drawerHeight / 2 - 2,
            drawerDepth / 2 + wallThickness + frontFaceThickness / 2 + 0.5,
          ]}
          material={materials.woodMaterial}
          castShadow
          receiveShadow
          onClick={handlePointerToggle}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer';
            setIsHandleHovered(true);
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
            setIsHandleHovered(false);
          }}
        >
          <boxGeometry args={[frontFaceWidth, frontFaceHeight, frontFaceThickness]} />
        </mesh>

        {/* G. Hardware Handle (Anodized Aluminum / Brass Lip Pull) */}
        {handleStyle === 'anodized_lip' && (
          <group
            name="AnodizedLipHandle"
            position={[
              0,
              drawerHeight / 2 - 2 + frontFaceHeight / 2 - 1,
              drawerDepth / 2 + wallThickness + frontFaceThickness / 2 + 1,
            ]}
            onClick={handlePointerToggle}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer';
              setIsHandleHovered(true);
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto';
              setIsHandleHovered(false);
            }}
          >
            {/* Top mounting plate sitting flush on top edge */}
            <mesh position={[0, 1.2, 0]} material={materials.hardwareMaterial} castShadow>
              <boxGeometry args={[65, 2.4, frontFaceThickness + 6]} />
            </mesh>
            {/* Angled ergonomic finger grip lip */}
            <mesh
              position={[0, -3.5, frontFaceThickness / 2 + 4.5]}
              rotation={[0.2, 0, 0]}
              material={materials.hardwareMaterial}
              castShadow
            >
              <boxGeometry args={[65, 8, 2.5]} />
            </mesh>
          </group>
        )}

        {handleStyle === 'brass_pull' && (
          <mesh
            name="BrassBarPull"
            position={[
              0,
              drawerHeight / 2 - 2,
              drawerDepth / 2 + wallThickness + frontFaceThickness + 10,
            ]}
            rotation={[0, 0, Math.PI / 2]}
            material={materials.hardwareMaterial}
            castShadow
            onClick={handlePointerToggle}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer';
              setIsHandleHovered(true);
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto';
              setIsHandleHovered(false);
            }}
          >
            <cylinderGeometry args={[4, 4, 90, 24]} />
          </mesh>
        )}

        {handleStyle === 'minimal_notch' && (
          /* Sleek finger cutout notch along top edge */
          <mesh
            position={[0, drawerHeight / 2 - 2 + frontFaceHeight / 2 - 4, drawerDepth / 2 + wallThickness + frontFaceThickness / 2]}
            material={materials.interiorWoodMaterial}
          >
            <boxGeometry args={[70, 8, frontFaceThickness + 1]} />
          </mesh>
        )}

        {/* H. Moving Side Runner Glides (Attached to outside of left & right walls) */}
        {showSideRails && (
          <>
            {/* Left Moving Runner */}
            <mesh
              position={[-drawerWidth / 2 - wallThickness - 1.5, drawerHeight * 0.45, 0]}
              material={materials.railSteelMaterial}
            >
              <boxGeometry args={[2.5, 9, drawerDepth * 0.95]} />
            </mesh>
            {/* Right Moving Runner */}
            <mesh
              position={[drawerWidth / 2 + wallThickness + 1.5, drawerHeight * 0.45, 0]}
              material={materials.railSteelMaterial}
            >
              <boxGeometry args={[2.5, 9, drawerDepth * 0.95]} />
            </mesh>
          </>
        )}

        {/* I. Internal Drawer Cavity Container
               Floor top surface is at Y = 0.
               Centered at X = 0, Z = 0.
               Children such as <ParametricMesh /> placed here sit flush and move naturally! */}
        <group name="DrawerCavitySlot" position={[0, 0, 0]}>
          {children}
        </group>
      </group>
    </group>
  );
};
