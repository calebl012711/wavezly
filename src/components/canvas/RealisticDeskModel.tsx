/**
 * WAVEZLY REALISTIC SCANDINAVIAN DESK & DRAWER 3D MODEL
 * Built for React Three Fiber / Three.js
 * 
 * Features:
 * - Solid White-Oak Desktop surface with organic PBR wood grain texture and chamfered bevels
 * - Under-desk dual-bay drawer cabinet apron housing
 * - Left pull-out drawer with brushed bronze lip handle and acoustic charcoal felt liner
 * - Slot for custom 3D printed organizer trays (accepts React children inside drawer cavity)
 * - Scandinavian tapered legs (Solid Oak or Matte Black Powder-Coated Steel)
 * - Realistic contact shadowing and optional desk staging accessories (Desk Mat, Mug, Laptop, Lamp)
 * - Dual positioning modes: full desk on floor (y=0) OR auto-centered on open drawer interior [0, 0, 0]
 */

import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ContactShadows } from '@react-three/drei';

export type WoodFinish = 'whiteOak' | 'naturalOak' | 'walnut' | 'blackAsh';
export type LegStyle = 'wood' | 'blackSteel';

export interface RealisticDeskModelProps {
  /** Total desk width in mm along X axis. Default: 820mm */
  deskWidth?: number;
  /** Total desk depth in mm along Z axis. Default: 560mm */
  deskDepth?: number;
  /** Total desk height in mm from floor to top surface. Default: 740mm */
  deskHeight?: number;
  /** Desktop solid wood slab thickness in mm. Default: 25mm */
  topThickness?: number;
  /** Height of under-desk drawer housing apron in mm. Default: 96mm */
  drawerHousingHeight?: number;
  /** Left drawer pull-out ratio from 0.0 (closed) to 1.0 (fully open). Default: 0.68 */
  drawerOpenRatio?: number;
  /** Right drawer pull-out ratio. Default: 0.0 (closed) */
  rightDrawerOpenRatio?: number;
  /** Wood material finish preset. Default: 'whiteOak' */
  woodFinish?: WoodFinish;
  /** Desk leg architecture. Default: 'wood' */
  legStyle?: LegStyle;
  /** Show realistic concept staging accessories (desk mat, mug, laptop, lamp). Default: true */
  showAccessories?: boolean;
  /** Show floor contact shadows. Default: true */
  showShadows?: boolean;
  /** 
   * When true, shifts desk coordinates so the left drawer interior center is at [0, 0, 0].
   * Ideal for embedding inside existing 3D customizer viewports! Default: false
   */
  centerOnDrawer?: boolean;
  /** When true, omits internal left drawer so an external SlidingDrawerUnit can be placed */
  hideLeftDrawer?: boolean;
  /** Custom 3D meshes (e.g. Wavezly Parametric Organizer) mounted inside the left pull-out drawer */
  children?: React.ReactNode;
}

/** Interior dimensions of the pull-out drawer cavity for organizing trays */
export const DRAWER_INTERIOR_BOUNDS = {
  width: 310, // mm
  depth: 375, // mm
  height: 65, // mm
  floorThickness: 8, // mm
} as const;

/**
 * Procedural Oak Wood PBR Texture Generator
 * Generates natural wood growth rings, longitudinal medullary fibers, specular medullary ray ribbons,
 * open vessel pores, and warm ambient occlusion crevices.
 */
