"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
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
  // The route the menu was opened on: `mobileOpen` is *derived* from it, so a
  // client-side navigation (including browser back) closes the menu — and the
  // body scroll lock below — without resetting state inside an effect. The
  // navbar outlives navigation, so its state would otherwise stick.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const t = useTranslations("nav");
  const isActive = useIsActive();
  const pathname = usePathname();
  const mobileOpen = openedAt === pathname;
  const closeMenu = () => setOpenedAt(null);

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
    <header
      className={cn(
        "nav-drop fixed top-0 left-0 right-0 z-50 transition-all duration-300",
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
          {/* The only above-the-fold raster asset: preload it once here so the
              hero copy reuses the same cached file. */}
          <Image
            src="/logo-160.webp"
            alt=""
            width={160}
            height={160}
            priority
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

        {/* One LangSwitch + AccountMenu for the whole bar: the old desktop and
            mobile copies both lived in the DOM, so the EN link was duplicated. */}
        <div className="flex items-center gap-2">
          <LangSwitch />
          <AccountMenu
            fallback={
              /* Compact label: the full primary string doesn't fit a 360px
                 header. The full label (nav.join) is used in the mobile menu
                 and everywhere in the page body. */
              <Button size="sm" className="min-h-11" asChild>
                <Link href="/download">{t("download")}</Link>
              </Button>
            }
          />
          <button
            onClick={() => setOpenedAt(mobileOpen ? null : pathname)}
            className="md:hidden p-3 -m-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-accent-subtle transition-all duration-200"
            aria-label={t("menuToggle")}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="mobile-menu md:hidden bg-white/95 backdrop-blur-xl border-b border-border-subtle overflow-hidden">
          <div className="container-main py-6 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => closeMenu()}
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
              <Link href="/download" onClick={() => closeMenu()}>
                {t("join")}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
