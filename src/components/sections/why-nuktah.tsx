"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Clock, CheckCircle, Smile, MapPin, Cpu } from "lucide-react";

const benefits = [
  { icon: Clock, key: "benefit1" },
  { icon: CheckCircle, key: "benefit2" },
  { icon: Smile, key: "benefit3" },
  { icon: MapPin, key: "benefit4" },
  { icon: Cpu, key: "benefit5" },
];

export function WhyNuktah() {
  const t = useTranslations("whyNuktah");

  return (
    <section className="py-24 md:py-32 bg-accent/[0.02] border-y border-border-subtle">
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

        <div className="grid md:grid-cols-5 gap-4">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="text-center group rounded-2xl bg-white border border-border/60 p-6 hover:border-accent/30 hover:shadow-md transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-accent-subtle border border-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/10 group-hover:border-accent/20 transition-all duration-300">
                  <Icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-bold text-sm mb-2 text-text-primary">
                  {t(`${benefit.key}`)}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {t(`${benefit.key}Desc`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
