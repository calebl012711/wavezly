/**
 * WAVEZLY CLEAN SLIDE-OUT NAVIGATION DRAWER
 * Minimalist consumer navigation drawer.
 * Removed all fake live streams and developer clutter.
 */

import React, { useEffect } from 'react';
import {
  X,
  ChevronRight,
  Sparkles,
  Box,
  Gamepad2,
  Coffee,
  Sparkle,
  Car,
  Home,
  ShieldCheck,
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
    label: 'Desk Toys & Fidgets',
    badge: 'HOT',
    icon: <Sparkles className="w-4 h-4 text-[#FF6B00]" />,
  },
  {
    id: 'home_decor',
    label: 'Lamps & Home Décor',
    icon: <Home className="w-4 h-4 text-emerald-600" />,
  },
  {
    id: 'kitchen',
    label: 'Coffee & Kitchen',
    icon: <Coffee className="w-4 h-4 text-amber-700" />,
  },
  {
    id: 'electronics',
    label: 'Gaming & Desk Gear',
    icon: <Gamepad2 className="w-4 h-4 text-indigo-600" />,
  },
  {
    id: 'car_auto',
    label: 'Car Accessories',
    icon: <Car className="w-4 h-4 text-sky-600" />,
  },
  {
    id: 'vanity',
    label: 'Bathroom & Vanity',
    icon: <Sparkle className="w-4 h-4 text-pink-500" />,
  },
];

export const AmazonNavDrawer: React.FC<AmazonNavDrawerProps> = ({
  isOpen,
  onClose,
  onSelectDepartment,
  onNavigateTracking,
  onOpenCustomizer,
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-80 max-w-[85vw] h-full bg-white flex flex-col z-10 shadow-2xl font-sans border-r border-zinc-200">
        {/* Header */}
        <div className="border-b border-zinc-100 px-5 py-4 flex items-center justify-between shrink-0">
          <div>
            <WavezlyLogo theme="light" size="sm" />
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">
              Everyday Goods, 3D Printed to Order
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 text-xs">
          {/* Section 1: Categories */}
          <div className="py-3">
            <div className="px-5 pb-2">
              <span className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">
                Shop Categories
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectDepartment('all');
                onClose();
              }}
              className="w-full px-5 py-2.5 flex items-center justify-between text-left hover:bg-zinc-50 transition cursor-pointer"
            >
              <span className="font-semibold text-zinc-900">All Products</span>
              <ChevronRight className="w-4 h-4 text-zinc-300" />
            </button>

            {DEPARTMENTS.map((dept) => (
              <button
                key={dept.id}
                type="button"
                onClick={() => {
                  onSelectDepartment(dept.id);
                  onClose();
                }}
                className="w-full px-5 py-2.5 flex items-center justify-between text-left hover:bg-zinc-50 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {dept.icon}
                  <span className="font-medium text-zinc-800">{dept.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {dept.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-100 text-[#FF6B00] font-bold">
                      {dept.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-zinc-300" />
                </div>
              </button>
            ))}
          </div>

          {/* Section 2: Custom Sizing & Order Tracking */}
          <div className="py-3">
            <div className="px-5 pb-2">
              <span className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">
                Custom Orders & Tracking
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                onOpenCustomizer();
                onClose();
              }}
              className="w-full px-5 py-2.5 flex items-center justify-between text-left hover:bg-orange-50/60 transition cursor-pointer"
            >
              <span className="flex items-center gap-3 font-semibold text-[#FF6B00]">
                <Box className="w-4 h-4 text-[#FF6B00]" />
                <span>Custom Drawer Sizer (3D)</span>
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-300" />
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigateTracking();
                onClose();
              }}
              className="w-full px-5 py-2.5 flex items-center justify-between text-left hover:bg-zinc-50 transition cursor-pointer"
            >
              <span className="flex items-center gap-3 font-medium text-zinc-800">
                <Package className="w-4 h-4 text-[#FF6B00]" />
                <span>Track Your Order</span>
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-300" />
            </button>
          </div>

          {/* Section 3: Guarantee */}
          <div className="py-4 px-5 bg-zinc-50/60">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-zinc-800 block text-xs">
                  100% Fit Guarantee
                </span>
                <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                  If your custom drawer piece does not fit your space, we reprint and ship it free.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-zinc-100 bg-white text-[11px] text-zinc-400 text-center">
          Crafted to order in the USA • Free shipping on orders $35+
        </div>
      </div>
    </div>
  );
};
