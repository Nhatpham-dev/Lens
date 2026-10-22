import type { Metadata } from "next";
import CartView from "@/components/CartView";

export const metadata: Metadata = { title: "Giỏ hàng" };

export default function CartPage() {
  return (
    <div className="container-page pb-20 pt-10 md:pt-12">
      <h1 className="text-[30px] font-bold md:text-[36px]">Giỏ hàng</h1>
      <CartView />
    </div>
  );
}