function generateOakWoodTextures(finish: WoodFinish = 'whiteOak'): {
  diffuseMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  aoMap: THREE.CanvasTexture;
} | null {
  if (typeof document === 'undefined') return null;

  const width = 512;
  const height = 512;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  let baseHex: string;
  let ring1Hex: string;
  let ring2Hex: string;

  switch (finish) {
    case 'walnut':
      baseHex = '#5a4331';
      ring1Hex = '#483526';
      ring2Hex = '#3b2a1d';
      break;
    case 'blackAsh':
      baseHex = '#2c2b2a';
      ring1Hex = '#222120';
      ring2Hex = '#181716';
      break;
    case 'naturalOak':
      baseHex = '#d4b790';
      ring1Hex = '#c4a377';
      ring2Hex = '#b39063';
      break;
    case 'whiteOak':
    default:
      // Scandinavian Solid White Oak (#D8C3A5 / #CDB38B)
      baseHex = '#d8c3a5';
      ring1Hex = '#cdb38b';
      ring2Hex = '#be9f77';
      break;
  }

  const parseHex = (hex: string) => {
    const num = parseInt(hex.replace('#', ''), 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  };

  const [br, bg, bb] = parseHex(baseHex);
  const [r1r, r1g, r1b] = parseHex(ring1Hex);
  const [r2r, r2g, r2b] = parseHex(ring2Hex);

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  // 1. Generate multi-octave wood rings, longitudinal fibers, and medullary rays
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Primary ring wave modulated by organic distortion
      const ringWave = Math.sin(
        y * 0.045 + Math.sin(x * 0.018) * 3.2 + Math.sin(y * 0.14 + x * 0.01) * 1.4
      );
      const ringFactor = (ringWave + 1) * 0.5;

      // Fine longitudinal fibers
      const fineFiber = (Math.sin(x * 0.85 + Math.sin(y * 0.06) * 6) * 0.5 + 0.5) * 0.18;
      const combined = Math.min(1, Math.max(0, ringFactor * 0.75 + fineFiber));

      // Medullary rays (transverse ribbon flecks unique to quartersawn oak)
      const medullaryWave = Math.sin(x * 0.08 + Math.sin(y * 0.12) * 2.2);
      const isMedullary = Math.abs(medullaryWave) < 0.08 && Math.sin(y * 0.45) > 0.3;

      let r = br * (1 - combined) + (combined > 0.5 ? r2r : r1r) * combined;
      let g = bg * (1 - combined) + (combined > 0.5 ? r2g : r1g) * combined;
      let b = bb * (1 - combined) + (combined > 0.5 ? r2b : r1b) * combined;

      // Medullary flecks have a subtle silvery/creamy luster
      if (isMedullary) {
        r = Math.min(255, r * 1.06 + 8);
        g = Math.min(255, g * 1.06 + 8);
        b = Math.min(255, b * 1.05 + 6);
      }

      // Medullary vessel pore flecks
      const isPore = ((x * 19 + y * 37) % 103 < 3) && Math.sin(x * 0.35) > 0.35;
      const poreMultiplier = isPore ? 0.85 : 1.0;

      data[idx] = Math.round(r * poreMultiplier);
      data[idx + 1] = Math.round(g * poreMultiplier);
      data[idx + 2] = Math.round(b * poreMultiplier);
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const diffuseMap = new THREE.CanvasTexture(canvas);
  diffuseMap.wrapS = THREE.RepeatWrapping;
  diffuseMap.wrapT = THREE.RepeatWrapping;
  diffuseMap.repeat.set(2, 2);
  diffuseMap.colorSpace = THREE.SRGBColorSpace;

  // 2. Realistic Specular Roughness Map
  // Calibrated oak specular response:
  // - Medullary rays: silky smooth (roughness 0.32-0.38) catching glancing light flashes
  // - Earlywood dense fibers: 0.50-0.56
  // - Latewood ring edges: 0.65-0.72
  // - Open vessel pores: high diffuse scatter (0.82-0.88)
  const rCanvas = document.createElement('canvas');
  rCanvas.width = width;
  rCanvas.height = height;
  const rCtx = rCanvas.getContext('2d');
  if (rCtx) {
    const rImgData = rCtx.createImageData(width, height);
    const rData = rImgData.data;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const lum = (data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114) / 255;

        const medullaryWave = Math.sin(x * 0.08 + Math.sin(y * 0.12) * 2.2);
        const isMedullary = Math.abs(medullaryWave) < 0.08 && Math.sin(y * 0.45) > 0.3;
        const isPore = ((x * 19 + y * 37) % 103 < 3) && Math.sin(x * 0.35) > 0.35;

        let roughVal: number;
        if (isPore) {
          roughVal = 218; // ~0.85
        } else if (isMedullary) {
          roughVal = Math.round(85 + lum * 15); // ~0.35 specular sheen
        } else {
          // Subtle variance between smooth earlywood and textured latewood
          roughVal = Math.round(135 + (1 - lum) * 45); // 0.53 - 0.70
        }

        rData[idx] = roughVal;
        rData[idx + 1] = roughVal;
        rData[idx + 2] = roughVal;
        rData[idx + 3] = 255;
      }
    }
    rCtx.putImageData(rImgData, 0, 0);
  }

  const roughnessMap = new THREE.CanvasTexture(rCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(2, 2);

  // 3. Bump Map: Tactile pores and growth ring ridges
  const bCanvas = document.createElement('canvas');
  bCanvas.width = width;
  bCanvas.height = height;
  const bCtx = bCanvas.getContext('2d');
  if (bCtx) {
    const bImgData = bCtx.createImageData(width, height);
    const bData = bImgData.data;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const lum = Math.round(data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114);
        const isPore = ((x * 19 + y * 37) % 103 < 3) && Math.sin(x * 0.35) > 0.35;
        // Deepen vessel pores in bump map
        const bumpVal = isPore ? Math.max(0, lum - 55) : lum;
        bData[idx] = bumpVal;
        bData[idx + 1] = bumpVal;
        bData[idx + 2] = bumpVal;
        bData[idx + 3] = 255;
      }
    }
    bCtx.putImageData(bImgData, 0, 0);
  }

  const bumpMap = new THREE.CanvasTexture(bCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(2, 2);

  // 4. Warm Ambient Occlusion Map:
  // Micro-crevices, ring valleys, and pore depressions receive warm, natural contact occlusion
  const aoCanvas = document.createElement('canvas');
  aoCanvas.width = width;
  aoCanvas.height = height;
  const aoCtx = aoCanvas.getContext('2d');
  if (aoCtx) {
    const aoImgData = aoCtx.createImageData(width, height);
    const aoData = aoImgData.data;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const lum = (data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114) / 255;
        const isPore = ((x * 19 + y * 37) % 103 < 3) && Math.sin(x * 0.35) > 0.35;

        // Annular ring valleys and pores receive soft warm occlusion (values 145 to 255)
        let aoVal = Math.round(180 + lum * 75);
        if (isPore) {
          aoVal = 145;
        }
        aoData[idx] = aoVal;
        aoData[idx + 1] = aoVal;
        aoData[idx + 2] = aoVal;
        aoData[idx + 3] = 255;
      }
    }
    aoCtx.putImageData(aoImgData, 0, 0);
  }

  const aoMap = new THREE.CanvasTexture(aoCanvas);
  aoMap.wrapS = THREE.RepeatWrapping;
  aoMap.wrapT = THREE.RepeatWrapping;
  aoMap.repeat.set(2, 2);
  aoMap.channel = 0;

  return { diffuseMap, roughnessMap, bumpMap, aoMap };
}

