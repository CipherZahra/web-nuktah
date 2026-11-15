"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, FileText, PencilLine, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n";
import { PhoneMockup } from "./phone-mockup";

type StoryStep = {
  id: string;
  number: string;
  label: string;
  title: string;
  description: string;
  detail: string;
  alt: string;
};

type PaperRow = { mat: string; name: string; g1: string };

/** Raw app screenshots per step (public/screens). matching/review share the
 *  grade-table screen — the overlay card is what changes between them. */
const SHOTS: Record<string, string> = {
  paper: "/screens/story_paper.webp",
  scan: "/screens/story_scan.webp",
  extraction: "/screens/story_extract.webp",
  matching: "/screens/story_review.webp",
  review: "/screens/story_review.webp",
  done: "/screens/story_done.webp",
};

/**
 * Six-step paper→app scroll story. Replaces the old HowItWorks list and keeps
 * `id="how-it-works"` for in-page links and bookmarks (the hero CTA moved to
 * /pricing on 2026-11-15).
 *
 * Motion is CSS-only per repo rules: the sticky phone crossfades between
 * screenshots (`transition-opacity`), step activation comes from an
 * IntersectionObserver (same band the AI-Studio original used), and the
 * floating cards replay a keyframe on mount. No framer-motion.
 */
export function PhoneStory() {
  const t = useTranslations("story");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const steps = t.raw("steps") as StoryStep[];
  const rows = t.raw("paperRows") as PaperRow[];

  const [active, setActive] = useState(0);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const els = stepRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = Number((entry.target as HTMLElement).dataset.step);
          if (Number.isInteger(idx)) setActive(idx);
        }
      },
      { rootMargin: "-38% 0px -42% 0px", threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [steps.length]);

  const jumpTo = (idx: number) => {
    setActive(idx);
    const el = stepRefs.current[idx];
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  };

  const activeStep = steps[active] ?? steps[0];

  /** Floating cards around the sticky phone — one shape per step, mounted
   *  with a key so `.story-pop` replays whenever the step changes. */
  const renderOverlay = (step: StoryStep) => {
    if (step.id === "paper") {
      return (
        <div
          key="paper"
          className="story-pop hidden xl:block absolute -start-20 bottom-10 z-30 w-56 rounded-2xl border border-border bg-white p-3.5 shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-border-subtle pb-2 text-[11px] font-semibold text-text-secondary">
            <span className="truncate">{t("paperPreviewTitle")}</span>
            <FileText className="h-3.5 w-3.5 shrink-0 text-text-muted" aria-hidden="true" />
          </div>
          <div className="mt-2 space-y-1.5 text-[11px] text-text-secondary">
            {rows.slice(0, 3).map((row) => (
              <div key={row.mat} className="flex items-center justify-between">
                <span className="truncate text-text-muted">{row.name}</span>
                <span className="font-semibold italic text-text-primary">{row.g1}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (step.id === "scan") {
      return (
        <div
          key="scan"
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center p-5"
        >
          {/* Document edge-detection frame + sweeping scan line */}
          <div className="relative h-[68%] w-full rounded-xl border border-[#10B981]/70 bg-[#10B981]/[0.04]">
            <span className="absolute -left-0.5 -top-0.5 h-4 w-4 rounded-tl-md border-l-2 border-t-2 border-[#10B981]" />
            <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-tr-md border-r-2 border-t-2 border-[#10B981]" />
            <span className="absolute -bottom-0.5 -left-0.5 h-4 w-4 rounded-bl-md border-b-2 border-l-2 border-[#10B981]" />
            <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-br-md border-b-2 border-r-2 border-[#10B981]" />
            <span className="story-sweep" aria-hidden="true" />
          </div>
        </div>
      );
    }

    if (step.id === "extraction") {
      return (
        <div
          key="extraction"
          className="story-pop hidden xl:block absolute -end-20 bottom-12 z-30 w-64 rounded-2xl border border-border bg-white p-3.5 shadow-lg"
        >
          <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-accent">
            <span>{step.label}</span>
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            {rows.map((row) => (
              <div
                key={row.mat}
                className="flex items-center justify-between rounded-lg bg-primary-bg px-2.5 py-1.5 text-[11px]"
              >
                <span className="font-medium text-text-primary">{row.name}</span>
                <span className="text-text-muted">{row.mat}</span>
                <span className="font-semibold text-accent">{row.g1}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (step.id === "matching") {
      return (
        <div
          key="matching"
          className="story-pop hidden xl:block absolute -start-20 top-16 z-30 w-64 rounded-2xl border border-border bg-white p-3.5 shadow-lg"
        >
          <div className="mb-2.5 text-[11px] font-semibold text-text-secondary">
            {t("matchingLabel")}
          </div>
          <div className="space-y-2">
            {rows.slice(0, 3).map((row) => (
              <div
                key={row.mat}
                className="flex items-center justify-between gap-2 rounded-lg border border-accent/20 bg-accent-subtle px-2.5 py-1.5 text-[11px]"
              >
                <span className="font-medium text-text-secondary">{row.mat}</span>
                <ArrowIcon className="h-3 w-3 shrink-0 text-accent" aria-hidden="true" />
                <span className="flex items-center gap-1 font-semibold text-text-primary">
                  {row.name}
                  <Check className="h-3 w-3 text-accent" aria-hidden="true" />
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (step.id === "review") {
      return (
        <div
          key="review"
          className="story-pop hidden xl:flex items-center gap-2 absolute -end-16 top-20 z-30 rounded-xl border border-border bg-white px-3.5 py-2.5 shadow-md"
        >
          <PencilLine className="h-4 w-4 text-accent" aria-hidden="true" />
          <span className="text-xs font-medium text-text-primary">{t("reviewHint")}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-white">
      <div className="container-main">
        <div data-reveal="up" className="text-center mb-16">
          <span className="text-xs font-semibold text-text-muted tracking-wider mb-4 block">
            {t("label")}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-text-primary">
            {t("title")}
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">{t("subtitle")}</p>
        </div>

        {/* Desktop: scrolling chapters + sticky phone theater */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            {steps.map((step, i) => (
              <div
                key={step.id}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                data-step={i}
                id={`story-step-${step.id}`}
                className="flex min-h-[58vh] flex-col justify-center py-10 lg:min-h-[66vh]"
              >
                <button
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-current={i === active ? "step" : undefined}
                  className={`group text-start rounded-xl transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 ${
                    i === active ? "opacity-100" : "opacity-45 hover:opacity-80"
                  }`}
                >
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <span
                      className={`transition-colors ${i === active ? "text-accent" : "text-text-muted"}`}
                    >
                      {step.number}
                    </span>
                    <span aria-hidden="true" className="text-border">/</span>
                    <span className={i === active ? "text-text-primary" : "text-text-secondary"}>
                      {step.label}
                    </span>
                  </div>

                  <h3 className="mt-3 text-balance text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-text-secondary sm:text-lg">
                    {step.description}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-text-muted">{step.detail}</p>
                </button>

                {i === steps.length - 1 && (
                  <div className="mt-7">
                    <Button asChild>
                      <Link href="/download">{t("cta")}</Link>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="lg:col-span-7">
            <div className="sticky top-20 flex h-[calc(100vh-6rem)] min-h-[560px] items-center justify-center rounded-3xl border border-border-subtle bg-primary-bg px-8 py-6">
              {/* Step progress rail */}
              <div
                aria-label={t("railLabel")}
                className="absolute start-6 top-1/2 hidden -translate-y-1/2 flex-col gap-2.5 sm:flex"
              >
                {steps.map((step, i) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-label={`${step.number} ${step.label}`}
                    aria-current={i === active ? "step" : undefined}
                    className="group flex items-center gap-2 rounded py-0.5 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <span
                      className={`h-6 w-1 rounded-full transition-all duration-300 ${
                        i === active ? "h-8 bg-accent" : "bg-border group-hover:bg-text-muted"
                      }`}
                    />
                    <span
                      className={`text-[11px] font-semibold transition-colors ${
                        i === active ? "text-text-primary" : "text-text-muted"
                      }`}
                    >
                      {step.number}
                    </span>
                  </button>
                ))}
              </div>

              {/* Sticky phone with crossfading screenshots */}
              <div className="relative w-full max-w-[275px] xl:max-w-[295px]">
                <PhoneMockup>
                  {steps.map((step, i) => (
                    <div
                      key={step.id}
                      aria-hidden={i !== active}
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        i === active ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <Image
                        src={SHOTS[step.id]}
                        alt={i === active ? step.alt : ""}
                        fill
                        sizes="295px"
                        className="object-cover object-top"
                      />
                    </div>
                  ))}
                </PhoneMockup>

                {renderOverlay(activeStep)}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: vertical card flow, one phone per step */}
        <div className="mt-10 space-y-10 lg:hidden">
          {steps.map((step) => (
            <article
              key={step.id}
              className="rounded-2xl border border-border-subtle bg-primary-bg p-5 sm:p-6"
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                <span className="text-accent">{step.number}</span>
                <span aria-hidden="true" className="text-border">/</span>
                <span className="text-text-secondary">{step.label}</span>
              </div>

              <h3 className="mt-2.5 text-xl font-bold tracking-tight text-text-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {step.description}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">{step.detail}</p>

              <div className="mt-6 flex justify-center">
                <PhoneMockup
                  imageSrc={SHOTS[step.id]}
                  imageAlt={step.alt}
                  className="w-[230px]"
                />
              </div>

              {step.id === "matching" && (
                <div className="mt-4 space-y-1.5 rounded-xl border border-border bg-white p-3 text-xs">
                  {rows.slice(0, 3).map((row) => (
                    <div key={row.mat} className="flex items-center justify-between gap-2">
                      <span className="text-text-muted">{row.mat}</span>
                      <ArrowIcon className="h-3 w-3 shrink-0 text-accent" aria-hidden="true" />
                      <span className="flex items-center gap-1 font-semibold text-text-primary">
                        {row.name}
                        <Check className="h-3 w-3 text-accent" aria-hidden="true" />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
