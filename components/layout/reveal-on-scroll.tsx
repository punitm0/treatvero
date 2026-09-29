"use client";

import { useEffect } from "react";

/**
 * What fades up as it scrolls into view: page titles and ledes, section
 * headings and eyebrows, grid list items (cards, steps) and articles. Opt in
 * anywhere else with `data-reveal`; opt a subtree out with `data-no-reveal`.
 */
const SELECTOR = "main section :is(h1, h2, .eyebrow, .text-lede, :is(ul, ol).grid > li, article), main [data-reveal]";
const STAGGER_MS = 70;
const MAX_STAGGER_MS = 350;

/**
 * Progressive enhancement: content is visible in the server HTML, and on the
 * first load only elements still below the fold are hidden (by
 * `data-reveal="hidden"`), so nothing above the fold flashes and no-JS /
 * reduced-motion users see the page as-is.
 *
 * Content that arrives later (a client navigation from the menu, filtering)
 * is hidden synchronously in the MutationObserver callback, before the browser
 * paints it, and the IntersectionObserver fades in whatever is on screen once
 * the router has reset the scroll position. So a new page animates in rather
 * than being measured against the previous page's scroll offset.
 */
export function RevealOnScroll() {
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const seen = new WeakSet<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        let i = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          el.style.animationDelay = `${Math.min(i++ * STAGGER_MS, MAX_STAGGER_MS)}ms`;
          el.dataset.reveal = "shown";
          const done = (e: AnimationEvent) => {
            if (e.target !== el) return;
            el.style.removeProperty("animation-delay");
            el.removeEventListener("animationend", done);
          };
          el.addEventListener("animationend", done);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const scan = (initial: boolean) => {
      const fold = window.innerHeight;
      for (const el of main.querySelectorAll<HTMLElement>(SELECTOR)) {
        if (seen.has(el)) continue;
        seen.add(el);
        if (el.closest("[data-no-reveal]")) continue;
        // Nested matches (an article inside a grid item) animate with their parent.
        const parent = el.parentElement?.closest(SELECTOR);
        if (parent && main.contains(parent)) continue;
        if (initial && el.getBoundingClientRect().top < fold) continue;
        el.dataset.reveal = "hidden";
        io.observe(el);
      }
    };

    scan(true);
    const mo = new MutationObserver(() => scan(false));
    mo.observe(main, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
