"use client";

import { useTranslations } from "next-intl";
import { Mail, Code, Globe } from "lucide-react";

const socialLinks = [
  { icon: Mail, href: "#contact", labelKey: "contact" },
  { icon: Globe, href: "#", labelKey: "facebook" },
  { icon: Code, href: "#", labelKey: "github" },
];

export function Footer() {
  const t = useTranslations("footer");

  const links = [
    { label: t("features"), href: "#features" },
    { label: t("howItWorks"), href: "#how-it-works" },
    { label: t("faq"), href: "#faq" },
    { label: t("download"), href: "#download" },
    { label: t("contact"), href: "#contact" },
    { label: t("privacy"), href: "#" },
    { label: t("terms"), href: "#" },
    { label: t("support"), href: "#contact" },
  ];

  return (
    <footer className="border-t border-border-subtle bg-white">
      <div className="container-main py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div className="md:col-span-1">
            <a href="#hero" className="flex items-center gap-3 mb-3 group">
              <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-glow transition-shadow duration-300">
                <span className="text-white font-bold text-sm">ن</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-text-primary">
                نقطة
              </span>
            </a>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs mb-4">
              {t("tagline")}
            </p>
            <p className="text-xs text-text-muted">
              {t("developedBy")}{" "}
              <a href="#" className="text-accent hover:text-accent-hover transition-colors duration-200 font-medium">
                {t("bayan")}
              </a>
            </p>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-xs font-semibold text-text-muted tracking-wider mb-4">
              الروابط
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-xs font-semibold text-text-muted tracking-wider mb-4">
              تابعنا
            </h4>
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.labelKey}
                    href={link.href}
                    aria-label={link.labelKey}
                    className="w-10 h-10 rounded-xl bg-accent-subtle border border-accent/10 flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all duration-200"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-border-subtle pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
