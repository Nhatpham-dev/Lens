import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPage from "@/components/ContentPage";
import { SUPPORT_PAGES } from "@/data/pages";

export function generateStaticParams() {
  return SUPPORT_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/ho-tro/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = SUPPORT_PAGES.find((p) => p.slug === slug);
  return { title: page?.title ?? "Hỗ trợ" };
}

export default async function SupportPage({ params }: PageProps<"/ho-tro/[slug]">) {
  const { slug } = await params;
  const page = SUPPORT_PAGES.find((p) => p.slug === slug);
  if (!page) notFound();
  return <ContentPage page={page} />;
}
