import type { Metadata } from "next";
import "@fontsource/arimo/400.css";
import "@fontsource/arimo/400-italic.css";
import "@fontsource/arimo/700.css";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Toast from "@/components/Toast";
import { shop } from "@/config/shop";

export const metadata: Metadata = {
  title: { default: `${shop.name} – ${shop.tagline}`, template: `%s | ${shop.name}` },
  description: shop.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi">
      <body className="flex min-h-screen flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toast />
      </body>
    </html>
  );
}
