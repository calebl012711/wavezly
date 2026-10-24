/**
 * WAVEZLY REAL-TIME SPLIT ORDER TRACKING PORTAL
 * Concept 1: Warm Minimalist DTC
 * - Clean airy white & warm neutral backdrop (#FFFFFF / #FAFAF9)
 * - Sleek dark charcoal typography (#0F172A)
 * - Electric orange status indicators & progress radar (#FF6B00 / #FF7A00)
 * - Live print farm telemetry (Boise ID Cluster Node 12)
 * - Dual package split logistics monitoring
 * - Printable PDF spec sheet trigger
 */

import React, { useState } from 'react';
import {
  Box,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Printer,
  Cpu,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { LogisticsTransitMap } from '../components/tracking/LogisticsTransitMap';
import { exportProductionSpecSheet } from '../lib/orderInvoiceGenerator';
import { playClickSound } from '../lib/soundEffects';

interface OrderTrackingPageProps {
  initialOrderNumber?: string;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderNumber = 'FG-849201-B3X',
}) => {
  const [query, setQuery] = useState(initialOrderNumber);
  const [activeOrder, setActiveOrder] = useState<string | null>(initialOrderNumber);
  const [focusedStream, setFocusedStream] = useState<'A' | 'B' | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      playClickSound('snap');
      setActiveOrder(query.trim().toUpperCase());
    }
  };

  const handlePrintSpec = () => {
    if (activeOrder) {
      playClickSound('download');
      exportProductionSpecSheet(activeOrder);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#0F172A] font-sans selection:bg-[#FF6B00] selection:text-white py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/70 text-xs text-[#FF6B00] font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B00]" />
            </span>
            <span>DUAL LOGISTICS TELEMETRY RADAR</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A]">
            Wavezly Live Delivery & Workshop Tracking
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Enter your Wavezly order number to monitor made-to-measure 3D additive fabrication and domestic courier transit in real-time.
          </p>

          {/* Input Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto flex items-center space-x-2 pt-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. FG-849201-B3X"
                className="w-full bg-white px-4 py-3 rounded-2xl border border-slate-200 text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] shadow-[0_2px_8px_rgba(15,23,42,0.03)] font-mono uppercase transition"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs tracking-wider transition cursor-pointer shadow-sm flex items-center space-x-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Locate</span>
            </button>
          </form>
        </div>

        {/* Active Order Dual Tracking View */}
        {activeOrder && (
          <div className="space-y-6">
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-3">
                <span className="text-slate-400 uppercase tracking-wider font-semibold text-[11px]">Tracking:</span>
                <span className="font-mono font-black text-[#0F172A] text-base">{activeOrder}</span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Dual Stream Active</span>
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handlePrintSpec}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF6B00] font-bold text-xs flex items-center space-x-1.5 transition border border-orange-200/70 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Spec Sheet (PDF)</span>
                </button>
              </div>
            </div>

            {/* GEOSPATIAL LOGISTICS TELEMETRY RADAR & TRANSIT MAP */}
            <div className="rounded-3xl overflow-hidden border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] bg-white">
              <LogisticsTransitMap
                orderId={activeOrder}
                onSelectRoute={(route) => setFocusedStream(route)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* STREAM 1: PRINT FARM QUEUE */}
              <div
                className={`p-6 rounded-3xl bg-white border transition-all duration-200 space-y-4 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] ${
                  focusedStream === 'A'
                    ? 'border-[#FF6B00] ring-4 ring-[#FF6B00]/10 shadow-[0_8px_30px_rgba(255,107,0,0.12)]'
                    : 'border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2 text-[#FF6B00] text-xs font-bold uppercase tracking-wider">
                    <Box className="w-4 h-4" />
                    <span>Package A: Made to Measure 3D</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#FF6B00] font-bold bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100">
                    STAGE 2 OF 4: SLICING
                  </span>
                </div>

                {/* Step Progression Timeline */}
                <div className="space-y-3.5 text-xs">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#0F172A]">Custom 3D Blueprint Validated</div>
                      <div className="text-[11px] text-slate-500">Watertight 0.20mm layer code computed</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-4 h-4 text-[#FF6B00] animate-spin flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#FF6B00]">3D Printing in Progress (Node 12)</div>
                      <div className="text-[11px] text-slate-600">High-density matte bio-polymer extrusion</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 opacity-40">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-600">Acoustic Base Inlay Cast</div>
                      <div className="text-[11px] text-slate-400">UV chamber curing</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 opacity-40">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-600">Caliper Quality Check & Dispatch</div>
                      <div className="text-[11px] text-slate-400">±0.20mm ISO 2768-m optical inspection</div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAFAF9] border border-slate-200/70 text-[11px] text-slate-600 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Boise, Idaho Studio Cluster</span>
                  </div>
                  <span className="text-[#FF6B00] font-bold">Ready to Ship in ~24h</span>
                </div>
              </div>

              {/* STREAM 2: FAST-SHIP ACCESSORIES */}
              <div
                className={`p-6 rounded-3xl bg-white border transition-all duration-200 space-y-4 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] ${
                  focusedStream === 'B'
                    ? 'border-slate-800 ring-4 ring-slate-800/10 shadow-[0_8px_30px_rgba(15,23,42,0.12)]'
                    : 'border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2 text-slate-700 text-xs font-bold uppercase tracking-wider">
                    <Truck className="w-4 h-4 text-slate-600" />
                    <span>Package B: Studio Accessories</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-700 font-bold bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                    STAGE 3 OF 4: IN TRANSIT
                  </span>
                </div>

                {/* Step Progression Timeline */}
                <div className="space-y-3.5 text-xs">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#0F172A]">Order Verified & Reserved</div>
                      <div className="text-[11px] text-slate-500">US warehouse stock reserved</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#0F172A]">USPS Ground Advantage Label Created</div>
                      <div className="text-[11px] text-slate-500">Salt Lake City Hub (Bay 4A)</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Truck className="w-4 h-4 text-slate-800 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-800">In Transit with Carrier</div>
                      <div className="text-[11px] text-slate-600">Scanned at USPS Regional Sorting Hub</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 opacity-40">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-600">Delivered to Doorstep</div>
                      <div className="text-[11px] text-slate-400">Expected in 1–2 business days</div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAFAF9] border border-slate-200/70 text-[11px] text-slate-600 flex items-center justify-between">
                  <span className="font-mono text-slate-700 font-semibold">USPS 940011189922...</span>
                  <span className="text-[#FF6B00] font-bold flex items-center gap-1 cursor-pointer">
                    Live Carrier Scan <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>

            {/* GUARANTEE FOOTNOTE */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center space-x-2 text-[#0F172A] font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
                <span>Protected by Wavezly 100% Snug Fit Guarantee (±0.2mm Conformance)</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">ISO 2768-m PASS</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
