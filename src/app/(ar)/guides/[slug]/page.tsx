import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuide, getGuides, formatGuideDate } from "@/lib/guides";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, canonical } from "@/lib/jsonld";
import { GuideArticle } from "@/components/pages/guide-article";
import arMessages from "../../../../../messages/ar.json";

export function generateStaticParams() {
  return getGuides("ar").map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide("ar", slug);
  if (!guide) return {};
  return { title: `${guide.title} — نقطة`, description: guide.excerpt, ...canonical(`/guides/${slug}`) };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide("ar", slug);
  if (!guide) notFound();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd("ar", [
          { name: arMessages.nav.home },
          { name: arMessages.guides.title, path: "/guides" },
          { name: guide.title },
        ])}
      />
      <GuideArticle guide={guide} dateLabel={formatGuideDate(guide.date, "ar")} />
    </>
  );
}
