import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/about-page";
import enMessages from "../../../../../messages/en.json";
import { canonical } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: `${enMessages.about.title} — Nuktah`,
  ...canonical("/en/about"),
  description: enMessages.about.lead,
};

export default function Page() {
  return <AboutPage />;
}
