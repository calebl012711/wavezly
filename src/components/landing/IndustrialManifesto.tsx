/**
 * FORMGRID INDUSTRIAL MANIFESTO, ZERO-INVENTORY CALCULATOR & FAQ
 * Dieter Rams philosophy, interactive tooling economics calculator, and production FAQs
 */

import React, { useState } from 'react';
import {
  Compass,
  Zap,
  ChevronDown,
  ChevronUp,
  Check,
  Mail,
  Copy,
} from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'How does the split-fulfillment delivery system work?',
    a: 'When you order both a custom parametric 3D organizer and an in-stock accessory (e.g. ScreenBar or Desk Mat), our system bifurcates the order. Custom 3D prints are sliced in real-time and queued at our high-speed automated print farm (2–4 business days). In-stock accessories ship immediately from domestic US warehouses via USPS Priority (2–3 business days). You receive separate tracking numbers with zero delivery confusion.',
  },
  {
    q: 'What dimensional tolerances are guaranteed on custom 3D organizers?',
    a: 'We calibrate every printer node to ±0.25mm linear dimensional tolerance according to ISO 2768-m standards. If your custom print fails to fit your designated drawer cavity, we will re-slice and dispatch a replacement unit at zero cost.',
  },
  {
    q: 'Can I download the raw binary STL file and print it myself?',
    a: 'Yes. Every custom configuration generates an instant client-side binary STL buffer compliant with IEEE 754 Little-Endian standards. You can download the STL directly from the studio panel to slice in Bambu Studio, PrusaSlicer, or Cura.',
  },
  {
    q: 'What is the optical resin inlay and is it safe?',
    a: 'Our optional pocket resin inlay is a multi-pass UV-cured optical grade epoxy poured flush into the chamber base. It provides tactile acoustic dampening when keys, pens, or metal objects are dropped into the tray. Fully cured, inert, and odorless.',
  },
];

