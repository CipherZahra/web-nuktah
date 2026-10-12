import type { Metadata } from "next";
import { getGuides, formatGuideDate } from "@/lib/guides";
import { GuidesList } from "@/components/pages/guides-index";
import arMessages from "../../../../messages/ar.json";
import { canonical } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: `${arMessages.guides.title} — نقطة`,
  ...canonical("/guides"),
  description: arMessages.guides.lead,
};

export default function Page() {
  const guides = getGuides("ar").map(({ slug, title, excerpt, date }) => ({
    slug,
    title,
    excerpt,
    date,
  }));
  const dateLabels = Object.fromEntries(
    guides.map((g) => [g.slug, formatGuideDate(g.date, "ar")])
  );
  return <GuidesList guides={guides} dateLabels={dateLabels} />;
}
