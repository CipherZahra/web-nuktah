"use client";

import { useLocale, useTranslations } from "next-intl";
import { Check, Play } from "lucide-react";
import { PageHero } from "@/components/pages/page-hero";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n";

const PLAY_URL = "https://play.google.com/apps/testing/app.nuktah";

export function DownloadPage() {
  const t = useTranslations("downloadPage");
  const tDl = useTranslations("download");
  const locale = useLocale();
  const badge = locale === "ar" ? "/badges/play-ar.png" : "/badges/play-en.png";

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
              <img src={badge} alt={t("playButton")} className="h-14 md:h-16 mx-auto" />
            </a>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-6 text-text-primary">
              {t("needsTitle")}
            </h2>
            <ul className="space-y-3 mb-10">
              {(t.raw("needsItems") as string[]).map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed text-start">
                  <Check size={16} className="text-accent shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-accent/20 bg-accent-subtle px-8 py-6">
                <img
                  src="/qr-play.png"
                  alt={t("qrAlt")}
                  className="w-64 h-64 md:w-72 md:h-72 rounded-2xl border-2 border-accent/25 bg-white p-3 shadow-glow"
                />
                <span className="text-sm font-medium text-accent-hover text-center">
                  {t("qrCaption")}
                </span>
              </div>
              <Button asChild>
                <Link href="/pricing">{t("ctaPricing")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-accent">
        <div className="container-main max-w-3xl mx-auto py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-white">
            {t("closingTitle")}
          </h2>
          <p className="text-white/85 mb-8">{t("closingLead")}</p>
          <a
            href={PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-white text-accent-hover font-medium text-sm shadow-md hover:bg-white/90 transition-colors duration-200"
          >
            <Play className="h-5 w-5" />
            {tDl("ctaPlay")}
          </a>
        </div>
      </section>
    </>
  );
}
