/**
 * FORMGRID MARKETING ANNOUNCEMENT TICKER
 * Rotating high-impact production status, free shipping threshold, and guarantee badges
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, Cpu, Sparkles } from 'lucide-react';

const MESSAGES = [
  {
    icon: Truck,
    text: 'FREE US DOMESTIC PRIORITY SHIPPING ON ORDERS OVER $60 // AUTO-APPLIED',
    color: 'text-signal-orange',
  },
  {
    icon: Cpu,
    text: 'FARM TELEMETRY: 34 BAMBU/SLANT3D NODES ONLINE • MEDIAN PRINT TIME: 2.8H',
    color: 'text-signal-cyan',
  },
  {
    icon: ShieldCheck,
    text: 'ISO 2768-m GUARANTEE: ±0.25MM DRAWER FIT OR INSTANT FREE RE-PRINT',
    color: 'text-signal-lime',
  },
  {
    icon: Sparkles,
    text: 'LIMITED RUN: CNC TITANIUM BILLET EDC STANDS NOW DISPATCHING FROM ONTARIO, CA',
    color: 'text-signal-amber',
  },
];

export const AnnouncementBar: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % MESSAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const msg = MESSAGES[currentIdx];
  const Icon = msg.icon;

  return (
    <div className="bg-[#0e0e11] border-b border-surface-border text-center py-2 px-4 overflow-hidden font-mono text-[11px] text-zinc-300">
      <div className="flex items-center justify-center space-x-2 transition-all duration-300">
        <Icon className={`w-3.5 h-3.5 ${msg.color} animate-pulse`} />
        <span className="tracking-wider">{msg.text}</span>
      </div>
    </div>
  );
};
