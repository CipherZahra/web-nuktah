"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

import { getValidSession } from "@/lib/checkout";
import { PLAY_URL } from "@/lib/config";
import { formatDate, formatDzd } from "@/lib/format";
import {
  fetchBillingHistory,
  fetchSubscriptionStatus,
} from "@/lib/subscription";

/**
 * The `payment` namespace from messages/ar.json + messages/en.json.
 *
 * This page sits OUTSIDE the (ar)/(en) route groups, so there is no
 * next-intl provider here — `useTranslations` would throw. Instead the
 * server route imports both locales' JSON and hands them down, and this
 * component lays them out AR-then-EN (the page is bilingual by design).
 */
export interface PaymentCopy {
  successTitle: string;
  successDesc: string;
  failureTitle: string;
  failureDesc: string;
  orderTitle: string;
  orderAmount: string;
  orderDate: string;
  balanceLabel: string;
  balanceUnit: string;
  ctaAccount: string;
  ctaOpenApp: string;
  ctaHome: string;
}

/** Amount + date for the receipt, both derived from the credit ledger. */
type Receipt = {
  amountDzd: number | null;
  dateIso: string | null;
};

interface PaymentResultProps {
  kind: "success" | "failure";
  ar: PaymentCopy;
  en: PaymentCopy;
}

/**
 * Chargily redirect landing page. Bilingual by design: Arabic-first with
 * per-element `dir` switches, because it has no locale variant.
 *
 * On success it fetches two independent things and degrades per-item:
 *  - the wallet (`subscription-status`) → the credits balance
 *  - the ledger (`billing-history`)     → the amount actually charged
 * Either can fail; the confirmation copy stays visible regardless.
 */
export function PaymentResult({ kind, ar, en }: PaymentResultProps) {
  const success = kind === "success";
  const [credits, setCredits] = useState<number | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    if (!success) return;
    let cancelled = false;

    void getValidSession().then((session) => {
      if (!session || cancelled) return;

      void fetchSubscriptionStatus().then((status) => {
        if (cancelled || !status) return;
        setCredits(status.scanCreditsRemaining);
      });

      // Newest-first, so the first PURCHASE is the one that just happened.
      // Amount lives in centimes (amount_centimes) — divide to get DZD.
      void fetchBillingHistory().then((history) => {
        if (cancelled || !history) return;
        const purchase = history.find((e) => e.type === "PURCHASE");
        if (!purchase) return;
        const centimes = purchase.metadata?.amount_centimes;
        setReceipt({
          amountDzd: typeof centimes === "number" ? centimes / 100 : null,
          dateIso: purchase.createdAt || null,
        });
      });
    });

    return () => {
      cancelled = true;
    };
  }, [success]);

  const titleAr = success ? ar.successTitle : ar.failureTitle;
  const titleEn = success ? en.successTitle : en.failureTitle;
  const descAr = success ? ar.successDesc : ar.failureDesc;
  const descEn = success ? en.successDesc : en.failureDesc;

  // Ledger may be missing entirely, or lack amount_centimes on older rows —
  // either way that row is simply omitted rather than shown as 0.
  const amountDzd = receipt?.amountDzd ?? null;
  const dateIso = receipt?.dateIso ?? null;

  // Render the card when we have anything to show; if both fetches fail the
  // page falls back to the confirmation copy alone (same as before).
  const showCard = credits !== null || amountDzd !== null || dateIso !== null;

  return (
    <section className="min-h-screen flex items-center justify-center px-8 py-16 bg-primary-bg">
      <div className="max-w-md w-full text-center">
        <div
          className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center ${
            success ? "bg-accent-subtle text-accent" : "bg-red-50 text-red-500"
          }`}
        >
          {success ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
        </div>
        <h1
          className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary mb-2 text-balance"
          dir="rtl"
        >
          {titleAr}
        </h1>
        <p className="text-lg font-semibold text-text-secondary mb-4" dir="ltr">
          {titleEn}
        </p>

        {/* Confirmation stays put — it used to be swapped out for the balance. */}
        <p className="text-sm text-text-secondary leading-relaxed mb-3" dir="rtl">
          {descAr}
        </p>
        <p className="text-sm text-text-secondary leading-relaxed mb-6" dir="ltr">
          {descEn}
        </p>

        {showCard && (
          <div className="mb-6 rounded-2xl border border-accent/25 bg-accent-subtle px-5 py-4 text-start">
            <p className="text-xs font-bold text-accent-hover mb-3" dir="rtl">
              {ar.orderTitle}
              <span dir="ltr"> · {en.orderTitle}</span>
            </p>

            {amountDzd !== null && (
              <div className="mb-2">
                <p className="text-sm font-semibold text-text-primary" dir="rtl">
                  {ar.orderAmount}: {formatDzd(amountDzd, "ar")}
                </p>
                <p className="text-sm text-text-secondary" dir="ltr">
                  {en.orderAmount}: {formatDzd(amountDzd, "en")}
                </p>
              </div>
            )}

            {dateIso && (
              <div className="mb-3">
                <p className="text-sm font-semibold text-text-primary" dir="rtl">
                  {ar.orderDate}: {formatDate(dateIso, "ar")}
                </p>
                <p className="text-sm text-text-secondary" dir="ltr">
                  {en.orderDate}: {formatDate(dateIso, "en")}
                </p>
              </div>
            )}

            {credits !== null && (
              <div className="rounded-xl bg-white/80 px-3 py-2">
                <p className="text-base font-bold text-accent-hover" dir="rtl">
                  {ar.balanceLabel}: {credits} {ar.balanceUnit}
                </p>
                <p
                  className="text-sm font-semibold text-text-secondary"
                  dir="ltr"
                >
                  {en.balanceLabel}: {credits} {en.balanceUnit}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/account"
            className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-accent text-white text-sm font-medium shadow-md hover:bg-accent-hover hover:shadow-glow transition-all duration-200"
          >
            {ar.ctaAccount} · {en.ctaAccount}
          </Link>
          <a
            href={PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-12 px-6 rounded-xl border border-border/60 text-text-primary text-sm font-medium hover:bg-card-bg hover:border-accent/50 transition-all duration-200"
          >
            {ar.ctaOpenApp} · {en.ctaOpenApp}
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center h-12 px-6 rounded-xl border border-border/60 text-text-primary text-sm font-medium hover:bg-card-bg hover:border-accent/50 transition-all duration-200"
          >
            {ar.ctaHome} · {en.ctaHome}
          </Link>
        </div>
      </div>
    </section>
  );
}
