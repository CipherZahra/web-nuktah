"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { trackEvent } from "@/lib/analytics";

/** 5 of the 8 screens in /public/screens — the ones that tell the flow story.
 *  TODO(gallery): phone_02 (import), phone_05 (manual entry) and phone_08
 *  (sharing) are still in /screens and can be re-added; a dark-mode screen
 *  does not exist yet and needs to be captured from the app. */
const shots = [
  { src: "/screens/phone_01.webp", key: "home" },
  { src: "/screens/phone_03.webp", key: "scan" },
  { src: "/screens/phone_04.webp", key: "reading" },
  { src: "/screens/phone_06.webp", key: "gradebook" },
  { src: "/screens/phone_07.webp", key: "analytics" },
];

/** Swipe distance (px) before a swipe counts as a navigation. */
const SWIPE_THRESHOLD = 40;

export function Screenshots() {
  const [current, setCurrent] = useState(0);
  const touchX = useRef<number | null>(null);
  const t = useTranslations("screenshots");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  const next = () => setCurrent((c) => (c + 1) % shots.length);
  const prev = () => setCurrent((c) => (c - 1 + shots.length) % shots.length);

  // RTL carousels run backwards: a swipe that reveals the next screen moves
  // right in Arabic and left in English.
  const go = (forward: boolean) => {
    if (forward) next();
    else prev();
    trackEvent("gallery_swipe");
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchX.current;
    touchX.current = null;
    if (start == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? start) - start;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    go(isRTL ? dx > 0 : dx < 0);
  };

  return (
    <section className="py-24 md:py-32">
      <div className="container-main">
        <div data-reveal="up" className="text-center mb-16">
          <span className="text-xs font-semibold text-text-muted tracking-wider mb-4 block">
            {t("label")}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-text-primary">
            {t("title")}
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="relative max-w-sm mx-auto">
          <div
            className="relative rounded-3xl overflow-hidden bg-white border border-border/60 shadow-xl aspect-[9/16] touch-pan-y select-none"
            style={{ ["--shot-x" as string]: isRTL ? "-40px" : "40px" }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* key remounts the image so the CSS slide-fade replays per shot. */}
            <Image
              key={current}
              src={shots[current].src}
              alt={`${t("label")} — ${t(shots[current].key)}`}
              fill
              sizes="(max-width: 640px) 90vw, 384px"
              loading="lazy"
              className="shot-enter object-cover"
            />
          </div>

          {/* Visible caption, also announced politely when the shot changes. */}
          <p
            aria-live="polite"
            className="mt-4 text-center text-sm text-text-muted"
          >
            {t(shots[current].key)}
          </p>

          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={prev}
              className="h-11 w-11 shrink-0 rounded-xl bg-white border border-border flex items-center justify-center hover:border-accent/50 hover:bg-accent-subtle transition-all duration-200 text-text-secondary hover:text-accent-hover"
              aria-label={t("prev")}
            >
              <PrevIcon size={18} />
            </button>

            {/* 24px hit area meets WCAG 2.2 AA (2.5.8); the bar stays 8px. */}
            <div className="flex items-center gap-1">
              {shots.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => setCurrent(i)}
                  className="group flex h-6 w-6 items-center justify-center"
                  aria-label={`${t("goTo")} ${i + 1}`}
                  aria-current={i === current ? "true" : undefined}
                >
                  <span
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === current
                        ? "bg-accent w-6"
                        : "bg-border group-hover:bg-text-muted w-2"
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={next}
              className="h-11 w-11 shrink-0 rounded-xl bg-white border border-border flex items-center justify-center hover:border-accent/50 hover:bg-accent-subtle transition-all duration-200 text-text-secondary hover:text-accent-hover"
              aria-label={t("next")}
            >
              <NextIcon size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
