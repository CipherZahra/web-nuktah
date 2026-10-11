import type { Metadata } from "next";
import { PricingPage } from "@/components/pages/pricing-page";
import arMessages from "../../../../messages/ar.json";

export const metadata: Metadata = {
  title: `${arMessages.pricing.title} — نقطة`,
  description: arMessages.pricing.lead,
};

export default function Page() {
  return <PricingPage />;
}
