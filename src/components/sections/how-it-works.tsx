import { getMessages, type Locale } from "@/lib/messages";

const steps = [
  { key: "step1", icon: "01" },
  { key: "step2", icon: "02" },
  { key: "step3", icon: "03" },
  { key: "step4", icon: "04" },
  { key: "step5", icon: "05" },
];

/** "How it works" step list. Server component — locale is resolved by the page. */
export function HowItWorks({ locale }: { locale: Locale }) {
  const copy = getMessages(locale).howItWorks;
  const isRTL = locale === "ar";
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
          className="max-w-3xl mx-auto"
          style={{ ["--reveal-x" as string]: isRTL ? "20px" : "-20px" }}
        >
          {steps.map((step, i) => (
            <div
              key={step.key}
              data-reveal="side"
              style={{ animationDelay: `${i * 0.1}s` }}
              className="relative flex items-start gap-6 pb-8 last:pb-0"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shadow-glow shrink-0">
                  <span className="text-white font-bold text-sm">{step.icon}</span>
                </div>
                {i < steps.length - 1 && <div className="flex-1 w-px bg-border my-2" />}
              </div>
              <div className="pt-2.5">
                <h3 className="font-bold text-lg mb-1 text-text-primary">{copy[step.key]}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{copy[`${step.key}Desc`]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
