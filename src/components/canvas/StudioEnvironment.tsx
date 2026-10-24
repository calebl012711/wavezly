/**
 * SCANDINAVIAN DESK LIGHTING & STUDIO ATMOSPHERE RIG
 * Multi-preset precision illumination engineered for natural wood grain, matte polymer & resin finishes.
 * 7 Cinematic Presets:
 * 1. Morning: Warm golden hour sun (4800K, angled window light casting soft desk shadows)
 * 2. Studio: Neutral Scandinavian design studio (5500K balanced diffuse light, zero harsh glare)
 * 3. Evening: Moody cozy dusk (warm 2700K ambient glow from the Voronoi mushroom lamp, deep twilight window fill)
 * 4. Daylight: Bright California midday sun (6000K crisp white highlights)
 * 5. Laboratory: Precision QC bench (pure clean surgical neutral white, high CRI)
 * 6. Warm: Hearth & walnut warm interior glow (3000K amber)
 * 7. Cyberpunk: Modern neon maker accent (electric orange and subtle violet rim light)
 */

import React from 'react';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import { Sun, Lamp, SlidersHorizontal, SunMedium, Microscope, Flame, Zap } from 'lucide-react';
import { useCustomizerStore, LightingPreset } from '../../store/useCustomizerStore';
import { playSnapPresetSound } from '../../lib/soundEffects';

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
    cct: '4800K Warm Sunlight',
    description: 'Angled warm sunlight key light (#FFF6EC) with soft sky ambient fill (#E8F0FE) casting soft desk shadows on natural Scandinavian wood.',
    primaryColor: '#FFF6EC',
    accentColor: '#E8F0FE',
    gradient: 'from-amber-100 via-orange-50 to-sky-100',
  },
  studio: {
    id: 'studio',
    name: 'Scandinavian Studio',
    subtitle: 'Balanced Architectural Softbox Illumination',
    badge: '5500K STUDIO',
    cct: '5500K Neutral White',
    description: 'Clean Scandinavian design studio lighting with balanced softbox overheads, diffuse fill, and zero harsh glare.',
    primaryColor: '#FFFFFF',
    accentColor: '#E2E8F0',
    gradient: 'from-slate-100 via-zinc-100 to-slate-200',
  },
  evening: {
    id: 'evening',
    name: 'Cozy Evening',
    subtitle: 'Voronoi Lamp & Amber Dusk Glow',
    badge: '2700K DUSK',
    cct: '2700K Cozy Amber',
    description: 'Moody cozy dusk with warm 2700K ambient glow from the Voronoi mushroom lamp and deep twilight window fill.',
    primaryColor: '#FED7AA',
    accentColor: '#0284C7',
    gradient: 'from-amber-200 via-orange-300 to-sky-800',
  },
  daylight: {
    id: 'daylight',
    name: 'California Daylight',
    subtitle: 'Bright High-Noon Sun & Crisp Highlights',
    badge: '6000K DAYLIGHT',
    cct: '6000K Crisp Sunlight',
    description: 'Bright California midday sun with 6000K crisp white specular highlights, open sky fill, and defined contact shadows.',
    primaryColor: '#F0F9FF',
    accentColor: '#38BDF8',
    gradient: 'from-sky-100 via-cyan-50 to-blue-200',
  },
  laboratory: {
    id: 'laboratory',
    name: 'Precision QC Bench',
    subtitle: 'Surgical High-CRI Neutral White',
    badge: '6500K QC',
    cct: '6500K Pure White',
    description: 'Precision inspection bench illumination with pure clean surgical neutral white, dual overhead LED panels, and ultra-high CRI.',
    primaryColor: '#F8FAFC',
    accentColor: '#94A3B8',
    gradient: 'from-zinc-100 via-slate-100 to-zinc-300',
  },
  warm: {
    id: 'warm',
    name: 'Hearth & Walnut',
    subtitle: 'Rich 3000K Interior Amber Glow',
    badge: '3000K HEARTH',
    cct: '3000K Warm Amber',
    description: 'Hearth and walnut warm interior glow with rich 3000K amber bounce, deep hardwood warmth, and soft enveloping shadows.',
    primaryColor: '#FDE68A',
    accentColor: '#D97706',
    gradient: 'from-amber-200 via-orange-200 to-amber-500',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Neon Maker Accent',
    subtitle: 'Electric Orange & Subtle Violet Rim Light',
    badge: 'MAKER NEON',
    cct: 'Orange & Violet',
    description: 'Modern neon maker accent with high-contrast electric orange rim lighting and subtle violet/cyan atmospheric kickers.',
    primaryColor: '#FF6B00',
    accentColor: '#A855F7',
    gradient: 'from-orange-400 via-pink-500 to-purple-600',
  },
};

