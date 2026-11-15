"use client";

import { Play, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAY_URL } from "@/lib/config";
import { trackEvent, type EventName } from "@/lib/analytics";

interface HeroCtaPairProps {
  primaryLabel: string;
  /** Omitted by the closing section, which runs the primary CTA alone. */
  secondaryLabel?: string;
  /** Locale-resolved href: "/pricing" or an in-page anchor like "#how-it-works".
   *  (A plain <a>, not next-intl's Link — see AGENTS.md.) */
  secondaryHref?: string;
  isRTL: boolean;
  /** Which join CTA fired: cta_join_hero or cta_join_footer. */
  event: EventName;
  playUrl?: string;
}

/**
 * Play-store CTA pair shared by the hero and the closing band. The primary
 * label is the single honest string used across the page — the app is public
 * now, so "ابدأ مجانًا" is simply true (free install, free tier).
 */
export function HeroCtaPair({
  primaryLabel,
  secondaryLabel,
  secondaryHref,
  isRTL,
  event,
  playUrl = PLAY_URL,
}: HeroCtaPairProps) {
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const isAnchor = secondaryHref?.startsWith("#") ?? false;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {/* Hero gets extra presence over the base variants: rounder corners,
          a brand glow that deepens on hover (primary lifts slightly), and a
          solid surface + shadow for the secondary so it doesn't wash out on
          the hero gradient. twMerge lets these override the variant bases. */}
      <Button
        size="xl"
        asChild
        className="gap-2 rounded-2xl font-semibold shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5"
      >
        <a
          href={playUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent(event)}
        >
          <Play className="h-5 w-5" />
          {primaryLabel}
        </a>
      </Button>

      {secondaryLabel && secondaryHref && (
        <Button
          size="xl"
          variant="outline"
          asChild
          className="gap-2 rounded-2xl border-border bg-card-bg font-semibold shadow-sm hover:shadow-md"
        >
          <a
            href={secondaryHref}
            onClick={() => isAnchor && trackEvent("how_it_works_click")}
          >
            {secondaryLabel}
            <Arrow className="h-5 w-5" />
          </a>
        </Button>
      )}
    </div>
  );
}
