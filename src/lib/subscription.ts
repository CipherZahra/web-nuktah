import { getValidSession } from "@/lib/checkout";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.PUBLIC_SUPABASE_URL ??
  "https://qyugsyzfcygfmfeyyrjd.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.PUBLIC_SUPABASE_ANON_KEY ??
  "";

export interface LatestInvoice {
  id: string;
  status: string;
  amount: number;
  currency: string | null;
  paidAt: string | null;
  providerInvoiceId: string | null;
}

export interface SubscriptionStatus {
  tier: "free" | "pro";
  active: boolean;
  scanCreditsRemaining: number;
  importsRemaining: number;
  hasPurchasedCredits: boolean;
  latestInvoice: LatestInvoice | null;
}

export interface LedgerEntry {
  id: string;
  type: string;
  amount: number;
  reference: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

/**
 * Reads the caller's credit-ledger history (newest first, max 100) from the
 * `billing-history` Edge Function. Null on any failure.
 */
export async function fetchBillingHistory(): Promise<LedgerEntry[] | null> {
  const session = await getValidSession();
  if (!session) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/billing-history`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as unknown;
    if (!Array.isArray(body)) return null;
    return body
      .filter(
        (r): r is Record<string, unknown> =>
          typeof r === "object" && r !== null && typeof r.id === "string",
      )
      .map((r) => ({
        id: String(r.id),
        type: String(r.type ?? ""),
        amount: typeof r.amount === "number" ? r.amount : 0,
        reference: typeof r.reference === "string" ? r.reference : null,
        metadata:
          typeof r.metadata === "object" && r.metadata !== null
            ? (r.metadata as Record<string, unknown>)
            : null,
        createdAt: String(r.createdAt ?? ""),
      }));
  } catch {
    return null;
  }
}


/**
 * Reads the caller's wallet state from the `subscription-status` Edge
 * Function. Returns null when signed out or on any failure — callers treat
 * both the same way (signed-out prompt / retry state).
 */
export async function fetchSubscriptionStatus(): Promise<SubscriptionStatus | null> {
  const session = await getValidSession();
  if (!session) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/subscription-status`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as Partial<SubscriptionStatus>;
    if (
      (body.tier !== "free" && body.tier !== "pro") ||
      typeof body.scanCreditsRemaining !== "number" ||
      typeof body.importsRemaining !== "number"
    ) {
      return null;
    }
    return {
      tier: body.tier,
      active: body.tier === "pro",
      scanCreditsRemaining: body.scanCreditsRemaining,
      importsRemaining: body.importsRemaining,
      hasPurchasedCredits: body.hasPurchasedCredits === true,
      latestInvoice: body.latestInvoice ?? null,
    };
  } catch {
    return null;
  }
}
