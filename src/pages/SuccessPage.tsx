/**
 * WAVEZLY POST-CHECKOUT SPLIT FULFILLMENT HUD & CELEBRATION
 * Features:
 * - Celebration Confetti Burst Animation on Mount
 * - Warm Welcome: "Your order has been received by the Wavezly workshop!"
 * - Printable "Wavezly 100% Fit Guarantee Certificate & Spec Sheet" button using orderInvoiceGenerator.ts
 * - Direct link to track both packages in real-time
 * - Consumer Trust Guarantees: Wavezly 100% Fit Guarantee, 30-Day Free Returns, Fast Domestic Shipping
 */

import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Box,
  Truck,
  ArrowRight,
  Printer,
  ShieldCheck,
  FileText,
  Download,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Compass,
} from 'lucide-react';
import { exportProductionSpecSheet, downloadSpecSheetHtml, resolveProductionSpecOrder } from '../lib/orderInvoiceGenerator';
import { ConfettiCanvas } from '../components/common/ConfettiCanvas';
import { playClickSound } from '../lib/soundEffects';

interface SuccessPageProps {
  orderNumber?: string;
  onContinueShopping?: () => void;
  onTrackOrder?: (orderNum: string) => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({
  orderNumber = 'FG-849201-B3X',
  onContinueShopping,
  onTrackOrder,
}) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [specOrder, setSpecOrder] = useState(() => resolveProductionSpecOrder(orderNumber));

  const handleReplayConfetti = () => {
    playClickSound('snap');
    setShowConfetti(false);
    setTimeout(() => setShowConfetti(true), 60);
  };

