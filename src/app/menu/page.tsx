import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DietMark } from "@/components/featured-menu";
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import { formatPrice, menu } from "@/lib/menu";
import { hoursDisplay, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Coffee, tea, breakfast, pastries and desserts at Brew and Bean Cafe on Sindhu Bhavan Road, Ahmedabad. Roasted in small lots, baked every morning.",
  alternates: { canonical: "/menu" },
};

export default function MenuPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-bean pb-16 pt-36 text-plaster sm:pb-20 sm:pt-44">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/bar-counter-grinders.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-bean via-bean/85 to-bean/60" />

        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
          <Reveal>
            <p className="eyebrow">The full menu</p>
            <h1 className="mt-4 max-w-2xl text-[clamp(2.4rem,6vw,4rem)] leading-[1.02] text-plaster">
              Everything we make.
            </h1>
            <p className="mt-5 max-w-lg leading-relaxed text-plaster/70">
              Roasted in small lots, baked every morning. Prices include taxes.
              The kitchen closes thirty minutes before we do.
            </p>
          </Reveal>

          {/* Jump links — five categories is enough to make a phone visitor
              scroll a long way to reach the one they came for. */}
          <Reveal delay={0.1}>
            <nav className="mt-9 flex flex-wrap gap-2" aria-label="Menu categories">
              {menu.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="rounded-full border border-plaster/25 px-5 py-2.5 text-sm text-plaster/80 transition-colors hover:border-plaster hover:bg-plaster/10 hover:text-plaster"
                >
                  {category.label}
                </a>
              ))}
            </nav>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="space-y-20 sm:space-y-28">
          {menu.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-28">
              <Reveal>
                <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-brass/25 pb-5">
                  <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)]">{category.label}</h2>
                  <p className="text-sm text-clay">{category.note}</p>
                </div>
              </Reveal>

              <Stagger className="mt-10 grid gap-x-14 gap-y-9 lg:grid-cols-2" gap={0.07}>
                {category.items.map((item) => (
                  <StaggerItem key={item.name} as="article">
                    <div className="flex items-baseline gap-4">
                      <h3 className="text-lg leading-snug">{item.name}</h3>
                      {/* The dotted leader that makes a printed menu read as a
                          menu rather than as a list of products. */}
                      <span className="mt-auto h-px flex-1 translate-y-[-4px] border-b border-dotted border-brass/40" />
                      <span className="shrink-0 text-clay">{formatPrice(item.price)}</span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-clay">
                      {item.description}
                    </p>
                    <DietMark diet={item.diet} />
                  </StaggerItem>
                ))}
              </Stagger>
            </section>
          ))}
        </div>

        <Reveal>
          <div className="mt-24 rounded-3xl bg-limewash p-8 sm:p-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl">Hungry now?</h2>
                <p className="mt-3 max-w-md text-clay">
                  {hoursDisplay[0].label}, {hoursDisplay[0].value}. Weekends we stay
                  open an hour later.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/#reserve"
                  className="rounded-full bg-bean px-7 py-3.5 text-sm text-plaster transition-colors hover:bg-terracotta"
                >
                  Reserve a Table
                </Link>
                <a
                  href={site.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-bean/25 px-7 py-3.5 text-sm text-bean transition-colors hover:border-bean hover:bg-travertine/60"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
