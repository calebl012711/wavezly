/**
 * FORMGRID POST-CHECKOUT SPLIT FULFILLMENT HUD
 * Visualizes order bifurcation into automated 3D Print Farm jobs and DSers/AutoDS domestic dispatch
 */

import React from 'react';
import { CheckCircle2, Cpu, Truck, ArrowRight, Printer, ShieldCheck, FileText } from 'lucide-react';
import { exportProductionSpecSheet } from '../lib/orderInvoiceGenerator';

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
  const farmJobId = `SLANT3D-${orderNumber.split('-')[1] || '98231'}-J01`;
  const trackingNumber = `94001118992231${Math.floor(100000 + Math.random() * 900000)}`;

  const handleExportSpecSheet = () => {
    exportProductionSpecSheet(orderNumber);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-mono">
      {/* Top Success Banner */}
      <div className="p-6 rounded-2xl bg-surface border border-surface-border text-center space-y-3 shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-signal-lime/10 border border-signal-lime/30 flex items-center justify-center mx-auto text-signal-lime">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-xs text-signal-orange uppercase tracking-widest font-semibold">
            PAYMENT CONFIRMED // JOB QUEUED
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-precision-white font-sans">
            Order Dispatched to Dual Facilities
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            ORDER IDENTIFIER: <span className="text-zinc-200 font-bold">{orderNumber}</span>
          </p>
        </div>

        <p className="text-xs text-zinc-400 font-sans max-w-lg mx-auto leading-relaxed">
          Your order has bifurcated into our automated fabrication pipeline. The STL geometry is now in the print farm slicing buffer, and domestic hardware has been queued for warehouse pick.
        </p>

        {/* Quick Action Export Pill */}
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={handleExportSpecSheet}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-signal-orange text-xs text-zinc-200 hover:text-white transition shadow-sm group"
          >
            <Printer className="w-3.5 h-3.5 text-signal-orange group-hover:scale-110 transition-transform" />
            <span className="font-semibold">EXPORT SPEC SHEET (PDF/PRINT)</span>
          </button>
        </div>
      </div>

      {/* Split Fulfillment Bifurcation Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PACKAGE A: 3D PRINT FARM (Made-to-Order) */}
        <div className="p-5 rounded-xl bg-surface border border-signal-orange/40 bg-gradient-to-b from-signal-orange/5 to-transparent flex flex-col justify-between space-y-4 shadow-tactile">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center space-x-2 text-signal-orange text-xs font-bold uppercase">
                <Cpu className="w-4 h-4" />
                <span>Package A: Print Farm Queue</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-signal-orange/20 text-signal-orange text-[10px] font-bold">
                FARM_QUEUED
              </span>
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              <div className="font-bold text-zinc-100 font-sans">
                Modular Desk Valet Pro (Custom Sliced)
              </div>
              <div className="p-2.5 rounded bg-black/60 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                <div>Dimensions: 160 × 120 × 40 mm (2×3 Grid)</div>
                <div>Material: Obsidian Black Matte PLA</div>
                <div>Infill: 18% Gyroid High-Shear Core</div>
                <div>Mesh Status: Manifold Watertight Binary STL</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800/80 space-y-2 text-[11px] text-zinc-400">
            <div className="flex justify-between">
              <span>Farm Job ID:</span>
              <span className="text-zinc-200 font-bold">{farmJobId}</span>
            </div>
            <div className="flex justify-between">
              <span>Target Farm:</span>
              <span>Slant 3D Cluster #4 (Boise, ID)</span>
            </div>
            <div className="flex justify-between text-signal-orange">
              <span>Est. Dispatch:</span>
              <span>2–4 Business Days</span>
            </div>
          </div>
        </div>

        {/* PACKAGE B: FAST-SHIP ACCESSORIES (Domestic Hub) */}
        <div className="p-5 rounded-xl bg-surface border border-signal-cyan/40 bg-gradient-to-b from-signal-cyan/5 to-transparent flex flex-col justify-between space-y-4 shadow-tactile">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center space-x-2 text-signal-cyan text-xs font-bold uppercase">
                <Truck className="w-4 h-4" />
                <span>Package B: Domestic Hardware</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-signal-cyan/20 text-signal-cyan text-[10px] font-bold">
                DISPATCHED
              </span>
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              <div className="font-bold text-zinc-100 font-sans">
                Asymmetric Desk ScreenBar (US Domestic)
              </div>
              <div className="p-2.5 rounded bg-black/60 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                <div>Channel: DSers Automated AliExpress Pass-Through</div>
                <div>Warehouse: Salt Lake City, UT (US Domestic)</div>
                <div>Courier: USPS Domestic Ground Priority</div>
                <div>Handling: Picked & Packed under 24h</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800/80 space-y-2 text-[11px] text-zinc-400">
            <div className="flex justify-between">
              <span>Tracking Number:</span>
              <span className="text-zinc-200 font-bold">{trackingNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Carrier:</span>
              <span>USPS Ground Advantage (Tracked)</span>
            </div>
            <div className="flex justify-between text-signal-cyan">
              <span>Est. Delivery:</span>
              <span>2–3 Business Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* ISO 2768-m Metrology Certification & Spec Sheet Export Banner */}
      <div className="p-5 rounded-xl bg-surface border border-surface-border flex flex-col md:flex-row items-center justify-between gap-4 shadow-tactile">
        <div className="flex items-start space-x-3.5 text-xs">
          <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-signal-orange flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-precision-white font-sans text-sm">
                ISO 2768-m Legal Manufacturing Guarantee
              </span>
              <span className="px-1.5 py-0.5 rounded bg-signal-lime/20 text-signal-lime text-[10px] font-bold">
                AUDITED
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans max-w-xl">
              Dimensional variance strictly bounded to ±0.2mm nominal. All CAD meshes computational validated watertight manifold prior to queue insertion.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportSpecSheet}
          className="w-full md:w-auto py-2.5 px-5 rounded-lg bg-signal-orange hover:bg-signal-orange/90 text-black text-xs font-bold tracking-wider flex items-center justify-center space-x-2 transition shadow-tactile active:scale-95 flex-shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>EXPORT PRODUCTION SPEC SHEET (PDF/PRINT)</span>
        </button>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-surface-border gap-4">
        <button
          type="button"
          onClick={onContinueShopping}
          className="text-xs text-zinc-400 hover:text-zinc-200 transition"
        >
          ← Return to Hardware Catalog
        </button>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleExportSpecSheet}
            className="py-3 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-precision-white text-xs font-bold tracking-wider flex items-center justify-center space-x-2 transition flex-1 sm:flex-initial"
          >
            <Printer className="w-4 h-4 text-signal-orange" />
            <span>SPEC SHEET (PDF)</span>
          </button>

          <button
            type="button"
            onClick={() => onTrackOrder && onTrackOrder(orderNumber)}
            className="py-3 px-5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-precision-white text-xs font-bold tracking-wider flex items-center justify-center space-x-2 transition flex-1 sm:flex-initial"
          >
            <span>OPEN REAL-TIME TRACKING PORTAL</span>
            <ArrowRight className="w-4 h-4 text-signal-orange" />
          </button>
        </div>
      </div>
    </div>
  );
};
