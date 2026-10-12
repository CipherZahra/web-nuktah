import type { Metadata } from "next";
import { SupportPage } from "@/components/pages/support-page";
import enMessages from "../../../../../messages/en.json";
import { canonical } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: `${enMessages.support.title} — Nuktah`,
  ...canonical("/en/support"),
  description: enMessages.support.lead,
};

export default function Page() {
  return <SupportPage />;
}
