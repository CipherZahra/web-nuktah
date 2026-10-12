import { NextIntlClientProvider } from "next-intl";
import { Amiri, IBM_Plex_Sans_Arabic } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import type { Metadata } from "next";
import arMessages from "../../../messages/ar.json";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-amiri",
});

const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-ui",
});

const BUILD_TIME = new Date();

export const metadata: Metadata = {
  title: arMessages.seo.title,
  description: arMessages.seo.description,
  keywords: [
    "نقطة",
    "Nuktah",
    "إدارة الدرجات",
    "المعلمين الجزائريين",
    "مسح كشوف النقاط",
    "تطبيق تعليمي",
    "OCR",
    "الذكاء الاصطناعي في التعليم",
  ],
  authors: [{ name: "نقطة" }],
  creator: "Bayan",
  publisher: "Nuktah",
  metadataBase: new URL("https://nuktah.app"),
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "ar_DZ",
    siteName: "نقطة",
    title: arMessages.seo.ogTitle,
    description: arMessages.seo.ogDescription,
    images: [{ url: "https://nuktah.app/og.png", width: 1200, height: 630, alt: "نقطة" }],
  },
  twitter: {
    card: "summary_large_image",
    title: arMessages.seo.ogTitle,
    description: arMessages.seo.ogDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ArLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${amiri.variable} ${plex.variable} font-sans antialiased`}>
        <NextIntlClientProvider
          locale="ar"
          messages={arMessages}
          timeZone="Africa/Algiers"
          formats={{}}
          now={BUILD_TIME}
        >
          <MotionConfig reducedMotion="user">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm"
            >
              {arMessages.nav.skipToContent}
            </a>
            <Navbar />
            <main id="main-content">{children}</main>
            <Footer />
          </MotionConfig>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
