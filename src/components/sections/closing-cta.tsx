import { HeroCtaPair } from "@/components/sections/hero-cta-pair";
import { getMessages, type Locale } from "@/lib/messages";

/** Closing CTA band. Server component — locale comes in as copy from the page. */
export function ClosingCta({ locale }: { locale: Locale }) {
  const copy = getMessages(locale).closingCta;
  const isRTL = locale === "ar";
  return (
    <section className="py-20 md:py-24 bg-accent-subtle border-y border-accent/10">
      <div className="container-main">
        <div data-reveal="up" className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-4 text-balance">
            {copy.title}
          </h2>
          <p className="text-text-secondary leading-relaxed mb-8">{copy.lead}</p>
          <HeroCtaPair
            primaryLabel={copy.ctaPlay}
            secondaryLabel={copy.ctaPricing}
            isRTL={isRTL}
            pricingHref={locale === "en" ? "/en/pricing" : "/pricing"}
          />
        </div>
      </div>
    </section>
  );
}
