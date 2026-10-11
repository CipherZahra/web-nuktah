import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/legal-page";
import arMessages from "../../../../messages/ar.json";

export const metadata: Metadata = {
  title: `${arMessages.legal.delete.title} — نقطة`,
};

export default function Page() {
  return <LegalPage kind="delete" />;
}
