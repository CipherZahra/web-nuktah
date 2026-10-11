import type { Metadata } from "next";
import { FaqPage } from "@/components/pages/faq-page";
import enMessages from "../../../../../messages/en.json";

export const metadata: Metadata = {
  title: `${enMessages.faqPage.title} — Nuktah`,
  description: enMessages.faqPage.lead,
};

export default function Page() {
  return <FaqPage />;
}
