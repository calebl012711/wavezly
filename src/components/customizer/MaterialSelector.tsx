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
      <div className="p-3 bg-slate-50/70 dark:bg-zinc-900/60 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span className="text-xs font-semibold text-[#0F172A] dark:text-zinc-200 uppercase tracking-wider">
              Structural Shell Material
            </span>
          </div>
          <span className="font-sans text-xs font-medium text-slate-500 dark:text-zinc-400">
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
                className={`relative group flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all min-h-[62px] cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'border-[#FF6B00] bg-white dark:bg-zinc-900 shadow-[0_2px_12px_rgba(255,107,0,0.14)] ring-1 ring-[#FF6B00]'
                    : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 hover:border-slate-300 dark:hover:border-zinc-700 shadow-2xs'
                }`}
              >
                {/* Tactical Color Dot */}
                <div
                  className="w-7 h-7 rounded-full border border-black/10 dark:border-white/20 shadow-xs flex items-center justify-center transition-transform group-hover:scale-105 shrink-0"
                  style={{ backgroundColor: mat.hexColor }}
                >
                  {isSelected && (
                    <Check
                      className={`w-3.5 h-3.5 ${
                        mat.hexColor === '#f4f4f5' || mat.hexColor === '#ece5db' ? 'text-black' : 'text-white'
                      }`}
                    />
                  )}
                </div>

                <span className="mt-1.5 font-sans text-[11px] font-semibold text-[#0F172A] dark:text-zinc-300 truncate w-full">
                  {mat.name.split(' ')[0]}
                </span>
                <span className="font-mono text-[9px] text-slate-400 dark:text-zinc-500">
                  ${mat.costPerCm3.toFixed(3)}/cm³
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Optional Translucent Resin Inlay (Cavity Pocket Infusion) */}
      <div className="p-3 bg-slate-50/70 dark:bg-zinc-900/60 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-1.5">
            <Droplets className="w-3.5 h-3.5 text-sky-500" />
            <span className="text-xs font-semibold text-[#0F172A] dark:text-zinc-200 uppercase tracking-wider">
              Floor Resin Inlay (Optional)
            </span>
          </div>
          <span className="font-sans text-xs font-medium text-slate-500 dark:text-zinc-400">
            {selectedResin ? selectedResin.name : 'None (Dry Pocket)'}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {/* Option: None */}
          <button
            type="button"
            onClick={() => onSelectResin(null)}
            className={`flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl border transition-all min-h-[54px] cursor-pointer active:scale-95 ${
              selectedResin === null
                ? 'border-sky-500 bg-white dark:bg-zinc-900 shadow-xs ring-1 ring-sky-500'
                : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 hover:border-slate-300 dark:hover:border-zinc-700 shadow-2xs'
            }`}
          >
            <div className="w-6 h-6 rounded-full border border-dashed border-slate-400 dark:border-zinc-600 flex items-center justify-center shrink-0">
              <span className="font-mono text-[9px] text-slate-400 dark:text-zinc-500">OFF</span>
            </div>
            <span className="mt-1 font-sans text-[10px] font-medium text-slate-600 dark:text-zinc-400">None</span>
          </button>

          {/* Resin Options */}
          {resins.map((resin) => {
            const isSelected = selectedResin?.id === resin.id;
            return (
              <button
                key={resin.id}
                type="button"
                onClick={() => onSelectResin(resin)}
                className={`relative group flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl border transition-all min-h-[54px] cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'border-sky-500 bg-white dark:bg-zinc-900 shadow-xs ring-1 ring-sky-500'
                    : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 hover:border-slate-300 dark:hover:border-zinc-700 shadow-2xs'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full border border-black/10 dark:border-white/30 flex items-center justify-center opacity-90 shadow-2xs group-hover:scale-105 transition-transform shrink-0"
                  style={{
                    backgroundColor: resin.hexColor,
                    boxShadow: `0 0 10px ${resin.hexColor}40`,
                  }}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="mt-1 font-sans text-[10px] font-medium text-slate-700 dark:text-zinc-300 truncate w-full text-center">
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
