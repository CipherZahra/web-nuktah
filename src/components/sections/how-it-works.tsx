"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

const steps = [
  { key: "step1", icon: "01" },
  { key: "step2", icon: "02" },
  { key: "step3", icon: "03" },
  { key: "step4", icon: "04" },
  { key: "step5", icon: "05" },
];

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-white">
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

        <div className="max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative flex items-start gap-6 pb-8 last:pb-0"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shadow-glow shrink-0">
                  <span className="text-white font-bold text-sm">{step.icon}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 w-px bg-border my-2" />
                )}
              </div>
              <div className="pt-2.5">
                <h3 className="font-bold text-lg mb-1 text-text-primary">
                  {t(`${step.key}`)}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {t(`${step.key}Desc`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
