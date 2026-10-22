import Link from "next/link";
import { shop } from "@/config/shop";
import type { InfoPage } from "@/data/pages";
import { chatLink, channelEnabled } from "@/lib/order";

export default function ContentPage({ page }: { page: InfoPage }) {
  return (
    <div className="container-page max-w-[800px] pb-20 pt-10 md:pt-14">
      <nav className="text-sm text-muted" aria-label="Đường dẫn">
        <Link href="/" className="hover:text-primary">Trang chủ</Link> / <span>{page.title}</span>
      </nav>
      <h1 className="mt-4 text-[30px] font-bold leading-tight md:text-[36px]">{page.title}</h1>
      <p className="mt-4 text-base leading-7 text-muted">{page.intro}</p>
      <div className="mt-8 space-y-8">
        {page.sections.map((s) => (
          <section key={s.heading} className="rounded-card border border-border bg-white p-6">
            <h2 className="text-lg font-bold">{s.heading}</h2>
            <div className="mt-3 space-y-2 text-[15px] leading-7 text-muted">
              {s.body.map((b) => (
                <p key={b}>{b}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
      {channelEnabled.zalo && (
        <div className="mt-10 rounded-card bg-sand p-6 text-center">
          <p className="text-base">Cần hỗ trợ thêm? {shop.name} luôn sẵn sàng lắng nghe.</p>
          <a href={chatLink("zalo", "")} target="_blank" rel="noopener noreferrer" className="btn-primary mt-4">
            Nhắn Zalo cho shop
          </a>
        </div>
      )}
    </div>
  );
}
