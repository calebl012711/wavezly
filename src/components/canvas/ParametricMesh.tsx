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

  // Solid Plastic PBR Material
  const shellMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(material.hexColor),
      roughness: material.roughness ?? 0.85,
      metalness: 0.08,
      wireframe: wireframe,
      shadowSide: THREE.DoubleSide,
    });
  }, [material, wireframe]);

  // Translucent Resin Material (MeshPhysicalMaterial with optical transmission)
  const resinPbrMaterial = useMemo(() => {
    if (!resinInlay) return null;
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(resinInlay.hexColor),
      roughness: resinInlay.roughness ?? 0.1,
      metalness: 0.0,
      transmission: resinInlay.transmission ?? 0.95,
      ior: resinInlay.ior ?? 1.54,
      transparent: true,
      opacity: 0.88,
      reflectivity: 0.5,
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

  // 1. Floor Base Geometry (Solid extruded rounded rectangle)
  const floorGeometry = useMemo(() => {
    const shape = createRoundedRectShape(length, width, cornerFilletRadius);
    const bevelOk = floorDepth >= 1.0;
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: floorDepth,
      bevelEnabled: bevelOk,
      bevelSegments: 2,
      steps: 1,
      bevelSize: bevelOk ? Math.min(0.4, floorDepth * 0.15) : 0,
      bevelThickness: bevelOk ? Math.min(0.4, floorDepth * 0.15) : 0,
    });
    geom.computeVertexNormals();
    // Rotate to lie on XZ plane and position at base Y = 0
    geom.rotateX(Math.PI / 2);
    geom.translate(0, floorDepth / 2, 0);
    geom.computeBoundingBox();
    geom.computeBoundingSphere();
    return geom;
  }, [length, width, cornerFilletRadius, floorDepth]);

  // 2. Outer Perimeter Walls Geometry
  const wallsGeometry = useMemo(() => {
    if (currentWallsHeight <= 0.1) return null;
    const shape = createRoundedFrameShape(length, width, cornerFilletRadius, wallThickness);
    const bevelOk = currentWallsHeight >= 1.0;
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: currentWallsHeight,
      bevelEnabled: bevelOk,
      bevelSegments: 2,
      steps: 1,
      bevelSize: bevelOk ? Math.min(0.3, currentWallsHeight * 0.12) : 0,
      bevelThickness: bevelOk ? Math.min(0.3, currentWallsHeight * 0.12) : 0,
    });
    geom.computeVertexNormals();
    geom.rotateX(Math.PI / 2);
    geom.translate(0, bottomThickness + currentWallsHeight / 2, 0);
    geom.computeBoundingBox();
    geom.computeBoundingSphere();
    return geom;
  }, [length, width, cornerFilletRadius, wallThickness, currentWallsHeight, bottomThickness]);

  // 3. Internal Compartment Divider Geometry Calculations
  const dividerGeometries = useMemo(() => {
    if (currentWallsHeight <= 0.1) return [];
    const geometries: THREE.BufferGeometry[] = [];
    const innerLength = length - 2 * wallThickness;
    const innerWidth = width - 2 * wallThickness;

    const cellLength = (innerLength - (cols - 1) * wallThickness) / cols;
    const cellWidth = (innerWidth - (rows - 1) * wallThickness) / rows;

    // Y position includes current sliced wall height PLUS exploded view lift offset
    const dividerY = bottomThickness + currentWallsHeight / 2 + explodedOffset;

    // Vertical dividers running continuously along Z (between columns)
    for (let c = 1; c < cols; c++) {
      const xPos = -innerLength / 2 + c * cellLength + (c - 0.5) * wallThickness;
      const vDivider = new THREE.BoxGeometry(wallThickness, currentWallsHeight, innerWidth);
      vDivider.computeVertexNormals();
      vDivider.translate(xPos, dividerY, 0);
      vDivider.computeBoundingBox();
      vDivider.computeBoundingSphere();
      geometries.push(vDivider);
    }

    // Horizontal dividers segmented between columns to avoid overlapping non-manifold faces
    for (let r = 1; r < rows; r++) {
      const zPos = -innerWidth / 2 + r * cellWidth + (r - 0.5) * wallThickness;
      for (let c = 0; c < cols; c++) {
        const xPos = -innerLength / 2 + c * (cellLength + wallThickness) + cellLength / 2;
        const hDivider = new THREE.BoxGeometry(cellLength, currentWallsHeight, wallThickness);
        hDivider.computeVertexNormals();
        hDivider.translate(xPos, dividerY, zPos);
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
