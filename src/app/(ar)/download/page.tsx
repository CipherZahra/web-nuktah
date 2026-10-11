import type { Metadata } from "next";
import { DownloadPage } from "@/components/pages/download-page";
import arMessages from "../../../../messages/ar.json";

export const metadata: Metadata = {
  title: `${arMessages.downloadPage.title} — نقطة`,
  description: arMessages.downloadPage.lead,
};

export default function Page() {
  return <DownloadPage />;
}
