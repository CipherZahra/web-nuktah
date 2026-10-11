import fs from "node:fs";
import path from "node:path";
import { renderGuideBody } from "./guides-md";

export type LegalKind = "privacy" | "terms" | "delete";
export type LegalLang = "ar" | "en";

const cache = new Map<string, string>();

export function getLegalHtml(kind: LegalKind, lang: LegalLang): string {
  const key = `${kind}.${lang}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  const file = path.join(process.cwd(), "src", "content", "legal", `${kind}.${lang}.md`);
  const html = renderGuideBody(fs.readFileSync(file, "utf8"));
  cache.set(key, html);
  return html;
}
