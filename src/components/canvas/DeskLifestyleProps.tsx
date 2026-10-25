/**
 * WAVEZLY DESK LIFESTYLE PROPS (3D TANGIBLE DESK ACCESSORIES)
 * High-fidelity PBR lifestyle accessories that frame the custom drawer organizer:
 * 1. Voronoi Ambient Table Lamp: Sculptural mushroom/dome lamp in matte warm alabaster (#FFFDF9)
 *    with an internal warm 2700K point light casting soft light onto the desk surface.
 * 2. Minimalist Ceramic Coffee Mug: In matte terracotta/speckle stoneware (#D4A373) with espresso liquid.
 * 3. Sleek Metal Pen & EDC items: Anodized machined metal pen, subtle linen notebook, and earbud pebble case.
 * 4. Realistic contact shadows under each prop grounding them to the desk at Y = 0.
 *
 * Designed to match the editorial aesthetics in desk_3d_customizer_concept.jpg
 */

import React, { useMemo, useState, useRef } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ParametricOrganizerDimensions } from '../../types';

// ==========================================
// TYPES & PROPS
// ==========================================

export interface DeskLifestylePropsOptions {
  organizerDimensions?: ParametricOrganizerDimensions;
  showLamp?: boolean;
  showMug?: boolean;
  showNotebook?: boolean;
  showPen?: boolean;
  showDeskMat?: boolean;
  showEarbuds?: boolean;
  lampIntensity?: number;
  lampColor?: string;
  lampLightColor?: string;
  mugColor?: string;
  penColor?: string;
  position?: [number, number, number];
  scale?: number;
  visible?: boolean;
}

// ==========================================
// 1. PROCEDURAL SOFT CONTACT SHADOW TEXTURE
// ==========================================

function getSoftShadowTexture(): THREE.Texture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(18, 14, 10, 0.65)');
  gradient.addColorStop(0.3, 'rgba(18, 14, 10, 0.42)');
  gradient.addColorStop(0.65, 'rgba(18, 14, 10, 0.12)');
  gradient.addColorStop(1, 'rgba(18, 14, 10, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

interface ContactShadowDiscProps {
  radius: number;
  opacity?: number;
  position?: [number, number, number];
  scaleX?: number;
  scaleZ?: number;
}

const ContactShadowDisc: React.FC<ContactShadowDiscProps> = ({
  radius,
  opacity = 0.45,
  position = [0, 0.04, 0],
  scaleX = 1,
  scaleZ = 1,
}) => {
  const shadowTex = useMemo(() => getSoftShadowTexture(), []);

  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[scaleX, scaleZ, 1]}
      renderOrder={1}
    >
      <planeGeometry args={[radius * 2, radius * 2]} />
      {shadowTex ? (
        <meshBasicMaterial
          map={shadowTex}
          transparent
          opacity={opacity}
          depthWrite={false}
        />
      ) : (
        <meshBasicMaterial
          color="#15120f"
          transparent
          opacity={opacity * 0.4}
          depthWrite={false}
        />
      )}
    </mesh>
  );
};

// ==========================================
// 2. VORONOI AMBIENT TABLE LAMP
// ==========================================

export interface VoronoiTableLampProps {
  position?: [number, number, number];
  lampColor?: string;
  lightColor?: string;
  intensity?: number;
  interactive?: boolean;
}

