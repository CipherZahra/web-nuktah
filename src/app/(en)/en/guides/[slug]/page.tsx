import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuide, getGuides, formatGuideDate } from "@/lib/guides";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, canonical } from "@/lib/jsonld";
import { GuideArticle } from "@/components/pages/guide-article";
import enMessages from "../../../../../../messages/en.json";

export function generateStaticParams() {
  return getGuides("en").map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide("en", slug);
  if (!guide) return {};
  return { title: `${guide.title} — Nuktah`, description: guide.excerpt, ...canonical(`/en/guides/${slug}`) };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide("en", slug);
  if (!guide) notFound();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd("en", [
          { name: enMessages.nav.home },
          { name: enMessages.guides.title, path: "/en/guides" },
          { name: guide.title },
        ])}
      />
      <GuideArticle guide={guide} dateLabel={formatGuideDate(guide.date, "en")} />
    </>
  );
}
