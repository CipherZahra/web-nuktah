import type { MetadataRoute } from "next";
import { getGuides } from "@/lib/guides";

export const dynamic = "force-static";

const BASE = "https://nuktah.app";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: "monthly" | "yearly" }[] = [
  { path: "", priority: 1, changeFrequency: "monthly" },
  { path: "pricing", priority: 0.9, changeFrequency: "monthly" },
  { path: "download", priority: 0.9, changeFrequency: "monthly" },
  { path: "faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "support", priority: 0.7, changeFrequency: "monthly" },
  { path: "about", priority: 0.6, changeFrequency: "yearly" },
  { path: "guides", priority: 0.7, changeFrequency: "monthly" },
  { path: "privacy", priority: 0.6, changeFrequency: "yearly" },
  { path: "terms", priority: 0.6, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const lang of ["ar", "en"] as const) {
    const prefix = lang === "ar" ? "" : "/en";
    for (const route of STATIC_ROUTES) {
      const path = route.path ? `/${route.path}/` : "/";
      entries.push({
        url: `${BASE}${prefix}${path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    }
    for (const guide of getGuides(lang)) {
      entries.push({
        url: `${BASE}${prefix}/guides/${guide.slug}/`,
        lastModified: new Date(`${guide.date}T00:00:00`),
        changeFrequency: "yearly",
        priority: 0.6,
      });
    }
  }
  return entries;
}