export const VoronoiTableLamp: React.FC<VoronoiTableLampProps> = ({
  position = [0, 0, 0],
  lampColor = '#FFFDF9', // Matte Warm Alabaster
  lightColor = '#FFA858', // 2700K Warm Amber
  intensity = 4.2,
  interactive = true,
}) => {
  const [isOn, setIsOn] = useState(true);
  const targetRef = useRef<THREE.Object3D>(null);

  // Materials
  const alabasterMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(lampColor),
        roughness: 0.68,
        metalness: 0.04,
      }),
    [lampColor]
  );

  const brassCollarMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D4AF37'),
        roughness: 0.28,
        metalness: 0.82,
      }),
    []
  );

  const glowingCoreMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FFF5E6'),
        emissive: new THREE.Color(isOn ? lightColor : '#221105'),
        emissiveIntensity: isOn ? 2.6 : 0.05,
        roughness: 0.2,
        transparent: true,
        opacity: 0.94,
      }),
    [isOn, lightColor]
  );

  // Procedural 3D Voronoi / Diamond Ribbed Lattice Shade
  const voronoiShadeGeometry = useMemo(() => {
    const rBase = 27;
    const yBottom = 42;
    const yTop = 76;
    const height = yTop - yBottom;
    const ribCount = 12;
    const tubeGeoms: THREE.BufferGeometry[] = [];

    // Spiraling intersecting tubes forming diamond Voronoi cells
    for (const dir of [1, -1]) {
      for (let i = 0; i < ribCount; i++) {
        const baseAngle = (i / ribCount) * Math.PI * 2;
        const points: THREE.Vector3[] = [];
        const steps = 14;

        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const y = yBottom + height * t;
          // Organic curved dome profile
          const r = rBase * Math.sin(Math.acos(t * 0.88));
          const angle = baseAngle + dir * t * (Math.PI * 0.72);
          const x = r * Math.cos(angle);
          const z = r * Math.sin(angle);
          points.push(new THREE.Vector3(x, y, z));
        }

        const curve = new THREE.CatmullRomCurve3(points);
        const tube = new THREE.TubeGeometry(curve, 16, 1.15, 6, false);
        tubeGeoms.push(tube);
      }
    }

    // Bottom structural rim ring
    const bottomRing = new THREE.TorusGeometry(rBase * 0.98, 1.25, 8, 32);
    bottomRing.rotateX(Math.PI / 2);
    bottomRing.translate(0, yBottom + 0.5, 0);
    tubeGeoms.push(bottomRing);

    // Merge into single high-performance geometry
    const merged = mergeGeometries(tubeGeoms, false);
    tubeGeoms.forEach((g) => g.dispose());
    merged.computeVertexNormals();
    return merged;
  }, []);

  return (
    <group
      position={position}
      onClick={interactive ? (e) => { e.stopPropagation(); setIsOn(!isOn); } : undefined}
      onPointerOver={interactive ? (e) => { e.stopPropagation(); if (typeof document !== 'undefined') document.body.style.cursor = 'pointer'; } : undefined}
      onPointerOut={interactive ? (e) => { e.stopPropagation(); if (typeof document !== 'undefined') document.body.style.cursor = 'auto'; } : undefined}
    >
      {/* 1. Contact Shadow Disc Under Pedestal */}
      <ContactShadowDisc radius={26} opacity={0.52} position={[0, 0.03, 0]} />

      {/* 2. Sculptural Base Pedestal */}
      {/* Foot ring bevel */}
      <mesh
        material={alabasterMaterial}
        position={[0, 2.5, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[18, 20, 5, 32]} />
      </mesh>

      {/* Main weighted base body */}
      <mesh
        material={alabasterMaterial}
        position={[0, 10.5, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[16.5, 18, 11, 32]} />
      </mesh>

      {/* Brushed Brass Collar Accent */}
      <mesh
        material={brassCollarMaterial}
        position={[0, 17, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[10.5, 12, 2.5, 32]} />
      </mesh>

      {/* Slender Lamp Stem */}
      <mesh
        material={alabasterMaterial}
        position={[0, 29, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[7, 8.5, 22, 32]} />
      </mesh>

      {/* Upper Shade Support Hub */}
      <mesh
        material={alabasterMaterial}
        position={[0, 41, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[11, 8, 3, 32]} />
      </mesh>

      {/* 3. Inner Glowing Diffuser Capsule */}
      <mesh
        material={glowingCoreMaterial}
        position={[0, 57, 0]}
        castShadow={false}
      >
        <capsuleGeometry args={[11.5, 15, 16, 24]} />
      </mesh>

      {/* 4. Sculptural Voronoi Outer Shade */}
      <mesh
        geometry={voronoiShadeGeometry}
        material={alabasterMaterial}
        castShadow
        receiveShadow
      />

      {/* Top Mushroom Apex Finial Dome */}
      <mesh
        material={alabasterMaterial}
        position={[0, 75.8, 0]}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[8.5, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
      </mesh>

      {/* 5. Internal Warm 2700K Point Light */}
      {isOn && (
        <>
          <pointLight
            position={[0, 57, 0]}
            color={lightColor}
            intensity={intensity}
            distance={420}
            decay={2}
            castShadow
            shadow-bias={-0.0005}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          {/* Soft Downward Desk Pool Illumination */}
          <spotLight
            position={[0, 50, 0]}
            target={targetRef.current || undefined}
            color={lightColor}
            intensity={intensity * 0.8}
            angle={1.1}
            penumbra={0.85}
            distance={260}
          />
        </>
      )}

      {/* Spotlight Target Anchor (at desk surface) */}
      <object3D ref={targetRef} position={[0, 0, 0]} />
    </group>
  );
};

// ==========================================
// 3. MINIMALIST CERAMIC COFFEE MUG
// ==========================================

export interface CeramicCoffeeMugProps {
  position?: [number, number, number];
  mugColor?: string;
  rotationY?: number;
}

export const CeramicCoffeeMug: React.FC<CeramicCoffeeMugProps> = ({
  position = [0, 0, 0],
  mugColor = '#D4A373', // Matte Terracotta / Speckle Stoneware
  rotationY = 0.4,
}) => {
  // PBR Stoneware Pottery Material
  const stonewareMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(mugColor),
        roughness: 0.65,
        metalness: 0.05,
      }),
    [mugColor]
  );

  // Dark Espresso Coffee Surface Material
  const coffeeLiquidMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#160C06'),
        roughness: 0.08,
        metalness: 0.06,
      }),
    []
  );

  // Crema Foam Ring Material
  const cremaMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#644528'),
        roughness: 0.42,
        metalness: 0.02,
      }),
    []
  );

  // Lathed Ceramic Mug Body with Hollow Interior and Rounded Rim
  const mugBodyGeometry = useMemo(() => {
    const points = [
      new THREE.Vector2(0, 0.4),
      new THREE.Vector2(15.5, 0.4), // Foot recess
      new THREE.Vector2(17.2, 0.8), // Rounded foot ring
      new THREE.Vector2(17.8, 3.5),
      new THREE.Vector2(18.5, 18),
      new THREE.Vector2(19.2, 34),
      new THREE.Vector2(18.5, 36.5), // Top outer rim
      new THREE.Vector2(17.2, 35.2), // Inner rim
      new THREE.Vector2(16.4, 18), // Inner wall
      new THREE.Vector2(15.2, 3.8), // Inner floor transition
      new THREE.Vector2(0, 3.4), // Inner floor center
    ];
    const geom = new THREE.LatheGeometry(points, 36);
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Ceramic Loop Handle
  const handleGeometry = useMemo(() => {
    const curvePoints = [
      new THREE.Vector3(18.2, 28.5, 0),
      new THREE.Vector3(28.5, 25.5, 0),
      new THREE.Vector3(29.5, 16.5, 0),
      new THREE.Vector3(26.5, 8.5, 0),
      new THREE.Vector3(17.4, 7.5, 0),
    ];
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tube = new THREE.TubeGeometry(curve, 24, 2.4, 12, false);
    tube.computeVertexNormals();
    return tube;
  }, []);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 1. Contact Shadow Disc */}
      <ContactShadowDisc radius={23} opacity={0.46} position={[0, 0.04, 0]} />

      {/* 2. Ceramic Stoneware Mug Body */}
      <mesh
        geometry={mugBodyGeometry}
        material={stonewareMaterial}
        castShadow
        receiveShadow
      />

      {/* 3. Ceramic Mug Handle */}
      <mesh
        geometry={handleGeometry}
        material={stonewareMaterial}
        castShadow
        receiveShadow
      />

      {/* 4. Dark Espresso Coffee Liquid Surface */}
      <mesh
        material={coffeeLiquidMaterial}
        position={[0, 28.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[16.6, 32]} />
      </mesh>

      {/* Subtle Crema Perimeter Ring */}
      <mesh
        material={cremaMaterial}
        position={[0, 28.6, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[15.6, 16.6, 32]} />
      </mesh>
    </group>
  );
};

// ==========================================
// 4. SLEEK METAL PEN & EDC ACCESSORIES
// ==========================================

export interface SleekMetalPenProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}

