/**
 * WAVEZLY 3D EDC GEAR & ORGANIZER LOADOUT
 * Photorealistic procedural Everyday Carry (EDC) props staged inside customizer tray compartments:
 * 1. Machined Aluminum Fountain Pen / Apple Pencil (elongated slot)
 * 2. Smartwatch / Apple Watch Ultra with Ocean Loop strap (square / primary slot)
 * 3. AirPods Pro Charging Case with subtle active status LED (square / secondary slot)
 * 4. Keyring with Machined Brass Pill Fob & Staggered EDC Keys
 * 5. USB-C Woven Braided Cable & Anodized Flash Drive
 *
 * Dynamically scales and positions items based on tray dimensions (rows, cols, length, width, height)
 * ensuring items sit flush on the floor at Y = bottomThickness without clipping into divider walls.
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { ParametricOrganizerDimensions } from '../../types';

export interface OrganizerGearLoadoutProps {
  dimensions: ParametricOrganizerDimensions;
  visible?: boolean;
}

// ==========================================
// PROCEDURAL CONTACT SHADOW HELPER
// ==========================================

function getSoftShadowTexture(): THREE.Texture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(10, 8, 6, 0.70)');
  gradient.addColorStop(0.35, 'rgba(10, 8, 6, 0.38)');
  gradient.addColorStop(0.7, 'rgba(10, 8, 6, 0.10)');
  gradient.addColorStop(1, 'rgba(10, 8, 6, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

interface ItemContactShadowProps {
  width: number;
  length: number;
  opacity?: number;
  yOffset?: number;
}

const ItemContactShadow: React.FC<ItemContactShadowProps> = ({
  width,
  length,
  opacity = 0.4,
  yOffset = 0.08,
}) => {
  const shadowTex = useMemo(() => getSoftShadowTexture(), []);

  return (
    <mesh
      position={[0, yOffset, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      renderOrder={1}
    >
      <planeGeometry args={[width, length]} />
      {shadowTex ? (
        <meshBasicMaterial
          map={shadowTex}
          transparent
          opacity={opacity}
          depthWrite={false}
        />
      ) : (
        <meshBasicMaterial
          color="#0d0b09"
          transparent
          opacity={opacity * 0.4}
          depthWrite={false}
        />
      )}
    </mesh>
  );
};

// ==========================================
// 1. MACHINED ALUMINUM FOUNTAIN PEN / STYLUS
// ==========================================

interface MachinedPenProps {
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
  slotLength: number;
  slotWidth: number;
}

const MachinedFountainPen: React.FC<MachinedPenProps> = ({
  position,
  rotationY = 0,
  scale = 1,
  slotLength,
  slotWidth,
}) => {
  // If slot is oriented along Z axis, rotate pen 90 degrees
  const isVerticalSlot = slotWidth > slotLength;
  const effectiveRotY = isVerticalSlot ? rotationY + Math.PI / 2 : rotationY;

  // Space Grey Anodized Aluminum Material
  const aluminumMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#3A3D42'),
        metalness: 0.88,
        roughness: 0.22,
      }),
    []
  );

  // Polished Warm Brass Accent Material
  const brassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D4AF37'),
        metalness: 0.92,
        roughness: 0.16,
      }),
    []
  );

  // Two-tone Nib / Tip Material
  const nibMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#E2E8F0'),
        metalness: 0.95,
        roughness: 0.12,
      }),
    []
  );

  const penRadius = 4.4;
  const barrelLength = 65;

  return (
    <group position={position} rotation={[0, effectiveRotY, 0]} scale={scale}>
      {/* Contact Shadow Under Pen */}
      <ItemContactShadow width={138} length={16} opacity={0.42} />

      {/* Group centered so pen rests at Y = penRadius */}
      <group position={[0, penRadius, 0]}>
        {/* Main Body Barrel */}
        <mesh
          material={aluminumMaterial}
          position={[10, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[penRadius, penRadius, barrelLength, 32]} />
        </mesh>

        {/* Tail Chamfered Cap */}
        <mesh
          material={aluminumMaterial}
          position={[10 + barrelLength / 2 + 3.5, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[penRadius * 0.9, penRadius, 7, 32]} />
        </mesh>

        {/* Polished Brass Accent Ring */}
        <mesh
          material={brassMaterial}
          position={[-23, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[penRadius + 0.25, penRadius + 0.25, 2.2, 32]} />
        </mesh>

        {/* Micro-knurled Grip Section */}
        <mesh
          material={aluminumMaterial}
          position={[-32, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[penRadius * 0.88, penRadius * 0.98, 16, 32]} />
        </mesh>

        {/* Brass Grip Collar */}
        <mesh
          material={brassMaterial}
          position={[-41, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[penRadius * 0.88 + 0.2, penRadius * 0.88 + 0.2, 1.8, 32]} />
        </mesh>

        {/* Tapered Nib Section */}
        <mesh
          material={aluminumMaterial}
          position={[-46, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <coneGeometry args={[penRadius * 0.85, 9, 32]} />
        </mesh>

        {/* Fine Fountain Pen Nib / Stylus Tip */}
        <mesh
          material={nibMaterial}
          position={[-52, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <coneGeometry args={[2.0, 5, 16]} />
        </mesh>

        {/* Spring Pocket Clip */}
        <mesh
          material={brassMaterial}
          position={[28, penRadius + 0.9, 0]}
          castShadow
        >
          <boxGeometry args={[32, 1.0, 2.8]} />
        </mesh>
        <mesh
          material={brassMaterial}
          position={[43.5, penRadius * 0.6, 0]}
          castShadow
        >
          <boxGeometry args={[1.6, 3.0, 2.8]} />
        </mesh>
      </group>
    </group>
  );
};

// ==========================================
// 2. APPLE WATCH / SMARTWATCH WITH STRAP
// ==========================================

interface SmartwatchProps {
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
}

const SmartwatchProp: React.FC<SmartwatchProps> = ({
  position,
  rotationY = 0,
  scale = 1,
}) => {
  // Aerospace Titanium Case Material
  const titaniumMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#94989E'),
        metalness: 0.82,
        roughness: 0.28,
      }),
    []
  );

  // Deep Glossy OLED Sapphire Glass
  const glassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#050709'),
        metalness: 0.1,
        roughness: 0.04,
      }),
    []
  );

  // Orange Digital Crown Accent
  const crownAccentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#EA580C'),
        metalness: 0.4,
        roughness: 0.3,
      }),
    []
  );

  // High-retention Ocean Loop / Fluororubber Strap Material (Minimalist Charcoal / Slate)
  const strapMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2A2E36'),
        metalness: 0.05,
        roughness: 0.84,
      }),
    []
  );

  // Titanium Buckle Ring
  const buckleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#A1A5AB'),
        metalness: 0.85,
        roughness: 0.22,
      }),
    []
  );

  const caseW = 38; // X
  const caseD = 44; // Z
  const caseH = 9.5; // Y
  const halfH = caseH / 2;

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {/* Contact Shadow Under Watch & Band */}
      <ItemContactShadow width={48} length={96} opacity={0.46} />

      {/* Strap Section - North side (running along -Z) */}
      <mesh
        material={strapMaterial}
        position={[0, 2.0, -38]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[22, 3.2, 36]} />
      </mesh>
      {/* North Strap Buckle Loop */}
      <mesh
        material={buckleMaterial}
        position={[0, 2.5, -46]}
        castShadow
      >
        <boxGeometry args={[23.5, 3.8, 4]} />
      </mesh>

      {/* Strap Section - South side (running along +Z) */}
      <mesh
        material={strapMaterial}
        position={[0, 2.0, 38]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[22, 3.2, 36]} />
      </mesh>

      {/* Main Watch Case Chassis */}
      <group position={[0, halfH + 1.2, 0]}>
        {/* Watch Unibody Block */}
        <mesh material={titaniumMaterial} castShadow receiveShadow>
          <boxGeometry args={[caseW, caseH, caseD]} />
        </mesh>

        {/* OLED Curved Display Top Glass */}
        <mesh
          material={glassMaterial}
          position={[0, halfH + 0.35, 0]}
          castShadow
        >
          <boxGeometry args={[caseW - 3.8, 0.7, caseD - 4.2]} />
        </mesh>

        {/* Subtle OLED Watchface Glow Accent Dot (Minimalist 12 o'clock indicator) */}
        <mesh
          position={[0, halfH + 0.72, -caseD / 2 + 5]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[1.2, 16]} />
          <meshBasicMaterial color="#38BDF8" toneMapped={false} />
        </mesh>

        {/* Activity Ring Subtle Graphic Glow Line */}
        <mesh
          position={[0, halfH + 0.72, 2]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[7.5, 9.0, 32]} />
          <meshBasicMaterial color="#10B981" toneMapped={false} transparent opacity={0.85} />
        </mesh>

        {/* Digital Crown (Right side, +X) */}
        <mesh
          material={titaniumMaterial}
          position={[caseW / 2 + 2.0, 1.5, -6]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[4.2, 4.2, 3.8, 24]} />
        </mesh>
        {/* Digital Crown Orange Center Dot */}
        <mesh
          material={crownAccentMaterial}
          position={[caseW / 2 + 4.0, 1.5, -6]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[2.5, 2.5, 0.4, 24]} />
        </mesh>

        {/* Flush Side Button (Right side, +X) */}
        <mesh
          material={titaniumMaterial}
          position={[caseW / 2 + 0.8, -1.8, 6]}
          castShadow
        >
          <boxGeometry args={[1.2, 3.2, 11]} />
        </mesh>
      </group>
    </group>
  );
};

