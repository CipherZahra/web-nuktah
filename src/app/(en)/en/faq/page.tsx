import type { Metadata } from "next";
import { FaqPage } from "@/components/pages/faq-page";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, canonical, faqJsonLd } from "@/lib/jsonld";
import enMessages from "../../../../../messages/en.json";

export const metadata: Metadata = {
  title: `${enMessages.faqPage.title} — Nuktah`,
  description: enMessages.faqPage.lead,
  ...canonical("/en/faq"),
};

export default function Page() {
  return (
    <>
      <JsonLd data={faqJsonLd(enMessages.faqPage.items)} />
      <JsonLd
        data={breadcrumbJsonLd("en", [
          { name: enMessages.nav.home },
          { name: enMessages.faqPage.title, path: "/en/faq" },
        ])}
      />
      <FaqPage />
    </>
  );
}
