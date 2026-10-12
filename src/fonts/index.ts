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
  src: [
    { path: "./plex-arabic-regular.woff2", weight: "400", style: "normal" },
    { path: "./plex-arabic-medium.woff2", weight: "500", style: "normal" },
    { path: "./plex-arabic-semibold.woff2", weight: "600", style: "normal" },
    { path: "./plex-arabic-bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-ui",
  fallback: ["Arial", "sans-serif"],
});
