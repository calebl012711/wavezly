/**
 * WAVEZLY CLEAN DTC HEADER
 * Lightweight, fully responsive, touch-friendly navigation.
 * Zero horizontal overflow on mobile viewports.
 */

import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Menu,
  Package,
  X,
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { RoomId } from '../../lib/storefront';
import { AmazonNavDrawer } from './AmazonNavDrawer';
import { WavezlyLogo } from './WavezlyLogo';

interface HeaderProps {
  currentRoute: 'home' | 'customizer' | 'tracking';
  onNavigate: (route: 'home' | 'customizer' | 'tracking') => void;
  onOpenDeskPlanner?: () => void;
  searchQuery: string;
  onSearch: (q: string) => void;
  activeRoom: RoomId;
  onSelectRoom: (room: RoomId) => void;
}

interface NavCategory {
  id: RoomId;
  label: string;
}

const NAV_CATEGORIES: NavCategory[] = [
  { id: 'all', label: 'All Products' },
  { id: 'trending_3d', label: 'Desk Toys & Fidgets' },
  { id: 'home_decor', label: 'Lamps & Décor' },
  { id: 'kitchen', label: 'Coffee & Kitchen' },
  { id: 'electronics', label: 'Gaming & Desk' },
  { id: 'car_auto', label: 'Car Accessories' },
  { id: 'custom', label: 'Custom 3D Fit' },
];

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  searchQuery,
  onSearch,
  activeRoom,
  onSelectRoom,
}) => {
  const { openCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRoute !== 'home') {
      onNavigate('home');
    }
    setTimeout(() => {
      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleCategoryClick = (category: NavCategory) => {
    if (category.id === 'custom') {
      onNavigate('customizer');
      return;
    }

    onSelectRoom(category.id);
    if (currentRoute !== 'home') {
      onNavigate('home');
    }
    setTimeout(() => {
      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="bg-[#0F172A] text-zinc-300 text-[11px] sm:text-xs py-1.5 px-3 font-sans select-none border-b border-zinc-800 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00] shrink-0" />
            <span className="font-medium text-zinc-200 truncate">
              Printed on demand in the USA • Free shipping on orders $35+
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-zinc-400 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('tracking')}
              className={`hover:text-white transition flex items-center gap-1 text-[11px] font-medium cursor-pointer ${
                currentRoute === 'tracking' ? 'text-[#FF6B00]' : ''
              }`}
            >
              <Package className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Track Orders</span>
            </button>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400 text-[11px]">Ships in 48 Hours</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN CLEAN DTC STICKY HEADER */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200/80 font-sans select-none">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="h-14 sm:h-16 flex items-center justify-between gap-3">
            {/* Left: Hamburger (mobile) + Wavezly Logo */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsNavDrawerOpen(true)}
                className="lg:hidden p-2 -ml-1 rounded-lg text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectRoom('all');
                  onNavigate('home');
                }}
                className="flex items-center gap-2 text-left cursor-pointer focus:outline-none"
                aria-label="Wavezly Home"
              >
                <WavezlyLogo theme="light" size="md" />
              </button>
            </div>

            {/* Center: Desktop Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 max-w-lg mx-auto hidden md:flex items-center"
              role="search"
            >
              <div className="relative w-full flex items-center bg-zinc-100 focus-within:bg-white rounded-full border border-zinc-200 focus-within:border-[#FF6B00] focus-within:ring-2 focus-within:ring-[#FF6B00]/15 transition-all">
                <Search className="w-4 h-4 text-zinc-400 ml-3.5 shrink-0 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Search toys, lamps, custom organizers…"
                  className="w-full py-2 pl-2.5 pr-8 text-xs sm:text-sm text-[#0F172A] placeholder-zinc-400 bg-transparent focus:outline-none font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearch('')}
                    className="p-1 mr-2 text-zinc-400 hover:text-zinc-600 rounded-full cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>

            {/* Right: Search Toggle (mobile), Track Orders, Cart */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Mobile Search Toggle */}
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="md:hidden p-2 rounded-full text-zinc-600 hover:text-[#0F172A] hover:bg-zinc-100 transition cursor-pointer"
                aria-label="Toggle search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Order Tracking (Tablet/Desktop) */}
              <button
                type="button"
                onClick={() => onNavigate('tracking')}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  currentRoute === 'tracking'
                    ? 'bg-orange-50 text-[#FF6B00] border border-orange-200'
                    : 'text-zinc-700 hover:text-[#0F172A] hover:bg-zinc-100'
                }`}
              >
                <Package className="w-4 h-4 text-[#FF6B00]" />
                <span>Track Order</span>
              </button>

              {/* Cart Button */}
              <button
                type="button"
                onClick={openCart}
                className="relative flex items-center gap-2 pl-3 pr-3.5 py-1.5 sm:py-2 rounded-full bg-[#0F172A] hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition cursor-pointer active:scale-95"
                aria-label={`Cart with ${itemCount} items`}
              >
                <div className="relative flex items-center">
                  <ShoppingCart className="w-4 h-4 text-white" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5 pointer-events-none">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF6B00]"></span>
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">Cart</span>
                <span
                  className={`min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[10px] font-bold ${
                    itemCount > 0
                      ? 'bg-[#FF6B00] text-white animate-pulse'
                      : 'bg-zinc-700 text-zinc-300'
                  }`}
                >
                  {itemCount}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar Dropdown */}
          {isMobileSearchOpen && (
            <div className="md:hidden pb-3 pt-1">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center" role="search">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Search toys, lamps, custom organizers…"
                  autoFocus
                  className="w-full py-2 pl-9 pr-8 text-xs text-[#0F172A] placeholder-zinc-400 bg-zinc-100 rounded-full border border-zinc-200 focus:outline-none focus:border-[#FF6B00] font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearch('')}
                    className="absolute right-3 p-1 text-zinc-400 hover:text-zinc-600 rounded-full cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>
            </div>
          )}
        </div>

        {/* 3. CATEGORY SCROLL RIBBON (Smooth horizontal scroll on mobile, zero blowout) */}
        <div className="border-t border-zinc-100 bg-zinc-50/70 w-full overflow-hidden">
          <div className="max-w-7xl mx-auto px-3 sm:px-6">
            <div className="flex items-center gap-1.5 py-1.5 overflow-x-auto no-scrollbar scroll-smooth">
              {NAV_CATEGORIES.map((cat) => {
                const isSelected =
                  cat.id === 'custom'
                    ? currentRoute === 'customizer'
                    : currentRoute === 'home' && activeRoom === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryClick(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#0F172A] text-white shadow-xs'
                        : 'text-zinc-600 hover:text-[#0F172A] hover:bg-zinc-200/60'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Navigation Drawer for Mobile/Tablet */}
      <AmazonNavDrawer
        isOpen={isNavDrawerOpen}
        onClose={() => setIsNavDrawerOpen(false)}
        onSelectDepartment={(room: RoomId) => {
          onSelectRoom(room);
          if (currentRoute !== 'home') onNavigate('home');
          setTimeout(() => {
            document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }}
        onNavigateTracking={() => onNavigate('tracking')}
        onOpenCustomizer={() => onNavigate('customizer')}
        searchQuery={searchQuery}
        onSearch={onSearch}
      />
    </>
  );
};
