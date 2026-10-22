/**
 * FORMGRID LIVE INTERACTIVE 3D SHOWCASE COMPONENT
 * Subtly tilting procedural hero viewport with live telemetry readout
 */

import React, { useState } from 'react';
import { OrganizerCanvas } from '../canvas/OrganizerCanvas';
import { SEED_MATERIALS } from '../../db/seed';
import { Compass } from 'lucide-react';

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
    <div className="relative w-full h-[460px] lg:h-[520px] rounded-2xl bg-gradient-to-b from-surface/80 to-background border border-surface-border p-2 flex flex-col justify-between shadow-2xl">
      {/* Viewport Top Bar */}
      <div className="flex items-center justify-between px-3 py-2 z-10">
        <div className="flex items-center space-x-2 font-mono text-[11px] text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-signal-orange animate-ping" />
          <span className="text-zinc-200 font-semibold tracking-wider">LIVE 3D PARAMETRIC KERNEL</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-500">60 FPS PBR RENDER</span>
        </div>

        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-1.5 rounded-md border font-mono text-[10px] flex items-center space-x-1 transition ${
            autoRotate
              ? 'border-signal-orange text-signal-orange bg-signal-orange/10'
              : 'border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{autoRotate ? 'TURNTABLE ON' : 'PAUSED'}</span>
        </button>
      </div>

      {/* 3D Canvas */}
      <div className="relative flex-1 w-full overflow-hidden rounded-xl">
        <OrganizerCanvas
          dimensions={dimensions}
          material={materials[selectedMatIdx]}
          resinInlay={resin}
          autoRotate={autoRotate}
        />
      </div>

      {/* Interactive Micro Swatch Switcher Overlay */}
      <div className="flex items-center justify-between px-3 py-2 z-10 font-mono text-xs text-zinc-400 border-t border-zinc-900 mt-2">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-zinc-500 uppercase">Finish:</span>
          <div className="flex items-center space-x-1.5">
            {materials.map((m, idx) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMatIdx(idx)}
                title={m.name}
                className={`w-5 h-5 rounded-full border transition-transform ${
                  selectedMatIdx === idx
                    ? 'border-signal-orange scale-110 shadow-glow-orange'
                    : 'border-zinc-700 opacity-60 hover:opacity-100'
                }`}
                style={{ backgroundColor: m.hexColor }}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setHasResin(!hasResin)}
          className={`px-2 py-1 rounded text-[10px] border transition ${
            hasResin
              ? 'border-signal-cyan text-signal-cyan bg-signal-cyan/10'
              : 'border-zinc-800 text-zinc-500'
          }`}
        >
          {hasResin ? 'OPTICAL RESIN INLAY: ACTIVE' : 'DRY POCKET'}
        </button>
      </div>
    </div>
  );
};
