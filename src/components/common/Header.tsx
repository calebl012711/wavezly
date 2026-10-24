/**
 * WAVEZLY AMAZON-STYLE STOREFRONT HEADER
 * Authentic Amazon dark navy navigation bar, department search dropdown,
 * zip-code location selector, returns & orders, and secondary subnav ribbon.
 */

import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  MapPin,
  Menu,
  ChevronDown,
  Sparkles,
  Package,
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

const SEARCH_DEPARTMENTS: { id: RoomId; label: string }[] = [
  { id: 'all', label: 'All Departments' },
  { id: 'trending_3d', label: 'Trending 3D Prints & Toys' },
  { id: 'kitchen', label: 'Kitchen & Dining' },
  { id: 'electronics', label: 'Electronics & Gaming' },
  { id: 'vanity', label: 'Vanity & Bath' },
  { id: 'home_decor', label: 'Home Décor & Planters' },
  { id: 'car_auto', label: 'Car & Automotive' },
  { id: 'tools_workshop', label: 'Tools & Workshop' },
  { id: 'custom', label: 'Custom 3D Fit' },
  { id: 'deals', label: "Today's Deals" },
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
  const [selectedDept, setSelectedDept] = useState<RoomId>('all');
  const [zipCode, setZipCode] = useState('Seattle 98101');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [tempZip, setTempZip] = useState('98101');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDept === 'custom') {
      onNavigate('customizer');
      return;
    }
    if (selectedDept !== 'all') {
      onSelectRoom(selectedDept);
    }
    onNavigate('home');
    setTimeout(() => {
      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleSaveZip = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempZip.trim()) {
      const trimmed = tempZip.trim();
      const formatted = trimmed.toLowerCase().startsWith('seattle')
        ? trimmed
        : `Seattle ${trimmed}`;
      setZipCode(formatted);
      setShowLocationModal(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full font-sans select-none shadow-md">
        {/* ============================================================ */}
        {/* ROW 1: PRIMARY AMAZON TOP BAR (#131921)                     */}
        {/* ============================================================ */}
        <div className="bg-[#131921] text-white">
          <div className="max-w-[1520px] mx-auto px-2 sm:px-4 h-[60px] flex items-center gap-2 sm:gap-4">
            {/* 1. Wavezly Brand Logo */}
            <button
              type="button"
              onClick={() => {
                onSelectRoom('all');
                onNavigate('home');
              }}
              className="flex items-center px-2 py-1 rounded-sm hover:outline-1 hover:outline-white transition flex-shrink-0 text-left"
              aria-label="Wavezly Home"
            >
              <WavezlyLogo theme="dark" size="md" />
            </button>

            {/* 2. Deliver to Location Pill */}
            <button
              type="button"
              onClick={() => setShowLocationModal(true)}
              className="hidden lg:flex items-center gap-1.5 px-2 py-1.5 rounded-sm hover:outline-1 hover:outline-white text-left transition text-xs flex-shrink-0"
              title="Change Delivery ZIP Code"
            >
              <MapPin className="w-4 h-4 text-white flex-shrink-0 mt-2" />
              <div className="leading-tight">
                <span className="text-zinc-400 block text-[11px]">Deliver to</span>
                <span className="text-white font-bold text-xs truncate max-w-[120px] block">
                  {zipCode}
                </span>
              </div>
            </button>

            {/* 3. Search Bar with Department Selector */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 flex h-10 rounded-md overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-[#f3a847]"
              role="search"
            >
              {/* Department Dropdown */}
              <div className="relative hidden sm:flex items-center bg-[#e6e6e6] hover:bg-[#d4d4d4] text-zinc-800 text-xs font-normal border-r border-zinc-300 transition">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value as RoomId)}
                  className="appearance-none bg-transparent h-full pl-3 pr-7 cursor-pointer focus:outline-none text-zinc-800 font-medium text-xs max-w-[170px] truncate"
                  aria-label="Select department"
                >
                  {SEARCH_DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.id} className="text-zinc-900 bg-white">
                      {d.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-600 absolute right-2 pointer-events-none" />
              </div>

              {/* Main Search Input */}
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search Wavezly for trending 3D prints, custom fit organizers, car accessories…"
                className="flex-1 min-w-0 px-3 bg-white text-zinc-900 text-sm placeholder-zinc-500 focus:outline-none"
              />

              {/* Amber Search Button */}
              <button
                type="submit"
                className="w-11 sm:w-12 bg-[#febd69] hover:bg-[#f3a847] text-[#111] flex items-center justify-center transition cursor-pointer flex-shrink-0"
                aria-label="Search submit"
              >
                <Search className="w-5 h-5 stroke-[2.2]" />
              </button>
            </form>

            {/* 4. Language / Region Selector */}
            <div className="hidden xl:flex items-center gap-1 px-2 py-1.5 rounded-sm hover:outline-1 hover:outline-white cursor-pointer text-xs font-bold">
              <span className="text-sm">🇺🇸</span>
              <span>EN</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </div>

            {/* 5. Account & Lists */}
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hidden md:flex flex-col px-2 py-1.5 rounded-sm hover:outline-1 hover:outline-white text-left text-xs leading-tight"
            >
              <span className="text-zinc-300 text-[11px]">Hello, sign in</span>
              <span className="text-white font-bold text-xs flex items-center gap-0.5">
                Account & Lists <ChevronDown className="w-3 h-3 text-zinc-400" />
              </span>
            </button>

            {/* 6. Returns & Orders (Links to Tracking) */}
            <button
              type="button"
              onClick={() => onNavigate('tracking')}
              className={`flex flex-col px-2 py-1.5 rounded-sm hover:outline-1 hover:outline-white text-left text-xs leading-tight transition ${
                currentRoute === 'tracking' ? 'outline-1 outline-white text-amber-400' : ''
              }`}
              title="Track Packages and Recent Orders"
            >
              <span className="text-zinc-300 text-[11px]">Returns</span>
              <span className="text-white font-bold text-xs flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-[#febd69]" />
                <span>& Orders</span>
              </span>
            </button>

            {/* 7. Amazon Shopping Cart */}
            <button
              type="button"
              onClick={openCart}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-sm hover:outline-1 hover:outline-white text-white font-bold text-sm relative"
              aria-label={`Cart, ${itemCount} items`}
            >
              <div className="relative">
                <ShoppingCart className="w-8 h-8 text-white" />
                <span className="absolute -top-1 left-3.5 min-w-[20px] text-center font-extrabold text-[#f08804] text-sm">
                  {itemCount}
                </span>
              </div>
              <span className="hidden sm:inline text-xs font-bold text-white self-end mb-0.5">
                Cart
              </span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ROW 2: AMAZON SECONDARY SUB-NAV BAR (#232f3e)              */}
        {/* ============================================================ */}
        <div className="bg-[#232f3e] text-white text-xs sm:text-sm border-t border-zinc-700/50">
          <div className="max-w-[1520px] mx-auto px-2 sm:px-4 h-[39px] flex items-center justify-between overflow-x-auto no-scrollbar">
            <div className="flex items-center space-x-1 sm:space-x-1.5 whitespace-nowrap">
              {/* "☰ All" Hamburger Button */}
              <button
                type="button"
                onClick={() => setIsNavDrawerOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-sm hover:outline-1 hover:outline-white font-bold text-white transition mr-1"
                aria-label="Open All Navigation Menu"
              >
                <Menu className="w-4 h-4 stroke-[2.5]" />
                <span>All</span>
              </button>

              {/* Today's Deals */}
              <button
                type="button"
                onClick={() => {
                  onSelectRoom('deals');
                  onNavigate('home');
                  setTimeout(() => {
                    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                }}
                className={`px-2 py-1 rounded-sm hover:outline-1 hover:outline-white transition flex items-center gap-1 font-semibold ${
                  activeRoom === 'deals' ? 'text-[#ff9900] underline font-bold' : 'text-zinc-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#febd69]" />
                <span>Today's Deals</span>
              </button>

              {/* Trending 3D Prints */}
              <button
                type="button"
                onClick={() => {
                  onSelectRoom('trending_3d');
                  onNavigate('home');
                  setTimeout(() => {
                    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                }}
                className={`px-2 py-1 rounded-sm hover:outline-1 hover:outline-white transition font-medium ${
                  activeRoom === 'trending_3d' ? 'text-[#febd69] underline font-bold' : 'text-zinc-200'
                }`}
              >
                Trending 3D Prints
              </button>

              {/* Kitchen & Dining */}
              <button
                type="button"
                onClick={() => {
                  onSelectRoom('kitchen');
                  onNavigate('home');
                  setTimeout(() => {
                    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                }}
                className={`px-2 py-1 rounded-sm hover:outline-1 hover:outline-white transition font-medium ${
                  activeRoom === 'kitchen' ? 'text-[#febd69] underline font-bold' : 'text-zinc-200'
                }`}
              >
                Kitchen & Dining
              </button>

              {/* Gaming & Tech */}
              <button
                type="button"
                onClick={() => {
                  onSelectRoom('electronics');
                  onNavigate('home');
                  setTimeout(() => {
                    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                }}
                className={`px-2 py-1 rounded-sm hover:outline-1 hover:outline-white transition font-medium ${
                  activeRoom === 'electronics' ? 'text-[#febd69] underline font-bold' : 'text-zinc-200'
                }`}
              >
                Gaming & Tech
              </button>

              {/* Car Accessories */}
              <button
                type="button"
                onClick={() => {
                  onSelectRoom('car_auto');
                  onNavigate('home');
                  setTimeout(() => {
                    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                }}
                className={`px-2 py-1 rounded-sm hover:outline-1 hover:outline-white transition font-medium ${
                  activeRoom === 'car_auto' ? 'text-[#febd69] underline font-bold' : 'text-zinc-200'
                }`}
              >
                Car Accessories
              </button>

              {/* Home Décor */}
              <button
                type="button"
                onClick={() => {
                  onSelectRoom('home_decor');
                  onNavigate('home');
                  setTimeout(() => {
                    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                }}
                className={`px-2 py-1 rounded-sm hover:outline-1 hover:outline-white transition font-medium ${
                  activeRoom === 'home_decor' ? 'text-[#febd69] underline font-bold' : 'text-zinc-200'
                }`}
              >
                Home Décor
              </button>

              {/* Custom 3D Studio */}
              <button
                type="button"
                onClick={() => onNavigate('customizer')}
                className={`px-2 py-1 rounded-sm hover:outline-1 hover:outline-white transition font-semibold text-[#febd69] flex items-center gap-1 ${
                  currentRoute === 'customizer' ? 'underline font-bold' : ''
                }`}
              >
                <span>Custom 3D Studio</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-[#ff9900] text-black font-extrabold uppercase">
                  3D FIT
                </span>
              </button>

              {/* Registry */}
              <button
                type="button"
                onClick={() => {
                  onSelectRoom('all');
                  onNavigate('home');
                  setTimeout(() => {
                    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                }}
                className="px-2 py-1 rounded-sm hover:outline-1 hover:outline-white transition font-medium text-zinc-200"
              >
                Registry
              </button>

              {/* Customer Service */}
              <button
                type="button"
                onClick={() => onNavigate('tracking')}
                className={`px-2 py-1 rounded-sm hover:outline-1 hover:outline-white transition font-medium text-zinc-200 ${
                  currentRoute === 'tracking' ? 'text-[#febd69] underline font-bold' : ''
                }`}
              >
                Customer Service
              </button>
            </div>

            {/* Right Side Wavezly Prime Tag */}
            <div className="hidden xl:flex items-center gap-1.5 text-xs whitespace-nowrap pl-4">
              <span className="font-black text-white tracking-tight">
                Wave<span className="text-[#ff9900]">zly</span>{' '}
                <span className="text-[#00a8e1] font-bold">Prime</span>
              </span>
              <span className="text-zinc-300 font-normal">: Fast, Free Delivery</span>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* LOCATION SELECTOR MODAL                                      */}
      {/* ============================================================ */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 font-sans">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h3 className="font-bold text-base text-zinc-900">Choose your location</h3>
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Delivery options and speeds may vary for different locations. Enter your US ZIP code below:
            </p>
            <form onSubmit={handleSaveZip} className="flex gap-2">
              <input
                type="text"
                value={tempZip}
                onChange={(e) => setTempZip(e.target.value)}
                placeholder="Enter a 5-digit ZIP"
                maxLength={12}
                className="flex-1 h-10 px-3 border border-zinc-300 rounded text-sm text-zinc-900 focus:outline-none focus:border-[#f3a847] focus:ring-1 focus:ring-[#f3a847]"
                autoFocus
              />
              <button
                type="submit"
                className="h-10 px-4 bg-[#ffd814] hover:bg-[#f7ca00] text-zinc-900 rounded font-semibold text-sm transition"
              >
                Apply
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SLIDE-OUT ALL NAVIGATION DRAWER                              */}
      {/* ============================================================ */}
      <AmazonNavDrawer
        isOpen={isNavDrawerOpen}
        onClose={() => setIsNavDrawerOpen(false)}
        onSelectDepartment={(room) => {
          onSelectRoom(room);
          onNavigate('home');
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
