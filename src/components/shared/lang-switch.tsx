"use client";

import { useLocale } from "next-intl";
import { Languages } from "lucide-react";
import { usePathname } from "@/i18n";

export function LangSwitch() {
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === "ar" ? "en" : "ar";
  const label = locale === "ar" ? "EN" : "عربي";
  const ariaLabel = locale === "ar" ? "Switch to English" : "التبديل إلى العربية";
  const href = other === "ar" ? pathname : pathname === "/" ? "/en/" : `/en${pathname}`;

  return (
    <a
      href={href}
      lang={other}
      aria-label={ariaLabel}
      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary rounded-lg hover:bg-accent-subtle transition-all duration-200 border border-border/60 hover:border-accent/30"
    >
      <Languages size={15} />
      <span>{label}</span>
    </a>
  );
}
