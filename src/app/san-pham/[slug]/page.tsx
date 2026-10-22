import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import PriceTag from "@/components/PriceTag";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { shop } from "@/config/shop";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/data/products";
import { discountPercent, formatVND } from "@/lib/format";

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/san-pham/[slug]">): Promise<Metadata> {
  const p = getProductBySlug((await params).slug);
  if (!p) return { title: "Không tìm thấy sản phẩm" };
  return {
    title: p.name,
    description: p.description || `${p.name} đan tay tại ${shop.name}, giá ${formatVND(p.price)}.`,
    openGraph: { images: p.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: PageProps<"/san-pham/[slug]">) {
  const product = getProductBySlug((await params).slug);
  if (!product) notFound();
  const off = discountPercent(product.price, product.compareAtPrice);
  const related = getRelatedProducts(product, 4);

  return (
    <div className="container-page pb-20 pt-8 md:pt-10">
      <nav className="text-sm text-muted" aria-label="Đường dẫn">
        <Link href="/" className="hover:text-primary">Trang chủ</Link> /{" "}
        <Link href="/san-pham" className="hover:text-primary">Cửa hàng</Link> /{" "}
        <Link href={`/san-pham?danh-muc=${product.categorySlug}`} className="hover:text-primary">{product.category}</Link>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-2 lg:gap-14">
        <ProductGallery images={product.images} name={product.name} soldOut={product.stock <= 0} />

        <div>
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-2 text-[28px] font-bold leading-tight md:text-[34px]">{product.name}</h1>
          {(product.rating !== null || product.sold !== null) && (
            <p className="mt-2 text-sm text-muted">
              {product.rating !== null && <>★ {product.rating.toFixed(1)}</>}
              {product.rating !== null && product.sold !== null && " · "}
              {product.sold !== null && <>Đã bán {product.sold}</>}
            </p>
          )}
          <div className="mt-4 flex items-center gap-3">
            <PriceTag price={product.price} compareAt={product.compareAtPrice} size="lg" />
            {off > 0 && <span className="rounded-[3px] bg-brown px-2.5 py-1 text-[13px] font-bold text-white">-{off}%</span>}
          </div>
          {product.description && <p className="mt-5 text-[15px] leading-7 text-muted">{product.description}</p>}

          <div className="mt-7">
            <AddToCart product={product} />
          </div>

          <ul className="mt-8 space-y-2 border-t border-border pt-6 text-[14px] text-muted">
            <li>✓ Đan tay 100%, len mềm an toàn cho da nhạy cảm</li>
            <li>✓ Thêu tên miễn phí, tối đa {shop.customMaxChars} ký tự</li>
            <li>
              ✓ Phí ship {formatVND(shop.shippingFee)}
              {shop.freeShippingFrom > 0 && <> · miễn phí cho đơn từ {formatVND(shop.freeShippingFrom)}</>}
            </li>
            <li>
              ✓ Đổi trả trong 7 ngày nếu lỗi do {shop.name} —{" "}
              <Link href="/chinh-sach/doi-tra" className="text-primary hover:underline">xem chính sách</Link>
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 md:mt-20">
          <h2 className="section-title">Có thể bạn cũng thích</h2>
          <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {related.map((p, k) => (
              <ProductCard key={p.id} product={p} index={k} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
