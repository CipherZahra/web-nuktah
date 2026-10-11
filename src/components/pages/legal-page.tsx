import { getLegalHtml } from "@/lib/legal";
import type { LegalKind } from "@/lib/legal";
import { DeleteWizard } from "./delete-wizard";
import arMessages from "../../../messages/ar.json";
import enMessages from "../../../messages/en.json";

type LegalLang = "ar" | "en";

export function LegalPage({ kind, lang }: { kind: LegalKind; lang: LegalLang }) {
  const t = (lang === "ar" ? arMessages : enMessages).legal[kind];
  const updated = (lang === "ar" ? arMessages : enMessages).legal.updated;
  const html = getLegalHtml(kind, lang);

  return (
    <>
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-white border-b border-border-subtle">
        <div className="container-main max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary mb-5">
            {t.title}
          </h1>
          <p className="text-sm text-text-muted flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            <span>{updated}</span>
            <a href="mailto:support@nuktah.app" className="hover:text-accent transition-colors">
              support@nuktah.app
            </a>
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-main max-w-2xl mx-auto">
          <div
            className="prose-nuktah text-text-secondary leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          {kind === "delete" && <DeleteWizard />}
        </div>
      </section>
    </>
  );
}
