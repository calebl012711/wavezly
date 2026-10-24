/**
 * WAVEZLY AMAZON-STYLE SLIDE-OUT NAVIGATION DRAWER
 * Opens when user clicks "All" menu button.
 * Authentic Amazon slide-out drawer with Digital Content & Devices,
 * Shop by Department, Programs & Features, and Help & Settings.
 */

import React, { useEffect } from 'react';
import {
  X,
  ChevronRight,
  User,
  Sparkles,
  Box,
  Sliders,
  Radio,
  Gamepad2,
  UtensilsCrossed,
  Sparkle,
  Car,
  Wrench,
  Home,
  ShieldCheck,
  Zap,
  Flame,
  Gift,
  Package,
  HelpCircle,
} from 'lucide-react';
import { RoomId } from '../../lib/storefront';

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
  icon: React.ReactNode;
}

const DEPARTMENTS: DepartmentItem[] = [
  {
    id: 'trending_3d',
    label: 'Trending 3D Prints & Toys',
    icon: <Sparkles className="w-4 h-4 text-amber-500" />,
  },
  {
    id: 'kitchen',
    label: 'Kitchen & Dining',
    icon: <UtensilsCrossed className="w-4 h-4 text-emerald-600" />,
  },
  {
    id: 'electronics',
    label: 'Electronics & Gaming',
    icon: <Gamepad2 className="w-4 h-4 text-indigo-500" />,
  },
  {
    id: 'vanity',
    label: 'Vanity & Bath',
    icon: <Sparkle className="w-4 h-4 text-pink-500" />,
  },
  {
    id: 'car_auto',
    label: 'Car Accessories & Auto',
    icon: <Car className="w-4 h-4 text-sky-500" />,
  },
  {
    id: 'tools_workshop',
    label: 'Tools & Workshop',
    icon: <Wrench className="w-4 h-4 text-orange-500" />,
  },
  {
    id: 'home_decor',
    label: 'Home Décor & Planters',
    icon: <Home className="w-4 h-4 text-teal-600" />,
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
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 bg-black/70 transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out drawer */}
      <div className="relative w-80 sm:w-96 max-w-[85vw] h-full bg-white flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-250 font-sans">
        {/* Amazon Dark Navy Header */}
        <div className="bg-[#232f3e] text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight">Hello, Sign in</div>
              <div className="text-xs text-zinc-300">Browse Wavezly</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-white hover:text-amber-400 transition"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Menu Items */}
        <div className="flex-1 overflow-y-auto py-2 text-zinc-800 text-sm divide-y divide-zinc-200">
          {/* SECTION 1: Digital Content & Devices */}
          <div className="py-2">
            <div className="px-6 py-2">
              <div className="text-xs font-bold text-zinc-900 tracking-wider uppercase">
                Digital Content & Devices
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onOpenCustomizer();
                onClose();
              }}
              className="w-full px-6 py-2.5 flex items-center justify-between text-left hover:bg-zinc-100 transition group"
            >
              <span className="flex items-center gap-2.5 font-medium text-zinc-800 group-hover:text-amber-600">
                <Box className="w-4 h-4 text-amber-500" />
                <span>Wavezly Custom 3D Studio</span>
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700" />
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
              className="w-full px-6 py-2.5 flex items-center justify-between text-left hover:bg-zinc-100 transition group"
            >
              <span className="flex items-center gap-2.5 font-medium text-zinc-800 group-hover:text-amber-600">
                <Sliders className="w-4 h-4 text-amber-500" />
                <span>Real-Time Parametric Sizer</span>
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700" />
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigateTracking();
                onClose();
              }}
              className="w-full px-6 py-2.5 flex items-center justify-between text-left hover:bg-zinc-100 transition group"
            >
              <span className="flex items-center gap-2.5 font-medium text-zinc-800 group-hover:text-emerald-600">
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span>Boise Workshop Live</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-extrabold uppercase tracking-wide">
                  Live 🔴
                </span>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700" />
              </span>
            </button>
          </div>

          {/* SECTION 2: Shop by Department */}
          <div className="py-2">
            <div className="px-6 py-2">
              <div className="text-xs font-bold text-zinc-900 tracking-wider uppercase">
                Shop by Department
              </div>
            </div>
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept.id}
                type="button"
                onClick={() => {
                  onSelectDepartment(dept.id);
                  onClose();
                }}
                className="w-full px-6 py-2.5 flex items-center justify-between text-left hover:bg-zinc-100 transition group"
              >
                <span className="flex items-center gap-2.5 font-medium text-zinc-800 group-hover:text-zinc-900">
                  {dept.icon}
                  <span>{dept.label}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700" />
              </button>
            ))}
          </div>

          {/* SECTION 3: Programs & Features */}
          <div className="py-2">
            <div className="px-6 py-2">
              <div className="text-xs font-bold text-zinc-900 tracking-wider uppercase">
                Programs & Features
              </div>
            </div>

            <div className="w-full px-6 py-2.5 flex items-center justify-between text-left hover:bg-zinc-100 transition cursor-pointer">
              <span className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-[#00a8e1]" />
                <span className="font-medium text-zinc-800">Wavezly Prime</span>
              </span>
              <span className="text-xs text-[#00a8e1] font-bold">Fast & Free</span>
            </div>

            <div className="w-full px-6 py-2.5 flex items-center justify-between text-left hover:bg-zinc-100 transition cursor-pointer">
              <span className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-zinc-800">100% Fit Guarantee</span>
              </span>
              <span className="text-xs text-emerald-600 font-semibold">Free Remake</span>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectDepartment('deals');
                onClose();
              }}
              className="w-full px-6 py-2.5 flex items-center justify-between text-left hover:bg-zinc-100 transition group"
            >
              <span className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-red-500" />
                <span className="font-medium text-red-600">Today's Lightning Deals</span>
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700" />
            </button>

            <div className="w-full px-6 py-2.5 flex items-center justify-between text-left hover:bg-zinc-100 transition cursor-pointer">
              <span className="flex items-center gap-2.5">
                <Gift className="w-4 h-4 text-purple-500" />
                <span className="font-medium text-zinc-800">Gift Cards</span>
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>
          </div>

          {/* SECTION 4: Help & Settings */}
          <div className="py-2">
            <div className="px-6 py-2">
              <div className="text-xs font-bold text-zinc-900 tracking-wider uppercase">
                Help & Settings
              </div>
            </div>

            <div className="w-full px-6 py-2.5 flex items-center justify-between text-left hover:bg-zinc-100 transition cursor-pointer">
              <span className="flex items-center gap-2.5 text-zinc-700">
                <User className="w-4 h-4 text-zinc-500" />
                <span>Your Account</span>
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>

            <button
              type="button"
              onClick={() => {
                onNavigateTracking();
                onClose();
              }}
              className="w-full px-6 py-2.5 flex items-center justify-between text-left hover:bg-zinc-100 transition group"
            >
              <span className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-sky-600" />
                <span className="text-zinc-700 group-hover:text-zinc-900">Track Orders</span>
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700" />
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigateTracking();
                onClose();
              }}
              className="w-full px-6 py-2.5 flex items-center justify-between text-left hover:bg-zinc-100 transition group"
            >
              <span className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-700 group-hover:text-zinc-900">Customer Service</span>
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
