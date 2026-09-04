"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Section, SectionHeading } from "@/components/section";
import { formatPrice, signatures } from "@/lib/menu";

/**
 * The showpiece. Full-bleed alternating rows where the photograph drifts
 * against the scroll while the copy settles into place beside it.
 *
 * The parallax is driven by `useScroll` on each row rather than a global
 * listener, so the browser only does the work for rows actually on screen.
 */
export function Signatures() {
  return (
    <Section id="signatures" tone="bean">
      <SectionHeading
        eyebrow="Signatures"
        title="The ones people come back for."
        description="Three things we would put our name on. Two of them sell out most days."
        dark
        align="center"
      />

      <div className="mt-16 space-y-20 lg:mt-24 lg:space-y-32">
        {signatures.map((item, i) => (
          <SignatureRow key={item.name} item={item} index={i} />
        ))}
      </div>
    </Section>
  );
}

function SignatureRow({
  item,
  index,
}: {
  item: (typeof signatures)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const flipped = index % 2 === 1;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // The image sits in a box 60% taller than its frame so it can travel a full
  // 44% of that height without ever exposing an edge. The previous ±8% was
  // technically parallax and visually nothing.
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-22%", "22%"]);

  // A gentle counter-drift on the copy pushes the two planes further apart.
  const textY = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["14%", "-14%"]);

  return (
    <div
      ref={ref}
      className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
        flipped ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div className="relative aspect-[5/4] overflow-hidden rounded-3xl lg:aspect-[4/5]">
        <motion.div className="absolute -inset-y-[30%] inset-x-0" style={{ y }}>
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>
      </div>

      {/* Two nested elements on purpose: a `style` motion value and an animated
          `y` on the same element would fight over the same transform. The outer
          one owns the scroll drift, the inner one owns the entrance. */}
      <motion.div style={{ y: textY }}>
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          transition={{ duration: reduced ? 0.2 : 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow">Signature</p>
          <h3 className="mt-4 text-[clamp(1.9rem,3.6vw,2.9rem)] leading-tight text-plaster">
            {item.name}
          </h3>
          <p className="mt-4 text-brass">{item.description}</p>
          <p className="mt-6 max-w-md leading-relaxed text-plaster/70">{item.story}</p>
          <p className="mt-8 font-[family-name:var(--font-display)] text-2xl text-plaster">
            {formatPrice(item.price)}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
