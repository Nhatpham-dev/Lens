"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CustomDesign } from "@/config/shop";

export type CartItem = {
  key: string; // id sản phẩm + size + thiết kế riêng — mỗi lựa chọn là một dòng riêng trong giỏ
  id: string; // id sản phẩm
  variant?: string; // size đã chọn (nếu có)
  custom?: CustomDesign; // đặt làm riêng: màu len, chữ thêu, kiểu chữ
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  stock: number;
};

type CartState = {
  items: CartItem[];
  coupon: string | null; // mã giảm giá khách đã nhập (vd. LENS15)
  add: (item: Omit<CartItem, "qty" | "key">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  setCoupon: (code: string | null) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      coupon: null,
      add: (item, qty = 1) =>
        set((s) => {
          const key = lineKey(item.id, item.variant, item.custom);
          const existing = s.items.find((i) => i.key === key);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.key === key ? { ...i, ...item, key, qty: Math.min(i.qty + qty, item.stock) } : i
              ),
            };
          }
          return { items: [...s.items, { ...item, key, qty: Math.min(qty, item.stock) }] };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          items: s.items.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i)),
        })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      setCoupon: (coupon) => set({ coupon }),
      clear: () => set({ items: [], coupon: null }),
    }),
    {
      name: "cart",
      version: 1,
      // giỏ hàng lưu từ bản cũ (chưa có key) → tự thêm key, khách không mất hàng trong giỏ
      migrate: (state) => {
        const s = state as { items?: CartItem[]; coupon?: string | null };
        return {
          items: (s.items ?? []).map((i) => ({ ...i, key: i.key ?? lineKey(i.id, i.variant, i.custom) })),
          coupon: s.coupon ?? null,
        } as CartState;
      },
    }
  )
);

export function lineKey(id: string, variant?: string, custom?: CustomDesign) {
  let k = variant ? `${id}::${variant}` : id;
  if (custom) k += `::rieng:${custom.color}|${custom.text}|${custom.font}`;
  return k;
}

/** true sau khi giỏ hàng đã đọc xong từ trình duyệt — tránh lỗi hydration. */
export function useCartHydrated() {
  return useSyncExternalStore(
    (cb) => useCart.persist.onFinishHydration(cb),
    () => useCart.persist.hasHydrated(),
    () => false
  );
}

export function cartCount(items: CartItem[]) {
  return items.reduce((s, i) => s + i.qty, 0);
}

// Thông báo nhỏ "Đã thêm vào giỏ"
type ToastState = {
  message: string | null;
  cartLink: boolean;
  show: (m: string, cartLink?: boolean) => void;
  hide: () => void;
};
let toastTimer: ReturnType<typeof setTimeout> | undefined;
export const useToast = create<ToastState>((set) => ({
  message: null,
  cartLink: true,
  show: (message, cartLink = true) => {
    clearTimeout(toastTimer);
    set({ message, cartLink });
    toastTimer = setTimeout(() => set({ message: null }), cartLink ? 2500 : 5000);
  },
  hide: () => set({ message: null }),
}));
