import type { Metadata } from "next";
import { SupportPage } from "@/components/pages/support-page";
import arMessages from "../../../../messages/ar.json";
import { canonical } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: `${arMessages.support.title} — نقطة`,
  ...canonical("/support"),
  description: arMessages.support.lead,
};

export default function Page() {
  return <SupportPage />;
}
