import { shop } from "@/config/shop";

const vnd = new Intl.NumberFormat("vi-VN");

/** 199000 → "199.000₫" (ký hiệu lấy từ shop.priceSuffix, theo thiết kế). */
export function formatVND(n: number) {
  return `${vnd.format(n)}${shop.priceSuffix ?? "₫"}`;
}

export function discountPercent(price: number, compareAt: number | null) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round((1 - price / compareAt) * 100);
}
