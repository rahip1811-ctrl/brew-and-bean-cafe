"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Section } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { site } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

const reviews = [
  {
    quote: "The kind of place where you accidentally stay for three hours.",
    name: "Aarav P.",
    meta: "Google review",
    rating: 5,
  },
  {
    quote:
      "I came for the croissant and stayed for the filter kaapi, which is the best I have had outside my grandmother's kitchen.",
    name: "Devika R.",
    meta: "Google review",
    rating: 5,
  },
  {
    quote:
      "Worked here every Tuesday for four months. Nobody has ever once given me the look that says you should order something else or leave.",
    name: "Kabir M.",
    meta: "Google review",
    rating: 5,
  },
  {
    quote:
      "The room is genuinely beautiful and somehow not annoying about it. The saffron thing they do with the espresso is worth the trip on its own.",
    name: "Sana Q.",
    meta: "Google review",
    rating: 5,
  },
];

export function Reviews() {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const reduced = useReducedMotion();

  const paginate = useCallback(
    (delta: number) =>
      setState(([i]) => [(i + delta + reviews.length) % reviews.length, delta]),
    [],
  );

  const review = reviews[index];
  const offset = reduced ? 0 : 60;

  return (
    <Section id="reviews" tone="limewash">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="eyebrow">Reviews</p>
        </Reveal>

        <div className="relative mt-10 min-h-[260px] sm:min-h-[240px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.blockquote
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? offset : -offset }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -offset : offset }}
              transition={{ duration: reduced ? 0.2 : 0.45, ease: EASE }}
              drag={reduced ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) paginate(1);
                if (info.offset.x > 60) paginate(-1);
              }}
              className="cursor-grab active:cursor-grabbing"
            >
              <Stars count={review.rating} />

              <p className="mt-6 font-[family-name:var(--font-display)] text-[clamp(1.5rem,3.4vw,2.35rem)] leading-[1.25] text-bean">
                &ldquo;{review.quote}&rdquo;
              </p>

              <footer className="mt-7 text-sm text-clay">
                <span className="text-ink">{review.name}</span>
                <span className="mx-2 text-brass">·</span>
                {review.meta}
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-5">
          <CarouselButton label="Previous review" onClick={() => paginate(-1)}>
            ‹
          </CarouselButton>

          <div className="flex gap-2">
            {reviews.map((r, i) => (
              <button
                key={r.name}
                type="button"
                aria-label={`Review ${i + 1} of ${reviews.length}`}
                aria-current={i === index}
                onClick={() => setState([i, i > index ? 1 : -1])}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-7 bg-bean" : "w-1.5 bg-clay/35 hover:bg-clay/60"
                }`}
              />
            ))}
          </div>

          <CarouselButton label="Next review" onClick={() => paginate(1)}>
            ›
          </CarouselButton>
        </div>

        <Reveal delay={0.1}>
          <a
            href={site.reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-block text-sm text-clay underline decoration-brass/40 underline-offset-4 transition-colors hover:text-bean"
          >
            Read all reviews on Google
          </a>
        </Reveal>
      </div>
    </Section>
  );
}

function CarouselButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-10 place-items-center rounded-full border border-brass/30 text-bean transition-colors hover:border-bean hover:bg-travertine/60"
    >
      {children}
    </button>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex justify-center gap-1" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < count ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-brass"
          aria-hidden
        >
          <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3 1.2-6.8-5-4.9 6.9-1Z" />
        </svg>
      ))}
    </div>
  );
}
