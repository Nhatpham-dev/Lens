"use client";

import { useState } from "react";
import { shop } from "@/config/shop";

const STEPS = [
  { title: "Chọn sản phẩm", text: "Khăn len, gấu bông, khăn tay hay móc khóa – chọn món bạn thích nhất." },
  {
    title: "Chọn màu & thêu tên",
    text: `${shop.customColors.length} màu len, thêu tối đa ${shop.customMaxChars} ký tự bằng kiểu chữ viết tay hoặc in đậm.`,
  },
  { title: `Nhận quà sau ${shop.customDays.replace("–", "-")}`, text: `${shop.name} đan tay, gói quà cẩn thận và giao tận nơi trong ${shop.customDays.replace("–", "-")}.` },
];

/**
 * Mục "Đặt làm riêng" trên trang chủ — CHỈ LÀ HƯỚNG DẪN.
 * Việc chọn màu / thêu tên thật nằm ở trang chi tiết sản phẩm (mục "Kiểu đặt hàng").
 * Nút "Bắt đầu thiết kế" cuộn lên mục Sản phẩm.
 */
export default function CustomGuide() {
  const [color, setColor] = useState(0);

  return (
    <section id="dat-lam-rieng" className="bg-sand pb-4 pt-12 md:pt-[50px]">
      <div className="container-page text-center">
        <h2 className="section-title">Đặt làm riêng cho người ấy</h2>
        <p className="mt-3 text-[19px] italic text-primary md:text-[23px]">món quà chỉ có một trên đời</p>

        <ol className="mt-7 grid gap-4 text-left md:grid-cols-3 md:gap-[30px]">
          {STEPS.map((s, k) => (
            <li key={s.title} className="rounded-card border border-border bg-white px-6 pb-5 pt-4">
              <span className="flex size-11 items-center justify-center rounded-full bg-primary text-[17px] font-bold text-white">
                {k + 1}
              </span>
              <h3 className="mt-4 text-[20px] font-bold">{s.title}</h3>
              <p className="mt-1.5 text-[15px] leading-[23px] text-muted">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-7 flex flex-wrap justify-center gap-3.5" role="radiogroup" aria-label="Bảng màu len (minh hoạ)">
          {shop.customColors.map((c, k) => (
            <button
              key={c.hex}
              type="button"
              role="radio"
              aria-checked={color === k}
              aria-label={c.name}
              title={c.name}
              onClick={() => setColor(k)}
              className={`size-9 rounded-full transition ${
                color === k ? "ring-[3px] ring-primary ring-offset-[2px] ring-offset-sand" : "border-2 border-white hover:scale-110"
              }`}
              style={{ background: c.hex }}
            />
          ))}
        </div>
        <p className="mt-2 text-[13px] text-muted" aria-live="polite">
          Màu len: {shop.customColors[color].name}
        </p>

        <a href="#san-pham" className="btn-primary mt-3 min-w-[220px]">
          Bắt đầu thiết kế
        </a>
      </div>
    </section>
  );
}
