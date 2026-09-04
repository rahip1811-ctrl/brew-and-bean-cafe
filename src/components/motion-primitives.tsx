"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

/**
 * The shared entrance motion. Every section on the site uses these three
 * components rather than hand-rolling variants, so the whole page moves with
 * one rhythm instead of a dozen slightly different ones.
 *
 * Every component here collapses to a plain fade — or to nothing at all — when
 * the visitor prefers reduced motion. Content always arrives.
 */

const DISTANCE = 24;
const EASE = [0.22, 1, 0.36, 1] as const;

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
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduced ? 0.2 : 0.7, delay, ease: EASE }}
    >
      {children}
    </Component>
  );
}

/** Parent for lists whose children should arrive one after another. */
export function Stagger({
  children,
  className,
  gap = 0.08,
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
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: gap } },
      }}
    >
      {children}
    </Component>
  );
}

export function staggerChild(reduced: boolean | null): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : DISTANCE },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.2 : 0.6, ease: EASE },
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
 * Headline text that rises into place a word at a time. Used once, in the
 * hero — a page where every heading does this is exhausting to read.
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
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.85, delay: delay + i * 0.07, ease: EASE }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
