/**
 * SNUGFIT INTERACTIVE 3D ROOM & PRODUCT SHOWCASE
 * Features real-time room presets (Kitchen, Vanity, Bedside, Living, Workspace),
 * tactile finish swatches, and smooth 3D orbit.
 */

import React, { useState, useEffect } from 'react';
import { OrganizerCanvas } from '../canvas/OrganizerCanvas';
import { SEED_MATERIALS } from '../../db/seed';
import { Compass, Sparkles } from 'lucide-react';
import { playClickSound } from '../../lib/soundEffects';

export type RoomPresetKey = 'kitchen' | 'vanity' | 'bedside' | 'living' | 'workspace';

export interface RoomPreset {
  id: RoomPresetKey;
  name: string;
  emoji: string;
  subtitle: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    wallThickness: number;
    bottomThickness: number;
    rows: number;
    cols: number;
    cornerFilletRadius: number;
    inlayPocketDepth: number;
  };
  materialId: string;
  resinId?: string | null;
}

export const ROOM_PRESETS: Record<RoomPresetKey, RoomPreset> = {
  kitchen: {
    id: 'kitchen',
    name: 'Kitchen & Coffee',
    emoji: '🍳',
    subtitle: 'Cutlery, spice jars, and barista espresso tools',
    dimensions: {
      length: 220,
      width: 140,
      height: 48,
      wallThickness: 3.0,
      bottomThickness: 2.6,
      rows: 1,
      cols: 4,
      cornerFilletRadius: 10,
      inlayPocketDepth: 0,
    },
    materialId: 'mat_pla_concrete',
    resinId: null,
  },
  vanity: {
    id: 'vanity',
    name: 'Vanity & Bath',
    emoji: '💄',
    subtitle: 'Skincare serums, luxury perfumes, and brushes',
    dimensions: {
      length: 190,
      width: 135,
      height: 44,
      wallThickness: 2.6,
      bottomThickness: 2.4,
      rows: 3,
      cols: 3,
      cornerFilletRadius: 10,
      inlayPocketDepth: 2.5,
    },
    materialId: 'mat_pla_studio_white',
    resinId: 'mat_resin_cobalt',
  },
  bedside: {
    id: 'bedside',
    name: 'Bedside & EDC',
    emoji: '🌙',
    subtitle: 'Watch, signet rings, keys, and phone catchall',
    dimensions: {
      length: 175,
      width: 125,
      height: 36,
      wallThickness: 2.8,
      bottomThickness: 2.4,
      rows: 2,
      cols: 2,
      cornerFilletRadius: 8,
      inlayPocketDepth: 2.5,
    },
    materialId: 'mat_pla_obsidian',
    resinId: 'mat_resin_amber',
  },
  living: {
    id: 'living',
    name: 'Living & Media',
    emoji: '🛋️',
    subtitle: 'TV remotes, game controllers, and coasters',
    dimensions: {
      length: 180,
      width: 140,
      height: 40,
      wallThickness: 3.0,
      bottomThickness: 2.5,
      rows: 2,
      cols: 2,
      cornerFilletRadius: 8,
      inlayPocketDepth: 0,
    },
    materialId: 'mat_pla_obsidian',
    resinId: null,
  },
  workspace: {
    id: 'workspace',
    name: 'Desk & Studio',
    emoji: '🖥️',
    subtitle: 'Stationery, cables, keyboards, and hard drives',
    dimensions: {
      length: 200,
      width: 130,
      height: 38,
      wallThickness: 2.8,
      bottomThickness: 2.4,
      rows: 2,
      cols: 3,
      cornerFilletRadius: 8,
      inlayPocketDepth: 2.5,
    },
    materialId: 'mat_pla_signal_orange',
    resinId: 'mat_resin_emerald',
  },
};

interface LiveShowcaseProps {
  activeRoom?: RoomPresetKey;
  onSelectRoom?: (room: RoomPresetKey) => void;
}

