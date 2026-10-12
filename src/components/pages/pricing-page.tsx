"use client";

import { useTranslations } from "next-intl";
import { Check, Sparkles } from "lucide-react";
import { PageHero } from "@/components/pages/page-hero";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n";

type Plan = {
  name: string;
  credits: string;
  creditsUnit: string;
  price: string;
  priceUnit: string;
  tag: string;
};

type FaqItem = { q: string; a: string };

export function PricingPage() {
  const t = useTranslations("pricing");
  const plans = t.raw("plans") as Plan[];
  const chips = t.raw("chips") as string[];
  const faqItems = t.raw("faqItems") as FaqItem[];

  return (
    <>
      <PageHero ns="pricing" />

      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {chips.map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent-subtle border border-accent/10 text-sm font-medium text-accent-hover"
              >
                <Check size={14} />
                {chip}
              </span>
            ))}
          </div>

          <p className="text-center text-text-secondary max-w-2xl mx-auto mb-14">
            {t("metricLine")}
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {plans.map((plan, i) => {
              const featured = i === 1;
              return (
                <div
                  key={plan.name}
                  className={`rounded-2xl border bg-white p-6 flex flex-col transition-all duration-300 ${
                    featured
                      ? "border-accent/40 shadow-glow-lg relative"
                      : "border-border/60 hover:border-accent/20 hover:shadow-md"
                  }`}
                >
                  {featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-white text-xs font-semibold whitespace-nowrap">
                      <Sparkles size={12} />
                      {t("featuredBadge")}
                    </span>
                  )}
                  <h3 className="font-bold text-lg text-text-primary mb-1">{plan.name}</h3>
                  <p className="text-sm text-text-muted mb-4">{plan.tag}</p>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-4xl font-extrabold text-text-primary">
                      {plan.price}
                    </span>
                    <span className="text-sm text-text-secondary">{plan.priceUnit}</span>
                  </div>
                  <p className="text-sm text-text-secondary mb-6">
                    {plan.credits} {plan.creditsUnit}
                  </p>
                  <div className="mt-auto">
                    <Button className="w-full" variant={featured ? "default" : "outline"} asChild>
                      <Link href="/download">{t("buy")}</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="max-w-6xl mx-auto mt-8 rounded-2xl border border-accent/20 bg-accent-subtle p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-text-primary mb-1">{t("free.name")}</h3>
              <p className="text-sm text-text-secondary mb-1">{t("free.desc")}</p>
              <p className="text-xs text-text-muted">{t("free.stateNote")}</p>
            </div>
            <Button asChild className="shrink-0">
              <Link href="/download">{t("free.cta")}</Link>
            </Button>
          </div>

          <p className="text-center text-sm text-text-muted max-w-2xl mx-auto mt-10">
            {t("note")}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white border-y border-border-subtle">
        <div className="container-main max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-10 text-center text-text-primary">
            {t("faqTitle")}
          </h2>
          <div className="space-y-6">
            {faqItems.map((item) => (
              <div key={item.q}>
                <h3 className="font-semibold text-text-primary mb-2">{item.q}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
