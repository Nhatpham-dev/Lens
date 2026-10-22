import Link from "next/link";
import { shop } from "@/config/shop";
import { POLICY_PAGES, SUPPORT_PAGES } from "@/data/pages";

export default function Footer() {
  const socials = [
    { label: "Facebook", href: shop.socials.facebook },
    { label: "Instagram", href: shop.socials.instagram },
    { label: "TikTok", href: shop.socials.tiktok },
  ].filter((s) => s.href);

  return (
    <footer className="bg-ink text-[14px] text-white/85">
      <div className="container-page grid gap-10 pb-8 pt-12 sm:grid-cols-2 lg:grid-cols-[300px_1fr_1fr_1fr] lg:gap-9">
        <div>
          <p className="text-[34px] leading-none text-white">{shop.name}</p>
          <p className="mt-5 leading-[22px]">{shop.description}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center rounded-btn border border-white/50 px-3 text-[13px] font-bold text-white hover:bg-white/10"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <FooterCol title="Chính sách" links={POLICY_PAGES.map((p) => ({ href: `/chinh-sach/${p.slug}`, label: p.title }))} />
        <FooterCol title="Hỗ trợ" links={SUPPORT_PAGES.map((p) => ({ href: `/ho-tro/${p.slug}`, label: p.title }))} />

        <div>
          <p className="text-[17px] font-bold text-white">Liên hệ</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              Hotline: <a href={`tel:${shop.hotline.replace(/\s/g, "")}`} className="hover:text-white hover:underline">{shop.hotline}</a>
            </li>
            <li>
              Email: <a href={`mailto:${shop.email}`} className="hover:text-white hover:underline">{shop.email}</a>
            </li>
            <li>Địa chỉ: {shop.address}</li>
            <li>Giờ làm việc: {shop.openHours}</li>
          </ul>
        </div>
      </div>

      <div className="container-page">
        <div className="flex flex-wrap items-center gap-2 border-t border-dashed border-white/30 py-6">
          <span className="mr-6">Thanh toán:</span>
          {shop.paymentMethods.map((m) => (
            <span key={m} className="inline-flex min-h-[30px] items-center rounded-btn bg-cream px-4 text-[12px] font-bold text-ink">
              {m}
            </span>
          ))}
        </div>
        <p className="pb-8 pt-2 text-center text-[13px] text-white/75">
          © 2026 {shop.name} – Handmade từ từng mũi len
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="text-[17px] font-bold text-white">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-white hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