export const LiveShowcase: React.FC<LiveShowcaseProps> = ({
  activeRoom: externalActiveRoom,
  onSelectRoom: externalOnSelectRoom,
}) => {
  const [internalRoom, setInternalRoom] = useState<RoomPresetKey>('kitchen');
  const currentRoomKey = externalActiveRoom || internalRoom;
  const currentPreset = ROOM_PRESETS[currentRoomKey];

  const [selectedMatId, setSelectedMatId] = useState<string>(currentPreset.materialId);
  const [hasResin, setHasResin] = useState<boolean>(Boolean(currentPreset.resinId));
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Sync when room changes
  useEffect(() => {
    setSelectedMatId(currentPreset.materialId);
    setHasResin(Boolean(currentPreset.resinId));
  }, [currentRoomKey]);

  const handleRoomClick = (roomKey: RoomPresetKey) => {
    playClickSound('snap');
    if (externalOnSelectRoom) {
      externalOnSelectRoom(roomKey);
    } else {
      setInternalRoom(roomKey);
    }
  };

  const materials = SEED_MATERIALS.filter((m) => m.category === 'filament');
  const activeMaterial = materials.find((m) => m.id === selectedMatId) || materials[0];
  const activeResin = hasResin
    ? SEED_MATERIALS.find((m) => m.id === (currentPreset.resinId || 'mat_resin_cobalt')) || null
    : null;

  return (
    <div className="relative w-full rounded-2xl bg-white dark:bg-[#121214] border border-zinc-200/90 dark:border-zinc-800 p-3 sm:p-4 flex flex-col justify-between shadow-xl">
      {/* Top Room Tabs */}
      <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100 dark:border-zinc-800 gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-1 sm:space-x-1.5 flex-nowrap">
          {(Object.keys(ROOM_PRESETS) as RoomPresetKey[]).map((key) => {
            const p = ROOM_PRESETS[key];
            const isSelected = key === currentRoomKey;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleRoomClick(key)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-sans font-medium whitespace-nowrap flex items-center space-x-1 transition cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                <span>{p.emoji}</span>
                <span>{p.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            playClickSound('tick');
            setAutoRotate(!autoRotate);
          }}
          className={`px-2 py-1 rounded-md text-[11px] font-sans flex items-center space-x-1 transition cursor-pointer flex-shrink-0 ${
            autoRotate
              ? 'bg-orange-50 text-signal-orange dark:bg-orange-950/40'
              : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'
          }`}
          title="Toggle Turntable Rotation"
        >
          <Compass className="w-3 h-3" />
          <span className="hidden sm:inline">{autoRotate ? 'Rotating' : 'Paused'}</span>
        </button>
      </div>

      {/* Room Preset Subtitle Header */}
      <div className="py-2 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-zinc-900 dark:text-white font-sans">
            {currentPreset.name}
          </span>
          <span className="text-zinc-400 dark:text-zinc-600">•</span>
          <span className="text-zinc-500 dark:text-zinc-400 truncate max-w-[200px] sm:max-w-xs">
            {currentPreset.subtitle}
          </span>
        </div>
        <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
          {currentPreset.dimensions.length}×{currentPreset.dimensions.width}×{currentPreset.dimensions.height}mm
        </span>
      </div>

      {/* 3D Canvas with Light Backdrop */}
      <div className="relative h-[300px] sm:h-[340px] lg:h-[380px] w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#f8f8fa] to-[#edeef2] dark:from-[#141418] dark:to-[#0a0a0c]">
        <OrganizerCanvas
          dimensions={currentPreset.dimensions}
          material={activeMaterial}
          resinInlay={activeResin}
          autoRotate={autoRotate}
        />
        <div className="absolute bottom-2.5 right-3 text-[10px] font-sans text-zinc-400 pointer-events-none bg-white/70 dark:bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
          Interactive 3D • Drag to orbit
        </div>
      </div>

      {/* Bottom Controls: Color Swatches & Soft Inlay */}
      <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100 dark:border-zinc-800 mt-2 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-medium text-zinc-500">Color:</span>
          <div className="flex items-center space-x-1.5">
            {materials.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  playClickSound('tick');
                  setSelectedMatId(m.id);
                }}
                title={m.name}
                className={`w-5 h-5 rounded-full border-2 transition-all cursor-pointer ${
                  selectedMatId === m.id
                    ? 'border-signal-orange ring-2 ring-signal-orange/30 scale-110 shadow-xs'
                    : 'border-zinc-300 dark:border-zinc-700 hover:scale-105'
                }`}
                style={{ backgroundColor: m.hexColor }}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playClickSound('snap');
            setHasResin(!hasResin);
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-sans border transition flex items-center gap-1.5 cursor-pointer ${
            hasResin
              ? 'border-orange-300 bg-orange-50 text-orange-800 dark:bg-orange-950/40 dark:border-orange-800 dark:text-orange-300 font-medium'
              : 'border-zinc-200 text-zinc-500 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3 h-3 text-orange-500" />
          <span>{hasResin ? 'Quiet Base Inlay: On' : 'Base Inlay: Off'}</span>
        </button>
      </div>
    </div>
  );
};
