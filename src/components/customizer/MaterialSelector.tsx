/**
 * WAVEZLY CUSTOM 3D STUDIO - TACTILE MATERIAL & RESIN INLAY SELECTOR
 * High-fidelity PBR swatch picker with polymer density and optical transmission metrics
 */

import React from 'react';
import { MaterialOption } from '../../types';
import { SEED_MATERIALS } from '../../db/seed';
import { Check, Droplets, Layers } from 'lucide-react';

interface MaterialSelectorProps {
  selectedFilament: MaterialOption;
  selectedResin: MaterialOption | null;
  onSelectFilament: (mat: MaterialOption) => void;
  onSelectResin: (mat: MaterialOption | null) => void;
}

export const MaterialSelector: React.FC<MaterialSelectorProps> = ({
  selectedFilament,
  selectedResin,
  onSelectFilament,
  onSelectResin,
}) => {
  const filaments = SEED_MATERIALS.filter((m) => m.category === 'filament');
  const resins = SEED_MATERIALS.filter((m) => m.category === 'resin');

  return (
    <div className="space-y-4">
      {/* 1. Primary Solid Polymer (Outer Shell) */}
      <div className="p-3 bg-surface rounded-lg border border-surface-border">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-signal-orange" />
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Structural Shell Material
            </span>
          </div>
          <span className="font-mono text-[11px] text-zinc-400">
            {selectedFilament.name}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {filaments.map((mat) => {
            const isSelected = selectedFilament.id === mat.id;
            return (
              <button
                key={mat.id}
                type="button"
                onClick={() => onSelectFilament(mat)}
                className={`relative group flex flex-col items-center p-2 rounded-md border text-center transition-all ${
                  isSelected
                    ? 'border-signal-orange bg-zinc-900/90 shadow-glow-orange'
                    : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                }`}
              >
                {/* Tactical Color Dot */}
                <div
                  className="w-7 h-7 rounded-full border border-white/20 shadow-inner flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ backgroundColor: mat.hexColor }}
                >
                  {isSelected && (
                    <Check
                      className={`w-3.5 h-3.5 ${
                        mat.hexColor === '#f4f4f5' ? 'text-black' : 'text-white'
                      }`}
                    />
                  )}
                </div>

                <span className="mt-1.5 font-mono text-[10px] text-zinc-300 truncate w-full">
                  {mat.name.split(' ')[0]}
                </span>
                <span className="font-mono text-[9px] text-zinc-500">
                  ${mat.costPerCm3.toFixed(3)}/cm³
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Optional Translucent Resin Inlay (Cavity Pocket Infusion) */}
      <div className="p-3 bg-surface rounded-lg border border-surface-border">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-1.5">
            <Droplets className="w-3.5 h-3.5 text-signal-cyan" />
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Floor Resin Inlay (Optional)
            </span>
          </div>
          <span className="font-mono text-[11px] text-zinc-400">
            {selectedResin ? selectedResin.name : 'None (Dry Pocket)'}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {/* Option: None */}
          <button
            type="button"
            onClick={() => onSelectResin(null)}
            className={`flex flex-col items-center p-2 rounded-md border transition-all ${
              selectedResin === null
                ? 'border-signal-cyan bg-zinc-900/90 shadow-glow-cyan'
                : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
            }`}
          >
            <div className="w-6 h-6 rounded-full border border-dashed border-zinc-600 flex items-center justify-center">
              <span className="font-mono text-[9px] text-zinc-500">OFF</span>
            </div>
            <span className="mt-1 font-mono text-[10px] text-zinc-400">None</span>
          </button>

          {/* Resin Options */}
          {resins.map((resin) => {
            const isSelected = selectedResin?.id === resin.id;
            return (
              <button
                key={resin.id}
                type="button"
                onClick={() => onSelectResin(resin)}
                className={`relative group flex flex-col items-center p-2 rounded-md border transition-all ${
                  isSelected
                    ? 'border-signal-cyan bg-zinc-900/90 shadow-glow-cyan'
                    : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center opacity-90 shadow-inner group-hover:scale-105 transition-transform"
                  style={{
                    backgroundColor: resin.hexColor,
                    boxShadow: `0 0 10px ${resin.hexColor}40`,
                  }}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="mt-1 font-mono text-[9px] text-zinc-300 truncate w-full text-center">
                  {resin.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
