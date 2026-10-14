"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  AlertTriangle,
  Download,
  LayoutGrid,
  LogOut,
  ReceiptText,
  ScanLine,
  ShoppingBag,
} from "lucide-react";

import { getValidSession, getUserProfile, signOut, startCheckout } from "@/lib/checkout";
import {
  fetchBillingHistory,
  fetchSubscriptionStatus,
  type LedgerEntry,
  type SubscriptionStatus,
} from "@/lib/subscription";
import { LoginModal } from "@/components/pages/login-modal";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n";
import { cn } from "@/lib/utils";

/** Server catalog order in supabase/functions/_shared/packages.ts. */
const PACKAGE_IDS = ["starter", "standard", "plus", "teacher"];

/** Ledger types worth showing on a billing page (spend rows are noise). */
const HISTORY_TYPES = new Set([
  "PURCHASE",
  "FREE_GRANT",
  "REWARDED",
  "REFUND",
  "ADJUSTMENT",
]);

const TYPE_KEY: Record<string, string> = {
  PURCHASE: "typePurchase",
  FREE_GRANT: "typeFreeGrant",
  REWARDED: "typeRewarded",
  REFUND: "typeRefund",
  ADJUSTMENT: "typeAdjustment",
  SCAN: "typeScan",
  IMPORT: "typeImport",
  EXPORT: "typeExport",
};