export const SleekMetalPen: React.FC<SleekMetalPenProps> = ({
  position = [0, 4, 0],
  rotation = [0, 0.12, 0],
  color = '#5A5D64', // Anodized Gunmetal Grey
}) => {
  const metalMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        metalness: 0.88,
        roughness: 0.25,
      }),
    [color]
  );

  const polishedBrassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D4AF37'),
        metalness: 0.9,
        roughness: 0.18,
      }),
    []
  );

  const tungstenTipMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#222222'),
        metalness: 0.95,
        roughness: 0.12,
      }),
    []
  );

  return (
    <group position={position} rotation={rotation}>
      {/* Contact Shadow for Pen */}
      <mesh
        position={[0, -3.95, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={1}
      >
        <planeGeometry args={[74, 9]} />
        <meshBasicMaterial
          color="#120e0a"
          transparent
          opacity={0.32}
          depthWrite={false}
        />
      </mesh>

      {/* Main Pen Assembly lying along X axis */}
      {/* 1. Main Barrel */}
      <mesh
        material={metalMaterial}
        position={[6, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[3.8, 3.8, 48, 24]} />
      </mesh>

      {/* 2. Micro-Grooved Grip Section */}
      <mesh
        material={metalMaterial}
        position={[-23, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[3.5, 3.8, 16, 24]} />
      </mesh>

      {/* Polished Accent Ring */}
      <mesh
        material={polishedBrassMaterial}
        position={[-15, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[3.85, 3.85, 1.2, 24]} />
      </mesh>

      {/* 3. Tapered Front Nib Section */}
      <mesh
        material={metalMaterial}
        position={[-33.5, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
      >
        <coneGeometry args={[3.5, 7, 24]} />
      </mesh>

      {/* 4. Fine Ballpoint Tip */}
      <mesh
        material={tungstenTipMaterial}
        position={[-37.5, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.5, 0.9, 2.2, 16]} />
      </mesh>

      {/* 5. Pocket Clip */}
      <mesh
        material={metalMaterial}
        position={[18, 4.4, 0]}
        castShadow
      >
        <boxGeometry args={[26, 0.8, 2.2]} />
      </mesh>
      {/* Clip Return Tab */}
      <mesh
        material={metalMaterial}
        position={[31, 2.5, 0]}
        castShadow
      >
        <boxGeometry args={[1.5, 3, 2.2]} />
      </mesh>

      {/* 6. Tail Clicker Button */}
      <mesh
        material={polishedBrassMaterial}
        position={[31.8, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[3.1, 3.1, 3.6, 24]} />
      </mesh>
    </group>
  );
};

// ==========================================
// 5. MINIMALIST LINEN NOTEBOOK
// ==========================================

export interface LinenNotebookProps {
  position?: [number, number, number];
  rotationY?: number;
  width?: number;
  length?: number;
  height?: number;
}

export const LinenNotebook: React.FC<LinenNotebookProps> = ({
  position = [0, 0, 0],
  rotationY = 0.08,
  width = 72,
  length = 104,
  height = 6.5,
}) => {
  // Rounded rectangle shape helper
  const notebookCoverGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const r = 4;
    const w = width;
    const l = length;
    const x = -w / 2;
    const y = -l / 2;

    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + l - r);
    shape.quadraticCurveTo(x + w, y + l, x + w - r, y + l);
    shape.lineTo(x + r, y + l);
    shape.quadraticCurveTo(x, y + l, x, y + l - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.5,
      bevelThickness: 0.5,
    });
    geom.rotateX(Math.PI / 2);
    geom.translate(0, height / 2 + 0.1, 0);
    geom.computeVertexNormals();
    return geom;
  }, [width, length, height]);

  const coverMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2A2B2D'), // Minimalist Charcoal Linen
        roughness: 0.88,
        metalness: 0.02,
      }),
    []
  );

  const paperEdgeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#F7F5EE'), // Warm Cream Paper
        roughness: 0.94,
        metalness: 0.0,
      }),
    []
  );

  const ribbonMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D4AF37'), // Gold Ribbon Bookmark
        roughness: 0.35,
        metalness: 0.2,
      }),
    []
  );

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Contact Shadow Under Notebook */}
      <mesh
        position={[0, 0.04, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={1}
      >
        <planeGeometry args={[width + 12, length + 12]} />
        <meshBasicMaterial
          color="#14110e"
          transparent
          opacity={0.34}
          depthWrite={false}
        />
      </mesh>

      {/* 1. Linen Notebook Cover */}
      <mesh
        geometry={notebookCoverGeometry}
        material={coverMaterial}
        castShadow
        receiveShadow
      />

      {/* 2. Inset Paper Edges Block (revealed on 3 outer edges) */}
      <mesh
        material={paperEdgeMaterial}
        position={[1.5, height / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width - 4, height - 1.2, length - 4]} />
      </mesh>

      {/* 3. Gold Ribbon Bookmark Strip */}
      <mesh
        material={ribbonMaterial}
        position={[0, height + 0.25, 4]}
        rotation={[-Math.PI / 2, 0, -0.05]}
        castShadow
      >
        <planeGeometry args={[3.5, length * 0.9]} />
      </mesh>
    </group>
  );
};

