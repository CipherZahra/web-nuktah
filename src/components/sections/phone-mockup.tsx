import Image from "next/image";
import type { ReactNode } from "react";

type PhoneMockupProps = {
  /** Static screenshot (mobile story cards). Ignored when `children` renders. */
  imageSrc?: string;
  imageAlt?: string;
  /** Layered content inside the screen — e.g. the crossfading story frames. */
  children?: ReactNode;
  className?: string;
  priority?: boolean;
};

/**
 * Device frame for the story section: graphite bezel, camera pill and a
 * glass reflection over a 9:19.2 screen. Ported from the AI-Studio landing
 * (motion removed) — hardware buttons keep physical left/right on purpose.
 */
export function PhoneMockup({
  imageSrc,
  imageAlt = "",
  children,
  className = "",
  priority = false,
}: PhoneMockupProps) {
  return (
    <div
      className={`relative mx-auto select-none ${className}`}
      style={{ aspectRatio: "9 / 19.2" }}
    >
      {/* Physical side buttons */}
      <div
        aria-hidden="true"
        className="absolute -left-[3px] top-[20%] h-8 w-[3px] rounded-l-sm bg-slate-700/90"
      />
      <div
        aria-hidden="true"
        className="absolute -left-[3px] top-[29%] h-12 w-[3px] rounded-l-sm bg-slate-700/90"
      />
      <div
        aria-hidden="true"
        className="absolute -right-[3px] top-[25%] h-14 w-[3px] rounded-r-sm bg-slate-700/90"
      />

      {/* Outer graphite frame */}
      <div className="relative h-full w-full rounded-[44px] bg-[#161B22] p-[10px] shadow-[0_32px_72px_-18px_rgba(15,23,42,0.34),0_8px_24px_-8px_rgba(15,23,42,0.16)] ring-1 ring-white/15">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[44px] bg-gradient-to-tr from-white/5 via-transparent to-white/15"
        />

        {/* Inner screen bezel */}
        <div className="relative h-full w-full overflow-hidden rounded-[34px] bg-[#0F172A] ring-1 ring-black/40">
          {/* Camera pill */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-2.5 z-30 flex h-5 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-black/90 ring-1 ring-white/10"
          >
            <span className="h-2 w-2 rounded-full bg-slate-800 ring-1 ring-slate-700" />
          </div>

          <div className="relative h-full w-full overflow-hidden bg-slate-950">
            {imageSrc && (
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 230px, 295px"
                priority={priority}
                className="object-cover object-top"
              />
            )}

            {children}

            {/* Glass reflection */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.08]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
