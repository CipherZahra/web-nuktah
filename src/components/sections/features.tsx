import { Scan, PenLine, BarChart3, TrendingUp, RefreshCw, FileDown } from "lucide-react";
import { getMessages, type Locale } from "@/lib/messages";

const features = [
  { icon: Scan, key: "ocr" },
  { icon: PenLine, key: "manual" },
  { icon: BarChart3, key: "reports" },
  { icon: TrendingUp, key: "analytics" },
  { icon: RefreshCw, key: "sync" },
  { icon: FileDown, key: "export" },
];

/** Feature grid. Server component — locale is resolved by the page. */
export function Features({ locale }: { locale: Locale }) {
  const copy = getMessages(locale).features;
  return (
    <section id="features" className="py-24 md:py-32">
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

        <div data-reveal-group className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.key}
                className="group rounded-2xl bg-white border border-border/60 p-6 hover:border-accent/30 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-subtle border border-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/10 group-hover:border-accent/20 transition-all duration-300">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-base mb-2 text-text-primary">
                  {copy[feature.key]}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {copy[`${feature.key}Desc`]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
