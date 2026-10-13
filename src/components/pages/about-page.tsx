"use client";

import { useTranslations } from "next-intl";
import { Camera, ScanLine, Check, FileText, Play } from "lucide-react";
import { PageHero } from "@/components/pages/page-hero";

const PLAY_URL = "https://play.google.com/apps/testing/app.nuktah";
const BUILT_ICONS = [Camera, ScanLine, Check, FileText];

export function AboutPage() {
  const t = useTranslations("about");
  const tDl = useTranslations("download");
  const builtItems = t.raw("builtItems") as string[];

  return (
    <>
      <PageHero ns="about" />

      <section className="py-16 md:py-24">
        <div className="container-main max-w-3xl mx-auto">
          <div className="space-y-6 text-text-secondary leading-relaxed text-base md:text-lg">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
          </div>

          <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-16 mb-8 text-text-primary">
            {t("builtTitle")}
          </h2>
          <div className="space-y-4">
            {builtItems.map((item, i) => {
              const Icon = BUILT_ICONS[i];
              return (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-2xl border border-border/60 bg-white p-5"
                >
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-accent-subtle flex items-center justify-center text-accent">
                    <Icon size={18} />
                  </div>
                  <p className="text-sm md:text-base text-text-secondary leading-relaxed pt-2">
                    {item}
                  </p>
                </div>
              );
            })}
          </div>

          <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-16 mb-4 text-text-primary">
            {t("missionTitle")}
          </h2>
          <p className="text-base md:text-lg text-text-secondary leading-relaxed">
            {t("missionBody")}
          </p>
        </div>
      </section>

      <section className="bg-accent">
        <div className="container-main max-w-3xl mx-auto py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-white text-balance">
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
