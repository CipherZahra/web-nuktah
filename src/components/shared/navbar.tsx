"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
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
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-border-subtle"
          : "bg-white/60 backdrop-blur-md"
      )}
    >
      <nav
        className={cn(
          "container-main flex items-center justify-between transition-all duration-300",
          scrolled ? "h-16" : "h-24"
        )}
      >
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <img
            src="/logo.png"
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
                "relative px-4 py-2 text-sm rounded-lg transition-all duration-200",
                isActive(link.href)
                  ? "text-text-primary font-semibold"
                  : "text-text-secondary hover:text-text-primary hover:bg-accent-subtle"
              )}
            >
              {t(link.key)}
              {isActive(link.href) && (
                <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-accent" />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <LangSwitch />
          <Button size="sm" asChild>
            <Link href="/download">{t("download")}</Link>
          </Button>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <LangSwitch />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-accent-subtle transition-all duration-200"
            aria-label={t("menuToggle")}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-border-subtle overflow-hidden"
          >
            <div className="container-main py-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "px-4 py-3 rounded-lg transition-all duration-200",
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
