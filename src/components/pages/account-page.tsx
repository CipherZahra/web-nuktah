"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  AlertTriangle,
  Coins,
  LayoutGrid,
  LogOut,
  ReceiptText,
  ScanLine,
  ShoppingBag,
} from "lucide-react";

import { getValidSession, getUserProfile, signOut } from "@/lib/checkout";
import {
  fetchBillingHistory,
  fetchSubscriptionStatus,
  type LedgerEntry,
  type SubscriptionStatus,
} from "@/lib/subscription";
import { LoginModal } from "@/components/pages/login-modal";
import { TopUpModal } from "@/components/pages/topup-modal";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n";
import { cn } from "@/lib/utils";

/** Server catalog order in supabase/functions/_shared/packages.ts. */
const PACKAGE_IDS = ["starter", "standard", "plus", "teacher"];

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

const USAGE_TYPES = new Set(["SCAN", "IMPORT", "EXPORT"]);

/** One aggregated usage row: same calendar day + same action. */
type UsageGroup = {
  key: string;
  dateLabel: string;
  type: string;
  count: number;
  credits: number;
};

function aggregateUsage(entries: LedgerEntry[], locale: string): UsageGroup[] {
  const map = new Map<string, UsageGroup>();
  for (const e of entries) {
    if (!USAGE_TYPES.has(e.type)) continue;
    const dateLabel = formatDate(e.createdAt, locale);
    const key = `${dateLabel}|${e.type}`;
    const g = map.get(key);
    if (g) {
      g.count += 1;
      g.credits += e.amount;
    } else {
      map.set(key, {
        key,
        dateLabel,
        type: e.type,
        count: 1,
        credits: e.amount,
      });
    }
  }
  return [...map.values()];
}

