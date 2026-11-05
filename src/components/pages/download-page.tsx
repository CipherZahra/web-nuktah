"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { PageHero } from "@/components/pages/page-hero";
import { Button } from "@/components/ui/button";
import { PLAY_URL } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";
import { Link } from "@/i18n";

export function DownloadPage() {
  const t = useTranslations("downloadPage");
  const locale = useLocale();
  const badge = locale === "ar" ? "/badges/play-ar.png" : "/badges/play-en.png";

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
        <div className="container-main max-w-4xl mx-auto">
          <div className="rounded-2xl border border-accent/20 bg-accent-subtle p-8 md:p-10 text-center mb-14">
            <p className="text-xs font-semibold text-accent-hover mb-4">{t("betaNotice")}</p>
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
                className="h-14 md:h-16 w-auto mx-auto"
              />
            </a>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-6 text-text-primary">
                  {t("needsTitle")}
                </h2>
                <ul className="space-y-3 mb-8">
                  {(t.raw("needsItems") as string[]).map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                      <Check size={16} className="text-accent shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild>
                  <Link href="/pricing">{t("ctaPricing")}</Link>
                </Button>
              </div>
              <div className="flex justify-center">
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-accent/20 bg-accent-subtle px-8 py-6">
                  {/* Tappable on the phone it is scanned with, and counted. */}
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
                      className="w-56 h-56 md:w-64 md:h-64 rounded-2xl border-2 border-accent/25 bg-white p-3 shadow-glow"
                    />
                  </a>
                  <span className="text-sm font-medium text-accent-hover text-center">
                    {t("qrCaption")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* A closed Play test is multi-step: say so before it surprises anyone. */}
          <div className="mt-16 pt-12 border-t border-border-subtle">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-8 text-text-primary text-center">
              {t("joinTitle")}
            </h2>
            <ol className="grid md:grid-cols-3 gap-5">
              {joinSteps.map((step, i) => (
                <li
                  key={step.title}
                  className="rounded-2xl border border-border/60 bg-accent-subtle/40 p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 shrink-0 rounded-lg bg-accent text-white text-sm font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <h3 className="font-bold text-base text-text-primary">{step.title}</h3>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
                </li>
              ))}
            </ol>

            <div className="mt-8 rounded-2xl border border-border/60 p-6 text-center">
              <p className="font-bold text-base text-text-primary mb-1">{t("joinHelpTitle")}</p>
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
        </div>
      </section>
    </>
  );
}
