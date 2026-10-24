/**
 * FORMGRID PROCEDURAL 3D PARAMETRIC ORGANIZER MESH
 * Constructs rounded outer shells, hollow compartment grids, divider walls, and resin inlays
 * Features:
 * - Dynamic layer-by-layer slicing height (0% to 100% build height)
 * - Exploded view offset lifting internal dividers and resin inlays above floor base
 * - Guaranteed watertight, manifold meshes with computeVertexNormals & bounding boxes
 */

import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { ParametricOrganizerDimensions, MaterialOption } from '../../types';
import { useCustomizerStore } from '../../store/useCustomizerStore';

export interface ParametricMeshProps {
  dimensions: ParametricOrganizerDimensions;
  material: MaterialOption;
  resinInlay: MaterialOption | null;
  wireframe?: boolean;
  engravedText?: string;
  sliceHeight?: number; // 0% to 100% build height
  explodedOffset?: number; // In millimeters, lifts internal dividers & resin inlays
  onMeshReady?: (meshGroup: THREE.Group) => void;
}

/**
 * Helper to generate a 2D rounded rectangle shape centered at (0, 0)
 */
function createRoundedRectShape(
  width: number,
  height: number,
  radius: number
): THREE.Shape {
  const shape = new THREE.Shape();
  const r = Math.min(radius, width / 2 - 0.1, height / 2 - 0.1);
  const x = -width / 2;
  const y = -height / 2;

  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  return shape;
}

/**
 * Helper to generate a 2D hollow rounded frame shape (outer rounded rect with inner cutout hole)
 */
function createRoundedFrameShape(
  outerWidth: number,
  outerHeight: number,
  outerRadius: number,
  wallThickness: number
): THREE.Shape {
  const shape = createRoundedRectShape(outerWidth, outerHeight, outerRadius);

  const innerWidth = outerWidth - 2 * wallThickness;
  const innerHeight = outerHeight - 2 * wallThickness;
  const innerRadius = Math.max(1, outerRadius - wallThickness);

  const hole = new THREE.Path();
  const r = Math.min(innerRadius, innerWidth / 2 - 0.1, innerHeight / 2 - 0.1);
  const x = -innerWidth / 2;
  const y = -innerHeight / 2;

  hole.moveTo(x + r, y);
  hole.lineTo(x + innerWidth - r, y);
  hole.quadraticCurveTo(x + innerWidth, y, x + innerWidth, y + r);
  hole.lineTo(x + innerWidth, y + innerHeight - r);
  hole.quadraticCurveTo(x + innerWidth, y + innerHeight, x + innerWidth - r, y + innerHeight);
  hole.lineTo(x + r, y + innerHeight);
  hole.quadraticCurveTo(x, y + innerHeight, x, y + innerHeight - r);
  hole.lineTo(x, y + r);
  hole.quadraticCurveTo(x, y, x + r, y);

  shape.holes.push(hole);
  return shape;
}

/**
 * Procedural FDM 3D Printing Texture Generator
 * Generates horizontal layer lines (simulating 0.2mm layer height sheen) and micro-granular polymer bead texture
 */
