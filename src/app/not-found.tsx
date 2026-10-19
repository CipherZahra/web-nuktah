import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";
import { amiri, plex } from "@/fonts";
import "./globals.css";

// The 404 sits outside the locale layouts (there is no locale in the URL for
// an unknown path), so it carries its own document and shows both languages
// side by side instead of guessing the visitor's locale from a header we
// don't have at static-export time.
export const metadata: Metadata = {
  title: "404 — نقطة | Nuktah",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <html lang="ar" dir="rtl" className={`${amiri.variable} ${plex.variable}`}>
      <body className="font-sans antialiased">
        <main className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6 py-16 bg-primary-bg">
          <div className="w-14 h-14 rounded-2xl bg-accent-subtle text-accent-hover flex items-center justify-center mb-2">
            <Compass size={26} />
          </div>
          <span className="text-xs font-bold tracking-widest text-text-muted">
            404
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            الصفحة غير موجودة
          </h1>
          <p className="text-text-secondary max-w-md leading-relaxed">
            الرابط الذي فتحته غير صالح أو نُقل إلى صفحة أخرى.
          </p>
          <p
            lang="en"
            dir="ltr"
            className="text-text-muted text-sm max-w-md leading-relaxed -mt-1"
          >
            This page doesn&apos;t exist or has moved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-accent text-primary-bg text-sm font-bold shadow-md hover:bg-accent-hover hover:shadow-glow transition-all duration-200"
            >
              العودة إلى الرئيسية
            </Link>
            <Link
              href="/en/"
              lang="en"
              dir="ltr"
              className="inline-flex items-center justify-center h-12 px-6 rounded-xl border border-border/60 text-text-secondary text-sm font-medium hover:bg-card-bg hover:border-accent/50 transition-all duration-200"
            >
              English version
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
