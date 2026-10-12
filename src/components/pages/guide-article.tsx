"use client";

import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, Calendar } from "lucide-react";
import type { Guide } from "@/lib/guides-md";
import { renderGuideBody } from "@/lib/guides-md";
import { Link } from "@/i18n";

export function GuideArticle({
  guide,
  dateLabel,
}: {
  guide: Guide;
  dateLabel: string;
}) {
  const t = useTranslations("guides");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <article className="pt-32 md:pt-40 pb-16 md:pb-24">
      <div className="container-main max-w-3xl mx-auto">
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent-hover hover:text-accent-hover transition-colors duration-200 mb-8"
        >
          <ArrowRight size={16} className={isRTL ? "" : "rotate-180"} />
          {t("back")}
        </Link>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-4 text-balance">
          {guide.title}
        </h1>
        <p className="flex items-center gap-2 text-sm text-text-muted mb-10">
          <Calendar size={14} />
          {t("updated")}: {dateLabel}
        </p>

        <div
          className="prose-nuktah text-text-secondary leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderGuideBody(guide.body) }}
        />
      </div>
    </article>
  );
}
