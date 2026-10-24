/**
 * WAVEZLY BRAND LOGO COMPONENT
 * Renders the iconic 3D looped ribbon 'W' logo mark and stylized "Wavezly" wordmark
 * with optional Amazon-style smile swoosh and responsive sizing.
 */

import React from 'react';

interface WavezlyLogoProps {
  className?: string;
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showSmile?: boolean;
  showDomain?: boolean;
}

export const WavezlyLogo: React.FC<WavezlyLogoProps> = ({
  className = '',
  theme = 'dark',
  size = 'md',
  showSmile = true,
  showDomain = true,
}) => {
  const isDark = theme === 'dark';

  const markSize =
    size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const textClass =
    size === 'sm'
      ? 'text-lg'
      : size === 'lg'
      ? 'text-2xl sm:text-3xl'
      : 'text-xl sm:text-2xl';

  return (
    <div className={`inline-flex items-center gap-2 select-none group ${className}`}>
      {/* 1. 3D Ribbon Logo Mark */}
      <div className={`relative ${markSize} rounded-lg overflow-hidden shrink-0 bg-white shadow-xs p-0.5 border border-amber-200/40`}>
        <img
          src="/assets/logo/wavezly-logo.png"
          alt="Wavezly Mark"
          className="w-full h-full object-contain"
        />
      </div>

      {/* 2. Wavezly Wordmark & Smile Swoosh */}
      <div className="flex flex-col items-start leading-none">
        <div className="flex items-baseline">
          <span
            className={`font-black tracking-tight font-sans ${textClass} ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}
          >
            Wave<span className="text-[#ff9900]">zly</span>
          </span>
          {showDomain && (
            <span
              className={`font-bold ml-0.5 ${
                size === 'sm' ? 'text-[10px]' : 'text-xs'
              } ${isDark ? 'text-[#febd69]' : 'text-[#ea580c]'}`}
            >
              .com
            </span>
          )}
        </div>

        {/* Amazon Smile Swoosh in Orange */}
        {showSmile && (
          <svg
            className={`w-14 sm:w-16 h-2 text-[#ff9900] -mt-0.5 transition-transform group-hover:scale-105`}
            viewBox="0 0 100 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 5 5 Q 50 16 95 3"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <path
              d="M 91 1 L 96 4 L 92 8"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
};
