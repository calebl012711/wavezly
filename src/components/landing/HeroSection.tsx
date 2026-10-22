/**
 * SNUGFIT CONSUMER HERO SECTION
 * Clean, punchy, un-cluttered, consumer-friendly hero showcasing custom organizers
 * for every room in the home: Kitchen, Vanity, Bedside, Living Room, and Workspace.
 */

import React, { useState } from 'react';
import { LiveShowcase, RoomPresetKey, ROOM_PRESETS } from './LiveShowcase';
import { ArrowRight, Sliders, ShoppingBag, ShieldCheck, CheckCircle2, Star, Sparkles } from 'lucide-react';
import { playClickSound } from '../../lib/soundEffects';

interface HeroSectionProps {
  onLaunchStudio: () => void;
  onExploreCatalog: () => void;
  onOpenDeskPlanner?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onLaunchStudio,
  onExploreCatalog,
}) => {
  const [selectedRoom, setSelectedRoom] = useState<RoomPresetKey>('kitchen');

  const handleRoomSelect = (roomKey: RoomPresetKey) => {
    setSelectedRoom(roomKey);
  };

  return (
    <section className="relative pt-6 sm:pt-10 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Soft Texture */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:28px_28px] opacity-60" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Clear, Non-Wordy Consumer Headline & CTA */}
        <div className="lg:col-span-6 space-y-5 sm:space-y-6">
          {/* Top Friendly Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/90 dark:border-orange-800/60 text-xs font-sans text-orange-800 dark:text-orange-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-signal-orange animate-pulse" />
            <span className="font-semibold tracking-wide">MADE TO MEASURE FOR YOUR HOME</span>
            <span className="text-orange-300 dark:text-orange-700">•</span>
            <span>SHIPS IN 48 HOURS</span>
          </div>

          {/* Main Headline: Bold, Direct, Not Narrow */}
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-zinc-950 dark:text-white leading-[1.1] font-sans">
            Custom organizers made to fit{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              every space in your home.
            </span>
          </h1>

          {/* Clear Subtitle: Exactly 1 Friendly Sentence */}
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 font-normal leading-relaxed">
            Stop buying bins that slide around. Design custom-sized organizers for your kitchen, vanity, bedside, and workspace—or shop ready-to-ship essentials.
          </p>

          {/* Interactive Room Quick-Pills: Proves it's for the WHOLE home */}
          <div className="space-y-2 pt-1">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Choose Your Space:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(ROOM_PRESETS) as RoomPresetKey[]).map((key) => {
                const preset = ROOM_PRESETS[key];
                const isSelected = selectedRoom === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      playClickSound('snap');
                      handleRoomSelect(key);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer border ${
                      isSelected
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-sm scale-102'
                        : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-orange-300 hover:bg-orange-50/40'
                    }`}
                  >
                    <span>{preset.emoji}</span>
                    <span>{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3.5 pt-2">
            <button
              type="button"
              onClick={() => {
                playClickSound('snap');
                onLaunchStudio();
              }}
              className="py-3.5 px-6 rounded-xl bg-signal-orange hover:bg-orange-600 text-white font-sans font-semibold text-sm tracking-wide flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>Customize Any Space</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound('tick');
                onExploreCatalog();
              }}
              className="py-3.5 px-6 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-sans font-medium text-sm tracking-wide flex items-center justify-center space-x-2 shadow-xs transition cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-zinc-500" />
              <span>Shop All Goods</span>
            </button>
          </div>

          {/* Consumer Trust Strip */}
          <div className="pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80 grid grid-cols-3 gap-2 text-center sm:text-left text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center space-x-1.5 justify-center sm:justify-start">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-medium text-zinc-800 dark:text-zinc-200">100% Fit Guarantee</span>
            </div>
            <div className="flex items-center space-x-1.5 justify-center sm:justify-start">
              <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span className="font-medium text-zinc-800 dark:text-zinc-200">Made in USA</span>
            </div>
            <div className="flex items-center space-x-1.5 justify-center sm:justify-start">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">4.9/5 Rating</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive 3D Model that dynamically reflects selected room */}
        <div className="lg:col-span-6">
          <LiveShowcase
            activeRoom={selectedRoom}
            onSelectRoom={handleRoomSelect}
          />
        </div>
      </div>
    </section>
  );
};
