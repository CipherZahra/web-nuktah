"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { PLAY_URL } from "@/lib/config";
import { Link } from "@/i18n";

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

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
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-3xl mx-auto text-center flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-subtle border border-accent/15 text-accent-hover text-xs font-medium mb-6">
            {t("badge")}
          </div>

          <div className="flex flex-col items-center gap-3 mb-8">
            <img
              src="/logo-160.webp"
              alt="نقطة"
              className="w-20 h-20 rounded-[1.4rem] shadow-glow"
            />
            <div className="text-center leading-tight">
              <span className="block text-2xl font-bold text-text-primary font-display">نقطة</span>
              <span className="block text-sm font-medium text-text-secondary">Nuktah</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] mb-6 text-text-primary text-balance">
            {t("title")}
          </h1>

          <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-10 max-w-xl">
            {t("subtitle")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="xl" asChild>
              <a href={PLAY_URL} target="_blank" rel="noopener noreferrer">
                <Play className="h-5 w-5" />
                {t("ctaPrimary")}
              </a>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">
                {t("ctaSecondary")}
                <Arrow className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
