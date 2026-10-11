"use client";

import { useTranslations } from "next-intl";
import { Mail, LifeBuoy, BookOpen, Wrench } from "lucide-react";
import { PageHero } from "@/components/pages/page-hero";
import { Link } from "@/i18n";

type Trouble = { q: string; a: string };

export function SupportPage() {
  const t = useTranslations("support");
  const troubles = t.raw("troubles") as Trouble[];

  return (
    <>
      <PageHero ns="support" />

      <section className="py-16 md:py-24">
        <div className="container-main max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-8 text-text-primary">
            {t("selfServeTitle")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="rounded-2xl border border-border/60 bg-white p-6 hover:border-accent/20 transition-colors duration-300">
              <div className="w-10 h-10 rounded-xl bg-accent-subtle flex items-center justify-center text-accent mb-4">
                <LifeBuoy size={20} />
              </div>
              <h3 className="font-bold text-text-primary mb-2">{t("faqTitle")}</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">{t("faqText")}</p>
              <Link href="/faq" className="text-sm font-medium text-accent hover:text-accent-hover transition-colors duration-200">
                {t("faqCta")} →
              </Link>
            </div>
            <div className="rounded-2xl border border-border/60 bg-white p-6 hover:border-accent/20 transition-colors duration-300">
              <div className="w-10 h-10 rounded-xl bg-accent-subtle flex items-center justify-center text-accent mb-4">
                <BookOpen size={20} />
              </div>
              <h3 className="font-bold text-text-primary mb-2">{t("guidesTitle")}</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">{t("guidesText")}</p>
              <Link href="/guides" className="text-sm font-medium text-accent hover:text-accent-hover transition-colors duration-200">
                {t("guidesCta")} →
              </Link>
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-2 text-text-primary flex items-center gap-3">
            <Wrench size={20} className="text-accent" />
            {t("troublesTitle")}
          </h2>
          <p className="text-sm text-text-muted mb-8">{t("troublesHint")}</p>
          <div className="space-y-6 mb-16">
            {troubles.map((item) => (
              <div key={item.q} className="rounded-2xl border border-border/60 bg-white p-6">
                <h3 className="font-semibold text-text-primary mb-2">{item.q}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-accent/20 bg-accent-subtle p-8 text-center">
            <h2 className="text-xl font-bold text-text-primary mb-2">{t("contactTitle")}</h2>
            <p className="text-sm text-text-secondary mb-5">{t("contactLead")}</p>
            <a
              href="mailto:support@nuktah.app"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-medium text-sm hover:bg-accent-hover transition-colors duration-200"
            >
              <Mail size={16} />
              {t("contactButton")}
            </a>
          </div>

          <div className="mt-12">
            <h3 className="text-sm font-semibold text-text-muted tracking-wider mb-4">
              {t("linksTitle")}
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link href="/privacy" className="px-4 py-2 rounded-lg border border-border/60 bg-white text-sm text-text-secondary hover:border-accent/30 hover:text-accent transition-all duration-200">
                {t("linkPrivacy")}
              </Link>
              <Link href="/terms" className="px-4 py-2 rounded-lg border border-border/60 bg-white text-sm text-text-secondary hover:border-accent/30 hover:text-accent transition-all duration-200">
                {t("linkTerms")}
              </Link>
              <Link href="/delete" className="px-4 py-2 rounded-lg border border-border/60 bg-white text-sm text-text-secondary hover:border-accent/30 hover:text-accent transition-all duration-200">
                {t("linkDelete")}
              </Link>
              <Link href="/pricing" className="px-4 py-2 rounded-lg border border-border/60 bg-white text-sm text-text-secondary hover:border-accent/30 hover:text-accent transition-all duration-200">
                {t("linkPricing")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
