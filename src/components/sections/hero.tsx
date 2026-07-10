"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[280px] md:w-[320px]">
      <div className="relative rounded-[3rem] border-[3px] border-gray-300 bg-white shadow-xl overflow-hidden aspect-[9/19]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-6 bg-gray-300 rounded-b-2xl z-10" />
        <div className="pt-8 pb-4 px-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-accent text-[10px] font-bold">ن</span>
            </div>
            <div className="text-[10px] text-text-muted font-medium">القسم 3أ</div>
          </div>

          <div className="text-center mb-4">
            <div className="text-[10px] text-text-muted mb-0.5">امتحان الرياضيات</div>
            <div className="text-lg font-bold text-accent">14.6</div>
            <div className="text-[9px] text-text-muted">المعدل العام</div>
          </div>

          <div className="flex-1 space-y-1.5">
            {[
              { name: "سارة", grade: "18", pct: 90 },
              { name: "محمد", grade: "16", pct: 80 },
              { name: "أحمد", grade: "15", pct: 75 },
              { name: "فاطمة", grade: "19", pct: 95 },
              { name: "يوسف", grade: "12", pct: 60 },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="text-[10px] text-text-secondary w-10">{s.name}</div>
                <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-accent/50" style={{ width: `${s.pct}%` }} />
                </div>
                <div className="text-[10px] font-semibold text-text-primary w-4 text-center">{s.grade}</div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            <div className="text-[9px] text-text-muted">إجمالي الطلاب</div>
            <div className="text-xs font-bold">30</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const t = useTranslations("hero");

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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-subtle border border-accent/15 text-accent text-xs font-medium mb-8">
              {t("badge")}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-3xl">ن</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-text-primary">نقطة</h1>
                <p className="text-sm text-text-secondary">Nuktah</p>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] mb-6 text-text-primary">
              {t("title")}
            </h2>

            <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-10 max-w-xl">
              {t("subtitle")}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button size="xl" asChild>
                <a href="#download">
                  {t("ctaPrimary")}
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <a href="#features">
                  <Play className="ml-2 h-5 w-5" />
                  {t("ctaSecondary")}
                </a>
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
