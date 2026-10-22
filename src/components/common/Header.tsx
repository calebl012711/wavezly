/**
 * FORMGRID INDUSTRIAL NAVIGATION HEADER
 * Live telemetry indicators, system status tickers, currency converter, and production cart trigger
 */

import React, { useState, useEffect } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { Box, ShoppingBag, Radio, Activity, Globe, Cpu, Volume2, VolumeX } from 'lucide-react';
import { PrintFarmClusterModal } from './PrintFarmClusterModal';
import { playClickSound, isSoundMuted, toggleSoundMute, subscribeToMuteState } from '../../lib/soundEffects';

interface HeaderProps {
  currentRoute: 'home' | 'customizer' | 'tracking';
  onNavigate: (route: 'home' | 'customizer' | 'tracking') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate }) => {
  const { openCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'CAD'>('USD');
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [muted, setMuted] = useState(isSoundMuted());

  useEffect(() => {
    return subscribeToMuteState((m) => setMuted(m));
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-background/85 backdrop-blur-md border-b border-surface-border">
      {/* Precision Top Status Ticker */}
      <div className="hidden sm:flex items-center justify-between px-6 py-1 bg-surface-subtle border-b border-surface-border font-mono text-[10px] text-zinc-400">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              setIsFarmModalOpen(true);
            }}
            className="flex items-center space-x-1.5 px-2 py-0.5 -mx-1.5 rounded hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700 transition cursor-pointer group"
            title="Inspect 34-Node Print Farm Telemetry, Thermal Gauges & Slicing Queue"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal-lime animate-pulse" />
            <span className="text-zinc-300 group-hover:text-white font-semibold transition-colors">
              PRINT FARM: OPERATIONAL (34 NODES)
            </span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-signal-lime/10 text-signal-lime font-mono border border-signal-lime/30 group-hover:bg-signal-lime group-hover:text-black transition">
              LIVE TELEMETRY
            </span>
          </button>
          <span className="text-zinc-600">|</span>
          <span className="flex items-center space-x-1.5">
            <Radio className="w-3 h-3 text-signal-cyan" />
            <span>US DOMESTIC HUB: 98.4% ON-TIME</span>
          </span>
        </div>

        <div className="flex items-center space-x-3 text-zinc-500">
          <span>TOLERANCE: ISO 2768-m (±0.25MM)</span>
          <span>•</span>
          {/* Currency Selector */}
          <div className="flex items-center space-x-1 text-zinc-400">
            <Globe className="w-3 h-3 text-zinc-500" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="bg-transparent text-zinc-300 hover:text-white cursor-pointer focus:outline-none"
            >
              <option value="USD" className="bg-surface text-zinc-200">USD ($)</option>
              <option value="EUR" className="bg-surface text-zinc-200">EUR (€)</option>
              <option value="GBP" className="bg-surface text-zinc-200">GBP (£)</option>
              <option value="CAD" className="bg-surface text-zinc-200">CAD ($)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between font-mono">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-3 group text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-surface border border-zinc-700 group-hover:border-signal-orange flex items-center justify-center transition-colors">
            <div className="w-3.5 h-3.5 bg-signal-orange rounded-sm" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold tracking-tight text-lg text-precision-white group-hover:text-signal-orange transition-colors font-sans">
                FORMGRID
              </span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                V3
              </span>
            </div>
            <span className="hidden sm:block text-[9px] text-zinc-500 uppercase tracking-widest font-mono">
              Parametric Desktop Architecture
            </span>
          </div>
        </button>

        {/* Center Navigation Links */}
        <nav className="flex items-center space-x-1 sm:space-x-2 text-xs">
          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              onNavigate('home');
            }}
            className={`px-3 py-1.5 rounded-md transition ${
              currentRoute === 'home'
                ? 'text-precision-white bg-surface border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Storefront
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              onNavigate('customizer');
            }}
            className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition ${
              currentRoute === 'customizer'
                ? 'text-signal-orange bg-signal-orange/10 border border-signal-orange/40 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Parametric Studio</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              onNavigate('tracking');
            }}
            className={`px-3 py-1.5 rounded-md hidden md:flex items-center space-x-1.5 transition ${
              currentRoute === 'tracking'
                ? 'text-precision-white bg-surface border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-signal-cyan" />
            <span>Track Order</span>
          </button>

          {/* Farm Telemetry Button for mobile screens */}
          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              setIsFarmModalOpen(true);
            }}
            className="px-2 py-1.5 rounded-md flex sm:hidden items-center space-x-1 text-zinc-400 hover:text-signal-lime hover:bg-surface border border-transparent hover:border-zinc-700 transition"
            title="Inspect 34-Node Print Farm Telemetry"
          >
            <Cpu className="w-3.5 h-3.5 text-signal-lime" />
            <span className="text-[11px] font-semibold">Farm</span>
          </button>
        </nav>

        {/* Right Action: Sound Mute Toggle & Cart Trigger */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            type="button"
            onClick={() => toggleSoundMute()}
            title={muted ? 'Unmute Tactile Sound FX' : 'Mute Tactile Sound FX'}
            className={`p-2 rounded-lg border transition shadow-tactile ${
              muted
                ? 'bg-surface border-surface-border text-zinc-500 hover:text-zinc-300'
                : 'bg-surface border-signal-orange/30 text-signal-orange hover:bg-surface-subtle'
            }`}
            aria-label={muted ? 'Unmute audio' : 'Mute audio'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              openCart();
            }}
            className="relative flex items-center space-x-2 py-2 px-3 rounded-lg bg-surface hover:bg-surface-subtle border border-surface-border text-xs text-precision-white transition shadow-tactile"
          >
            <ShoppingBag className="w-4 h-4 text-signal-orange" />
            <span className="hidden sm:inline font-medium">DISPATCH QUEUE</span>
            {itemCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-signal-orange text-black font-bold text-[10px] flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 34-Node Print Farm Cluster Telemetry Modal */}
      <PrintFarmClusterModal
        isOpen={isFarmModalOpen}
        onClose={() => setIsFarmModalOpen(false)}
      />
    </header>
  );
};
