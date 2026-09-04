"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The hairline above the timeline, drawn left to right as it enters view.
 * Small, but it gives the four timeline entries something to hang off — the
 * line arrives, then the years land on it.
 */
export function DrawnRule() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="rule origin-left"
      initial={{ scaleX: reduced ? 1 : 0, opacity: reduced ? 1 : 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: reduced ? 0.2 : 1.3, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
