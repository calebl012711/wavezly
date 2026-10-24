/**
 * FORMGRID INDUSTRIAL LIGHTING & CONTACT SHADOW RIG
 * Multi-preset precision studio illumination engineered for high-fidelity PBR polymer & resin inspection.
 * Presets:
 * 1. Studio Daylight (5500K Neutral White)
 * 2. Dieter Rams Laboratory (High-Contrast Monochrome Rim)
 * 3. Warm Desktop Task Light (3000K Soft Amber)
 * 4. Cyberpunk Prototype (Dual Signal Orange & Electric Cyan Rim)
 */

import React from 'react';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import { useCustomizerStore, LightingPreset } from '../../store/useCustomizerStore';

export interface LightingPresetInfo {
  id: LightingPreset;
  name: string;
  subtitle: string;
  badge: string;
  cct: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  gradient: string;
}

export const LIGHTING_PRESETS_METADATA: Record<LightingPreset, LightingPresetInfo> = {
  daylight: {
    id: 'daylight',
    name: 'Studio Daylight',
    subtitle: '5500K Neutral White',
    badge: '5500K D55',
    cct: '5500K Neutral',
    description: 'Balanced industrial daylight for color-critical inspection and true polymer color fidelity.',
    primaryColor: '#ffffff',
    accentColor: '#e0f2fe',
    gradient: 'from-slate-100 to-sky-200',
  },
  laboratory: {
    id: 'laboratory',
    name: 'Dieter Rams Laboratory',
    subtitle: 'High-Contrast Monochrome Rim',
    badge: 'BRAUN RIM',
    cct: '6500K Stark',
    description: 'Stark surgical monochrome with high-contrast grazing rim beams defining razor-sharp bevels.',
    primaryColor: '#ffffff',
    accentColor: '#27272a',
    gradient: 'from-white via-zinc-400 to-zinc-900',
  },
  warm: {
    id: 'warm',
    name: 'Warm Desktop Task Light',
    subtitle: '3000K Soft Amber',
    badge: '3000K INCAND',
    cct: '3000K Amber',
    description: 'Soft incandescent drafting lamp with warm desktop bounce and dusky ambient fill.',
    primaryColor: '#fde68a',
    accentColor: '#ea580c',
    gradient: 'from-amber-200 to-orange-500',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Prototype',
    subtitle: 'Dual Signal Orange & Electric Cyan Rim',
    badge: 'DUAL RIM',
    cct: '620nm / 490nm',
    description: 'FORMGRID R&D hardware rig with dual neon Signal Orange & Electric Cyan rim beams.',
    primaryColor: '#ff5500',
    accentColor: '#00f5ff',
    gradient: 'from-[#ff5500] via-zinc-800 to-[#00f5ff]',
  },
};

export const LIGHTING_PRESET_KEYS: LightingPreset[] = [
  'daylight',
  'laboratory',
  'warm',
  'cyberpunk',
];

export interface StudioEnvironmentProps {
  shadowScale?: number;
  preset?: LightingPreset;
}

