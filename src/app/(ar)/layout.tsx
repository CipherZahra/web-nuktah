import { NextIntlClientProvider } from "next-intl";
import { Amiri } from "next/font/google";
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
    url: "https://nuktah.app",
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
  alternates: {
    canonical: "https://nuktah.app",
  },
};

export default function ArLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${amiri.variable} font-sans antialiased`}>
        <NextIntlClientProvider
          locale="ar"
          messages={arMessages}
          timeZone="Africa/Algiers"
          formats={{}}
          now={BUILD_TIME}
        >
          <Navbar />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
