# TODO — homepage refresh (Nov 2026)

Everything below is deliberately left undone because it needs an asset, a fact
or a decision that hasn't been supplied. Nothing here was invented.

## Needs an asset / URL

1. **Demo video (§6c)** — `src/components/sections/video-slot.tsx` renders
   `null` until `NEXT_PUBLIC_VIDEO_URL` is set (YouTube link). The lazy
   facade, thumbnail (`i.ytimg.com` — allow-listed in `next.config.ts`),
   `youtube-nocookie` embed and the `video_play` event are all wired.
2. **Dark-mode app screenshot (§6b)** — no dark screen exists in
   `public/screens`; capture one from the app and add it to the gallery.
3. **Analytics provider (§12)** — every event is called from the UI
   (`cta_join_hero`, `cta_join_footer`, `how_it_works_click`, `video_play`,
   `gallery_swipe`, `qr_click`, `download_visit`), but `src/lib/analytics.ts`
   only forwards to `window.plausible` / `window.gtag`, and neither is
   installed. The Cloudflare Web Analytics beacon has no custom-event API, so
   today the calls no-op. Drop in a Plausible snippet or `gtag.js` and the
   events start firing with no further code changes.

## Needs your confirmation

4. **Data-safety section (§6a)** — `بياناتك في أمان` states four things, all
   lifted from `src/content/legal/privacy.ar.md`: data stays on the device,
   no selling/sharing, sheet images are not stored on our servers, delete via
   profile or `support@nuktah.app`, plus HTTPS. Sign off before deploy (or
   tell me which to cut).
5. **Feature cards (§3)** — dropped two claims pending confirmation:
   reports "قابلة للطباعة والمشاركة" and analytics "المعدلات". Re-add only if
   the app really does both; the cards currently say "نتائج مفصّلة لكل تلميذ
   ولكل قسم." and "مؤشرات تُظهر نقاط القوة والضعف في كل قسم.".
6. **Join mini-guide (§6d)** — the 3 steps (open the link with a Google
   account → press «أصبح مختبِرًا» → install from Play) are unverified against
   the real closed-testing flow, including whether the invite is instant or
   takes a day (the download page copy says "بضع دقائق أو يومًا كاملاً").
7. **Dark-mode palette (§8)** — derived from the light theme + brand green,
   not copied from the app. Confirm the app's dark colours and I'll align.
8. **Header CTA label (§1/§7)** — the header button uses the short
   `انضم للتجربة`; the full `انضم للتجربة المجانية` does not fit a 360px bar
   next to the logo, EN switch and hamburger. The full label is used in the
   hero, closing band, mobile menu, footer link, about and download CTAs.
   Decide: keep short, or drop the header CTA (the mobile menu has it).

## Judgement calls, revisit if you disagree

9. **Hero subtitle line count (§1)** — the given subtitle needs **3** lines
   at 360px (measured at 15px; 2 lines would need ~12px type). Copy kept
   verbatim. A 2-line version for approval:
   «منصّة لمسح كشوف النقاط وإدخال العلامات تلقائيًا، ومطابقتها برقم التسجيل
   قبل الاعتماد.»
10. **Gallery size (§6b)** — trimmed 8 → 5 screens (home, scan, reading,
    gradebook, analytics). `phone_02` (import), `phone_05` (manual entry) and
    `phone_08` (sharing) are still in `public/screens` and can be re-added.
11. **Carousel dots (§9)** — dot hit area is 24×44px: AA (2.5.8) passes, but
    your 44px-wide target would need 5×44px + two 44px arrows > 360px.
    Arrows, dots and swipe all reach the same result.
12. **Fonts (§8)** — kept Amiri (headings) + IBM Plex Sans Arabic, now 400/700
    only (≤2 weights per family); `font-medium` maps to 400, `font-semibold`
    to 700. Two woff2 files are no longer downloaded.
13. **Dark-mode toggle (§8)** — only `prefers-color-scheme` is implemented.
    A manual switch needs the dark block duplicated under
    `:root[data-theme="dark"]` plus a place to put the control.

## Not built (optional §13)

14. **`/lp` Google-Ads variant** — skipped. When you want it: noindex,
    `Disallow: /lp/` in `public/robots.txt`, H1 «كشف النقاط في دقائق، لا في
    ساعات.», single CTA, trust strip + video above the fold.
15. **Live re-measurement** — the PSI API returned `429 Quota exceeded`, so
    all scores in the hand-off are local Lighthouse 13 (same mobile engine and
    settings as PSI). Re-run against `nuktah.app` after a deploy.
