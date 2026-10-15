import Script from "next/script";

const TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN ?? "";

/**
 * Cloudflare Web Analytics beacon. Renders nothing until
 * NEXT_PUBLIC_CF_BEACON_TOKEN is set at build time (create the site in
 * Cloudflare Dashboard → Analytics & Logs → Web Analytics, then paste the
 * beacon token into .env). The CSP in public/_headers already whitelists
 * static.cloudflareinsights.com.
 */
export function Analytics() {
  if (!TOKEN) return null;
  return (
    <Script
      strategy="afterInteractive"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={`{"token": "${TOKEN}"}`}
    />
  );
}
