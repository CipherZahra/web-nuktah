import type { Metadata } from "next";
import { FaqPage } from "@/components/pages/faq-page";
import arMessages from "../../../../messages/ar.json";

export const metadata: Metadata = {
  title: `${arMessages.faqPage.title} — نقطة`,
  description: arMessages.faqPage.lead,
};

export default function Page() {
  return <FaqPage />;
}