export const IndustrialManifesto: React.FC = () => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [email, setEmail] = useState('');
  const [discountCopied, setDiscountCopied] = useState(false);
  const [showPromo, setShowPromo] = useState(false);

  // Comparative Calculator State: Quantity of custom desk trays
  const [calcQty, setCalcQty] = useState(1);

  const traditionalMoldCost = 8500; // Injection mold tooling cost
  const traditionalUnitCost = 4.5;
  const traditionalLeadWeeks = 10;
  const traditionalTotal = traditionalMoldCost + traditionalUnitCost * calcQty;

  const formgridUnitCost = 34.5;
  const formgridTotal = formgridUnitCost * calcQty;
  const formgridLeadDays = 3;

  const savings = traditionalTotal - formgridTotal;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setShowPromo(true);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('FORMGRID10');
    setDiscountCopied(true);
    setTimeout(() => setDiscountCopied(false), 2500);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-surface-border font-mono space-y-16">
      {/* 1. Dieter Rams 10 Principles Tribute */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-xs text-signal-orange uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>INDUSTRIAL PHILOSOPHY // DIETER RAMS HOMAGE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-precision-white font-sans max-w-2xl">
          Ten Principles of Good Architecture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-zinc-400">
          <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-1.5">
            <span className="text-signal-orange font-bold">01. INNOVATIVE</span>
            <p className="font-sans text-zinc-300">Continuous WebGL procedural parametrization replacing static molds.</p>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-1.5">
            <span className="text-signal-cyan font-bold">02. USEFUL</span>
            <p className="font-sans text-zinc-300">Zero dead space. Sized to the exact millimeter coordinates of your desk.</p>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-1.5">
            <span className="text-signal-lime font-bold">03. AESTHETIC</span>
            <p className="font-sans text-zinc-300">Tactile matte finishes, crisp micro-borders, and deep shadow definition.</p>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-1.5">
            <span className="text-zinc-200 font-bold">04. UNINTRUSIVE</span>
            <p className="font-sans text-zinc-300">Neutral monochromatic surfaces that showcase your tools, not themselves.</p>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-1.5">
            <span className="text-signal-amber font-bold">05. HONEST</span>
            <p className="font-sans text-zinc-300">Celebrates additive layer mechanics rather than pretending to be plastic injection.</p>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-1.5">
            <span className="text-signal-orange font-bold">06. AS LITTLE DESIGN AS POSSIBLE</span>
            <p className="font-sans text-zinc-300">Pure geometric primitives, structural internal dividers, zero decorative clutter.</p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Tooling Economics Calculator */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-4">
          <div>
            <div className="text-xs text-signal-lime uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> ZERO SURPLUS INVENTORY PARADIGM
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-100 font-sans">
              Traditional Injection Tooling vs. On-Demand Print Farm
            </h3>
          </div>

          <div className="flex items-center space-x-2 text-xs bg-black/60 px-3 py-1.5 rounded-lg border border-zinc-800">
            <span className="text-zinc-400">BATCH QUANTITY:</span>
            <span className="text-signal-orange font-bold">{calcQty} UNIT(S)</span>
          </div>
        </div>

        {/* Quantity Range Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Production Units Needed:</span>
            <span className="font-bold text-precision-white">{calcQty} Trays</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            value={calcQty}
            onChange={(e) => setCalcQty(parseInt(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-signal-orange"
          />
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Traditional Mold */}
          <div className="p-5 rounded-xl bg-black/50 border border-zinc-800 space-y-3 opacity-70">
            <div className="text-xs text-zinc-500 uppercase tracking-wider">
              TRADITIONAL STEEL INJECTION MOLD
            </div>
            <div className="text-2xl font-bold text-zinc-300 font-sans">
              ${traditionalTotal.toLocaleString()} USD
            </div>
            <div className="space-y-1 text-[11px] text-zinc-400">
              <div>• Initial Tooling Steel CNC: $8,500 Upfront</div>
              <div>• Minimum Lead Time: {traditionalLeadWeeks} Weeks Transit</div>
              <div>• Minimum Order Requirement: 1,000+ Units</div>
              <div>• Geometry Flexibility: Fixed (0 Changes Permitted)</div>
            </div>
          </div>

          {/* Formgrid On-Demand Farm */}
          <div className="p-5 rounded-xl bg-gradient-to-b from-signal-orange/10 to-transparent border border-signal-orange/50 space-y-3">
            <div className="flex items-center justify-between text-xs text-signal-orange uppercase tracking-wider font-bold">
              <span>FORMGRID AUTONOMOUS PRINT FARM</span>
              <span className="text-signal-lime">INSTANT ON-DEMAND</span>
            </div>
            <div className="text-2xl font-bold text-signal-orange font-sans">
              ${formgridTotal.toLocaleString()} USD
            </div>
            <div className="space-y-1 text-[11px] text-zinc-300">
              <div>• Upfront Tooling or Mold Cost: <span className="text-signal-lime font-bold">$0.00</span></div>
              <div>• Farm Dispatch Lead Time: <span className="text-precision-white font-bold">{formgridLeadDays} Days</span></div>
              <div>• Minimum Order Quantity: <span className="text-precision-white font-bold">1 Unit (Custom Sized)</span></div>
              <div>• Parametric Customization: <span className="text-signal-orange font-bold">Infinite Continuous</span></div>
            </div>
          </div>
        </div>

        {/* Net Savings Callout */}
        <div className="p-3 rounded-lg bg-surface-subtle border border-zinc-800 text-xs text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-zinc-400">
            Net capital conserved by avoiding upfront tooling molds:
          </span>
          <span className="text-signal-lime font-bold text-sm">
            +${savings.toLocaleString()} USD SAVED
          </span>
        </div>
      </div>

      {/* 3. Interactive FAQ Accordion */}
      <div className="space-y-4">
        <div className="text-xs text-signal-cyan uppercase tracking-wider">
          TECHNICAL INQUIRIES & RESOLUTIONS
        </div>
        <h3 className="text-2xl font-bold text-precision-white font-sans">
          Frequently Answered Logistics & Fabrication Specifications
        </h3>

        <div className="space-y-2 pt-2">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-surface border border-surface-border overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs text-zinc-200 font-bold hover:text-signal-orange transition"
                >
                  <span className="font-sans">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-signal-orange flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-zinc-400 font-sans leading-relaxed border-t border-zinc-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Marketing Newsletter Signup with Instant Blueprint Credit */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-surface to-black border border-surface-border flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <div className="flex items-center space-x-1.5 text-xs text-signal-orange font-bold uppercase">
            <Mail className="w-4 h-4" />
            <span>DISPATCH ARCHIVE SUBSCRIPTION</span>
          </div>
          <h4 className="text-xl font-bold text-precision-white font-sans">
            Join the Industrial Fabrication Enclave
          </h4>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            Receive monthly CAD blueprint releases, new material drops (Carbon-fiber PLA, Ceramic Resin), and an instant 10% credit code for your first custom print.
          </p>
        </div>

        <div className="w-full md:w-auto">
          {showPromo ? (
            <div className="p-4 rounded-xl bg-surface border border-signal-orange/40 flex items-center space-x-3">
              <div>
                <div className="text-[10px] text-zinc-500">YOUR 10% DISCOUNT CODE:</div>
                <div className="text-base font-bold text-signal-orange">FORMGRID10</div>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-precision-white transition"
                title="Copy code"
              >
                {discountCopied ? <Check className="w-4 h-4 text-signal-lime" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex items-center space-x-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@studio.design"
                className="bg-black/80 px-4 py-2.5 rounded-lg border border-zinc-700 text-xs text-precision-white placeholder-zinc-600 focus:outline-none focus:border-signal-orange"
              />
              <button
                type="submit"
                className="py-2.5 px-4 rounded-lg bg-signal-orange hover:bg-orange-600 text-black font-bold text-xs tracking-wider transition shadow-glow-orange flex-shrink-0"
              >
                CLAIM 10%
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
