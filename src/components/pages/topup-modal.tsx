"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState, type FormEvent } from "react";

import {
  CUSTOM_MAX_CREDITS,
  CUSTOM_MIN_CREDITS,
  CUSTOM_RATE_DZD,
  startCheckout,
} from "@/lib/checkout";
import { useModalDialog } from "@/lib/use-modal-dialog";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n";

type PaymentMethod = "edahabia" | "cib";

/** Quick-select credit counts for the custom offer. */
const CUSTOM_CHIPS = [5, 10, 20, 50];

interface TopUpModalProps {
  open: boolean;
  /** Index into the pricing plans array (maps to PACKAGE_IDS order). */
  packageId: string;
  /** Package name shown in the summary row. */
  packName: string;
  /** Package details line (credits · price). */
  packMeta: string;
  locale: string;
  /** Account email — prefilled into the form. */
  email: string;
  onClose: () => void;
}

/**
 * Payer-prefill step between "Buy" and the Chargily hosted page. Collects
 * the name/email/phone Chargily needs so its page loads read-only prefilled
 * (an email-only customer would lock name/phone blank — probe-verified),
 * plus the payment-method choice to pre-select on their side.
 */
export function TopUpModal({
  open,
  packageId,
  packName,
  packMeta,
  locale,
  email,
  onClose,
}: TopUpModalProps) {
  const t = useTranslations("account");
  const isCustom = packageId === "custom";
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("edahabia");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [credits, setCredits] = useState<number>(CUSTOM_MIN_CREDITS);
  const [creditsDraft, setCreditsDraft] = useState<string>(
    String(CUSTOM_MIN_CREDITS),
  );
  const [error, setError] = useState<"" | "name" | "phone" | "credits" | "pay">(
    "",
  );
  const nameRef = useRef<HTMLInputElement | null>(null);
  const { dialogRef, trapFocus } = useModalDialog(open, onClose, nameRef);

  const creditsValid =
    !isCustom ||
    (/^\d+$/.test(creditsDraft.trim()) &&
      Number(creditsDraft) >= CUSTOM_MIN_CREDITS &&
      Number(creditsDraft) <= CUSTOM_MAX_CREDITS);

  const applyCredits = (value: string) => {
    setCreditsDraft(value);
    const n = Number(value);
    if (
      /^\d+$/.test(value.trim()) &&
      n >= CUSTOM_MIN_CREDITS &&
      n <= CUSTOM_MAX_CREDITS
    ) {
      setCredits(n);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy || !agreeTerms) return;
    if (isCustom && !creditsValid) {
      setError("credits");
      return;
    }
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    if (trimmedName.length < 2) {
      setError("name");
      nameRef.current?.focus();
      return;
    }
    if (trimmedPhone && !/^\+?\d{8,15}$/.test(trimmedPhone)) {
      setError("phone");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await startCheckout(packageId, locale, {
        customer: {
          name: trimmedName,
          email,
          ...(trimmedPhone ? { phone: trimmedPhone } : {}),
        },
        paymentMethod: method,
        ...(isCustom ? { credits } : {}),
      });
      // Navigation away — keep the spinner.
    } catch {
      setBusy(false);
      setError("pay");
    }
  };

  if (!open) return null;

  const inputCls =
    "w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-2 focus:outline-accent/50 focus:border-accent transition-colors";

  const methodBtn = (m: PaymentMethod, label: string, hint: string) => (
    <button
      key={m}
      type="button"
      onClick={() => setMethod(m)}
      aria-pressed={method === m}
      className={cn(
        "flex-1 rounded-xl border px-4 py-3 text-start transition-colors cursor-pointer",
        method === m
          ? "border-accent bg-accent-subtle"
          : "border-border bg-white hover:border-accent/40",
      )}
    >
      <span className="block text-sm font-bold text-text-primary">{label}</span>
      <span className="block text-xs text-text-muted mt-0.5">{hint}</span>
    </button>
  );

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
        aria-labelledby="topup-modal-title"
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

        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3 rounded-xl border border-accent/35 bg-accent-subtle px-4 py-3">
          <span className="font-bold text-text-primary">{packName}</span>
          <span className="text-sm text-text-secondary">
            {isCustom
              ? t("checkout.customPriceLine", {
                  credits,
                  rate: CUSTOM_RATE_DZD,
                  total: credits * CUSTOM_RATE_DZD,
                })
              : packMeta}
          </span>
        </div>

        <h3
          id="topup-modal-title"
          className="pe-8 text-lg font-bold text-text-primary"
        >
          {t("checkout.title")}
        </h3>
        <p className="mt-1 mb-4 text-sm text-text-secondary">
          {t("checkout.hint")}
        </p>

        <form onSubmit={submit} noValidate className="space-y-3">
          {isCustom && (
            <fieldset className="rounded-xl border border-border bg-card-bg/50 p-3">
              <legend className="px-1 text-xs font-semibold text-text-muted">
                {t("checkout.customTitle")}
              </legend>
              <div className="flex flex-wrap gap-2 mb-2.5">
                {CUSTOM_CHIPS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => applyCredits(String(c))}
                    aria-pressed={credits === c && creditsDraft === String(c)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors cursor-pointer",
                      credits === c && creditsDraft === String(c)
                        ? "border-accent bg-accent text-white"
                        : "border-border bg-white text-text-secondary hover:border-accent/40",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <input
                id="topup-credits"
                type="number"
                inputMode="numeric"
                min={CUSTOM_MIN_CREDITS}
                max={CUSTOM_MAX_CREDITS}
                step={1}
                value={creditsDraft}
                onChange={(e) => applyCredits(e.target.value)}
                aria-invalid={isCustom && !creditsValid}
                className={inputCls}
              />
              <p className="mt-1.5 text-xs text-text-muted">
                {t("checkout.customMin", { min: CUSTOM_MIN_CREDITS })}
              </p>
            </fieldset>
          )}
          <div>
            <label
              htmlFor="topup-name"
              className="block text-xs font-semibold text-text-muted"
            >
              {t("checkout.name")}
            </label>
            <input
              id="topup-name"
              ref={nameRef}
              type="text"
              name="name"
              autoComplete="name"
              placeholder={t("checkout.namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label
              htmlFor="topup-email"
              className="block text-xs font-semibold text-text-muted"
            >
              {t("checkout.email")}
            </label>
            <input
              id="topup-email"
              type="email"
              name="email"
              autoComplete="email"
              dir="ltr"
              value={email}
              readOnly
              className={cn(inputCls, "bg-card-bg text-text-secondary")}
            />
          </div>
          <div>
            <label
              htmlFor="topup-phone"
              className="block text-xs font-semibold text-text-muted"
            >
              {t("checkout.phone")}
            </label>
            <input
              id="topup-phone"
              type="tel"
              name="tel"
              autoComplete="tel"
              dir="ltr"
              placeholder={t("checkout.phonePlaceholder")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <span className="block text-xs font-semibold text-text-muted mb-1.5">
              {t("checkout.method")}
            </span>
            <div className="flex gap-3">
              {methodBtn(
                "edahabia",
                t("checkout.methodEdahabia"),
                t("checkout.methodEdahabiaHint"),
              )}
              {methodBtn(
                "cib",
                t("checkout.methodCib"),
                t("checkout.methodCibHint"),
              )}
            </div>
          </div>
          <label
            htmlFor="topup-terms"
            className="flex items-start gap-2.5 cursor-pointer pt-1"
          >
            <input
              id="topup-terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-accent cursor-pointer"
            />
            <span className="text-xs leading-relaxed text-text-secondary">
              {t("checkout.agreeTerms")}{" "}
              <Link
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-2"
              >
                {t("checkout.terms")}
              </Link>
            </span>
          </label>
          <p role="alert" className="text-sm text-red-600">
            {error === "name"
              ? t("checkout.errName")
              : error === "phone"
                ? t("checkout.errPhone")
                : error === "credits"
                  ? t("checkout.errCredits", {
                      min: CUSTOM_MIN_CREDITS,
                      max: CUSTOM_MAX_CREDITS,
                    })
                  : error === "pay"
                    ? t("err.payFail")
                    : ""}
          </p>
          <button
            type="submit"
            disabled={busy || !agreeTerms || (isCustom && !creditsValid)}
            className="w-full rounded-xl px-4 py-3 text-sm font-bold bg-accent text-white transition-colors disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer"
          >
            {busy ? t("checkout.working") : t("checkout.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
