import localFont from "next/font/local";

// Self-hosted fonts (subset to Arabic + Latin via fontTools). next/font/google
// was dropped because builds/dev on this machine cannot reliably reach
// fonts.googleapis.com — Google's loader silently fell back to system fonts,
// so headings lost Amiri. Local files make rendering deterministic.
export const amiri = localFont({
  src: [
    { path: "./amiri-regular.woff2", weight: "400", style: "normal" },
    { path: "./amiri-bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-amiri",
  fallback: ["serif"],
});

export const plex = localFont({
  // Two weights only (spec: ≤2 per family). `font-medium` (500) resolves to
  // the 400 face and `font-semibold` (600) to the 700 face via CSS matching,
  // so the two dropped files are no longer downloaded on every visit.
  src: [
    { path: "./plex-arabic-regular.woff2", weight: "400", style: "normal" },
    { path: "./plex-arabic-bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-ui",
  fallback: ["Arial", "sans-serif"],
});