  useEffect(() => {
    // Play celebratory audio chime
    playClickSound('success');

    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 8000);

    // Refresh spec order data from localStorage
    try {
      const resolved = resolveProductionSpecOrder(orderNumber);
      setSpecOrder(resolved);
    } catch (_err) {
      // Fallback already resolved
    }

    return () => clearTimeout(timer);
  }, [orderNumber]);

  const handlePrintCertificate = () => {
    playClickSound('download');
    exportProductionSpecSheet(orderNumber);
  };

  const handleDownloadHtml = () => {
    playClickSound('tick');
    downloadSpecSheetHtml(orderNumber);
  };

  const handleTrack = () => {
    playClickSound('snap');
    if (onTrackOrder) {
      onTrackOrder(orderNumber);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#fafafc] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-orange-500 selection:text-white py-10 sm:py-16">
      {/* 1. CELEBRATION CONFETTI BURST */}
      {showConfetti && <ConfettiCanvas durationMs={5000} particleCount={110} />}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* TOP CELEBRATION HERO BANNER */}
        <div className="relative overflow-hidden p-8 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-xl text-center space-y-4">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-48 h-48 rounded-full bg-orange-500/10 dark:bg-orange-500/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 transform -translate-x-8 translate-y-8 w-48 h-48 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl pointer-events-none" />

          {/* Glowing Checkmark Badge (Click to replay celebration) */}
          <div className="relative inline-flex items-center justify-center">
            <button
              type="button"
              onClick={handleReplayConfetti}
              title="Click to replay celebration confetti"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11" />
            </button>
            <span className="absolute -top-1 -right-1 flex h-4 w-4 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
            </span>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/60 text-xs text-orange-700 dark:text-orange-400 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ORDER CONFIRMED & DISPATCHED</span>
            </div>

            {/* WARM WELCOME MESSAGE */}
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white font-display">
              Your order has been received by the Wavezly workshop!
            </h1>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Thank you, <strong className="text-zinc-900 dark:text-zinc-100">{specOrder.customerName}</strong>. We've routed your bespoke CAD geometry to our automated additive print farm, and domestic hardware has been queued for immediate warehouse pick.
            </p>
          </div>

          <div className="inline-flex flex-wrap items-center justify-center gap-2 pt-1 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold">
              ORDER #: <span className="text-orange-600 dark:text-orange-400">{orderNumber}</span>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
              EMAIL: <span className="text-zinc-900 dark:text-zinc-200">{specOrder.customerEmail}</span>
            </span>
          </div>

          {/* 2. PRINTABLE SPEC SHEET & CERTIFICATE ACTION */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handlePrintCertificate}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs tracking-wider flex items-center justify-center space-x-2.5 shadow-lg shadow-orange-500/20 active:scale-95 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>PRINT WAVEZLY 100% FIT GUARANTEE CERTIFICATE & SPEC SHEET</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadHtml}
              className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-semibold text-xs tracking-wider flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-zinc-500" />
              <span>SAVE BACKUP HTML</span>
            </button>
          </div>
        </div>

        {/* 3. DIRECT SPLIT-DELIVERY TRACKING CARDS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <h2 className="text-base font-bold text-zinc-950 dark:text-white uppercase tracking-wider text-xs">
                Active Split Delivery Packages
              </h2>
            </div>
            <span className="text-xs text-zinc-500">Live Dual-Stream Routing</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PACKAGE 1: 3D PRINT FARM (MADE TO MEASURE) */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-orange-200/90 dark:border-orange-800/60 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
                    <Box className="w-4 h-4" />
                    <span>Package 1: Handcrafted to Measure</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-[10px] font-bold">
                    FARM_QUEUED
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-zinc-950 dark:text-white">
                    {specOrder.packageA.productTitle}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Job ID: <span className="font-mono text-zinc-700 dark:text-zinc-300 font-semibold">{specOrder.packageA.farmJobId}</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Bounding Envelope:</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                      {specOrder.packageA.dimensions.length}×{specOrder.packageA.dimensions.width}×{specOrder.packageA.dimensions.height} mm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Material Formula:</span>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">{specOrder.packageA.material.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Facility:</span>
                    <span className="text-zinc-800 dark:text-zinc-200">{specOrder.packageA.facility}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Tolerance Code:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">ISO 2768-m (±0.2mm)</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Est. Delivery</span>
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                    Arrives in 4–5 Business Days
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleTrack}
                  className="px-3.5 py-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/80 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <span>Track Package 1</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* PACKAGE 2: IN-STOCK ACCESSORY (DOMESTIC WAREHOUSE) */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-sky-200/90 dark:border-sky-800/60 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center space-x-2 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider">
                    <Truck className="w-4 h-4" />
                    <span>Package 2: In-Stock Accessory</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-bold">
                    DISPATCHED
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-zinc-950 dark:text-white">
                    {specOrder.packageB.productTitle}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    SKU: <span className="font-mono text-zinc-700 dark:text-zinc-300 font-semibold">{specOrder.packageB.sku}</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Tracking Code:</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{specOrder.packageB.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Courier Service:</span>
                    <span className="text-zinc-800 dark:text-zinc-200">USPS Ground Advantage</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Origin Warehouse:</span>
                    <span className="text-zinc-800 dark:text-zinc-200">Salt Lake City, UT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Handling SLA:</span>
                    <span className="text-sky-600 dark:text-sky-400 font-bold">&lt; 24h Picked & Packed</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Est. Delivery</span>
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                    Arrives in 2–3 Business Days
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleTrack}
                  className="px-3.5 py-2 rounded-lg bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/80 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <span>Track Package 2</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY CTA: DIRECT LINK TO TRACK BOTH PACKAGES IN REAL-TIME */}
        <div className="p-6 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-800 border border-zinc-800 dark:border-zinc-700 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <Compass className="w-4 h-4 text-orange-400" />
              <span className="text-xs uppercase font-bold tracking-wider text-orange-400">
                Interactive Telemetry Radar
              </span>
            </div>
            <h3 className="text-base font-bold text-white font-display">
              Track Both Packages in Real-Time
            </h3>
            <p className="text-xs text-zinc-400">
              View live GPS coordinates, 3D farm layer progress, and domestic courier scans on our unified transit radar.
            </p>
          </div>

          <button
            type="button"
            onClick={handleTrack}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs tracking-wider flex items-center justify-center space-x-2 shadow-sm transition active:scale-95 cursor-pointer flex-shrink-0"
          >
            <span>OPEN REAL-TIME DUAL TRACKER</span>
            <ExternalLink className="w-3.5 h-3.5 text-orange-600" />
          </button>
        </div>

        {/* 4. PROMINENT CONSUMER TRUST GUARANTEES REMINDER */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex items-start space-x-3">
            <div className="w-9 h-9 rounded-lg bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-orange-600 dark:text-orange-400 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                Wavezly 100% Fit Guarantee
              </h4>
              <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                Fits your drawer perfectly or 100% money back. Guaranteed.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex items-start space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                30-Day Free Returns
              </h4>
              <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                30-day hassle-free return window with prepaid domestic labels.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex items-start space-x-3">
            <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 dark:text-sky-400 flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                Fast Domestic Shipping
              </h4>
              <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                Dispatched in &lt;24h with tracked domestic carrier delivery.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-zinc-200 dark:border-zinc-800 gap-4">
          <button
            type="button"
            onClick={onContinueShopping}
            className="text-xs text-zinc-500 hover:text-orange-600 dark:hover:text-orange-400 transition flex items-center space-x-1 cursor-pointer"
          >
            <span>← Return to Hardware Catalog</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handlePrintCertificate}
              className="px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:border-orange-500 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-orange-500" />
              <span>Spec Sheet (PDF)</span>
            </button>

            <button
              type="button"
              onClick={handleTrack}
              className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <span>Track Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
