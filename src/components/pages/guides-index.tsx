"use client";

import { useTranslations } from "next-intl";
import { BookOpen } from "lucide-react";
import { PageHero } from "@/components/pages/page-hero";
import type { GuideSummary } from "@/lib/guides-md";
import { Link } from "@/i18n";

export function GuidesList({
  guides,
  dateLabels,
}: {
  guides: GuideSummary[];
  dateLabels: Record<string, string>;
}) {
  const t = useTranslations("guides");

  return (
    <>
      <PageHero ns="guides" />

      <section className="py-16 md:py-24">
        <div className="container-main max-w-3xl mx-auto">
          {guides.length === 0 ? (
            <p className="text-center text-text-secondary">{t("empty")}</p>
          ) : (
            <div className="space-y-6">
              {guides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="block rounded-2xl border border-border/60 bg-white p-6 md:p-8 hover:border-accent/30 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent-subtle flex items-center justify-center text-accent shrink-0 mt-0.5">
                      <BookOpen size={18} />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-bold text-lg text-text-primary mb-1 group-hover:text-accent-hover transition-colors duration-200">
                        {guide.title}
                      </h2>
                      <p className="text-sm text-text-secondary leading-relaxed mb-3">
                        {guide.excerpt}
                      </p>
                      <p className="text-xs text-text-muted">
                        {t("updated")}: {dateLabels[guide.slug]}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
