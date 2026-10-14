import type { Metadata } from "next";
import { AccountPage } from "@/components/pages/account-page";
import arMessages from "../../../../messages/ar.json";

export const metadata: Metadata = {
  title: `${arMessages.account.title} — نقطة`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AccountPage />;
}
