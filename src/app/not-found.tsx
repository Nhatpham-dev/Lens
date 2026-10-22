import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-[64px] font-bold leading-none text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold">Không tìm thấy trang</h1>
      <p className="mt-3 text-muted">Trang bạn tìm có thể đã bị đổi tên hoặc không còn nữa.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">Về trang chủ</Link>
        <Link href="/san-pham" className="btn-outline">Xem sản phẩm</Link>
      </div>
    </div>
  );
}
