import { JsonLd } from "@/components/seo/json-ld";
import { canonical, websiteJsonLd } from "@/lib/jsonld";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Screenshots } from "@/components/sections/screenshots";
import { VideoSlot } from "@/components/sections/video-slot";
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
      <Screenshots />
      <VideoSlot />
      <ClosingCta locale="en" />
    </>
  );
}
