"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "motion/react";

/**
 * The shared entrance motion. Every section on the site uses these components
 * rather than hand-rolling variants, so the whole page moves with one rhythm
 * instead of a dozen slightly different ones.
 *
 * Tuning note: these numbers are deliberately generous. Short travel over a
 * fast duration reads as a flicker rather than as motion — by the time your eye
 * lands on the element it has already finished. 44px over ~0.95s, triggered as
 * the element crosses the fold rather than well after it, is the difference
 * between "did something move?" and motion you actually see.
 *
 * Every component here collapses to a plain fade — or to nothing at all — when
 * the visitor prefers reduced motion. Content always arrives.
 */

const DISTANCE = 44;
const DURATION = 0.95;
const EASE = [0.22, 1, 0.36, 1] as const;

/** Fires as the element crosses into view, not once it is already well past. */
const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : DISTANCE }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: reduced ? 0.2 : DURATION, delay, ease: EASE }}
    >
      {children}
    </Component>
  );
}

/** Parent for lists whose children should arrive one after another. */
export function Stagger({
  children,
  className,
  gap = 0.13,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  as?: "div" | "ul" | "section";
}) {
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: gap, delayChildren: 0.05 } },
      }}
    >
      {children}
    </Component>
  );
}

export function staggerChild(reduced: boolean | null): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : DISTANCE, scale: reduced ? 1 : 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: reduced ? 0.2 : DURATION, ease: EASE },
    },
  };
}

/** A child of `Stagger`. */
export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component className={className} variants={staggerChild(reduced)}>
      {children}
    </Component>
  );
}

/**
 * A heading that rises out of a clipping mask as it enters view — the same
 * gesture as the hero, at lower intensity. This is what makes each section feel
 * authored rather than merely faded in.
 */
export function MaskedHeading({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.25, delay }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    // `pb-[0.12em]` keeps descenders (g, y, p) from being shaved by the mask.
    <div className={`overflow-hidden pb-[0.12em] ${className ?? ""}`}>
      <motion.div
        initial={{ y: "105%" }}
        whileInView={{ y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.05, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Headline text that rises into place a word at a time. Used in the hero and
 * nowhere else — a page where every heading does this is exhausting to read.
 */
export function RisingWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) {
    return (
      <motion.span
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay }}
      >
        {text}
      </motion.span>
    );
  }

  return (
    <span className={className}>
      {words.map((word, i) => (
        // Each word gets its own clipping window so the letters slide up from
        // behind an invisible edge rather than simply fading.
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.05, delay: delay + i * 0.09, ease: EASE }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * Counts up to a number when it scrolls into view. Worth the code on the four
 * statistics in Our Story — a number that ticks up reads as a claim being made,
 * where the same number sitting still is just a label.
 */
export function CountUp({
  to,
  duration = 1.8,
  format = (n: number) => n.toLocaleString("en-IN"),
}: {
  to: number;
  duration?: number;
  format?: (value: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;

    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => setCount(Math.round(value)),
    });

    return () => controls.stop();
    // `format` is deliberately not a dependency — it's applied at render, and
    // the usual inline arrow default would restart the count every render.
  }, [inView, to, duration, reduced]);

  // Reduced motion renders the final number directly rather than setting state
  // from inside the effect, which would be a cascading render.
  // `tabular-nums` stops the digits jittering horizontally as they change.
  return (
    <span ref={ref} className="tabular-nums">
      {format(reduced ? to : count)}
    </span>
  );
}
