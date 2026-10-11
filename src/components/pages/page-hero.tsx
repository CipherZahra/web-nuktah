"use client";

import { useTranslations } from "next-intl";

export function PageHero({ ns }: { ns: string }) {
  const t = useTranslations(ns);

  return (
    <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-white border-b border-border-subtle">
      <div className="container-main max-w-3xl mx-auto text-center">
        <span className="text-xs font-semibold text-text-muted tracking-wider mb-4 block">
          {t("title")}
        </span>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-text-primary">
          {t("h1")}
        </h1>
        <p className="text-text-secondary text-lg leading-relaxed">{t("lead")}</p>
      </div>
    </section>
  );
}
