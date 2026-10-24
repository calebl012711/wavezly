/**
 * SCANDINAVIAN DESK LIGHTING & STUDIO ATMOSPHERE RIG
 * Multi-preset precision illumination engineered for natural wood grain, matte polymer & resin finishes.
 * Presets:
 * 1. Warm Morning Sun: Directional warm sunlight (#FFF6EC, 1.8), soft sky ambient (#E8F0FE, 0.6), natural window fill.
 * 2. Minimalist Studio: Balanced architectural softbox illumination (#FFFFFF, 1.8), crisp neutral daylight.
 * 3. Cozy Evening: Atmospheric warm incandescent desk lamp glow (#FED7AA, #F59E0B), gentle dusk window contrast.
 */

import React from 'react';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import { Sun, Lamp, SlidersHorizontal } from 'lucide-react';
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
  morning: {
    id: 'morning',
    name: 'Warm Morning Sun',
    subtitle: 'Golden Hour Scandinavian Window Light',
    badge: '4800K SUN',
    cct: '4800K Sunlight',
    description: 'Angled warm sunlight key light (#FFF6EC) with soft sky ambient fill (#E8F0FE) illuminating the natural Scandinavian wood desk.',
    primaryColor: '#FFF6EC',
    accentColor: '#E8F0FE',
    gradient: 'from-amber-100 via-orange-50 to-sky-100',
  },
  studio: {
    id: 'studio',
    name: 'Minimalist Studio',
    subtitle: 'Balanced Architectural Softbox Illumination',
    badge: '5500K STUDIO',
    cct: '5500K Neutral',
    description: 'Clean Scandinavian design studio lighting with balanced softbox overheads and crisp edge highlights.',
    primaryColor: '#FFFFFF',
    accentColor: '#E2E8F0',
    gradient: 'from-slate-100 via-zinc-100 to-slate-200',
  },
  evening: {
    id: 'evening',
    name: 'Cozy Evening',
    subtitle: 'Warm Task Lamp & Amber Dusk Glow',
    badge: '2700K COZY',
    cct: '2700K Amber',
    description: 'Atmospheric evening mood with an incandescent desk lamp glow, gentle dusk window contrast, and rich wood grain highlights.',
    primaryColor: '#FED7AA',
    accentColor: '#F59E0B',
    gradient: 'from-amber-200 via-orange-300 to-amber-600',
  },
  daylight: {
    id: 'daylight',
    name: 'Warm Morning Sun',
    subtitle: 'Golden Hour Scandinavian Window Light',
    badge: '4800K SUN',
    cct: '4800K Sunlight',
    description: 'Angled warm sunlight key light (#FFF6EC) with soft sky ambient fill (#E8F0FE) illuminating the natural Scandinavian wood desk.',
    primaryColor: '#FFF6EC',
    accentColor: '#E8F0FE',
    gradient: 'from-amber-100 via-orange-50 to-sky-100',
  },
  laboratory: {
    id: 'laboratory',
    name: 'Minimalist Studio',
    subtitle: 'Balanced Architectural Softbox Illumination',
    badge: '5500K STUDIO',
    cct: '5500K Neutral',
    description: 'Clean Scandinavian design studio lighting with balanced softbox overheads and crisp edge highlights.',
    primaryColor: '#FFFFFF',
    accentColor: '#E2E8F0',
    gradient: 'from-slate-100 via-zinc-100 to-slate-200',
  },
  warm: {
    id: 'warm',
    name: 'Cozy Evening',
    subtitle: 'Warm Task Lamp & Amber Dusk Glow',
    badge: '2700K COZY',
    cct: '2700K Amber',
    description: 'Atmospheric evening mood with an incandescent desk lamp glow, gentle dusk window contrast, and rich wood grain highlights.',
    primaryColor: '#FED7AA',
    accentColor: '#F59E0B',
    gradient: 'from-amber-200 via-orange-300 to-amber-600',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Nordic Twilight',
    subtitle: 'Subtle Slate & Aurora Accent',
    badge: 'TWILIGHT',
    cct: '6500K / 4200K',
    description: 'Late evening Nordic dusk with gentle cool fill and refined warm desk focus.',
    primaryColor: '#38BDF8',
    accentColor: '#FB923C',
    gradient: 'from-sky-300 to-amber-300',
  },
};

