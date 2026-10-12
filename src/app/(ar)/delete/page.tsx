import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/legal-page";
import { JsonLd } from "@/components/seo/json-ld";
import { canonical, legalJsonLd } from "@/lib/jsonld";
import arMessages from "../../../../messages/ar.json";

export const metadata: Metadata = {
  title: `${arMessages.legal.delete.title} — نقطة`,
  ...canonical("/delete"),
};

export default function Page() {
  return (
    <>
      <JsonLd data={legalJsonLd("ar", arMessages.legal.delete.title, "/delete")} />
      <LegalPage kind="delete" lang="ar" />
    </>
  );
}
