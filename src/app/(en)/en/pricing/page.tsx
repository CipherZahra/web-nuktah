import type { Metadata } from "next";
import { PricingPage } from "@/components/pages/pricing-page";
import enMessages from "../../../../../messages/en.json";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, canonical } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: `${enMessages.pricing.title} — Nuktah`,
  ...canonical("/en/pricing"),
  description: enMessages.pricing.lead,
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd("en", [
          { name: enMessages.nav.home },
          { name: enMessages.pricing.title, path: "/en/pricing" },
        ])}
      />
      <PricingPage />
    </>
  );
}
