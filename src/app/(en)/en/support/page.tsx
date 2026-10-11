import type { Metadata } from "next";
import { SupportPage } from "@/components/pages/support-page";
import enMessages from "../../../../../messages/en.json";

export const metadata: Metadata = {
  title: `${enMessages.support.title} — Nuktah`,
  description: enMessages.support.lead,
};

export default function Page() {
  return <SupportPage />;
}
