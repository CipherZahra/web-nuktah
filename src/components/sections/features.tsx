"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Scan,
  PenLine,
  Users,
  BarChart3,
  TrendingUp,
  RefreshCw,
  FileDown,
  Cloud,
} from "lucide-react";

const features = [
  { icon: Scan, key: "ocr" },
  { icon: PenLine, key: "manual" },
  { icon: Users, key: "attendance" },
  { icon: BarChart3, key: "reports" },
  { icon: TrendingUp, key: "analytics" },
  { icon: RefreshCw, key: "sync" },
  { icon: FileDown, key: "export" },
  { icon: Cloud, key: "backup" },
];

export function Features() {
  const t = useTranslations("features");

  return (
    <section id="features" className="py-24 md:py-32">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group rounded-2xl bg-white border border-border/60 p-6 hover:border-accent/30 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-subtle border border-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/10 group-hover:border-accent/20 transition-all duration-300">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-base mb-2 text-text-primary">
                  {t(`${feature.key}`)}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {t(`${feature.key}Desc`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
