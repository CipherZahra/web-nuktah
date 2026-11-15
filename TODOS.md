# TODO — homepage refresh (Nov 2026)

Everything below is deliberately left undone because it needs an asset, a fact
or a decision that hasn't been supplied. Nothing here was invented.

## Needs an asset / URL

1. **Demo video (§6c)** — `src/components/sections/video-slot.tsx` still
   renders `null` until `NEXT_PUBLIC_VIDEO_URL` is set, so production shows no
   empty box. The section is now a **portrait player + 4-chapter timeline**
   (ported 2026-11-15 from the AI-Studio folder): the YouTube IFrame API
   loads lazily on scroll-in, falls back to a plain youtube-nocookie iframe
   (chapter clicks swap `&start=`) if the API is blocked, and the CSP in
   `public/_headers` now allows youtube.com / s.ytimg.com / youtube-nocookie.com.
   **Waiting on you:** upload
   `nuktah_add_grades_manually_tutorial_v4.mp4` (58.5s, 1080×1920) to YouTube
   as *unlisted*, send me the URL → I set it in `.env.local` and rebuild.
2. ~~**Dark-mode app screenshot (§6b)**~~ — **resolved 2026-11-15, then
   made moot the same day:** `dark_home.webp` + `dark_analytics.webp` (real
   app captures from the AI-Studio folder) were converted, but the whole
   screenshots gallery was removed on request (see #10). The two dark shots
   stay in `public/screens` for future use.
3. **Analytics provider (§12)** — every event is called from the UI
   (`cta_join_hero`, `cta_join_footer`, `how_it_works_click`, `video_play`,
   `qr_click`, `download_visit`), but `src/lib/analytics.ts`
   only forwards to `window.plausible` / `window.gtag`, and neither is
   installed. The Cloudflare Web Analytics beacon has no custom-event API, so
   today the calls no-op. Drop in a Plausible snippet or `gtag.js` and the
   events start firing with no further code changes.

## Needs your confirmation

4. ~~**Data-safety section (§6a)**~~ — **removed 2026-11-10 on request**,
   together with the hero trust strip («مجاني للبدء · حماية لبيانات التلاميذ…»)
   and the hero join guide (QR + three steps). The `/privacy` page is
   untouched; only the home sections are gone. Recover from git history if you
   want them back.
5. **Feature cards (§3)** — dropped two claims pending confirmation:
   reports "قابلة للطباعة والمشاركة" and analytics "المعدلات". Re-add only if
   the app really does both; the cards currently say "نتائج مفصّلة لكل تلميذ
   ولكل قسم." and "مؤشرات تُظهر نقاط القوة والضعف في كل قسم.".
6. ~~**Join mini-guide (§6d)**~~ — **resolved 2026-11-10: app publicly
   released; the hero mini-guide (QR + three steps) was then removed from the
   home page on request.** The download page keeps its three public-flow steps
   (open the listing → «تثبيت» → sign up with your email); the tester invite
   and approval wait are gone. Copy approved by you.
7. ~~**Dark-mode palette (§8)**~~ — moot since dark mode was removed
   2026-11-15 (see #13); the site is light-only now.
8. ~~**Header CTA label (§1/§7)**~~ — **resolved 2026-11-10:** the primary
   label is `ابدأ مجانًا` / "Start free" everywhere — short enough for the
   360px bar, so header and hero no longer differ. `nav.download` (nav + footer
   link) is `التحميل` / "Download".

## Judgement calls, revisit if you disagree

9. **Hero subtitle line count (§1)** — the given subtitle needs **3** lines
   at 360px (measured at 15px; 2 lines would need ~12px type). Copy kept
   verbatim. A 2-line version for approval:
   «منصّة لمسح كشوف النقاط وإدخال العلامات تلقائيًا، ومطابقتها برقم التسجيل
   قبل الاعتماد.»
10. ~~**Gallery size (§6b)**~~ — **the entire screenshots gallery was
    removed 2026-11-15 on request** ("See Nuktah in action" section: component,
    both page usages, `screenshots` message keys and the `shot-enter`
    keyframes all deleted). The story section now shows the app screens step
    by step instead. All 9 raw shots remain in `public/screens` (`phone_01`
    … `phone_08`, plus `dark_home`/`dark_analytics`) and can be re-added if
    you ever want a gallery back; `phone_05` is reused as the video poster.
11. ~~**Carousel dots (§9)**~~ — moot since the gallery was removed
    2026-11-15 (was: dot hit area 24×44px, AA (2.5.8) pass).
12. **Fonts (§8)** — kept Amiri (headings) + IBM Plex Sans Arabic, now 400/700
    only (≤2 weights per family); `font-medium` maps to 400, `font-semibold`
    to 700. Two woff2 files are no longer downloaded.
13. ~~**Dark-mode toggle (§8)**~~ — **superseded 2026-11-15: dark mode was
     removed entirely on request ("keep it light").** Gone: the whole
     `@media (prefers-color-scheme: dark)` block in `globals.css` and the
     dark `theme-color` entries in both locale layouts; `:root` now pins
     `color-scheme: light` so UA chrome (scrollbars, form controls) stays
     light even on a dark OS. Want it back → recover the deleted block from
     git history (it had no toggle — OS-driven only).

## Not built (optional §13)

14. **`/lp` Google-Ads variant** — skipped. When you want it: noindex,
    `Disallow: /lp/` in `public/robots.txt`, H1 «كشف النقاط في دقائق، لا في
    ساعات.», single CTA, trust strip + video above the fold.
15. **Live re-measurement** — the PSI API returned `429 Quota exceeded`, so
    all scores in the hand-off are local Lighthouse 13 (same mobile engine and
    settings as PSI). Re-run against `nuktah.app` after a deploy.
