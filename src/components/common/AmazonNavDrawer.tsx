/**
 * WAVEZLY MODERN DTC SLIDE-OUT NAVIGATION DRAWER
 * Clean airy white backdrop with electric orange category highlights (#FF6B00),
 * sleek dark charcoal typography (#0F172A), and streamlined DTC structure celebrating
 * both viral 3D prints and everyday consumer goods.
 */

import React, { useEffect } from 'react';
import {
  X,
  ChevronRight,
  Sparkles,
  Box,
  Sliders,
  Radio,
  Gamepad2,
  Coffee,
  Sparkle,
  Car,
  Wrench,
  Home,
  ShieldCheck,
  Flame,
  Truck,
  HelpCircle,
  Package,
} from 'lucide-react';
import { RoomId } from '../../lib/storefront';
import { WavezlyLogo } from './WavezlyLogo';

interface AmazonNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDepartment: (room: RoomId) => void;
  onNavigateTracking: () => void;
  onOpenCustomizer: () => void;
  onOpenDeskPlanner?: () => void;
}

interface DepartmentItem {
  id: RoomId;
  label: string;
  badge?: string;
  icon: React.ReactNode;
}

const DEPARTMENTS: DepartmentItem[] = [
  {
    id: 'trending_3d',
    label: 'Viral 3D Prints & Toys',
    badge: 'VIRAL',
    icon: <Sparkles className="w-4 h-4 text-[#FF6B00]" />,
  },
  {
    id: 'kitchen',
    label: 'Coffee Bar & Kitchen',
    icon: <Coffee className="w-4 h-4 text-amber-700" />,
  },
  {
    id: 'electronics',
    label: 'Gaming & Tech Accessories',
    icon: <Gamepad2 className="w-4 h-4 text-indigo-600" />,
  },
  {
    id: 'home_decor',
    label: 'Home Décor & Planters',
    icon: <Home className="w-4 h-4 text-emerald-600" />,
  },
  {
    id: 'car_auto',
    label: 'Car & Automotive Fit',
    icon: <Car className="w-4 h-4 text-sky-600" />,
  },
  {
    id: 'tools_workshop',
    label: 'Tools & Workshop Organization',
    icon: <Wrench className="w-4 h-4 text-orange-600" />,
  },
  {
    id: 'vanity',
    label: 'Vanity & Bathroom Organizers',
    icon: <Sparkle className="w-4 h-4 text-pink-500" />,
  },
];

