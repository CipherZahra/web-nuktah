import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/about-page";
import enMessages from "../../../../../messages/en.json";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, canonical } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: `${enMessages.about.title} — Nuktah`,
  ...canonical("/en/about"),
  description: enMessages.about.lead,
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd("en", [
          { name: enMessages.nav.home },
          { name: enMessages.about.title, path: "/en/about" },
        ])}
      />
      <AboutPage />
    </>
  );
}
