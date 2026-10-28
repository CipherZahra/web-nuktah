import { HeroCtaPair } from "@/components/sections/hero-cta-pair";
import { getMessages, type Locale } from "@/lib/messages";

/**
 * Closing CTA band: copy + CTA pair beside a scan-to-get-the-app QR card
 * (same asset as the download page). Grid order mirrors itself in RTL —
 * copy stays at the reading start, QR at the end.
 * Server component — locale comes in as copy from the page.
 */
export function ClosingCta({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const copy = messages.closingCta;
  const notice = messages.closedTestNotice;
  const isRTL = locale === "ar";
  return (
    <section className="py-20 md:py-24 bg-accent-subtle border-y border-accent/10">
      <div className="container-main">
        <div className="max-w-5xl mx-auto grid items-center gap-10 md:grid-cols-[1fr_auto]">
          <div data-reveal="up" className="text-center max-w-2xl mx-auto">
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
            <p className="mt-6 text-xs text-text-secondary">
              {notice.text}{" "}
              <a
                href={locale === "en" ? "/en/download" : "/download"}
                className="text-accent-hover font-medium underline underline-offset-2"
              >
                {notice.link}
              </a>
            </p>
          </div>

          <div data-reveal="up" className="justify-self-center">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-accent/20 bg-white px-6 py-5 shadow-glow">
              <img
                src="/qr-play.png"
                alt={copy.qrAlt}
                loading="lazy"
                className="h-36 w-36 rounded-xl border border-border/60 bg-white p-2 md:h-40 md:w-40"
              />
              <span className="text-xs font-medium text-accent-hover text-center">
                {copy.qrCaption}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
