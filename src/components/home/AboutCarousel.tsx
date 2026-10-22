"use client";

import { useEffect, useState } from "react";
import SiteImage from "@/components/SiteImage";
import { shop } from "@/config/shop";
import { ArrowButton, Dots } from "./HeroSlider";

const VALUES = [
  { title: "100% handmade", text: "Đan tay từng mũi, không làm hàng loạt." },
  { title: "Len mềm an toàn", text: "Sợi len thân thiện với làn da nhạy cảm." },
  { title: "Thêu theo yêu cầu", text: "Thêu tên hoặc dòng chữ riêng lên món quà." },
  { title: "Đổi trả nếu lỗi", text: "Đổi trả trong 7 ngày nếu sản phẩm lỗi do Lens." },
];

const PROJECTS = [
  { title: "Quà tặng cho cả lớp học", text: "Bộ khăn len thêu tên cho 30 học sinh nhân ngày Nhà giáo Việt Nam." },
  { title: "Bộ quà cưới handmade", text: "Cặp gấu len và khăn thêu tên cô dâu chú rể, đặt riêng cho tiệc cưới." },
  { title: "Quà tri ân doanh nghiệp", text: "Móc khóa len thêu logo làm quà cảm ơn khách hàng và nhân viên." },
];

const num = (k: number) => String(k + 1).padStart(2, "0");

/** Carousel "Về Lens / Điều Lens luôn giữ / Dự án" — mục menu "Về Lens" trỏ tới đây (#ve-lens). */
export default function AboutCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = 3;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((x) => (x + 1) % n), 9000);
    return () => clearInterval(id);
  }, [paused, i]);

  const photo = (src: string, caption: string) => (
    <SiteImage
      src={src || undefined}
      alt={caption}
      caption={caption}
      sizes="(min-width: 1024px) 563px, 100vw"
      className="aspect-[563/290] w-full rounded-card border border-[#cbbfa8] bg-photo-2"
    />
  );

  return (
    <section
      id="ve-lens"
      aria-roledescription="carousel"
      aria-label="Câu chuyện của Lens"
      className="relative bg-cream pb-14 pt-10 md:pb-[50px] md:pt-[50px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-page md:min-h-[290px]">
        {i === 0 && (
          <div className="grid items-center gap-8 lg:grid-cols-[560px_1fr] lg:gap-[77px]">
            <div>
              <p className="eyebrow">Câu chuyện của Lens</p>
              <h2 className="mt-2.5 text-[30px] font-bold md:text-[34px]">Về Lens</h2>
              <p className="mt-5 text-[16px] leading-[27px] text-muted">
                {shop.name} là xưởng len nhỏ chuyên làm quà tặng handmade. Mỗi sản phẩm đều được đan và thêu thủ công từng
                mũi, từ khăn len, gấu bông đến phụ kiện, để người nhận cảm thấy được trân trọng.
              </p>
              <p className="mt-6 text-[16px] leading-[27px] text-muted">
                Chúng mình chọn sợi len mềm, an toàn cho làn da nhạy cảm, nhận thêu tên theo yêu cầu và luôn đồng hành
                cùng bạn đến khi món quà được trao tay.
              </p>
            </div>
            {photo(shop.siteImages.about, "Khu vực đặt ảnh xưởng / góc làm việc của Lens")}
          </div>
        )}

        {i === 1 && (
          <div className="grid items-center gap-8 lg:grid-cols-[420px_1fr] lg:gap-[57px]">
            <div className="order-2 lg:order-1">
              <SiteImage
                src={shop.siteImages.values || undefined}
                alt="Quy trình làm món len"
                caption="Khu vực đặt ảnh quy trình làm món len"
                sizes="(min-width: 1024px) 420px, 100vw"
                className="aspect-[420/290] w-full rounded-card border border-[#cbbfa8] bg-photo-2"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="eyebrow">Giá trị cốt lõi</p>
              <h2 className="mt-2.5 text-[30px] font-bold md:text-[36px]">Điều Lens luôn giữ</h2>
              <ul className="mt-5 grid gap-x-10 gap-y-7 sm:grid-cols-2">
                {VALUES.map((v, k) => (
                  <li key={v.title}>
                    <p className="text-[16px] font-bold text-primary">{num(k)}</p>
                    <p className="mt-1 text-[19px] font-bold">{v.title}</p>
                    <p className="mt-2 text-[14px] text-muted">{v.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {i === 2 && (
          <div className="grid items-center gap-8 lg:grid-cols-[560px_1fr] lg:gap-[77px]">
            <div>
              <p className="eyebrow">Dự án của Lens</p>
              <h2 className="mt-2.5 text-[30px] font-bold md:text-[32px]">Những dự án Lens đã thực hiện</h2>
              <ol className="mt-5 space-y-6">
                {PROJECTS.map((p, k) => (
                  <li key={p.title} className="flex gap-6">
                    <span className="pt-1 text-[16px] font-bold text-primary">{num(k)}</span>
                    <div>
                      <p className="text-[19px] font-bold">{p.title}</p>
                      <p className="mt-1 text-[15px] text-muted">{p.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            {photo(shop.siteImages.projects, "Khu vực đặt ảnh các dự án của Lens")}
          </div>
        )}
      </div>

      <ArrowButton side="left" onClick={() => setI((i - 1 + n) % n)} />
      <ArrowButton side="right" onClick={() => setI((i + 1) % n)} />
      <Dots n={n} i={i} onPick={setI} className="bottom-3" />
    </section>
  );
}
