import type { Metadata } from "next";
import { PricingPage } from "@/components/pages/pricing-page";
import enMessages from "../../../../../messages/en.json";
import { canonical } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: `${enMessages.pricing.title} — Nuktah`,
  ...canonical("/en/pricing"),
  description: enMessages.pricing.lead,
};

export default function Page() {
  return <PricingPage />;
}
