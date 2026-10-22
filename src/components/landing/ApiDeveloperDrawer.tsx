/**
 * FORMGRID DEVELOPER & API CONNECTION ENCLAVE
 * Interactive REST API documentation, curl snippets, and live webhook dispatch simulator
 */

import React, { useState } from 'react';
import { Terminal, Copy, Check, Play, ShieldCheck } from 'lucide-react';
import { routeOrderFulfillment } from '../../services/fulfillment/fulfillmentRouter';
import { SEED_MATERIALS } from '../../db/seed';

export const ApiDeveloperDrawer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'checkout' | 'farm' | 'dropship'>('checkout');
  const [copied, setCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simulationResponse, setSimulationResponse] = useState<string | null>(null);

  const snippets = {
    checkout: `curl -X POST https://api.formgrid.design/v1/checkout \\
  -H "Authorization: Bearer fgr_live_sec_9942a" \\
  -H "Content-Type: application/json" \\
  -d '{
    "items": [
      {
        "product_id": "prod_valet_pro",
        "type": "custom_3d",
        "dimensions": { "x": 160, "y": 40, "z": 120, "rows": 2, "cols": 3 },
        "material": "mat_pla_obsidian",
        "resin_inlay": "mat_resin_cobalt"
      },
      {
        "product_id": "prod_screenbar",
        "type": "dropship",
        "quantity": 1
      }
    ],
    "shipping": { "country": "US", "postal_code": "94107" }
  }'`,

    farm: `curl -X POST https://api.slant3d.com/v1/jobs \\
  -H "Authorization: Bearer slant_live_api_8842" \\
  -H "Content-Type: application/json" \\
  -d '{
    "stl_url": "https://storage.formgrid.io/orders/ord_9921/part_01.stl",
    "material": "Obsidian Black PLA",
    "slicing": { "layer_height": 0.20, "infill": 18, "pattern": "gyroid" },
    "quantity": 1
  }'`,

    dropship: `curl -X POST https://api.dsers.com/v1/orders \\
  -H "Authorization: Bearer dsers_token_7721" \\
  -H "Content-Type: application/json" \\
  -d '{
    "supplier_sku": "DS-US-SCRNBR-95CRI",
    "warehouse_filter": "US_DOMESTIC",
    "recipient": { "name": "Dieter Rams", "line1": "100 Kronberg Way", "city": "SF", "state": "CA" }
  }'`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateWebhook = async () => {
    setSimulating(true);
    setSimulationResponse(null);
    try {
      const mockOrder: any = {
        id: `ord_sim_${Date.now()}`,
        orderNumber: `FG-DEV-${Date.now().toString().slice(-4)}`,
        stripeSessionId: `cs_dev_${Date.now()}`,
        customerEmail: 'dev@studio.design',
        customerName: 'Dev Console User',
        shippingAddress: {
          fullName: 'Dev Console User',
          email: 'dev@studio.design',
          line1: '500 Technology Way',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94107',
          country: 'US',
        },
        subtotalCents: 6250,
        shippingCents: 600,
        totalCents: 6850,
        status: 'paid',
        items: [
          {
            id: 'item_3d_dev',
            orderId: 'ord_dev',
            productId: 'prod_valet_pro',
            productTitle: 'Modular Desk Valet Pro',
            fulfillmentType: 'custom_3d',
            unitPriceCents: 3450,
            quantity: 1,
            parametricSpecs: {
              dimensions: {
                length: 160,
                width: 120,
                height: 40,
                wallThickness: 2.8,
                bottomThickness: 2.4,
                rows: 2,
                cols: 3,
                cornerFilletRadius: 8,
                inlayPocketDepth: 2.5,
              },
              material: SEED_MATERIALS[0],
              resinInlay: null,
              volumePlasticCm3: 114.2,
              volumeResinCm3: 0,
              estimatedGrams: 141.6,
              estimatedPrintHours: 3.4,
              totalManufacturingCost: 34.50,
            },
            stlStorageUrl: 'https://storage.formgrid.io/orders/dev_part.stl',
            farmJobId: null,
            dsersOrderId: null,
            autodsItemId: null,
            trackingNumber: null,
            trackingUrl: null,
            fulfillmentStatus: 'unfulfilled',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'item_drop_dev',
            orderId: 'ord_dev',
            productId: 'prod_screenbar',
            productTitle: 'Asymmetric Desk ScreenBar (US Domestic)',
            fulfillmentType: 'dropship',
            unitPriceCents: 4800,
            quantity: 1,
            parametricSpecs: null,
            stlStorageUrl: null,
            farmJobId: null,
            dsersOrderId: 'DS-US-SCRNBR-95CRI',
            autodsItemId: null,
            trackingNumber: null,
            trackingUrl: null,
            fulfillmentStatus: 'unfulfilled',
            createdAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
      };

      const result = await routeOrderFulfillment(mockOrder);
      setSimulationResponse(JSON.stringify(result, null, 2));
    } catch (err: any) {
      setSimulationResponse(`Error: ${err.message}`);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-surface-border font-mono">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-surface-border gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-signal-cyan uppercase tracking-wider mb-1">
            <Terminal className="w-4 h-4" />
            <span>DEVELOPER CONNECTION // API REPOSITORY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-precision-white font-sans">
            Headless Parametric & Fulfillment APIs
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Embed Formgrid's 3D slicing kernel and split-fulfillment hooks directly into custom platforms.
          </p>
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={handleSimulateWebhook}
          disabled={simulating}
          className="flex items-center space-x-2 py-2 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-precision-white text-xs font-bold transition disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 text-signal-lime" />
          <span>{simulating ? 'ROUTING...' : 'TEST LIVE ROUTER WEBHOOK'}</span>
        </button>
      </div>

      {/* Code Window Container */}
      <div className="rounded-2xl bg-black border border-surface-border overflow-hidden shadow-2xl">
        {/* Window Top Bar */}
        <div className="px-4 py-3 bg-[#111114] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
            <span className="text-xs text-zinc-400 font-bold ml-2">REST API INTERFACE // V1</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab('checkout')}
              className={`px-2.5 py-1 rounded text-xs transition ${
                activeTab === 'checkout' ? 'bg-zinc-800 text-signal-orange' : 'text-zinc-500 hover:text-white'
              }`}
            >
              Stripe Split
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('farm')}
              className={`px-2.5 py-1 rounded text-xs transition ${
                activeTab === 'farm' ? 'bg-zinc-800 text-signal-cyan' : 'text-zinc-500 hover:text-white'
              }`}
            >
              Slant3D Farm
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dropship')}
              className={`px-2.5 py-1 rounded text-xs transition ${
                activeTab === 'dropship' ? 'bg-zinc-800 text-signal-lime' : 'text-zinc-500 hover:text-white'
              }`}
            >
              DSers Hub
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 rounded text-zinc-500 hover:text-white transition ml-2"
              title="Copy snippet"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-signal-lime" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-x-auto text-xs text-zinc-300 leading-relaxed max-h-72">
          <pre>{snippets[activeTab]}</pre>
        </div>

        {/* Live Simulation Output Drawer (if triggered) */}
        {simulationResponse && (
          <div className="p-4 bg-[#0a0a0d] border-t border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-signal-lime">
              <span className="flex items-center gap-1 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> LIVE DISPATCH ENGINE SIMULATION COMPLETE (200 OK)
              </span>
              <button
                type="button"
                onClick={() => setSimulationResponse(null)}
                className="text-zinc-500 hover:text-white text-[10px]"
              >
                DISMISS
              </button>
            </div>
            <pre className="text-[11px] text-zinc-400 max-h-48 overflow-y-auto">
              {simulationResponse}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
};
