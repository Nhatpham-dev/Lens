import Link from "next/link";
import AboutCarousel from "@/components/home/AboutCarousel";
import CustomGuide from "@/components/home/CustomGuide";
import HeroSlider from "@/components/home/HeroSlider";
import ProductCard from "@/components/ProductCard";
import SiteImage from "@/components/SiteImage";
import { shop } from "@/config/shop";
import { getCategories, getFeaturedProducts } from "@/data/products";

// Chú thích ô ảnh danh mục (theo bản thiết kế) — thay ảnh thật trong shop.siteImages.categories
const CATEGORY_CAPTION: Record<string, string> = {
  "khan-len": "Ảnh: khăn len mint",
  "gau-bong-len": "Ảnh: gấu bông len",
  "khan-tay": "Ảnh: khăn tay len",
  "moc-khoa": "Ảnh: móc khóa len",
};

// Quà tặng theo dịp — slug trùng với cột "the" trong Excel (8/3 → 8-3, 20/10 → 20-10)
const OCCASIONS = [
  { slug: "sinh-nhat", name: "Sinh nhật", text: "Bất ngờ ngọt ngào", caption: "Ảnh: quà sinh nhật" },
  { slug: "valentine", name: "Valentine", text: "Gửi yêu thương 14/2", caption: "Ảnh: quà Valentine" },
  { slug: "8-3", name: "8/3", text: "Tặng mẹ, tặng bạn gái", caption: "Ảnh: quà 8/3" },
  { slug: "20-10", name: "20/10", text: "Tặng cô, tặng người thương", caption: "Ảnh: quà 20/10" },
  { slug: "noel", name: "Noel", text: "Ấm áp mùa đông", caption: "Ảnh: quà Noel" },
];

const REVIEWS = [
  {
    text: "Khăn len mềm và ấm hơn mình nghĩ, chữ thêu tên cực xinh. Bạn mình mở quà xong cười suốt!",
    name: "Minh Anh",
    context: "Tặng sinh nhật bạn thân",
  },
  {
    text: "Đặt gấu len tặng người yêu dịp Valentine, shop làm đúng màu mình chọn và gói quà rất kỹ.",
    name: "Quốc Bảo",
    context: "Tặng người yêu dịp Valentine",
  },
  {
    text: "Mua khăn tay thêu tên tặng cô giáo ngày 20/10, cô rất xúc động. Chắc chắn sẽ ủng hộ tiếp.",
    name: "Thu Hà",
    context: "Tặng cô giáo ngày 20/10",
  },
];

