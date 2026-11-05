"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { PLAY_URL } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";

/**
 * "3 steps to join the test" mini-guide under the hero CTAs, plus a QR code on
 * desktop (phones are already on the device, so the QR only earns its space on
 * larger screens). TODO: verify the three steps match Google Play's real
 * closed-testing flow before publishing.
 */
export function HeroJoinGuide() {
  const t = useTranslations("hero");
  const steps = [t("joinGuideStep1"), t("joinGuideStep2"), t("joinGuideStep3")];

  return (
    <div className="mt-8 w-full max-w-xl rounded-2xl border border-border/60 bg-card-bg p-5 text-start shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <p className="mb-3 text-xs font-semibold text-text-muted">{t("joinGuideTitle")}</p>
          <ol className="space-y-2">
            {steps.map((step, i) => (
              <li
                key={step}
                className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent-subtle text-xs font-bold text-accent-hover">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <a
          href={PLAY_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("qr_click")}
          className="hidden shrink-0 flex-col items-center gap-2 md:flex"
        >
          <Image
            src="/qr-play.png"
            alt={t("joinQrCaption")}
            width={740}
            height={740}
            loading="lazy"
            className="h-24 w-24 rounded-lg border border-border/60 bg-white p-1"
          />
          <span className="text-[11px] text-text-muted">{t("joinQrCaption")}</span>
        </a>
      </div>
    </div>
  );
}
