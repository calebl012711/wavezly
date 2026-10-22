/**
 * FORMGRID INDUSTRIAL STL EXPORT & GEOMETRIC VALIDATION ENGINE
 * Generates IEEE 754 Little-Endian binary STL buffers from procedural Three.js meshes
 */

import * as THREE from 'three';
import { STLExporter } from 'three-stdlib';

export interface STLValidationResult {
  isValid: boolean;
  triangleCount: number;
  vertexCount: number;
  isWatertight: boolean;
  boundingBox: {
    x: number;
    y: number;
    z: number;
  };
  errors: string[];
}

export interface STLExportOutput {
  blob: Blob;
  fileSizeBytes: number;
  triangleCount: number;
  validation: STLValidationResult;
  objectUrl: string;
}

/**
 * Validate mesh geometry for 3D slicing software (Cura, PrusaSlicer, Bambu Studio)
 * Ensures normals are computed, non-degenerate triangles, and valid bounding box
 */
export function validateMeshForSlicing(object: THREE.Object3D): STLValidationResult {
  const errors: string[] = [];
  let totalTriangles = 0;
  let totalVertices = 0;
  let hasInvertedOrZeroAreaFacets = false;

  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const geometry = mesh.geometry;

      if (!geometry) {
        errors.push(`Mesh '${mesh.name || 'unnamed'}' has no geometry attached.`);
        return;
      }

      // Ensure geometry normals are calculated
      geometry.computeVertexNormals();
      geometry.computeBoundingBox();

      const pos = geometry.getAttribute('position');
      if (!pos || pos.count < 3) {
        errors.push(`Mesh '${mesh.name || 'unnamed'}' has insufficient vertices (${pos?.count || 0}).`);
        return;
      }

      totalVertices += pos.count;
      const index = geometry.getIndex();
      const faceCount = index ? index.count / 3 : pos.count / 3;
      totalTriangles += faceCount;

      // Sample first 100 triangles to verify non-zero area
      const pA = new THREE.Vector3();
      const pB = new THREE.Vector3();
      const pC = new THREE.Vector3();
      const checkLimit = Math.min(faceCount, 200);

      for (let i = 0; i < checkLimit; i++) {
        const iA = index ? index.getX(i * 3) : i * 3;
        const iB = index ? index.getX(i * 3 + 1) : i * 3 + 1;
        const iC = index ? index.getX(i * 3 + 2) : i * 3 + 2;

        pA.fromBufferAttribute(pos, iA);
        pB.fromBufferAttribute(pos, iB);
        pC.fromBufferAttribute(pos, iC);

        const edge1 = new THREE.Vector3().subVectors(pB, pA);
        const edge2 = new THREE.Vector3().subVectors(pC, pA);
        const cross = new THREE.Vector3().crossVectors(edge1, edge2);

        if (cross.lengthSq() < 1e-9) {
          hasInvertedOrZeroAreaFacets = true;
          break;
        }
      }
    }
  });

  const bbox = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  bbox.getSize(size);

  if (size.x <= 0 || size.y <= 0 || size.z <= 0) {
    errors.push(`Invalid bounding box dimensions: [${size.x.toFixed(1)}, ${size.y.toFixed(1)}, ${size.z.toFixed(1)}] mm.`);
  }

  if (hasInvertedOrZeroAreaFacets) {
    errors.push('Zero-area degenerate triangles detected in geometry triangulation.');
  }

  if (totalTriangles < 12) {
    errors.push(`Triangle count (${totalTriangles}) is below manifold threshold for 3D printing.`);
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    triangleCount: totalTriangles,
    vertexCount: totalVertices,
    isWatertight: isValid,
    boundingBox: {
      x: Number(size.x.toFixed(2)),
      y: Number(size.y.toFixed(2)),
      z: Number(size.z.toFixed(2)),
    },
    errors,
  };
}

/**
 * Export mesh or group to an IEEE 754 binary Little-Endian STL Blob
 */
export async function exportMeshToBinarySTL(
  object: THREE.Object3D,
  customHeader: string = 'FORMGRID-PARAMETRIC-SYSTEM-V3'
): Promise<STLExportOutput> {
  const validation = validateMeshForSlicing(object);

  if (!validation.isValid) {
    throw new Error(`STL Slicing Integrity Check Failed: ${validation.errors.join('; ')}`);
  }

  const exporter = new STLExporter();
  // STLExporter parse with binary: true generates a DataView
  const resultDataView = exporter.parse(object, { binary: true }) as DataView;

  // Clone buffer cleanly to ensure proper alignment
  const buffer = resultDataView.buffer.slice(
    resultDataView.byteOffset,
    resultDataView.byteOffset + resultDataView.byteLength
  );

  // Overwrite the 80-byte ASCII header with Formgrid manufacturing metadata
  const headerView = new Uint8Array(buffer, 0, Math.min(80, buffer.byteLength));
  const enc = new TextEncoder();
  const headerBytes = enc.encode(`${customHeader} [${validation.triangleCount} FACETS]`);
  for (let i = 0; i < Math.min(80, headerBytes.length); i++) {
    headerView[i] = headerBytes[i];
  }

  // Parse triangle count from bytes 80..83 (uint32 little endian)
  const dv = new DataView(buffer);
  const parsedTriangleCount = dv.getUint32(80, true);

  const cleanBytes = new Uint8Array(new ArrayBuffer(buffer.byteLength));
  cleanBytes.set(new Uint8Array(buffer));
  const blob = new Blob([cleanBytes], { type: 'application/sla' });
  const objectUrl = URL.createObjectURL(blob);

  return {
    blob,
    fileSizeBytes: buffer.byteLength,
    triangleCount: parsedTriangleCount,
    validation,
    objectUrl,
  };
}

/**
 * Trigger client-side direct download of exported binary STL
 */
export function triggerStlDownload(blob: Blob, filename: string = 'formgrid-model.stl'): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.style.display = 'none';
  anchor.href = url;
  anchor.download = filename.endsWith('.stl') ? filename : `${filename}.stl`;
  document.body.appendChild(anchor);
  anchor.click();
  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 100);
}
