"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct } from "./products";

export type CartLine = { slug: string; size: string; qty: number };

type CartState = {
  lines: CartLine[];
  wishlist: string[];
  add: (slug: string, size: string, qty?: number) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  remove: (slug: string, size: string) => void;
  clear: () => void;
  toggleWish: (slug: string) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      wishlist: [],
      add: (slug, size, qty = 1) =>
        set((s) => {
          const hit = s.lines.find((l) => l.slug === slug && l.size === size);
          if (hit) {
            return {
              lines: s.lines.map((l) => (l === hit ? { ...l, qty: l.qty + qty } : l)),
            };
          }
          return { lines: [...s.lines, { slug, size, qty }] };
        }),
      setQty: (slug, size, qty) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (l.slug === slug && l.size === size ? { ...l, qty } : l))
            .filter((l) => l.qty > 0),
        })),
      remove: (slug, size) =>
        set((s) => ({ lines: s.lines.filter((l) => !(l.slug === slug && l.size === size)) })),
      clear: () => set({ lines: [] }),
      toggleWish: (slug) =>
        set((s) => ({
          wishlist: s.wishlist.includes(slug)
            ? s.wishlist.filter((w) => w !== slug)
            : [...s.wishlist, slug],
        })),
    }),
    { name: "sachika-cart", skipHydration: true },
  ),
);

/*
  False until the bag/wishlist has been read back from localStorage. Pages that
  depend on it show a skeleton until then, instead of flashing "empty".
*/
export function useCartHydrated() {
  return useSyncExternalStore(
    (onChange) => useCart.persist.onFinishHydration(onChange),
    () => useCart.persist.hasHydrated(),
    () => false,
  );
}

export function lineDetail(l: CartLine) {
  const product = getProduct(l.slug);
  const size = product?.sizes.find((s) => s.label === l.size) ?? product?.sizes[0];
  return { product, size, total: (size?.price ?? 0) * l.qty };
}

export const FREE_SHIPPING_AT = 799;
export const SHIPPING_FEE = 79;

export function cartTotals(lines: CartLine[], discount = 0) {
  const subtotal = lines.reduce((sum, l) => sum + lineDetail(l).total, 0);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE;
  return { subtotal, count, shipping, discount, total: Math.max(0, subtotal + shipping - discount) };
}

type UIState = {
  loaded: boolean;
  menuOpen: boolean;
  cartOpen: boolean;
  searchOpen: boolean;
  toast: { id: number; text: string } | null;
  setLoaded: () => void;
  setMenu: (v: boolean) => void;
  setCart: (v: boolean) => void;
  setSearch: (v: boolean) => void;
  showToast: (text: string) => void;
};

export const useUI = create<UIState>()((set) => ({
  loaded: false,
  menuOpen: false,
  cartOpen: false,
  searchOpen: false,
  toast: null,
  setLoaded: () => set({ loaded: true }),
  setMenu: (menuOpen) => set({ menuOpen, cartOpen: false, searchOpen: false }),
  setCart: (cartOpen) => set({ cartOpen, menuOpen: false, searchOpen: false }),
  setSearch: (searchOpen) => set({ searchOpen, menuOpen: false, cartOpen: false }),
  showToast: (text) => set({ toast: { id: performance.now(), text } }),
}));
