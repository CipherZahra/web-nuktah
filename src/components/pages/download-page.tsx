"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { PageHero } from "@/components/pages/page-hero";
import { PhoneMockup } from "@/components/sections/phone-mockup";
import { PLAY_URL } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";
import { Link } from "@/i18n";

export function DownloadPage() {
  const t = useTranslations("downloadPage");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const badge = isRTL ? "/badges/play-ar.png" : "/badges/play-en.png";

  // Landing here is itself a funnel step (spec: download_visit).
  useEffect(() => {
    trackEvent("download_visit");
  }, []);

  const joinSteps = [
    { title: t("joinStep1"), desc: t("joinStep1Desc") },
    { title: t("joinStep2"), desc: t("joinStep2Desc") },
    { title: t("joinStep3"), desc: t("joinStep3Desc") },
  ];

  return (
    <>
      <PageHero ns="downloadPage" />

      <section className="py-16 md:py-24">
        {/* Single column, one card style, one gap scale — no nested
            max-w wrappers or per-section margin ad-hods. */}
        <div className="container-main max-w-4xl mx-auto flex flex-col gap-8">
          {/* Download card: the page's primary action + first product
              visual. Availability line stays — it counters stale AI
              answers about the old closed test. */}
          <div className="rounded-2xl border border-accent/20 bg-accent-subtle p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col items-center text-center md:items-start md:text-start">
                <p className="text-sm font-semibold text-accent-hover mb-5">
                  {t("availableNow")}
                </p>
                <a
                  href={PLAY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-transform duration-200 hover:scale-[1.02]"
                >
                  <Image
                    src={badge}
                    alt={t("playButton")}
                    width={646}
                    height={250}
                    className="h-16 md:h-20 w-auto"
                  />
                </a>

                {/* QR is a desktop affordance only — on a phone the badge
                    is one tap away and a QR is dead weight. Tappable on
                    the phone it is scanned with, and counted. */}
                <div className="hidden md:flex mt-6 items-center gap-4">
                  <a
                    href={PLAY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("qr_click")}
                    className="block"
                  >
                    <Image
                      src="/qr-play.png"
                      alt={t("qrAlt")}
                      width={740}
                      height={740}
                      loading="lazy"
                      className="w-32 h-32 rounded-xl border-2 border-accent/25 bg-white p-2 shadow-glow"
                    />
                  </a>
                  <span className="text-sm font-medium text-accent-hover">
                    {t("qrCaption")}
                  </span>
                </div>

                {/* Pricing demoted from a competing solid button to a text
                    link — this page's job is installing, not browsing. */}
                <Link
                  href="/pricing"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-hover underline-offset-4 hover:underline"
                >
                  {t("ctaPricing")}
                  <ArrowIcon size={14} aria-hidden="true" />
                </Link>
              </div>

              <div className="flex justify-center">
                <PhoneMockup
                  imageSrc="/screens/dark_home.webp"
                  imageAlt={t("mockupAlt")}
                  className="w-44 md:w-56"
                />
              </div>
            </div>
          </div>

          {/* Requirements — checklist only, no competing CTA. */}
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

          {/* Install flow: open the listing → install → sign up. */}
          <div className="rounded-2xl border border-border/60 bg-white p-8">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-8 text-text-primary text-center">
              {t("joinTitle")}
            </h2>
            <ol className="grid md:grid-cols-3 gap-5">
              {joinSteps.map((step, i) => (
                <li
                  key={step.title}
                  className="rounded-xl border border-border/60 bg-accent-subtle/40 p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 shrink-0 rounded-lg bg-accent text-white text-sm font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <h3 className="font-bold text-base text-text-primary">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {step.desc}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Help — same card style as the sections above. */}
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
