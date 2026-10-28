"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { AccountMenu } from "@/components/shared/account-menu";
import { LangSwitch } from "@/components/shared/lang-switch";
import { Link } from "@/i18n";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", key: "home" },
  { href: "/pricing", key: "pricing" },
  { href: "/faq", key: "faq" },
  { href: "/support", key: "support" },
  { href: "/about", key: "about" },
  { href: "/guides", key: "guides" },
];

function useIsActive() {
  const pathname = usePathname();
  const stripped = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  return (href: string) =>
    href === "/" ? stripped === "/" : stripped === href || stripped.startsWith(`${href}/`);
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("nav");
  const isActive = useIsActive();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="nav-drop fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-all duration-300 md:px-6 md:pt-4">
      <div className="mx-auto max-w-6xl">
        <nav
          className={cn(
            "flex items-center justify-between gap-2 rounded-full border px-4 transition-all duration-300 md:px-5",
            scrolled
              ? "h-14 bg-white/90 backdrop-blur-xl border-border-subtle shadow-md"
              : "h-16 bg-white/50 backdrop-blur-md border-white/40"
          )}
        >
        <Link href="/" className="flex items-center gap-3 shrink-0 min-w-0 group">
          <img
            src="/logo-160.webp"
            alt=""
            className="w-9 h-9 rounded-xl shadow-glow transition-shadow duration-300"
          />
          <span className="font-bold text-xl tracking-tight text-text-primary font-display">نقطة</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "px-4 py-2 text-sm rounded-full whitespace-nowrap transition-all duration-200",
                isActive(link.href)
                  ? "text-text-primary font-semibold bg-accent-subtle"
                  : "text-text-secondary hover:text-text-primary hover:bg-accent-subtle"
              )}
            >
              {t(link.key)}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <LangSwitch />
          <AccountMenu
            fallback={
              <Button size="sm" asChild>
                <Link href="/download">{t("download")}</Link>
              </Button>
            }
          />
        </div>

        <div className="flex md:hidden items-center gap-2">
          <LangSwitch />
          <AccountMenu
            fallback={
              <Button size="sm" asChild>
                <Link href="/download">{t("download")}</Link>
              </Button>
            }
          />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-accent-subtle transition-all duration-200"
            aria-label={t("menuToggle")}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

        {mobileOpen && (
          <div className="mobile-menu md:hidden mt-2 overflow-hidden rounded-3xl border border-border-subtle bg-white/95 shadow-lg backdrop-blur-xl">
            <div className="flex flex-col gap-1 p-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "px-4 py-3 rounded-xl transition-all duration-200",
                    isActive(link.href)
                      ? "text-text-primary font-semibold bg-accent-subtle"
                      : "text-text-secondary hover:text-text-primary hover:bg-accent-subtle"
                  )}
                >
                  {t(link.key)}
                </Link>
              ))}
              <Button className="mt-2" asChild>
                <Link href="/download" onClick={() => setMobileOpen(false)}>
                  {t("download")}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
