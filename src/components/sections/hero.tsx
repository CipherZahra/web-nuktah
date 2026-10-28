import { HeroCtaPair } from "@/components/sections/hero-cta-pair";
import { getMessages, type Locale } from "@/lib/messages";

/** Marketing hero. Server component — reads its own locale's copy directly. */
export function Hero({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const copy = messages.hero;
  const notice = messages.closedTestNotice;
  const isRTL = locale === "ar";
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-gradient-to-b from-accent/[0.03] via-transparent to-transparent"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-accent/3 rounded-full blur-[80px]" />
      </div>

      <div className="container-main relative z-10 w-full">
        <div
          data-reveal="up"
          className="max-w-3xl mx-auto text-center flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-subtle border border-accent/15 text-accent-hover text-xs font-medium mb-6">
            {copy.badge}
          </div>

          <div className="flex flex-col items-center gap-3 mb-8">
            <img
              src="/logo-160.webp"
              alt="نقطة"
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

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] mb-6 text-text-primary text-balance">
            {copy.title}{" "}
            {copy.titleAccent && (
              <span className="text-accent">{copy.titleAccent}</span>
            )}
          </h1>

          <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-10 max-w-xl">
            {copy.subtitle}
          </p>

          <HeroCtaPair
            primaryLabel={copy.ctaPrimary}
            secondaryLabel={copy.ctaSecondary}
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

        {/* Fanned device trio — three existing app screenshots over a soft
            emerald bloom (the Reel Motion hero treatment, brand colors kept).
            Side rotations swap per locale so the fan mirrors in RTL. */}
        <div data-reveal="up" className="relative mt-14 md:mt-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-[min(85%,540px)] rounded-full bg-accent/10 blur-[110px]"
          />
          <div className="relative flex items-end justify-center">
            <div
              className={`relative z-0 -me-6 md:-me-10 mb-10 h-44 md:h-56 w-24 md:w-32 shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-white shadow-lg ${
                isRTL ? "rotate-2" : "-rotate-2"
              }`}
            >
              <img
                src="/screens/phone_03.webp"
                alt=""
                className="h-full w-full object-cover object-top"
              />
            </div>

            <div className="relative z-10 w-36 sm:w-44 md:w-52 shrink-0 overflow-hidden rounded-[1.6rem] border border-border/60 bg-white shadow-2xl">
              <img src="/screens/phone_01.webp" alt="" className="block w-full" />
            </div>

            <div
              className={`relative z-0 -ms-6 md:-ms-10 mb-10 h-44 md:h-56 w-24 md:w-32 shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-white shadow-lg ${
                isRTL ? "-rotate-2" : "rotate-2"
              }`}
            >
              <img
                src="/screens/phone_06.webp"
                alt=""
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
