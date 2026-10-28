import { JsonLd } from "@/components/seo/json-ld";
import { canonical, websiteJsonLd } from "@/lib/jsonld";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { WhyNuktah } from "@/components/sections/why-nuktah";
import { PricingPreview } from "@/components/sections/pricing-preview";
import { Screenshots } from "@/components/sections/screenshots";
import { ClosingCta } from "@/components/sections/closing-cta";
import enMessages from "../../../../messages/en.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...canonical("/en"),
};

export default function Home() {
  return (
    <>
      <JsonLd data={websiteJsonLd("en", enMessages.seo.description)} />
      <Hero locale="en" />
      <Features locale="en" />
      <HowItWorks locale="en" />
      <WhyNuktah locale="en" />
      <PricingPreview locale="en" />
      <Screenshots />
      <ClosingCta locale="en" />
    </>
  );
}
