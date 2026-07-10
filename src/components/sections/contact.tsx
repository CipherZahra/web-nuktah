"use client";

import { motion } from "framer-motion";
import { Mail, Globe, Code, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const contactItems = [
  { icon: Mail, href: "mailto:support@nuktah.app", key: "emailValue" },
  { icon: Globe, href: "#", key: "facebook" },
  { icon: Code, href: "#", key: "github" },
];

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
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-text-muted tracking-wider mb-4 block">
              {t("label")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-text-primary">
              {t("title")}
            </h2>
            <p className="text-text-secondary">{t("subtitle")}</p>
          </div>

          <div className="flex items-center justify-center gap-3 mb-10">
            {contactItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.key}
                  href={item.href}
                  aria-label={item.key}
                  className="w-12 h-12 rounded-xl bg-accent-subtle border border-accent/10 flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/30 hover:bg-accent/10 transition-all duration-200"
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={t("namePlaceholder")}
                className="w-full h-12 px-4 rounded-xl bg-white border border-border/60 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all duration-200"
              />
              <input
                type="email"
                placeholder={t("emailPlaceholder")}
                className="w-full h-12 px-4 rounded-xl bg-white border border-border/60 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all duration-200"
              />
            </div>
            <textarea
              rows={4}
              placeholder={t("messagePlaceholder")}
              className="w-full resize-none px-4 py-3 rounded-xl bg-white border border-border/60 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all duration-200"
            />
            <Button type="submit" className="w-full">
              <Send className="ml-2 h-4 w-4" />
              {t("submit")}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
