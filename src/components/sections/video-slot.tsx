"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LoaderCircle, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n";
import { trackEvent } from "@/lib/analytics";

/**
 * 58-second manual-entry walkthrough: portrait player + chapter timeline.
 *
 * TODO(video): no video URL exists yet, so the whole section renders null —
 * set NEXT_PUBLIC_VIDEO_URL (YouTube unlisted link, baked at build) and the
 * poster appears. The YouTube IFrame API loads lazily only when the section
 * scrolls into view; if it is blocked, the section falls back to a plain
 * youtube-nocookie iframe whose src swaps to `&start=` on chapter clicks.
 */
const VIDEO_URL = process.env.NEXT_PUBLIC_VIDEO_URL ?? "";
const POSTER = "/screens/phone_05.webp";

type Chapter = { at: number; title: string; desc: string };

/** The slice of the YT.Player API this section uses. */
type YtPlayer = {
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
  getCurrentTime(): number;
  destroy(): void;
};

type YtWindow = {
  YT?: {
    Player: new (
      el: HTMLElement,
      opts: Record<string, unknown>
    ) => YtPlayer;
  };
  onYouTubeIframeAPIReady?: () => void;
};

function youtubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{6,})/);
  return match ? match[1] : null;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** One shared IFrame-API load per page; rejects on script error or timeout. */
let apiPromise: Promise<void> | null = null;
function loadYtApi(): Promise<void> {
  const w = window as unknown as YtWindow;
  if (w.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("yt-timeout")), 15000);
    const previous = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      window.clearTimeout(timer);
      previous?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    tag.onerror = () => {
      window.clearTimeout(timer);
      reject(new Error("yt-script-error"));
    };
    document.head.appendChild(tag);
  });
  return apiPromise;
}

