const BASE = "https://nuktah.app";

export type SiteLang = "ar" | "en";

export function canonical(path: string): { alternates: { canonical: string } } {
  return { alternates: { canonical: `${BASE}${path}` } };
}

function homeUrl(lang: SiteLang): string {
  return lang === "ar" ? `${BASE}/` : `${BASE}/en/`;
}

export function websiteJsonLd(lang: SiteLang, description: string) {
  const name = lang === "ar" ? "نقطة" : "Nuktah";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name,
        url: homeUrl(lang),
        inLanguage: lang === "ar" ? "ar-DZ" : "en",
        description,
      },
      {
        "@type": "SoftwareApplication",
        name,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Android",
        url: homeUrl(lang),
        description,
        inLanguage: lang === "ar" ? "ar-DZ" : "en",
      },
    ],
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export function legalJsonLd(lang: SiteLang, title: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url: `${BASE}${path}`,
    dateModified: "2026-09-28",
    inLanguage: lang === "ar" ? "ar-DZ" : "en",
  };
}
