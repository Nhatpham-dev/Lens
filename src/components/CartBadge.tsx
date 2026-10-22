"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { cartCount, useCart, useCartHydrated } from "@/store/cart";

/** "Giỏ hàng (2)" trên desktop như thiết kế; icon túi có số trên mobile. Số nảy lên mỗi khi thêm hàng. */
export default function CartBadge() {
  const hydrated = useCartHydrated();
  const count = useCart((s) => cartCount(s.items));
  const n = hydrated ? count : 0;

  return (
    <Link href="/gio-hang" aria-label={`Giỏ hàng, ${n} sản phẩm`} className="relative inline-flex items-center hover:text-primary">
      <span className="hidden lg:inline">
        Giỏ hàng (<span key={n} className="inline-block animate-pop tabular-nums">{n}</span>)
      </span>
      <span className="-mr-2 inline-flex size-11 items-center justify-center lg:hidden">
        <ShoppingBag className="size-5" aria-hidden />
        {n > 0 && (
          <span
            key={n}
            className="absolute right-0 top-1 flex size-[18px] animate-pop items-center justify-center rounded-full bg-brown text-[11px] font-bold text-white"
          >
            {n}
          </span>
        )}
      </span>
    </Link>
  );
}
