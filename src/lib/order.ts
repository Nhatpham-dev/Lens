import { describeCustom, shop, type CustomDesign } from "@/config/shop";
import { formatVND } from "@/lib/format";

export type OrderLine = { name: string; price: number; qty: number; variant?: string; custom?: CustomDesign };
export type Customer = { name: string; phone: string; address: string; note?: string; payment?: string };
export type Channel = "zalo" | "messenger";

// SĐT Việt Nam: 10 số, bắt đầu 03/05/07/08/09; chấp nhận +84 / 84
export function normalizeVNPhone(raw: string): string | null {
  let p = raw.replace(/[\s.\-()]/g, "");
  if (p.startsWith("+84")) p = "0" + p.slice(3);
  else if (p.startsWith("84") && p.length === 11) p = "0" + p.slice(2);
  return /^0(3|5|7|8|9)\d{8}$/.test(p) ? p : null;
}

export function makeOrderCode(d = new Date()) {
  const ymd = d.toISOString().slice(2, 10).replace(/-/g, "");
  return `DH${ymd}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function shippingFor(subtotal: number) {
  if (subtotal === 0) return 0;
  return shop.freeShippingFrom && subtotal >= shop.freeShippingFrom ? 0 : shop.shippingFee;
}

type Promo = NonNullable<typeof shop.promo>;

/** Khuyến mãi đang chạy (shop.promo, chưa hết hạn) hoặc null. */
export function activePromo(now: number): Promo | null {
  const p = shop.promo;
  if (!p) return null;
  return new Date(p.endsAt).getTime() > now ? p : null;
}

/** Kiểm tra mã khách nhập — trả về mã chuẩn hoá nếu đúng và còn hạn. */
export function checkCoupon(code: string, now: number): string | null {
  const p = activePromo(now);
  const c = code.trim().toUpperCase();
  return p && c === p.code.toUpperCase() ? p.code : null;
}

/**
 * Tính tiền một chỗ duy nhất — giỏ hàng, trang đặt hàng và tin nhắn đơn đều dùng hàm này.
 * `now` truyền từ ngoài vào: Next.js (Cache Components) báo lỗi build nếu gọi Date.now() lúc dựng trang tĩnh,
 * nên trong component lấy giờ bằng useNow() (lib/use-now.ts), trong event handler thì gọi Date.now().
 * `coupon`: mã khách đã nhập (khuyến mãi có requireCode chỉ áp dụng khi nhập đúng mã).
 */
export function computeTotals(lines: OrderLine[], now: number, coupon?: string | null) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const qty = lines.reduce((s, l) => s + l.qty, 0);
  const promo = activePromo(now);
  const codeOk = Boolean(promo && (!promo.requireCode || (coupon && coupon.toUpperCase() === promo.code.toUpperCase())));
  const promoApplied = Boolean(promo && codeOk && qty >= promo.minQty);
  const discount = promo && promoApplied ? Math.round((subtotal * promo.percent) / 100 / 1000) * 1000 : 0;
  const afterDiscount = subtotal - discount;
  const shipping = shippingFor(afterDiscount);
  return { subtotal, qty, promo, promoApplied, discount, shipping, total: afterDiscount + shipping };
}

export function buildOrderMessage(code: string, lines: OrderLine[], c: Customer, coupon?: string | null) {
  const t = computeTotals(lines, Date.now(), coupon); // gọi trong lúc bấm gửi đơn → an toàn
  const hasCustom = lines.some((l) => l.custom);
  const out = [
    `🛒 ĐƠN HÀNG ${code} — ${shop.name}`,
    "",
    ...lines.flatMap((l, i) => [
      `${i + 1}. ${l.name}${l.variant ? ` (Size ${l.variant})` : ""} x${l.qty} = ${formatVND(l.price * l.qty)}`,
      ...(l.custom ? [`   ✂ ${describeCustom(l.custom)}`] : []),
    ]),
    "",
    `Tạm tính: ${formatVND(t.subtotal)}`,
    ...(t.discount ? [`Giảm giá (mã ${t.promo!.code} – ${t.promo!.title}): -${formatVND(t.discount)}`] : []),
    `Phí ship: ${t.shipping === 0 ? "Miễn phí" : formatVND(t.shipping)}`,
    `TỔNG: ${formatVND(t.total)}`,
    ...(t.discount && t.promo?.requireCode ? ["(Mã giảm giá áp dụng cho đơn đầu tiên — nhờ shop xác nhận)"] : []),
    ...(hasCustom ? [`(Có sản phẩm đặt làm riêng — nhận hàng sau ${shop.customDays})`] : []),
    "",
    `Người nhận: ${c.name}`,
    `SĐT: ${c.phone}`,
    `Địa chỉ: ${c.address}`,
  ];
  if (c.payment) out.push(`Thanh toán: ${c.payment}`);
  if (c.note) out.push(`Ghi chú: ${c.note}`);
  return out.join("\n");
}

export const channelEnabled: Record<Channel, boolean> = {
  zalo: Boolean(shop.zaloPhone),
  messenger: Boolean(shop.messengerPage),
};

export function chatLink(channel: Channel, message: string) {
  return channel === "zalo"
    ? `https://zalo.me/${shop.zaloPhone}`
    : `https://m.me/${shop.messengerPage}?text=${encodeURIComponent(message)}`;
}

// Ghi clipboard, có dự phòng cho trình duyệt cũ / không phải https
export function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(
      () => true,
      () => fallbackCopy(text)
    );
  }
  return Promise.resolve(fallbackCopy(text));
}

function fallbackCopy(text: string) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {}
  ta.remove();
  return ok;
}
