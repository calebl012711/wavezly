/**
 * FORMGRID CONSUMER INTERACTIVE 3D PREVIEW
 * Warm porcelain light-mode frame, tactile finish picker, and smooth 3D orbit
 */

import React, { useState } from 'react';
import { OrganizerCanvas } from '../canvas/OrganizerCanvas';
import { SEED_MATERIALS } from '../../db/seed';
import { Compass, Sparkles } from 'lucide-react';
import { playClickSound } from '../../lib/soundEffects';

export const LiveShowcase: React.FC = () => {
  const [selectedMatIdx, setSelectedMatIdx] = useState(0);
  const [hasResin, setHasResin] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);

  const materials = SEED_MATERIALS.filter((m) => m.category === 'filament');
  const resin = hasResin ? SEED_MATERIALS.find((m) => m.id === 'mat_resin_cobalt') || null : null;

  const dimensions = {
    length: 170,
    width: 125,
    height: 40,
    wallThickness: 2.8,
    bottomThickness: 2.4,
    rows: 2,
    cols: 3,
    cornerFilletRadius: 8,
    inlayPocketDepth: 2.5,
  };

  return (
    <div className="relative w-full h-[460px] lg:h-[500px] rounded-2xl bg-white dark:bg-[#121214] border border-zinc-200/90 dark:border-zinc-800 p-3 flex flex-col justify-between shadow-xl">
      {/* Viewport Top Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 z-10">
        <div className="flex items-center space-x-2 text-xs font-sans text-zinc-600 dark:text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-signal-orange" />
          <span className="font-semibold text-zinc-900 dark:text-white">Interactive 3D Studio</span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="text-zinc-500">Drag to rotate</span>
        </div>

        <button
          type="button"
          onClick={() => {
            playClickSound('snap');
            setAutoRotate(!autoRotate);
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-sans flex items-center space-x-1.5 transition cursor-pointer ${
            autoRotate
              ? 'bg-orange-50 text-signal-orange border border-orange-200 dark:bg-orange-950/40 dark:border-orange-800'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:text-zinc-900'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{autoRotate ? 'Turntable Active' : 'Paused'}</span>
        </button>
      </div>

      {/* 3D Canvas with Light Backdrop */}
      <div className="relative flex-1 w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#f8f8fa] to-[#edeef2] dark:from-[#141418] dark:to-[#0a0a0c]">
        <OrganizerCanvas
          dimensions={dimensions}
          material={materials[selectedMatIdx]}
          resinInlay={resin}
          autoRotate={autoRotate}
        />
      </div>

      {/* Interactive Micro Swatch Switcher Overlay */}
      <div className="flex items-center justify-between px-3 py-2 z-10 text-xs text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 mt-2">
        <div className="flex items-center space-x-2.5">
          <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Matte Color:</span>
          <div className="flex items-center space-x-2">
            {materials.map((m, idx) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  playClickSound('tick');
                  setSelectedMatIdx(idx);
                }}
                title={m.name}
                className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                  selectedMatIdx === idx
                    ? 'border-signal-orange ring-2 ring-signal-orange/30 scale-110 shadow-sm'
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
          className={`px-3 py-1 rounded-lg text-xs font-sans border transition flex items-center gap-1.5 cursor-pointer ${
            hasResin
              ? 'border-cyan-300 bg-cyan-50 text-cyan-800 dark:bg-cyan-950/40 dark:border-cyan-800 dark:text-cyan-300'
              : 'border-zinc-200 text-zinc-500 dark:border-zinc-800 hover:text-zinc-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          <span>{hasResin ? 'Acoustic Resin Base: On' : 'Base Inlay: Off'}</span>
        </button>
      </div>
    </div>
  );
};
