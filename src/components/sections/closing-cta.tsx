"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n";

const PLAY_URL = "https://play.google.com/apps/testing/app.nuktah";

export function ClosingCta() {
  const t = useTranslations("closingCta");
  const locale = useLocale();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <section className="py-20 md:py-24 bg-accent-subtle border-y border-accent/10">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-4 text-balance">
            {t("title")}
          </h2>
          <p className="text-text-secondary leading-relaxed mb-8">
            {t("lead")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="xl" asChild>
              <a href={PLAY_URL} target="_blank" rel="noopener noreferrer">
                <Play className="h-5 w-5" />
                {t("ctaPlay")}
              </a>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">
                {t("ctaPricing")}
                <Arrow className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
