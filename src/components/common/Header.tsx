/**
 * FORMGRID CONSUMER LUXURY NAVIGATION HEADER
 * Light-mode prioritized, consumer brand navigation, currency converter, audio haptics, and shopping bag
 */

import React, { useState, useEffect } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { Box, ShoppingBag, Activity, Globe, Cpu, Volume2, VolumeX, Sun, Moon, Grid } from 'lucide-react';
import { PrintFarmClusterModal } from './PrintFarmClusterModal';
import { playClickSound, isSoundMuted, toggleSoundMute, subscribeToMuteState } from '../../lib/soundEffects';

interface HeaderProps {
  currentRoute: 'home' | 'customizer' | 'tracking';
  onNavigate: (route: 'home' | 'customizer' | 'tracking') => void;
  onOpenDeskPlanner?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate, onOpenDeskPlanner }) => {
  const { openCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'CAD'>('USD');
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [muted, setMuted] = useState(isSoundMuted());
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    return subscribeToMuteState((m) => setMuted(m));
  }, []);

  const toggleTheme = () => {
    playClickSound('snap');
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      root.classList.add('light');
      setIsDark(false);
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-200/90 dark:border-zinc-800 transition-colors">
      {/* Consumer Trust Ticker Strip */}
      <div className="hidden sm:flex items-center justify-between px-6 py-1.5 bg-[#f5f5f7] dark:bg-[#121214] border-b border-zinc-200/70 dark:border-zinc-800 text-[11px] font-sans text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-signal-lime" />
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              Crafted in USA • 2–4 Day Domestic Dispatch
            </span>
          </div>

          <span className="text-zinc-300 dark:text-zinc-700">|</span>

          {/* Crafting Studio Live Status Modal Trigger */}
          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              setIsFarmModalOpen(true);
            }}
            className="flex items-center space-x-1.5 hover:text-signal-orange transition cursor-pointer text-[10px] font-mono"
            title="Look Inside Our Crafting Studio"
          >
            <Cpu className="w-3 h-3 text-signal-orange" />
            <span>Live Workshop: Crafting Orders • Made in USA</span>
          </button>
        </div>

        <div className="flex items-center space-x-4 text-xs font-sans">
          <span className="text-zinc-500 font-medium">100% Fit Guarantee</span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>

          {/* Currency Selector */}
          <div className="flex items-center space-x-1 font-mono text-[11px]">
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="bg-transparent text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white cursor-pointer focus:outline-none font-medium"
            >
              <option value="USD" className="bg-white text-zinc-900">USD ($)</option>
              <option value="EUR" className="bg-white text-zinc-900">EUR (€)</option>
              <option value="GBP" className="bg-white text-zinc-900">GBP (£)</option>
              <option value="CAD" className="bg-white text-zinc-900">CAD ($)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => {
            playClickSound('snap');
            onNavigate('home');
          }}
          className="flex items-center space-x-3 group text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            <span className="w-3.5 h-3.5 bg-signal-orange rounded-sm" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-tight text-lg text-zinc-900 dark:text-white font-sans">
                SnugDesk
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-100 text-signal-orange font-mono font-bold dark:bg-orange-950/80">
                STUDIO
              </span>
            </div>
            <span className="hidden sm:block text-[10px] text-zinc-500 font-sans tracking-wide">
              Made to Fit Like a Glove
            </span>
          </div>
        </button>

        {/* Center Consumer Nav Links */}
        <nav className="flex items-center space-x-1 sm:space-x-2 font-sans text-xs">
          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              onNavigate('home');
            }}
            className={`px-3.5 py-2 rounded-lg font-medium transition ${
              currentRoute === 'home'
                ? 'text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50'
            }`}
          >
            Shop All
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              onNavigate('customizer');
            }}
            className={`px-3.5 py-2 rounded-lg flex items-center space-x-1.5 font-medium transition ${
              currentRoute === 'customizer'
                ? 'text-signal-orange bg-orange-50 dark:bg-orange-950/30 font-semibold border border-orange-200 dark:border-orange-900/50'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-signal-orange" />
            <span>3D Customizer</span>
          </button>

          {onOpenDeskPlanner && (
            <button
              type="button"
              onClick={() => {
                playClickSound('snap');
                onOpenDeskPlanner();
              }}
              className="px-3 py-2 rounded-lg hidden sm:flex items-center space-x-1.5 text-zinc-600 dark:text-zinc-400 hover:text-signal-orange dark:hover:text-signal-orange hover:bg-orange-50/50 dark:hover:bg-zinc-800 font-medium transition"
              title="Launch Interactive Desk Planner & Layout Designer"
            >
              <Grid className="w-3.5 h-3.5 text-signal-orange" />
              <span>Desk Planner</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-signal-orange/15 text-signal-orange font-mono font-bold border border-signal-orange/30">
                Interactive
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              onNavigate('tracking');
            }}
            className={`px-3 py-2 rounded-lg hidden md:flex items-center space-x-1.5 font-medium transition ${
              currentRoute === 'tracking'
                ? 'text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-signal-cyan" />
            <span>Track Order</span>
          </button>
        </nav>

        {/* Right Action Utilities */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Warm Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition shadow-sm"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-signal-amber" /> : <Moon className="w-4 h-4 text-zinc-600" />}
          </button>

          {/* Sound Mute Toggle */}
          <button
            type="button"
            onClick={() => toggleSoundMute()}
            title={muted ? 'Unmute Tactile Sound FX' : 'Mute Tactile Sound FX'}
            className={`p-2 rounded-lg border transition shadow-sm ${
              muted
                ? 'border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                : 'border-orange-200 dark:border-orange-900/40 text-signal-orange bg-orange-50/50 dark:bg-orange-950/20'
            }`}
            aria-label={muted ? 'Unmute audio' : 'Mute audio'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Shopping Bag Trigger */}
          <button
            type="button"
            onClick={() => {
              playClickSound('snap');
              openCart();
            }}
            className="relative flex items-center space-x-2 py-2 px-3.5 rounded-lg bg-zinc-900 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-black text-xs font-sans font-medium transition shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-signal-orange" />
            <span className="hidden sm:inline">Bag</span>
            {itemCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-signal-orange text-white font-bold text-[10px] flex items-center justify-center">
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
