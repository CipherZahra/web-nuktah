import fs from "node:fs";
import path from "node:path";
import type { Guide, GuideLang } from "./guides-md";

export type { Guide, GuideLang, GuideSummary } from "./guides-md";
export { formatGuideDate } from "./guides-md";

function parseFrontmatter(raw: string, slug: string): Guide {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const fm = m ? m[1] : "";
  const body = m ? m[2] : raw;
  const field = (key: string): string => {
    const r = fm.match(new RegExp(`^${key}:\\s*(.*)$`, "m"));
    if (!r) return "";
    let v = r[1].trim();
    if (
      (v.startsWith("'") && v.endsWith("'")) ||
      (v.startsWith('"') && v.endsWith('"'))
    ) {
      v = v.slice(1, -1);
    }
    return v;
  };
  return {
    slug,
    title: field("title"),
    excerpt: field("excerpt"),
    date: field("date"),
    body,
  };
}

export function getGuides(lang: GuideLang): Guide[] {
  const dir = path.join(process.cwd(), "src", "content", "guides");
  const suffix = `.${lang}.md`;
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(suffix))
    .map((file) =>
      parseFrontmatter(
        fs.readFileSync(path.join(dir, file), "utf8"),
        file.slice(0, -suffix.length)
      )
    )
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getGuide(lang: GuideLang, slug: string): Guide | undefined {
  return getGuides(lang).find((g) => g.slug === slug);
}
