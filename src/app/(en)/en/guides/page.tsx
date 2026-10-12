import type { Metadata } from "next";
import { getGuides, formatGuideDate } from "@/lib/guides";
import { GuidesList } from "@/components/pages/guides-index";
import enMessages from "../../../../../messages/en.json";
import { canonical } from "@/lib/jsonld";

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
  return <GuidesList guides={guides} dateLabels={dateLabels} />;
}
