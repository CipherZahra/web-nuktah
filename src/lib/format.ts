/**
 * Locale-aware money/date formatting shared by the account ledger and the
 * payment result pages — one implementation so the two can't drift.
 *
 * `locale` is the app's own locale code ("ar" | anything else), not a BCP-47
 * tag: Arabic uses ar-DZ (Arabic-Indic digits, DZD suffix) and English uses
 * en-DZ / en-GB.
 */

/** Localized DZD amount with thousands grouping, no decimals. */
export function formatDzd(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-DZ" : "en-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Localized short date ("19 Nov 2026"); "—" for an unparseable ISO string. */
export function formatDate(iso: string, locale: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}
