"use client";

import { useEffect } from "react";

/**
 * Reveal-on-scroll controller. Walks the document for `[data-reveal]`
 * elements, observes them, and adds `is-revealed` when they enter the
 * viewport. Replaces framer-motion's `whileInView` without shipping an
 * animation library to every page.
 */
export function RevealController() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-group]"),
    );
    if (els.length === 0) return;

    // Stagger index for grid children — consumed by the
    // animation-delay calc in globals.css.
    for (const el of document.querySelectorAll("[data-reveal-group]")) {
      Array.from(el.children).forEach((child, i) => {
        (child as HTMLElement).style.setProperty("--reveal-i", String(i));
      });
    }

    // Without IntersectionObserver (very old browsers) just show everything.
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
