"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { OpenStatus } from "@/components/open-status";
import { RisingWords } from "@/components/motion-primitives";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The load sequence, in order:
 *   1. a dark curtain covers the photo and lifts
 *   2. the photo settles out of a slow scale-down
 *   3. the wordmark fades in
 *   4. the tagline rises a word at a time
 *   5. the buttons and the live status arrive
 *
 * The whole thing is ~2.2s. Anyone who prefers reduced motion gets the same
 * composition with a single short fade instead.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The photo drifts a little slower than the page as you scroll away from it.
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduced ? 1 : 0]);

  const t = (seconds: number) => (reduced ? 0 : seconds);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <div className="hero-zoom relative size-full">
          <Image
            src="/images/exterior-storefront.png"
            alt="The Brew and Bean Cafe storefront on Sindhu Bhavan Road at golden hour"
            fill
            priority
            sizes="100vw"
            quality={88}
            className="object-cover object-[60%_center]"
          />
        </div>

        {/* Three overlays, each doing one job.

            The building is cream and the headline is near-white, so a bottom
            gradient alone leaves the text sitting on a bright wall at some
            crop ratios. The left-weighted scrim guarantees contrast down the
            text column while leaving the signage on the right legible. */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/55 via-charcoal/5 to-transparent" />
        <div className="absolute inset-0 bg-bean/10 mix-blend-multiply" />
      </motion.div>

      {/* The curtain that lifts on load — see .hero-curtain in globals.css for
          why this one animation is CSS rather than Motion. */}
      <div className="hero-curtain pointer-events-none absolute inset-0 z-20 bg-charcoal" />

      <Steam />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-32 sm:px-8 lg:pb-28"
        style={{ opacity: contentOpacity }}
      >
        <motion.p
          className="eyebrow text-brass/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: t(0.7), delay: t(1.0) }}
        >
          Sindhu Bhavan Road · Ahmedabad
        </motion.p>

        <h1 className="mt-5 max-w-3xl text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.98] text-plaster">
          <RisingWords text="Good coffee." delay={t(1.15)} />
          <br />
          <span className="text-brass">
            <RisingWords text="Slow moments." delay={t(1.35)} />
          </span>
        </h1>

        <motion.p
          className="mt-7 max-w-md text-base leading-relaxed text-plaster/80 sm:text-lg"
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: t(0.8), delay: t(1.7), ease: EASE }}
        >
          Beans roasted in small lots, pastries out of the oven by six, and a room
          that is genuinely happy to have you stay all afternoon.
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: t(0.8), delay: t(1.95), ease: EASE }}
        >
          <Link
            href="/menu"
            className="rounded-full bg-plaster px-7 py-3.5 text-sm text-bean transition-colors hover:bg-brass hover:text-plaster"
          >
            View Menu
          </Link>
          <Link
            href="#visit"
            className="rounded-full border border-plaster/45 px-7 py-3.5 text-sm text-plaster transition-colors hover:border-plaster hover:bg-plaster/10"
          >
            Find Us
          </Link>
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: t(0.8), delay: t(2.15) }}
        >
          <OpenStatus variant="dark" />
        </motion.div>
      </motion.div>

      <ScrollCue delay={t(2.35)} />
    </section>
  );
}

/**
 * Three wisps rising and dissipating on a long loop. Blurred, at 10% opacity,
 * and slow enough that you notice it only if you stop to look — which is the
 * point. Decorative, so it's hidden from assistive tech.
 */
function Steam() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-2/3 overflow-hidden" aria-hidden>
      {[
        { left: "18%", delay: 0, duration: 13, width: 120 },
        { left: "52%", delay: 4.5, duration: 16, width: 160 },
        { left: "78%", delay: 8, duration: 14, width: 100 },
      ].map((wisp, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 rounded-[50%] bg-plaster blur-3xl"
          style={{ left: wisp.left, width: wisp.width, height: wisp.width * 2 }}
          initial={{ opacity: 0, y: 60, scaleX: 0.7 }}
          animate={{
            opacity: [0, 0.1, 0.06, 0],
            y: [60, -180],
            scaleX: [0.7, 1.25],
          }}
          transition={{
            duration: wisp.duration,
            delay: wisp.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function ScrollCue({ delay }: { delay: number }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 lg:block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay }}
      aria-hidden
    >
      <div className="h-12 w-px overflow-hidden bg-plaster/25">
        {!reduced && (
          <motion.div
            className="h-1/2 w-full bg-plaster/80"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
    </motion.div>
  );
}
