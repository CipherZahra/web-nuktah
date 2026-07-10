import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Tajawal } from "next/font/google";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import type { Metadata } from "next";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap",
  variable: "--font-tajawal",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return [{ locale: "ar" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const resolved = locale === "en" ? "ar" : locale;
  const messages = (await import(`../../../messages/${resolved}.json`)).default;
  const seo = messages.seo;

  return {
    title: seo.title,
    description: seo.description,
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
    openGraph: {
      type: "website",
      locale: "ar_DZ",
      siteName: "نقطة",
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: "https://nuktah.app",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle,
      description: seo.ogDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "https://nuktah.app",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (locale !== "ar") {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${tajawal.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
