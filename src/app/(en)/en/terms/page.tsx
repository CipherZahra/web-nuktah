import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/legal-page";
import enMessages from "../../../../../messages/en.json";

export const metadata: Metadata = {
  title: `${enMessages.legal.terms.title} — Nuktah`,
};

export default function Page() {
  return <LegalPage kind="terms" lang="en" />;
}
