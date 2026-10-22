"use client";

import { useState } from "react";
import { shop } from "@/config/shop";
import { formatVND } from "@/lib/format";
import { checkCoupon, type computeTotals } from "@/lib/order";
import { useCart } from "@/store/cart";

type Totals = ReturnType<typeof computeTotals>;

export default function OrderSummary({
  t,
  coupon,
  editableCoupon,
  children,
}: {
  t: Totals;
  coupon: string | null;
  editableCoupon?: boolean;
  children?: React.ReactNode;
}) {
  const missingForFree =
    shop.freeShippingFrom > 0 && t.shipping > 0 ? shop.freeShippingFrom - (t.subtotal - t.discount) : 0;
  const missingForPromo = t.promo && coupon && !t.promoApplied ? t.promo.minQty - t.qty : 0;

  return (
    <div className="rounded-card border border-border bg-cream p-5 md:p-7">
      <h2 className="text-xl font-bold">Tóm tắt đơn hàng</h2>
      <dl className="mt-5 space-y-3 text-[15px]">
        <Row label="Tạm tính" value={formatVND(t.subtotal)} />
        {t.discount > 0 && t.promo && <Row label={`Giảm giá (${t.promo.code})`} value={`-${formatVND(t.discount)}`} accent />}
        <Row label="Phí giao hàng" value={t.shipping === 0 ? "Miễn phí" : formatVND(t.shipping)} />
        {(missingForPromo > 0 || missingForFree > 0) && (
          <div className="space-y-1.5 rounded-btn bg-white px-3.5 py-2.5 text-[13px] leading-5">
            {missingForPromo > 0 && t.promo && (
              <p>
                Thêm {missingForPromo} sản phẩm để dùng mã <b>{t.promo.code}</b>.
              </p>
            )}
            {missingForFree > 0 && <p>Mua thêm {formatVND(missingForFree)} để được miễn phí giao hàng.</p>}
          </div>
        )}
        <div className="flex justify-between border-t border-border pt-4 text-lg font-bold">
          <dt>Tổng cộng</dt>
          <dd className="text-primary">{formatVND(t.total)}</dd>
        </div>
      </dl>
      {editableCoupon && t.promo && <CouponBox coupon={coupon} />}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

function CouponBox({ coupon }: { coupon: string | null }) {
  const setCoupon = useCart((s) => s.setCoupon);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  if (coupon) {
    return (
      <div className="mt-4 flex items-center justify-between gap-3 rounded-btn border border-dashed border-primary bg-white px-3.5 py-2.5 text-[14px]">
        <span>
          Đã áp dụng mã <b className="text-primary">{coupon}</b>
          {shop.promo?.requireCode && <span className="block text-[12px] text-muted">Cho đơn đầu tiên — shop xác nhận khi nhận đơn</span>}
        </span>
        <button type="button" onClick={() => setCoupon(null)} className="min-h-10 shrink-0 px-2 text-[13px] font-bold text-sale hover:underline">
          Bỏ mã
        </button>
      </div>
    );
  }

  return (
    <form
      className="mt-4"
      onSubmit={(e) => {
        e.preventDefault();
        const ok = checkCoupon(code, Date.now());
        if (ok) {
          setCoupon(ok);
          setError("");
        } else setError(code.trim() ? "Mã giảm giá không đúng hoặc đã hết hạn." : "Vui lòng nhập mã giảm giá.");
      }}
    >
      <label htmlFor="coupon" className="text-[14px] font-bold">Mã giảm giá</label>
      <div className="mt-1.5 flex gap-2">
        <input
          id="coupon"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError("");
          }}
          placeholder={`Ví dụ: ${shop.promo?.code}`}
          className="field min-h-11 uppercase placeholder:normal-case"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "coupon-err" : undefined}
        />
        <button type="submit" className="btn-outline min-h-11 px-4">Áp dụng</button>
      </div>
      {error && (
        <p id="coupon-err" className="mt-1.5 text-[13px] text-sale">
          {error}
        </p>
      )}
    </form>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`flex justify-between gap-3 ${accent ? "font-bold text-brown" : ""}`}>
      <dt className={accent ? "" : "text-muted"}>{label}</dt>
      <dd className="shrink-0">{value}</dd>
    </div>
  );
}
