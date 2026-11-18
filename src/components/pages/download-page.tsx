"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Check, Gift, ShieldCheck, Zap } from "lucide-react";

import { PhoneMockup } from "@/components/sections/phone-mockup";
import { Button } from "@/components/ui/button";
import { PLAY_URL } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n";

/** Benefit row icons — one per `downloadPage.benefits` entry, in order. */
const BENEFIT_ICONS = [ShieldCheck, Zap, Gift];

export function DownloadPage() {
  const t = useTranslations("downloadPage");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const badge = isRTL ? "/badges/play-ar.png" : "/badges/play-en.png";
  const benefits = t.raw("benefits") as { title: string; desc: string }[];

  // Landing here is itself a funnel step (spec: download_visit).
  useEffect(() => {
    trackEvent("download_visit");
  }, []);

  /* Product visual: the real app home screen in the shared device frame,
     lifted off the white band by a mint halo (the "subtle shadow"). */
  const phone = (
    <div
      data-reveal="up"
      className={cn(
        "relative flex justify-center",
        // RTL DOM order puts the download block first (reading start), so on
        // mobile the phone is reordered ahead of it — spec'd stack is
        // heading → phone → badge/QR. Back to DOM order from md up.
        isRTL && "order-first md:order-none",
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 -inset-y-10 rounded-[50%] bg-accent-light/50 blur-3xl"
      />
      <PhoneMockup
        imageSrc="/screens/light_home.webp"
        imageAlt={t("mockupAlt")}
        priority
        className="relative w-52 md:w-64"
      />
    </div>
  );

  /* The conversion block: availability line → official badge → real QR →
     secondary pricing action. Centred on mobile, start-aligned on desktop. */
  const download = (
    <div
      data-reveal="up"
      className="flex flex-col items-center text-center md:items-start md:text-start"
    >
      <p className="text-sm font-semibold text-accent-hover mb-5">
        {t("availableNow")}
      </p>

      {/* Official Play badge, linked to the real listing. Biggest element
          in the column and the only thing wearing a hover lift. */}
      <a
        href={PLAY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-block rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <Image
          src={badge}
          alt={t("playButton")}
          width={646}
          height={250}
          priority
          className="h-24 md:h-28 w-auto"
        />
      </a>

      {/* Real QR (encodes PLAY_URL) in its own card. Shown on mobile too —
          the spec's mobile stack lists it below the button. */}
      <div className="mt-7 w-full max-w-xs rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
        <a
          href={PLAY_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("qr_click")}
          className="mx-auto block w-fit rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <Image
            src="/qr-play.png"
            alt={t("qrAlt")}
            width={740}
            height={740}
            loading="lazy"
            className="w-36 h-36 md:w-40 md:h-40 rounded-xl"
          />
        </a>
        <p className="mt-3 text-sm font-medium text-accent-hover text-center">
          {t("qrCaption")}
        </p>
      </div>

      {/* Secondary action — green outline, never a competing solid CTA. */}
      <Button
        asChild
        variant="outline"
        className="mt-6 gap-2 rounded-2xl border-accent/40 bg-white px-6 font-semibold text-accent hover:border-accent hover:bg-accent-subtle hover:text-accent-hover"
      >
        <Link href="/pricing">
          {t("ctaPricing")}
          <ArrowIcon size={16} aria-hidden="true" />
        </Link>
      </Button>
    </div>
  );

  return (
    <>
      {/* Hero band: heading + two-column download composition. */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-24 bg-white border-b border-border-subtle">
        <div className="container-main max-w-5xl mx-auto">
          <div data-reveal="up" className="max-w-2xl mx-auto text-center">
            <span className="text-xs font-semibold text-text-muted tracking-wider mb-4 block">
              {t("title")}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-text-primary text-balance">
              {t("h1")}
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed">
              {t("heroLead")}
            </p>
          </div>

          {/* Phone on the visual left, download block on the right, in both
              locales — RTL flips DOM order, EN keeps it. */}
          <div className="mt-12 grid gap-10 md:grid-cols-2 md:items-center">
            {isRTL ? download : phone}
            {isRTL ? phone : download}
          </div>

          {/* Three benefits, staggered in with the rest of the page. */}
          <div data-reveal-group className="mt-12 grid gap-4 sm:grid-cols-3">
            {benefits.map((benefit, i) => {
              const Icon = BENEFIT_ICONS[i] ?? ShieldCheck;
              return (
                <div
                  key={benefit.title}
                  className="flex items-start gap-3 rounded-2xl border border-border/60 bg-white p-5 shadow-xs"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-subtle text-accent">
                    <Icon size={20} strokeWidth={2.25} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-text-primary">
                      {benefit.title}
                    </p>
                    <p className="mt-0.5 text-sm text-text-secondary leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        {/* Requirements — checklist only, no competing CTA. */}
        <div className="container-main max-w-4xl mx-auto flex flex-col gap-8">
          <div className="rounded-2xl border border-border/60 bg-white p-8">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-6 text-text-primary">
              {t("needsTitle")}
            </h2>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {(t.raw("needsItems") as string[]).map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed"
                >
                  <Check size={16} className="text-accent shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Help — same card style as the section above. */}
          <div className="rounded-2xl border border-border/60 bg-white p-6 text-center">
            <p className="font-bold text-base text-text-primary mb-1">
              {t("joinHelpTitle")}
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              {t("joinHelpText")}{" "}
              <a
                href={`mailto:${t("joinHelpEmail")}`}
                dir="ltr"
                className="text-accent-hover font-medium underline underline-offset-2"
              >
                {t("joinHelpEmail")}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