// ==========================================
// 6. EDC PEBBLE WIRELESS EARBUDS CASE
// ==========================================

export const EdcPebbleEarbuds: React.FC<{ position?: [number, number, number]; rotationY?: number }> = ({
  position = [0, 0, 0],
  rotationY = 0.25,
}) => {
  const caseMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#F9FAFB'),
        roughness: 0.32,
        metalness: 0.05,
      }),
    []
  );

  const seamMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D1D5DB'),
        roughness: 0.4,
        metalness: 0.1,
      }),
    []
  );

  const ledMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#10B981'), // Emerald Active LED
      }),
    []
  );

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Contact Shadow */}
      <ContactShadowDisc radius={15} opacity={0.38} position={[0, 0.04, 0]} scaleX={1.4} scaleZ={0.9} />

      {/* Pebble Bottom Half */}
      <mesh material={caseMaterial} position={[0, 5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[8, 7.5, 9, 32]} />
      </mesh>

      {/* Pebble Lid Top Half */}
      <mesh material={caseMaterial} position={[0, 11, 0]} castShadow receiveShadow>
        <sphereGeometry args={[8, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.48]} />
      </mesh>

      {/* Middle Cut Seam Ring */}
      <mesh material={seamMaterial} position={[0, 9.6, 0]} castShadow>
        <cylinderGeometry args={[8.08, 8.08, 0.35, 32]} />
      </mesh>

      {/* Micro Status LED indicator */}
      <mesh material={ledMaterial} position={[0, 7.5, 7.9]}>
        <sphereGeometry args={[0.35, 12, 12]} />
      </mesh>
    </group>
  );
};

