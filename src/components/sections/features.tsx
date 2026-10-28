import { Scan, PenLine, BarChart3, TrendingUp, RefreshCw, FileDown } from "lucide-react";
import { getMessages, type Locale } from "@/lib/messages";
import { cn } from "@/lib/utils";

/**
 * Bento feature list: `span` cards take two columns at lg and pair their
 * copy with a screenshot strip (the wide-card pattern); the rest stay
 * single-column. Screenshots only render while the card is actually wide
 * (lg), so the narrow breakpoints keep the plain vertical card.
 */
const features = [
  { icon: Scan, key: "ocr", span: true, shot: "/screens/phone_03.webp" },
  { icon: PenLine, key: "manual", span: false },
  { icon: BarChart3, key: "reports", span: false },
  { icon: TrendingUp, key: "analytics", span: true, shot: "/screens/phone_07.webp" },
  { icon: RefreshCw, key: "sync", span: false },
  { icon: FileDown, key: "export", span: true, shot: "/screens/phone_08.webp" },
];

/** Feature bento. Server component — locale is resolved by the page. */
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
                className={cn(
                  "group rounded-2xl bg-white border border-border/60 p-6 hover:border-accent/30 hover:shadow-md transition-all duration-300",
                  feature.span && "lg:col-span-2 lg:flex lg:items-start lg:gap-6"
                )}
              >
                <div className="flex-1 min-w-0">
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

                {feature.span && feature.shot && (
                  <div className="hidden lg:block shrink-0 w-32 xl:w-36 h-44 xl:h-48 rounded-xl overflow-hidden border border-border/60 bg-primary-bg">
                    <img
                      src={feature.shot}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
