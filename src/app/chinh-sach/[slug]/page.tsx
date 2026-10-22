import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPage from "@/components/ContentPage";
import { POLICY_PAGES } from "@/data/pages";

export function generateStaticParams() {
  return POLICY_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/chinh-sach/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = POLICY_PAGES.find((p) => p.slug === slug);
  return { title: page?.title ?? "Chính sách" };
}

export default async function PolicyPage({ params }: PageProps<"/chinh-sach/[slug]">) {
  const { slug } = await params;
  const page = POLICY_PAGES.find((p) => p.slug === slug);
  if (!page) notFound();
  return <ContentPage page={page} />;
}
