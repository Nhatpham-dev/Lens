import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import { shop } from "@/config/shop";
import { getCategories, getProducts, getTags, type Product } from "@/data/products";

export const metadata: Metadata = {
  title: "Cửa hàng",
  description: `Khăn len, gấu bông len, khăn tay, móc khóa đan tay — nhận thêu tên theo yêu cầu tại ${shop.name}.`,
};

type SP = Awaited<PageProps<"/san-pham">["searchParams"]>;
const SORTS = [
  { value: "", label: "Nổi bật" },
  { value: "ban-chay", label: "Bán chạy" },
  { value: "gia-tang", label: "Giá tăng dần" },
  { value: "gia-giam", label: "Giá giảm dần" },
];

export default function ProductsPage({ searchParams }: PageProps<"/san-pham">) {
  return (
    <div className="container-page pb-20 pt-10 md:pt-12">
      {/* searchParams là dữ liệu theo từng lượt truy cập → đặt trong Suspense (Cache Components) */}
      <Suspense fallback={<Listing sp={{}} />}>
        <FilteredListing searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function FilteredListing({ searchParams }: { searchParams: PageProps<"/san-pham">["searchParams"] }) {
  return <Listing sp={await searchParams} />;
}

function one(v: string | string[] | undefined) {
  return typeof v === "string" ? v : undefined;
}

function Listing({ sp }: { sp: SP }) {
  const category = one(sp["danh-muc"]);
  const tag = one(sp["the"]);
  const sale = one(sp["sale"]) === "1";
  const sort = one(sp["sap-xep"]) ?? "";

  const categories = getCategories();
  const tags = getTags();
  const currentCat = categories.find((c) => c.slug === category);
  const currentTag = tags.find((t) => t.slug === tag);

  let products: Product[] = getProducts({ category: currentCat?.slug, tag: currentTag?.slug, sale });
  if (sort === "ban-chay") products = [...products].sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0));
  if (sort === "gia-tang") products = [...products].sort((a, b) => a.price - b.price);
  if (sort === "gia-giam") products = [...products].sort((a, b) => b.price - a.price);
  // hết hàng xuống cuối
  products = [...products].sort((a, b) => Number(a.stock <= 0) - Number(b.stock <= 0));

  const title = sale
    ? "Đang giảm giá"
    : [currentTag && `Quà ${currentTag.name}`, currentCat?.name].filter(Boolean).join(" · ") || "Tất cả sản phẩm";

  // giữ các bộ lọc khác khi đổi một bộ lọc
  const href = (patch: Record<string, string | undefined>) => {
    const q = new URLSearchParams();
    const merged = {
      "danh-muc": currentCat?.slug,
      the: currentTag?.slug,
      sale: sale ? "1" : undefined,
      "sap-xep": sort || undefined,
      ...patch,
    };
    for (const [k, v] of Object.entries(merged)) if (v) q.set(k, v);
    const s = q.toString();
    return s ? `/san-pham?${s}` : "/san-pham";
  };

  return (
    <>
      <nav className="text-sm text-muted" aria-label="Đường dẫn">
        <Link href="/" className="hover:text-primary">Trang chủ</Link> / <span>Cửa hàng</span>
      </nav>
      <h1 className="mt-3 text-[30px] font-bold md:text-[36px]">{title}</h1>
      <p className="mt-1 text-muted">{products.length} sản phẩm · Tất cả đều nhận thêu tên miễn phí</p>

      <div className="mt-6 flex flex-col gap-4 border-b border-border pb-6">
        <nav
          className="-mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0"
          aria-label="Lọc theo danh mục"
        >
          <Chip href={href({ "danh-muc": undefined })} active={!currentCat}>Tất cả</Chip>
          {categories.map((c) => (
            <Chip key={c.slug} href={href({ "danh-muc": c.slug })} active={currentCat?.slug === c.slug}>
              {c.name} <span className="ml-1 font-normal opacity-70">({c.count})</span>
            </Chip>
          ))}
        </nav>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav className="flex flex-wrap items-center gap-2" aria-label="Lọc theo dịp">
            <span className="mr-1 text-sm text-muted">Quà theo dịp:</span>
            {tags.map((t) => (
              <Chip key={t.slug} small href={href({ the: currentTag?.slug === t.slug ? undefined : t.slug })} active={currentTag?.slug === t.slug}>
                {t.name}
              </Chip>
            ))}
            <Chip small href={href({ sale: sale ? undefined : "1" })} active={sale}>Đang giảm giá</Chip>
          </nav>
          <nav className="flex flex-wrap items-center gap-1 text-sm" aria-label="Sắp xếp">
            <span className="mr-1 text-muted">Sắp xếp:</span>
            {SORTS.map((s) => (
              <Link
                key={s.value}
                href={href({ "sap-xep": s.value || undefined })}
                aria-current={sort === s.value ? "true" : undefined}
                className={`rounded-btn px-2.5 py-2 ${sort === s.value ? "font-bold text-primary" : "text-muted hover:text-ink"}`}
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg">Chưa có sản phẩm phù hợp.</p>
          <Link href="/san-pham" className="btn-outline mt-6">Xem tất cả sản phẩm</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {products.map((p, k) => (
            <ProductCard key={p.id} product={p} index={k} />
          ))}
        </div>
      )}
    </>
  );
}

function Chip({ href, active, small, children }: { href: string; active: boolean; small?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex shrink-0 snap-start items-center whitespace-nowrap rounded-full border px-4 font-bold transition ${
        small ? "min-h-9 text-[13px]" : "min-h-11 text-sm"
      } ${active ? "border-primary bg-primary text-white" : "border-border bg-white hover:border-primary"}`}
    >
      {children}
    </Link>
  );
}
