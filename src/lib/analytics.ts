/**
 * Named interaction events for the marketing site.
 *
 * TODO(analytics): neither Plausible nor GA4 is installed — the site only has
 * the Cloudflare Web Analytics beacon, which records pageviews and exposes no
 * custom-event API. Every call site below is already wired; drop in a
 * Plausible snippet or `gtag.js` and these start firing with no further work:
 *   - Plausible → window.plausible(name, { props })
 *   - GA4       → gtag("event", name, props)
 */
export type EventName =
  | "cta_join_hero"
  | "cta_join_footer"
  | "how_it_works_click"
  | "video_play"
  | "gallery_swipe"
  | "qr_click"
  | "download_visit";

declare global {
  interface Window {
    plausible?: (name: string, opts?: { props?: Record<string, string> }) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fire-and-forget: analytics must never break the UI. */
export function trackEvent(name: EventName, props?: Record<string, string>): void {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(name, props ? { props } : undefined);
    window.gtag?.("event", name, props ?? {});
  } catch {
    /* ignore */
  }
}