export function VideoSlot() {
  const t = useTranslations("video");
  const chapters = t.raw("chapters") as Chapter[];
  const id = VIDEO_URL ? youtubeId(VIDEO_URL) : null;

  const sectionRef = useRef<HTMLElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YtPlayer | null>(null);
  const pollRef = useRef<number | null>(null);
  const pendingStartRef = useRef(0);
  const chaptersRef = useRef(chapters);
  useEffect(() => {
    chaptersRef.current = chapters;
  }, [chapters]);

  const [started, setStarted] = useState(false);
  const [apiState, setApiState] = useState<"idle" | "ready" | "failed">("idle");
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [activeCh, setActiveCh] = useState(0);
  const [fallbackStart, setFallbackStart] = useState(0);

  const stopPoll = useCallback(() => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startPoll = useCallback(() => {
    stopPoll();
    pollRef.current = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      const now = p.getCurrentTime();
      let idx = 0;
      const list = chaptersRef.current;
      for (let i = 0; i < list.length; i += 1) {
        if (now >= list[i].at) idx = i;
      }
      setActiveCh(idx);
    }, 400);
  }, [stopPoll]);

  const ensureApi = useCallback(() => {
    loadYtApi()
      .then(() => setApiState("ready"))
      .catch(() => setApiState("failed"));
  }, []);

  // Warm the API once the section approaches the viewport — the click then
  // usually has it ready. No network cost before this point.
  useEffect(() => {
    if (!id) return;
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          ensureApi();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id, ensureApi]);

  const createPlayer = useCallback(() => {
    const w = window as unknown as YtWindow;
    const host = hostRef.current;
    if (!host || !id || playerRef.current || !w.YT?.Player) return;
    playerRef.current = new w.YT.Player(host, {
      videoId: id,
      host: "https://www.youtube-nocookie.com",
      width: "100%",
      height: "100%",
      playerVars: {
        controls: 0, // custom play/pause + mute row below the player
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: (e: { target: YtPlayer }) => {
          e.target.playVideo();
          if (pendingStartRef.current > 0) {
            e.target.seekTo(pendingStartRef.current, true);
            pendingStartRef.current = 0;
          }
        },
        onStateChange: (e: { data: number }) => {
          const isPlaying = e.data === 1;
          setPlaying(isPlaying);
          if (isPlaying) startPoll();
          else stopPoll();
        },
      },
    });
  }, [id, startPoll, stopPoll]);

  // Mount the player as soon as the API is ready behind the started facade.
  useEffect(() => {
    if (started && apiState === "ready") createPlayer();
  }, [started, apiState, createPlayer]);

  useEffect(
    () => () => {
      stopPoll();
      try {
        playerRef.current?.destroy();
      } catch {
        /* player already gone */
      }
      playerRef.current = null;
    },
    [stopPoll]
  );

  const start = useCallback(() => {
    if (!id) return;
    trackEvent("video_play");
    setStarted(true);
    if (apiState !== "failed") ensureApi();
  }, [id, apiState, ensureApi]);

  const seekToChapter = (i: number) => {
    const at = chapters[i].at;
    setActiveCh(i);
    const p = playerRef.current;
    if (p && apiState === "ready") {
      p.seekTo(at, true);
      p.playVideo();
      return;
    }
    // API unavailable (or still loading): start, then land on the chapter —
    // via the player's pending start, or the fallback iframe's `&start=`.
    pendingStartRef.current = at;
    if (!started) {
      start();
    } else {
      setFallbackStart(at);
    }
  };

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (playing) p.pauseVideo();
    else p.playVideo();
  };

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (muted) {
      p.unMute();
      setMuted(false);
    } else {
      p.mute();
      setMuted(true);
    }
  };

  if (!id) return null;

  const fallbackMode = started && apiState === "failed";

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-white border-y border-border-subtle"
    >
      <div className="container-main">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Copy + chapter timeline */}
          <div data-reveal="up">
            <span className="text-xs font-semibold text-text-muted tracking-wider mb-4 block">
              {t("label")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-text-primary">
              {t("title")}
            </h2>
            <p className="text-text-secondary text-lg mb-8">{t("caption")}</p>

            <div className="divide-y divide-border border-y border-border">
              {chapters.map((ch, i) => (
                <button
                  key={ch.at}
                  type="button"
                  onClick={() => seekToChapter(i)}
                  aria-current={activeCh === i ? "step" : undefined}
                  className={`flex w-full items-start gap-4 rounded-lg px-3 py-4 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    activeCh === i ? "bg-accent-subtle" : "hover:bg-primary-bg"
                  }`}
                >
                  <span
                    className={`mt-0.5 text-xs font-bold ${
                      activeCh === i ? "text-accent" : "text-text-muted"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span
                      className={`block text-sm font-semibold ${
                        activeCh === i ? "text-text-primary" : "text-text-secondary"
                      }`}
                    >
                      {ch.title}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-text-muted">
                      {ch.desc}
                    </span>
                  </span>
                  <span className="mt-0.5 shrink-0 text-xs font-semibold text-text-muted tabular-nums">
                    {formatTime(ch.at)}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-8">
              <Button asChild>
                <Link href="/download">{t("cta")}</Link>
              </Button>
            </div>
          </div>

          {/* Portrait player */}
          <div
            data-reveal="up"
            style={{ animationDelay: "0.1s" }}
            className="mx-auto w-full max-w-[320px]"
          >
            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-border/60 bg-black">
              {fallbackMode ? (
                <iframe
                  key={fallbackStart}
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1${
                    fallbackStart ? `&start=${fallbackStart}` : ""
                  }`}
                  title={t("title")}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : started ? (
                <div className="absolute inset-0">
                  {apiState !== "ready" && (
                    <span className="absolute inset-0 z-10 flex items-center justify-center text-white/80">
                      <LoaderCircle className="h-8 w-8 animate-spin" aria-hidden="true" />
                    </span>
                  )}
                  {/* YT.Player swaps this node for its iframe — React never
                      unmounts it while the section is on screen. */}
                  <div ref={hostRef} className="h-full w-full [&_iframe]:h-full [&_iframe]:w-full" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={start}
                  className="group absolute inset-0 h-full w-full"
                  aria-label={t("play")}
                >
                  <Image
                    src={POSTER}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 90vw, 320px"
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

            {started && apiState === "ready" ? (
              <div className="mt-3 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={playing ? t("pause") : t("play")}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-text-secondary transition-colors hover:border-accent/50 hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {playing ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={muted ? t("unmute") : t("mute")}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-text-secondary transition-colors hover:border-accent/50 hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <span className="text-xs text-text-muted">{t("duration")}</span>
              </div>
            ) : (
              <p className="mt-3 text-center text-xs text-text-muted">{t("duration")}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
