import type { Metadata } from "next";
import { PricingPage } from "@/components/pages/pricing-page";
import enMessages from "../../../../../messages/en.json";

export const metadata: Metadata = {
  title: `${enMessages.pricing.title} — Nuktah`,
  description: enMessages.pricing.lead,
};

export default function Page() {
  return <PricingPage />;
}
