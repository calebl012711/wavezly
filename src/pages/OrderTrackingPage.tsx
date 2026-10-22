/**
 * FORMGRID REAL-TIME SPLIT ORDER TRACKING PORTAL
 * Dual telemetry timeline monitoring both 3D Print Farm fabrication and domestic warehouse courier transit
 * Prioritized Light Mode
 */

import React, { useState } from 'react';
import { Box, Truck, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { LogisticsTransitMap } from '../components/tracking/LogisticsTransitMap';
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Search Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 text-xs text-sky-800 dark:text-sky-300 font-medium">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          <span>DUAL DELIVERY TRACKER</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Track Your Orders
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
          Enter your Formgrid order number to monitor made-to-order 3D fabrication and domestic courier transit in real-time.
        </p>

        {/* Input Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex items-center space-x-2 pt-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. FG-849201-B3X"
              className="w-full bg-white dark:bg-zinc-900 px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500 shadow-2xs"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-xs tracking-wider transition hover:bg-zinc-800 cursor-pointer shadow-xs"
          >
            Locate
          </button>
        </form>
      </div>

      {/* Active Order Dual Tracking View */}
      {activeOrder && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 flex items-center justify-between text-xs shadow-xs">
            <div>
              <span className="text-zinc-500 uppercase tracking-wider font-medium">Order Number:</span>
              <span className="ml-2 font-bold text-zinc-950 dark:text-white text-sm">{activeOrder}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">Active Dual-Package Dispatch</span>
            </div>
          </div>

          {/* GEOSPATIAL LOGISTICS TELEMETRY RADAR & TRANSIT MAP */}
          <LogisticsTransitMap
            orderId={activeOrder}
            onSelectRoute={(route) => setFocusedStream(route)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* STREAM 1: PRINT FARM QUEUE */}
            <div
              className={`p-6 rounded-2xl bg-white dark:bg-zinc-900 border transition-all duration-200 space-y-4 shadow-sm ${
                focusedStream === 'A'
                  ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-md'
                  : 'border-zinc-200/90 dark:border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
                  <Box className="w-4 h-4" />
                  <span>Package A: Made to Measure 3D</span>
                </div>
                <span className="text-[11px] text-zinc-500 font-medium">Stage 2 of 4</span>
              </div>

              {/* Step Progression Timeline */}
              <div className="space-y-3.5 text-xs">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-white">Custom 3D Blueprint Validated</div>
                    <div className="text-[11px] text-zinc-500">Watertight 0.20mm layer code computed</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-orange-600 animate-spin flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-orange-600">3D Printing in Progress (Node 12)</div>
                    <div className="text-[11px] text-zinc-600 dark:text-zinc-400">High-density matte bio-polymer extrusion</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 opacity-40">
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-300 dark:border-zinc-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-zinc-600 dark:text-zinc-400">Acoustic Resin Base Inlay Cast</div>
                    <div className="text-[11px] text-zinc-500">UV chamber curing</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 opacity-40">
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-300 dark:border-zinc-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-zinc-600 dark:text-zinc-400">Caliper Quality Check & Dispatch</div>
                    <div className="text-[11px] text-zinc-500">±0.25mm dimensional inspection</div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-black/40 border border-zinc-200/80 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
                <span>Facility: Boise, Idaho Studio</span>
                <span className="text-orange-600 font-semibold">Ready to Ship in 24h</span>
              </div>
            </div>

            {/* STREAM 2: FAST-SHIP ACCESSORIES */}
            <div
              className={`p-6 rounded-2xl bg-white dark:bg-zinc-900 border transition-all duration-200 space-y-4 shadow-sm ${
                focusedStream === 'B'
                  ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-md'
                  : 'border-zinc-200/90 dark:border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center space-x-2 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider">
                  <Truck className="w-4 h-4" />
                  <span>Package B: Studio Accessories</span>
                </div>
                <span className="text-[11px] text-zinc-500 font-medium">Stage 3 of 4</span>
              </div>

              {/* Step Progression Timeline */}
              <div className="space-y-3.5 text-xs">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-white">Order Verified & Dispatched</div>
                    <div className="text-[11px] text-zinc-500">US warehouse stock reserved</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-white">USPS Priority Express Label Created</div>
                    <div className="text-[11px] text-zinc-500">Salt Lake City & Ontario Hubs</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Truck className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sky-600">In Transit with Carrier</div>
                    <div className="text-[11px] text-zinc-600 dark:text-zinc-400">Scanned at USPS Regional Sorting Hub</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 opacity-40">
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-300 dark:border-zinc-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-zinc-600 dark:text-zinc-400">Delivered to Doorstep</div>
                    <div className="text-[11px] text-zinc-500">Expected in 1–2 business days</div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-black/40 border border-zinc-200/80 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
                <span>USPS 940011189922...</span>
                <span className="text-sky-600 font-semibold flex items-center gap-1 cursor-pointer">
                  Live Courier Tracking <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
