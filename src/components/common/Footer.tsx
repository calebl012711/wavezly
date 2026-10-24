/**
 * AUTHENTIC AMAZON 4-TIER FOOTER FOR WAVEZLY
 * 1. "Back to top" bar (#37475a)
 * 2. 4-column directory (#232f3e)
 * 3. Logo & Language/Currency selectors (#232f3e)
 * 4. Micro-services & Copyright legal strip (#131921)
 */

import React from 'react';
import { Globe, ArrowUp } from 'lucide-react';
import { WavezlyLogo } from './WavezlyLogo';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full font-sans select-none text-white">
      {/* ============================================================ */}
      {/* TIER 1: BACK TO TOP BAR (#37475a)                             */}
      {/* ============================================================ */}
      <button
        type="button"
        onClick={scrollToTop}
        className="w-full py-3.5 bg-[#37475a] hover:bg-[#485769] text-white text-xs font-semibold text-center transition cursor-pointer flex items-center justify-center gap-1.5"
      >
        <span>Back to top</span>
        <ArrowUp className="w-3.5 h-3.5" />
      </button>

      {/* ============================================================ */}
      {/* TIER 2: 4 DIRECTORY COLUMNS (#232f3e)                        */}
      {/* ============================================================ */}
      <div className="bg-[#232f3e] border-b border-[#3a4553] py-10 px-4 sm:px-8">
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-xs text-[#dddddd]">
          {/* Column 1 */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-sm mb-3">Get to Know Us</h4>
            <p className="hover:underline cursor-pointer">About Wavezly</p>
            <p className="hover:underline cursor-pointer">Careers at Wavezly</p>
            <p className="hover:underline cursor-pointer">Boise Craft Studio</p>
            <p className="hover:underline cursor-pointer">Sustainability & Zero Waste</p>
            <p className="hover:underline cursor-pointer">Wavezly Science & 3D Tech</p>
          </div>

          {/* Column 2 */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-sm mb-3">Make Money with Us</h4>
            <p className="hover:underline cursor-pointer">Sell products on Wavezly</p>
            <p className="hover:underline cursor-pointer">Become an Artisan Partner</p>
            <p className="hover:underline cursor-pointer">Become an Affiliate</p>
            <p className="hover:underline cursor-pointer">Advertise Your Products</p>
            <p className="hover:underline cursor-pointer">Self-Publish with Us</p>
          </div>

          {/* Column 3 */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-sm mb-3">Wavezly Payment Products</h4>
            <p className="hover:underline cursor-pointer">Wavezly Business Card</p>
            <p className="hover:underline cursor-pointer">Shop with Points</p>
            <p className="hover:underline cursor-pointer">Reload Your Balance</p>
            <p className="hover:underline cursor-pointer">Wavezly Currency Converter</p>
          </div>

          {/* Column 4 */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-sm mb-3">Let Us Help You</h4>
            <p className="hover:underline cursor-pointer">Your Account</p>
            <p className="hover:underline cursor-pointer">Your Orders</p>
            <p className="hover:underline cursor-pointer">Shipping Rates & Policies</p>
            <p className="hover:underline cursor-pointer">Returns & Replacements</p>
            <p className="hover:underline cursor-pointer">100% Fit Guarantee</p>
            <p className="hover:underline cursor-pointer">Help Center</p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TIER 3: LOGO & REGION / CURRENCY SELECTORS (#232f3e)         */}
      {/* ============================================================ */}
      <div className="bg-[#232f3e] py-6 px-4">
        <div className="max-w-[1000px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-[#cccccc]">
          {/* Wavezly Brand Logo */}
          <div onClick={scrollToTop} className="cursor-pointer hover:opacity-95 transition">
            <WavezlyLogo theme="dark" size="md" />
          </div>

          {/* Selector pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="px-3 py-1.5 rounded-sm border border-[#848688] hover:border-white text-xs flex items-center gap-2 text-white transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-zinc-300" />
              <span>🇺🇸 English</span>
            </button>

            <button
              type="button"
              className="px-3 py-1.5 rounded-sm border border-[#848688] hover:border-white text-xs text-white transition cursor-pointer"
            >
              $ USD - U.S. Dollar
            </button>

            <button
              type="button"
              className="px-3 py-1.5 rounded-sm border border-[#848688] hover:border-white text-xs flex items-center gap-1.5 text-white transition cursor-pointer"
            >
              <span className="text-sm">🇺🇸</span>
              <span>United States</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TIER 4: SUB-SERVICES & LEGAL STRIP (#131921)                 */}
      {/* ============================================================ */}
      <div className="bg-[#131921] py-8 px-4 text-[11px] text-[#999999]">
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 pb-8 border-b border-[#3a4553]/60">
          <div>
            <p className="font-bold text-white hover:underline cursor-pointer">Wavezly 3D Farm</p>
            <p className="text-[10px] text-[#888888]">Precision Rapid Domestic Manufacturing</p>
          </div>
          <div>
            <p className="font-bold text-white hover:underline cursor-pointer">Wavezly Prime</p>
            <p className="text-[10px] text-[#888888]">Fast, Free Delivery on Millions of Items</p>
          </div>
          <div>
            <p className="font-bold text-white hover:underline cursor-pointer">Wavezly Business</p>
            <p className="text-[10px] text-[#888888]">Everything For Your Commercial Studio</p>
          </div>
          <div>
            <p className="font-bold text-white hover:underline cursor-pointer">Wavezly Studio</p>
            <p className="text-[10px] text-[#888888]">Parametric 3D Design to the Millimeter</p>
          </div>
        </div>

        {/* Legal Links */}
        <div className="max-w-[1000px] mx-auto pt-6 flex flex-col items-center gap-2 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-[11px]">
            <span className="hover:underline cursor-pointer">Conditions of Use</span>
            <span className="hover:underline cursor-pointer">Privacy Notice</span>
            <span className="hover:underline cursor-pointer">Consumer Health Data Privacy Disclosure</span>
            <span className="hover:underline cursor-pointer">Your Ads Privacy Choices</span>
          </div>
          <p className="text-[10px] text-[#777777] mt-1">
            © 1996-{new Date().getFullYear()}, Wavezly.com, Inc. or its affiliates
          </p>
        </div>
      </div>
    </footer>
  );
};
