import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/legal-page";
import { JsonLd } from "@/components/seo/json-ld";
import { canonical, legalJsonLd } from "@/lib/jsonld";
import enMessages from "../../../../../messages/en.json";

export const metadata: Metadata = {
  title: `${enMessages.legal.privacy.title} — Nuktah`,
  ...canonical("/en/privacy"),
};

export default function Page() {
  return (
    <>
      <JsonLd data={legalJsonLd("en", enMessages.legal.privacy.title, "/en/privacy")} />
      <LegalPage kind="privacy" lang="en" />
    </>
  );
}