export const LIGHTING_PRESET_KEYS: LightingPreset[] = [
  'morning',
  'studio',
  'evening',
];

export type NormalizedLightingPreset = 'morning' | 'studio' | 'evening' | 'cyberpunk';

export function normalizeLightingPreset(preset: LightingPreset | string | undefined): NormalizedLightingPreset {
  if (!preset) return 'morning';
  if (preset === 'morning' || preset === 'daylight') return 'morning';
  if (preset === 'studio' || preset === 'laboratory') return 'studio';
  if (preset === 'evening' || preset === 'warm') return 'evening';
  if (preset === 'cyberpunk') return 'cyberpunk';
  return 'morning';
}

export interface StudioEnvironmentProps {
  shadowScale?: number;
  preset?: LightingPreset;
}

export const StudioEnvironment: React.FC<StudioEnvironmentProps> = ({
  shadowScale = 380,
  preset: propPreset,
}) => {
  const storePreset = useCustomizerStore((state) => state.lightingPreset);
  const activePreset = propPreset || storePreset || 'morning';
  const normalizedPreset = normalizeLightingPreset(activePreset);

  return (
    <>
      {/* Dynamic PBR Reflection Environment Map */}
      <Environment key={normalizedPreset} resolution={256} frames={1}>
        {normalizedPreset === 'morning' && (
          <group>
            {/* Direct morning sunbeam through casement window */}
            <Lightformer
              form="rect"
              intensity={2.2}
              color="#FFF6EC"
              scale={[28, 28, 1]}
              position={[24, 22, 16]}
              target={[0, 0, 0]}
            />
            {/* Open Nordic sky ambient window fill */}
            <Lightformer
              form="rect"
              intensity={1.2}
              color="#E8F0FE"
              scale={[36, 18, 1]}
              position={[-24, 14, -14]}
              target={[0, 0, 0]}
            />
            {/* Warm Scandinavian wood desk bounce panel */}
            <Lightformer
              form="rect"
              intensity={0.9}
              color="#FEF3C7"
              scale={[36, 36, 1]}
              position={[0, -4, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
            {/* Front subtle fill */}
            <Lightformer
              form="circle"
              intensity={0.7}
              color="#FFFFFF"
              scale={12}
              position={[12, 8, 18]}
              target={[0, 0, 0]}
            />
          </group>
        )}

        {normalizedPreset === 'studio' && (
          <group>
            {/* Large architectural ceiling softbox */}
            <Lightformer
              form="rect"
              intensity={2.0}
              color="#FFFFFF"
              scale={[36, 36, 1]}
              position={[0, 24, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
            {/* Studio lateral fill strip */}
            <Lightformer
              form="rect"
              intensity={1.4}
              color="#F1F5F9"
              scale={[22, 8, 1]}
              position={[-20, 10, -10]}
              target={[0, 0, 0]}
            />
            {/* Specular edge kicker */}
            <Lightformer
              form="circle"
              intensity={0.9}
              color="#FFFFFF"
              scale={14}
              position={[18, 8, 18]}
              target={[0, 0, 0]}
            />
          </group>
        )}

        {normalizedPreset === 'evening' && (
          <group>
            {/* Focused 2700K incandescent desk lamp reflector glow */}
            <Lightformer
              form="circle"
              intensity={3.8}
              color="#FDBA74"
              scale={12}
              position={[14, 18, 10]}
              target={[0, 0, 0]}
            />
            {/* Warm desktop floor bounce panel */}
            <Lightformer
              form="rect"
              intensity={1.4}
              color="#FEF3C7"
              scale={[32, 32, 1]}
              position={[0, -4, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
            {/* Deep twilight window strip */}
            <Lightformer
              form="rect"
              intensity={1.1}
              color="#0284C7"
              scale={[10, 20, 1]}
              position={[-24, 8, -16]}
              target={[0, 0, 0]}
            />
          </group>
        )}

        {normalizedPreset === 'cyberpunk' && (
          <group>
            <Lightformer
              form="rect"
              intensity={3.5}
              color="#38BDF8"
              scale={[2, 25, 1]}
              position={[-18, 6, -12]}
              target={[0, 0, 0]}
            />
            <Lightformer
              form="rect"
              intensity={3.5}
              color="#FB923C"
              scale={[2, 25, 1]}
              position={[18, 6, -12]}
              target={[0, 0, 0]}
            />
            <Lightformer
              form="rect"
              intensity={1.5}
              color="#E0F2FE"
              scale={[20, 20, 1]}
              position={[0, 22, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
          </group>
        )}
      </Environment>

      {/* Preset Direct Illumination & Directional Shadow Rigs */}
      {normalizedPreset === 'morning' && (
        <>
          {/* Soft sky ambient light for realistic fill */}
          <ambientLight intensity={0.6} color="#E8F0FE" />

          {/* Directional warm sunlight key light */}
          <directionalLight
            position={[130, 220, 140]}
            intensity={1.8}
            color="#FFF6EC"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={10}
            shadow-camera-far={800}
            shadow-camera-left={-250}
            shadow-camera-right={250}
            shadow-camera-top={250}
            shadow-camera-bottom={-250}
            shadow-bias={-0.0001}
          />

          {/* Soft sky diffuse fill light */}
          <directionalLight
            position={[-150, 120, -100]}
            intensity={0.4}
            color="#E8F0FE"
          />

          {/* Warm wood desktop upward bounce fill */}
          <directionalLight
            position={[0, -60, 60]}
            intensity={0.25}
            color="#FEF3C7"
          />

          {/* Subtle soft overhead spot to sculpt organizer walls and drawer pull rims */}
          <spotLight
            position={[20, 260, 20]}
            intensity={0.6}
            angle={0.65}
            penumbra={0.8}
            color="#FFF6EC"
          />

          {/* Contact shadows on desk surface (soft opacity 0.45, blur 2.0, resolution 1024) */}
          <ContactShadows
            position={[0, -0.05, 0]}
            opacity={0.45}
            scale={shadowScale}
            blur={2.0}
            far={80}
            resolution={1024}
            color="#292524"
          />

          {/* Floor level contact shadow beneath desk */}
          <ContactShadows
            position={[0, -220, 0]}
            opacity={0.45}
            scale={shadowScale * 1.8}
            blur={2.0}
            far={120}
            resolution={1024}
            color="#1C1917"
          />
        </>
      )}

      {normalizedPreset === 'studio' && (
        <>
          {/* Soft neutral ambient fill */}
          <ambientLight intensity={0.6} color="#E8F0FE" />

          {/* Directional key light with clean studio white */}
          <directionalLight
            position={[110, 240, 130]}
            intensity={1.8}
            color="#FFF6EC"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={10}
            shadow-camera-far={800}
            shadow-camera-left={-250}
            shadow-camera-right={250}
            shadow-camera-top={250}
            shadow-camera-bottom={-250}
            shadow-bias={-0.0001}
          />

          {/* Balanced architectural softbox fill */}
          <directionalLight
            position={[-140, 140, 80]}
            intensity={0.55}
            color="#F1F5F9"
          />

          {/* Crisp overhead edge definition spot */}
          <spotLight
            position={[0, 280, -180]}
            intensity={1.0}
            angle={0.5}
            penumbra={0.7}
            color="#FFFFFF"
          />

          {/* Contact shadows on desk (soft opacity 0.45, blur 2.0, resolution 1024) */}
          <ContactShadows
            position={[0, -0.05, 0]}
            opacity={0.45}
            scale={shadowScale}
            blur={2.0}
            far={80}
            resolution={1024}
            color="#1E293B"
          />

          {/* Floor contact shadow */}
          <ContactShadows
            position={[0, -220, 0]}
            opacity={0.45}
            scale={shadowScale * 1.8}
            blur={2.0}
            far={120}
            resolution={1024}
            color="#0F172A"
          />
        </>
      )}

      {normalizedPreset === 'evening' && (
        <>
          {/* Deep dusk ambient room fill */}
          <ambientLight intensity={0.42} color="#1E293B" />

          {/* Warm incandescent desk key light */}
          <directionalLight
            position={[90, 180, 100]}
            intensity={1.8}
            color="#FFF6EC"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={10}
            shadow-camera-far={800}
            shadow-camera-left={-250}
            shadow-camera-right={250}
            shadow-camera-top={250}
            shadow-camera-bottom={-250}
            shadow-bias={-0.0001}
          />

          {/* Cozy warm desk lamp spot light creating radiant task pool */}
          <spotLight
            position={[75, 160, 65]}
            intensity={2.6}
            angle={0.75}
            penumbra={0.7}
            color="#FED7AA"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.0001}
          />

          {/* Warm incandescent lamp bulb omni-glow */}
          <pointLight
            position={[75, 150, 65]}
            intensity={1.6}
            color="#F59E0B"
            distance={450}
            decay={2}
          />

          {/* Cool twilight window backlight from exterior */}
          <directionalLight
            position={[-180, 110, -130]}
            intensity={0.45}
            color="#38BDF8"
          />

          {/* Soft sky ambient fill */}
          <directionalLight
            position={[0, 100, 100]}
            intensity={0.25}
            color="#E8F0FE"
          />

          {/* Contact shadows on desk (soft opacity 0.45, blur 2.0, resolution 1024) */}
          <ContactShadows
            position={[0, -0.05, 0]}
            opacity={0.45}
            scale={shadowScale}
            blur={2.0}
            far={80}
            resolution={1024}
            color="#1C1917"
          />

          {/* Floor contact shadow */}
          <ContactShadows
            position={[0, -220, 0]}
            opacity={0.45}
            scale={shadowScale * 1.8}
            blur={2.0}
            far={120}
            resolution={1024}
            color="#0C0A09"
          />
        </>
      )}

      {normalizedPreset === 'cyberpunk' && (
        <>
          <ambientLight intensity={0.35} color="#0B132B" />
          <directionalLight
            position={[120, 220, 120]}
            intensity={1.5}
            color="#FFF6EC"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={10}
            shadow-camera-far={800}
            shadow-camera-left={-250}
            shadow-camera-right={250}
            shadow-camera-top={250}
            shadow-camera-bottom={-250}
            shadow-bias={-0.0001}
          />
          <spotLight
            position={[-180, 140, -120]}
            intensity={2.8}
            angle={0.65}
            penumbra={0.6}
            color="#38BDF8"
          />
          <spotLight
            position={[180, 140, -120]}
            intensity={2.6}
            angle={0.65}
            penumbra={0.6}
            color="#F97316"
          />
          <ContactShadows
            position={[0, -0.05, 0]}
            opacity={0.45}
            scale={shadowScale}
            blur={2.0}
            far={80}
            resolution={1024}
            color="#030712"
          />
          <ContactShadows
            position={[0, -220, 0]}
            opacity={0.45}
            scale={shadowScale * 1.8}
            blur={2.0}
            far={120}
            resolution={1024}
            color="#020617"
          />
        </>
      )}
    </>
  );
};

export interface LightingPresetSwitcherProps {
  className?: string;
}

export const LightingPresetSwitcher: React.FC<LightingPresetSwitcherProps> = ({ className = '' }) => {
  const currentPreset = useCustomizerStore((state) => state.lightingPreset);
  const setLightingPreset = useCustomizerStore((state) => state.setLightingPreset);
  const normalized = normalizeLightingPreset(currentPreset);

  const presets = [
    {
      id: 'morning' as LightingPreset,
      name: 'Warm Morning Sun',
      shortName: 'Morning Sun',
      icon: Sun,
    },
    {
      id: 'studio' as LightingPreset,
      name: 'Minimalist Studio',
      shortName: 'Studio',
      icon: SlidersHorizontal,
    },
    {
      id: 'evening' as LightingPreset,
      name: 'Cozy Evening',
      shortName: 'Cozy Evening',
      icon: Lamp,
    },
  ];

  return (
    <div className={`flex items-center space-x-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-1 rounded-full border border-slate-200/80 dark:border-zinc-800 shadow-xs ${className}`}>
      {presets.map((preset) => {
        const Icon = preset.icon;
        const isSelected = normalized === preset.id;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => setLightingPreset(preset.id)}
            title={preset.name}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              isSelected
                ? 'bg-[#FF6B00] text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{preset.shortName}</span>
          </button>
        );
      })}
    </div>
  );
};
