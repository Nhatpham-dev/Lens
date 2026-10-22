"use client";

import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts } from "@/data/products";

/** Tìm ngay trên trình duyệt, không phân biệt dấu ("khan len" vẫn ra "Khăn len"). */
export default function SearchView() {
  const [q, setQ] = useState("");
  const results = q.trim().length >= 2 ? getProducts({ q }) : [];

  return (
    <>
      <div className="relative mt-6 max-w-[600px]">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden />
        <label htmlFor="q" className="sr-only">Tìm sản phẩm</label>
        <input
          id="q"
          type="search"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm khăn len, gấu bông, móc khóa…"
          className="field pl-12"
        />
      </div>

      {q.trim().length < 2 ? (
        <div className="mt-8">
          <p className="text-[15px] font-bold">Danh mục</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {getCategories().map((c) => (
              <Link
                key={c.slug}
                href={`/san-pham?danh-muc=${c.slug}`}
                className="inline-flex min-h-10 items-center rounded-full border border-border px-4 text-sm font-bold hover:border-primary"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <p className="mt-10 text-muted">Không tìm thấy sản phẩm cho “{q}”. Thử từ khoá khác nhé.</p>
      ) : (
        <>
          <p className="mt-6 text-muted" role="status">{results.length} kết quả</p>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {results.map((p, k) => (
              <ProductCard key={p.id} product={p} index={k} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
