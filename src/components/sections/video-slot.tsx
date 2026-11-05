"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { trackEvent } from "@/lib/analytics";

/**
 * 60-second demo slot with a lazy YouTube facade.
 *
 * TODO(video): no video URL exists yet, so the whole section renders null —
 * the page never shows an empty box. Set NEXT_PUBLIC_VIDEO_URL to the YouTube
 * link and the thumbnail appears; the iframe is created only after the
 * visitor presses play, so it costs the page nothing up front.
 */
const VIDEO_URL = process.env.NEXT_PUBLIC_VIDEO_URL ?? "";

function youtubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{6,})/);
  return match ? match[1] : null;
}

export function VideoSlot() {
  const [playing, setPlaying] = useState(false);
  const t = useTranslations("video");

  const id = VIDEO_URL ? youtubeId(VIDEO_URL) : null;
  if (!id) return null;

  return (
    <section className="py-16 md:py-24 bg-white border-y border-border-subtle">
      <div className="container-main max-w-3xl mx-auto text-center">
        <span className="text-xs font-semibold text-text-muted tracking-wider mb-4 block">
          {t("label")}
        </span>

        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border/60 bg-primary-bg">
          {playing ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
              title={t("title")}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setPlaying(true);
                trackEvent("video_play");
              }}
              className="group absolute inset-0 h-full w-full"
              aria-label={t("title")}
            >
              {/* Lazy facade: thumbnail loads, the player never does. */}
              <Image
                src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
                alt=""
                fill
                sizes="(max-width: 768px) 92vw, 768px"
                loading="lazy"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors duration-200 group-hover:bg-black/35">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white shadow-glow transition-transform duration-200 group-hover:scale-105">
                  <Play className="h-7 w-7" fill="currentColor" />
                </span>
              </span>
            </button>
          )}
        </div>

        <p className="mt-4 text-center text-sm text-text-muted">{t("caption")}</p>
      </div>
    </section>
  );
}
