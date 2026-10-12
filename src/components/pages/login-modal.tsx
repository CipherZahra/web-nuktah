"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { signInWithPassword } from "@/lib/checkout";

const TURNSTILE_SITEKEY = "0x4AAAAAAFCsl8lNhObCk4Qw";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id: string) => void;
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
  const widgetIdRef = useRef<string | null>(null);
  const twRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

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

  // While open: render (or re-render) the widget, focus the email field,
  // lock page scroll, and wire Escape at the document level. State resets
  // happen via remount (`key` on the parent), not here — no setState in
  // effects. The widget is an external system, so DOM writes are fine.
  useEffect(() => {
    if (!open) return;
    tokenRef.current = "";
    emailRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

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
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = prevOverflow;
      };
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, renderWidget]);

  const trapFocus = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const focusables = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => el.offsetParent !== null);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!tokenRef.current) {
      setErrorKey("captchaMissing");
      return;
    }
    setBusy(true);
    setErrorKey("");
    try {
      await signInWithPassword(email.trim(), password, tokenRef.current);
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

  const inputCls =
    "w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-2 focus:outline-accent/50 focus:border-accent transition-colors";

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
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="absolute top-3 end-3 grid h-8 w-8 place-items-center rounded-lg border border-border bg-card-bg text-text-muted transition-colors hover:text-text-primary hover:border-accent/50 cursor-pointer"
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

        <form onSubmit={submit} noValidate className="space-y-3">
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-semibold text-text-muted"
            >
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
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold text-text-muted"
            >
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
          <p role="alert" className="text-sm text-red-600">
            {errorKey ? t(`err.${errorKey}`) : ""}
          </p>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl px-4 py-3 text-sm font-bold bg-accent text-white transition-colors disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer"
          >
            {busy ? t("login.working") : t("login.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