/**
 * Creates a rounded rectangular 3D extruded geometry with perimeter edge bevels
 */
function createChamferedSlabGeometry(
  width: number,
  depth: number,
  thickness: number,
  cornerRadius: number = 8,
  bevel: number = 2
): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const r = Math.min(cornerRadius, width / 2 - 1, depth / 2 - 1);
  const w = width;
  const d = depth;
  const x = -w / 2;
  const y = -d / 2;

  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + d - r);
  shape.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  shape.lineTo(x + r, y + d);
  shape.quadraticCurveTo(x, y + d, x, y + d - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  const extrudeDepth = Math.max(0.5, thickness - bevel * 2);
  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: extrudeDepth,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: bevel,
    bevelThickness: bevel,
  });

  geom.rotateX(Math.PI / 2);
  geom.center();
  geom.computeVertexNormals();

  // Ensure second UV channel is set for full compatibility with aoMap in all Three.js renderers
  if (geom.attributes.uv && !geom.attributes.uv2) {
    geom.setAttribute('uv2', geom.attributes.uv.clone());
  }

  return geom;
}

export const RealisticDeskModel: React.FC<RealisticDeskModelProps> = ({
  deskWidth = 820,
  deskDepth = 560,
  deskHeight = 740,
  topThickness = 25,
  drawerHousingHeight = 96,
  drawerOpenRatio = 0.68,
  rightDrawerOpenRatio = 0.0,
  woodFinish = 'whiteOak',
  legStyle = 'wood',
  showAccessories = true,
  showShadows = true,
  centerOnDrawer = false,
  hideLeftDrawer = false,
  children,
}) => {
  const rootGroupRef = useRef<THREE.Group>(null);

  // 1. Textures & Materials
  const textures = useMemo(() => generateOakWoodTextures(woodFinish), [woodFinish]);

  // Clean up textures on unmount or finish change
  useEffect(() => {
    return () => {
      textures?.diffuseMap.dispose();
      textures?.roughnessMap.dispose();
      textures?.bumpMap.dispose();
      textures?.aoMap.dispose();
    };
  }, [textures]);

  const woodColorHex = useMemo(() => {
    switch (woodFinish) {
      case 'walnut':
        return '#5A4331';
      case 'blackAsh':
        return '#2C2B2A';
      case 'naturalOak':
        return '#D4B790';
      case 'whiteOak':
      default:
        return '#D8C3A5';
    }
  }, [woodFinish]);

  // Fine-tuned Desk Oak Wood PBR Material
  // Calibrated with organic specular roughness map, tactile pores, warm ambient occlusion,
  // and subtle hardwax-oil satin clearcoat characteristic of fine Scandinavian furniture.
  const woodMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(woodColorHex),
      map: textures?.diffuseMap || null,
      roughnessMap: textures?.roughnessMap || null,
      bumpMap: textures?.bumpMap || null,
      bumpScale: 0.12,
      aoMap: textures?.aoMap || null,
      aoMapIntensity: 1.15,
      roughness: 0.58,
      metalness: 0.02,
      clearcoat: 0.12,
      clearcoatRoughness: 0.42,
    });
  }, [woodColorHex, textures]);

  // Brushed Bronze / Brass Lip Handle Material
  const bronzeHandleMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#6E5B4B'),
      metalness: 0.88,
      roughness: 0.32,
    });
  }, []);

  // Matte Black Steel Leg Material
  const steelLegMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#222326'),
      metalness: 0.22,
      roughness: 0.72,
    });
  }, []);

  // Acoustic Charcoal Felt Liner Material (for drawer bottom floor)
  const feltLinerMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#242629'),
      roughness: 0.96,
      metalness: 0.02,
    });
  }, []);

  // Stainless Steel Drawer Slide Rails
  const slideRailMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#949BA2'),
      metalness: 0.85,
      roughness: 0.28,
    });
  }, []);

  // Accessory Materials
  const deskMatMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#CFC7BE'),
      roughness: 0.94,
      metalness: 0.01,
    });
  }, []);

  const mugCeramicMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E6DDD0'),
      roughness: 0.45,
      metalness: 0.05,
    });
  }, []);

  const coffeeLiquidMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#23120A'),
      roughness: 0.12,
      metalness: 0.08,
    });
  }, []);

  const laptopMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#383B40'),
      metalness: 0.88,
      roughness: 0.24,
    });
  }, []);

  // 2. Geometries
  // Desktop Slab with chamfered edges
  const desktopGeometry = useMemo(() => {
    return createChamferedSlabGeometry(deskWidth, deskDepth, topThickness, 10, 2.5);
  }, [deskWidth, deskDepth, topThickness]);

  // Drawer Face Panel with subtle chamfer
  const drawerFaceGeometry = useMemo(() => {
    const width = (deskWidth - 140) / 2 - 8;
    const height = drawerHousingHeight - 16;
    return createChamferedSlabGeometry(width, 18, height, 4, 1.2);
  }, [deskWidth, drawerHousingHeight]);

  // Dispose geometries on unmount
  useEffect(() => {
    return () => {
      desktopGeometry.dispose();
      drawerFaceGeometry.dispose();
    };
  }, [desktopGeometry, drawerFaceGeometry]);

  // 3. Proportions & Coordinates
  const housingWidth = deskWidth - 100;
  const housingDepth = deskDepth - 100;
  const housingY = deskHeight - topThickness - drawerHousingHeight / 2;
  const housingFrontZ = housingDepth / 2 - 20;

  const leftBayX = -housingWidth / 4;
  const rightBayX = housingWidth / 4;
  const drawerBayWidth = housingWidth / 2 - 24;
  const drawerBoxDepth = housingDepth - 30;
  const drawerBoxHeight = drawerHousingHeight - 20;

  // Slide displacement along +Z (forward towards camera/user)
  const leftSlideOffset = drawerBoxDepth * drawerOpenRatio;
  const rightSlideOffset = drawerBoxDepth * rightDrawerOpenRatio;

  // Calculate drawer interior center in world coordinates
  const drawerInteriorWorldX = leftBayX;
  const drawerInteriorWorldY = deskHeight - topThickness - drawerHousingHeight + DRAWER_INTERIOR_BOUNDS.floorThickness;
  const drawerInteriorWorldZ = housingFrontZ + leftSlideOffset - drawerBoxDepth / 2;

  // Center offset if centerOnDrawer is requested
  const rootOffset: [number, number, number] = centerOnDrawer
    ? [-drawerInteriorWorldX, -drawerInteriorWorldY, -drawerInteriorWorldZ]
    : [0, 0, 0];

  return (
    <group ref={rootGroupRef} position={rootOffset}>
      {/* =========================================================================
          1. SOLID WHITE-OAK DESK TOP SLAB
          ========================================================================= */}
      <mesh
        geometry={desktopGeometry}
        material={woodMaterial}
        position={[0, deskHeight - topThickness / 2, 0]}
        castShadow
        receiveShadow
      />

      {/* =========================================================================
          2. UNDER-DESK DRAWER CABINET HOUSING (APRON FRAME)
          ========================================================================= */}
      <group position={[0, housingY, -10]}>
        {/* Left Outer Side Panel */}
        <mesh
          position={[-housingWidth / 2 + 9, 0, 0]}
          material={woodMaterial}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[18, drawerHousingHeight, housingDepth]} />
        </mesh>

        {/* Right Outer Side Panel */}
        <mesh
          position={[housingWidth / 2 - 9, 0, 0]}
          material={woodMaterial}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[18, drawerHousingHeight, housingDepth]} />
        </mesh>

        {/* Center Divider Pillar */}
        <mesh
          position={[0, 0, 0]}
          material={woodMaterial}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[18, drawerHousingHeight, housingDepth]} />
        </mesh>

        {/* Bottom Support Shelf / Rail */}
        <mesh
          position={[0, -drawerHousingHeight / 2 + 8, 0]}
          material={woodMaterial}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[housingWidth, 16, housingDepth]} />
        </mesh>

        {/* Back Enclosure Panel */}
        <mesh
          position={[0, 0, -housingDepth / 2 + 7]}
          material={woodMaterial}
          castShadow
        >
          <boxGeometry args={[housingWidth, drawerHousingHeight, 14]} />
        </mesh>

        {/* Metal Drawer Slide Runners (Left Bay) */}
        <mesh
          position={[-housingWidth / 2 + 20, 0, 0]}
          material={slideRailMaterial}
        >
          <boxGeometry args={[6, 12, housingDepth - 40]} />
        </mesh>
        <mesh
          position={[-9, 0, 0]}
          material={slideRailMaterial}
        >
          <boxGeometry args={[6, 12, housingDepth - 40]} />
        </mesh>

        {/* Metal Drawer Slide Runners (Right Bay) */}
        <mesh
          position={[9, 0, 0]}
          material={slideRailMaterial}
        >
          <boxGeometry args={[6, 12, housingDepth - 40]} />
        </mesh>
        <mesh
          position={[housingWidth / 2 - 20, 0, 0]}
          material={slideRailMaterial}
        >
          <boxGeometry args={[6, 12, housingDepth - 40]} />
        </mesh>
      </group>

      {/* =========================================================================
          3. LEFT PULL-OUT DRAWER (WITH WAVEZLY ORGANIZER INSERT)
          ========================================================================= */}
      {!hideLeftDrawer && (
        <group
          position={[
            leftBayX,
            deskHeight - topThickness - drawerHousingHeight / 2,
            housingFrontZ + leftSlideOffset,
          ]}
        >
          {/* Front Face Panel with Bronze Lip Pull Handle */}
          <group position={[0, 0, 0]}>
            <mesh
              geometry={drawerFaceGeometry}
              material={woodMaterial}
              castShadow
              receiveShadow
            />

            {/* Minimalist Brushed Bronze Lip Pull Handle */}
            <mesh
              position={[0, drawerBoxHeight / 2 - 4, 11]}
              material={bronzeHandleMaterial}
              castShadow
            >
              <boxGeometry args={[56, 14, 8]} />
            </mesh>
          </group>

          {/* Drawer Inner Box (Extends back into desk housing) */}
          <group position={[0, -2, -drawerBoxDepth / 2]}>
            {/* Bottom Floor Board */}
            <mesh
              position={[0, -drawerBoxHeight / 2 + 4, 0]}
              material={woodMaterial}
              receiveShadow
            >
              <boxGeometry args={[drawerBayWidth - 12, DRAWER_INTERIOR_BOUNDS.floorThickness, drawerBoxDepth]} />
            </mesh>

            {/* Acoustic Dark Charcoal Felt Floor Liner */}
            <mesh
              position={[0, -drawerBoxHeight / 2 + DRAWER_INTERIOR_BOUNDS.floorThickness + 0.5, 0]}
              material={feltLinerMaterial}
              receiveShadow
            >
              <boxGeometry args={[drawerBayWidth - 16, 1.2, drawerBoxDepth - 8]} />
            </mesh>

            {/* Left Inner Side Wall */}
            <mesh
              position={[-drawerBayWidth / 2 + 10, 0, 0]}
              material={woodMaterial}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[12, drawerBoxHeight - 12, drawerBoxDepth]} />
            </mesh>

            {/* Right Inner Side Wall */}
            <mesh
              position={[drawerBayWidth / 2 - 10, 0, 0]}
              material={woodMaterial}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[12, drawerBoxHeight - 12, drawerBoxDepth]} />
            </mesh>

            {/* Back Inner Wall */}
            <mesh
              position={[0, 0, -drawerBoxDepth / 2 + 6]}
              material={woodMaterial}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[drawerBayWidth - 28, drawerBoxHeight - 12, 12]} />
            </mesh>

            {/* Children Slot: Custom 3D Printed Organizer Tray inside drawer cavity */}
            <group
              position={[
                0,
                -drawerBoxHeight / 2 + DRAWER_INTERIOR_BOUNDS.floorThickness + 1.2,
                0,
              ]}
            >
              {children}
            </group>
          </group>
        </group>
      )}

      {/* =========================================================================
          4. RIGHT DRAWER (CLOSED FLUSH)
          ========================================================================= */}
      <group
        position={[
          rightBayX,
          deskHeight - topThickness - drawerHousingHeight / 2,
          housingFrontZ + rightSlideOffset,
        ]}
      >
        {/* Front Face Panel */}
        <mesh
          geometry={drawerFaceGeometry}
          material={woodMaterial}
          castShadow
          receiveShadow
        />

        {/* Minimalist Brushed Bronze Lip Pull Handle */}
        <mesh
          position={[0, drawerBoxHeight / 2 - 4, 11]}
          material={bronzeHandleMaterial}
          castShadow
        >
          <boxGeometry args={[56, 14, 8]} />
        </mesh>

        {/* Drawer Inner Box */}
        <group position={[0, -2, -drawerBoxDepth / 2]}>
          <mesh
            position={[0, -drawerBoxHeight / 2 + 4, 0]}
            material={woodMaterial}
          >
            <boxGeometry args={[drawerBayWidth - 12, DRAWER_INTERIOR_BOUNDS.floorThickness, drawerBoxDepth]} />
          </mesh>
          <mesh
            position={[-drawerBayWidth / 2 + 10, 0, 0]}
            material={woodMaterial}
          >
            <boxGeometry args={[12, drawerBoxHeight - 12, drawerBoxDepth]} />
          </mesh>
          <mesh
            position={[drawerBayWidth / 2 - 10, 0, 0]}
            material={woodMaterial}
          >
            <boxGeometry args={[12, drawerBoxHeight - 12, drawerBoxDepth]} />
          </mesh>
          <mesh
            position={[0, 0, -drawerBoxDepth / 2 + 6]}
            material={woodMaterial}
          >
            <boxGeometry args={[drawerBayWidth - 28, drawerBoxHeight - 12, 12]} />
          </mesh>
        </group>
      </group>

      {/* =========================================================================
          5. SCANDINAVIAN DESK LEGS (4 CORNER LEGS)
          ========================================================================= */}
      {(() => {
        const legMaterial = legStyle === 'blackSteel' ? steelLegMaterial : woodMaterial;
        const legHeight = deskHeight - topThickness;
        const legInsetX = deskWidth / 2 - 45;
        const legInsetZ = deskDepth / 2 - 45;

        const legPositions: [number, number, number][] = [
          [-legInsetX, legHeight / 2, -legInsetZ], // Back Left
          [legInsetX, legHeight / 2, -legInsetZ],  // Back Right
          [-legInsetX, legHeight / 2, legInsetZ],  // Front Left
          [legInsetX, legHeight / 2, legInsetZ],   // Front Right
        ];

        return (
          <group>
            {legPositions.map(([lx, ly, lz], i) => (
              <group key={i} position={[lx, ly, lz]}>
                {/* Tapered Scandinavian Leg */}
                <mesh
                  material={legMaterial}
                  castShadow
                  receiveShadow
                  rotation={[0, Math.PI / 4, 0]}
                >
                  <cylinderGeometry args={[18, 13, legHeight, 4]} />
                </mesh>

                {/* Protective Floor Glide Pad */}
                <mesh
                  position={[0, -legHeight / 2 + 2, 0]}
                  material={steelLegMaterial}
                >
                  <cylinderGeometry args={[14, 14, 4, 16]} />
                </mesh>
              </group>
            ))}
          </group>
        );
      })()}

      {/* =========================================================================
          6. DESK STAGING ACCESSORIES (CONCEPT IMAGE FIDELITY)
          ========================================================================= */}
      {showAccessories && (
        <group position={[0, deskHeight, 0]}>
          {/* Minimalist Heathered Felt / Linen Desk Mat */}
          <mesh
            position={[130, 1.2, 35]}
            material={deskMatMaterial}
            receiveShadow
          >
            <boxGeometry args={[360, 2.4, 250]} />
          </mesh>

          {/* Stoneware Ceramic Coffee Mug */}
          <group position={[60, 24, -35]}>
            {/* Mug Body */}
            <mesh material={mugCeramicMaterial} castShadow>
              <cylinderGeometry args={[18, 16, 42, 24]} />
            </mesh>
            {/* Coffee Liquid Surface */}
            <mesh position={[0, 18, 0]} material={coffeeLiquidMaterial}>
              <cylinderGeometry args={[16.5, 16.5, 2, 24]} />
            </mesh>
            {/* Curved Handle */}
            <mesh position={[-20, 0, 0]} material={mugCeramicMaterial} castShadow>
              <torusGeometry args={[10, 3, 12, 16, Math.PI * 0.9]} />
            </mesh>
          </group>

          {/* Ultra-Slim Space Gray Laptop */}
          <group position={[200, 6, 65]} rotation={[0, -0.06, 0]}>
            <mesh material={laptopMaterial} castShadow receiveShadow>
              <boxGeometry args={[220, 8, 150]} />
            </mesh>
            {/* Subtle Screen Bevel Line */}
            <mesh position={[0, 4.2, 0]} material={bronzeHandleMaterial}>
              <boxGeometry args={[200, 0.4, 130]} />
            </mesh>
          </group>

          {/* Ambient Modern Lattice Lantern in Background */}
          <group position={[240, 50, -160]}>
            <mesh castShadow>
              <cylinderGeometry args={[28, 32, 95, 18, 1, true]} />
              <meshStandardMaterial
                color="#1E1E20"
                metalness={0.7}
                roughness={0.4}
                wireframe
              />
            </mesh>
            {/* Warm Incandescent Amber Core Light */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[14, 14, 60, 16]} />
              <meshStandardMaterial
                color="#FFA726"
                emissive="#FF9800"
                emissiveIntensity={1.8}
                roughness={0.2}
              />
            </mesh>
            <pointLight
              color="#FFB74D"
              intensity={0.65}
              distance={260}
              decay={2}
            />
          </group>
        </group>
      )}

      {/* =========================================================================
          7. REALISTIC FLOOR CONTACT SHADOW RIG
          ========================================================================= */}
      {showShadows && (
        <>
          {/* Main Floor Drop Shadow */}
          <ContactShadows
            position={[0, 0.1, 0]}
            opacity={0.55}
            scale={deskWidth * 1.8}
            blur={2.0}
            far={120}
            resolution={1024}
            color="#181512"
          />

          {/* Under-Drawer Floating Ambient Contact Shadow */}
          <ContactShadows
            position={[leftBayX, deskHeight - topThickness - drawerHousingHeight - 2, housingFrontZ + leftSlideOffset - 40]}
            opacity={0.35}
            scale={360}
            blur={1.8}
            far={60}
            resolution={512}
            color="#14110E"
          />
        </>
      )}
    </group>
  );
};

export default RealisticDeskModel;
