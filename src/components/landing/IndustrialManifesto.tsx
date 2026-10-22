/**
 * FORMGRID CONSUMER EDITORIAL, ZERO-WASTE PHILOSOPHY & FAQ
 * Prioritized Light Mode, sustainable on-demand crafting philosophy, and consumer FAQ
 */

import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  Mail,
  Copy,
  Leaf,
} from 'lucide-react';
import { playClickSound } from '../../lib/soundEffects';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'How does the split shipping delivery work?',
    a: 'When you order both a custom-sized 3D organizer and an in-stock accessory (such as our Merino Wool Desk Mat or ScreenBar), our studio splits the package. Custom items are 3D-crafted to your measurements and dispatched in 2–4 business days. In-stock accessories ship within 24 hours via USPS Priority (2–3 business days). You receive clear tracking for both packages with zero delivery confusion.',
  },
  {
    q: 'What if my custom tray doesn’t fit my drawer?',
    a: 'We offer an unconditional 100% Fit Guarantee. Every piece is precision-crafted to ±0.25mm tolerances. If your organizer does not fit your designated space, we will re-craft and rush a replacement to you at zero cost, or provide a full refund.',
  },
  {
    q: 'Can I download the 3D model and print it on my own printer?',
    a: 'Yes! Every design you configure in our 3D Studio generates an instant 3D print file (.STL) and print settings (for Bambu Lab, Prusa, and more). You can download the file directly from the studio panel to inspect or 3D print yourself at home.',
  },
  {
    q: 'What is the acoustic resin base inlay?',
    a: 'Our optional base inlay is an optical-grade resin layer poured flush into the tray floor. It creates a smooth, glass-like foundation that dampens sound when you place down keys, coins, or metallic pens, providing a satisfying, quiet drop.',
  },
];

