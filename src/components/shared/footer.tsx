"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n";

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}

function IconYouTube() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.5a3.02 3.02 0 0 0-2.12-2.14C19.5 3.85 12 3.85 12 3.85s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.6 24 12 24 12s0-3.6-.5-5.5ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 0 1 0-5.18c.27 0 .52.04.76.12v-3.2a5.9 5.9 0 0 0-.76-.05A5.73 5.73 0 0 0 4.13 15.4a5.73 5.73 0 0 0 10.38 3.45V13.1a7.35 7.35 0 0 0 4.32 1.39V11.4a4.28 4.28 0 0 1-2.23-5.58Z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  const t = useTranslations("footer");

  const socials = [
    { label: "Facebook", href: "https://web.facebook.com/nuktah.apps", Icon: IconFacebook },
    { label: "YouTube", href: "https://www.youtube.com/@Nuktah-app", Icon: IconYouTube },
    { label: "TikTok", href: "https://www.tiktok.com/@nuktah.app", Icon: IconTikTok },
    { label: "Instagram", href: "https://www.instagram.com/nuktah.app/", Icon: IconInstagram },
  ];

  const links = [
    { label: t("home"), href: "/" },
    { label: t("pricing"), href: "/pricing" },
    { label: t("faq"), href: "/faq" },
    { label: t("guides"), href: "/guides" },
    { label: t("support"), href: "/support" },
    { label: t("about"), href: "/about" },
    { label: t("download"), href: "/download" },
    { label: t("privacy"), href: "/privacy" },
    { label: t("terms"), href: "/terms" },
  ];

  return (
    <footer className="border-t border-border-subtle bg-white">
      <div className="container-main py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-3 group">
              <img
                src="/logo.png"
                alt=""
                className="w-9 h-9 rounded-xl shadow-glow transition-shadow duration-300"
              />
              <span className="font-bold text-xl tracking-tight text-text-primary font-display">نقطة</span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs mb-4">
              {t("tagline")}
            </p>
            <p className="text-xs text-text-muted">
              {t("developedBy")}{" "}
              <a
                href="https://github.com/CipherZahra"
                className="text-accent-hover hover:text-emerald-800 transition-colors duration-200 font-medium"
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
                  className="text-sm text-text-secondary hover:text-accent-hover transition-colors duration-200"
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
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-accent-subtle border border-accent/10 flex items-center justify-center text-text-secondary hover:text-accent-hover hover:border-accent/30 hover:bg-accent/5 transition-all duration-200"
                >
                  <Icon />
                </a>
              ))}
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
