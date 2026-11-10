import { JsonLd } from "@/components/seo/json-ld";
import { canonical, websiteJsonLd } from "@/lib/jsonld";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Screenshots } from "@/components/sections/screenshots";
import { VideoSlot } from "@/components/sections/video-slot";
import { ClosingCta } from "@/components/sections/closing-cta";
import arMessages from "../../../messages/ar.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...canonical("/"),
};

export default function Home() {
  return (
    <>
      <JsonLd data={websiteJsonLd("ar", arMessages.seo.description)} />
      <Hero locale="ar" />
      <Features locale="ar" />
      <HowItWorks locale="ar" />
      <Screenshots />
      <VideoSlot />
      <ClosingCta locale="ar" />
    </>
  );
}
