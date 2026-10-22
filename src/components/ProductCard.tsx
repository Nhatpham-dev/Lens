import Image from "next/image";
import Link from "next/link";
import { isPlaceholderImage, type Product } from "@/data/products";
import { discountPercent } from "@/lib/format";
import AddToCartButton from "./AddToCartButton";
import PriceTag from "./PriceTag";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const off = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.stock <= 0;
  const img = product.images[0];
  const placeholder = isPlaceholderImage(img);

  return (
    <article className="group flex flex-col rounded-card border border-border bg-white p-2.5 md:p-[11px]">
      <Link
        href={`/san-pham/${product.slug}`}
        className={`relative block aspect-square overflow-hidden rounded-[3px] ${index % 2 ? "bg-photo-2" : "bg-photo"}`}
      >
        <Image
          src={img}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 260px, (min-width: 768px) 33vw, 50vw"
          className={`object-cover transition duration-300 group-hover:scale-[1.03] ${soldOut ? "opacity-50" : ""}`}
        />
        {placeholder && (
          <span className="absolute inset-0 flex items-center justify-center p-3 text-center text-[13px] text-muted md:text-[15px]">
            Ảnh: {product.name.toLowerCase()}
          </span>
        )}
        {off > 0 && (
          <span className="absolute left-2 top-2 rounded-[3px] bg-brown px-2 py-1 text-[11px] font-bold text-white md:left-2.5 md:top-2.5 md:px-3 md:text-[13px]">
            -{off}%
          </span>
        )}
        {soldOut && (
          <span className="absolute right-2 top-2 rounded-[3px] bg-ink px-2 py-1 text-[11px] font-bold text-white md:text-[13px]">
            Hết hàng
          </span>
        )}
        <span className="absolute bottom-2 left-2 rounded-[2px] border border-primary bg-white px-2 py-[3px] text-[11px] font-bold text-primary md:bottom-2.5 md:left-2.5 md:px-3.5 md:text-[12px]">
          Thêu tên được
        </span>
      </Link>

      <div className="flex flex-1 flex-col px-1 pt-3 md:px-1">
        <h3 className="min-h-[2.5em] text-[15px] font-bold leading-5 md:text-[16px]">
          <Link href={`/san-pham/${product.slug}`} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <PriceTag price={product.price} compareAt={product.compareAtPrice} className="mt-3" />
        {(product.rating !== null || product.sold !== null) && (
          <p className="mt-2 text-[12px] text-muted md:text-[13px]">
            {[product.rating !== null && product.rating.toFixed(1), product.sold !== null && `Đã bán ${product.sold}`]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
        <div className="mt-auto pt-4">
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
