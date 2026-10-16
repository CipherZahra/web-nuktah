const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.PUBLIC_SUPABASE_URL ??
  "https://qyugsyzfcygfmfeyyrjd.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.PUBLIC_SUPABASE_ANON_KEY ??
  "";

const SESSION_KEY = "nuktah:web-session";

export interface WebSession {
  accessToken: string;
  refreshToken: string;
  /** Epoch seconds. */
  expiresAt: number;
}

function loadSession(): WebSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<WebSession>;
    if (
      typeof parsed.accessToken !== "string" ||
      typeof parsed.refreshToken !== "string" ||
      typeof parsed.expiresAt !== "number"
    ) {
      return null;
    }
    return {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
}

function saveSession(session: WebSession | null): void {
  if (typeof window === "undefined") return;
  try {
    if (session) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    /* storage unavailable (private mode) — behave as signed out */
  }
}

/** Carries the HTTP status so callers can tell auth rejections from network failures. */
class AuthHttpError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function authPost(
  path: string,
  body: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1${path}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new AuthHttpError(
      String(data.error_description ?? data.msg ?? data.message ?? "error"),
      res.status,
    );
  }
  return data;
}

function toSession(data: Record<string, unknown>): WebSession | null {
  const accessToken =
    typeof data.access_token === "string" ? data.access_token : null;
  const refreshToken =
    typeof data.refresh_token === "string" ? data.refresh_token : null;
  if (!accessToken || !refreshToken) return null;
  const expiresAt =
    typeof data.expires_at === "number" && data.expires_at > 0
      ? data.expires_at
      : typeof data.expires_in === "number"
        ? Math.floor(Date.now() / 1000) + data.expires_in
        : Math.floor(Date.now() / 1000) + 3600;
  return { accessToken, refreshToken, expiresAt };
}

/** Signs in with email + password (Turnstile-verified) and persists the session. */
export async function signInWithPassword(
  email: string,
  password: string,
  captchaToken: string,
): Promise<void> {
  // GoTrue reads the Turnstile token from gotrue_meta_security.captcha_token
  // (the wrapper supabase-js adds) — a top-level field is silently ignored.
  const data = await authPost("/token?grant_type=password", {
    email,
    password,
    gotrue_meta_security: { captcha_token: captchaToken },
  });
  const session = toSession(data);
  if (!session) throw new Error("session");
  saveSession(session);
}

/**
 * Returns the persisted session, transparently refreshing it when close to
 * expiry, or null when there is none (or the refresh fails — signed out).
 * Concurrent callers share one in-flight refresh (single-flight) so rotated
 * refresh tokens are never spent twice.
 */
let refreshInFlight: Promise<WebSession | null> | null = null;

export async function getValidSession(): Promise<WebSession | null> {
  const session = loadSession();
  if (!session) return null;
  if (session.expiresAt > Math.floor(Date.now() / 1000) + 30) return session;
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    try {
      const data = await authPost("/token?grant_type=refresh_token", {
        refresh_token: session.refreshToken,
      });
      const next = toSession(data);
      if (!next) throw new AuthHttpError("session", 400);
      saveSession(next);
      return next;
    } catch (e) {
      // Only an auth rejection (4xx) burns the session — network failures and
      // server errors keep it, the refresh token may still be perfectly valid.
      if (e instanceof AuthHttpError && e.status >= 400 && e.status < 500) {
        saveSession(null);
      }
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

export interface UserProfile {
  id: string;
  email: string;
}

/** Fetches the signed-in user's id + email from GoTrue. */
export async function getUserProfile(): Promise<UserProfile | null> {
  const session = await getValidSession();
  if (!session) return null;
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${session.accessToken}`,
    },
  });
  if (!res.ok) return null;
  const data = (await res.json().catch(() => ({}))) as {
    id?: unknown;
    email?: unknown;
  };
  if (typeof data.id !== "string" || typeof data.email !== "string") return null;
  return { id: data.id, email: data.email };
}

/**
 * Clears the local session. Purely client-side — works even when the network
 * is down (web.dev sign-out guidance): the tokens are discarded either way.
 */
export function signOut(): void {
  saveSession(null);
}

export interface CheckoutCustomer {
  name: string;
  email?: string;
  phone?: string;
}

export interface CheckoutOptions {
  /**
   * Payer details collected by the website's prefill modal. Sent to
   * payment-create, which attaches them as a Chargily Customer so the
   * hosted page loads read-only prefilled.
   */
  customer?: CheckoutCustomer;
  /** Pre-selects the method on the Chargily page (user can still switch). */
  paymentMethod?: "edahabia" | "cib";
  /** Credit count for the 'custom' package — price is derived server-side. */
  credits?: number;
}

// Custom offer — mirrors the server's bounds (supabase/functions/_shared/
// packages.ts). The client only ever sends the credit count.
export const CUSTOM_RATE_DZD = 50;
export const CUSTOM_MIN_CREDITS = 5;
export const CUSTOM_MAX_CREDITS = 200;

/** Chargily-hosted pages only — blocks a compromised/misconfigured function from redirecting elsewhere. */
function isAllowedCheckoutUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return false;
    return /(^|\.)chargily\.[a-z]{2,}$/i.test(url.hostname);
  } catch {
    return false;
  }
}

/**
 * Creates a Chargily checkout session for the package (server resolves the
 * price from its own catalog) and redirects the browser to the hosted page.
 * `channel: "web"` makes payment-create return the nuktah.app success/failure
 * pages instead of the app's nuktah:// deep links.
 */
export async function startCheckout(
  packageId: string,
  locale: string,
  options?: CheckoutOptions,
): Promise<void> {
  const session = await getValidSession();
  if (!session) throw new Error("unauthorized");

  const customer = options?.customer
    ? {
        ...options.customer,
        ...(options.customer.email ? {} : { email: undefined }),
      }
    : undefined;

  const res = await fetch(`${SUPABASE_URL}/functions/v1/payment-create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify({
      packageId,
      locale,
      channel: "web",
      ...(options?.credits !== undefined ? { credits: options.credits } : {}),
      ...(customer ? { customer } : {}),
      ...(options?.paymentMethod
        ? { paymentMethod: options.paymentMethod }
        : {}),
    }),
  });
  const body = (await res.json().catch(() => ({}))) as {
    checkoutUrl?: unknown;
  };
  const checkoutUrl =
    typeof body.checkoutUrl === "string" ? body.checkoutUrl : null;
  if (!res.ok || !checkoutUrl) throw new Error("checkout");
  if (!isAllowedCheckoutUrl(checkoutUrl)) throw new Error("checkout_url");

  window.location.assign(checkoutUrl);
}
