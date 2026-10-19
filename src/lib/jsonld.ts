const BASE = "https://nuktah.app";

export type SiteLang = "ar" | "en";

/**
 * Canonical + hreflang alternates for a route.
 *
 * Callers pass the route as they see it: `/pricing` from the (ar) tree or
 * `/en/pricing` from the (en) tree. Both language versions are derived here
 * so every page (20+) advertises the pair, plus `x-default` → Arabic (the
 * default locale with `localePrefix: "as-needed"`).
 */
export function canonical(path: string): {
  alternates: { canonical: string; languages: Record<string, string> };
} {
  const isEn = path === "/en" || path.startsWith("/en/");
  const arPath = isEn ? (path === "/en" ? "/" : path.slice(3)) : path;
  const enPath = isEn ? path : path === "/" ? "/en" : `/en${path}`;
  return {
    alternates: {
      canonical: `${BASE}${path}`,
      languages: {
        ar: `${BASE}${arPath}`,
        en: `${BASE}${enPath}`,
        "x-default": `${BASE}${arPath}`,
      },
    },
  };
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

// Single ISO source for the legal pages' "last updated". Keep in sync with
// `legal.updated` in messages/{ar,en}.json (which renders the human string).
const LEGAL_UPDATED_ISO = "2026-10-13";

export function legalJsonLd(lang: SiteLang, title: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url: `${BASE}${path}`,
    dateModified: LEGAL_UPDATED_ISO,
    inLanguage: lang === "ar" ? "ar-DZ" : "en",
  };
}
