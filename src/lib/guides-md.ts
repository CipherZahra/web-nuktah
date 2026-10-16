export type GuideLang = "ar" | "en";

export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  body: string;
}

export type GuideSummary = Omit<Guide, "body">;

export function formatGuideDate(iso: string, lang: GuideLang): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(lang === "ar" ? "ar-DZ" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Only these href shapes are allowed — anything else (javascript:, data:, vbscript:) is dropped. */
function safeHref(raw: string): string | null {
  const url = raw.trim();
  if (/^https?:\/\//i.test(url) || /^mailto:/i.test(url)) return url;
  if (url.startsWith("/") || url.startsWith("#")) return url;
  return null;
}

function inline(s: string): string {
  return escapeHtml(s)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text: string, href: string) => {
      const safe = safeHref(href);
      if (!safe) return text;
      const external = /^https?:\/\//i.test(safe);
      return `<a href="${safe}"${external ? ' rel="noopener noreferrer"' : ""}>${text}</a>`;
    })
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

export function renderGuideBody(md: string): string {
  const lines = md.split(/\r?\n/);
  let html = "";
  let list: "ul" | "ol" | null = null;
  let para: string[] = [];

  const closeList = () => {
    if (list) {
      html += `</${list}>`;
      list = null;
    }
  };
  const flushPara = () => {
    if (para.length) {
      html += `<p>${inline(para.join(" "))}</p>`;
      para = [];
    }
  };

  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      flushPara();
      closeList();
      continue;
    }
    const h = t.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      flushPara();
      closeList();
      const level = Math.min(Math.max(h[1].length, 2), 4);
      html += `<h${level}>${inline(h[2])}</h${level}>`;
      continue;
    }
    const ul = t.match(/^[-*]\s+(.*)$/);
    if (ul) {
      flushPara();
      if (list !== "ul") {
        closeList();
        html += "<ul>";
        list = "ul";
      }
      html += `<li>${inline(ul[1])}</li>`;
      continue;
    }
    const ol = t.match(/^\d+\.\s+(.*)$/);
    if (ol) {
      flushPara();
      if (list !== "ol") {
        closeList();
        html += "<ol>";
        list = "ol";
      }
      html += `<li>${inline(ol[1])}</li>`;
      continue;
    }
    para.push(t);
  }
  flushPara();
  closeList();
  return html;
}
