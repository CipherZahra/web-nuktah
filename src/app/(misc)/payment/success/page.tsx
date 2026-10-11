import type { Metadata } from "next";
import { PaymentResult } from "@/components/pages/payment-result";
import arMessages from "../../../../../messages/ar.json";
import enMessages from "../../../../../messages/en.json";

export const metadata: Metadata = {
  title: `Nuktah — ${arMessages.payment.successTitle} | ${enMessages.payment.successTitle}`,
  description: enMessages.payment.successDesc,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PaymentResult kind="success" />;
}
