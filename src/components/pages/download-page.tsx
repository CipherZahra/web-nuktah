"use client";

import { useLocale, useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { PageHero } from "@/components/pages/page-hero";
import { Button } from "@/components/ui/button";
import { PLAY_URL } from "@/lib/config";
import { Link } from "@/i18n";

export function DownloadPage() {
  const t = useTranslations("downloadPage");
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
                  <img
                    src="/qr-play.png"
                    alt={t("qrAlt")}
                    className="w-56 h-56 md:w-64 md:h-64 rounded-2xl border-2 border-accent/25 bg-white p-3 shadow-glow"
                  />
                  <span className="text-sm font-medium text-accent-hover text-center">
                    {t("qrCaption")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