function formatDate(iso: string, locale: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

function purchaseAmountDzd(entry: LedgerEntry): number | null {
  if (entry.type !== "PURCHASE") return null;
  const centimes = entry.metadata?.amount_centimes;
  return typeof centimes === "number" ? centimes / 100 : null;
}

type AuthState = "loading" | "signedOut" | "signedIn";
type DataState = "loading" | "ready" | "error";

export function AccountPage() {
  const t = useTranslations("account");
  const tp = useTranslations("pricing");
  const locale = useLocale();
  const router = useRouter();
  const plans = tp.raw("plans") as {
    name: string;
    credits: string;
    creditsUnit: string;
    price: string;
    priceUnit: string;
    tag: string;
  }[];

  const [authState, setAuthState] = useState<AuthState>("loading");
  const [dataState, setDataState] = useState<DataState>("loading");
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [history, setHistory] = useState<LedgerEntry[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loginOpen, setLoginOpen] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [busyIdx, setBusyIdx] = useState<number | null>(null);
  const [payError, setPayError] = useState(false);

  // Initial load + retry (via reloadKey). setState only runs inside promise
  // callbacks — react-hooks/set-state-in-effect forbids synchronous setState
  // from an effect body.
  useEffect(() => {
    let cancelled = false;
    void getValidSession().then((session) => {
      if (cancelled) return;
      if (!session) {
        setAuthState("signedOut");
        return;
      }
      setAuthState("signedIn");
      void Promise.all([
        fetchSubscriptionStatus(),
        fetchBillingHistory(),
        getUserProfile(),
      ]).then(([sub, hist, profile]) => {
        if (cancelled) return;
        if (!sub) {
          setDataState("error");
          return;
        }
        setEmail(profile?.email ?? null);
        setStatus(sub);
        setHistory(hist ?? []);
        setDataState("ready");
      });
    });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const retry = () => {
    setDataState("loading");
    setReloadKey((k) => k + 1);
  };

  const handleBuy = async (idx: number) => {
    setPayError(false);
    setBusyIdx(idx);
    try {
      await startCheckout(PACKAGE_IDS[idx], locale);
      setBusyIdx(null);
    } catch {
      setBusyIdx(null);
      setPayError(true);
    }
  };

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  // ── signed-out: sign-in card ──────────────────────────────────────────
  if (authState === "signedOut") {
    return (
      <>
        <section className="min-h-screen flex items-center justify-center px-6 pt-28 pb-20 bg-primary-bg">
          <div className="w-full max-w-md rounded-3xl border border-border/60 bg-white p-8 text-center shadow-md">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-accent-subtle text-accent">
              <ScanLine size={26} />
            </div>
            <h1 className="text-xl font-bold text-text-primary mb-2">
              {t("signInTitle")}
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              {t("signInHint")}
            </p>
            <Button className="w-full" onClick={() => setLoginOpen(true)}>
              {t("signInCta")}
            </Button>
          </div>
        </section>
        <LoginModal
          key={loginOpen ? "open" : "closed"}
          open={loginOpen}
          onClose={() => setLoginOpen(false)}
          onSuccess={() => {
            setLoginOpen(false);
            retry();
          }}
        />
      </>
    );
  }

  const tierPro = status?.tier === "pro";
  const scans = status?.scanCreditsRemaining ?? 0;
  const imports = status?.importsRemaining ?? 0;
  const showLowScans = scans <= 1;
  const showNoImports = imports <= 0;
  const entries = history.filter((h) => HISTORY_TYPES.has(h.type));

  const sidebarItem = (
    active: boolean,
    icon: React.ReactNode,
    label: string,
    href?: string,
  ) => {
    const cls = cn(
      "flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm transition-colors",
      active
        ? "bg-accent-subtle font-semibold text-accent-hover"
        : "text-text-secondary hover:bg-accent-subtle hover:text-text-primary",
    );
    if (href) {
      return (
        <a href={href} className={cls}>
          {icon}
          {label}
        </a>
      );
    }
    return (
      <span className={cls} aria-current="page">
        {icon}
        {label}
      </span>
    );
  };

  const tierBadge = (size: "sm" | "md") => (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-xs",
        tierPro
          ? "bg-accent text-white"
          : "border border-border bg-white text-text-secondary",
      )}
    >
      {tierPro ? t("tierPro") : t("tierFree")}
    </span>
  );

  const kpiCard = (
    icon: React.ReactNode,
    label: string,
    value: number,
    muted: boolean,
  ) => (
    <div className="rounded-2xl border border-border/60 bg-white p-6">
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-accent-subtle text-accent">
        {icon}
      </div>
      <p className="text-sm text-text-muted mb-1">{label}</p>
      <p
        className={cn(
          "text-5xl font-extrabold tracking-tight",
          muted ? "text-text-muted" : "text-text-primary",
        )}
      >
        {value}
      </p>
    </div>
  );

  return (
    <section className="min-h-screen bg-primary-bg pt-28 pb-20">
      <div className="container-main">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Sidebar (desktop) ─────────────────────────────────────── */}
          <aside className="hidden lg:flex w-64 shrink-0 flex-col">
            <div className="sticky top-28 rounded-2xl border border-border/60 bg-white p-4 flex flex-col gap-1">
              {sidebarItem(
                true,
                <LayoutGrid size={16} />,
                t("overview"),
              )}
              {sidebarItem(
                false,
                <ReceiptText size={16} />,
                t("purchasesNav"),
                "#purchases",
              )}
              <div className="my-3 border-t border-border-subtle" />
              {dataState === "ready" && (
                <div className="px-3.5 pb-2">
                  {email && (
                    <p
                      className="text-sm font-semibold text-text-primary truncate mb-1.5"
                      dir="ltr"
                    >
                      {email}
                    </p>
                  )}
                  {tierBadge("sm")}
                </div>
              )}
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
              >
                <LogOut size={16} />
                {t("signOut")}
              </button>
            </div>
          </aside>

          {/* ── Content ───────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-text-primary">
                {t("title")}
              </h1>
              {dataState === "ready" && (
                <div className="flex items-center gap-3 lg:hidden">
                  {tierBadge("md")}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-sm font-medium text-text-secondary hover:text-red-600 transition-colors cursor-pointer"
                  >
                    {t("signOut")}
                  </button>
                </div>
              )}
            </div>

            {dataState === "loading" && (
              <div className="space-y-6" aria-busy="true">
                <p className="text-sm text-text-muted">{t("loading")}</p>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="h-40 rounded-2xl border border-border/60 bg-white" />
                  <div className="h-40 rounded-2xl border border-border/60 bg-white" />
                </div>
                <div className="h-56 rounded-2xl border border-border/60 bg-white" />
              </div>
            )}

            {dataState === "error" && (
              <div className="rounded-2xl border border-border/60 bg-white p-8 text-center">
                <p className="text-sm text-text-secondary mb-4">
                  {t("loadError")}
                </p>
                <Button variant="outline" onClick={retry}>
                  {t("retry")}
                </Button>
              </div>
            )}

            {dataState === "ready" && status && (
              <>
                {/* KPI cards */}
                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  {kpiCard(
                    <ScanLine size={22} />,
                    t("scans"),
                    scans,
                    scans <= 1,
                  )}
                  {kpiCard(
                    <Download size={22} />,
                    t("imports"),
                    imports,
                    imports <= 0,
                  )}
                </div>

                {/* Low-balance banner */}
                {(showLowScans || showNoImports) && (
                  <div
                    role="status"
                    className={cn(
                      "mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-5 py-4",
                      scans === 0
                        ? "border-red-200 bg-red-50"
                        : "border-amber-200 bg-amber-50",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle
                        size={18}
                        className={
                          scans === 0 ? "text-red-600" : "text-amber-600"
                        }
                      />
                      <p className="text-sm font-medium text-text-primary">
                        {scans === 0
                          ? t("noScans")
                          : showLowScans
                            ? t("lowScans")
                            : t("noImports")}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setTopUpOpen(true);
                        document
                          .getElementById("top-up")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      {t("topUp")}
                    </Button>
                  </div>
                )}

                {/* Purchases / wallet history */}
                <div
                  id="purchases"
                  className="rounded-2xl border border-border/60 bg-white p-6 mb-6 scroll-mt-28"
                >
                  <h2 className="text-lg font-bold text-text-primary">
                    {t("purchasesTitle")}
                  </h2>
                  <p className="text-sm text-text-muted mb-5">
                    {t("purchasesLead")}
                  </p>

                  {entries.length === 0 ? (
                    <div className="py-10 text-center">
                      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-card-bg text-text-muted border border-border-subtle">
                        <ShoppingBag size={22} />
                      </div>
                      <p className="font-semibold text-text-primary mb-1">
                        {t("noPurchases")}
                      </p>
                      <p className="text-sm text-text-muted mb-5">
                        {t("noPurchasesHint")}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setTopUpOpen(true);
                          document
                            .getElementById("top-up")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        {t("topUp")}
                      </Button>
                    </div>
                  ) : (
                    <div>
                      {/* Table header (sm+) */}
                      <div className="hidden sm:grid grid-cols-[1.3fr_1.2fr_0.7fr_0.9fr] gap-4 px-3 pb-2 text-xs font-semibold text-text-muted">
                        <span>{t("colDate")}</span>
                        <span>{t("colType")}</span>
                        <span className="text-end">{t("colCredits")}</span>
                        <span className="text-end">{t("colAmount")}</span>
                      </div>
                      <div className="divide-y divide-border-subtle border-t border-border-subtle">
                        {entries.map((entry) => {
                          const zd = purchaseAmountDzd(entry);
                          const positive = entry.amount > 0;
                          return (
                            <div
                              key={entry.id}
                              className="grid grid-cols-2 sm:grid-cols-[1.3fr_1.2fr_0.7fr_0.9fr] gap-x-4 gap-y-1 px-3 py-3 text-sm"
                            >
                              <span className="text-text-secondary order-1">
                                {formatDate(entry.createdAt, locale)}
                              </span>
                              <span className="text-text-primary font-medium order-3 sm:order-2">
                                {t(
                                  TYPE_KEY[entry.type] ?? "typeAdjustment",
                                )}
                              </span>
                              <span
                                className={cn(
                                  "font-semibold tabular-nums order-4 sm:order-3 text-end",
                                  positive
                                    ? "text-accent-hover"
                                    : "text-text-secondary",
                                )}
                              >
                                {positive ? "+" : ""}
                                {entry.amount}
                              </span>
                              <span className="text-text-secondary tabular-nums order-5 sm:order-4 text-end">
                                {zd !== null ? `${zd} ${t("unit")}` : "—"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Top up */}
                <div
                  id="top-up"
                  className="rounded-2xl border border-accent/20 bg-accent-subtle p-6 scroll-mt-28"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-1">
                    <h2 className="text-lg font-bold text-text-primary">
                      {t("topUpTitle")}
                    </h2>
                    <Button
                      size="sm"
                      variant={topUpOpen ? "outline" : "default"}
                      onClick={() => setTopUpOpen((v) => !v)}
                    >
                      {t("topUp")}
                    </Button>
                  </div>

                  {topUpOpen && (
                    <div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                      {plans.map((plan, i) => (
                        <div
                          key={plan.name}
                          className="rounded-2xl border border-border/60 bg-white p-5 flex flex-col"
                        >
                          <p className="font-bold text-text-primary mb-0.5">
                            {plan.name}
                          </p>
                          <p className="text-xs text-text-muted mb-3">
                            {plan.tag}
                          </p>
                          <div className="flex items-baseline gap-1.5 mb-1">
                            <span className="text-3xl font-extrabold text-text-primary">
                              {plan.price}
                            </span>
                            <span className="text-sm text-text-secondary">
                              {plan.priceUnit}
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary mb-4">
                            {plan.credits} {plan.creditsUnit}
                          </p>
                          <div className="mt-auto">
                            <Button
                              size="sm"
                              className="w-full"
                              variant="outline"
                              disabled={busyIdx !== null}
                              onClick={() => void handleBuy(i)}
                            >
                              {busyIdx === i ? t("working") : t("buy")}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p
                    role="alert"
                    className="text-sm text-red-600 mt-3"
                  >
                    {payError ? t("err.payFail") : ""}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
