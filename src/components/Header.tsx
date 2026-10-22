import Link from "next/link";
import { Heart, Search } from "lucide-react";
import { shop } from "@/config/shop";
import CartBadge from "./CartBadge";
import MobileMenu from "./MobileMenu";
import { NAV } from "./nav";

export default function Header() {
  return (
    <>
      <div className="bg-primary px-4 py-2.5 text-center text-[13px] text-white md:text-sm">
        Handmade từ từng mũi len <span className="mx-1 opacity-70">|</span> Nhận thêu tên theo yêu cầu
      </div>
      <header className="sticky top-0 z-40 border-b border-border bg-white">
        <div className="container-page flex h-16 items-center justify-between gap-4 md:h-[70px]">
          <div className="flex items-center gap-1">
            <MobileMenu />
            <Link href="/" className="text-[28px] font-bold leading-none text-primary md:text-[32px]">
              {shop.name}
            </Link>
          </div>

          <nav className="hidden items-center gap-7 text-[16px] lg:flex" aria-label="Menu chính">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="py-2 hover:text-primary">
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 text-sm lg:gap-3">
            <Link href="/tim-kiem" aria-label="Tìm kiếm" className="inline-flex items-center hover:text-primary">
              <span className="hidden lg:inline">Tìm kiếm</span>
              <span className="inline-flex size-11 items-center justify-center lg:hidden">
                <Search className="size-5" aria-hidden />
              </span>
            </Link>
            <Link href="/yeu-thich" aria-label="Yêu thích" className="inline-flex items-center hover:text-primary">
              <span className="hidden lg:inline">Yêu thích</span>
              <span className="inline-flex size-11 items-center justify-center lg:hidden">
                <Heart className="size-5" aria-hidden />
              </span>
            </Link>
            <CartBadge />
          </div>
        </div>
      </header>
    </>
  );
}
