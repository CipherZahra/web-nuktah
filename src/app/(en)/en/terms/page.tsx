import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/legal-page";
import { JsonLd } from "@/components/seo/json-ld";
import { canonical, legalJsonLd } from "@/lib/jsonld";
import enMessages from "../../../../../messages/en.json";

export const metadata: Metadata = {
  title: `${enMessages.legal.terms.title} — Nuktah`,
  ...canonical("/en/terms"),
};

export default function Page() {
  return (
    <>
      <JsonLd data={legalJsonLd("en", enMessages.legal.terms.title, "/en/terms")} />
      <LegalPage kind="terms" lang="en" />
    </>
  );
}
