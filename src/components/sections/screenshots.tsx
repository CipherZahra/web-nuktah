"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

const shots = [
  { src: "/screens/phone_01.png", key: "home" },
  { src: "/screens/phone_02.png", key: "import" },
  { src: "/screens/phone_03.png", key: "scan" },
  { src: "/screens/phone_04.png", key: "reading" },
  { src: "/screens/phone_05.png", key: "manual" },
  { src: "/screens/phone_06.png", key: "gradebook" },
  { src: "/screens/phone_07.png", key: "analytics" },
  { src: "/screens/phone_08.png", key: "sharing" },
];

export function Screenshots() {
  const [current, setCurrent] = useState(0);
  const t = useTranslations("screenshots");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  const next = () => setCurrent((c) => (c + 1) % shots.length);
  const prev = () => setCurrent((c) => (c - 1 + shots.length) % shots.length);

  return (
    <section className="py-24 md:py-32">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-text-muted tracking-wider mb-4 block">
            {t("label")}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-text-primary">
            {t("title")}
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="relative max-w-sm mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-white border border-border/60 shadow-xl aspect-[9/16]">
            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                src={shots[current].src}
                alt={`${t("label")} — ${t(shots[current].key)}`}
                initial={{ opacity: 0, x: isRTL ? -40 : 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? 40 : -40 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center hover:border-accent/50 hover:bg-accent-subtle transition-all duration-200 text-text-secondary hover:text-accent"
              aria-label={t("prev")}
            >
              <PrevIcon size={18} />
            </button>

            <div className="flex items-center gap-2">
              {shots.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? "bg-accent w-6" : "bg-border hover:bg-text-muted w-2"
                  }`}
                  aria-label={`${t("goTo")} ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center hover:border-accent/50 hover:bg-accent-subtle transition-all duration-200 text-text-secondary hover:text-accent"
              aria-label={t("next")}
            >
              <NextIcon size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
