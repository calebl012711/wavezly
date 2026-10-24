/**
 * WAVEZLY BRAND LOGO COMPONENT
 * Renders the isolated clean 3D ribbon mark (cropped transparently)
 * alongside a modern, stylish wordmark with electric orange accent.
 */

import React from 'react';

interface WavezlyLogoProps {
  className?: string;
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDomain?: boolean;
  showSmile?: boolean;
}

export const WavezlyLogo: React.FC<WavezlyLogoProps> = (props) => {
  const {
    className = '',
    theme = 'light',
    size = 'md',
    showDomain = false,
  } = props;
  const isDark = theme === 'dark';

  const markSize =
    size === 'sm'
      ? 'w-7 h-7'
      : size === 'lg'
      ? 'w-11 h-11'
      : size === 'xl'
      ? 'w-14 h-14'
      : 'w-9 h-9';

  const textClass =
    size === 'sm'
      ? 'text-lg'
      : size === 'lg'
      ? 'text-2xl sm:text-3xl'
      : size === 'xl'
      ? 'text-3xl sm:text-4xl'
      : 'text-xl sm:text-2xl';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none group ${className}`}>
      {/* 1. Cropped Clean Transparent 3D Ribbon Icon */}
      <img
        src="/assets/logo/wavezly-icon.png"
        alt="Wavezly Emblem"
        className={`${markSize} object-contain transition-transform duration-300 group-hover:scale-105 shrink-0`}
      />

      {/* 2. Modern Clean Wordmark */}
      <div className="flex items-baseline tracking-tight">
        <span
          className={`font-black font-sans leading-none ${textClass} ${
            isDark ? 'text-white' : 'text-[#0F172A]'
          }`}
        >
          Wave<span className="text-[#FF6B00]">zly</span>
        </span>
        {showDomain && (
          <span
            className={`font-bold ml-0.5 text-xs ${
              isDark ? 'text-[#FF8A33]' : 'text-[#FF6B00]'
            }`}
          >
            .com
          </span>
        )}
      </div>
    </div>
  );
};
