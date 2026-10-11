import type { Metadata } from "next";
import { DownloadPage } from "@/components/pages/download-page";
import enMessages from "../../../../../messages/en.json";

export const metadata: Metadata = {
  title: `${enMessages.downloadPage.title} — Nuktah`,
  description: enMessages.downloadPage.lead,
};

export default function Page() {
  return <DownloadPage />;
}
