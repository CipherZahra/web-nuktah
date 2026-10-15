"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Check, ChevronDown, Sparkles } from "lucide-react";

import { PageHero } from "@/components/pages/page-hero";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n";
import { LoginModal } from "@/components/pages/login-modal";
import { TopUpModal } from "@/components/pages/topup-modal";
import { getValidSession, getUserProfile } from "@/lib/checkout";

type Plan = {
  name: string;
  credits: string;
  creditsUnit: string;
  price: string;
  priceUnit: string;
  tag: string;
};

type FaqItem = { q: string; a: string };

/** Server catalog order in supabase/functions/_shared/packages.ts. */
const PACKAGE_IDS = ["starter", "standard", "plus", "custom"];

export function PricingPage() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const plans = t.raw("plans") as Plan[];
  const chips = t.raw("chips") as string[];
  const faqItems = t.raw("faqItems") as FaqItem[];

  const [busyIdx, setBusyIdx] = useState<number | null>(null);
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [checkoutIdx, setCheckoutIdx] = useState<number | null>(null);
  const [payEmail, setPayEmail] = useState("");
  const [payError, setPayError] = useState(false);

  /**
   * Opens the shared TopUpModal (same as the account page) so the Chargily
   * hosted page always receives the payer prefill — a bare checkout opens
   * empty. Briefly busy while the session + email are resolved.
   */
  const openCheckout = async (idx: number) => {
    setPayError(false);
    setBusyIdx(idx);
    try {
      const session = await getValidSession();
      if (!session) {
        setBusyIdx(null);
        setModalIdx(idx);
        return;
      }
      const profile = await getUserProfile();
      setPayEmail(profile?.email ?? "");
      setBusyIdx(null);
      setCheckoutIdx(idx);
    } catch {
      setBusyIdx(null);
      setPayError(true);
    }
  };

  const handleBuy = (idx: number) => void openCheckout(idx);

  const pendingPlan = modalIdx !== null ? plans[modalIdx] : null;

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
              const busy = busyIdx === i;
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
                  <h3 className="font-bold text-lg text-text-primary mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-text-muted mb-4">{plan.tag}</p>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-4xl font-extrabold text-text-primary">
                      {plan.price}
                    </span>
                    <span className="text-sm text-text-secondary">
                      {plan.priceUnit}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mb-6">
                    {plan.credits} {plan.creditsUnit}
                  </p>
                  <div className="mt-auto">
                    <Button
                      className="w-full"
                      variant={featured ? "default" : "outline"}
                      disabled={busyIdx !== null}
                      onClick={() => void handleBuy(i)}
                    >
                      {busy ? t("login.working") : t("buy")}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <p
            role="alert"
            className="text-center text-sm text-red-600 mt-4 max-w-6xl mx-auto"
          >
            {payError ? t("err.payFail") : ""}
          </p>

          <div className="max-w-6xl mx-auto mt-8 rounded-2xl border border-accent/20 bg-accent-subtle p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-text-primary mb-1">
                {t("free.name")}
              </h3>
              <p className="text-sm text-text-secondary mb-1">
                {t("free.desc")}
              </p>
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
          <div className="space-y-3">
            {faqItems.map((item, idx) => (
              <details
                key={item.q}
                name="pricing-faq"
                open={idx === 0}
                className="group rounded-2xl border border-border/60 bg-white hover:border-accent/20 transition-colors duration-300"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-semibold text-text-primary">{item.q}</h3>
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
      </section>

      <LoginModal
        key={modalIdx ?? "closed"}
        open={modalIdx !== null}
        packName={pendingPlan?.name}
        packMeta={
          pendingPlan
            ? `${pendingPlan.credits} ${pendingPlan.creditsUnit} · ${pendingPlan.price} ${pendingPlan.priceUnit}`
            : undefined
        }
        onClose={() => setModalIdx(null)}
        onSuccess={() => {
          const idx = modalIdx;
          setModalIdx(null);
          if (idx !== null) void openCheckout(idx);
        }}
      />
      {checkoutIdx !== null && (
        <TopUpModal
          key={`topup-${checkoutIdx}`}
          open
          packageId={PACKAGE_IDS[checkoutIdx]}
          packName={plans[checkoutIdx]?.name ?? ""}
          packMeta={`${plans[checkoutIdx]?.credits} ${plans[checkoutIdx]?.creditsUnit} · ${plans[checkoutIdx]?.price} ${plans[checkoutIdx]?.priceUnit}`}
          locale={locale}
          email={payEmail}
          onClose={() => setCheckoutIdx(null)}
        />
      )}
    </>
  );
}
