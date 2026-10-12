import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/legal-page";
import { JsonLd } from "@/components/seo/json-ld";
import { canonical, legalJsonLd } from "@/lib/jsonld";
import arMessages from "../../../../messages/ar.json";

export const metadata: Metadata = {
  title: `${arMessages.legal.privacy.title} — نقطة`,
  ...canonical("/privacy"),
};

export default function Page() {
  return (
    <>
      <JsonLd data={legalJsonLd("ar", arMessages.legal.privacy.title, "/privacy")} />
      <LegalPage kind="privacy" lang="ar" />
    </>
  );
}
