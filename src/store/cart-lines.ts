"use client";

import { getProductById } from "@/data/products";
import { computeTotals } from "@/lib/order";
import { useNow } from "@/lib/use-now";
import { useCart, type CartItem } from "./cart";

/** ok | soldout (tồn kho 0) | removed (đã xoá khỏi Excel) | size-removed (size không còn bán) */
export type LineStatus = "ok" | "soldout" | "removed" | "size-removed";
export type CartLine = CartItem & { status: LineStatus; available: boolean; removed: boolean };

export const STATUS_TEXT: Record<Exclude<LineStatus, "ok">, string> = {
  soldout: "Sản phẩm này tạm hết hàng",
  removed: "Sản phẩm này không còn bán",
  "size-removed": "Size này không còn bán",
};

/**
 * Giỏ hàng đã đối chiếu với dữ liệu sản phẩm hiện tại:
 * giá, ảnh, tồn kho, size luôn lấy theo products.json mới nhất (phòng khi chủ shop sửa Excel).
 */
export function useCartLines() {
  const items = useCart((s) => s.items);
  const coupon = useCart((s) => s.coupon);
  const now = useNow(); // 0 lúc dựng trang tĩnh — xem lib/use-now.ts
  const lines: CartLine[] = items.map((item) => {
    const p = getProductById(item.id);
    if (!p) return { ...item, status: "removed", available: false, removed: true };
    const sizeGone = Boolean(item.variant) && !p.sizes.includes(item.variant!);
    const status: LineStatus = sizeGone ? "size-removed" : p.stock > 0 ? "ok" : "soldout";
    return {
      ...item,
      name: p.name,
      price: p.price,
      image: p.images[0],
      slug: p.slug,
      stock: p.stock,
      qty: Math.min(item.qty, Math.max(p.stock, 0)),
      status,
      available: status === "ok",
      removed: false,
    };
  });
  const valid = lines.filter((l) => l.available && l.qty > 0);
  return { lines, valid, coupon, ...computeTotals(valid, now, coupon) };
}
