import type { Metadata } from "next";
import { DownloadPage } from "@/components/pages/download-page";
import arMessages from "../../../../messages/ar.json";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, canonical } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: `${arMessages.downloadPage.title} — نقطة`,
  ...canonical("/download"),
  description: `${arMessages.downloadPage.lead} ${arMessages.downloadPage.availableNow}`,
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd("ar", [
          { name: arMessages.nav.home },
          { name: arMessages.downloadPage.title, path: "/download" },
        ])}
      />
      <DownloadPage />
    </>
  );
}
