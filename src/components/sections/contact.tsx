"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n";

export function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <span className="text-xs font-semibold text-text-muted tracking-wider mb-4 block">
            {t("label")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-text-primary">
            {t("title")}
          </h2>
          <p className="text-text-secondary mb-10">{t("subtitle")}</p>

          <div className="rounded-2xl border border-accent/20 bg-accent-subtle p-8">
            <a
              href="mailto:support@nuktah.app"
              className="inline-flex items-center gap-3 text-lg font-semibold text-text-primary hover:text-accent-hover transition-colors duration-200 mb-6"
            >
              <span className="w-11 h-11 rounded-xl bg-accent text-white flex items-center justify-center shadow-glow">
                <Mail size={20} />
              </span>
              {t("emailValue")}
            </a>
            <div>
              <Button variant="outline" asChild>
                <Link href="/support">{t("supportLink")}</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
