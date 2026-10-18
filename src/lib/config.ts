/**
 * Shared constants used by multiple pages/components.
 *
 * SUPABASE_URL / SUPABASE_ANON_KEY were duplicated between checkout.ts and
 * subscription.ts; PLAY_URL was copy-pasted into five components; PACKAGE_IDS
 * into both pricing pages — one source each now, so a project-URL or
 * package-order change can't half-land.
 */

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.PUBLIC_SUPABASE_URL ??
  "https://qyugsyzfcygfmfeyyrjd.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.PUBLIC_SUPABASE_ANON_KEY ??
  "";

/** Google Play testing-track URL used across every "download" CTA. */
export const PLAY_URL = "https://play.google.com/apps/testing/app.nuktah";

/** Canonical package id order — must match the pricing plans array order. */
export const PACKAGE_IDS: string[] = ["starter", "standard", "plus", "custom"];
