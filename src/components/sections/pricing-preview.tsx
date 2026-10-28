import { Sparkles, SlidersHorizontal, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMessages, type Locale } from "@/lib/messages";
import { PACKAGE_IDS } from "@/lib/config";

/**
 * Compact pay-as-you-go preview for the homepage: the four packs with the
 * "Most chosen" badge on index 1 (same convention as the pricing page), and
 * one CTA into /pricing. No checkout here — cards are display-only.
 *
 * Server component — locale comes in from the page; the CTA is a plain
 * locale-resolved <a> (next-intl's Link would force these pages dynamic).
 */
export function PricingPreview({ locale }: { locale: Locale }) {
  const copy = getMessages(locale).pricing;
  const isRTL = locale === "ar";
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const pricingHref = locale === "en" ? "/en/pricing" : "/pricing";

  return (
    <section id="pricing-preview" className="py-24 md:py-32">
      <div className="container-main">
        <div data-reveal="up" className="text-center mb-16">
          <span className="text-xs font-semibold text-text-muted tracking-wider mb-4 block">
            {copy.title}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-text-primary">
            {copy.h1}
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">{copy.lead}</p>
        </div>

        <div data-reveal-group className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {copy.plans.map((plan: { name: string; credits: string; creditsUnit: string; price: string; priceUnit: string; tag: string }, i: number) => {
            const featured = i === 1;
            const isCustom = PACKAGE_IDS[i] === "custom";
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
                    {copy.featuredBadge}
                  </span>
                )}
                <h3 className="font-bold text-lg text-text-primary mb-1">{plan.name}</h3>
                <p className="text-sm text-text-muted mb-4">{plan.tag}</p>
                {isCustom ? (
                  <div className="flex items-center gap-1.5 mb-1">
                    <SlidersHorizontal size={26} className="text-accent shrink-0" />
                    <span className="text-3xl font-extrabold text-accent">{copy.youChoose}</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-4xl font-extrabold text-text-primary">{plan.price}</span>
                    <span className="text-sm text-text-secondary">{plan.priceUnit}</span>
                  </div>
                )}
                <p className="text-sm text-text-secondary">
                  {plan.credits} {plan.creditsUnit}
                </p>
              </div>
            );
          })}
        </div>

        <div data-reveal="up" className="mt-12 text-center">
          <Button size="lg" asChild>
            <a href={pricingHref}>
              {copy.previewCta}
              <Arrow className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
