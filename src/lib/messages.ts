import arMessages from "../../messages/ar.json";
import enMessages from "../../messages/en.json";

export type Locale = "ar" | "en";

/**
 * Message bundle for a locale, with each namespace widened so sections can
 * look up keys with a template literal (`copy[\`${key}Desc\`]`). The
 * `as const` deep-freeze would otherwise produce literal key types that
 * reject computed lookups. Values are not all strings — `chips`, `plans`
 * and `faqItems` are arrays.
 */
export type Messages = {
  [namespace: string]: Record<string, any>;
};

const messages = { ar: arMessages, en: enMessages } as const as Record<
  Locale,
  Messages
>;

/**
 * Full message bundle for a locale. For server components only — the
 * request-config route (`getTranslations`) can't distinguish / from /en in
 * this project (no [locale] segment), so pages and sections import their
 * copy directly instead.
 */
export function getMessages(locale: Locale): Messages {
  return messages[locale];
}
