import type { Metadata } from "next";
import WishlistView from "@/components/WishlistView";

export const metadata: Metadata = { title: "Yêu thích" };

export default function WishlistPage() {
  return (
    <div className="container-page min-h-[60vh] pb-20 pt-10 md:pt-12">
      <h1 className="text-[30px] font-bold md:text-[36px]">Sản phẩm yêu thích</h1>
      <WishlistView />
    </div>
  );
}
