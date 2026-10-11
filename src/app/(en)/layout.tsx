import { NextIntlClientProvider } from "next-intl";
import { Tajawal } from "next/font/google";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import type { Metadata } from "next";
import enMessages from "../../../messages/en.json";

const tajawal = Tajawal({
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap",
  variable: "--font-tajawal",
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
    url: "https://nuktah.app/en",
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
  alternates: {
    canonical: "https://nuktah.app/en",
  },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${tajawal.variable} font-sans antialiased`}>
        <NextIntlClientProvider
          locale="en"
          messages={enMessages}
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