export const StudioEnvironment: React.FC<StudioEnvironmentProps> = ({
  shadowScale = 380,
  preset: propPreset,
}) => {
  const storePreset = useCustomizerStore((state) => state.lightingPreset);
  const activePreset = propPreset || storePreset || 'daylight';

  return (
    <>
      {/* Dynamic PBR Reflection Environment Map */}
      <Environment key={activePreset} resolution={256} frames={1}>
        {activePreset === 'daylight' && (
          <group>
            {/* Soft overhead light bank */}
            <Lightformer
              form="rect"
              intensity={1.8}
              color="#ffffff"
              scale={[30, 30, 1]}
              position={[0, 20, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
            {/* Cool daylight side fill strip */}
            <Lightformer
              form="rect"
              intensity={1.2}
              color="#e0f2fe"
              scale={[15, 6, 1]}
              position={[-20, 8, -12]}
              target={[0, 0, 0]}
            />
            {/* Front soft specular bounce */}
            <Lightformer
              form="circle"
              intensity={0.8}
              color="#f8fafc"
              scale={12}
              position={[15, 6, 15]}
              target={[0, 0, 0]}
            />
          </group>
        )}

        {activePreset === 'laboratory' && (
          <group>
            {/* Dieter Rams high-contrast surgical slit strips */}
            <Lightformer
              form="rect"
              intensity={3.5}
              color="#ffffff"
              scale={[40, 0.6, 1]}
              position={[0, 18, -10]}
              target={[0, 0, 0]}
            />
            {/* Razor vertical edge definition rim */}
            <Lightformer
              form="rect"
              intensity={3.0}
              color="#ffffff"
              scale={[0.6, 25, 1]}
              position={[-18, 5, -15]}
              target={[0, 0, 0]}
            />
            <Lightformer
              form="rect"
              intensity={2.2}
              color="#f4f4f5"
              scale={[0.6, 25, 1]}
              position={[18, 5, -15]}
              target={[0, 0, 0]}
            />
            {/* Low specular grazing strip */}
            <Lightformer
              form="rect"
              intensity={1.5}
              color="#d4d4d8"
              scale={[25, 1, 1]}
              position={[0, -2, 15]}
              target={[0, 0, 0]}
            />
          </group>
        )}

        {activePreset === 'warm' && (
          <group>
            {/* Focused 3000K incandescent lamp reflector disc */}
            <Lightformer
              form="circle"
              intensity={3.0}
              color="#fed7aa"
              scale={10}
              position={[12, 16, 12]}
              target={[0, 0, 0]}
            />
            {/* Warm desktop floor bounce panel */}
            <Lightformer
              form="rect"
              intensity={1.0}
              color="#fef3c7"
              scale={[30, 30, 1]}
              position={[0, -3, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
            {/* Deep dusk ambient window strip */}
            <Lightformer
              form="rect"
              intensity={0.9}
              color="#38bdf8"
              scale={[8, 16, 1]}
              position={[-22, 6, -14]}
              target={[0, 0, 0]}
            />
          </group>
        )}

        {activePreset === 'cyberpunk' && (
          <group>
            {/* Electric Cyan Neon Strip (Left Rim) */}
            <Lightformer
              form="rect"
              intensity={5.0}
              color="#00f5ff"
              scale={[2, 25, 1]}
              position={[-18, 6, -12]}
              target={[0, 0, 0]}
            />
            {/* Signal Orange Neon Strip (Right Rim) */}
            <Lightformer
              form="rect"
              intensity={5.0}
              color="#ff5500"
              scale={[2, 25, 1]}
              position={[18, 6, -12]}
              target={[0, 0, 0]}
            />
            {/* High overhead cybernetic cyan accent */}
            <Lightformer
              form="rect"
              intensity={1.8}
              color="#06b6d4"
              scale={[20, 20, 1]}
              position={[0, 22, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
          </group>
        )}
      </Environment>

      {/* Preset Direct Illumination & Directional Shadow Rigs */}
      {activePreset === 'daylight' && (
        <>
          <ambientLight intensity={0.65} color="#ffffff" />
          <directionalLight
            position={[140, 240, 160]}
            intensity={1.85}
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
          <directionalLight
            position={[-180, 120, -120]}
            intensity={0.7}
            color="#f1f5f9"
          />
          <spotLight
            position={[0, 280, -220]}
            intensity={1.25}
            angle={0.6}
            penumbra={0.8}
            color="#ffffff"
          />
          <ContactShadows
            position={[0, -0.1, 0]}
            opacity={0.38}
            scale={shadowScale}
            blur={2.4}
            far={80}
            resolution={1024}
            color="#1c1917"
          />
        </>
      )}

      {activePreset === 'laboratory' && (
        <>
          <ambientLight intensity={0.22} color="#e4e4e7" />
          <directionalLight
            position={[100, 280, 120]}
            intensity={2.3}
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
          <spotLight
            position={[0, 320, -240]}
            intensity={3.4}
            angle={0.45}
            penumbra={0.25}
            color="#ffffff"
          />
          <spotLight
            position={[-200, 75, -160]}
            intensity={2.0}
            angle={0.55}
            penumbra={0.4}
            color="#f4f4f5"
          />
          <directionalLight
            position={[180, 60, -140]}
            intensity={1.1}
            color="#e4e4e7"
          />
          <ContactShadows
            position={[0, -0.1, 0]}
            opacity={0.88}
            scale={shadowScale}
            blur={1.2}
            far={55}
            resolution={1024}
            color="#000000"
          />
        </>
      )}

      {activePreset === 'warm' && (
        <>
          <ambientLight intensity={0.42} color="#fffbeb" />
          <directionalLight
            position={[110, 220, 130]}
            intensity={2.5}
            color="#ffe2b8"
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
          <pointLight
            position={[50, 120, 80]}
            intensity={1.2}
            color="#fcd34d"
            distance={400}
          />
          <directionalLight
            position={[-180, 90, -130]}
            intensity={0.45}
            color="#38bdf8"
          />
          <spotLight
            position={[-40, 240, -190]}
            intensity={1.5}
            angle={0.65}
            penumbra={0.8}
            color="#fef08a"
          />
          <ContactShadows
            position={[0, -0.1, 0]}
            opacity={0.72}
            scale={shadowScale}
            blur={2.0}
            far={65}
            resolution={1024}
            color="#1a1208"
          />
        </>
      )}

      {activePreset === 'cyberpunk' && (
        <>
          <ambientLight intensity={0.28} color="#0b0e1b" />
          <directionalLight
            position={[60, 200, 140]}
            intensity={1.35}
            color="#e0f2fe"
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
          <spotLight
            position={[-190, 160, -130]}
            intensity={3.6}
            angle={0.65}
            penumbra={0.5}
            color="#00f5ff"
          />
          <spotLight
            position={[190, 160, -130]}
            intensity={3.6}
            angle={0.65}
            penumbra={0.5}
            color="#ff5500"
          />
          <directionalLight
            position={[0, 250, 0]}
            intensity={0.85}
            color="#06b6d4"
          />
          <ContactShadows
            position={[0, -0.1, 0]}
            opacity={0.82}
            scale={shadowScale}
            blur={1.6}
            far={60}
            resolution={1024}
            color="#030514"
          />
        </>
      )}
    </>
  );
};
