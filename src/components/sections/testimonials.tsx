"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";

export function Testimonials() {
  const t = useTranslations("testimonials");

  const items = [
    { quote: t("quote1"), role: t("role1"), location: t("location1") },
    { quote: t("quote2"), role: t("role2"), location: t("location2") },
    { quote: t("quote3"), role: t("role3"), location: t("location3") },
  ];

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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-600 text-xs mt-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            {t("demoBadge")}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl bg-white border border-border/60 p-6 md:p-8 hover:shadow-md hover:border-accent/20 transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-accent/20 mb-4" />
              <p className="text-text-secondary leading-relaxed text-sm mb-6">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="border-t border-border/40 pt-4">
                <div className="font-medium text-sm text-text-primary">{t("name")}</div>
                <div className="text-xs text-text-muted mt-0.5">
                  {item.role}، {item.location}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
