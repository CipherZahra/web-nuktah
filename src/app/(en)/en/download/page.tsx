import type { Metadata } from "next";
import { DownloadPage } from "@/components/pages/download-page";
import enMessages from "../../../../../messages/en.json";
import { canonical } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: `${enMessages.downloadPage.title} — Nuktah`,
  ...canonical("/en/download"),
  description: enMessages.downloadPage.lead,
};

export default function Page() {
  return <DownloadPage />;
}
