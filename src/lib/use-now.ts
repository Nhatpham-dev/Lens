"use client";

import { useSyncExternalStore } from "react";

// Giờ hiện tại cho component (hạn khuyến mãi…). Không gọi Date.now() trực tiếp lúc render vì:
// - Next.js (Cache Components) báo lỗi build khi gặp Date.now() lúc dựng trang tĩnh;
// - ESLint react-hooks/purity báo lỗi "impure function during render".
// Lúc dựng trang tĩnh trả về 0; trên trình duyệt cập nhật mỗi 30 giây.
let now = 0;

function subscribe(onChange: () => void) {
  const tick = () => {
    now = Date.now();
    onChange();
  };
  tick();
  const id = setInterval(tick, 30_000);
  return () => clearInterval(id);
}

export function useNow() {
  return useSyncExternalStore(
    subscribe,
    () => now,
    () => 0
  );
}
