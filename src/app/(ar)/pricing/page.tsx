import type { Metadata } from "next";
import { PricingPage } from "@/components/pages/pricing-page";
import arMessages from "../../../../messages/ar.json";
import { canonical } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: `${arMessages.pricing.title} — نقطة`,
  ...canonical("/pricing"),
  description: arMessages.pricing.lead,
};

export default function Page() {
  return <PricingPage />;
}
