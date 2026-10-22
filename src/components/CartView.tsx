"use client";

import Image from "next/image";
import Link from "next/link";
import { Scissors, Trash } from "lucide-react";
import OrderSummary from "@/components/OrderSummary";
import QuantityInput from "@/components/QuantityInput";
import { describeCustom } from "@/config/shop";
import { isPlaceholderImage } from "@/data/products";
import { formatVND } from "@/lib/format";
import { useCart, useCartHydrated } from "@/store/cart";
import { STATUS_TEXT, useCartLines } from "@/store/cart-lines";

export default function CartView() {
  const hydrated = useCartHydrated();
  const { lines, valid, coupon, ...t } = useCartLines();
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);

  if (!hydrated) {
    return <div className="mt-8 h-48 animate-pulse rounded-card bg-cream" aria-label="Đang tải giỏ hàng" />;
  }

  if (lines.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center gap-3 rounded-card bg-cream px-6 py-16 text-center">
        <p className="text-xl font-bold">Giỏ hàng đang trống</p>
        <p className="text-muted">Chọn một món len xinh để gửi tặng người ấy nhé.</p>
        <Link href="/san-pham" className="btn-primary mt-4">Tiếp tục mua sắm</Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
      <ul className="divide-y divide-border border-y border-border">
        {lines.map((l, k) => (
          <li key={l.key} className="flex gap-4 py-5">
            <Link
              href={l.removed ? "/san-pham" : `/san-pham/${l.slug}`}
              className={`relative aspect-square w-24 shrink-0 overflow-hidden rounded-btn sm:w-28 ${k % 2 ? "bg-photo-2" : "bg-photo"}`}
            >
              {!l.removed && <Image src={l.image} alt={l.name} fill sizes="112px" className="object-cover" />}
              {!l.removed && isPlaceholderImage(l.image) && (
                <span className="absolute inset-0 flex items-center justify-center p-1 text-center text-[11px] text-muted">
                  Ảnh: {l.name.toLowerCase()}
                </span>
              )}
            </Link>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={l.removed ? "/san-pham" : `/san-pham/${l.slug}`} className="text-base font-bold hover:text-primary">
                    {l.name}
                  </Link>
                  {l.variant && <p className="text-sm text-muted">Size: {l.variant}</p>}
                  {l.custom ? (
                    <p className="mt-1 flex items-start gap-1.5 text-[13px] text-primary">
                      <Scissors className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                      {describeCustom(l.custom)}
                    </p>
                  ) : (
                    <p className="text-[13px] text-muted">Mẫu có sẵn</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(l.key)}
                  className="-mr-2 -mt-2 inline-flex size-10 shrink-0 items-center justify-center rounded-full text-muted hover:bg-cream hover:text-sale"
                  aria-label={`Xoá ${l.name} khỏi giỏ`}
                >
                  <Trash className="size-4" aria-hidden />
                </button>
              </div>
              {l.status === "ok" ? (
                <>
                  <p className="text-sm text-muted">{formatVND(l.price)}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-1">
                    <QuantityInput size="sm" value={l.qty} max={l.stock} onChange={(n) => setQty(l.key, n)} />
                    <p className="font-bold">{formatVND(l.price * l.qty)}</p>
                  </div>
                </>
              ) : (
                <p className="text-sm font-bold text-sale">{STATUS_TEXT[l.status]} — sẽ không được tính vào đơn.</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <OrderSummary t={t} coupon={coupon} editableCoupon>
          {valid.length > 0 ? (
            <Link href="/thanh-toan" className="btn-primary w-full">Tiến hành đặt hàng</Link>
          ) : (
            <p className="text-sm text-muted">Chưa có sản phẩm nào có thể đặt.</p>
          )}
          <Link href="/san-pham" className="mt-3 block py-2 text-center text-sm font-bold text-primary hover:underline">
            Tiếp tục mua sắm
          </Link>
        </OrderSummary>
      </div>
    </div>
  );
}
