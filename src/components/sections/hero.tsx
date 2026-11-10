import Image from "next/image";
import { HeroCtaPair } from "@/components/sections/hero-cta-pair";
import { getMessages, type Locale } from "@/lib/messages";

/** Marketing hero. Server component — reads its own locale's copy directly. */
export function Hero({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const copy = messages.hero;
  const isRTL = locale === "ar";
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-gradient-to-b from-accent/[0.03] via-transparent to-transparent"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-accent/3 rounded-full blur-[80px]" />
      </div>

      <div className="container-main relative z-10 w-full">
        {/* Hero is above the fold: it must paint with the HTML, not after
            hydration. Hiding it behind the reveal animation left the nav logo
            as the LCP element and delayed the headline on slow connections. */}
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-subtle border border-accent/15 text-accent-hover text-xs font-medium mb-6">
            {copy.badge}
          </div>

          <div className="flex flex-col items-center gap-3 mb-8">
            {/* Same file the navbar preloads — eager here, cached there. */}
            <Image
              src="/logo-160.webp"
              alt=""
              width={160}
              height={160}
              loading="eager"
              className="w-20 h-20 rounded-[1.4rem] shadow-glow"
            />
            <div className="text-center leading-tight">
              <span className="block text-2xl font-bold text-text-primary font-display">
                نقطة
              </span>
              <span className="block text-sm font-medium text-text-secondary">
                Nuktah
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] mb-5 text-text-primary text-balance">
            {copy.title}
          </h1>

          {/* Softer than the H1: regular weight, muted colour, narrow measure
              (~65ch) so the line length stays readable. */}
          <p className="text-[15px] sm:text-lg md:text-xl text-text-secondary leading-relaxed mb-9 max-w-xl text-pretty">
            {copy.subtitle}
          </p>

          <HeroCtaPair
            primaryLabel={copy.ctaPrimary}
            secondaryLabel={copy.ctaSecondary}
            secondaryHref="#how-it-works"
            isRTL={isRTL}
            event="cta_join_hero"
          />
        </div>
      </div>
    </section>
  );
}
