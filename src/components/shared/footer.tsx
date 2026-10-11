"use client";

import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { Link } from "@/i18n";

export function Footer() {
  const t = useTranslations("footer");

  const links = [
    { label: t("home"), href: "/" },
    { label: t("pricing"), href: "/pricing" },
    { label: t("faq"), href: "/faq" },
    { label: t("guides"), href: "/guides" },
    { label: t("support"), href: "/support" },
    { label: t("download"), href: "/download" },
    { label: t("privacy"), href: "/privacy" },
    { label: t("terms"), href: "/terms" },
    { label: t("deleteAccount"), href: "/delete" },
  ];

  return (
    <footer className="border-t border-border-subtle bg-white">
      <div className="container-main py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-3 group">
              <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-glow transition-shadow duration-300">
                <span className="text-white font-bold text-sm">ن</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-text-primary">نقطة</span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs mb-4">
              {t("tagline")}
            </p>
            <p className="text-xs text-text-muted">
              {t("developedBy")}{" "}
              <a
                href="https://github.com/CipherZahra"
                className="text-accent hover:text-accent-hover transition-colors duration-200 font-medium"
                rel="noopener noreferrer"
                target="_blank"
              >
                {t("bayan")}
              </a>
            </p>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-xs font-semibold text-text-muted tracking-wider mb-4">
              {t("linksHeading")}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-xs font-semibold text-text-muted tracking-wider mb-4">
              {t("followHeading")}
            </h4>
            <div className="flex items-center gap-3">
              <Link
                href="/support"
                aria-label={t("support")}
                className="w-10 h-10 rounded-xl bg-accent-subtle border border-accent/10 flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all duration-200"
              >
                <Mail size={18} />
              </Link>
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
