/**
 * WAVEZLY POST-CHECKOUT CONFIRMATION & FARM HUD
 * Concept 1: Warm Minimalist DTC
 * - Pure airy white background (#FFFFFF / #FAFAF9)
 * - Sleek dark charcoal typography (#0F172A)
 * - Electric orange status indicators & accents (#FF6B00 / #FF7A00)
 * - Live print farm progress tracker with active stage indicators
 * - Printable PDF spec sheet button (ISO 2768-m Metrology Certification)
 * - Dual split-fulfillment breakdown (Package 1: 3D Print Farm, Package 2: Domestic Hub)
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
  Clock,
  Layers,
  BadgeCheck,
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
    }, 7000);

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
    <div className="relative min-h-screen bg-[#FAFAF9] text-[#0F172A] font-sans selection:bg-[#FF6B00] selection:text-white py-10 sm:py-16">
      {/* 1. CELEBRATION CONFETTI BURST */}
      {showConfetti && <ConfettiCanvas durationMs={5000} particleCount={110} />}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* TOP CELEBRATION HERO BANNER */}
        <div className="relative overflow-hidden p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-[0_10px_35px_-5px_rgba(15,23,42,0.06)] text-center space-y-5">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-56 h-56 rounded-full bg-[#FF6B00]/8 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 transform -translate-x-8 translate-y-8 w-56 h-56 rounded-full bg-emerald-500/8 blur-3xl pointer-events-none" />

          {/* Glowing Checkmark Badge */}
          <div className="relative inline-flex items-center justify-center">
            <button
              type="button"
              onClick={handleReplayConfetti}
              title="Click to replay celebration confetti"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11" />
            </button>
            <span className="absolute -top-1 -right-1 flex h-4 w-4 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
            </span>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-xs text-[#FF6B00] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>ORDER CONFIRMED</span>
            </div>

            {/* WARM WELCOME MESSAGE */}
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#0F172A]">
              Thank you for your order!
            </h1>

            <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              We've received your order, <strong className="text-[#0F172A]">{specOrder.customerName}</strong>. Our workshop is preparing your items and will dispatch them within 48 hours. A confirmation receipt has been sent to your email.
            </p>
          </div>

          <div className="inline-flex flex-wrap items-center justify-center gap-2 pt-1 font-mono text-xs">
            <span className="px-3.5 py-1.5 rounded-xl bg-[#FAFAF9] border border-slate-200 text-slate-800 font-bold">
              ORDER #: <span className="text-[#FF6B00]">{orderNumber}</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-[#FAFAF9] border border-slate-200 text-slate-600">
              EMAIL: <span className="text-[#0F172A] font-semibold">{specOrder.customerEmail}</span>
            </span>
          </div>

          {/* PRINTABLE SPEC SHEET & CERTIFICATE ACTION */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handlePrintCertificate}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#FF6B00] hover:bg-[#FF7A00] text-white font-bold text-xs tracking-wider flex items-center justify-center space-x-2.5 shadow-[0_10px_25px_-5px_rgba(255,107,0,0.35)] active:scale-95 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>PRINT 100% SNUG FIT GUARANTEE SPEC SHEET (PDF)</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadHtml}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs tracking-wider flex items-center justify-center space-x-2 transition cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>EXPORT HTML SPEC</span>
            </button>
          </div>
        </div>

        {/* 2. ORDER PROGRESS TIMELINE */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                Production & Delivery Timeline
              </h2>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              On Schedule
            </span>
          </div>

          {/* Stepper Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Step 01</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="font-bold text-xs text-[#0F172A]">Order Confirmed</div>
              <p className="text-[10px] text-slate-500">Dimensions & specs saved</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B00]">Step 02</span>
                <Clock className="w-4 h-4 text-[#FF6B00] animate-spin" />
              </div>
              <div className="font-bold text-xs text-[#0F172A]">Crafting & Printing</div>
              <p className="text-[10px] text-slate-500">Printed with plant-based PLA</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1 opacity-70">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Step 03</span>
                <Layers className="w-4 h-4 text-slate-400" />
              </div>
              <div className="font-bold text-xs text-slate-700">Quality Inspection</div>
              <p className="text-[10px] text-slate-500">Hand-checked for snug fit</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1 opacity-70">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Step 04</span>
                <BadgeCheck className="w-4 h-4 text-slate-400" />
              </div>
              <div className="font-bold text-xs text-slate-700">Dispatch & Delivery</div>
              <p className="text-[10px] text-slate-500">Ships with USPS Priority</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAFAF9] border border-slate-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-600 gap-2">
            <span className="font-medium text-slate-600">Standard domestic shipping included • 100% Fit Guarantee</span>
            <span className="text-[#FF6B00] font-bold text-[11px]">Estimated dispatch: Within 48 hours</span>
          </div>
        </div>

        {/* 3. DIRECT SPLIT-DELIVERY TRACKING CARDS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
              <h2 className="font-bold text-[#0F172A] uppercase tracking-wider text-xs">
                Active Split Delivery Packages
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">Live Dual-Stream Routing</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PACKAGE 1: 3D PRINT FARM (MADE TO MEASURE) */}
            <div className="p-6 rounded-3xl bg-white border border-orange-200/80 shadow-[0_4px_24px_-4px_rgba(255,107,0,0.06)] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center space-x-2 text-[#FF6B00] text-xs font-bold uppercase tracking-wider">
                    <Box className="w-4 h-4" />
                    <span>Package 1: Handcrafted</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#FF6B00] text-[10px] font-bold">
                    FARM_QUEUED
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#0F172A]">
                    {specOrder.packageA.productTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Job ID: <span className="font-mono text-slate-800 font-bold">{specOrder.packageA.farmJobId}</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAFAF9] border border-slate-200/70 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dimensions:</span>
                    <span className="font-bold text-slate-900">
                      {specOrder.packageA.dimensions.length}×{specOrder.packageA.dimensions.width}×{specOrder.packageA.dimensions.height} mm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Material Formula:</span>
                    <span className="font-semibold text-slate-900">{specOrder.packageA.material.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Production Facility:</span>
                    <span className="text-slate-900">{specOrder.packageA.facility}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tolerance Code:</span>
                    <span className="text-emerald-600 font-bold">ISO 2768-m (±0.2mm)</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Delivery</span>
                  <span className="text-xs font-bold text-[#FF6B00]">
                    Arrives in 4–5 Business Days
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleTrack}
                  className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF6B00] border border-orange-200/80 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <span>Track Package 1</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* PACKAGE 2: IN-STOCK ACCESSORY (DOMESTIC WAREHOUSE) */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center space-x-2 text-slate-700 text-xs font-bold uppercase tracking-wider">
                    <Truck className="w-4 h-4 text-slate-600" />
                    <span>Package 2: In-Stock</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-700 text-[10px] font-bold">
                    DISPATCHED
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#0F172A]">
                    {specOrder.packageB.productTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    SKU: <span className="font-mono text-slate-800 font-bold">{specOrder.packageB.sku}</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAFAF9] border border-slate-200/70 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tracking Code:</span>
                    <span className="font-bold text-slate-900">{specOrder.packageB.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Carrier Service:</span>
                    <span className="text-slate-900">USPS Ground Advantage</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Origin Warehouse:</span>
                    <span className="text-slate-900">Salt Lake City, UT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Handling SLA:</span>
                    <span className="text-emerald-600 font-bold">&lt; 24h Picked & Packed</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Delivery</span>
                  <span className="text-xs font-bold text-slate-700">
                    Arrives in 2–3 Business Days
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleTrack}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <span>Track Package 2</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY CTA: DIRECT LINK TO TRACK BOTH PACKAGES */}
        <div className="p-6 rounded-3xl bg-[#0F172A] text-white border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_10px_35px_-5px_rgba(15,23,42,0.2)]">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <Compass className="w-4 h-4 text-[#FF6B00]" />
              <span className="text-xs uppercase font-bold tracking-wider text-[#FF6B00]">
                Interactive Dual Radar
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              Track Both Packages in Real-Time
            </h3>
            <p className="text-xs text-slate-400">
              View live GPS coordinates, 3D farm layer progress, and domestic courier scans on our unified transit radar.
            </p>
          </div>

          <button
            type="button"
            onClick={handleTrack}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#FF6B00] hover:bg-[#FF7A00] text-white font-bold text-xs tracking-wider flex items-center justify-center space-x-2 shadow-md transition active:scale-95 cursor-pointer flex-shrink-0"
          >
            <span>OPEN DUAL TELEMETRY TRACKER</span>
            <ExternalLink className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {/* 4. PROMINENT CONSUMER TRUST GUARANTEES REMINDER */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF6B00] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0F172A]">
                100% Snug Fit Guarantee
              </h4>
              <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                Fits your drawer perfectly or 100% money back. Guaranteed ±0.2mm precision.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0F172A]">
                30-Day Free Returns
              </h4>
              <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                30-day hassle-free return window with prepaid domestic labels.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0F172A]">
                Fast Domestic Shipping
              </h4>
              <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                Dispatched in &lt;24h with tracked domestic carrier delivery.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-200 gap-4">
          <button
            type="button"
            onClick={onContinueShopping}
            className="text-xs font-semibold text-slate-500 hover:text-[#FF6B00] transition flex items-center space-x-1 cursor-pointer"
          >
            <span>← Return to Hardware Catalog</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handlePrintCertificate}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-[#FF6B00] text-xs font-bold text-slate-700 transition flex items-center space-x-1.5 cursor-pointer bg-white shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Spec Sheet (PDF)</span>
            </button>

            <button
              type="button"
              onClick={handleTrack}
              className="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
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
