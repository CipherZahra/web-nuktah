import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  experimental: {
    // Next.js agent upgrades: security advisories only (set by the 16.4.3 →
    // 16.4.6 security upgrade).
    agentUpgrade: "security",
  },
  images: {
    unoptimized: true,
    // Only the lazy YouTube facade (video-slot) loads a remote image.
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
};

export default withNextIntl(nextConfig);