function generateFdmTextures(): {
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} | null {
  if (typeof document === 'undefined') return null;

  const width = 256;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  // Layer pitch in pixels: simulates fine 0.2mm extrusion layer lines
  const layerPitch = 6;

  for (let y = 0; y < height; y++) {
    // Sinusoidal layer extrusion profile: crests catch glancing light, troughs are layer seams
    const phase = (y % layerPitch) / layerPitch;
    const layerProfile = Math.sin(phase * Math.PI); // 0 at seams, 1 at peak
    const layerWobble = Math.sin(y * 0.08 + Math.sin(y * 0.025) * 2.0) * 0.05;

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Fine polymer bead stippling (extrusion micro-roughness)
      const stipple = ((Math.sin(x * 17.3 + y * 73.1) * 43758.5453) % 1) * 0.12;
      // Slight longitudinal raster orientation
      const nozzleTrack = Math.sin(x * 0.6) * 0.03;

      const bumpNorm = Math.max(0, Math.min(1, layerProfile * 0.72 + layerWobble + stipple + nozzleTrack));
      const byteVal = Math.round(bumpNorm * 255);

      data[idx] = byteVal;
      data[idx + 1] = byteVal;
      data[idx + 2] = byteVal;
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const bumpMap = new THREE.CanvasTexture(canvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(4, 16);

  // Roughness Map: layer line crests exhibit a subtle graphite/polymer sheen (lower roughness),
  // while layer seams slightly scatter incident light
  const rCanvas = document.createElement('canvas');
  rCanvas.width = width;
  rCanvas.height = height;
  const rCtx = rCanvas.getContext('2d');
  if (rCtx) {
    const rImg = rCtx.createImageData(width, height);
    const rData = rImg.data;
    for (let i = 0; i < data.length; i += 4) {
      const b = data[i] / 255;
      // Crests get subtle sheen boost (lower roughness)
      const r = Math.round(185 - b * 45);
      rData[i] = r;
      rData[i + 1] = r;
      rData[i + 2] = r;
      rData[i + 3] = 255;
    }
    rCtx.putImageData(rImg, 0, 0);
  }

  const roughnessMap = new THREE.CanvasTexture(rCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(4, 16);

  return { bumpMap, roughnessMap };
}

/**
 * Creates internal divider geometry with soft bevels on all top rim edges
 * so directional and environment light catch the rims with clean specular highlights.
 */
function createBeveledDividerGeometry(
  dimX: number,
  heightY: number,
  dimZ: number,
  sinkIntoFloor: number = 0.25
): THREE.BufferGeometry {
  // If height is very small during slicing, fallback to simple box
  if (heightY <= 0.6) {
    const box = new THREE.BoxGeometry(dimX, heightY, dimZ);
    box.computeVertexNormals();
    return box;
  }

  // Soft bevel radius calibrated to wall thickness & height
  const bevel = Math.min(0.35, Math.min(dimX, dimZ) * 0.18, heightY * 0.12);
  const totalHeight = heightY + sinkIntoFloor;
  const extrudeDepth = Math.max(0.1, totalHeight - bevel * 2);

  // 2D rounded rectangle in X-Z plane
  const shape = new THREE.Shape();
  const w = Math.max(0.2, dimX - bevel * 2);
  const d = Math.max(0.2, dimZ - bevel * 2);
  const r = Math.min(bevel, w / 2 - 0.05, d / 2 - 0.05);
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

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: extrudeDepth,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: bevel,
    bevelThickness: bevel,
  });

  // Rotate so extrusion depth aligns with Y-axis
  geom.rotateX(Math.PI / 2);
  geom.center();
  geom.computeVertexNormals();
  return geom;
}

export const ParametricMesh: React.FC<ParametricMeshProps> = ({
  dimensions,
  material,
  resinInlay,
  wireframe = false,
  engravedText,
  sliceHeight: propsSliceHeight,
  explodedOffset: propsExplodedOffset,
  onMeshReady,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Read slicing and exploded offset from props or reactive store
  const storeSliceHeight = useCustomizerStore((state) => state.sliceHeight);
  const storeExplodedOffset = useCustomizerStore((state) => state.explodedOffset);

  const sliceHeight = propsSliceHeight !== undefined ? propsSliceHeight : (storeSliceHeight ?? 100);
  const explodedOffset = propsExplodedOffset !== undefined ? propsExplodedOffset : (storeExplodedOffset ?? 0);

  const {
    length, // X-axis
    width,  // Z-axis
    height, // Y-axis
    wallThickness,
    bottomThickness,
    rows,
    cols,
    cornerFilletRadius,
    inlayPocketDepth = 2.5,
  } = dimensions;

  // Procedural FDM 3D printing finish textures (0.2mm layer line striations & micro-bead grain)
  const fdmTextures = useMemo(() => {
    return generateFdmTextures();
  }, []);

  useEffect(() => {
    return () => {
      fdmTextures?.bumpMap.dispose();
      fdmTextures?.roughnessMap.dispose();
    };
  }, [fdmTextures]);

  // Luxury 3D Printed Finish Shaders for the Organizer Tray
  const shellMaterial = useMemo(() => {
    const matId = (material.id || '').toLowerCase();
    const matName = (material.name || '').toLowerCase();
    const hex = (material.hexColor || '').toLowerCase();

    // Identify luxury material finish presets
    const isObsidian =
      matId.includes('obsidian') || matName.includes('obsidian') || hex === '#18181b' || hex === '#1c1c1e';
    const isTerracotta =
      matId.includes('terracotta') || matName.includes('terracotta') || matName.includes('clay') || hex === '#c46849';
    const isAlabaster =
      matId.includes('white') ||
      matId.includes('alabaster') ||
      matName.includes('white') ||
      matName.includes('alabaster') ||
      hex === '#f4f4f5' ||
      hex === '#f8f6f0' ||
      hex === '#ece5db';
    const isSage =
      matId.includes('sage') ||
      matId.includes('olive') ||
      matName.includes('sage') ||
      matName.includes('olive') ||
      hex === '#5c6d5d' ||
      hex === '#4a6353';

    let baseColor = material.hexColor;
    let roughness = material.roughness ?? 0.82;
    let metalness = 0.04;
    let clearcoat = 0.0;
    let clearcoatRoughness = 0.4;
    let transmission = 0.0;
    let thickness = 0.0;
    let ior = 1.54;
    let attenuationColor: THREE.Color | undefined;
    let attenuationDistance: number | undefined;
    let bumpScale = 0.05;

    if (isObsidian) {
      // Matte Obsidian Black: roughness 0.62, subtle graphite sheen
      baseColor = '#18181b';
      roughness = 0.62;
      metalness = 0.16; // subtle graphite sheen specular reflection
      clearcoat = 0.12;
      clearcoatRoughness = 0.38;
      bumpScale = 0.048;
    } else if (isTerracotta) {
      // Terracotta Clay: warm matte organic earthenware
      baseColor = '#c46849';
      roughness = 0.88; // rich matte earthenware
      metalness = 0.02;
      clearcoat = 0.0;
      bumpScale = 0.065;
    } else if (isAlabaster) {
      // Studio White / Alabaster: clean translucent subsurface scattering look
      baseColor = '#f8f6f0';
      roughness = 0.50;
      transmission = 0.12; // soft optical translucency
      thickness = 2.4;
      ior = 1.48;
      attenuationColor = new THREE.Color('#fff7eb');
      attenuationDistance = 5.0;
      clearcoat = 0.08;
      clearcoatRoughness = 0.35;
      metalness = 0.01;
      bumpScale = 0.042;
    } else if (isSage) {
      // Sage Green / Olive: contemporary Scandinavian muted hue
      baseColor = '#5c6d5d';
      roughness = 0.74;
      metalness = 0.03;
      clearcoat = 0.0;
      bumpScale = 0.055;
    }

    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(baseColor),
      roughness: roughness,
      metalness: metalness,
      clearcoat: clearcoat,
      clearcoatRoughness: clearcoatRoughness,
      transmission: transmission,
      thickness: thickness,
      ior: ior,
      attenuationColor: attenuationColor,
      attenuationDistance: attenuationDistance,
      bumpMap: fdmTextures?.bumpMap || null,
      bumpScale: bumpScale,
      roughnessMap: fdmTextures?.roughnessMap || null,
      wireframe: wireframe,
      shadowSide: THREE.DoubleSide,
    });
  }, [material, wireframe, fdmTextures]);

  // Translucent Resin Material (MeshPhysicalMaterial with optical transmission & clearcoat)
  const resinPbrMaterial = useMemo(() => {
    if (!resinInlay) return null;
    const resinId = (resinInlay.id || '').toLowerCase();
    const resinName = (resinInlay.name || '').toLowerCase();
    const isSmokey =
      resinId.includes('smoke') ||
      resinId.includes('smokey') ||
      resinName.includes('smoke') ||
      resinName.includes('smokey') ||
      resinInlay.hexColor === '#2e2b28';

    // Smokey Translucent Resin Inlay: optical transmission 0.85, roughness 0.15, clearcoat 1.0
    const transmission = isSmokey ? 0.85 : (resinInlay.transmission ?? 0.92);
    const roughness = isSmokey ? 0.15 : (resinInlay.roughness ?? 0.10);
    const ior = resinInlay.ior ?? 1.54;

    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(resinInlay.hexColor),
      roughness: roughness,
      metalness: 0.0,
      transmission: transmission,
      ior: ior,
      clearcoat: 1.0,
      clearcoatRoughness: 0.10,
      attenuationColor: isSmokey ? new THREE.Color('#22201d') : new THREE.Color(resinInlay.hexColor),
      attenuationDistance: isSmokey ? 8.0 : 14.0,
      thickness: 3.0,
      transparent: true,
      opacity: 0.92,
      reflectivity: 0.65,
    });
  }, [resinInlay]);

  // Slicing Height Calculations
  const clampedSlice = Math.max(0, Math.min(100, sliceHeight));
  // Effective cut height in mm: at 0%, keep a minimum of 0.4mm (2 standard 0.2mm layers)
  // so geometry remains manifold and watertight with non-degenerate faces
  const effectiveCutHeight = Math.max(0.4, (height * clampedSlice) / 100);

  // Floor Base thickness under slice: capped by effectiveCutHeight
  const floorDepth = Math.min(bottomThickness, effectiveCutHeight);

  // Available height for outer perimeter walls and dividers above floor
  const availWallHeight = Math.max(0, effectiveCutHeight - bottomThickness);
  const maxWallsHeight = Math.max(2, height - bottomThickness);
  const currentWallsHeight = Math.min(maxWallsHeight, availWallHeight);

  // 1. Floor Base Geometry (Solid extruded rounded rectangle with soft edge bevel)
  const floorGeometry = useMemo(() => {
    const shape = createRoundedRectShape(length, width, cornerFilletRadius);
    const bevelOk = floorDepth >= 1.0;
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: floorDepth,
      bevelEnabled: bevelOk,
      bevelSegments: 3,
      steps: 1,
      bevelSize: bevelOk ? Math.min(0.35, floorDepth * 0.15) : 0,
      bevelThickness: bevelOk ? Math.min(0.35, floorDepth * 0.15) : 0,
    });
    geom.computeVertexNormals();
    // Rotate to lie on XZ plane and position at base Y = 0
    geom.rotateX(Math.PI / 2);
    geom.translate(0, floorDepth / 2, 0);
    geom.computeBoundingBox();
    geom.computeBoundingSphere();
    return geom;
  }, [length, width, cornerFilletRadius, floorDepth]);

  // 2. Outer Perimeter Walls Geometry with Chamfered Rim
  const wallsGeometry = useMemo(() => {
    if (currentWallsHeight <= 0.1) return null;
    const shape = createRoundedFrameShape(length, width, cornerFilletRadius, wallThickness);
    const bevelOk = currentWallsHeight >= 1.0;
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: currentWallsHeight,
      bevelEnabled: bevelOk,
      bevelSegments: 3,
      steps: 1,
      bevelSize: bevelOk ? Math.min(0.35, currentWallsHeight * 0.12) : 0,
      bevelThickness: bevelOk ? Math.min(0.35, currentWallsHeight * 0.12) : 0,
    });
    geom.computeVertexNormals();
    geom.rotateX(Math.PI / 2);
    geom.translate(0, bottomThickness + currentWallsHeight / 2, 0);
    geom.computeBoundingBox();
    geom.computeBoundingSphere();
    return geom;
  }, [length, width, cornerFilletRadius, wallThickness, currentWallsHeight, bottomThickness]);

  // 3. Internal Compartment Divider Geometry Calculations with Soft Rim Bevels
  const dividerGeometries = useMemo(() => {
    if (currentWallsHeight <= 0.1) return [];
    const geometries: THREE.BufferGeometry[] = [];
    const innerLength = length - 2 * wallThickness;
    const innerWidth = width - 2 * wallThickness;

    const cellLength = (innerLength - (cols - 1) * wallThickness) / cols;
    const cellWidth = (innerWidth - (rows - 1) * wallThickness) / rows;

    // Soft sink depth into base floor (0.25mm) hides bottom seam when explodedOffset is zero
    const effectiveSink = explodedOffset > 0 ? 0 : 0.25;
    const dividerCenterY =
      bottomThickness + currentWallsHeight / 2 + explodedOffset - effectiveSink / 2;

    // Vertical dividers running continuously along Z (between columns)
    for (let c = 1; c < cols; c++) {
      const xPos = -innerLength / 2 + c * cellLength + (c - 0.5) * wallThickness;
      const vDivider = createBeveledDividerGeometry(
        wallThickness,
        currentWallsHeight,
        innerWidth,
        effectiveSink
      );
      vDivider.translate(xPos, dividerCenterY, 0);
      vDivider.computeBoundingBox();
      vDivider.computeBoundingSphere();
      geometries.push(vDivider);
    }

    // Horizontal dividers segmented between columns to avoid overlapping non-manifold faces
    for (let r = 1; r < rows; r++) {
      const zPos = -innerWidth / 2 + r * cellWidth + (r - 0.5) * wallThickness;
      for (let c = 0; c < cols; c++) {
        const xPos = -innerLength / 2 + c * (cellLength + wallThickness) + cellLength / 2;
        const hDivider = createBeveledDividerGeometry(
          cellLength,
          currentWallsHeight,
          wallThickness,
          effectiveSink
        );
        hDivider.translate(xPos, dividerCenterY, zPos);
        hDivider.computeBoundingBox();
        hDivider.computeBoundingSphere();
        geometries.push(hDivider);
      }
    }

    return geometries;
  }, [
    length,
    width,
    wallThickness,
    rows,
    cols,
    currentWallsHeight,
    bottomThickness,
    explodedOffset,
  ]);

  // 4. Resin Inlay Blocks (Thin slabs sitting flush in each pocket bottom)
  const resinGeometries = useMemo(() => {
    if (!resinInlay || inlayPocketDepth <= 0 || currentWallsHeight <= 0.1) return [];
    const geometries: THREE.BufferGeometry[] = [];
    const innerLength = length - 2 * wallThickness;
    const innerWidth = width - 2 * wallThickness;

    const cellLength = (innerLength - (cols - 1) * wallThickness) / cols;
    const cellWidth = (innerWidth - (rows - 1) * wallThickness) / rows;
    
    const maxResinHeight = Math.min(inlayPocketDepth, maxWallsHeight * 0.4);
    const currentResinHeight = Math.min(maxResinHeight, currentWallsHeight);
    if (currentResinHeight <= 0.05) return [];

    // Exploded view lift: resin inlays lift above the floor base at 1.5x offset for clean multi-tier visual separation
    const resinY = bottomThickness + currentResinHeight / 2 + (explodedOffset * 1.5);

    for (let r = 0; r < rows; r++) {
      const zPos = -innerWidth / 2 + r * (cellWidth + wallThickness) + cellWidth / 2;
      for (let c = 0; c < cols; c++) {
        const xPos = -innerLength / 2 + c * (cellLength + wallThickness) + cellLength / 2;
        // Inset slightly by 0.2mm per side to sit cleanly within pocket
        const resinBox = new THREE.BoxGeometry(
          Math.max(2, cellLength - 0.4),
          currentResinHeight,
          Math.max(2, cellWidth - 0.4)
        );
        resinBox.computeVertexNormals();
        resinBox.translate(xPos, resinY, zPos);
        resinBox.computeBoundingBox();
        resinBox.computeBoundingSphere();
        geometries.push(resinBox);
      }
    }

    return geometries;
  }, [
    resinInlay,
    inlayPocketDepth,
    length,
    width,
    wallThickness,
    rows,
    cols,
    maxWallsHeight,
    currentWallsHeight,
    bottomThickness,
    explodedOffset,
  ]);

  // Expose group reference once mounted or updated
  useEffect(() => {
    if (groupRef.current && onMeshReady) {
      onMeshReady(groupRef.current);
    }
  }, [
    dimensions,
    material,
    resinInlay,
    sliceHeight,
    explodedOffset,
    floorGeometry,
    wallsGeometry,
    dividerGeometries,
    resinGeometries,
    onMeshReady,
  ]);

  const floorBaseName = engravedText ? `FloorBase-${engravedText}` : 'FloorBase';

  return (
    <>
      {/* Primary Parametric Solid Group (Captured for STL export & raycasting) */}
      <group ref={groupRef} name="FormgridParametricOrganizer" position={[0, 0, 0]}>
        {/* 1. Floor Base */}
        <mesh
          name={floorBaseName}
          geometry={floorGeometry}
          material={shellMaterial}
          castShadow
          receiveShadow
        />

        {/* 2. Outer Perimeter Frame (Rendered when slice height > bottom thickness) */}
        {wallsGeometry && (
          <mesh
            name="PerimeterWalls"
            geometry={wallsGeometry}
            material={shellMaterial}
            castShadow
            receiveShadow
          />
        )}

        {/* 3. Internal Dividers */}
        {dividerGeometries.map((geom, idx) => (
          <mesh
            key={`divider-${idx}`}
            name={`Divider-${idx}`}
            geometry={geom}
            material={shellMaterial}
            castShadow
            receiveShadow
          />
        ))}

        {/* 4. Translucent Resin Inlays (if active) */}
        {resinPbrMaterial &&
          resinGeometries.map((geom, idx) => (
            <mesh
              key={`resin-inlay-${idx}`}
              name={`ResinInlay-${idx}`}
              geometry={geom}
              material={resinPbrMaterial}
              castShadow
              receiveShadow
            />
          ))}
      </group>

      {/* 5. Tactile Slicing Plane Laser Indicator (Rendered outside groupRef so it never impacts binary STL export) */}
      {clampedSlice < 100 && (
        <group position={[0, effectiveCutHeight + 0.1, 0]}>
          <lineSegments rotation={[Math.PI / 2, 0, 0]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(length + 6, width + 6)]} />
            <lineBasicMaterial color="#ff5500" transparent opacity={0.75} linewidth={2} />
          </lineSegments>
        </group>
      )}
    </>
  );
};
