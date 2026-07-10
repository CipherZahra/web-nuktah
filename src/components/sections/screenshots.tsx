"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

const slides = [
  { key: "dashboard", gradient: "from-accent/10 via-emerald-500/5 to-transparent" },
  { key: "scan", gradient: "from-blue-500/10 via-accent/5 to-transparent" },
  { key: "manualEntry", gradient: "from-purple-500/10 via-accent/5 to-transparent" },
  { key: "reports", gradient: "from-orange-500/10 via-accent/5 to-transparent" },
  { key: "analytics", gradient: "from-cyan-500/10 via-accent/5 to-transparent" },
];

export function Screenshots() {
  const [current, setCurrent] = useState(0);
  const t = useTranslations("screenshots");

  const next = () => setCurrent((c) => (c + 1) % slides.length);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

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
          <div className="relative rounded-[3rem] border-[3px] border-gray-200 bg-white shadow-xl overflow-hidden aspect-[9/19] mx-auto">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-5 bg-gray-200 rounded-b-2xl z-10" />
            <div className="pt-7 pb-4 px-4 h-full flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.25 }}
                  className="flex-1 flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-bold text-accent">ن</span>
                    </div>
                    <h3 className="text-lg font-bold text-text-primary mb-2">
                      {t(slides[current].key)}
                    </h3>
                    <p className="text-xs text-text-secondary px-4 mt-2">
                      تجربة مستخدم سلسة وبسيطة
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center hover:border-accent/50 hover:bg-accent-subtle transition-all duration-200 text-text-secondary hover:text-accent"
              aria-label="السابق"
            >
              <ChevronRight size={18} />
            </button>

            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? "bg-accent w-6" : "bg-border hover:bg-text-muted w-2"
                  }`}
                  aria-label={`الانتقال إلى الشريحة ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center hover:border-accent/50 hover:bg-accent-subtle transition-all duration-200 text-text-secondary hover:text-accent"
              aria-label="التالي"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
