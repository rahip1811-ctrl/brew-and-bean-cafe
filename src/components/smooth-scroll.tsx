"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Momentum scrolling, desktop only.
 *
 * Lenis makes a long scrolling page feel expensive on a trackpad, but on a
 * phone it replaces the OS's own momentum with a JavaScript approximation —
 * which feels worse, not better, and costs a frame budget the site is
 * mobile-first about protecting. So it runs only for fine pointers, and never
 * when the visitor has asked for reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
    });

    let frame = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    });

    // Lenis takes over the scroll position, so `scroll-behavior: smooth` no
    // longer applies and in-page anchors would jump. Route them back through it.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      const href = anchor?.getAttribute("href");
      if (!href?.startsWith("#") || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
      history.pushState(null, "", href);
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
