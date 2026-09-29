"use client";

import { useEffect } from "react";

/**
 * What fades up as it scrolls into view: section headings and eyebrows, grid
 * list items (cards, steps) and articles. Opt in anywhere else with
 * `data-reveal`; opt a subtree out with `data-no-reveal`.
 */
const SELECTOR = "main section :is(h2, .eyebrow, :is(ul, ol).grid > li, article), main [data-reveal]";
const STAGGER_MS = 70;
const MAX_STAGGER_MS = 350;

/**
 * Progressive enhancement: content is visible in the server HTML and only
 * elements still below the fold are hidden (by `data-reveal="hidden"`), so
 * nothing above the fold ever flashes and no-JS / reduced-motion users see
 * the page as-is. A MutationObserver picks up content from client navigations
 * and filtering.
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

    const scan = () => {
      const fold = window.innerHeight;
      for (const el of main.querySelectorAll<HTMLElement>(SELECTOR)) {
        if (seen.has(el)) continue;
        seen.add(el);
        if (el.closest("[data-no-reveal]")) continue;
        // Nested matches (an article inside a grid item) animate with their parent.
        const parent = el.parentElement?.closest(SELECTOR);
        if (parent && main.contains(parent)) continue;
        if (el.getBoundingClientRect().top < fold) continue;
        el.dataset.reveal = "hidden";
        io.observe(el);
      }
    };

    scan();
    let frame = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    mo.observe(main, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
