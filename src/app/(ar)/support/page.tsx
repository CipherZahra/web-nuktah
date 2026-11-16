import type { Metadata } from "next";
import { SupportPage } from "@/components/pages/support-page";
import arMessages from "../../../../messages/ar.json";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, canonical } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: `${arMessages.support.title} — نقطة`,
  ...canonical("/support"),
  description: arMessages.support.lead,
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd("ar", [
          { name: arMessages.nav.home },
          { name: arMessages.support.title, path: "/support" },
        ])}
      />
      <SupportPage />
    </>
  );
}
