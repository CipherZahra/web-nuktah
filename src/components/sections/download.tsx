"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function Download() {
  const t = useTranslations("download");

  return (
    <section id="download" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[160px]" />
      </div>

      <div className="container-main relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-6 shadow-glow-lg">
            <Smartphone className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-text-primary">
            {t("title")}
          </h2>
          <p className="text-lg text-text-secondary max-w-lg mx-auto mb-10">
            {t("subtitle")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="xl" asChild>
              <a href="#">
                {t("ctaApk")}
                <ArrowLeft className="mr-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="xl" variant="outline" disabled asChild>
              <a href="#" className="opacity-60 cursor-not-allowed">
                {t("ctaPlay")}
                <span className="mr-2 text-[10px] text-text-muted font-normal">
                  {t("ctaPlaySoon")}
                </span>
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
