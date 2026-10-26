# AGENTS.md

Marketing/product site for **Nuktah / نقطة** (`nuktah.app`): bilingual Next.js 16 App Router app (Arabic root `/`, English under `/en/*`), next-intl, Tailwind v4. Static export (`output: "export"`) deployed to Cloudflare Pages. No tests, no CI.

## Commands

- `npm run dev` — dev server (restart after editing `messages/*.json`; dev server does not hot-reload them).
- `npm run typecheck` — `tsc --noEmit`. If route types look stale, run `npx next typegen` first.
- `npm run lint` — `eslint .` (flat config, `eslint-config-next/core-web-vitals`). **Baseline: 0 errors, 5 `@next/next/no-img-element` warnings** — keep ≤ 50; don't "fix" the `<img>` warnings (they're accepted).
- `npm run build` — static export to `out/`. Runs the TS check too; most reliable single gate.
- `npm run deploy` — build + `wrangler pages deploy out --project-name=nuktah-website`. From this repo only. If wrangler reports "auth token has expired / server could not be reached", retry (or `npx wrangler whoami` first).
- **No prettier in this repo** — do not add format gates or mass-reformat.

Gate before commit: `npm run typecheck && npm run lint && npm run build`.

## Architecture

- **Route groups, three of them:** `(ar)` = root-locale pages (`/`, `/pricing`, `/faq`, `/guides`, `/support`, `/about`, `/download`, `/privacy`, `/terms`, `/account`); `(en)` = same pages mirrored under `/en/...`; `(misc)` = `/payment/success` + `/payment/failure` (Chargily redirect landings) — these live **outside** the locale layouts and get their real `<html>` document from `src/app/(misc)/layout.tsx`. Never add `<html>/<body>` to `src/app/layout.tsx` (root layout returns `children` only — that's intentional).
- SEO: `export const metadata` in each locale group's `layout.tsx` (`metadataBase` hardcoded `https://nuktah.app`); static pages can import `messages/*.json` directly for titles. Dynamic guide pages use `generateMetadata` + `generateStaticParams`.
- No middleware/proxy.
- **Session:** localStorage key `nuktah:web-session` (camelCase), managed by `src/lib/checkout.ts` — `getValidSession()` single-flights token refresh and only clears the session on 4xx (network/5xx keep it); `isAllowedCheckoutUrl()` must gate any `window.location.assign` (https + `chargily.<tld>` host only).
- **Shared constants:** `src/lib/config.ts` — `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `PLAY_URL`, `PACKAGE_IDS` (order must match the pricing plans array; `"custom"` is the last pack). Never re-declare these locally.
- Static export: no server runtime — all data access is client-side `fetch` to Supabase Edge Functions with explicit CORS.

## Conventions

- **i18n:** `messages/en.json` + `messages/ar.json`, namespaced (`hero.*`, `pricing.*`, `account.*`, `seo.*`, ...), read via `useTranslations("<ns>")`. Arrays via `t.raw(...)`. New user-facing text = new key in **both** files. Arabic-first RTL; avoid hardcoded `left`/`right`.
- **Tailwind v4**, no `tailwind.config` — tokens are `@theme` variables in `src/app/globals.css` (`bg-accent`, `text-text-primary/muted`, `border-border-subtle`, `rounded-*`, `shadow-*`). Custom utility: `container-main`.
- Accent vs primary: `accent` (emerald) = interactive/CTA; `primary` (navy) = decorative/emphasis.
- Path alias: `@/*` → `src/*`. Use it; no relative crossing.
- Icons: `lucide-react`. **No framer-motion** (removed batch-E, ~136KB saved). Motion = CSS: scroll-reveal via `data-reveal="up"|"side"|"fade"` / `data-reveal-group` + `RevealController` (both layouts; base `opacity:0` with `noscript` + reduced-motion overrides in `globals.css`); navbar/menu/carousel keyframes live in `globals.css`.
- **next-intl `Link` hazard:** it reads the request locale (`headers()`), which forces `dynamic` and breaks `output:"export"` builds. Safe in client components and layouts (which already render it); **never render it from a server component in a page tree** — pass a locale-resolved plain `<a href>` instead (see `HeroCtaPair`).

## Pricing / checkout notes

- Four packs: `starter`, `standard`, `plus`, `custom` (`PACKAGE_IDS`). Custom = user-picked 5–200 credits, price computed server-side at 50 DA/credit — the card must show "You choose"/"أنت تحدد" styling (`packMetaOf()` helpers), never a price; live price only inside the TopUpModal.
- `pricing.plans.N.price`/`priceUnit` values exist only for the serialized plan blob + `purchaseAmountDzd` fallback — they're not rendered directly.
- Payment pages are bilingual hardcoded strings inside `payment-result.tsx` (metadata uses `payment.successTitle`/`failureTitle`).

## Verification

```sh
npm run typecheck && npm run lint && npm run build
```

## Fresh machine bootstrap (after Ubuntu reinstall)

Full recipe lives on the backup USB `NUKTAH-BAK` (mounts at `/run/media/$USER/NUKTAH-BAK`):
`nuktah-backup/machine-config.txt`. Do these in order:

1. `nvm install 24.22.1` — node version this project was built and verified on.
2. Dependencies, pick one:
   - Offline (USB): `tar -xzf "/run/media/$USER/NUKTAH-BAK/nuktah-backup/node_modules-backup/Bayan_website-node_modules.tar.gz" -C ~/Documents/Bayan_website`
   - Online: `npm ci` — `package-lock.json` pins every dep to an exact version.
3. `.env.local` is already inside this repo copy (from the backup) — nothing to recreate.
4. Git: `git config --global user.name "Zahra-GTF"`, `user.email "gtfzahra0@gmial.com"`
   (typo matches existing history — do not "fix" it), `git config --global --add safe.directory ~/Documents/Bayan_website`.
   GitHub auth needs a **new PAT** (the old one was intentionally never backed up).
5. Deploys: `npx wrangler login`, then
   `npx wrangler pages deploy out --project-name=nuktah-website --commit-dirty=true`.
6. Verify: `npm run typecheck && npm run lint && npm run build`.

Browsers/Desktop/Downloads restore: USB `home-backup/README.txt` (Brave passwords need the
same username + login password as before — restore `keyrings/` first).