export default function HomePage() {
  const categories = getCategories();
  const featured = getFeaturedProducts(4);

  return (
    <>
      <HeroSlider />

      {/* Danh mục sản phẩm */}
      <section className="container-page pt-12 md:pt-[50px]">
        <h2 className="section-title">Danh mục sản phẩm</h2>
        <div className="-mx-4 mt-6 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0">
          {categories.map((c, k) => (
            <Link
              key={c.slug}
              href={`/san-pham?danh-muc=${c.slug}`}
              className={`w-[46%] shrink-0 snap-start rounded-card border border-border p-[11px] pb-3 text-center transition hover:border-primary md:w-auto ${
                k % 2 ? "bg-sand" : "bg-card"
              }`}
            >
              <SiteImage
                src={shop.siteImages.categories[c.slug] || undefined}
                alt={c.name}
                caption={CATEGORY_CAPTION[c.slug] ?? `Ảnh: ${c.name.toLowerCase()}`}
                sizes="260px"
                className="h-[90px] rounded-[3px] bg-tile md:h-[100px]"
              />
              <h3 className="mt-4 text-[18px] font-bold md:text-[21px]">{c.name}</h3>
              <p className="mt-1 text-[14px] text-muted md:text-[15px]">{c.count} sản phẩm</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Sản phẩm — nút "Bắt đầu thiết kế" cuộn tới đây */}
      <section id="san-pham" className="container-page pb-12 pt-12 md:pb-[50px] md:pt-[50px]">
        <h2 className="section-title">Sản phẩm</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {featured.map((p, k) => (
            <ProductCard key={p.id} product={p} index={k} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/san-pham" className="btn-outline min-w-[220px]">
            Xem tất cả sản phẩm
          </Link>
        </div>
      </section>

      <CustomGuide />

      {/* Quà tặng theo dịp */}
      <section className="container-page pb-12 pt-12 md:pb-[55px] md:pt-[56px]">
        <h2 className="section-title">Quà tặng theo dịp</h2>
        <div className="-mx-4 mt-7 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-5 md:gap-[25px] md:overflow-visible md:px-0">
          {OCCASIONS.map((o, k) => (
            <Link
              key={o.slug}
              href={`/san-pham?the=${o.slug}`}
              className={`w-[46%] shrink-0 snap-start rounded-card border border-border p-[11px] pb-6 text-center transition hover:border-primary md:w-auto ${
                k % 2 ? "bg-sand" : "bg-card"
              }`}
            >
              <SiteImage
                src={shop.siteImages.occasions[o.slug] || undefined}
                alt={`Quà ${o.name}`}
                caption={o.caption}
                sizes="200px"
                className="h-20 rounded-[3px] bg-tile"
                captionClassName="text-muted !text-[13px] md:!text-[14px]"
              />
              <h3 className="mt-4 text-[20px] font-bold md:text-[23px]">{o.name}</h3>
              <p className="mt-2 text-[13px] text-muted md:text-[14px]">{o.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <AboutCarousel />

      {/* Khách hàng nói gì */}
      <section className="container-page pb-12 pt-12 md:pb-[45px] md:pt-[50px]">
        <h2 className="section-title font-bold">Khách hàng nói gì về {shop.name}</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3 md:gap-[30px]">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="flex flex-col rounded-card border border-border bg-white px-6 pb-8 pt-5">
              <p className="text-[14px] text-brown">Đánh giá 5/5</p>
              <blockquote className="mt-4 flex-1 text-[15px] leading-6 text-muted">{r.text}</blockquote>
              <figcaption className="mt-8 md:mt-14">
                <p className="text-[17px] font-bold">{r.name}</p>
                <p className="mt-2 text-[14px] italic text-primary">{r.context}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Thông tin liên hệ */}
      <section id="lien-he" className="bg-sand pb-8 pt-6">
        <div className="container-page text-center">
          <h2 className="text-[28px] font-bold md:text-[32px]">Thông tin liên hệ</h2>
          <p className="mt-3 text-[16px] text-muted md:text-[17px]">{shop.name} luôn sẵn sàng lắng nghe và tư vấn cho bạn</p>
          <dl className="mt-6 grid grid-cols-2 gap-y-6 md:grid-cols-4">
            <ContactItem label="Hotline">
              <a href={`tel:${shop.hotline.replace(/\s/g, "")}`} className="hover:text-primary">{shop.hotline}</a>
            </ContactItem>
            <ContactItem label="Email">
              <a href={`mailto:${shop.email}`} className="hover:text-primary">{shop.email}</a>
            </ContactItem>
            <ContactItem label="Địa chỉ">{shop.address}</ContactItem>
            <ContactItem label="Mạng xã hội">
              <a href={shop.socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-primary">Facebook</a>
              {" · "}
              <a href={shop.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary">Instagram</a>
              {" · "}
              <a href={shop.socials.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-primary">TikTok</a>
            </ContactItem>
          </dl>
        </div>
      </section>
    </>
  );
}

function ContactItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-3 md:border-l md:border-[#cbbfa8] md:first:border-l-0">
      <dt className="text-[13px] font-bold uppercase text-primary md:text-[14px]">{label}</dt>
      <dd className="mt-2 text-[15px] md:text-[17px]">{children}</dd>
    </div>
  );
}
