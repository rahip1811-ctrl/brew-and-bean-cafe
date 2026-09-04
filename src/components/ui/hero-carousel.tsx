"use client";

// A full-bleed editorial hero driven by a filmstrip.
//
// Every card shares one top edge. The focused card unfurls to full height while
// its neighbours stay clipped to half, so the strip reads as a row of cropped
// heads with one complete portrait standing in the middle of it. Changing the
// focus re-grades the whole background to that image.
//
// Geometry is measured, never hard-coded: one ResizeObserver reads the stage and
// every size below is a ratio of it, so the same component is pixel-identical in
// a 600px preview box and on a 4K display.
//
// Adapted for this project in three places, each marked below:
//   1. imports come from `motion/react`, not `framer-motion` — same API, and
//      the project already ships `motion`, so this avoids bundling two copies
//      of the animation engine.
//   2. photographs go through `next/image` rather than raw <img>. A hero that
//      eagerly loads nine untouched 3MB JPEGs would undo the whole mobile-first
//      performance budget.
//   3. wheel-to-navigate is opt-in (`wheelNavigation`), off by default. See the
//      note on that prop.
import * as React from "react";
import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

import { cn } from "@/lib/utils";

export interface HeroCarouselItem {
  /** Stable key; falls back to the index. @default undefined */
  id?: string | number;
  /** Headline for the active slide. Newlines become separate reveal lines. */
  title: string;
  /** Image URL, used both in the card and as the graded background. */
  image: string;
  /** Alternative text for the card image. @default "" (decorative) */
  alt?: string;
  /** Byline printed beside the headline, e.g. "BY AURELIA STUDIO." @default undefined */
  credit?: string;
  /** Right-aligned facts, e.g. ["SAT NOV 15", "5-10 PM", "MIAMI"]. @default undefined */
  meta?: string[];
  /**
   * CSS colour the background is graded to. The photo keeps its luminance and
   * takes this hue, which is what makes the backdrop swing on every change.
   * @default "#8a8a8a"
   */
  accent?: string;
}

export interface HeroCarouselProps {
  /** Slides, in strip order. */
  items: HeroCarouselItem[];
  /** Focused slide when controlled. Leave unset for internal state. @default undefined */
  index?: number;
  /** Focused slide on mount when uncontrolled. @default 0 */
  defaultIndex?: number;
  /** Fires on every focus change, from any input. @default undefined */
  onIndexChange?: (index: number) => void;
  /** Wordmark in the middle of the top bar. @default undefined */
  brand?: React.ReactNode;
  /** Renders the "Back" control when provided. @default undefined */
  onBack?: () => void;
  /** Renders the "Menu" control when provided. @default undefined */
  onMenu?: () => void;
  /** Advance on a timer. Pauses on hover, drag and focus. @default false */
  autoplay?: boolean;
  /** Milliseconds between autoplay steps. @default 4000 */
  autoplayDelay?: number;
  /**
   * Let the wheel step the strip. Off by default: this stage is full-height, so
   * capturing the wheel means a visitor trying to reach the opening hours has to
   * page through every slide first. It also fights Lenis, which is driving the
   * page scroll on desktop. Drag, click, arrow keys and autoplay all still work.
   * @default false
   */
  wheelNavigation?: boolean;
  /** Rendered over the stage, below the headline — CTAs, status, and so on. @default undefined */
  children?: React.ReactNode;
  /** Extra classes for the stage. @default undefined */
  className?: string;
}

/* Ratios lifted from the reference layout, all relative to the stage box. */
const CARD_H = 0.264; // active card height ÷ stage height
const CARD_AR = 0.75; // active card is 3:4
const GAP = 0.038; // gap ÷ card width
const STRIP_TOP = 0.5; // strip's shared top edge, down the stage
const TITLE = 0.067; // headline cap size ÷ stage height
const LABEL = 0.0103; // small mono label ÷ stage height
const PAD = 0.017; // page gutter ÷ stage width
const RAIL = 0.2; // progress rail width ÷ stage width

/** Wheel distance that commits to a step, and the lockout after one. */
const WHEEL_THRESHOLD = 60;
const WHEEL_COOLDOWN = 420;

