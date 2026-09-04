"use client";

import Link from "next/link";
import { HeroCarousel, type HeroCarouselItem } from "@/components/ui/hero-carousel";
import { OpenStatus } from "@/components/open-status";

/**
 * The home page opening: the editorial filmstrip carousel, dressed in the
 * café's own photography and palette.
 *
 * Two deliberate departures from the reference demo:
 *
 *   The accents are warm. The demo grades each backdrop to a neon (#7b61ff,
 *   #00c8ff); those hues would fight every other section on the page. These are
 *   drawn from the site's own tokens — bean, terracotta, brass, palm — so the
 *   backdrop still swings hard on every slide but always lands somewhere the
 *   rest of the page recognises.
 *
 *   The CTAs and the live open/closed badge are kept. The demo hero has no slot
 *   for them, but "View Menu", "Find Us" and "Open now" are the reasons this
 *   page exists for someone arriving from Instagram or Google Maps. Losing them
 *   to a nicer-looking hero would be a bad trade.
 *
 * The watermarked stock images are deliberately excluded here — the hero is the
 * last place to show one.
 */
const SLIDES: HeroCarouselItem[] = [
  {
    id: "storefront",
    title: "Good coffee.\nSlow moments.",
    image: "/images/exterior-storefront.png",
    alt: "The Brew and Bean storefront on Sindhu Bhavan Road at golden hour",
    credit: "BREW AND BEAN CAFE.",
    meta: ["8 AM – 10 PM", "BODAKDEV", "AHMEDABAD"],
    accent: "#9a6a46",
  },
  {
    id: "roastery",
    title: "Roasted\nin small lots.",
    image: "/images/bar-counter-grinders.jpg",
    alt: "Grinders and the espresso machine along the live-edge wooden bar",
    credit: "SMALL-LOT ROASTERY.",
    meta: ["6 ORIGINS", "DIALLED IN DAILY"],
    accent: "#a5502f",
  },
  {
    id: "pastry",
    title: "Baked\nevery morning.",
    image: "/images/signature-cream-croissant.jpg",
    alt: "The kesar pista croissant with saffron cream and pistachio",
    credit: "LAMINATED OVER THREE DAYS.",
    meta: ["40 A DAY", "THEN WE STOP"],
    accent: "#b08d57",
  },
  {
    id: "room",
    title: "A room\nto stay in.",
    image: "/images/niche-wall-wide.jpg",
    alt: "The sculpted plaster niche wall with cane chairs and rattan pendants",
    credit: "PLASTER, CANE & PLENTY OF PLANTS.",
    meta: ["PLUG POINTS", "NO RUSH"],
    accent: "#5f6f52",
  },
  {
    id: "barista",
    title: "Pulled\nby hand.",
    image: "/images/barista-at-work.jpg",
    alt: "A barista pulling a shot behind the bar",
    credit: "BY OUR BARISTAS.",
    meta: ["SINCE 2019", "AHMEDABAD"],
    accent: "#402316",
  },
  {
    id: "signature",
    title: "Brown Sugar\nCloud.",
    image: "/images/cappuccino-latte-art.jpg",
    alt: "A cappuccino with rosetta latte art on a wooden table",
    credit: "ESPRESSO · BROWN SUGAR · COLD FOAM.",
    meta: ["SIGNATURE", "₹240"],
    accent: "#c2643e",
  },
  {
    id: "kaapi",
    title: "Filter\nKaapi.",
    image: "/images/filter-kaapi.jpg",
    alt: "Filter coffee served in a brass davara and tumbler",
    credit: "CHIKMAGALUR DECOCTION.",
    meta: ["ALL DAY", "₹160"],
    accent: "#7a5230",
  },
];

export function HeroShowcase() {
  return (
    // The stage measures itself from this box, so the height lives here. The
    // min-height keeps it usable on a short landscape phone, where 100svh alone
    // would crush the strip into the headline.
    <section id="top" className="h-[100svh] min-h-[34rem] w-full">
      <HeroCarousel
        items={SLIDES}
        defaultIndex={0}
        autoplay
        autoplayDelay={5200}
        // Brand and menu controls are omitted: the site's own fixed navbar sits
        // above this and already carries the wordmark and navigation.
      >
        <div className="flex flex-col items-end gap-3">
          <OpenStatus variant="dark" />
          <div className="flex gap-2.5">
            <Link
              href="/menu"
              className="rounded-full bg-plaster px-6 py-3 text-sm text-bean transition-colors hover:bg-brass hover:text-plaster"
            >
              View Menu
            </Link>
            <Link
              href="#visit"
              className="rounded-full border border-plaster/45 px-6 py-3 text-sm text-plaster transition-colors hover:border-plaster hover:bg-plaster/10"
            >
              Find Us
            </Link>
          </div>
        </div>
      </HeroCarousel>
    </section>
  );
}
