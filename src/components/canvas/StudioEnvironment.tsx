/**
 * FORMGRID INDUSTRIAL LIGHTING & CONTACT SHADOW RIG
 * Precision studio illumination tailored for high-fidelity PBR polymer & resin inspection
 */

import React from 'react';
import { ContactShadows } from '@react-three/drei';

interface StudioEnvironmentProps {
  shadowScale?: number;
}

export const StudioEnvironment: React.FC<StudioEnvironmentProps> = ({
  shadowScale = 380,
}) => {
  return (
    <>
      {/* 1. Neutral Ambient Illumination */}
      <ambientLight intensity={0.55} color="#ffffff" />

      {/* 2. Key Directional Studio Light with crisp soft shadow casting */}
      <directionalLight
        position={[140, 240, 160]}
        intensity={1.75}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={10}
        shadow-camera-far={600}
        shadow-camera-left={-200}
        shadow-camera-right={200}
        shadow-camera-top={200}
        shadow-camera-bottom={-200}
        shadow-bias={-0.00015}
      />

      {/* 3. Soft Opposite Fill Light (Cool Studio Tint) */}
      <directionalLight
        position={[-180, 120, -120]}
        intensity={0.65}
        color="#e0f2fe"
      />

      {/* 4. High-Angle Rim Light for Crisp Edge Definition (Dieter Rams aesthetic) */}
      <spotLight
        position={[0, 280, -220]}
        intensity={1.2}
        angle={0.6}
        penumbra={0.8}
        color="#ffffff"
      />

      {/* 5. Contact Shadows on Ground Plane (Y = 0) */}
      <ContactShadows
        position={[0, -0.1, 0]}
        opacity={0.7}
        scale={shadowScale}
        blur={1.8}
        far={60}
        resolution={1024}
        color="#050507"
      />
    </>
  );
};
