"use client";

import { useTranslations } from "next-intl";
import { ChevronDown, Mail } from "lucide-react";
import { PageHero } from "@/components/pages/page-hero";

type FaqItem = { cat: string; q: string; a: string };
type Topics = { basics: string; scanning: string; billing: string; account: string };

const topicOrder = ["basics", "scanning", "billing", "account"] as const;

export function FaqPage() {
  const t = useTranslations("faqPage");
  const items = t.raw("items") as FaqItem[];
  const topics = t.raw("topics") as Topics;

  return (
    <>
      <PageHero ns="faqPage" />

      <section className="py-16 md:py-24">
        <div className="container-main max-w-3xl mx-auto">
          {topicOrder.map((topic, topicIdx) => {
            const topicItems = items.filter((item) => item.cat === topic);
            if (topicItems.length === 0) return null;
            return (
              <div key={topic} className="mb-14 last:mb-0">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-6 text-text-primary flex items-center gap-3">
                  <span className="w-1.5 h-6 rounded-full bg-accent shrink-0" />
                  {topics[topic]}
                </h2>
                <div className="space-y-3">
                  {topicItems.map((item, itemIdx) => (
                    <details
                      key={item.q}
                      name="faq-page"
                      open={topicIdx === 0 && itemIdx === 0}
                      className="group rounded-2xl border border-border/60 bg-white hover:border-accent/20 transition-colors duration-300"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden">
                        <h3 className="font-semibold text-text-primary">
                          {item.q}
                        </h3>
                        <ChevronDown
                          size={16}
                          className="shrink-0 text-text-muted transition-transform duration-300 group-open:rotate-180"
                        />
                      </summary>
                      <p className="px-6 pb-5 text-sm text-text-secondary leading-relaxed">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="rounded-2xl border border-accent/20 bg-accent-subtle p-8 text-center mt-4">
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
        </div>
      </section>
    </>
  );
}
