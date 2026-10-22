"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SiteImage from "@/components/SiteImage";
import { shop } from "@/config/shop";
import { formatVND } from "@/lib/format";

type Slide = {
  badge: string;
  title: string;
  subtitle: string;
  line: string;
  boxTitle: string;
  boxText: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
};

const SLIDES: Slide[] = [
  {
    badge: "Khuyến mãi tháng 10",
    title: "Món quà đan bằng cả trái tim",
    subtitle: "Từng mũi len ấm áp, gửi trọn yêu thương đến người ấy",
    line: "Khăn len · Gấu bông · Khăn tay · Móc khóa, đan tay 100%",
    boxTitle: "Giảm 15% đơn hàng đầu tiên",
    boxText: "Nhập mã LENS15 · Thêu tên miễn phí",
    primary: { label: "Mua ngay", href: "/san-pham" },
    secondary: { label: "Xem sản phẩm", href: "/#san-pham" },
  },
  {
    badge: "Đặt làm riêng",
    title: "Thêu tên người ấy lên món quà",
    subtitle: "Chọn màu len, chọn kiểu chữ – món quà chỉ có một trên đời",
    line: `${shop.customColors.length} màu len · Thêu tối đa ${shop.customMaxChars} ký tự · Nhận quà sau ${shop.customDays}`,
    boxTitle: "Thêu tên miễn phí",
    boxText: "Áp dụng cho mọi sản phẩm của Lens",
    primary: { label: "Bắt đầu thiết kế", href: "/#san-pham" },
    secondary: { label: "Xem hướng dẫn", href: "/#dat-lam-rieng" },
  },
  {
    badge: "Quà tặng 20/10",
    title: "Quà tặng cô, tặng người thương",
    subtitle: "Khăn tay thêu tên, hoa tulip len – lời cảm ơn thật dịu dàng",
    line: "Gói quà cẩn thận · Kèm thiệp viết tay theo lời nhắn của bạn",
    boxTitle: "Miễn phí giao hàng",
    boxText: `Cho đơn từ ${formatVND(shop.freeShippingFrom)} trên toàn quốc`,
    primary: { label: "Mua ngay", href: "/san-pham?the=20-10" },
    secondary: { label: "Xem sản phẩm", href: "/#san-pham" },
  },
];

export default function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = SLIDES.length;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((x) => (x + 1) % n), 7000);
    return () => clearInterval(id);
  }, [paused, i, n]);

  const s = SLIDES[i];
  const img = shop.siteImages.hero[i];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Khuyến mãi nổi bật"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <SiteImage
        src={img || undefined}
        alt={s.title}
        preload={i === 0}
        className="bg-hero"
        caption={undefined}
      >
        {!img && (
          <span className="pointer-events-none absolute right-[13%] top-1/2 hidden -translate-y-1/2 text-[15px] text-white/90 xl:block">
            Khu vực ảnh nền quảng cáo (toàn bộ khung 1366 × 658)
          </span>
        )}
        <div className="container-page relative flex min-h-[560px] flex-col justify-center py-14 md:min-h-[658px] md:px-[83px] lg:px-4">
          <div key={i} className="max-w-[640px] text-white">
            <span className="inline-flex min-h-8 items-center rounded-[2px] bg-brown px-6 text-[13px] font-bold uppercase md:text-[14px]">
              {s.badge}
            </span>
            <h1 className="mt-5 text-[40px] font-bold leading-[1.15] md:text-[60px] md:leading-[68px]">{s.title}</h1>
            <p className="mt-3 text-[19px] italic leading-snug md:text-[25px]">{s.subtitle}</p>
            <p className="mt-8 text-[16px] md:mt-12 md:text-[18px]">{s.line}</p>
            <div className="mt-2 inline-block rounded-[2px] bg-cream px-6 py-4 text-ink md:min-w-[430px]">
              <p className="text-[22px] font-bold text-brown md:text-[27px]">{s.boxTitle}</p>
              <p className="mt-1.5 text-[14px] md:text-[15px]">{s.boxText}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 md:mt-9 md:gap-5">
              <Link href={s.primary.href} className="btn-brown min-w-[160px] md:min-w-[190px]">
                {s.primary.label}
              </Link>
              <Link
                href={s.secondary.href}
                className="inline-flex min-h-12 min-w-[160px] items-center justify-center whitespace-nowrap rounded-[2px] bg-cream px-6 text-[17px] font-bold text-primary hover:bg-white md:min-w-[190px]"
              >
                {s.secondary.label}
              </Link>
            </div>
          </div>
        </div>

        <ArrowButton side="left" onClick={() => setI((i - 1 + n) % n)} />
        <ArrowButton side="right" onClick={() => setI((i + 1) % n)} />
        <Dots n={n} i={i} onPick={setI} light />
      </SiteImage>
    </section>
  );
}

export function ArrowButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Slide trước" : "Slide tiếp theo"}
      className={`absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-primary shadow-sm hover:bg-cream md:flex ${
        side === "left" ? "left-6" : "right-6"
      }`}
    >
      <Icon className="size-5" strokeWidth={2.5} aria-hidden />
    </button>
  );
}

export function Dots({
  n,
  i,
  onPick,
  light,
  className = "bottom-6",
}: {
  n: number;
  i: number;
  onPick: (k: number) => void;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={`absolute inset-x-0 z-10 flex justify-center gap-1 ${className}`}>
      {Array.from({ length: n }, (_, k) => (
        <button
          key={k}
          type="button"
          onClick={() => onPick(k)}
          aria-label={`Chuyển tới slide ${k + 1}`}
          aria-current={k === i ? "true" : undefined}
          className="flex h-6 items-center px-1"
        >
          <span
            className={`block h-2 rounded-full transition-all ${k === i ? "w-6" : "w-2"} ${
              light ? (k === i ? "bg-white" : "bg-white/50") : k === i ? "bg-primary" : "bg-[#cbbfa8]"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
