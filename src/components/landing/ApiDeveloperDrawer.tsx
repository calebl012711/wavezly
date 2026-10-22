/**
 * FORMGRID STUDIO API & DUAL FULFILLMENT WEBHOOK CONSOLE
 * Collapsible partner drawer with REST API snippets, curl commands, and live webhook routing simulator
 */

import React, { useState } from 'react';
import { Terminal, Copy, Check, Play, ShieldCheck, ChevronDown, ChevronUp, Code2 } from 'lucide-react';
import { routeOrderFulfillment } from '../../services/fulfillment/fulfillmentRouter';
import { playClickSound } from '../../lib/soundEffects';

export const ApiDeveloperDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    playClickSound('snap');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateWebhook = async () => {
    setSimulating(true);
    setSimulationResponse(null);
    playClickSound('tick');
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
            orderId: 'ord_sim_992',
            productId: 'prod_valet_pro',
            productTitle: 'Modular Desk Valet Pro',
            fulfillmentType: 'custom_3d',
            unitPriceCents: 3800,
            quantity: 1,
            parametricSpecs: {
              dimensions: { length: 175, width: 125, height: 38, rows: 2, cols: 3 },
              material: { name: 'Matte Obsidian Black' },
              volumePlasticCm3: 84.5,
              estimatedGrams: 104.8,
              estimatedPrintHours: 3.4,
            },
          },
          {
            id: 'item_drop_dev',
            orderId: 'ord_sim_992',
            productId: 'prod_screenbar',
            productTitle: 'Precision Asymmetric ScreenBar Luminaire',
            fulfillmentType: 'dropship',
            unitPriceCents: 4900,
            quantity: 1,
            supplierMeta: {
              channel: 'dsers',
              sku: 'DS-US-SCRNBR-95CRI',
              warehouseOrigin: 'Salt Lake City, UT (USA Domestic)',
            },
          },
        ],
      };

      const result = await routeOrderFulfillment(mockOrder);
      setSimulationResponse(JSON.stringify(result, null, 2));
      playClickSound('success');
    } finally {
      setSimulating(false);
    }
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-200 dark:border-zinc-800 font-sans">
      {/* Discreet Consumer Accordion Header */}
      <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Studio & Architectural API Integration
            </h4>
            <p className="text-xs text-zinc-500">
              For interior architects, 3D studios, and automated warehouse fulfillment hooks
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playClickSound('snap');
            setIsOpen(!isOpen);
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition cursor-pointer shadow-2xs"
        >
          <span>{isOpen ? 'Collapse API Tools' : 'Open Developer API'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded API & Webhook Console */}
      {isOpen && (
        <div className="mt-4 p-6 rounded-2xl bg-zinc-950 text-zinc-100 font-mono text-xs space-y-6 shadow-xl border border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800 gap-3">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-white uppercase tracking-wider">
                Headless Checkout & Split Webhook Gateway
              </span>
            </div>

            {/* Snippet Tabs */}
            <div className="flex items-center space-x-1 p-0.5 bg-zinc-900 rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => setActiveTab('checkout')}
                className={`px-3 py-1 rounded text-[11px] transition ${
                  activeTab === 'checkout'
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                /v1/checkout
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('farm')}
                className={`px-3 py-1 rounded text-[11px] transition ${
                  activeTab === 'farm'
                    ? 'bg-zinc-800 text-orange-400 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Slant3D Farm API
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dropship')}
                className={`px-3 py-1 rounded text-[11px] transition ${
                  activeTab === 'dropship'
                    ? 'bg-zinc-800 text-sky-400 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                DSers Domestic Hook
              </button>
            </div>
          </div>

          {/* Active Snippet Code Box */}
          <div className="relative p-4 rounded-xl bg-black border border-zinc-800 overflow-x-auto text-[11px] leading-relaxed text-zinc-300">
            <button
              type="button"
              onClick={handleCopy}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition"
              title="Copy snippet"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <pre className="font-mono">{snippets[activeTab]}</pre>
          </div>

          {/* Interactive Webhook Simulator */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-bold text-xs">Live Dual-Fulfillment Webhook Simulator</div>
                <div className="text-zinc-400 text-[11px]">
                  Fires client-side test through both 3D Print Farm and Domestic Accessory logistics router
                </div>
              </div>

              <button
                type="button"
                onClick={handleSimulateWebhook}
                disabled={simulating}
                className="py-2 px-4 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs tracking-wider flex items-center space-x-1.5 transition disabled:opacity-50 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{simulating ? 'DISPATCHING...' : 'TRIGGER SIMULATION'}</span>
              </button>
            </div>

            {simulationResponse && (
              <div className="mt-3 p-3 rounded-lg bg-black border border-emerald-900/60 text-emerald-400 overflow-x-auto text-[10px]">
                <div className="flex items-center space-x-1 font-bold text-emerald-300 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>200 OK — DUAL PACKAGES ROUTED INDEPENDENTLY</span>
                </div>
                <pre>{simulationResponse}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
