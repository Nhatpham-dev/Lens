"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Copy, MessageCircle, Scissors } from "lucide-react";
import OrderSummary from "@/components/OrderSummary";
import { describeCustom, shop } from "@/config/shop";
import { formatVND } from "@/lib/format";
import {
  buildOrderMessage,
  channelEnabled,
  chatLink,
  copyText,
  makeOrderCode,
  normalizeVNPhone,
  type Channel,
  type Customer,
} from "@/lib/order";
import { useCart, useCartHydrated, useToast } from "@/store/cart";
import { useCartLines } from "@/store/cart-lines";

type Errors = Partial<Record<keyof Customer, string>>;
const CHANNEL_NAME: Record<Channel, string> = { zalo: "Zalo", messenger: "Messenger" };

export default function CheckoutView() {
  const hydrated = useCartHydrated();
  const { valid, lines, coupon, ...t } = useCartLines();
  const clear = useCart((s) => s.clear);
  const showToast = useToast((s) => s.show);
  const router = useRouter();

  const [form, setForm] = useState<Customer>({ name: "", phone: "", address: "", note: "", payment: shop.paymentMethods[0] });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<{ code: string; msg: string; channel: Channel } | null>(null);
  const [copied, setCopied] = useState<boolean | null>(null);
  const hasCustom = valid.some((l) => l.custom);

  function validate(): Customer | null {
    const e: Errors = {};
    const name = form.name.trim();
    const address = form.address.trim();
    const phone = normalizeVNPhone(form.phone);
    if (name.length < 2) e.name = "Vui lòng nhập họ tên người nhận.";
    if (!phone) e.phone = "Số điện thoại chưa đúng, ví dụ: 0912 345 678.";
    if (address.length < 8) e.address = "Vui lòng nhập địa chỉ đầy đủ (số nhà, đường, phường/xã, tỉnh/thành).";
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`f-${Object.keys(e)[0]}`)?.focus();
      return null;
    }
    return { name, phone: phone!, address, note: form.note?.trim(), payment: form.payment };
  }

  // Ghi clipboard và mở app chat NGAY trong lúc bấm (không await) để trình duyệt không chặn tab mới
  function handleSend(channel: Channel) {
    const customer = validate();
    if (!customer) return;
    const code = sent?.code ?? makeOrderCode();
    const msg = buildOrderMessage(code, valid, customer, coupon);
    copyText(msg).then(setCopied);
    window.open(chatLink(channel, msg), "_blank", "noopener");
    setSent({ code, msg, channel });
    window.scrollTo({ top: 0 });
  }

  function finish() {
    clear();
    showToast(`Cảm ơn bạn đã đặt hàng tại ${shop.name}! Shop sẽ nhắn lại xác nhận đơn sớm nhất.`, false);
    router.push("/");
  }

  if (!hydrated) return <div className="h-64 animate-pulse rounded-card bg-cream" aria-label="Đang tải" />;

  // --- Sau khi bấm gửi: hướng dẫn dán đơn ---
  if (sent) {
    return (
      <div className="mx-auto max-w-2xl">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary">
          <Check className="size-6 text-white" aria-hidden />
        </span>
        <h1 className="mt-5 text-[30px] font-bold md:text-[36px]">Còn một bước nữa thôi!</h1>
        <p className="mt-4 text-base leading-7">
          {copied === false ? (
            <>Trình duyệt không cho tự sao chép. Hãy bấm <b>Sao chép lại</b> bên dưới, </>
          ) : (
            <>Đơn hàng <b>{sent.code}</b> đã được sao chép. </>
          )}
          Mở khung chat {CHANNEL_NAME[sent.channel]} với {shop.name} vừa hiện ra,{" "}
          <b>giữ ngón tay vào ô nhập tin → chọn Dán</b> (trên máy tính bấm <b>Ctrl+V</b>) rồi bấm <b>Gửi</b>. Shop sẽ
          nhắn lại xác nhận đơn{hasCustom && ", thiết kế đặt làm riêng"} và cách thanh toán.
        </p>
        <pre className="mt-6 whitespace-pre-wrap rounded-card bg-cream p-5 font-sans text-[15px] leading-6">{sent.msg}</pre>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => copyText(sent.msg).then(setCopied)} className="btn-outline">
            <Copy className="size-4" aria-hidden /> Sao chép lại
          </button>
          <a href={chatLink(sent.channel, sent.msg)} target="_blank" rel="noopener noreferrer" className="btn-outline">
            <MessageCircle className="size-4" aria-hidden /> Mở lại {CHANNEL_NAME[sent.channel]}
          </a>
        </div>
        <button type="button" onClick={finish} className="btn-primary mt-3 w-full">Tôi đã gửi đơn</button>
        <button type="button" onClick={() => setSent(null)} className="mt-4 w-full py-2 text-center text-sm text-muted hover:text-ink">
          Sửa lại thông tin
        </button>
      </div>
    );
  }

  if (valid.length === 0) {
    return (
      <div className="mx-auto max-w-md py-10 text-center">
        <h1 className="text-[30px] font-bold">Đặt hàng</h1>
        <p className="mt-4 text-muted">Giỏ hàng chưa có sản phẩm nào để đặt.</p>
        <Link href="/san-pham" className="btn-primary mt-6">Xem sản phẩm</Link>
      </div>
    );
  }

  const field = (key: "name" | "phone" | "address" | "note") => ({
    id: `f-${key}`,
    value: form[key] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
    },
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `e-${key}` : undefined,
    className: `field ${errors[key] ? "!border-sale" : ""}`,
  });
  const err = (key: keyof Customer) =>
    errors[key] && (
      <p id={`e-${key}`} className="mt-1.5 text-sm text-sale">
        {errors[key]}
      </p>
    );

  return (
    <>
      <Link href="/gio-hang" className="text-sm text-muted hover:text-primary">← Quay lại giỏ hàng</Link>
      <h1 className="mt-3 text-[30px] font-bold md:text-[36px]">Đặt hàng</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
        <form noValidate onSubmit={(e) => e.preventDefault()}>
          <h2 className="text-xl font-bold">Thông tin nhận hàng</h2>
          <div className="mt-5 grid gap-5">
            <div>
              <label htmlFor="f-name" className="mb-1.5 block text-[15px] font-bold">Họ và tên *</label>
              <input {...field("name")} autoComplete="name" placeholder="Nguyễn Văn A" />
              {err("name")}
            </div>
            <div>
              <label htmlFor="f-phone" className="mb-1.5 block text-[15px] font-bold">Số điện thoại *</label>
              <input {...field("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="0912 345 678" />
              {err("phone")}
            </div>
            <div>
              <label htmlFor="f-address" className="mb-1.5 block text-[15px] font-bold">Địa chỉ nhận hàng *</label>
              <input {...field("address")} autoComplete="street-address" placeholder="Số nhà, đường, phường/xã, tỉnh/thành" />
              {err("address")}
            </div>
            <fieldset>
              <legend className="mb-1.5 block text-[15px] font-bold">Hình thức thanh toán</legend>
              <div className="flex flex-wrap gap-2.5">
                {shop.paymentMethods.map((m) => (
                  <label
                    key={m}
                    className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-btn border px-4 text-[15px] ${
                      form.payment === m ? "border-primary bg-primary/5 font-bold text-primary" : "border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m}
                      checked={form.payment === m}
                      onChange={() => setForm((f) => ({ ...f, payment: m }))}
                      className="accent-primary"
                    />
                    {m === "COD" ? "COD (trả tiền khi nhận hàng)" : m}
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="f-note" className="mb-1.5 block text-[15px] font-bold">Ghi chú / lời nhắn trên thiệp</label>
              <textarea {...field("note")} rows={3} placeholder="Ví dụ: Viết thiệp “Chúc mừng sinh nhật Minh Anh”, giao giờ hành chính…" />
            </div>
          </div>
          <p className="mt-6 rounded-btn bg-cream px-4 py-3 text-[15px] leading-6">
            Bấm nút bên dưới, website sẽ sao chép sẵn nội dung đơn và mở khung chat với {shop.name}. Bạn chỉ cần dán và
            gửi — shop sẽ xác nhận đơn{hasCustom && ", thiết kế đặt làm riêng"} và cách thanh toán.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {channelEnabled.zalo && (
              <button type="button" onClick={() => handleSend("zalo")} className="btn-primary">
                <MessageCircle className="size-5" aria-hidden /> Gửi đơn qua Zalo
              </button>
            )}
            {channelEnabled.messenger && (
              <button
                type="button"
                onClick={() => handleSend("messenger")}
                className={channelEnabled.zalo ? "btn-outline" : "btn-primary"}
              >
                <MessageCircle className="size-5" aria-hidden /> Gửi đơn qua Messenger
              </button>
            )}
          </div>
        </form>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary t={t} coupon={coupon} editableCoupon>
            <ul className="space-y-3 border-t border-border pt-4 text-[15px]">
              {valid.map((l) => (
                <li key={l.key}>
                  <div className="flex justify-between gap-3">
                    <span>
                      {l.name}
                      {l.variant && <span className="text-muted"> · {l.variant}</span>}
                      <span className="text-muted"> × {l.qty}</span>
                    </span>
                    <span className="shrink-0">{formatVND(l.price * l.qty)}</span>
                  </div>
                  <p className={`mt-0.5 flex items-start gap-1.5 text-[13px] ${l.custom ? "text-primary" : "text-muted"}`}>
                    {l.custom && <Scissors className="mt-0.5 size-3.5 shrink-0" aria-hidden />}
                    {l.custom ? describeCustom(l.custom) : "Mẫu có sẵn"}
                  </p>
                </li>
              ))}
            </ul>
            {hasCustom && (
              <p className="mt-3 text-[13px] text-muted">Đơn có sản phẩm đặt làm riêng — nhận hàng sau {shop.customDays}.</p>
            )}
            {lines.length > valid.length && (
              <p className="mt-3 text-[13px] text-sale">Một số sản phẩm trong giỏ đã hết hàng nên không có trong đơn.</p>
            )}
          </OrderSummary>
        </div>
      </div>
    </>
  );
}
