"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Section, SectionHeading } from "@/components/section";

const EASE = [0.22, 1, 0.36, 1] as const;

const photos = [
  {
    src: "/images/niche-wall-wide.jpg",
    alt: "The sculpted plaster niche wall with cane chairs and rattan pendants",
  },
  { src: "/images/cappuccino-latte-art.jpg", alt: "A cappuccino with rosetta latte art" },
  {
    src: "/images/exterior-storefront.png",
    alt: "The storefront on Sindhu Bhavan Road at golden hour",
  },
  {
    src: "/images/interior-plants-mirror.jpg",
    alt: "The main room, with the arched rattan mirror and green marble tables",
  },
  { src: "/images/pastries-danish-spread.jpg", alt: "Danishes, a muffin and two coffees" },
  {
    src: "/images/plaster-niche-stairs.jpg",
    alt: "The sculptural plaster staircase above the banquette",
  },
  { src: "/images/bar-shelf-cups.jpg", alt: "Cups warming on top of the espresso machine" },
  {
    src: "/images/window-arch-interior.jpg",
    alt: "Looking in through the pale blue window frame at the curved shelves",
  },
  { src: "/images/barista-at-work.jpg", alt: "A barista at the bar during service" },
  {
    src: "/images/interior-banquette.jpg",
    alt: "The banquette with line-art cushions and travertine tables",
  },
  {
    src: "/images/niche-wall-cane-chairs.jpg",
    alt: "Palm fans on the plaster wall beside the cane seating",
  },
  { src: "/images/terrace-rattan-pots.jpg", alt: "The terrace, with terracotta pots and rattan chairs" },
];

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const reduced = useReducedMotion();

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (delta: number) => setIndex((i) => (i === null ? null : (i + delta + photos.length) % photos.length)),
    [],
  );

  useEffect(() => {
    if (index === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, step]);

  return (
    <Section id="gallery">
      <SectionHeading
        eyebrow="Gallery"
        title="Come see for yourself."
        description="The room, the bar, the pastries and the regulars who never leave."
        align="center"
      />

      {/* CSS columns give a true masonry flow without measuring anything in
          JavaScript, so the grid is correct on first paint. */}
      <div className="mt-14 columns-2 gap-3 sm:gap-4 lg:columns-3">
        {photos.map((photo, i) => (
          <motion.button
            key={photo.src}
            type="button"
            onClick={() => setIndex(i)}
            className="group mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl sm:mb-4"
            initial={{ opacity: 0, y: reduced ? 0 : 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: reduced ? 0.2 : 0.6, delay: (i % 3) * 0.06, ease: EASE }}
          >
            <span className="relative block">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={800}
                height={1000}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                className="h-auto w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />
              <span className="absolute inset-0 bg-bean/0 transition-colors duration-500 group-hover:bg-bean/25" />
              <span className="absolute bottom-3 left-3 right-3 translate-y-2 text-left text-xs text-plaster opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                View
              </span>
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {index !== null && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-charcoal/95 p-4 backdrop-blur-sm sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={photos[index].alt}
          >
            <motion.div
              className="relative max-h-full w-full max-w-4xl"
              initial={{ scale: reduced ? 1 : 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: reduced ? 1 : 0.96, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[index].src}
                alt={photos[index].alt}
                width={1600}
                height={2000}
                sizes="(max-width: 1024px) 100vw, 900px"
                className="mx-auto h-auto max-h-[80vh] w-auto rounded-xl object-contain"
                priority
              />
              <p className="mt-4 text-center text-sm text-plaster/60">{photos[index].alt}</p>
            </motion.div>

            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-plaster/25 text-plaster transition-colors hover:bg-plaster/10 sm:right-8 sm:top-8"
            >
              ✕
            </button>

            <LightboxArrow side="left" onClick={() => step(-1)} />
            <LightboxArrow side="right" onClick={() => step(1)} />
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

function LightboxArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-plaster/25 text-plaster transition-colors hover:bg-plaster/10 ${
        side === "left" ? "left-2 sm:left-6" : "right-2 sm:right-6"
      }`}
    >
      {side === "left" ? "‹" : "›"}
    </button>
  );
}
