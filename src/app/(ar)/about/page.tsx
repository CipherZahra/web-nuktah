import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/about-page";
import arMessages from "../../../../messages/ar.json";
import { canonical } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: `${arMessages.about.title} — نقطة`,
  ...canonical("/about"),
  description: arMessages.about.lead,
};

export default function Page() {
  return <AboutPage />;
}
