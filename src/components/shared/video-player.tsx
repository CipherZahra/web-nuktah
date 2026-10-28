"use client";

import { useState } from "react";
import { Play } from "lucide-react";

interface VideoPlayerProps {
  videoId: string;
  title: string;
  desc?: string;
  /** aria-label prefix for the play button, e.g. "Play video". */
  playLabel: string;
}

type ThumbStage = 0 | 1 | 2;

/**
 * Click-to-play YouTube facade. Nothing third-party loads until the user
 * clicks: idle state shows a local thumbnail + play button, and only then
 * does the youtube-nocookie iframe mount (autoplay=1).
 *
 * Thumbnail ladder: maxresdefault (not every video has one) → mqdefault →
 * plain brand-tinted panel, so a 404 never shows a broken image.
 */
export function VideoPlayer({ videoId, title, desc, playLabel }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [stage, setStage] = useState<ThumbStage>(0);

  const thumbSrc =
    stage === 0
      ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
      : `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;

  return (
    <div className="group rounded-2xl bg-white border border-border/60 overflow-hidden hover:border-accent/30 hover:shadow-md transition-all duration-300">
      <div className="relative aspect-video bg-primary-bg">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`${playLabel}: ${title}`}
            className="absolute inset-0 h-full w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-accent focus-visible:-outline-offset-2"
          >
            {stage < 2 ? (
              <img
                src={thumbSrc}
                alt=""
                loading="lazy"
                onError={() => setStage((s) => (s === 0 ? 1 : 2))}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-accent-subtle to-accent/10" />
            )}
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-primary-bg shadow-glow transition-transform duration-200 group-hover:scale-110">
                <Play size={22} className="fill-current" />
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="p-4">
        <h4 className="font-bold text-sm mb-1 text-text-primary">{title}</h4>
        {desc && (
          <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
        )}
      </div>
    </div>
  );
}
