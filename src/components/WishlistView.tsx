"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProductById, type Product } from "@/data/products";
import { useWishlist, useWishlistHydrated } from "@/store/wishlist";

export default function WishlistView() {
  const hydrated = useWishlistHydrated();
  const ids = useWishlist((s) => s.ids);

  if (!hydrated) return <div className="mt-8 h-48 animate-pulse rounded-card bg-cream" aria-label="Đang tải" />;

  const products = ids.map(getProductById).filter((p): p is Product => Boolean(p));

  if (products.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center gap-3 rounded-card bg-cream px-6 py-16 text-center">
        <p className="text-xl font-bold">Chưa có sản phẩm yêu thích</p>
        <p className="text-muted">Bấm biểu tượng trái tim ở trang sản phẩm để lưu lại món bạn thích.</p>
        <Link href="/san-pham" className="btn-primary mt-4">Xem sản phẩm</Link>
      </div>
    );
  }

  return (
    <>
      <p className="mt-2 text-muted">{products.length} sản phẩm · lưu trên trình duyệt này</p>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {products.map((p, k) => (
          <ProductCard key={p.id} product={p} index={k} />
        ))}
      </div>
    </>
  );
}
