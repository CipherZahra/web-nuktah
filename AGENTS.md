# AGENTS.md

Marketing/landing site for **Nuktah / نقطة** (`nuktah.app`): a single-page, Arabic-only (RTL) Next.js 16 App Router app with next-intl and Tailwind v4. No tests, no CI, no README.

## Commands

- `npm run dev` / `npm run build` / `npm start` — `next build` runs Turbopack compile **and** the TypeScript check; it is the most reliable verification.
- Typecheck: `npx tsc --noEmit` (no `typecheck` script exists). If `.next/` is missing/stale, run `npx next typegen` first so route types exist.
- **Lint is currently broken — do not treat it as a gate:**
  - `npm run lint` runs `next lint`, which Next 16 removed; the CLI treats `lint` as a directory and errors.
  - `npx eslint .` crashes with `TypeError: Converting circular structure to JSON` because `eslint.config.mjs` uses `FlatCompat` to extend `next/core-web-vitals` under ESLint 9 / eslint-config-next 16.
  - Verify changes with `npx tsc --noEmit` + `npm run build`. If asked to fix lint, migrate `eslint.config.mjs` to eslint-config-next's native flat config (drop `FlatCompat`).

## Architecture (non-obvious wiring)

- Single route: `src/app/[locale]/page.tsx` is a **client component** that composes sections from `src/components/sections/*`. Navigation is in-page anchors (`<a href="#hero">`), not routes.
- Root `src/app/layout.tsx` deliberately returns `children` **without `<html>/<body>`** — those tags live in `src/app/[locale]/layout.tsx` (`lang="ar" dir="rtl"`, Tajawal font, `NextIntlClientProvider`). Never add a second `<html>/<body>`.
- SEO lives in `generateMetadata` inside `src/app/[locale]/layout.tsx` (the page is client-side and cannot export metadata). `metadataBase`/canonical is hardcoded to `https://nuktah.app`.
- Locale config exists in **four places**; change them together: `src/i18n/routing.ts` (locales, default, prefix, `createNavigation` exports), `src/i18n/request.ts`, `src/app/[locale]/layout.tsx` (`generateStaticParams` + `notFound()` guard), and `messages/`. Only `ar` exists (an `en` locale was removed to stop middleware redirects); `layout.tsx` still has a harmless `locale === "en"` remnant in `generateMetadata` — don't "clean it up" in isolation.
- Middleware is `src/proxy.ts` (Next 16's rename of `middleware.ts`) — next-intl matcher. Don't create `src/middleware.ts`.
- `next.config.ts` must stay wrapped in `withNextIntl = createNextIntlPlugin()` or next-intl messages stop loading.

## Conventions

- **i18n:** all UI copy is in `messages/ar.json`, namespaced per section (`hero.*`, `faq.*`, `seo.*`, ...), read via `useTranslations("<ns>")`. New user-facing text = new key there; no hardcoded strings in components. Only `messages/ar.json` exists — adding a locale means adding its JSON file plus the four config spots above.
- **Tailwind v4** with no `tailwind.config` — design tokens are `@theme` variables in `src/app/globals.css`. Use them (`bg-accent`, `text-text-primary/muted`, `border-border-subtle`, `rounded-*`, `shadow-*`) instead of raw hex colors. Custom utilities: `container-main`, `text-gradient`.
- Path alias: `@/*` → `src/*`.
- RTL-only layout: prefer logical properties / flex gaps; watch hardcoded `left`/`right` positioning.
- `framer-motion` for entrance animations, `lucide-react` for icons.
- `next-themes` is in dependencies but unused — don't wire it up unless asked.

## Verification

```sh
npx tsc --noEmit && npm run build
```
