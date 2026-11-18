"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types/database";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  currencyMode: "USD" | "VES";
  searchQuery: string;
  activeCategory: string;
  wishlistIds: string[];
  addItem: (item: Omit<CartItem, "id" | "quantity">, openDrawer?: boolean) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  toggleCurrencyMode: () => void;
  setSearchQuery: (q: string) => void;
  setActiveCategory: (category: string) => void;
  toggleWishlist: (productId: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      currencyMode: "USD",
      searchQuery: "",
      activeCategory: "all",
      wishlistIds: [],

      addItem: (newItem, shouldOpenDrawer = true) =>
        set((state) => {
          const compositeId = `${newItem.productId}-${newItem.deviceModel}-${newItem.finish}-${newItem.colorHex}`;
          const existingIndex = state.items.findIndex(
            (i) => i.id === compositeId
          );
          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + 1,
            };
            return {
              items: updated,
              isOpen: shouldOpenDrawer ? true : state.isOpen,
            };
          }
          return {
            items: [
              ...state.items,
              {
                ...newItem,
                id: compositeId,
                quantity: 1,
              },
            ],
            isOpen: shouldOpenDrawer ? true : state.isOpen,
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, delta) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id
                ? { ...item, quantity: item.quantity + delta }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      toggleCurrencyMode: () =>
        set((state) => ({
          currencyMode: state.currencyMode === "USD" ? "VES" : "USD",
        })),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setActiveCategory: (activeCategory) => set({ activeCategory }),
      toggleWishlist: (productId) =>
        set((state) => ({
          wishlistIds: state.wishlistIds.includes(productId)
            ? state.wishlistIds.filter((id) => id !== productId)
            : [...state.wishlistIds, productId],
        })),
    }),
    {
      name: "pocket-cases-cart-v2",
      partialize: (state) => ({
        items: state.items,
        currencyMode: state.currencyMode,
        wishlistIds: state.wishlistIds,
      }),
    }
  )
);
