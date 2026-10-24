/**
 * WAVEZLY ORDER TRACKING PORTAL
 * Clean, consumer-friendly order tracking.
 * Replaced developer telemetry with real shipment milestones and package details.
 */

import React, { useState } from 'react';
import {
  Package,
  Truck,
  Copy,
  Check,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

interface OrderTrackingPageProps {
  initialOrderNumber?: string;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderNumber = 'WVZ-849201',
}) => {
  const [query, setQuery] = useState(initialOrderNumber);
  const [activeOrder, setActiveOrder] = useState<string>(initialOrderNumber);
  const [copied, setCopied] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setActiveOrder(query.trim().toUpperCase());
    }
  };

  const copyTrackingNumber = () => {
    navigator.clipboard.writeText('9400 1289 4820 9182 04');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0F172A] font-sans py-8 sm:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Search Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-semibold">
            <Package className="w-3.5 h-3.5" />
            <span>Order Status</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Track Your Wavezly Order
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
            Check the live crafting and shipping status of your 3D printed items.
          </p>

          {/* Search Input Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto flex items-center gap-2 pt-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. WVZ-849201"
              className="flex-1 bg-white px-4 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#FF6B00] shadow-xs uppercase font-mono"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-zinc-800 text-white font-bold text-xs transition cursor-pointer shrink-0"
            >
              Track
            </button>
          </form>
        </div>

        {/* Active Order Card */}
        {activeOrder && (
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-7 shadow-xs space-y-6">
            {/* Top Order Overview */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-zinc-100">
              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Order Number
                </span>
                <span className="text-lg font-mono font-extrabold text-[#0F172A]">
                  #{activeOrder}
                </span>
              </div>

              <div className="sm:text-right">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Estimated Delivery
                </span>
                <span className="text-sm font-bold text-emerald-600 flex items-center sm:justify-end gap-1.5">
                  <Truck className="w-4 h-4" />
                  Friday, October 28
                </span>
              </div>
            </div>

            {/* Visual Delivery Stepper */}
            <div>
              <span className="text-xs font-bold text-zinc-800 block mb-4">
                Shipment Progress
              </span>

              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-zinc-200 -z-0 hidden sm:block" />
                <div className="absolute top-4 left-4 w-2/3 h-0.5 bg-[#FF6B00] -z-0 hidden sm:block" />

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative z-10">
                  {/* Step 1 */}
                  <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-1.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-900 block">Confirmed</span>
                      <span className="text-[11px] text-zinc-400">Oct 22, 10:45 AM</span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-1.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-900 block">3D Printed</span>
                      <span className="text-[11px] text-zinc-400">Oct 23, 2:15 PM</span>
                    </div>
                  </div>

                  {/* Step 3 (Current) */}
                  <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-1.5">
                    <div className="w-8 h-8 rounded-full bg-[#FF6B00] text-white flex items-center justify-center shrink-0 ring-4 ring-orange-100 shadow-xs">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#FF6B00] block">In Transit</span>
                      <span className="text-[11px] text-zinc-500">USPS Priority Mail</span>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-1.5 opacity-40">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 text-zinc-500 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-600 block">Delivered</span>
                      <span className="text-[11px] text-zinc-400">Expected Oct 28</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Courier & Tracking Details Box */}
            <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-zinc-400 text-[11px] block">Carrier & Tracking Number</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono font-bold text-zinc-800">
                    USPS: 9400 1289 4820 9182 04
                  </span>
                  <button
                    type="button"
                    onClick={copyTrackingNumber}
                    className="p-1 text-zinc-400 hover:text-zinc-700 transition cursor-pointer"
                    title="Copy tracking number"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                  On Schedule
                </span>
              </div>
            </div>

            {/* Items in this shipment */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-zinc-800 block">
                Items in This Shipment
              </span>

              <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 hover:border-zinc-200 transition">
                <img
                  src="/assets/products/drawer-matrix-real.jpg"
                  alt="Custom Drawer Organizer"
                  className="w-14 h-14 rounded-lg object-cover bg-zinc-50 border border-zinc-100"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 truncate">
                    Wavezly Custom Drawer Matrix
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    Dimensions: 320 × 240 × 45 mm • Matte Obsidian Black
                  </p>
                  <span className="text-[11px] font-bold text-zinc-800 mt-0.5 block">
                    Qty: 1 • $39.00
                  </span>
                </div>
                <div className="shrink-0 text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3 h-3" />
                    Guaranteed Fit
                  </span>
                </div>
              </div>
            </div>

            {/* Need Help Footer */}
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
              <span>Have questions about your delivery?</span>
              <a
                href="#support"
                className="text-[#FF6B00] font-semibold hover:underline"
              >
                Contact Support →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
