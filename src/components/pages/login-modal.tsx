"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";

import { signInWithPassword } from "@/lib/checkout";
import { inputCls, labelCls } from "@/lib/form-ui";
import { useModalDialog } from "@/lib/use-modal-dialog";

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

type ErrKey =
  | "badCreds"
  | "captchaMissing"
  | "captchaRejected"
  | "rate"
  | "confirm"
  | "generic";

function mapAuthError(message: string): ErrKey {
  const s = message.toLowerCase();
  if (s.includes("invalid login")) return "badCreds";
  if (
    s.includes("captcha") ||
    s.includes("turnstile") ||
    s.includes("security check")
  ) {
    return "captchaRejected";
  }
  if (s.includes("rate") || s.includes("too many")) return "rate";
  if (s.includes("confirm")) return "confirm";
  return "generic";
}

interface LoginModalProps {
  open: boolean;
  /** Package name shown in the pending-purchase row. */
  packName?: string;
  /** Package details line (credits · price). */
  packMeta?: string;
  onClose: () => void;
  /** Called after a successful sign-in — the caller resumes checkout. */
  onSuccess: () => void;
}

export function LoginModal({
  open,
  packName,
  packMeta,
  onClose,
  onSuccess,
}: LoginModalProps) {
  const t = useTranslations("pricing");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorKey, setErrorKey] = useState<ErrKey | "">("");
  const tokenRef = useRef("");
  const isInteractiveRef = useRef(false);
  const widgetErrorRef = useRef(false);
  const widgetIdRef = useRef<string | null>(null);
  const twRef = useRef<HTMLDivElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const { dialogRef, trapFocus } = useModalDialog(open, onClose, emailRef);

  // Load the Turnstile script once (shared with the delete wizard's pattern).
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (
      document.querySelector(
        'script[src*="challenges.cloudflare.com/turnstile"]',
      )
    )
      return;
    const ts = document.createElement("script");
    ts.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    ts.async = true;
    document.head.appendChild(ts);
  }, []);

  // Remove the previous widget through the API before wiping its DOM —
  // innerHTML alone orphans the instance and Turnstile logs
  // "Cannot find Widget … consider using turnstile.remove()" (StrictMode
  // double-mounts this effect in dev, so this path runs for real).
  const destroyWidget = useCallback(() => {
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.remove(widgetIdRef.current);
    }
    widgetIdRef.current = null;
    if (twRef.current) twRef.current.innerHTML = "";
    tokenRef.current = "";
    isInteractiveRef.current = false;
    widgetErrorRef.current = false;
  }, []);

  const renderWidget = useCallback(() => {
    if (!window.turnstile || !twRef.current) return;
    destroyWidget();
    widgetErrorRef.current = false;
    isInteractiveRef.current = false;
    widgetIdRef.current = window.turnstile.render(twRef.current, {
      sitekey: TURNSTILE_SITEKEY,
      theme: "light",
      appearance: "interaction-only",
      callback: (v: string) => {
        tokenRef.current = v;
        isInteractiveRef.current = false;
      },
      "before-interactive-callback": () => {
        isInteractiveRef.current = true;
      },
      "after-interactive-callback": () => {
        isInteractiveRef.current = false;
      },
      "expired-callback": () => {
        tokenRef.current = "";
      },
      "error-callback": () => {
        tokenRef.current = "";
        widgetErrorRef.current = true;
        isInteractiveRef.current = false;
      },
    });
  }, [destroyWidget]);

  // While open: (re-)render the Turnstile widget. Focus, scroll-lock and
  // Escape live in useModalDialog. State resets happen via remount (`key`
  // on the parent), not here — no setState in effects. The widget is an
  // external system, so DOM writes are fine.
  useEffect(() => {
    if (!open) return;
    tokenRef.current = "";

    if (window.turnstile) {
      renderWidget();
    } else {
      const iv = setInterval(() => {
        if (window.turnstile) {
          clearInterval(iv);
          renderWidget();
        }
      }, 100);
      return () => {
        clearInterval(iv);
        destroyWidget();
      };
    }
    return destroyWidget;
  }, [open, renderWidget, destroyWidget]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;

    // If an interactive checkbox is currently displayed and uncompleted, prompt to check it.
    if (isInteractiveRef.current && !tokenRef.current) {
      setErrorKey("captchaMissing");
      return;
    }

    setBusy(true);
    setErrorKey("");

    let token = tokenRef.current;
    if (!token) {
      try {
        // Turnstile verifies silently in the background: wait briefly for the token
        // to complete without prematurely showing a false-positive "check the box" error.
        token = await new Promise<string>((resolve, reject) => {
          const start = Date.now();
          const iv = setInterval(() => {
            if (tokenRef.current) {
              clearInterval(iv);
              resolve(tokenRef.current);
            } else if (widgetErrorRef.current) {
              clearInterval(iv);
              reject(new Error("error"));
            } else if (isInteractiveRef.current) {
              clearInterval(iv);
              reject(new Error("interactive"));
            } else if (Date.now() - start >= 5000) {
              clearInterval(iv);
              reject(new Error("timeout"));
            }
          }, 80);
        });
      } catch (err) {
        setBusy(false);
        if (err instanceof Error && err.message === "interactive") {
          setErrorKey("captchaMissing");
        } else if (err instanceof Error && err.message === "error") {
          setErrorKey("captchaRejected");
        } else {
          setErrorKey("captchaMissing");
        }
        return;
      }
    }

    try {
      await signInWithPassword(email.trim(), password, token);
      onSuccess();
    } catch (err) {
      setErrorKey(mapAuthError(err instanceof Error ? err.message : "error"));
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
        tokenRef.current = "";
      }
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center p-4"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-[3px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        onKeyDown={trapFocus}
        className="relative w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl border border-border bg-white p-6 shadow-lg"
      >
        {/* Sticky in-flow close button: owns its own row at the top (nothing
            can sit under it) and stays pinned while a long dialog scrolls. */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="sticky top-3 z-20 ms-auto mb-4 grid h-8 w-8 place-items-center rounded-lg border border-border bg-card-bg text-text-muted transition-colors hover:text-text-primary hover:border-accent/50 cursor-pointer"
        >
          <X size={16} strokeWidth={2.4} />
        </button>

        {packName && (
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3 rounded-xl border border-accent/35 bg-accent-subtle px-4 py-3">
            <span className="font-bold text-text-primary">{packName}</span>
            <span className="text-sm text-text-secondary">{packMeta}</span>
          </div>
        )}

        <h3
          id="login-modal-title"
          className="pe-8 text-lg font-bold text-text-primary"
        >
          {t("login.title")}
        </h3>
        <p className="mt-1 mb-4 text-sm text-text-secondary">
          {t("login.hint")}
        </p>

        <form onSubmit={submit} noValidate className="space-y-4">
          <div>
            <label htmlFor="login-email" className={labelCls}>
              {t("login.email")}
            </label>
            <input
              id="login-email"
              ref={emailRef}
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              dir="ltr"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="login-password" className={labelCls}>
              {t("login.password")}
            </label>
            <input
              id="login-password"
              type="password"
              name="password"
              autoComplete="current-password"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
          </div>
          <div ref={twRef} className="flex justify-center min-h-[65px]" />
          {errorKey && (
            <p role="alert" className="text-sm text-red-600">
              {t(`err.${errorKey}`)}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl px-4 py-3 text-sm font-bold bg-accent text-white transition-colors disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer"
          >
            {busy ? t("login.working") : t("login.submit")}
          </button>
        </form>
        <p className="mt-4 text-xs text-text-muted">
          {t("login.resetHint")}
        </p>
      </div>
    </div>
  );
}