export const LIGHTING_PRESET_KEYS: LightingPreset[] = [
  'morning',
  'studio',
  'evening',
  'daylight',
  'laboratory',
  'warm',
  'cyberpunk',
];

export function normalizeLightingPreset(preset: LightingPreset | string | undefined): LightingPreset {
  if (!preset) return 'morning';
  const valid: LightingPreset[] = [
    'morning',
    'studio',
    'evening',
    'daylight',
    'laboratory',
    'warm',
    'cyberpunk',
  ];
  if (valid.includes(preset as LightingPreset)) {
    return preset as LightingPreset;
  }
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
        {/* 1. MORNING SUN */}
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

        {/* 2. MINIMALIST STUDIO */}
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

        {/* 3. COZY EVENING */}
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

        {/* 4. CALIFORNIA DAYLIGHT */}
        {normalizedPreset === 'daylight' && (
          <group>
            {/* Direct high-noon California sun disc */}
            <Lightformer
              form="circle"
              intensity={3.2}
              color="#F0F9FF"
              scale={18}
              position={[10, 26, 8]}
              target={[0, 0, 0]}
            />
            {/* Pure sky dome ambient reflector */}
            <Lightformer
              form="rect"
              intensity={1.5}
              color="#BAE6FD"
              scale={[40, 40, 1]}
              position={[0, 20, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
            {/* Crisp rim kicker */}
            <Lightformer
              form="rect"
              intensity={1.6}
              color="#FFFFFF"
              scale={[30, 6, 1]}
              position={[-20, 16, -18]}
              target={[0, 0, 0]}
            />
          </group>
        )}

        {/* 5. PRECISION QC BENCH / LABORATORY */}
        {normalizedPreset === 'laboratory' && (
          <group>
            {/* Dual linear overhead LED inspection bars */}
            <Lightformer
              form="rect"
              intensity={2.6}
              color="#F8FAFC"
              scale={[34, 4, 1]}
              position={[-12, 22, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
            <Lightformer
              form="rect"
              intensity={2.6}
              color="#F8FAFC"
              scale={[34, 4, 1]}
              position={[12, 22, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
            {/* Diffuse clean white ambient ceiling */}
            <Lightformer
              form="rect"
              intensity={1.2}
              color="#FFFFFF"
              scale={[38, 38, 1]}
              position={[0, 26, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
            {/* Neutral lateral fill */}
            <Lightformer
              form="rect"
              intensity={1.0}
              color="#E2E8F0"
              scale={[18, 18, 1]}
              position={[22, 10, 10]}
              target={[0, 0, 0]}
            />
          </group>
        )}

        {/* 6. HEARTH & WALNUT / WARM */}
        {normalizedPreset === 'warm' && (
          <group>
            {/* Warm hearth reflector panel */}
            <Lightformer
              form="rect"
              intensity={3.0}
              color="#FDE68A"
              scale={[30, 20, 1]}
              position={[18, 14, 14]}
              target={[0, 0, 0]}
            />
            {/* Amber hardwood bounce floor */}
            <Lightformer
              form="rect"
              intensity={1.6}
              color="#D97706"
              scale={[36, 36, 1]}
              position={[0, -4, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
            {/* Cozy back-wall ambient */}
            <Lightformer
              form="rect"
              intensity={0.9}
              color="#78350F"
              scale={[24, 16, 1]}
              position={[-20, 12, -16]}
              target={[0, 0, 0]}
            />
          </group>
        )}

        {/* 7. NEON MAKER ACCENT / CYBERPUNK */}
        {normalizedPreset === 'cyberpunk' && (
          <group>
            {/* Electric orange maker tube */}
            <Lightformer
              form="rect"
              intensity={4.2}
              color="#FF6B00"
              scale={[3, 30, 1]}
              position={[20, 8, -10]}
              target={[0, 0, 0]}
            />
            {/* Violet neon tube rim */}
            <Lightformer
              form="rect"
              intensity={3.8}
              color="#A855F7"
              scale={[3, 30, 1]}
              position={[-20, 8, -10]}
              target={[0, 0, 0]}
            />
            {/* Cool cyan grid ceiling */}
            <Lightformer
              form="rect"
              intensity={1.6}
              color="#38BDF8"
              scale={[26, 26, 1]}
              position={[0, 24, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
            {/* Subtle front violet fill */}
            <Lightformer
              form="circle"
              intensity={1.2}
              color="#C084FC"
              scale={12}
              position={[0, 10, 20]}
              target={[0, 0, 0]}
            />
          </group>
        )}
      </Environment>

      {/* Preset Direct Illumination & Directional Shadow Rigs */}

      {/* 1. MORNING SUN */}
      {normalizedPreset === 'morning' && (
        <>
          <ambientLight intensity={0.6} color="#E8F0FE" />
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
          <directionalLight
            position={[-150, 120, -100]}
            intensity={0.4}
            color="#E8F0FE"
          />
          <directionalLight
            position={[0, -60, 60]}
            intensity={0.25}
            color="#FEF3C7"
          />
          <spotLight
            position={[20, 260, 20]}
            intensity={0.6}
            angle={0.65}
            penumbra={0.8}
            color="#FFF6EC"
          />
          <ContactShadows
            position={[0, -0.05, 0]}
            opacity={0.45}
            scale={shadowScale}
            blur={2.0}
            far={80}
            resolution={1024}
            color="#292524"
          />
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

      {/* 2. MINIMALIST STUDIO */}
      {normalizedPreset === 'studio' && (
        <>
          <ambientLight intensity={0.65} color="#F8FAFC" />
          <directionalLight
            position={[110, 240, 130]}
            intensity={1.75}
            color="#FFFFFF"
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
          <directionalLight
            position={[-140, 140, 80]}
            intensity={0.6}
            color="#F1F5F9"
          />
          <spotLight
            position={[0, 280, -180]}
            intensity={0.85}
            angle={0.5}
            penumbra={0.7}
            color="#FFFFFF"
          />
          <ContactShadows
            position={[0, -0.05, 0]}
            opacity={0.42}
            scale={shadowScale}
            blur={2.2}
            far={80}
            resolution={1024}
            color="#1E293B"
          />
          <ContactShadows
            position={[0, -220, 0]}
            opacity={0.42}
            scale={shadowScale * 1.8}
            blur={2.2}
            far={120}
            resolution={1024}
            color="#0F172A"
          />
        </>
      )}

      {/* 3. COZY EVENING */}
      {normalizedPreset === 'evening' && (
        <>
          <ambientLight intensity={0.38} color="#1E293B" />
          <directionalLight
            position={[90, 180, 100]}
            intensity={1.5}
            color="#FED7AA"
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
            intensity={2.8}
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
            intensity={1.8}
            color="#F59E0B"
            distance={450}
            decay={2}
          />
          <directionalLight
            position={[-180, 110, -130]}
            intensity={0.45}
            color="#38BDF8"
          />
          <directionalLight
            position={[0, 100, 100]}
            intensity={0.2}
            color="#E8F0FE"
          />
          <ContactShadows
            position={[0, -0.05, 0]}
            opacity={0.48}
            scale={shadowScale}
            blur={2.0}
            far={80}
            resolution={1024}
            color="#1C1917"
          />
          <ContactShadows
            position={[0, -220, 0]}
            opacity={0.48}
            scale={shadowScale * 1.8}
            blur={2.0}
            far={120}
            resolution={1024}
            color="#0C0A09"
          />
        </>
      )}

      {/* 4. CALIFORNIA DAYLIGHT */}
      {normalizedPreset === 'daylight' && (
        <>
          <ambientLight intensity={0.72} color="#E0F2FE" />
          {/* Steep midday sun with 6000K crisp white highlights */}
          <directionalLight
            position={[90, 270, 80]}
            intensity={2.3}
            color="#F0F9FF"
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
          <directionalLight
            position={[-160, 160, -90]}
            intensity={0.55}
            color="#BAE6FD"
          />
          <spotLight
            position={[40, 290, -120]}
            intensity={1.1}
            angle={0.45}
            penumbra={0.5}
            color="#FFFFFF"
          />
          <directionalLight
            position={[0, -50, 50]}
            intensity={0.28}
            color="#FFFFFF"
          />
          <ContactShadows
            position={[0, -0.05, 0]}
            opacity={0.52}
            scale={shadowScale}
            blur={1.4}
            far={80}
            resolution={1024}
            color="#0F172A"
          />
          <ContactShadows
            position={[0, -220, 0]}
            opacity={0.52}
            scale={shadowScale * 1.8}
            blur={1.4}
            far={120}
            resolution={1024}
            color="#090D16"
          />
        </>
      )}

      {/* 5. PRECISION QC BENCH / LABORATORY */}
      {normalizedPreset === 'laboratory' && (
        <>
          <ambientLight intensity={0.82} color="#F8FAFC" />
          {/* Dual balanced surgical inspection white key lights */}
          <directionalLight
            position={[-80, 250, 90]}
            intensity={1.45}
            color="#FFFFFF"
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
          <directionalLight
            position={[80, 250, 90]}
            intensity={1.45}
            color="#FFFFFF"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.0001}
          />
          {/* Front ring inspection fill */}
          <directionalLight
            position={[0, 110, 160]}
            intensity={0.5}
            color="#F1F5F9"
          />
          <spotLight
            position={[0, 260, 0]}
            intensity={0.75}
            angle={0.85}
            penumbra={0.9}
            color="#FFFFFF"
          />
          <ContactShadows
            position={[0, -0.05, 0]}
            opacity={0.36}
            scale={shadowScale}
            blur={2.6}
            far={80}
            resolution={1024}
            color="#334155"
          />
          <ContactShadows
            position={[0, -220, 0]}
            opacity={0.36}
            scale={shadowScale * 1.8}
            blur={2.6}
            far={120}
            resolution={1024}
            color="#1E293B"
          />
        </>
      )}

      {/* 6. HEARTH & WALNUT / WARM */}
      {normalizedPreset === 'warm' && (
        <>
          <ambientLight intensity={0.52} color="#451A03" />
          {/* Warm 3000K amber hearth key light */}
          <directionalLight
            position={[110, 190, 120]}
            intensity={1.7}
            color="#FDE68A"
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
          <directionalLight
            position={[-120, 130, -80]}
            intensity={0.5}
            color="#FED7AA"
          />
          <spotLight
            position={[80, 220, 60]}
            intensity={1.8}
            angle={0.7}
            penumbra={0.8}
            color="#F59E0B"
          />
          <directionalLight
            position={[0, -60, 60]}
            intensity={0.35}
            color="#D97706"
          />
          <ContactShadows
            position={[0, -0.05, 0]}
            opacity={0.48}
            scale={shadowScale}
            blur={2.2}
            far={80}
            resolution={1024}
            color="#261205"
          />
          <ContactShadows
            position={[0, -220, 0]}
            opacity={0.48}
            scale={shadowScale * 1.8}
            blur={2.2}
            far={120}
            resolution={1024}
            color="#160803"
          />
        </>
      )}

      {/* 7. NEON MAKER ACCENT / CYBERPUNK */}
      {normalizedPreset === 'cyberpunk' && (
        <>
          <ambientLight intensity={0.32} color="#090D16" />
          {/* Electric orange directional key */}
          <directionalLight
            position={[120, 200, 110]}
            intensity={1.8}
            color="#FF6B00"
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
          {/* Subtle violet rim light */}
          <spotLight
            position={[-160, 150, -120]}
            intensity={3.4}
            angle={0.65}
            penumbra={0.6}
            color="#A855F7"
          />
          {/* Electric orange edge kicker */}
          <spotLight
            position={[160, 150, -120]}
            intensity={3.0}
            angle={0.65}
            penumbra={0.6}
            color="#FB923C"
          />
          {/* Cyan front ambient fill */}
          <directionalLight
            position={[0, 140, 120]}
            intensity={0.6}
            color="#38BDF8"
          />
          <ContactShadows
            position={[0, -0.05, 0]}
            opacity={0.56}
            scale={shadowScale}
            blur={1.8}
            far={80}
            resolution={1024}
            color="#020617"
          />
          <ContactShadows
            position={[0, -220, 0]}
            opacity={0.56}
            scale={shadowScale * 1.8}
            blur={1.8}
            far={120}
            resolution={1024}
            color="#010208"
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
      shortName: 'Morning',
      icon: Sun,
    },
    {
      id: 'studio' as LightingPreset,
      name: 'Scandinavian Studio',
      shortName: 'Studio',
      icon: SlidersHorizontal,
    },
    {
      id: 'evening' as LightingPreset,
      name: 'Cozy Evening',
      shortName: 'Evening',
      icon: Lamp,
    },
    {
      id: 'daylight' as LightingPreset,
      name: 'California Daylight',
      shortName: 'Daylight',
      icon: SunMedium,
    },
    {
      id: 'laboratory' as LightingPreset,
      name: 'Precision QC Bench',
      shortName: 'Lab QC',
      icon: Microscope,
    },
    {
      id: 'warm' as LightingPreset,
      name: 'Hearth & Walnut',
      shortName: 'Warm',
      icon: Flame,
    },
    {
      id: 'cyberpunk' as LightingPreset,
      name: 'Neon Maker Accent',
      shortName: 'Maker Neon',
      icon: Zap,
    },
  ];

  return (
    <div
      className={`flex items-center space-x-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-1 rounded-full border border-slate-200/80 dark:border-zinc-800 shadow-xs overflow-x-auto max-w-full no-scrollbar ${className}`}
    >
      {presets.map((preset) => {
        const Icon = preset.icon;
        const isSelected = normalized === preset.id;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => {
              playSnapPresetSound();
              setLightingPreset(preset.id);
            }}
            title={`${preset.name} - ${LIGHTING_PRESETS_METADATA[preset.id]?.cct || ''}`}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
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
