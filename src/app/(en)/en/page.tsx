import { JsonLd } from "@/components/seo/json-ld";
import { canonical, websiteJsonLd } from "@/lib/jsonld";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { WhyNuktah } from "@/components/sections/why-nuktah";
import { Screenshots } from "@/components/sections/screenshots";
import { Testimonials } from "@/components/sections/testimonials";
import enMessages from "../../../../messages/en.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...canonical("/en"),
};

export default function Home() {
  return (
    <>
      <JsonLd data={websiteJsonLd("en", enMessages.seo.description)} />
      <Hero />
      <Features />
      <HowItWorks />
      <WhyNuktah />
      <Screenshots />
      <Testimonials />
    </>
  );
}