export const IndustrialManifesto: React.FC = () => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [email, setEmail] = useState('');
  const [discountCopied, setDiscountCopied] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [calcQty, setCalcQty] = useState(1);

  const traditionalMoldCost = 8500;
  const traditionalUnitCost = 4.5;
  const traditionalLeadWeeks = 10;
  const traditionalTotal = traditionalMoldCost + traditionalUnitCost * calcQty;

  const snugfitUnitCost = 34.5;
  const snugfitTotal = snugfitUnitCost * calcQty;
  const savings = traditionalTotal - snugfitTotal;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setShowPromo(true);
      playClickSound('success');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('FORMGRID10');
    setDiscountCopied(true);
    playClickSound('snap');
    setTimeout(() => setDiscountCopied(false), 2500);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-200 dark:border-zinc-800 font-sans space-y-16">
      {/* 1. Design Philosophy */}
      <div className="space-y-6">
        <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>OUR PHILOSOPHY</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white max-w-2xl">
          Six Principles of Intentional Workspaces
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm space-y-2">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">01. Made to Measure</span>
            <h4 className="font-semibold text-zinc-950 dark:text-white">Zero Wasted Space</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Every organizer is crafted to the exact millimeters of your drawer. No awkward gaps, sliding trays, or generic molds.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm space-y-2">
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">02. Mindful Materials</span>
            <h4 className="font-semibold text-zinc-950 dark:text-white">Renewable Bio-Polymer</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Formulated from sustainable plant starches with silky matte texture, solid internal structure, and zero petroleum plastic odor.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm space-y-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">03. Zero Surplus</span>
            <h4 className="font-semibold text-zinc-950 dark:text-white">On-Demand Fabrication</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We never over-produce or store thousands of unwanted plastic bins in warehouses. Every tray is made specifically for you.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm space-y-2">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">04. Quiet Harmony</span>
            <h4 className="font-semibold text-zinc-950 dark:text-white">Acoustic Comfort</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Curated resin inlays soften the sound of dropped keys and metal EDC gear, keeping your studio calm and focused.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm space-y-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">05. Tactile Honesty</span>
            <h4 className="font-semibold text-zinc-950 dark:text-white">Celebrating Craft</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Subtle micro-strata layers reveal the precision 3D craft behind each unit, giving every organizer unique tactile character.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm space-y-2">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">06. Long-Life Design</span>
            <h4 className="font-semibold text-zinc-950 dark:text-white">Built for Decades</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Reinforced 2.8mm outer walls and rigid base plates resist bending and impacts for everyday studio life.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Tooling Sustainability Comparison */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 gap-4">
          <div>
            <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Leaf className="w-4 h-4" /> ZERO-WASTE ON-DEMAND MODEL
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white">
              Why On-Demand Crafting is Better for You and the Planet
            </h3>
          </div>

          <div className="flex items-center space-x-2 text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <span className="text-zinc-500">Order Size:</span>
            <span className="text-orange-600 font-bold">{calcQty} Custom Tray{calcQty > 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Quantity Range Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Adjust Quantity:</span>
            <span className="font-semibold text-zinc-900 dark:text-white">{calcQty} Unit{calcQty > 1 ? 's' : ''}</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            value={calcQty}
            onChange={(e) => setCalcQty(parseInt(e.target.value))}
            className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-600"
          />
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Traditional Mold */}
          <div className="p-5 rounded-xl bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
              Traditional Mass Plastic Injection
            </div>
            <div className="text-2xl font-bold text-zinc-700 dark:text-zinc-300">
              ${traditionalTotal.toLocaleString()} USD
            </div>
            <div className="space-y-1.5 text-xs text-zinc-500">
              <div>• $8,500 expensive steel tooling costs upfront</div>
              <div>• {traditionalLeadWeeks}-week minimum lead time</div>
              <div>• 1,000+ unit minimum order requirement</div>
              <div>• Fixed dimensions — zero custom drawer sizes</div>
            </div>
          </div>

          {/* SnugFit On-Demand Farm */}
          <div className="p-5 rounded-xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/60 space-y-3">
            <div className="flex items-center justify-between text-xs text-orange-700 dark:text-orange-300 uppercase tracking-wider font-bold">
              <span>SnugFit On-Demand Studio</span>
              <span className="text-emerald-600 font-semibold">Ready in 48h</span>
            </div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              ${snugfitTotal.toLocaleString()} USD
            </div>
            <div className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
              <div>• Upfront tooling cost: <span className="text-emerald-600 font-bold">$0.00</span></div>
              <div>• Crafted & shipped in <span className="font-semibold text-zinc-950 dark:text-white">48 hours</span></div>
              <div>• Order as few as <span className="font-semibold text-zinc-950 dark:text-white">1 custom piece</span></div>
              <div>• Infinite millimeter sizing freedom</div>
            </div>
          </div>
        </div>

        {/* Net Savings Callout */}
        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-zinc-600 dark:text-zinc-400">
            Total capital saved by choosing made-to-order manufacturing:
          </span>
          <span className="text-emerald-600 font-bold text-sm">
            ${savings.toLocaleString()} USD Saved
          </span>
        </div>
      </div>

      {/* 3. Interactive FAQ Accordion */}
      <div className="space-y-4">
        <div className="text-xs text-sky-600 dark:text-sky-400 uppercase tracking-wider font-semibold">
          FREQUENTLY ASKED QUESTIONS
        </div>
        <h3 className="text-3xl font-bold text-zinc-950 dark:text-white font-sans">
          Everything You Need to Know
        </h3>

        <div className="space-y-3 pt-2">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 overflow-hidden shadow-xs transition"
              >
                <button
                  type="button"
                  onClick={() => {
                    playClickSound('tick');
                    setOpenFaqIdx(isOpen ? null : idx);
                  }}
                  className="w-full p-5 text-left flex items-center justify-between text-sm text-zinc-900 dark:text-white font-semibold hover:text-orange-600 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-orange-600 flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400 flex-shrink-0 ml-2" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Marketing Newsletter Signup with Instant 10% Credit */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-zinc-900 dark:to-black border border-orange-200/80 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-lg">
          <div className="flex items-center space-x-1.5 text-xs text-orange-600 font-bold uppercase tracking-wider">
            <Mail className="w-4 h-4" />
            <span>JOIN THE STUDIO COMMUNITY</span>
          </div>
          <h4 className="text-2xl font-bold text-zinc-950 dark:text-white">
            Get 10% Off Your First Custom Order
          </h4>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Receive early access to limited material drops, studio blueprints, and design guides. No spam ever.
          </p>
        </div>

        <div className="w-full md:w-auto">
          {showPromo ? (
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-orange-300 dark:border-orange-800 flex items-center space-x-4 shadow-sm">
              <div>
                <div className="text-[10px] text-zinc-500 font-medium uppercase">YOUR 10% DISCOUNT CODE:</div>
                <div className="text-lg font-bold text-orange-600">FORMGRID10</div>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition cursor-pointer"
                title="Copy code"
              >
                {discountCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex items-center space-x-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="bg-white dark:bg-zinc-900 px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500 shadow-xs"
              />
              <button
                type="submit"
                className="py-3 px-5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs sm:text-sm tracking-wide transition shadow-sm cursor-pointer flex-shrink-0"
              >
                Claim 10%
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
