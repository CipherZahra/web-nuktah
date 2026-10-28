import { getMessages, type Locale } from "@/lib/messages";
import { VideoPlayer } from "@/components/shared/video-player";

const steps = [
  { key: "step1", icon: "01" },
  { key: "step2", icon: "02" },
  { key: "step3", icon: "03" },
  { key: "step4", icon: "04" },
  { key: "step5", icon: "05" },
];

/**
 * "How it works": numbered step cards (the last one spans two columns so
 * the grid closes evenly) followed by the click-to-play video grid.
 * Server component — the videos are client children.
 */
export function HowItWorks({ locale }: { locale: Locale }) {
  const copy = getMessages(locale).howItWorks;
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-white">
      <div className="container-main">
        <div data-reveal="up" className="text-center mb-16">
          <span className="text-xs font-semibold text-text-muted tracking-wider mb-4 block">
            {copy.label}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-text-primary">
            {copy.title}
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">{copy.subtitle}</p>
        </div>

        <div
          data-reveal-group
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto"
        >
          {steps.map((step) => (
            <div
              key={step.key}
              className="rounded-2xl bg-primary-bg border border-border/60 p-6 hover:border-accent/30 hover:shadow-md transition-all duration-300 last:lg:col-span-2"
            >
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-glow mb-4">
                <span className="text-white font-bold text-sm">{step.icon}</span>
              </div>
              <h3 className="font-bold text-base mb-1 text-text-primary">{copy[step.key]}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {copy[`${step.key}Desc`]}
              </p>
            </div>
          ))}
        </div>

        {/* Click-to-play video grid (facade — no third-party JS until a click). */}
        <div className="mt-20 max-w-6xl mx-auto">
          <div data-reveal="up" className="text-center mb-10">
            <span className="text-xs font-semibold text-text-muted tracking-wider mb-4 block">
              {copy.videosLabel}
            </span>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
              {copy.videosTitle}
            </h3>
          </div>

          <div data-reveal-group className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {copy.videos.map(
              (video: { id: string; title: string; desc: string }) => (
                <VideoPlayer
                  key={video.id}
                  videoId={video.id}
                  title={video.title}
                  desc={video.desc}
                  playLabel={copy.play}
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
