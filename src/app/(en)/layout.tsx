import { NextIntlClientProvider } from "next-intl";
import { Amiri } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import type { Metadata } from "next";
import enMessages from "../../../messages/en.json";

const amiri = Amiri({
  subsets: ["latin", "arabic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-amiri",
});

const BUILD_TIME = new Date();

export const metadata: Metadata = {
  title: enMessages.seo.title,
  description: enMessages.seo.description,
  keywords: [
    "Nuktah",
    "grade management",
    "teachers Algeria",
    "grade sheet scanning",
    "education app",
    "OCR",
  ],
  authors: [{ name: "Nuktah" }],
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
    locale: "en_GB",
    siteName: "Nuktah",
    title: enMessages.seo.ogTitle,
    description: enMessages.seo.ogDescription,
    images: [{ url: "https://nuktah.app/og.png", width: 1200, height: 630, alt: "Nuktah" }],
  },
  twitter: {
    card: "summary_large_image",
    title: enMessages.seo.ogTitle,
    description: enMessages.seo.ogDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${amiri.variable} font-sans antialiased`}>
        <NextIntlClientProvider
          locale="en"
          messages={enMessages}
          timeZone="Africa/Algiers"
          formats={{}}
          now={BUILD_TIME}
        >
          <MotionConfig reducedMotion="user">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm"
            >
              {enMessages.nav.skipToContent}
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
