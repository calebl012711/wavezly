/**
 * WAVEZLY MINIMALIST DTC FOOTER
 * Clean, human, grounded e-commerce footer without AI buzzwords or fake telemetry.
 */

import React, { useState } from 'react';
import {
  ArrowUp,
  Check,
} from 'lucide-react';
import { WavezlyLogo } from './WavezlyLogo';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
  };

  return (
    <footer className="w-full bg-white border-t border-zinc-200 text-[#0F172A] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-zinc-100">
          {/* Brand & Newsletter (5 cols) */}
          <div className="md:col-span-5 max-w-sm">
            <WavezlyLogo theme="light" size="md" />
            <p className="mt-3 text-xs sm:text-sm text-zinc-500 leading-relaxed">
              Everyday objects and made-to-measure goods, 3D printed to order in the USA. Designed for clean desks, cozy rooms, and tactile play.
            </p>

            <form onSubmit={handleSubscribe} className="mt-5">
              <span className="text-xs font-bold text-zinc-700 block mb-1.5">
                Stay updated on new 3D drops
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#FF6B00] text-zinc-800"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0F172A] hover:bg-[#FF6B00] text-white text-xs font-bold rounded-lg transition cursor-pointer shrink-0"
                >
                  {isSubscribed ? <Check className="w-4 h-4 text-emerald-400" /> : 'Join'}
                </button>
              </div>
              {isSubscribed && (
                <span className="text-[11px] text-emerald-600 mt-1 block">
                  You're on the list!
                </span>
              )}
            </form>
          </div>

          {/* Directory Links (7 cols) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Shop
              </h3>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li><a href="#shop" className="hover:text-[#FF6B00] transition">Desk Fidgets & Toys</a></li>
                <li><a href="#shop" className="hover:text-[#FF6B00] transition">Ambient Lamps</a></li>
                <li><a href="#shop" className="hover:text-[#FF6B00] transition">Coffee & Kitchen</a></li>
                <li><a href="#shop" className="hover:text-[#FF6B00] transition">Car Accessories</a></li>
                <li><a href="#shop" className="hover:text-[#FF6B00] transition">Custom Drawer Trays</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Customer Care
              </h3>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li><a href="/tracking" className="hover:text-[#FF6B00] transition">Track Your Order</a></li>
                <li><a href="#shipping" className="hover:text-[#FF6B00] transition">Shipping Information</a></li>
                <li><a href="#guarantee" className="hover:text-[#FF6B00] transition">100% Fit Guarantee</a></li>
                <li><a href="#returns" className="hover:text-[#FF6B00] transition">Returns & Exchanges</a></li>
                <li><a href="#contact" className="hover:text-[#FF6B00] transition">Contact Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                About Wavezly
              </h3>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li><a href="#story" className="hover:text-[#FF6B00] transition">Our US Print Farm</a></li>
                <li><a href="#materials" className="hover:text-[#FF6B00] transition">Eco-PLA Materials</a></li>
                <li><a href="#custom" className="hover:text-[#FF6B00] transition">How Custom Sizing Works</a></li>
                <li><a href="#wholesale" className="hover:text-[#FF6B00] transition">Wholesale & Fleet</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} Wavezly Goods Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-zinc-600 transition">Privacy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-zinc-600 transition">Terms</a>
            <span>•</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-[#FF6B00] transition cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
