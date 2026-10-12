"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.PUBLIC_SUPABASE_URL ??
  "https://qyugsyzfcygfmfeyyrjd.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.PUBLIC_SUPABASE_ANON_KEY ?? "";
const TURNSTILE_SITEKEY = "0x4AAAAAAFCsl8lNhObCk4Qw";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}

async function authPost(path: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1${path}`, {
    method: "POST",
    headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new Error(String(data.error_description ?? data.msg ?? data.message ?? "error"));
  }
  return data;
}

export function DeleteWizard() {
  const t = useTranslations("legal.deleteWizard");
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorKey, setErrorKey] = useState("");
  const tokenRef = useRef("");
  const accessTokenRef = useRef("");
  const widgetIdRef = useRef<string | null>(null);
  const twRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) return;
    const ts = document.createElement("script");
    ts.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    ts.async = true;
    document.head.appendChild(ts);
  }, []);

  const renderWidget = useCallback(() => {
    if (!window.turnstile || !twRef.current) return;
    twRef.current.innerHTML = "";
    widgetIdRef.current = window.turnstile.render(twRef.current, {
      sitekey: TURNSTILE_SITEKEY,
      theme: "auto",
      callback: (v: string) => {
        tokenRef.current = v;
      },
      "expired-callback": () => {
        tokenRef.current = "";
      },
      "error-callback": () => {
        tokenRef.current = "";
      },
    });
  }, []);

  useEffect(() => {
    if (step !== 1 && step !== 2) return;
    if (window.turnstile) {
      renderWidget();
      return;
    }
    const iv = setInterval(() => {
      if (window.turnstile) {
        clearInterval(iv);
        renderWidget();
      }
    }, 100);
    return () => clearInterval(iv);
  }, [step, renderWidget]);

  useEffect(() => {
    const incoming = new URLSearchParams(window.location.search).get("code");
    if (!incoming) return;
    (async () => {
      try {
        const session = await authPost("/token?grant_type=pkce", { auth_code: incoming });
        accessTokenRef.current = String(session.access_token ?? "");
        const u = session.user as { email?: string } | undefined;
        if (u?.email) setEmail(u.email);
        window.history.replaceState(null, "", window.location.pathname);
        setStep(3);
      } catch {
        /* stay on step 1 */
      }
    })();
  }, []);

  async function send() {
    setErrorKey("");
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrorKey("errEmail");
      return;
    }
    if (!tokenRef.current) {
      setErrorKey("errCaptcha");
      return;
    }
    setBusy(true);
    try {
      await authPost("/otp", {
        email: value,
        create_user: true,
        redirect_to: window.location.origin + window.location.pathname,
        captcha_token: tokenRef.current,
        "g-recaptcha-response": tokenRef.current,
      });
      setStep(2);
    } catch {
      setErrorKey("errSend");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode() {
    setErrorKey("");
    if (code.trim().length < 4) {
      setErrorKey("errVerify");
      return;
    }
    setBusy(true);
    try {
      const session = await authPost("/verify", { type: "email", email, token: code.trim() });
      accessTokenRef.current = String(session.access_token ?? "");
      setStep(3);
    } catch {
      setErrorKey("errVerify");
    } finally {
      setBusy(false);
    }
  }

  async function doDelete() {
    setErrorKey("");
    setBusy(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/delete-user`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessTokenRef.current}`,
        },
      });
      if (!res.ok) throw new Error();
      setStep(4);
    } catch {
      setErrorKey("errDelete");
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    try {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessTokenRef.current}`,
        },
      });
    } catch {
      /* ignore */
    }
    tokenRef.current = "";
    accessTokenRef.current = "";
    setEmail("");
    setCode("");
    setErrorKey("");
    setStep(1);
  }

  const inputCls =
    "w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-2 focus:outline-accent/50 focus:border-accent transition-colors";
  const btnBase =
    "w-full rounded-xl px-4 py-3 text-sm font-bold transition-colors disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer";

  return (
    <div className="mt-10 rounded-2xl border border-border bg-white p-6 md:p-8" aria-live="polite">
      {step === 1 && (
        <div className="space-y-3">
          <label htmlFor="del-email" className="block text-xs font-semibold text-text-muted">
            {t("emailLabel")}
          </label>
          <input
            id="del-email"
            type="email"
            autoComplete="email"
            dir="ltr"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
          />
          <div ref={twRef} className="flex justify-center min-h-[65px]" />
          <p role="alert" className="text-sm text-red-600">
            {errorKey ? t(errorKey) : ""}
          </p>
          <button type="button" onClick={send} disabled={busy} className={`${btnBase} bg-accent text-white`}>
            {busy ? t("sendingBtn") : t("sendBtn")}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <p className="text-sm text-text-secondary">{t("sentMsg", { email })}</p>
          <div ref={twRef} className="flex justify-center min-h-[65px]" />
          <label htmlFor="del-code" className="block text-xs font-semibold text-text-muted">
            {t("codeLabel")}
          </label>
          <div className="flex gap-2">
            <input
              id="del-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              dir="ltr"
              placeholder="······"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={inputCls}
            />
            <button
              type="button"
              onClick={verifyCode}
              disabled={busy}
              className={`${btnBase} w-auto whitespace-nowrap bg-accent text-white`}
            >
              {busy ? t("verifyingBtn") : t("verifyBtn")}
            </button>
          </div>
          <p role="alert" className="text-sm text-red-600">
            {errorKey ? t(errorKey) : ""}
          </p>
          <button type="button" onClick={send} disabled={busy} className={`${btnBase} border border-border bg-white text-text-primary`}>
            {t("resendBtn")}
          </button>
          <button type="button" onClick={() => { setStep(1); setErrorKey(""); }} className={`${btnBase} bg-transparent text-text-secondary`}>
            {t("backBtn")}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">{t("confirmMsg", { email })}</p>
          <p role="alert" className="text-sm text-red-600">
            {errorKey ? t(errorKey) : ""}
          </p>
          <button type="button" onClick={doDelete} disabled={busy} className={`${btnBase} bg-red-600 text-white`}>
            {busy ? t("deletingBtn") : t("deleteBtn")}
          </button>
          <button type="button" onClick={cancel} disabled={busy} className={`${btnBase} bg-transparent text-text-secondary`}>
            {t("cancelBtn")}
          </button>
        </div>
      )}

      {step === 4 && <p className="text-sm font-bold text-accent-hover">{t("successMsg")}</p>}
    </div>
  );
}
