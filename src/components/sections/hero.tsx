"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n";

const PLAY_URL = "https://play.google.com/apps/testing/app.nuktah";

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[280px] md:w-[320px]">
      <div className="relative rounded-[3rem] border-[3px] border-gray-300 bg-white shadow-xl overflow-hidden aspect-[569/1251]">
        <img
          src="/screens/hero-scan.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

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
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-subtle border border-accent/15 text-accent-hover text-xs font-medium mb-8">
              {t("badge")}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-3xl">ن</span>
              </div>
              <div>
                <p className="text-4xl font-bold text-text-primary font-display">نقطة</p>
                <p className="text-sm text-text-secondary">Nuktah</p>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] mb-6 text-text-primary text-balance">
              {t("title")}
            </h1>

            <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-10 max-w-xl">
              {t("subtitle")}
            </p>

            <div className="flex flex-wrap items-center gap-4">
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

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <PhoneMockup />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
