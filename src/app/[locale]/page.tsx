"use client";

import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { WhyNuktah } from "@/components/sections/why-nuktah";
import { Screenshots } from "@/components/sections/screenshots";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { Download } from "@/components/sections/download";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <WhyNuktah />
      <Screenshots />
      <Testimonials />
      <FAQ />
      <Download />
      <Contact />
    </>
  );
}