// ==========================================
// 3. AIRPODS PRO CHARGING CASE WITH STATUS LED
// ==========================================

interface AirPodsProProps {
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
}

const AirPodsProCase: React.FC<AirPodsProProps> = ({
  position,
  rotationY = 0,
  scale = 1,
}) => {
  // Ultra-glossy Apple Porcelain White Material
  const caseMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FAFAFA'),
        roughness: 0.16,
        metalness: 0.03,
      }),
    []
  );

  // Chrome Rear Hinge Material
  const hingeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D8DBDF'),
        metalness: 0.92,
        roughness: 0.12,
      }),
    []
  );

  // Seam Line Dark Gap Material
  const seamMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#A0A4AA',
      }),
    []
  );

  const caseW = 54; // Width along X
  const caseD = 38; // Depth along Z
  const caseH = 19; // Height along Y
  const halfH = caseH / 2;

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {/* Soft Contact Shadow on Tray Floor */}
      <ItemContactShadow width={caseW + 12} length={caseD + 12} opacity={0.38} />

      {/* Main Case Body lying flat */}
      <group position={[0, halfH + 0.2, 0]}>
        {/* Bottom Body Half */}
        <mesh
          material={caseMaterial}
          position={[0, -2.5, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[caseW, caseH - 6.5, caseD]} />
        </mesh>

        {/* Top Lid Half */}
        <mesh
          material={caseMaterial}
          position={[0, halfH - 2.8, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[caseW, 5.2, caseD]} />
        </mesh>

        {/* Lid Seam Line Gap */}
        <mesh
          material={seamMaterial}
          position={[0, halfH - 5.5, 0]}
        >
          <boxGeometry args={[caseW + 0.2, 0.4, caseD + 0.2]} />
        </mesh>

        {/* Rear Metal Hinge (+Z side) */}
        <mesh
          material={hingeMaterial}
          position={[0, halfH - 5.5, caseD / 2 + 0.2]}
          castShadow
        >
          <boxGeometry args={[16, 3.2, 0.8]} />
        </mesh>

        {/* Front Subtle Status LED Dot (-Z side) */}
        <mesh position={[0, 0.5, -caseD / 2 - 0.1]}>
          <circleGeometry args={[0.75, 16]} />
          <meshBasicMaterial color="#34D399" toneMapped={false} />
        </mesh>

        {/* Subtle Local LED Light Glow */}
        <pointLight
          position={[0, 0.5, -caseD / 2 - 2]}
          color="#34D399"
          intensity={0.25}
          distance={20}
          decay={2}
        />

        {/* USB-C Connector Port Cutout (-X bottom side) */}
        <mesh
          position={[0, -halfH + 0.6, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[7.2, 2.6]} />
          <meshBasicMaterial color="#1E2024" />
        </mesh>
      </group>
    </group>
  );
};

// ==========================================
// 4. KEYRING WITH BRASS PILL FOB & EDC KEYS
// ==========================================

interface KeyringEDCProps {
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
}

const KeyringEDCProp: React.FC<KeyringEDCProps> = ({
  position,
  rotationY = 0,
  scale = 1,
}) => {
  // Titanium / Stainless Split Ring Material
  const ringSteelMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#CBD5E1'),
        metalness: 0.9,
        roughness: 0.24,
      }),
    []
  );

  // Machined Solid Brass Material (Pill Fob & Brass Key)
  const brassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D4AF37'),
        metalness: 0.92,
        roughness: 0.18,
      }),
    []
  );

  // Nickel-Plated EDC Key Material
  const nickelKeyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#94A3B8'),
        metalness: 0.92,
        roughness: 0.16,
      }),
    []
  );

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {/* Contact Shadow for Keyring Bundle */}
      <ItemContactShadow width={72} length={54} opacity={0.42} />

      {/* Split Keyring Torus lying flat on floor */}
      <mesh
        material={ringSteelMaterial}
        position={[-12, 1.4, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <torusGeometry args={[11, 1.3, 16, 40]} />
      </mesh>

      {/* Machined Brass Pill Fob */}
      <group position={[14, 4.6, -8]} rotation={[0, 0.2, 0]}>
        {/* Main Capsule Cylinder */}
        <mesh
          material={brassMaterial}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[4.5, 4.5, 26, 24]} />
        </mesh>
        {/* Rounded Front Cap */}
        <mesh
          material={brassMaterial}
          position={[13, 0, 0]}
          castShadow
        >
          <sphereGeometry args={[4.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        {/* Center Knurled Grip Band */}
        <mesh
          material={brassMaterial}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[4.7, 4.7, 7, 24]} />
        </mesh>
        {/* Tail Eyelet connecting to ring */}
        <mesh
          material={brassMaterial}
          position={[-15, 0, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <torusGeometry args={[3.2, 1.0, 12, 24]} />
        </mesh>
      </group>

      {/* Key 1: Solid Brass EDC House Key (Overlapping ring) */}
      <group position={[8, 1.8, 6]} rotation={[0, -0.32, 0]}>
        {/* Round Key Head with hole */}
        <mesh material={brassMaterial} castShadow>
          <cylinderGeometry args={[8.5, 8.5, 1.6, 24]} />
        </mesh>
        {/* Key Blade Shank */}
        <mesh
          material={brassMaterial}
          position={[19, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[24, 1.6, 6.2]} />
        </mesh>
        {/* Notched Serration Cuts along key blade */}
        <mesh material={brassMaterial} position={[14, 0, 3.4]} castShadow>
          <boxGeometry args={[3, 1.6, 1.8]} />
        </mesh>
        <mesh material={brassMaterial} position={[22, 0, 3.4]} castShadow>
          <boxGeometry args={[4, 1.6, 1.8]} />
        </mesh>
      </group>

      {/* Key 2: Brushed Nickel Office Key (Staggered beneath) */}
      <group position={[6, 0.9, 14]} rotation={[0, -0.08, 0]}>
        {/* Hex Key Head */}
        <mesh material={nickelKeyMaterial} castShadow>
          <cylinderGeometry args={[7.8, 7.8, 1.5, 6]} />
        </mesh>
        {/* Key Blade Shank */}
        <mesh
          material={nickelKeyMaterial}
          position={[18, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[22, 1.5, 5.8]} />
        </mesh>
        {/* Notched Cuts */}
        <mesh material={nickelKeyMaterial} position={[16, 0, 3.1]} castShadow>
          <boxGeometry args={[4, 1.5, 1.6]} />
        </mesh>
      </group>
    </group>
  );
};

// ==========================================
// 5. USB-C WOVEN BRAIDED CABLE & FLASH DRIVE
// ==========================================

interface UsbCableAndDriveProps {
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
}

const UsbCableAndDriveProp: React.FC<UsbCableAndDriveProps> = ({
  position,
  rotationY = 0,
  scale = 1,
}) => {
  // Anodized Aluminum Thumb Drive Material
  const metalDriveMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1F242C'),
        metalness: 0.85,
        roughness: 0.25,
      }),
    []
  );

  // Nickel USB-C Plug Shield Material
  const nickelPlugMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#CBD5E1'),
        metalness: 0.95,
        roughness: 0.1,
      }),
    []
  );

  // Woven Braided Fabric Cable Material
  const braidedCableMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#333842'),
        metalness: 0.08,
        roughness: 0.82,
      }),
    []
  );

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {/* Contact Shadow Under USB Gear */}
      <ItemContactShadow width={70} length={50} opacity={0.38} />

      {/* Part A: Coiled Braided USB-C Cable (Oval wound loops) */}
      <group position={[0, 2.2, -6]}>
        {/* Outer Loop */}
        <mesh
          material={braidedCableMaterial}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[1.3, 0.9, 1]}
          castShadow
        >
          <torusGeometry args={[18, 2.2, 16, 48]} />
        </mesh>
        {/* Inner Loop */}
        <mesh
          material={braidedCableMaterial}
          position={[0, 0.4, 0]}
          rotation={[Math.PI / 2, 0, 0.4]}
          scale={[1.1, 0.75, 1]}
          castShadow
        >
          <torusGeometry args={[14, 2.2, 16, 40]} />
        </mesh>
        {/* Cable Connector Boot */}
        <mesh
          material={metalDriveMaterial}
          position={[-18, 0, 10]}
          rotation={[0, 0.3, 0]}
          castShadow
        >
          <boxGeometry args={[6.5, 4.2, 14]} />
        </mesh>
        {/* Exposed USB-C Tip on Cable */}
        <mesh
          material={nickelPlugMaterial}
          position={[-19.5, 0, 19]}
          rotation={[0, 0.3, 0]}
          castShadow
        >
          <boxGeometry args={[4.8, 2.2, 6.5]} />
        </mesh>
      </group>

      {/* Part B: Anodized Aluminum Flash Drive / Dongle */}
      <group position={[4, 2.6, 12]} rotation={[0, -0.15, 0]}>
        {/* Drive Body Stick */}
        <mesh material={metalDriveMaterial} castShadow receiveShadow>
          <boxGeometry args={[28, 5.0, 12]} />
        </mesh>
        {/* Beveled Keyring Hole Ring at Tail */}
        <mesh
          material={metalDriveMaterial}
          position={[-14, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[4.5, 4.5, 4.6, 16]} />
        </mesh>
        {/* Micro Activity LED */}
        <mesh position={[4, 2.6, 0]}>
          <circleGeometry args={[0.6, 12]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
        {/* Nickel USB-C Male Plug extending from front */}
        <mesh
          material={nickelPlugMaterial}
          position={[17.5, 0, 0]}
          castShadow
        >
          <boxGeometry args={[7.2, 2.5, 7.8]} />
        </mesh>
      </group>
    </group>
  );
};

