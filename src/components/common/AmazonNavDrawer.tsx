/**
 * AMAZON-STYLE SLIDE-OUT NAVIGATION DRAWER
 * Opens when user clicks "All" menu button.
 */

import React, { useEffect } from 'react';
import { X, ChevronRight, User, Sparkles, Box, Grid, ShieldCheck, HelpCircle, Package, Heart } from 'lucide-react';
import { ROOMS, RoomId } from '../../lib/storefront';

interface AmazonNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDepartment: (room: RoomId) => void;
  onNavigateTracking: () => void;
  onOpenCustomizer: () => void;
  onOpenDeskPlanner?: () => void;
}

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
      />

      {/* Slide-out drawer */}
      <div className="relative w-80 sm:w-96 max-w-[85vw] h-full bg-white flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-250 font-sans">
        {/* Amazon Dark Navy Header */}
        <div className="bg-[#232f3e] text-white px-7 py-4.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">Hello, Sign in</div>
              <div className="text-xs text-zinc-300">Your Account & Lists</div>
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
        <div className="flex-1 overflow-y-auto py-2 text-zinc-800 text-sm">
          {/* Trending Section */}
          <div className="px-7 py-2.5">
            <div className="text-xs font-bold text-zinc-900 tracking-wider uppercase mb-1">
              Trending & Deals
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onSelectDepartment('deals');
              onClose();
            }}
            className="w-full px-7 py-2.5 flex items-center justify-between text-left hover:bg-zinc-100 transition"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span className="font-medium text-orange-600">Today's Deals</span>
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectDepartment('all');
              onClose();
            }}
            className="w-full px-7 py-2.5 flex items-center justify-between text-left hover:bg-zinc-100 transition"
          >
            <span>Best Sellers</span>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>

          <div className="my-2 border-t border-zinc-200" />

          {/* Digital Tools: 3D Customizer */}
          <div className="px-7 py-2.5">
            <div className="text-xs font-bold text-zinc-900 tracking-wider uppercase mb-1">
              Digital Studio & 3D Tools
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onOpenCustomizer();
              onClose();
            }}
            className="w-full px-7 py-2.5 flex items-center justify-between text-left hover:bg-zinc-100 transition"
          >
            <span className="flex items-center gap-2 font-medium">
              <Box className="w-4 h-4 text-amber-600" />
              <span>3D Customizer Studio</span>
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>
          {onOpenDeskPlanner && (
            <button
              type="button"
              onClick={() => {
                onOpenDeskPlanner();
                onClose();
              }}
              className="w-full px-7 py-2.5 flex items-center justify-between text-left hover:bg-zinc-100 transition"
            >
              <span className="flex items-center gap-2 font-medium">
                <Grid className="w-4 h-4 text-amber-600" />
                <span>Interactive 2D Drawer Planner</span>
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </button>
          )}

          <div className="my-2 border-t border-zinc-200" />

          {/* Shop by Department */}
          <div className="px-7 py-2.5">
            <div className="text-xs font-bold text-zinc-900 tracking-wider uppercase mb-1">
              Shop by Department
            </div>
          </div>
          {ROOMS.filter(r => r.id !== 'all' && r.id !== 'deals').map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                onSelectDepartment(r.id);
                onClose();
              }}
              className="w-full px-7 py-2.5 flex items-center justify-between text-left hover:bg-zinc-100 transition"
            >
              <span>{r.label}</span>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </button>
          ))}

          <div className="my-2 border-t border-zinc-200" />

          {/* Programs & Features */}
          <div className="px-7 py-2.5">
            <div className="text-xs font-bold text-zinc-900 tracking-wider uppercase mb-1">
              Programs & Features
            </div>
          </div>
          <div className="w-full px-7 py-2.5 flex items-center gap-2 text-zinc-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Fit Guarantee & Free Remake</span>
          </div>
          <div className="w-full px-7 py-2.5 flex items-center gap-2 text-zinc-700">
            <Heart className="w-4 h-4 text-orange-500" />
            <span>Handcrafted in Boise, Idaho USA</span>
          </div>

          <div className="my-2 border-t border-zinc-200" />

          {/* Help & Settings */}
          <div className="px-7 py-2.5">
            <div className="text-xs font-bold text-zinc-900 tracking-wider uppercase mb-1">
              Help & Settings
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onNavigateTracking();
              onClose();
            }}
            className="w-full px-7 py-2.5 flex items-center justify-between text-left hover:bg-zinc-100 transition"
          >
            <span className="flex items-center gap-2">
              <Package className="w-4 h-4 text-sky-600" />
              <span>Track Your Orders</span>
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>
          <div className="w-full px-7 py-2.5 flex items-center justify-between text-left text-zinc-600 hover:bg-zinc-100 transition cursor-pointer">
            <span className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-zinc-500" />
              <span>Customer Service & Returns</span>
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
