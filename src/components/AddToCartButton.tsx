"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart, useToast } from "@/store/cart";

/** Nút "Thêm vào giỏ" trên card — thêm mẫu có sẵn, số lượng 1. Đặt làm riêng chọn ở trang chi tiết. */
export default function AddToCartButton({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const showToast = useToast((s) => s.show);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const soldOut = product.stock <= 0;

  function handleClick() {
    add({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
      stock: product.stock,
    });
    showToast(`Đã thêm “${product.name}” vào giỏ`);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={soldOut}
      className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-btn bg-primary px-3 text-[14px] font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-border disabled:text-muted md:min-h-9 md:text-[15px]"
    >
      {soldOut ? (
        "Hết hàng"
      ) : added ? (
        <>
          <Check className="size-4" aria-hidden /> Đã thêm
        </>
      ) : (
        "Thêm vào giỏ"
      )}
    </button>
  );
}
