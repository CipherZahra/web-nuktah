"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#hero", key: "home" },
  { href: "#features", key: "features" },
  { href: "#how-it-works", key: "howItWorks" },
  { href: "#faq", key: "faq" },
  { href: "#download", key: "download" },
  { href: "#contact", key: "contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("nav");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
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
          : "bg-transparent"
      )}
    >
      <nav
        className={cn(
          "container-main flex items-center justify-between transition-all duration-300",
          scrolled ? "h-16" : "h-24"
        )}
      >
        <a href="#hero" className="flex items-center gap-3 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-glow transition-shadow duration-300">
            <span className="text-white font-bold text-sm">ن</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-text-primary">
            نقطة
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary rounded-lg hover:bg-accent-subtle transition-all duration-200"
            >
              {t(link.key)}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button size="sm" asChild>
            <a href="#download">{t("download")}</a>
          </Button>
        </div>

        <div className="flex md:hidden items-center gap-2">
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
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-text-secondary hover:text-text-primary rounded-lg hover:bg-accent-subtle transition-all duration-200"
                >
                  {t(link.key)}
                </a>
              ))}
              <Button className="mt-2" asChild>
                <a href="#download" onClick={() => setMobileOpen(false)}>
                  {t("download")}
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
