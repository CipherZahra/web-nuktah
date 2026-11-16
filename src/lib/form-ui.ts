/**
 * Shared form field styling for the login and top-up modals — one source
 * of truth so the two dialogs can't drift apart again.
 */

/** Text input + textarea base class (border, padding, focus ring). */
export const inputCls =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-2 focus:outline-accent/50 focus:border-accent transition-colors";

/**
 * Field label sitting above an input: block, `mb-1.5` so it never glues
 * itself to the box below, `text-sm` to match the input's own text size
 * (Arabic at `text-xs` reads cramped).
 */
export const labelCls =
  "block mb-1.5 text-sm font-semibold text-text-muted";
