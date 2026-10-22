/**
 * FORMGRID UNIFIED CART & SPLIT-FULFILLMENT STATE STORE
 * Bifurcates orders into Package A (3D Print Farm) and Package B (Fast-Ship Domestic Accessories)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product, CustomParametricSpecs } from '../types';

export interface CartStoreState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addCustomItem: (
    product: Product,
    customSpecs: CustomParametricSpecs,
    calculatedPrice: number,
    stlBlob?: Blob,
    stlBlobUrl?: string
  ) => void;
  addStandardItem: (product: Product, quantity?: number) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;

  // Computed Accessors
  getPackageA_3DPrints: () => CartItem[];
  getPackageB_FastShip: () => CartItem[];
  getSubtotalCents: () => number;
  getShippingCents: () => number;
  getTotalCents: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addCustomItem: (product, customSpecs, calculatedPrice, stlBlob, stlBlobUrl) => {
        const newItem: CartItem = {
          cartItemId: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          productId: product.id,
          product,
          customSpecs,
          calculatedPrice,
          stlBlob,
          stlBlobUrl,
          quantity: 1,
          createdAt: Date.now(),
        };

        set((state) => ({
          items: [newItem, ...state.items],
          isOpen: true,
        }));
      },

      addStandardItem: (product, quantity = 1) => {
        const { items } = get();
        const existingIdx = items.findIndex(
          (i) => i.productId === product.id && i.product.type === 'dropship'
        );

        if (existingIdx > -1) {
          const updated = [...items];
          updated[existingIdx].quantity += quantity;
          set({ items: updated, isOpen: true });
        } else {
          const newItem: CartItem = {
            cartItemId: `drop_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            productId: product.id,
            product,
            calculatedPrice: product.basePrice,
            quantity,
            createdAt: Date.now(),
          };
          set({ items: [newItem, ...items], isOpen: true });
        }
      },

      updateQuantity: (cartItemId, delta) => {
        const { items } = get();
        const updated = items
          .map((item) => {
            if (item.cartItemId === cartItemId) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter((item): item is CartItem => item !== null);

        set({ items: updated });
      },

      removeItem: (cartItemId) => {
        const { items } = get();
        set({ items: items.filter((i) => i.cartItemId !== cartItemId) });
      },

      clearCart: () => set({ items: [] }),

      getPackageA_3DPrints: () => {
        return get().items.filter((i) => i.product.type === 'custom_3d');
      },

      getPackageB_FastShip: () => {
        return get().items.filter((i) => i.product.type === 'dropship');
      },

      getSubtotalCents: () => {
        const { items } = get();
        return Math.round(
          items.reduce((sum, item) => sum + item.calculatedPrice * item.quantity, 0) * 100
        );
      },

      getShippingCents: () => {
        const pkgA = get().getPackageA_3DPrints();
        const pkgB = get().getPackageB_FastShip();
        // Flat standard rates: $6.00 farm shipping for custom 3D prints, Free US shipping on accessories
        let shipping = 0;
        if (pkgA.length > 0) shipping += 600; // $6.00
        if (pkgB.length > 0 && pkgA.length === 0) shipping += 450; // $4.50 domestic priority
        return shipping;
      },

      getTotalCents: () => {
        return get().getSubtotalCents() + get().getShippingCents();
      },

      getItemCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    {
      name: 'formgrid-unified-cart-v3',
      storage: createJSONStorage(() => localStorage),
      // Exclude raw non-serializable blobs from localStorage persistence
      partialize: (state) => ({
        items: state.items.map(({ stlBlob, ...rest }) => rest),
      }),
    }
  )
);
