"use client";

import { useTranslations } from "next-intl";

export type LegalKind = "privacy" | "terms" | "delete";

export function LegalPage({ kind }: { kind: LegalKind }) {
  const t = useTranslations(`legal.${kind}`);

  return (
    <>
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-white border-b border-border-subtle">
        <div className="container-main max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold text-text-muted tracking-wider mb-4 block">
            {t("title")}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary">
            {t("title")}
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-main max-w-2xl mx-auto">
          <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center">
            <p className="text-sm text-text-secondary leading-relaxed">{t("stub")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
