import { amiri, plex } from "@/fonts";
import type { Viewport } from "next";

/**
 * Payment result pages sit outside the (ar)/(en) groups, so this layout owns
 * the document shell they were missing (html/body, lang/dir, font variables).
 * Bilingual by design — Arabic-first with per-element dir switches.
 */
export const viewport: Viewport = {
  themeColor: "#059669",
};

export default function MiscLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${amiri.variable} ${plex.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
