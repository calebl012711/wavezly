/**
 * WAVEZLY MODERN MINIMALIST DTC HEADER
 * Clean airy white aesthetic with frosted glassmorphism, electric orange accents (#FF6B00),
 * sleek dark charcoal typography (#0F172A), rounded pill search bar, and clean navigation links.
 */

import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  MapPin,
  Menu,
  Sparkles,
  Package,
  Heart,
  SlidersHorizontal,
  X,
  Truck,
  Flame,
  CheckCircle2,
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
  isSpecial?: boolean;
  badge?: string;
}

const NAV_CATEGORIES: NavCategory[] = [
  { id: 'trending_3d', label: 'Viral 3D', badge: 'HOT' },
  { id: 'home_decor', label: 'Home & Living' },
  { id: 'kitchen', label: 'Coffee & Kitchen' },
  { id: 'electronics', label: 'Gaming & Tech' },
  { id: 'car_auto', label: 'Car & Auto' },
  { id: 'custom', label: 'Custom 3D Fit', isSpecial: true, badge: 'STUDIO' },
  { id: 'deals', label: 'Deals', badge: 'SAVE' },
];

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  onOpenDeskPlanner,
  searchQuery,
  onSearch,
  activeRoom,
  onSelectRoom,
}) => {
  const { openCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState('Boise, ID 83702');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [tempZip, setTempZip] = useState('83702');
  const [showWishlistToast, setShowWishlistToast] = useState(false);

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

  const handleSaveZip = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanZip = tempZip.trim();
    if (cleanZip) {
      setDeliveryLocation(cleanZip.includes(',') ? cleanZip : `ZIP ${cleanZip}`);
      setShowLocationModal(false);
    }
  };

  const triggerWishlistToast = () => {
    setShowWishlistToast(true);
    setTimeout(() => setShowWishlistToast(false), 2400);
  };

  return (
    <>
      {/* ============================================================ */}
      {/* 1. TOP ANNOUNCEMENT MICRO-BAR                                */}
      {/* ============================================================ */}
      <div className="bg-[#0F172A] text-zinc-300 text-[11px] sm:text-xs py-1.5 px-4 font-sans select-none border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B00]" />
            </span>
            <span className="font-medium text-zinc-200">
              Hand-crafted in Boise, ID • Free US shipping on orders $35+
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-zinc-400">
            <button
              type="button"
              onClick={() => onNavigate('tracking')}
              className={`hover:text-white transition flex items-center gap-1 text-[11px] font-medium ${
                currentRoute === 'tracking' ? 'text-[#FF6B00]' : ''
              }`}
            >
              <Package className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Track Orders</span>
            </button>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400 text-[11px]">48h Rapid Dispatch</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400 text-[11px]">100% Fit Guarantee</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. MAIN MODERN DTC STICKY HEADER                             */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] font-sans select-none transition-all">
        {/* Tier 1: Primary Navigation Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-3 sm:gap-6">
            {/* Left: Mobile Menu Button & Wavezly Brand */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsNavDrawerOpen(true)}
                className="lg:hidden p-2 rounded-lg text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5 stroke-[2]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectRoom('all');
                  onNavigate('home');
                }}
                className="flex items-center gap-2 group text-left focus:outline-none"
                aria-label="Wavezly Home"
              >
                <WavezlyLogo theme="light" size="md" />
              </button>
            </div>

            {/* Center: Sleek Rounded Pill Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 max-w-xl mx-auto hidden sm:flex items-center"
              role="search"
            >
              <div className="relative w-full flex items-center bg-zinc-100/90 hover:bg-zinc-100/70 focus-within:bg-white rounded-full border border-zinc-200/90 focus-within:border-[#FF6B00] focus-within:ring-2 focus-within:ring-[#FF6B00]/15 transition-all shadow-xs">
                <Search className="w-4 h-4 text-zinc-400 ml-3.5 flex-shrink-0 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Search viral 3D prints, desk gear, car mounts, custom fit…"
                  className="w-full py-2 pl-2.5 pr-9 text-xs sm:text-sm text-[#0F172A] placeholder-zinc-400 bg-transparent focus:outline-none font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearch('')}
                    className="p-1 mr-1 text-zinc-400 hover:text-zinc-600 rounded-full transition"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="mr-1.5 p-1.5 rounded-full bg-[#FF6B00] hover:bg-[#ea5f00] text-white flex-shrink-0 transition shadow-xs"
                  aria-label="Submit search"
                >
                  <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </form>

            {/* Right: Actions (Location, Wishlist, Tracking, Cart) */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              {/* Subtle Location Indicator */}
              <button
                type="button"
                onClick={() => setShowLocationModal(true)}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 text-xs text-zinc-700 hover:text-[#0F172A] transition"
                title="Change Delivery Location"
              >
                <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span className="font-medium">Ships to {deliveryLocation}</span>
                <span className="text-[10px] text-zinc-400 font-semibold">• 48h</span>
              </button>

              {/* Wishlist / Favorites Button */}
              <button
                type="button"
                onClick={triggerWishlistToast}
                className="relative p-2 rounded-full text-zinc-600 hover:text-[#FF6B00] hover:bg-orange-50/60 transition"
                aria-label="Favorites & Wishlist"
                title="Your Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.8]" />
              </button>

              {/* Order Tracking (Tablet/Desktop) */}
              <button
                type="button"
                onClick={() => onNavigate('tracking')}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  currentRoute === 'tracking'
                    ? 'bg-orange-50 text-[#FF6B00] border border-orange-200/80'
                    : 'text-zinc-700 hover:text-[#0F172A] hover:bg-zinc-100'
                }`}
                title="Real-Time Order Tracking"
              >
                <Truck className="w-4 h-4 text-[#FF6B00]" />
                <span>Tracking</span>
              </button>

              {/* Modern DTC Cart Button */}
              <button
                type="button"
                onClick={openCart}
                className="flex items-center gap-2 pl-3 pr-3.5 py-2 rounded-full bg-[#0F172A] hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition transform hover:scale-[1.02] active:scale-[0.98]"
                aria-label={`Cart with ${itemCount} items`}
              >
                <ShoppingCart className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Cart</span>
                <span
                  className={`min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-[11px] font-extrabold ${
                    itemCount > 0
                      ? 'bg-[#FF6B00] text-white shadow-xs'
                      : 'bg-zinc-700 text-zinc-300'
                  }`}
                >
                  {itemCount}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Search Row (visible on small screens) */}
          <div className="sm:hidden pb-3 pt-1">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center" role="search">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search viral 3D prints, desk gear, car fit…"
                className="w-full py-2 pl-9 pr-8 text-xs text-[#0F172A] placeholder-zinc-400 bg-zinc-100 rounded-full border border-zinc-200 focus:outline-none focus:border-[#FF6B00] font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearch('')}
                  className="absolute right-3 p-1 text-zinc-400 hover:text-zinc-600 rounded-full"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Tier 2: Category Ribbon Navigation */}
        <div className="border-t border-zinc-100 bg-white/70">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-10 overflow-x-auto no-scrollbar gap-1 sm:gap-2">
              {/* Category Link List */}
              <div className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap py-1">
                {/* All Menu Button */}
                <button
                  type="button"
                  onClick={() => setIsNavDrawerOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-zinc-700 hover:text-[#0F172A] hover:bg-zinc-100 transition mr-1"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
                  <span>All</span>
                </button>

                {/* Main DTC Nav Links */}
                {NAV_CATEGORIES.map((cat) => {
                  const isCurrent =
                    cat.id === 'custom'
                      ? currentRoute === 'customizer'
                      : currentRoute === 'home' && activeRoom === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryClick(cat)}
                      className={`group relative flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${
                        isCurrent
                          ? 'bg-orange-50 text-[#FF6B00] font-semibold'
                          : 'text-zinc-600 hover:text-[#0F172A] hover:bg-zinc-100/80'
                      }`}
                    >
                      {cat.id === 'trending_3d' && (
                        <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                      )}
                      {cat.id === 'deals' && (
                        <Flame className="w-3.5 h-3.5 text-[#FF6B00]" />
                      )}
                      <span>{cat.label}</span>
                      {cat.badge && (
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full tracking-wider ${
                            cat.isSpecial
                              ? 'bg-[#FF6B00] text-white'
                              : isCurrent
                              ? 'bg-orange-200/80 text-[#FF6B00]'
                              : 'bg-zinc-100 text-zinc-500 group-hover:bg-orange-100 group-hover:text-[#FF6B00]'
                          }`}
                        >
                          {cat.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right Teaser Badge: Craftsmanship Guarantee */}
              <div className="hidden lg:flex items-center gap-2 pl-4 text-[11px] text-zinc-500 font-medium whitespace-nowrap">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Boise Craft Lab</span>
                </span>
                <span className="text-zinc-300">•</span>
                <span>USPS 48h Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 3. LOCATION SELECTOR MODAL (CLEAN DTC STYLE)                 */}
      {/* ============================================================ */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-sans animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-zinc-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#FF6B00]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0F172A]">Choose your delivery location</h3>
                  <p className="text-[11px] text-zinc-400">Domestic shipping from Boise, Idaho</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Real-time delivery estimates and production times are calculated from our Boise print farm:
            </p>

            <form onSubmit={handleSaveZip} className="flex gap-2">
              <input
                type="text"
                value={tempZip}
                onChange={(e) => setTempZip(e.target.value)}
                placeholder="Enter ZIP code (e.g. 83702)"
                maxLength={10}
                className="flex-1 h-10 px-3.5 border border-zinc-200 rounded-xl text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/15"
                autoFocus
              />
              <button
                type="submit"
                className="h-10 px-4 bg-[#0F172A] hover:bg-black text-white rounded-xl font-semibold text-xs transition shadow-xs"
              >
                Update
              </button>
            </form>

            <div className="pt-2 text-[11px] text-zinc-400 flex items-center justify-between">
              <span>Standard delivery: 2-3 business days</span>
              <span className="text-emerald-600 font-semibold">Priority Available</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. WISHLIST TOAST NOTIFICATION                              */}
      {/* ============================================================ */}
      {showWishlistToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium animate-in slide-in-from-bottom-3 duration-200 border border-zinc-800">
          <Heart className="w-4 h-4 text-[#FF6B00] fill-[#FF6B00]" />
          <span>Wishlist saved! Sign in to sync across your devices.</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. MODERN SLIDE-OUT NAVIGATION DRAWER                       */}
      {/* ============================================================ */}
      <AmazonNavDrawer
        isOpen={isNavDrawerOpen}
        onClose={() => setIsNavDrawerOpen(false)}
        onSelectDepartment={(room) => {
          onSelectRoom(room);
          if (currentRoute !== 'home') {
            onNavigate('home');
          }
          setTimeout(() => {
            document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }}
        onNavigateTracking={() => onNavigate('tracking')}
        onOpenCustomizer={() => onNavigate('customizer')}
        onOpenDeskPlanner={onOpenDeskPlanner}
      />
    </>
  );
};
