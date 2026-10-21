import { Clock, CheckCircle, Smile, MapPin, Cpu } from "lucide-react";
import { getMessages, type Locale } from "@/lib/messages";

const benefits = [
  { icon: Clock, key: "benefit1" },
  { icon: CheckCircle, key: "benefit2" },
  { icon: Smile, key: "benefit3" },
  { icon: MapPin, key: "benefit4" },
  { icon: Cpu, key: "benefit5" },
];

/** "Why Nuktah" benefit strip. Server component — locale is resolved by the page. */
export function WhyNuktah({ locale }: { locale: Locale }) {
  const copy = getMessages(locale).whyNuktah;
  return (
    <section className="py-24 md:py-32 bg-accent/[0.02] border-y border-border-subtle">
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

        <div data-reveal-group className="grid md:grid-cols-5 gap-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.key}
                className="text-center group rounded-2xl bg-white border border-border/60 p-6 hover:border-accent/30 hover:shadow-md transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-accent-subtle border border-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/10 group-hover:border-accent/20 transition-all duration-300">
                  <Icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-bold text-sm mb-2 text-text-primary">{copy[benefit.key]}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{copy[`${benefit.key}Desc`]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
