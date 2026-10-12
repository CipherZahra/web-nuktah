import type { Metadata } from "next";
import { DownloadPage } from "@/components/pages/download-page";
import arMessages from "../../../../messages/ar.json";
import { canonical } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: `${arMessages.downloadPage.title} — نقطة`,
  ...canonical("/download"),
  description: arMessages.downloadPage.lead,
};

export default function Page() {
  return <DownloadPage />;
}
