/**
 * FORMGRID REAL-TIME SPLIT ORDER TRACKING PORTAL
 * Dual telemetry timeline monitoring both 3D Print Farm fabrication and domestic warehouse courier transit
 */

import React, { useState } from 'react';
import { Cpu, Truck, CheckCircle2, Clock, ExternalLink } from 'lucide-react';

interface OrderTrackingPageProps {
  initialOrderNumber?: string;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderNumber = 'FG-849201-B3X',
}) => {
  const [query, setQuery] = useState(initialOrderNumber);
  const [activeOrder, setActiveOrder] = useState<string | null>(initialOrderNumber);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setActiveOrder(query.trim().toUpperCase());
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-mono">
      {/* Search Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-surface border border-surface-border text-xs text-signal-cyan">
          <span className="w-1.5 h-1.5 rounded-full bg-signal-cyan animate-pulse" />
          <span>DUAL DISPATCH TELEMETRY TRACKER</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-precision-white font-sans">
          Track Your Modular Systems
        </h1>
        <p className="text-xs text-zinc-400 font-sans max-w-md mx-auto">
          Enter your Formgrid order identifier to monitor both on-demand 3D print farm queues and domestic priority transit.
        </p>

        {/* Input Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex items-center space-x-2 pt-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. FG-849201-B3X"
              className="w-full bg-surface px-4 py-2.5 rounded-lg border border-surface-border text-xs text-precision-white placeholder-zinc-600 focus:outline-none focus:border-signal-orange"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-precision-white transition"
          >
            LOCATE
          </button>
        </form>
      </div>

      {/* Active Order Dual Tracking View */}
      {activeOrder && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-surface border border-surface-border flex items-center justify-between text-xs">
            <div>
              <span className="text-zinc-500 uppercase">IDENTIFIER:</span>
              <span className="ml-2 font-bold text-precision-white">{activeOrder}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-signal-lime" />
              <span className="text-zinc-300">ACTIVE SPLIT-FULFILLMENT</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* STREAM 1: PRINT FARM QUEUE */}
            <div className="p-5 rounded-xl bg-surface border border-surface-border space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div className="flex items-center space-x-2 text-signal-orange text-xs font-bold uppercase">
                  <Cpu className="w-4 h-4" />
                  <span>Package A: 3D Print Farm</span>
                </div>
                <span className="font-mono text-[10px] text-zinc-400">STAGE 2/4</span>
              </div>

              {/* Step Progression Timeline */}
              <div className="space-y-3 text-xs">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-signal-lime flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-zinc-200">Binary STL Sliced & Validated</div>
                    <div className="text-[10px] text-zinc-500">Watertight 0.20mm layer code computed</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-signal-orange animate-spin flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-signal-orange">Print Farm Queued (Slant 3D)</div>
                    <div className="text-[10px] text-zinc-400">Assigned to Node 12 • Bed pre-heating</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 opacity-40">
                  <div className="w-4 h-4 rounded-full border border-zinc-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-zinc-400">Optical Resin Inlay Cast</div>
                    <div className="text-[10px] text-zinc-500">UV chamber curing</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 opacity-40">
                  <div className="w-4 h-4 rounded-full border border-zinc-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-zinc-400">Quality Laser Scan & Dispatch</div>
                    <div className="text-[10px] text-zinc-500">±0.25mm tolerance validation</div>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded bg-black/60 border border-zinc-800 text-[10px] text-zinc-500">
                FARM CLUSTER: Boise ID // ESTIMATED DISPATCH: 48h
              </div>
            </div>

            {/* STREAM 2: FAST-SHIP ACCESSORIES */}
            <div className="p-5 rounded-xl bg-surface border border-surface-border space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div className="flex items-center space-x-2 text-signal-cyan text-xs font-bold uppercase">
                  <Truck className="w-4 h-4" />
                  <span>Package B: Domestic Hardware</span>
                </div>
                <span className="font-mono text-[10px] text-zinc-400">STAGE 3/4</span>
              </div>

              {/* Step Progression Timeline */}
              <div className="space-y-3 text-xs">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-signal-lime flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-zinc-200">Automated DSers Order Placed</div>
                    <div className="text-[10px] text-zinc-500">US warehouse SKU matched instantly</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-signal-lime flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-zinc-200">USPS Priority Label Generated</div>
                    <div className="text-[10px] text-zinc-500">Salt Lake City, UT Logistics Facility</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Truck className="w-4 h-4 text-signal-cyan flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-signal-cyan">In Transit (Domestic Priority)</div>
                    <div className="text-[10px] text-zinc-400">Scanned at USPS Regional Sorting Hub</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 opacity-40">
                  <div className="w-4 h-4 rounded-full border border-zinc-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-zinc-400">Final Delivery to Doorstep</div>
                    <div className="text-[10px] text-zinc-500">Expected in 2 business days</div>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded bg-black/60 border border-zinc-800 text-[10px] text-zinc-400 flex items-center justify-between">
                <span>USPS 940011189922...</span>
                <span className="text-signal-cyan flex items-center gap-1">
                  LIVE COURIER <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
