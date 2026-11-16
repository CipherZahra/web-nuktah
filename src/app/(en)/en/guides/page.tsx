import type { Metadata } from "next";
import { getGuides, formatGuideDate } from "@/lib/guides";
import { GuidesList } from "@/components/pages/guides-index";
import enMessages from "../../../../../messages/en.json";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, canonical } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: `${enMessages.guides.title} — Nuktah`,
  ...canonical("/en/guides"),
  description: enMessages.guides.lead,
};

export default function Page() {
  const guides = getGuides("en").map(({ slug, title, excerpt, date }) => ({
    slug,
    title,
    excerpt,
    date,
  }));
  const dateLabels = Object.fromEntries(
    guides.map((g) => [g.slug, formatGuideDate(g.date, "en")])
  );
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd("en", [
          { name: enMessages.nav.home },
          { name: enMessages.guides.title, path: "/en/guides" },
        ])}
      />
      <GuidesList guides={guides} dateLabels={dateLabels} />
    </>
  );
}
