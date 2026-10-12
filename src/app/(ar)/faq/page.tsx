import type { Metadata } from "next";
import { FaqPage } from "@/components/pages/faq-page";
import { JsonLd } from "@/components/seo/json-ld";
import { canonical, faqJsonLd } from "@/lib/jsonld";
import arMessages from "../../../../messages/ar.json";

export const metadata: Metadata = {
  title: `${arMessages.faqPage.title} — نقطة`,
  description: arMessages.faqPage.lead,
  ...canonical("/faq"),
};

export default function Page() {
  return (
    <>
      <JsonLd data={faqJsonLd(arMessages.faqPage.items)} />
      <FaqPage />
    </>
  );
}
