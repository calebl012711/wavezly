/**
 * SNUGFIT HEADER
 * Simple storefront header: logo, search, order tracking, cart, and room navigation.
 */

import React from 'react';
import { Search, ShoppingCart, Package } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { ROOMS, RoomId } from '../../lib/storefront';

interface HeaderProps {
  currentRoute: 'home' | 'customizer' | 'tracking';
  onNavigate: (route: 'home' | 'customizer' | 'tracking') => void;
  onOpenDeskPlanner?: () => void;
  searchQuery: string;
  onSearch: (q: string) => void;
  activeRoom: RoomId;
  onSelectRoom: (room: RoomId) => void;
}

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

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3 sm:gap-6">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 flex-shrink-0"
          aria-label="SnugFit home"
        >
          <span className="w-8 h-8 rounded-lg bg-orange-500 text-white font-bold flex items-center justify-center">
            S
          </span>
          <span className="hidden sm:block text-xl font-bold tracking-tight text-zinc-900">
            SnugFit
          </span>
        </button>

        <form
          className="flex-1 flex max-w-2xl"
          onSubmit={(e) => {
            e.preventDefault();
            onNavigate('home');
            setTimeout(
              () => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }),
              50
            );
          }}
          role="search"
        >
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search organizers, trays, stands…"
            className="flex-1 min-w-0 h-10 px-4 bg-white rounded-l-lg border border-r-0 border-zinc-300 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
          <button
            type="submit"
            className="h-10 px-4 rounded-r-lg bg-orange-500 hover:bg-orange-600 text-white transition"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('tracking')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-zinc-100 transition ${
              currentRoute === 'tracking' ? 'text-orange-600' : 'text-zinc-700'
            }`}
          >
            <Package className="w-4 h-4" />
            Track order
          </button>
          <button
            type="button"
            onClick={openCart}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-zinc-800 hover:bg-zinc-100 transition"
            aria-label={`Cart, ${itemCount} items`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 sm:static min-w-[20px] h-5 px-1 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Room navigation */}
      <nav className="bg-zinc-900 text-sm" aria-label="Shop by room">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {ROOMS.map((room) => {
            const active = currentRoute === 'home' && activeRoom === room.id;
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => {
                  onSelectRoom(room.id);
                  onNavigate('home');
                  setTimeout(
                    () =>
                      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }),
                    50
                  );
                }}
                className={`whitespace-nowrap px-3.5 py-2.5 font-medium transition border-b-2 ${
                  active
                    ? 'text-white border-orange-500'
                    : 'text-zinc-300 border-transparent hover:text-white'
                }`}
              >
                {room.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
