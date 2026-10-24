/**
 * WAVEZLY MODERN MINIMALIST DTC FOOTER
 * Concept 1: Warm Minimalist DTC
 * - Clean airy zinc-50 background with subtle border
 * - Top Trust Strip with 4 high-craft value props & electric orange accents
 * - Clean typographic directory columns ("Collections", "Custom Sizing", "Print Farm Telemetry", "Company")
 * - Modern Newsletter subscription card with live feedback
 * - Streamlined bottom bar with Wavezly logo, carbon neutral badge, legal links, and smooth back-to-top
 */

import React, { useState } from 'react';
import {
  Truck,
  ShieldCheck,
  Leaf,
  Headphones,
  ArrowUp,
  ArrowRight,
  Check,
  Sparkles,
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
    <footer className="w-full bg-zinc-50 border-t border-zinc-200 text-[#0F172A] font-sans antialiased">
      {/* ============================================================ */}
      {/* 1. TOP TRUST STRIP                                           */}
      {/* ============================================================ */}
      <section className="border-b border-zinc-200/80 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Value Prop 1: 48h US Print Farm Dispatch */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-zinc-200/70 shadow-xs hover:border-orange-200 hover:shadow-sm transition-all duration-200 group">
              <div className="w-12 h-12 rounded-xl bg-[#FFF5ED] border border-[#FFE2CC] flex items-center justify-center text-[#FF6B00] shrink-0 group-hover:scale-105 transition-transform duration-200">
                <Truck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#0F172A] tracking-tight">
                  48h US Print Farm Dispatch
                </h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Precision additive manufacturing on demand from Idaho & California.
                </p>
              </div>
            </div>

            {/* Value Prop 2: 100% Snug Fit Guarantee */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-zinc-200/70 shadow-xs hover:border-orange-200 hover:shadow-sm transition-all duration-200 group">
              <div className="w-12 h-12 rounded-xl bg-[#FFF5ED] border border-[#FFE2CC] flex items-center justify-center text-[#FF6B00] shrink-0 group-hover:scale-105 transition-transform duration-200">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#0F172A] tracking-tight">
                  100% Snug Fit Guarantee
                </h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Millimeter-accurate tolerances. If it doesn't snap in snug, we reprint free.
                </p>
              </div>
            </div>

            {/* Value Prop 3: Recyclable Eco-Biopolymers */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-zinc-200/70 shadow-xs hover:border-orange-200 hover:shadow-sm transition-all duration-200 group">
              <div className="w-12 h-12 rounded-xl bg-[#FFF5ED] border border-[#FFE2CC] flex items-center justify-center text-[#FF6B00] shrink-0 group-hover:scale-105 transition-transform duration-200">
                <Leaf className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#0F172A] tracking-tight">
                  Recyclable Eco-Biopolymers
                </h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Zero petroleum plastics. 100% compostable, non-toxic plant starch PLA.
                </p>
              </div>
            </div>

            {/* Value Prop 4: 24/7 Maker Support */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-zinc-200/70 shadow-xs hover:border-orange-200 hover:shadow-sm transition-all duration-200 group">
              <div className="w-12 h-12 rounded-xl bg-[#FFF5ED] border border-[#FFE2CC] flex items-center justify-center text-[#FF6B00] shrink-0 group-hover:scale-105 transition-transform duration-200">
                <Headphones className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#0F172A] tracking-tight">
                  24/7 Maker Support
                </h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Direct live chat with real additive manufacturing engineers & designers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. MAIN DIRECTORY & NEWSLETTER SECTION                       */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">
          {/* Left: 4 Directory Columns (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Column 1: Collections */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
                Collections
              </h3>
              <ul className="space-y-2.5 text-sm text-zinc-600">
                <li>
                  <a href="#desk" className="hover:text-[#FF6B00] transition">
                    Desk Organization
                  </a>
                </li>
                <li>
                  <a href="#kitchen" className="hover:text-[#FF6B00] transition">
                    Kitchen & Coffee
                  </a>
                </li>
                <li>
                  <a href="#mounts" className="hover:text-[#FF6B00] transition">
                    Smart Home Mounts
                  </a>
                </li>
                <li>
                  <a href="#planters" className="hover:text-[#FF6B00] transition">
                    Planters & Decor
                  </a>
                </li>
                <li>
                  <a href="#fidgets" className="hover:text-[#FF6B00] transition">
                    Kinetic Fidgets
                  </a>
                </li>
                <li>
                  <a href="#cables" className="hover:text-[#FF6B00] transition">
                    Cable Management
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Custom Sizing */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
                Custom Sizing
              </h3>
              <ul className="space-y-2.5 text-sm text-zinc-600">
                <li>
                  <a href="#planner" className="hover:text-[#FF6B00] transition">
                    Desk Space Planner
                  </a>
                </li>
                <li>
                  <a href="#custom-tray" className="hover:text-[#FF6B00] transition">
                    Custom Drawer Trays
                  </a>
                </li>
                <li>
                  <a href="#caliper" className="hover:text-[#FF6B00] transition">
                    Precision Caliper Guide
                  </a>
                </li>
                <li>
                  <a href="#custom-cad" className="hover:text-[#FF6B00] transition">
                    Request Custom CAD
                  </a>
                </li>
                <li>
                  <a href="#tolerance" className="hover:text-[#FF6B00] transition">
                    Tolerance Testing Kit
                  </a>
                </li>
                <li>
                  <a href="#bulk" className="hover:text-[#FF6B00] transition">
                    Volume Fleet Orders
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Print Farm Telemetry */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
                Print Farm Telemetry
              </h3>
              <ul className="space-y-2.5 text-sm text-zinc-600">
                <li>
                  <a href="#live-farm" className="hover:text-[#FF6B00] transition inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Farm Status
                  </a>
                </li>
                <li>
                  <a href="#fleet" className="hover:text-[#FF6B00] transition">
                    Bambu Lab X1C Fleet
                  </a>
                </li>
                <li>
                  <a href="#materials" className="hover:text-[#FF6B00] transition">
                    Biopolymer Filaments
                  </a>
                </li>
                <li>
                  <a href="#queue" className="hover:text-[#FF6B00] transition">
                    Production Queue (48h)
                  </a>
                </li>
                <li>
                  <a href="#quality" className="hover:text-[#FF6B00] transition">
                    Quality Inspection Log
                  </a>
                </li>
                <li>
                  <a href="#carbon" className="hover:text-[#FF6B00] transition">
                    Carbon Offset Audit
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Company */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
                Company
              </h3>
              <ul className="space-y-2.5 text-sm text-zinc-600">
                <li>
                  <a href="#about" className="hover:text-[#FF6B00] transition">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#mission" className="hover:text-[#FF6B00] transition">
                    Zero-Waste Mission
                  </a>
                </li>
                <li>
                  <a href="#artisans" className="hover:text-[#FF6B00] transition">
                    Artisan Partners
                  </a>
                </li>
                <li>
                  <a href="#careers" className="hover:text-[#FF6B00] transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#press" className="hover:text-[#FF6B00] transition">
                    Press & Media Kit
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-[#FF6B00] transition">
                    Contact Concierge
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Newsletter Signup Card (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-zinc-200/90 shadow-xs">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#FF6B00] border border-orange-200/60 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Maker Dispatch & Weekly Drops</span>
              </div>

              <h4 className="text-base font-bold text-[#0F172A] tracking-tight">
                Crafted for precision living.
              </h4>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed mb-5">
                Get weekly parametric design releases, early access to new modular organizers, and behind-the-scenes print farm telemetry.
              </p>

              {isSubscribed ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs flex items-center gap-2.5 animate-fadeIn">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-900">You're subscribed!</p>
                    <p className="text-emerald-700 mt-0.5">Welcome to the Wavezly precision maker community.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B00]/25 focus:border-[#FF6B00] transition"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#FF6B00] hover:bg-[#FF7A00] text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <span>Subscribe to Drops</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-zinc-400 text-center">
                    Zero spam. Unsubscribe with 1 click at any time.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. STREAMLINED BOTTOM BAR                                    */}
      {/* ============================================================ */}
      <section className="border-t border-zinc-200/90 bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Wavezly Logo & Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div onClick={scrollToTop} className="cursor-pointer hover:opacity-90 transition">
              <WavezlyLogo theme="light" size="sm" />
            </div>
            <span className="text-xs text-zinc-500">
              © {new Date().getFullYear()} Wavezly Inc. Domestic additive manufacturing in Boise, ID.
            </span>
          </div>

          {/* Center: 100% Carbon-Neutral Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>100% Carbon-Neutral US Print Farm</span>
          </div>

          {/* Right: Legal Links & Back-to-Top */}
          <div className="flex items-center gap-5">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500">
              <a href="#privacy" className="hover:text-[#FF6B00] transition">
                Privacy
              </a>
              <a href="#terms" className="hover:text-[#FF6B00] transition">
                Terms
              </a>
              <a href="#guarantee" className="hover:text-[#FF6B00] transition">
                Fit Guarantee
              </a>
              <a href="#telemetry" className="hover:text-[#FF6B00] transition">
                Telemetry
              </a>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-xl border border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-[#0F172A] transition shadow-2xs cursor-pointer flex items-center gap-1.5 text-xs font-medium px-2.5 ml-2"
              title="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span className="hidden sm:inline">Top</span>
            </button>
          </div>
        </div>
      </section>
    </footer>
  );
};
