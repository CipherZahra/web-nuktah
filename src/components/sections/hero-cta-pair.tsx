import { Play, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAY_URL } from "@/lib/config";

interface HeroCtaPairProps {
  primaryLabel: string;
  secondaryLabel: string;
  isRTL: boolean;
  /** Locale-resolved hrefs — avoids next-intl's Link, which reads the
   *  request locale (headers()) and would force these pages dynamic. */
  pricingHref: "/pricing" | "/en/pricing";
  playUrl?: string;
}

/**
 * The Play Store + pricing CTA pair shared by the hero and the closing CTA.
 * Server component — no client JS of its own.
 */
export function HeroCtaPair({
  primaryLabel,
  secondaryLabel,
  isRTL,
  pricingHref,
  playUrl = PLAY_URL,
}: HeroCtaPairProps) {
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button size="xl" asChild>
        <a href={playUrl} target="_blank" rel="noopener noreferrer">
          <Play className="h-5 w-5" />
          {primaryLabel}
        </a>
      </Button>
      <Button size="xl" variant="outline" asChild>
        <a href={pricingHref}>
          {secondaryLabel}
          <Arrow className="h-5 w-5" />
        </a>
      </Button>
    </div>
  );
}