// ==========================================
// MAIN ORGANIZER GEAR LOADOUT COMPONENT
// ==========================================

export const OrganizerGearLoadout: React.FC<OrganizerGearLoadoutProps> = ({
  dimensions,
  visible = true,
}) => {
  const {
    length, // X-axis
    width,  // Z-axis
    height, // Y-axis
    wallThickness,
    bottomThickness,
    rows,
    cols,
  } = dimensions;

  // Compartment internal dimensions and spacing
  const innerLength = Math.max(10, length - 2 * wallThickness);
  const innerWidth = Math.max(10, width - 2 * wallThickness);
  const cellLength = Math.max(8, (innerLength - (cols - 1) * wallThickness) / cols);
  const cellWidth = Math.max(8, (innerWidth - (rows - 1) * wallThickness) / rows);

  // Floor level in local coordinate space: objects sit directly on tray floor
  const floorY = bottomThickness + 0.2;

  // Compute all individual compartment slots
  const slots = useMemo(() => {
    const list: Array<{
      id: string;
      c: number;
      r: number;
      centerX: number;
      centerZ: number;
      lenX: number;
      lenZ: number;
      aspectRatio: number;
    }> = [];

    for (let r = 0; r < rows; r++) {
      const centerZ = -innerWidth / 2 + r * (cellWidth + wallThickness) + cellWidth / 2;
      for (let c = 0; c < cols; c++) {
        const centerX = -innerLength / 2 + c * (cellLength + wallThickness) + cellLength / 2;
        list.push({
          id: `slot_${c}_${r}`,
          c,
          r,
          centerX,
          centerZ,
          lenX: cellLength,
          lenZ: cellWidth,
          aspectRatio: cellLength / cellWidth,
        });
      }
    }
    return list;
  }, [rows, cols, innerLength, innerWidth, cellLength, cellWidth, wallThickness]);

  if (!visible) return null;

  // Compute adaptive uniform scales to ensure items never clip through divider walls
  const penBaseLen = 130;
  const watchBaseSize = 65;
  const airPodsBaseSize = 55;
  const keysBaseSize = 65;
  const usbBaseSize = 58;

  // Height safety factor: items should remain comfortably lower than the tray walls
  const heightRatio = Math.min(1.0, (height * 0.85) / 18);

  return (
    <group name="EDCGearLoadout" position={[0, floorY, 0]}>
      {/* 
        CASE A: 1 Compartment (Single Catchall Tray)
        Stage all 5 curated items in an artistic desk EDC dump arrangement
      */}
      {slots.length === 1 && (() => {
        const slot = slots[0];
        const scale = Math.max(0.45, Math.min(0.95, (slot.lenX / 220) * heightRatio));

        return (
          <group position={[slot.centerX, 0, slot.centerZ]}>
            {/* 1. Pen along top / back */}
            <MachinedFountainPen
              position={[0, 0, -slot.lenZ * 0.28]}
              rotationY={0.04}
              scale={scale}
              slotLength={slot.lenX}
              slotWidth={slot.lenZ * 0.3}
            />
            {/* 2. Apple Watch on the left */}
            <SmartwatchProp
              position={[-slot.lenX * 0.25, 0, slot.lenZ * 0.08]}
              rotationY={0.12}
              scale={scale}
            />
            {/* 3. AirPods Pro in center-right */}
            <AirPodsProCase
              position={[slot.lenX * 0.24, 0, -slot.lenZ * 0.04]}
              rotationY={-0.15}
              scale={scale}
            />
            {/* 4. Keys in front-left */}
            <KeyringEDCProp
              position={[-slot.lenX * 0.14, 0, slot.lenZ * 0.26]}
              rotationY={0.25}
              scale={scale * 0.9}
            />
            {/* 5. USB-C drive & braided cable in front-right */}
            <UsbCableAndDriveProp
              position={[slot.lenX * 0.22, 0, slot.lenZ * 0.24]}
              rotationY={-0.2}
              scale={scale * 0.9}
            />
          </group>
        );
      })()}

      {/* 
        CASE B: 2 Compartments (e.g. 2x1 Catchall)
      */}
      {slots.length === 2 && (() => {
        const s0 = slots[0];
        const s1 = slots[1];
        const scale0 = Math.max(0.48, Math.min(1.0, (Math.min(s0.lenX, s0.lenZ) / 85) * heightRatio));
        const scale1 = Math.max(0.48, Math.min(1.0, (Math.min(s1.lenX, s1.lenZ) / 85) * heightRatio));

        return (
          <>
            {/* Slot 0: Watch & AirPods */}
            <group position={[s0.centerX, 0, s0.centerZ]}>
              <SmartwatchProp
                position={[-s0.lenX * 0.2, 0, 0]}
                rotationY={0.08}
                scale={scale0 * 0.9}
              />
              <AirPodsProCase
                position={[s0.lenX * 0.22, 0, 0]}
                rotationY={-0.12}
                scale={scale0 * 0.9}
              />
            </group>

            {/* Slot 1: Pen & EDC Keys & USB Drive */}
            <group position={[s1.centerX, 0, s1.centerZ]}>
              <MachinedFountainPen
                position={[0, 0, -s1.lenZ * 0.26]}
                rotationY={0.02}
                scale={scale1}
                slotLength={s1.lenX}
                slotWidth={s1.lenZ * 0.4}
              />
              <KeyringEDCProp
                position={[-s1.lenX * 0.2, 0, s1.lenZ * 0.18]}
                rotationY={0.2}
                scale={scale1 * 0.85}
              />
              <UsbCableAndDriveProp
                position={[s1.lenX * 0.2, 0, s1.lenZ * 0.18]}
                rotationY={-0.25}
                scale={scale1 * 0.85}
              />
            </group>
          </>
        );
      })()}

      {/* 
        CASE C: 3 Compartments
      */}
      {slots.length === 3 && (() => {
        return (
          <>
            {/* Slot 0: Pen */}
            <MachinedFountainPen
              position={[slots[0].centerX, 0, slots[0].centerZ]}
              rotationY={0.04}
              scale={Math.max(0.5, Math.min(1.05, (Math.max(slots[0].lenX, slots[0].lenZ) / penBaseLen) * 0.9))}
              slotLength={slots[0].lenX}
              slotWidth={slots[0].lenZ}
            />
            {/* Slot 1: Watch */}
            <SmartwatchProp
              position={[slots[1].centerX, 0, slots[1].centerZ]}
              rotationY={0.08}
              scale={Math.max(0.5, Math.min(1.05, (Math.min(slots[1].lenX, slots[1].lenZ) / watchBaseSize) * 0.85))}
            />
            {/* Slot 2: AirPods & Keys */}
            <group position={[slots[2].centerX, 0, slots[2].centerZ]}>
              <AirPodsProCase
                position={[-slots[2].lenX * 0.2, 0, 0]}
                rotationY={-0.1}
                scale={Math.max(0.48, Math.min(0.9, (Math.min(slots[2].lenX, slots[2].lenZ) / airPodsBaseSize) * 0.75))}
              />
              <KeyringEDCProp
                position={[slots[2].lenX * 0.22, 0, 0]}
                rotationY={0.25}
                scale={Math.max(0.48, Math.min(0.85, (Math.min(slots[2].lenX, slots[2].lenZ) / keysBaseSize) * 0.72))}
              />
            </group>
          </>
        );
      })()}

      {/* 
        CASE D: 4 Compartments
      */}
      {slots.length === 4 && (() => {
        return (
          <>
            {/* Slot 0: Pen */}
            <MachinedFountainPen
              position={[slots[0].centerX, 0, slots[0].centerZ]}
              rotationY={0.04}
              scale={Math.max(0.5, Math.min(1.05, (Math.max(slots[0].lenX, slots[0].lenZ) / penBaseLen) * 0.88))}
              slotLength={slots[0].lenX}
              slotWidth={slots[0].lenZ}
            />
            {/* Slot 1: Watch */}
            <SmartwatchProp
              position={[slots[1].centerX, 0, slots[1].centerZ]}
              rotationY={0.06}
              scale={Math.max(0.5, Math.min(1.05, (Math.min(slots[1].lenX, slots[1].lenZ) / watchBaseSize) * 0.85))}
            />
            {/* Slot 2: AirPods */}
            <AirPodsProCase
              position={[slots[2].centerX, 0, slots[2].centerZ]}
              rotationY={-0.08}
              scale={Math.max(0.5, Math.min(1.05, (Math.min(slots[2].lenX, slots[2].lenZ) / airPodsBaseSize) * 0.85))}
            />
            {/* Slot 3: Keyring & USB Drive */}
            <group position={[slots[3].centerX, 0, slots[3].centerZ]}>
              <KeyringEDCProp
                position={[-slots[3].lenX * 0.18, 0, 0]}
                rotationY={0.2}
                scale={Math.max(0.48, Math.min(0.9, (Math.min(slots[3].lenX, slots[3].lenZ) / keysBaseSize) * 0.75))}
              />
              <UsbCableAndDriveProp
                position={[slots[3].lenX * 0.22, 0, 0]}
                rotationY={-0.2}
                scale={Math.max(0.48, Math.min(0.85, (Math.min(slots[3].lenX, slots[3].lenZ) / usbBaseSize) * 0.72))}
              />
            </group>
          </>
        );
      })()}

      {/* 
        CASE E: 5 or more Compartments (e.g. 3x2, 3x3)
        Each item claims its own dedicated compartment for pure Grovemade/Apple luxury staging!
      */}
      {slots.length >= 5 && (() => {
        // Find most elongated slot for the pen
        let penSlotIdx = 0;
        let maxElongation = 0;
        slots.forEach((s, idx) => {
          const el = Math.max(s.aspectRatio, 1 / s.aspectRatio);
          if (el > maxElongation) {
            maxElongation = el;
            penSlotIdx = idx;
          }
        });

        // Remaining slot indices for other props
        const availableIdxs = slots.map((_, i) => i).filter((i) => i !== penSlotIdx);
        const sPen = slots[penSlotIdx];
        const sWatch = slots[availableIdxs[0]];
        const sAirPods = slots[availableIdxs[1]];
        const sKeys = slots[availableIdxs[2]];
        const sUsb = slots[availableIdxs[3]];

        const penScale = Math.max(0.5, Math.min(1.1, (Math.max(sPen.lenX, sPen.lenZ) / penBaseLen) * 0.88));
        const watchScale = Math.max(0.5, Math.min(1.08, (Math.min(sWatch.lenX, sWatch.lenZ) / watchBaseSize) * 0.85));
        const airPodsScale = Math.max(0.5, Math.min(1.08, (Math.min(sAirPods.lenX, sAirPods.lenZ) / airPodsBaseSize) * 0.88));
        const keysScale = Math.max(0.5, Math.min(1.05, (Math.min(sKeys.lenX, sKeys.lenZ) / keysBaseSize) * 0.82));
        const usbScale = Math.max(0.5, Math.min(1.05, (Math.min(sUsb.lenX, sUsb.lenZ) / usbBaseSize) * 0.82));

        return (
          <>
            {/* Slot 1: Machined Aluminum Fountain Pen */}
            <MachinedFountainPen
              position={[sPen.centerX, 0, sPen.centerZ]}
              rotationY={0.04}
              scale={penScale}
              slotLength={sPen.lenX}
              slotWidth={sPen.lenZ}
            />

            {/* Slot 2: Apple Watch Ultra with Ocean Loop Strap */}
            <SmartwatchProp
              position={[sWatch.centerX, 0, sWatch.centerZ]}
              rotationY={0.08}
              scale={watchScale}
            />

            {/* Slot 3: AirPods Pro Charging Case with Status LED */}
            <AirPodsProCase
              position={[sAirPods.centerX, 0, sAirPods.centerZ]}
              rotationY={-0.12}
              scale={airPodsScale}
            />

            {/* Slot 4: Keyring with Brass Pill Fob & EDC Keys */}
            <KeyringEDCProp
              position={[sKeys.centerX, 0, sKeys.centerZ]}
              rotationY={0.22}
              scale={keysScale}
            />

            {/* Slot 5: USB-C Woven Braided Cable & Flash Drive */}
            <UsbCableAndDriveProp
              position={[sUsb.centerX, 0, sUsb.centerZ]}
              rotationY={-0.18}
              scale={usbScale}
            />
          </>
        );
      })()}
    </group>
  );
};
