import { ArrowLeft, ArrowRight, EyeOff, Lock, ShieldCheck, Trash2 } from "lucide-react";
import { getMessages, type Locale } from "@/lib/messages";

const items = [
  { key: "item1", Icon: Lock },
  { key: "item2", Icon: ShieldCheck },
  { key: "item3", Icon: EyeOff },
  { key: "item4", Icon: Trash2 },
];

const EMAIL = "support@nuktah.app";

/**
 * Keeps the address — and the period that follows it — inside one LTR run, so
 * it doesn't visually detach from itself in Arabic/RTL paragraphs.
 */
function withEmail(text: string) {
  const start = text.indexOf(EMAIL);
  if (start < 0) return text;
  let end = start + EMAIL.length;
  if (text[end] === ".") end += 1;
  return (
    <>
      {text.slice(0, start)}
      <bdi dir="ltr">{text.slice(start, end)}</bdi>
      {text.slice(end)}
    </>
  );
}

/**
 * Student-data safety section. Server component — locale comes in as copy.
 * Every claim mirrors src/content/legal/privacy.{ar,en}.md: do not add a
 * promise here that the privacy policy does not make.
 */
export function DataSafety({ locale }: { locale: Locale }) {
  const copy = getMessages(locale).dataSafety;
  const isRTL = locale === "ar";
  const privacyHref = isRTL ? "/privacy" : "/en/privacy";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  return (
    <section id="data-safety" className="py-24 md:py-32 bg-white border-y border-border-subtle">
      <div className="container-main">
        <div data-reveal="up" className="text-center mb-14 max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-text-muted tracking-wider mb-4 block">
            {copy.label}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-text-primary text-balance">
            {copy.title}
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">{copy.lead}</p>
        </div>

        <div data-reveal-group className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map(({ key, Icon }) => (
            <div
              key={key}
              className="rounded-2xl bg-primary-bg border border-border/60 p-6 h-full"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-subtle border border-accent/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-base mb-2 text-text-primary">{copy[key]}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {withEmail(copy[`${key}Desc`])}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-text-muted mb-3">{copy.note}</p>
          <a
            href={privacyHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-hover hover:text-emerald-800 underline underline-offset-4 transition-colors duration-200"
          >
            {copy.link}
            <ArrowIcon size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
