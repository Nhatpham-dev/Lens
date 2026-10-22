"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  ids: string[];
  toggle: (id: string) => boolean; // trả về true nếu vừa thêm
  remove: (id: string) => void;
};

/** Danh sách yêu thích — lưu trên trình duyệt, không cần tài khoản. */
export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const has = get().ids.includes(id);
        set({ ids: has ? get().ids.filter((x) => x !== id) : [...get().ids, id] });
        return !has;
      },
      remove: (id) => set({ ids: get().ids.filter((x) => x !== id) }),
    }),
    { name: "wishlist" }
  )
);

export function useWishlistHydrated() {
  return useSyncExternalStore(
    (cb) => useWishlist.persist.onFinishHydration(cb),
    () => useWishlist.persist.hasHydrated(),
    () => false
  );
}
