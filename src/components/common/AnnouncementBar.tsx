/**
 * FORMGRID CONSUMER ANNOUNCEMENT TICKER
 * Clean light-mode banner communicating free shipping, fit guarantees, and dispatch speeds
 */

import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, Sparkles, Clock } from 'lucide-react';

const MESSAGES = [
  {
    icon: Truck,
    text: 'FREE US PRIORITY SHIPPING ON ORDERS OVER $60 • AUTOMATICALLY APPLIED AT CHECKOUT',
    color: 'text-orange-600',
  },
  {
    icon: ShieldCheck,
    text: '100% PERFECT FIT GUARANTEE: TAILORED TO YOUR EXACT MILLIMETERS OR FREE REPRINT',
    color: 'text-emerald-600',
  },
  {
    icon: Clock,
    text: 'CRAFTED ON-DEMAND IN OUR USA STUDIO • DISPATCHED WITHIN 48 HOURS',
    color: 'text-sky-600',
  },
  {
    icon: Sparkles,
    text: 'NEW IN STOCK: SOLID MACHINED TITANIUM PENS & WORKSPACE MATS READY TO SHIP',
    color: 'text-amber-500',
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
    <div className="bg-[#f3f4f6] dark:bg-[#111114] border-b border-zinc-200 dark:border-zinc-800 text-center py-2 px-4 overflow-hidden font-mono text-[11px] text-zinc-700 dark:text-zinc-300 transition-colors">
      <div className="flex items-center justify-center space-x-2">
        <Icon className={`w-3.5 h-3.5 ${msg.color}`} />
        <span className="tracking-wide font-medium">{msg.text}</span>
      </div>
    </div>
  );
};