export const AmazonNavDrawer: React.FC<AmazonNavDrawerProps> = ({
  isOpen,
  onClose,
  onSelectDepartment,
  onNavigateTracking,
  onOpenCustomizer,
  onOpenDeskPlanner,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Frosted Dark Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modern Slide-out Drawer */}
      <div className="relative w-80 sm:w-96 max-w-[85vw] h-full bg-white flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-250 font-sans border-r border-zinc-100">
        {/* Clean DTC Header with Brand */}
        <div className="bg-white border-b border-zinc-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex flex-col">
            <WavezlyLogo theme="light" size="sm" />
            <span className="text-[11px] text-zinc-400 font-medium mt-1">
              Boise Craft Studio & General Store
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-2 text-zinc-800 text-sm divide-y divide-zinc-100">
          {/* SECTION 1: Shop Categories (Viral 3D & Everyday Goods) */}
          <div className="py-3">
            <div className="px-6 pb-2">
              <span className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">
                Shop Categories
              </span>
            </div>

            {DEPARTMENTS.map((dept) => (
              <button
                key={dept.id}
                type="button"
                onClick={() => {
                  onSelectDepartment(dept.id);
                  onClose();
                }}
                className="w-full px-6 py-2.5 flex items-center justify-between text-left hover:bg-orange-50/50 transition group"
              >
                <span className="flex items-center gap-3 font-medium text-zinc-800 group-hover:text-[#FF6B00]">
                  {dept.icon}
                  <span>{dept.label}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  {dept.badge && (
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-orange-100 text-[#FF6B00] tracking-wide">
                      {dept.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-[#FF6B00] transition" />
                </span>
              </button>
            ))}
          </div>

          {/* SECTION 2: Custom Made-to-Order Studio */}
          <div className="py-3">
            <div className="px-6 pb-2">
              <span className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">
                Custom Made-to-Order Studio
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                onOpenCustomizer();
                onClose();
              }}
              className="w-full px-6 py-2.5 flex items-center justify-between text-left hover:bg-orange-50/50 transition group"
            >
              <span className="flex items-center gap-3 font-medium text-zinc-800 group-hover:text-[#FF6B00]">
                <Box className="w-4 h-4 text-[#FF6B00]" />
                <span>3D Parametric Customizer</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-[#FF6B00] text-white">
                  3D FIT
                </span>
                <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-[#FF6B00]" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onOpenDeskPlanner) {
                  onOpenDeskPlanner();
                } else {
                  onOpenCustomizer();
                }
                onClose();
              }}
              className="w-full px-6 py-2.5 flex items-center justify-between text-left hover:bg-orange-50/50 transition group"
            >
              <span className="flex items-center gap-3 font-medium text-zinc-800 group-hover:text-[#FF6B00]">
                <Sliders className="w-4 h-4 text-[#FF6B00]" />
                <span>Desk & Space 3D Planner</span>
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-[#FF6B00]" />
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigateTracking();
                onClose();
              }}
              className="w-full px-6 py-2.5 flex items-center justify-between text-left hover:bg-orange-50/50 transition group"
            >
              <span className="flex items-center gap-3 font-medium text-zinc-800 group-hover:text-[#FF6B00]">
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span>Boise Workshop Live Stream</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-600 font-extrabold uppercase border border-emerald-200">
                  Live 🔴
                </span>
                <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-[#FF6B00]" />
              </span>
            </button>
          </div>

          {/* SECTION 3: Guarantees & Perks */}
          <div className="py-3">
            <div className="px-6 pb-2">
              <span className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">
                Perks & Guarantees
              </span>
            </div>

            <div className="w-full px-6 py-2.5 flex items-center justify-between text-left hover:bg-zinc-50 transition">
              <span className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-zinc-800">100% Fit Guarantee</span>
              </span>
              <span className="text-xs text-emerald-600 font-semibold">Free Remake</span>
            </div>

            <div className="w-full px-6 py-2.5 flex items-center justify-between text-left hover:bg-zinc-50 transition">
              <span className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-sky-600" />
                <span className="font-medium text-zinc-800">Fast Domestic Shipping</span>
              </span>
              <span className="text-xs text-sky-600 font-semibold">48h Dispatch</span>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectDepartment('deals');
                onClose();
              }}
              className="w-full px-6 py-2.5 flex items-center justify-between text-left hover:bg-orange-50/50 transition group"
            >
              <span className="flex items-center gap-3">
                <Flame className="w-4 h-4 text-red-500" />
                <span className="font-medium text-red-600">Today's Deals</span>
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-red-500" />
            </button>
          </div>

          {/* SECTION 4: Customer Care & Order Tracking */}
          <div className="py-3">
            <div className="px-6 pb-2">
              <span className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">
                Orders & Support
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                onNavigateTracking();
                onClose();
              }}
              className="w-full px-6 py-2.5 flex items-center justify-between text-left hover:bg-orange-50/50 transition group"
            >
              <span className="flex items-center gap-3 font-medium text-zinc-700 group-hover:text-[#FF6B00]">
                <Package className="w-4 h-4 text-[#FF6B00]" />
                <span>Track Packages & Orders</span>
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-[#FF6B00]" />
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigateTracking();
                onClose();
              }}
              className="w-full px-6 py-2.5 flex items-center justify-between text-left hover:bg-orange-50/50 transition group"
            >
              <span className="flex items-center gap-3 font-medium text-zinc-700 group-hover:text-[#FF6B00]">
                <HelpCircle className="w-4 h-4 text-zinc-400 group-hover:text-[#FF6B00]" />
                <span>Help & Customer Care</span>
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-[#FF6B00]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