// ==========================================
// 7. WOVEN LINEN / FELT DESK MAT
// ==========================================

export const DeskFeltMat: React.FC<{
  position?: [number, number, number];
  width?: number;
  length?: number;
}> = ({ position = [0, 0, 0], width = 165, length = 135 }) => {
  const matShape = useMemo(() => {
    const shape = new THREE.Shape();
    const r = 8;
    const w = width;
    const l = length;
    const x = -w / 2;
    const y = -l / 2;

    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + l - r);
    shape.quadraticCurveTo(x + w, y + l, x + w - r, y + l);
    shape.lineTo(x + r, y + l);
    shape.quadraticCurveTo(x, y + l, x, y + l - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 1.2,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.4,
      bevelThickness: 0.4,
    });
    geom.rotateX(Math.PI / 2);
    geom.translate(0, 0.6, 0);
    geom.computeVertexNormals();
    return geom;
  }, [width, length]);

  const matMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#EBE6DE'), // Warm Oatmeal Woven Felt
        roughness: 0.95,
        metalness: 0.0,
      }),
    []
  );

  return (
    <group position={position}>
      {/* Contact Shadow under Desk Mat */}
      <mesh
        position={[0, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={0}
      >
        <planeGeometry args={[width + 16, length + 16]} />
        <meshBasicMaterial
          color="#120e0a"
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </mesh>

      <mesh
        geometry={matShape}
        material={matMaterial}
        receiveShadow
      />
    </group>
  );
};

// ==========================================
// MAIN COMPONENT: DeskLifestyleProps
// ==========================================

export const DeskLifestyleProps: React.FC<DeskLifestylePropsOptions> = ({
  organizerDimensions = { length: 160, width: 120, height: 40 },
  showLamp = true,
  showMug = true,
  showNotebook = true,
  showPen = true,
  showDeskMat = true,
  showEarbuds = true,
  lampIntensity = 4.5,
  lampColor = '#1F2024', // Matte Obsidian Voronoi Lattice (matches concept photo)
  lampLightColor = '#FFA84C',
  mugColor = '#E2DBD0', // Speckled Stoneware Ceramic (matches concept photo)
  penColor = '#5A5D64',
  position = [0, 0, 0],
  scale = 1,
  visible = true,
}) => {
  if (!visible) return null;

  // Compute responsive layout coordinates on top of the right-hand desktop surface
  const halfL = organizerDimensions.length / 2;
  const halfW = organizerDimensions.width / 2;

  // Right-hand desktop zone (above the closed right drawer)
  const rightZoneX = halfL + 42;
  const backZ = -halfW * 0.45;

  return (
    <group position={position} scale={scale} name="DeskLifestyleProps">
      {/* 1. Large Woven Oatmeal Linen Desk Mat on Right Desktop */}
      {showDeskMat && (
        <DeskFeltMat
          position={[rightZoneX + 115, 0, 12]}
          width={250}
          length={180}
        />
      )}

      {/* 2. Voronoi Ambient Table Lamp (Back-Center / Right of Desk, casting warm 2700K pool) */}
      {showLamp && (
        <VoronoiTableLamp
          position={[rightZoneX + 18, 0, backZ - 28]}
          lampColor={lampColor}
          lightColor={lampLightColor}
          intensity={lampIntensity}
        />
      )}

      {/* 3. Speckled Stoneware Ceramic Coffee Mug (Front-Left Corner of Linen Desk Mat) */}
      {showMug && (
        <CeramicCoffeeMug
          position={[rightZoneX + 34, 0, 10]}
          mugColor={mugColor}
          rotationY={2.75}
        />
      )}

      {/* 4. Space-Grey Unibody Laptop / Folio on Linen Desk Mat */}
      {showNotebook && (
        <LinenNotebook
          position={[rightZoneX + 148, 0, 22]}
          rotationY={-0.06}
          width={145}
          length={105}
          height={6.5}
        />
      )}

      {/* 5. Sleek Anodized Metal Pen */}
      {showPen && (
        <SleekMetalPen
          position={[rightZoneX + 68, 3.8, 66]}
          rotation={[0, 0.18, 0]}
          color={penColor}
        />
      )}

      {/* 6. EDC Pebble Earbuds Case */}
      {showEarbuds && (
        <EdcPebbleEarbuds
          position={[rightZoneX + 86, 0, -34]}
          rotationY={0.28}
        />
      )}

      {/* 7. Scandinavian Potted Fiddle-Leaf Plant in Back-Left Corner */}
      <group position={[-halfL - 95, -145, -halfW - 65]}>
        {/* Matte Ceramic Planter Pot */}
        <mesh position={[0, 42, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[36, 28, 84, 28]} />
          <meshStandardMaterial color="#EFECE6" roughness={0.78} metalness={0.02} />
        </mesh>
        {/* Dark Potting Soil Disc */}
        <mesh position={[0, 82.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[34, 24]} />
          <meshStandardMaterial color="#2B2118" roughness={0.95} />
        </mesh>
        {/* Woody Plant Stem */}
        <mesh position={[0, 125, 0]} castShadow>
          <cylinderGeometry args={[2.2, 3.5, 95, 12]} />
          <meshStandardMaterial color="#4A3728" roughness={0.85} />
        </mesh>
        {/* Sculptural Botanical Leaves */}
        {[
          { pos: [-18, 148, 12] as [number, number, number], rot: [0.35, 0.4, 0.25] as [number, number, number], s: [1.3, 0.15, 0.9] as [number, number, number] },
          { pos: [20, 158, 8] as [number, number, number], rot: [0.25, -0.5, -0.3] as [number, number, number], s: [1.4, 0.15, 0.95] as [number, number, number] },
          { pos: [-8, 174, -14] as [number, number, number], rot: [-0.3, 0.2, 0.15] as [number, number, number], s: [1.35, 0.15, 0.9] as [number, number, number] },
          { pos: [14, 186, -6] as [number, number, number], rot: [0.15, -0.3, -0.2] as [number, number, number], s: [1.2, 0.15, 0.85] as [number, number, number] },
          { pos: [-22, 166, -4] as [number, number, number], rot: [0.2, 0.8, 0.35] as [number, number, number], s: [1.25, 0.15, 0.88] as [number, number, number] },
        ].map((leaf, i) => (
          <mesh key={i} position={leaf.pos} rotation={leaf.rot} scale={leaf.s} castShadow receiveShadow>
            <sphereGeometry args={[22, 16, 12]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#2D4F38' : '#3A6347'} roughness={0.62} metalness={0.04} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export default DeskLifestyleProps;