/* Film grain, as a self-contained SVG so the component carries no assets. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

/**
 * Every size in this component derives from a measurement, so that measurement
 * has to land before the browser paints — otherwise the strip shows one frame at
 * its 96px floor and then springs up to full height, which reads as a bug.
 * `useLayoutEffect` does that but warns during server rendering, so fall back to
 * `useEffect` where there is no layout to read.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export function HeroCarousel({
  items,
  index: controlled,
  defaultIndex = 0,
  onIndexChange,
  brand,
  onBack,
  onMenu,
  autoplay = false,
  autoplayDelay = 4000,
  wheelNavigation = false,
  children,
  className,
}: HeroCarouselProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [box, setBox] = React.useState({ w: 0, h: 0 });
  const [uncontrolled, setUncontrolled] = React.useState(defaultIndex);
  const [dragging, setDragging] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const reduced = useReducedMotion();

  const last = items.length - 1;
  const index = clamp(controlled ?? uncontrolled, 0, Math.max(0, last));

  const go = React.useCallback(
    (next: number) => {
      const clamped = clamp(next, 0, Math.max(0, last));
      if (controlled === undefined) setUncontrolled(clamped);
      if (clamped !== index) onIndexChange?.(clamped);
    },
    [controlled, index, last, onIndexChange],
  );

  // One observer feeds every measurement below.
  useIsomorphicLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const read = () => setBox({ w: stage.clientWidth, h: stage.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  const fullH = clamp(box.h * CARD_H, 96, 360);
  const halfH = fullH / 2;
  const cardW = fullH * CARD_AR;
  const gap = Math.max(4, Math.round(cardW * GAP));
  const step = cardW + gap;
  const pad = Math.max(16, Math.round(box.w * PAD));
  const label = Math.max(9, Math.round(box.h * LABEL));

  // Centre the focused card: the track slides, the card never moves itself.
  const xFor = React.useCallback(
    (i: number) => box.w / 2 - (i * step + cardW / 2),
    [box.w, step, cardW],
  );
  const x = useMotionValue(0);
  const target = xFor(index);

  const swing = reduced
    ? { duration: 0 }
    : { duration: 0.7, ease: "easeOut" as const };
  const spring = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 34, mass: 0.9 };

  // The track is driven by a motion value rather than an `animate` prop so a
  // drag that starts mid-spring reads the real position, not where the spring
  // was headed - otherwise the release snaps a card off.
  React.useEffect(() => {
    if (dragging) return;
    const run = animate(x, target, spring);
    return () => run.stop();
    // `spring` is a literal, so `reduced` (all it derives from) stands in for it.
  }, [target, dragging, reduced, x]); // eslint-disable-line react-hooks/exhaustive-deps

  // Wheel and trackpad. Both axes step the strip. Opt-in — see `wheelNavigation`.
  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !wheelNavigation) return;
    let acc = 0;
    let until = 0;

    const onWheel = (e: WheelEvent) => {
      // Trackpads report the dominant axis; take whichever is stronger.
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      // Scroll chaining: once the strip is against an end, hand the gesture
      // back to the page. Without this a full-height carousel is a scroll trap
      // with no way past it.
      const stuck = (delta > 0 && index === last) || (delta < 0 && index === 0);
      if (stuck) {
        acc = 0;
        return;
      }
      e.preventDefault();
      const now = e.timeStamp;
      if (now < until) return;
      acc += delta;
      if (Math.abs(acc) < WHEEL_THRESHOLD) return;
      go(index + Math.sign(acc));
      acc = 0;
      until = now + WHEEL_COOLDOWN;
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [go, index, last, wheelNavigation]);

  React.useEffect(() => {
    if (!autoplay || paused || dragging || items.length < 2) return;
    const id = window.setTimeout(
      () => go(index === last ? 0 : index + 1),
      autoplayDelay,
    );
    return () => window.clearTimeout(id);
  }, [autoplay, autoplayDelay, dragging, go, index, items.length, last, paused]);

  const active = items[index];
  if (!active) return null;

  const lines = active.title.split("\n");
  const accent = active.accent ?? "#8a8a8a";

  return (
    <div
      ref={stageRef}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="Featured looks"
      onKeyDown={(e) => {
        const keys: Record<string, number> = {
          ArrowLeft: index - 1,
          ArrowRight: index + 1,
          Home: 0,
          End: last,
        };
        if (!(e.key in keys)) return;
        e.preventDefault();
        go(keys[e.key]!);
      }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn(
        "relative h-full min-h-[24rem] w-full select-none overflow-hidden bg-charcoal text-plaster",
        "outline-none focus-visible:ring-1 focus-visible:ring-plaster/40 focus-visible:ring-inset",
        className,
      )}
    >
      {/* ── Background: the focused photo, blown up and re-hued to its accent ── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={swing}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: reduced ? 1.28 : 1.42 }}
            animate={{ scale: 1.28 }}
            transition={
              reduced ? { duration: 0 } : { duration: 6, ease: "linear" }
            }
          >
            <Image
              src={active.image}
              alt=""
              aria-hidden
              fill
              draggable={false}
              // Only the first slide is above the fold on load; the rest swap in
              // after an interaction, by which point they are already cached from
              // their own card in the strip.
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
          {/* Keep the photo's luminance, take the accent's hue. */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: accent, mixBlendMode: "color" }}
          />
          <div
            // Deeper than the reference's 0.55. The café's photographs are
            // bone-white plaster and cream stone rather than the demo's dark
            // studio art, so a lighter multiply left the whole stage washed out:
            // the headline had nothing to sit on and pale cards had no edge.
            className="absolute inset-0 opacity-[0.68]"
            style={{ backgroundColor: accent, mixBlendMode: "multiply" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Legibility washes + grain, above the swap so they never flicker.
          Vertical alone is not enough: the headline sits around 40% down, where
          a from/via/to gradient is at its most transparent. The second, left-
          weighted pass guarantees contrast down the text column while leaving
          the right of the photograph bright. */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-charcoal/20 to-charcoal/65" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 via-charcoal/10 to-transparent" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }}
      />

      {/* ── Top bar: a centred cluster, not edge-to-edge ── */}
      {(onBack || brand || onMenu) && (
        <div
          className="absolute inset-x-0 z-20 flex items-center justify-center"
          style={{
            top: Math.max(16, box.h * 0.029),
            gap: `${Math.max(20, box.w * 0.06)}px`,
          }}
        >
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="opacity-90 transition-opacity hover:opacity-100"
              style={{ fontSize: label * 1.15 }}
            >
              <span aria-hidden>↖</span> Back
            </button>
          ) : null}
          {brand ? (
            <div
              className="font-semibold tracking-[0.06em]"
              style={{ fontSize: label * 1.35 }}
            >
              {brand}
            </div>
          ) : null}
          {onMenu ? (
            <button
              type="button"
              onClick={onMenu}
              className="opacity-90 transition-opacity hover:opacity-100"
              style={{ fontSize: label * 1.15 }}
            >
              Menu <span aria-hidden>☰</span>
            </button>
          ) : null}
        </div>
      )}

      {/* ── Headline block, sitting just above the strip's top edge ── */}
      <div
        className="absolute inset-x-0 top-0 z-10 flex flex-col justify-end"
        style={{
          height: `${STRIP_TOP * 100}%`,
          paddingLeft: pad,
          paddingRight: pad,
          paddingBottom: Math.round(box.h * 0.028),
        }}
      >
        <div className="flex w-full flex-wrap items-end gap-x-[6vw] gap-y-2">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.h1
              key={index}
              // `text-plaster` is explicit because the project's base layer sets
              // a brown colour on every h1-h4. Inheriting the stage's light text
              // is not enough — the element's own rule wins, and the headline
              // renders dark brown on a dark photograph.
              className="font-[family-name:var(--font-display)] leading-[0.88] tracking-[-0.03em] text-plaster"
              style={{ fontSize: Math.max(24, Math.round(box.h * TITLE)) }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
            >
              {lines.map((line, i) => (
                // Each line wipes up from behind its own edge.
                <span key={i} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : {
                            duration: 0.62,
                            delay: i * 0.07,
                            ease: [0.22, 1, 0.36, 1],
                          }
                    }
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h1>
          </AnimatePresence>

          {active.credit ? (
            <motion.p
              key={`credit-${index}`}
              className="font-mono uppercase tracking-[0.14em] opacity-80"
              style={{ fontSize: label }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {active.credit}
            </motion.p>
          ) : null}

          {active.meta?.length ? (
            <div
              className="ml-auto flex items-end"
              style={{ gap: `${Math.max(16, box.w * 0.055)}px` }}
            >
              {active.meta.map((fact, i) => (
                <motion.span
                  key={`${index}-${fact}`}
                  className="whitespace-nowrap font-mono uppercase tracking-[0.14em] opacity-80"
                  style={{ fontSize: label }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 0.8, y: 0 }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { duration: 0.45, delay: 0.12 + i * 0.06 }
                  }
                >
                  {fact}
                </motion.span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* ── The strip: one shared top edge, the focused card twice as tall ──

          Held back until the stage has been measured. Motion reads `initial`
          once, at mount; mounting the cards before the first measurement would
          freeze that initial height at the 96px floor and then spring every
          card up to full size on load — a flourish that reads as a layout bug.
          The measurement runs in a layout effect, so this costs no visible
          delay. Everything that matters for SEO — the headline, credit, facts
          and calls to action — is rendered above regardless. */}
      {box.h > 0 && (
      <div
        className="absolute inset-x-0"
        style={{ top: `${STRIP_TOP * 100}%`, height: fullH }}
      >
        <motion.div
          className="flex items-start"
          style={{ gap, x, cursor: dragging ? "grabbing" : "grab" }}
          drag="x"
          dragMomentum={false}
          dragElastic={0.08}
          dragConstraints={{ left: xFor(last), right: xFor(0) }}
          onDragStart={() => setDragging(true)}
          onDragEnd={(_, info) => {
            setDragging(false);
            // Land on whatever card the release sits nearest, nudged by throw
            // velocity so a flick clears more than one card.
            const thrown = x.get() + info.velocity.x * 0.12;
            go(Math.round((box.w / 2 - thrown - cardW / 2) / step));
          }}
        >
          {items.map((item, i) => (
            <motion.button
              key={item.id ?? i}
              type="button"
              aria-label={item.title.replace(/\n/g, " ")}
              aria-current={i === index}
              onClick={() => go(i)}
              // The inset hairline is what stops a pale photograph — the white
              // plaster room, the cream storefront — from dissolving into a
              // pale backdrop and reading as a gap in the strip.
              className="relative shrink-0 overflow-hidden rounded-none bg-plaster/5 shadow-[inset_0_0_0_1px_rgb(247_242_233_/_0.28)]"
              style={{ width: cardW }}
              // `initial` as well as `animate`: height is the card's only
              // source of size, and a button holding nothing but an absolutely
              // positioned image computes to 0 tall. Without this the entire
              // strip is invisible until Motion's first frame lands — so a
              // throttled or failed animation leaves an empty stage.
              initial={{ height: i === index ? fullH : halfH }}
              animate={{ height: i === index ? fullH : halfH }}
              transition={spring}
            >
              {/* The focused card is exactly 3:4, so object-position does
                  nothing to it - it only picks which band of the portrait the
                  half-height neighbours keep. Anchored just above centre so a
                  clipped card still shows a face, not a forehead. */}
              <Image
                src={item.image}
                alt={item.alt ?? ""}
                fill
                draggable={false}
                sizes="(max-width: 768px) 40vw, 20vw"
                className="object-cover"
                style={{ objectPosition: "50% 26%" }}
              />
              {/* Unfocused cards sit back a touch without going grey. */}
              <motion.span
                aria-hidden
                className="absolute inset-0 bg-charcoal"
                animate={{ opacity: i === index ? 0 : 0.12 }}
                transition={spring}
              />
            </motion.button>
          ))}
        </motion.div>
      </div>
      )}

      {/* ── Position rail ── */}
      <div
        className="absolute z-10"
        style={{
          left: pad,
          bottom: Math.max(14, box.h * 0.022),
          width: box.w * RAIL,
        }}
      >
        <div
          className="flex justify-between font-mono tabular-nums opacity-80"
          style={{ fontSize: label }}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{String(items.length).padStart(2, "0")}</span>
        </div>
        <div className="relative mt-2 h-px w-full bg-plaster/25">
          <motion.div
            className="absolute inset-y-0 bg-plaster"
            style={{ width: `${100 / items.length}%` }}
            animate={{ left: `${(index / items.length) * 100}%` }}
            transition={spring}
          />
        </div>
      </div>

      {/* Consumer-supplied overlay — CTAs, opening status, anything that has to
          survive the slide changing. Sits bottom-right, clear of the rail. */}
      {children ? (
        <div
          className="absolute z-20"
          style={{ right: pad, bottom: Math.max(14, box.h * 0.022) }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
