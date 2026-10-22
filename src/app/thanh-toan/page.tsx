import type { Metadata } from "next";
import CheckoutView from "@/components/CheckoutView";

export const metadata: Metadata = { title: "Đặt hàng" };

export default function CheckoutPage() {
  return (
    <div className="container-page pb-20 pt-10 md:pt-12">
      <CheckoutView />
    </div>
  );
}