function formatDate(iso: string, locale: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

function purchaseAmountDzd(
  entry: LedgerEntry,
  plans: { credits: string; price: string }[],
): number | null {
  if (entry.type !== "PURCHASE") return null;
  const centimes = entry.metadata?.amount_centimes;
  if (typeof centimes === "number") return centimes / 100;
  // Older ledger rows predate amount_centimes — recover the price from the
  // catalog by matching the granted credits count.
  const credits = entry.metadata?.credits;
  if (typeof credits === "number") {
    const plan = plans.find((p) => Number(p.credits) === credits);
    if (plan) return Number(plan.price);
  }
  return null;
}

/** Catalog display name for a purchase's package_id ("starter" → "Starter pack"). */
function purchasePlanName(
  entry: LedgerEntry,
  plans: { name: string }[],
): string | null {
  if (entry.type !== "PURCHASE") return null;
  const pkg = entry.metadata?.package_id;
  if (typeof pkg !== "string") return null;
  const idx = PACKAGE_IDS.indexOf(pkg);
  return idx >= 0 ? (plans[idx]?.name ?? null) : null;
}

/** Localized DZD amount with thousands grouping, no decimals. */
function formatDzd(amount: number, locale: string): string {
  return (
    new Intl.NumberFormat(locale === "ar" ? "ar-DZ" : "en-DZ", {
      style: "currency",
      currency: "DZD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  );
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
  const [checkoutIdx, setCheckoutIdx] = useState<number | null>(null);
  const [historyTab, setHistoryTab] = useState<"purchases" | "usage">(
    "purchases",
  );

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
  const balance = status?.scanCreditsRemaining ?? 0;
  const freeImport = status?.importsRemaining ?? 0;
  const showLowBalance = balance <= 1;
  // Ledger amounts are already signed server-side (purchases positive,
  // spend rows 0 or -1) — never flip the sign here.
  const purchaseEntries = history.filter((e) => !USAGE_TYPES.has(e.type));
  const usageGroups = aggregateUsage(history, locale);

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
    value: React.ReactNode,
    valueClass: string,
    footer?: React.ReactNode,
  ) => (
    <div className="rounded-2xl border border-border/60 bg-white p-6">
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-accent-subtle text-accent">
        {icon}
      </div>
      <p className="text-sm text-text-muted mb-1">{label}</p>
      <p className={cn("text-5xl font-extrabold tracking-tight", valueClass)}>
        {value}
      </p>
      {footer}
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
                    <Coins size={22} />,
                    t("balance"),
                    balance,
                    balance === 0
                      ? "text-red-600"
                      : showLowBalance
                        ? "text-text-muted"
                        : "text-text-primary",
                    freeImport > 0 ? (
                      <p className="mt-2 text-xs text-text-muted">
                        {t("freeImportHint")}
                      </p>
                    ) : undefined,
                  )}
                  {kpiCard(
                    <LayoutGrid size={22} />,
                    t("plan"),
                    tierBadge("md"),
                    "",
                    <p className="mt-2 text-xs text-text-muted">
                      {tierPro ? t("planProDesc") : t("planFreeDesc")}
                    </p>,
                  )}
                </div>

                {/* Low-balance banner */}
                {showLowBalance && (
                  <div
                    role="status"
                    className={cn(
                      "mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-5 py-4",
                      balance === 0
                        ? "border-red-200 bg-red-50"
                        : "border-amber-200 bg-amber-50",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle
                        size={18}
                        className={
                          balance === 0 ? "text-red-600" : "text-amber-600"
                        }
                      />
                      <p className="text-sm font-medium text-text-primary">
                        {balance === 0 ? t("noBalance") : t("lowBalance")}
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

                {/* Purchases / usage history */}
                <div
                  id="purchases"
                  className="rounded-2xl border border-border/60 bg-white p-6 mb-6 scroll-mt-28"
                >
                  <h2 className="text-lg font-bold text-text-primary">
                    {t("purchasesTitle")}
                  </h2>
                  <p className="text-sm text-text-muted mb-4">
                    {t("purchasesLead")}
                  </p>

                  {/* Segmented toggle: Purchases vs Usage */}
                  <div
                    role="tablist"
                    aria-label={t("purchasesTitle")}
                    className="inline-flex rounded-xl border border-border-subtle bg-card-bg p-1 mb-5"
                  >
                    {(["purchases", "usage"] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        role="tab"
                        aria-selected={historyTab === tab}
                        onClick={() => setHistoryTab(tab)}
                        className={cn(
                          "rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors",
                          historyTab === tab
                            ? "bg-white text-text-primary shadow-sm"
                            : "text-text-secondary hover:text-text-primary",
                        )}
                      >
                        {t(tab === "purchases" ? "tabPurchases" : "tabUsage")}
                      </button>
                    ))}
                  </div>

                  {historyTab === "purchases" ? (
                    purchaseEntries.length === 0 ? (
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
                          {purchaseEntries.map((entry) => {
                            const zd = purchaseAmountDzd(entry, plans);
                            const planName = purchasePlanName(entry, plans);
                            const signed = entry.amount;
                            const positive = signed > 0;
                            return (
                              <div
                                key={entry.id}
                                className="grid grid-cols-2 sm:grid-cols-[1.3fr_1.2fr_0.7fr_0.9fr] gap-x-4 gap-y-1 px-3 py-3 text-sm"
                              >
                                <span className="text-text-secondary order-1">
                                  {formatDate(entry.createdAt, locale)}
                                </span>
                                <span className="text-text-primary font-medium order-3 sm:order-2">
                                  {planName ??
                                    t(TYPE_KEY[entry.type] ?? "typeAdjustment")}
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
                                  {signed}
                                </span>
                                <span className="text-text-secondary tabular-nums order-5 sm:order-4 text-end">
                                  {zd !== null ? formatDzd(zd, locale) : "—"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  ) : usageGroups.length === 0 ? (
                    <div className="py-10 text-center">
                      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-card-bg text-text-muted border border-border-subtle">
                        <ScanLine size={22} />
                      </div>
                      <p className="font-semibold text-text-primary mb-1">
                        {t("noUsage")}
                      </p>
                      <p className="text-sm text-text-muted">
                        {t("noUsageHint")}
                      </p>
                    </div>
                  ) : (
                    <div>
                      {/* Table header (sm+) */}
                      <div className="hidden sm:grid grid-cols-[1.3fr_1.2fr_0.7fr] gap-4 px-3 pb-2 text-xs font-semibold text-text-muted">
                        <span>{t("colDate")}</span>
                        <span>{t("colType")}</span>
                        <span className="text-end">{t("colCredits")}</span>
                      </div>
                      <div className="divide-y divide-border-subtle border-t border-border-subtle">
                        {usageGroups.map((group) => (
                          <div
                            key={group.key}
                            className="grid grid-cols-2 sm:grid-cols-[1.3fr_1.2fr_0.7fr] gap-x-4 gap-y-1 px-3 py-3 text-sm"
                          >
                            <span className="text-text-secondary order-1">
                              {group.dateLabel}
                            </span>
                            <span className="text-text-primary font-medium order-3 sm:order-2">
                              {t(TYPE_KEY[group.type] ?? "typeAdjustment")}
                              {group.count > 1 ? ` ×${group.count}` : ""}
                            </span>
                            <span
                              className={cn(
                                "font-semibold tabular-nums order-4 sm:order-3 text-end",
                                group.credits === 0
                                  ? "text-accent-hover font-medium"
                                  : "text-text-secondary",
                              )}
                            >
                              {group.credits === 0
                                ? t("freeLabel")
                                : group.credits}
                            </span>
                          </div>
                        ))}
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
                              onClick={() => setCheckoutIdx(i)}
                            >
                              {t("buy")}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {checkoutIdx !== null && (
        <TopUpModal
          key={`topup-${checkoutIdx}`}
          open
          packageId={PACKAGE_IDS[checkoutIdx]}
          packName={plans[checkoutIdx]?.name ?? ""}
          packMeta={`${plans[checkoutIdx]?.credits} ${plans[checkoutIdx]?.creditsUnit} · ${plans[checkoutIdx]?.price} ${plans[checkoutIdx]?.priceUnit}`}
          locale={locale}
          email={email ?? ""}
          onClose={() => setCheckoutIdx(null)}
        />
      )}
    </section>
  );
}
