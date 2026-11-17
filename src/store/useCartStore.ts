"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types/database";

const DEFAULT_CART_ITEMS: CartItem[] = [
  {
    id: "prod-1-iPhone 16 Pro-Grip Mate-#FDE047",
    productId: "prod-1",
    sku: "PKT-FLR-01-YLW",
    title: "Retro Floral Groove",
    priceUsd: 28.0,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAKw8HxrKNbiBpGtFo9kgFjNPZdfP39dX7w2MhhglmwvR_OM8CIx4QlqAeBeamucuHIXeR8dR0oLg1gpc14UdmZuGLms5wjKRPUNQDxjqKfzpjJSTvNeO1eDGQs-AnZP7KUWJVXmlJXWzLYBaxsyEOB88dBcWzMotoL8rVmRfT10SrUj2duKQyhhB-KKUK2KKYETyz3pc-OfPksGB5ldGvHqawzP11dxXhZqSOxMw",
    cardBgStyle: "secondary-fixed",
    deviceModel: "iPhone 16 Pro",
    finish: "Grip Mate",
    colorName: "Amarillo Mantequilla",
    colorHex: "#FDE047",
    quantity: 1,
  },
  {
    id: "prod-2-iPhone 15 Pro-Brillo Jelly-#FDA4AF",
    productId: "prod-2",
    sku: "PKT-STW-02-STM",
    title: "Strawberry Milkshake Wave",
    priceUsd: 32.0,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB722-BZaK9hqnDF0mlsuR5cKwMQc44Pnhu_YQOlJbesu_mmCVTMKfwKF-ZTWl7L46PR9Zfxwm-_QX8sX3tvcJ83xa-SxZKDh2qyWyZc2VNUV5FedLyBpebNLAXk_dDKENdwvOWyU5sPewoqq5qIq5vaUinBj4HMQmjAQbC20YmH86PNeB2rGzlzHYmo2XbSBHLm0eHgTX8RSjFH8_C-VxrGMmxmBrZ6Kj36Eiavg",
    cardBgStyle: "primary-fixed",
    deviceModel: "iPhone 15 Pro",
    finish: "Brillo Jelly",
    colorName: "Leche de Fresa",
    colorHex: "#FDA4AF",
    quantity: 1,
  },
];

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
      items: DEFAULT_CART_ITEMS,
      isOpen: true, // Matches reference HTML where CartDrawer is open initially (`translate-x-0`)
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
      name: "pocket-cases-cart-v1",
      partialize: (state) => ({
        items: state.items,
        currencyMode: state.currencyMode,
        wishlistIds: state.wishlistIds,
      }),
    }
  )
);
