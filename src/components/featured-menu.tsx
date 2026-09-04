"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Section, SectionHeading } from "@/components/section";
import { featuredByCategory, formatPrice, type MenuItem } from "@/lib/menu";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * A teaser, not the menu. Three items per category with the full list a click
 * away at /menu — which is also the URL people share when someone asks what
 * this place serves.
 */
export function FeaturedMenu() {
  const [active, setActive] = useState(featuredByCategory[0].id);
  const reduced = useReducedMotion();
  const category = featuredByCategory.find((c) => c.id === active) ?? featuredByCategory[0];

  return (
    <Section id="menu" tone="limewash">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="The menu"
          title="Made with intention."
          description="From carefully brewed coffee to pastries that come out of the oven before you're awake."
        />
        <Link
          href="/menu"
          className="group hidden items-center gap-2 self-end text-sm text-bean lg:inline-flex"
        >
          See the full menu
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </div>

      {/* Horizontally scrollable on phones so five categories never wrap into
          a cramped two-line row. */}
      <div className="mt-12 -mx-5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
          {featuredByCategory.map((cat) => {
            const isActive = cat.id === active;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActive(cat.id)}
                aria-pressed={isActive}
                className={`relative rounded-full px-5 py-2.5 text-sm transition-colors ${
                  isActive ? "text-plaster" : "text-ink/70 hover:text-bean"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="category-pill"
                    className="absolute inset-0 rounded-full bg-bean"
                    transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
                  />
                )}
                <span className="relative">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={category.id}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: reduced ? 0 : 34 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -18 }}
          transition={{ duration: reduced ? 0.15 : 0.55, ease: EASE }}
        >
          {category.items.map((item) =>
            item.image ? (
              <ImageCard key={item.name} item={item} />
            ) : (
              <TextCard key={item.name} item={item} />
            ),
          )}
        </motion.div>
      </AnimatePresence>

      <Link
        href="/menu"
        className="mt-9 inline-flex items-center gap-2 rounded-full border border-bean/25 px-6 py-3 text-sm text-bean lg:hidden"
      >
        See the full menu →
      </Link>
    </Section>
  );
}

function ImageCard({ item }: { item: MenuItem }) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-plaster ring-1 ring-brass/15 sm:col-span-2 lg:col-span-1 lg:row-span-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image!}
          alt={item.name}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
      </div>
      <CardBody item={item} />
    </article>
  );
}

function TextCard({ item }: { item: MenuItem }) {
  return (
    <article className="group flex flex-col justify-between rounded-2xl bg-plaster ring-1 ring-brass/15 transition-shadow duration-500 hover:shadow-[0_10px_40px_rgba(64,35,22,0.08)]">
      <CardBody item={item} tall />
    </article>
  );
}

function CardBody({ item, tall = false }: { item: MenuItem; tall?: boolean }) {
  return (
    <div className={`flex flex-col gap-2 p-6 ${tall ? "min-h-[190px] justify-center" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl leading-snug">{item.name}</h3>
        <span className="mt-1 shrink-0 text-sm text-clay">{formatPrice(item.price)}</span>
      </div>
      <p className="text-sm leading-relaxed text-clay">{item.description}</p>
      <DietMark diet={item.diet} />
    </div>
  );
}

/**
 * The square veg / egg mark that every menu in India carries. Green for
 * vegetarian, amber for egg — with a text label, since colour alone would
 * fail anyone who cannot distinguish the two.
 */
export function DietMark({ diet }: { diet: MenuItem["diet"] }) {
  const veg = diet === "veg";
  const color = veg ? "text-palm" : "text-[#b8860b]";

  return (
    <span className={`mt-1 inline-flex items-center gap-1.5 text-[11px] ${color}`}>
      <span
        className="grid size-3.5 place-items-center rounded-[3px] border border-current"
        aria-hidden
      >
        <span className="size-1.5 rounded-full bg-current" />
      </span>
      {veg ? "Vegetarian" : "Contains egg"}
    </span>
  );
}
