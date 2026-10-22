/**
 * FORMGRID PROCEDURAL 3D PARAMETRIC ORGANIZER MESH
 * Constructs rounded outer shells, hollow compartment grids, divider walls, and resin inlays
 */

import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { ParametricOrganizerDimensions, MaterialOption } from '../../types';

interface ParametricMeshProps {
  dimensions: ParametricOrganizerDimensions;
  material: MaterialOption;
  resinInlay: MaterialOption | null;
  wireframe?: boolean;
  engravedText?: string;
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
  onMeshReady,
}) => {
  const groupRef = useRef<THREE.Group>(null);

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

  // Floor Base Geometry (Solid extruded rounded rectangle)
  const floorGeometry = useMemo(() => {
    const shape = createRoundedRectShape(length, width, cornerFilletRadius);
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: bottomThickness,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.4,
      bevelThickness: 0.4,
    });
    geom.computeVertexNormals();
    // Rotate to lie on XZ plane and position at base Y = 0
    geom.rotateX(Math.PI / 2);
    geom.translate(0, bottomThickness / 2, 0);
    return geom;
  }, [length, width, cornerFilletRadius, bottomThickness]);

  // Outer Perimeter Walls Geometry
  const wallsHeight = Math.max(2, height - bottomThickness);
  const wallsGeometry = useMemo(() => {
    const shape = createRoundedFrameShape(length, width, cornerFilletRadius, wallThickness);
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: wallsHeight,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.3,
      bevelThickness: 0.3,
    });
    geom.computeVertexNormals();
    geom.rotateX(Math.PI / 2);
    geom.translate(0, bottomThickness + wallsHeight / 2, 0);
    return geom;
  }, [length, width, cornerFilletRadius, wallThickness, wallsHeight, bottomThickness]);

  // Internal Compartment Divider Geometry Calculations
  const dividerGeometries = useMemo(() => {
    const geometries: THREE.BufferGeometry[] = [];
    const innerLength = length - 2 * wallThickness;
    const innerWidth = width - 2 * wallThickness;

    const cellLength = (innerLength - (cols - 1) * wallThickness) / cols;
    const cellWidth = (innerWidth - (rows - 1) * wallThickness) / rows;

    // Vertical dividers running continuously along Z (between columns)
    for (let c = 1; c < cols; c++) {
      const xPos = -innerLength / 2 + c * cellLength + (c - 0.5) * wallThickness;
      const vDivider = new THREE.BoxGeometry(wallThickness, wallsHeight, innerWidth);
      vDivider.computeVertexNormals();
      vDivider.translate(xPos, bottomThickness + wallsHeight / 2, 0);
      geometries.push(vDivider);
    }

    // Horizontal dividers segmented between columns to avoid intersecting overlapping non-manifold faces
    for (let r = 1; r < rows; r++) {
      const zPos = -innerWidth / 2 + r * cellWidth + (r - 0.5) * wallThickness;
      for (let c = 0; c < cols; c++) {
        const xPos = -innerLength / 2 + c * (cellLength + wallThickness) + cellLength / 2;
        const hDivider = new THREE.BoxGeometry(cellLength, wallsHeight, wallThickness);
        hDivider.computeVertexNormals();
        hDivider.translate(xPos, bottomThickness + wallsHeight / 2, zPos);
        geometries.push(hDivider);
      }
    }

    return geometries;
  }, [length, width, wallThickness, rows, cols, wallsHeight, bottomThickness]);

  // Resin Inlay Blocks (Thin slabs sitting flush in each pocket bottom)
  const resinGeometries = useMemo(() => {
    if (!resinInlay || inlayPocketDepth <= 0) return [];
    const geometries: THREE.BufferGeometry[] = [];
    const innerLength = length - 2 * wallThickness;
    const innerWidth = width - 2 * wallThickness;

    const cellLength = (innerLength - (cols - 1) * wallThickness) / cols;
    const cellWidth = (innerWidth - (rows - 1) * wallThickness) / rows;
    const actualResinHeight = Math.min(inlayPocketDepth, wallsHeight * 0.4);

    for (let r = 0; r < rows; r++) {
      const zPos = -innerWidth / 2 + r * (cellWidth + wallThickness) + cellWidth / 2;
      for (let c = 0; c < cols; c++) {
        const xPos = -innerLength / 2 + c * (cellLength + wallThickness) + cellLength / 2;
        // Inset slightly by 0.2mm to sit cleanly within pocket
        const resinBox = new THREE.BoxGeometry(
          Math.max(2, cellLength - 0.4),
          actualResinHeight,
          Math.max(2, cellWidth - 0.4)
        );
        resinBox.computeVertexNormals();
        resinBox.translate(xPos, bottomThickness + actualResinHeight / 2, zPos);
        geometries.push(resinBox);
      }
    }

    return geometries;
  }, [resinInlay, inlayPocketDepth, length, width, wallThickness, rows, cols, wallsHeight, bottomThickness]);

  // Expose group reference once mounted or updated
  useEffect(() => {
    if (groupRef.current && onMeshReady) {
      onMeshReady(groupRef.current);
    }
  }, [dimensions, material, resinInlay, onMeshReady]);

  const floorBaseName = engravedText ? `FloorBase-${engravedText}` : 'FloorBase';

  return (
    <group ref={groupRef} name="FormgridParametricOrganizer" position={[0, 0, 0]}>
      {/* 1. Floor Base */}
      <mesh
        name={floorBaseName}
        geometry={floorGeometry}
        material={shellMaterial}
        castShadow
        receiveShadow
      />

      {/* 2. Outer Perimeter Frame */}
      <mesh
        name="PerimeterWalls"
        geometry={wallsGeometry}
        material={shellMaterial}
        castShadow
        receiveShadow
      />

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
  );
};
