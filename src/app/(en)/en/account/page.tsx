import type { Metadata } from "next";
import { AccountPage } from "@/components/pages/account-page";
import enMessages from "../../../../../messages/en.json";

export const metadata: Metadata = {
  title: `${enMessages.account.title} — Nuktah`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AccountPage />;
}
