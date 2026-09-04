import Image from "next/image";
import { Section, SectionHeading } from "@/components/section";
import { CountUp, Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import { DrawnRule } from "@/components/drawn-rule";

const timeline = [
  {
    year: "2019",
    title: "A garage roaster in Thaltej",
    body: "Meher Shah left a design studio in Bengaluru, came home, and bought a 1kg sample roaster she had no real business owning.",
  },
  {
    year: "2021",
    title: "The doors open on Sindhu Bhavan",
    body: "Eleven seats, one grinder, and a queue that started forming before we had a sign on the wall.",
  },
  {
    year: "2024",
    title: "Ten thousand cups, and counting",
    body: "We stopped counting shortly afterwards. The regulars have their own mugs now.",
  },
  {
    year: "2026",
    title: "Still here every morning at eight",
    body: "Same roaster. Better coffee. The cats outside came with the building.",
  },
];

/** `to` counts up on scroll; `value` renders as-is where there's no number. */
const stats: { to?: number; suffix?: string; value?: string; label: string }[] = [
  { to: 10000, suffix: "+", label: "Cups poured" },
  { to: 6, label: "Single-origin lots on rotation" },
  { to: 40, label: "Croissants a day, then we stop" },
  { value: "8 AM", label: "Every single morning" },
];

export function Story() {
  return (
    <Section id="story">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Our story"
            title="More than coffee."
            description="Brew and Bean was built around a simple idea — that a good cup of coffee can make an ordinary day feel a little better."
          />

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl leading-relaxed text-clay">
              We roast in small lots because we would rather run out than serve
              something stale. We bake in the morning because pastry does not
              survive a second day. And we built the room with enough soft chairs
              and enough plug points that nobody has ever felt hurried out of it.
            </p>
          </Reveal>

          <Stagger className="mt-12 grid grid-cols-2 gap-y-9 gap-x-6" gap={0.14}>
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="font-[family-name:var(--font-display)] text-[2.5rem] leading-none text-bean">
                  {stat.to !== undefined ? (
                    <>
                      <CountUp to={stat.to} />
                      {stat.suffix}
                    </>
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="mt-2 text-sm text-clay">{stat.label}</div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal className="relative" delay={0.15}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src="/images/barista-at-work.jpg"
              alt="A barista pulling a shot behind the bar at Brew and Bean"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* A second, smaller frame overlapping the first — the detail that
              makes an editorial layout look composed rather than gridded. */}
          <div className="absolute -bottom-8 -left-4 hidden w-40 overflow-hidden rounded-2xl ring-8 ring-plaster sm:block lg:-left-10 lg:w-52">
            <div className="relative aspect-square">
              <Image
                src="/images/roastery-beans.jpg"
                alt="Freshly roasted beans dropping into the cooling tray"
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-24 lg:mt-32">
        <DrawnRule />

        <Stagger className="grid gap-10 pt-14 sm:grid-cols-2 lg:grid-cols-4" gap={0.15}>
          {timeline.map((entry) => (
            <StaggerItem key={entry.year}>
              <div className="relative pt-6">
                {/* The dot that sits on the rule above. */}
                <span className="absolute -top-[3.6rem] left-0 size-2 rounded-full bg-terracotta" />
                <div className="font-[family-name:var(--font-display)] text-3xl text-terracotta">
                  {entry.year}
                </div>
                <h3 className="mt-3 text-lg leading-snug">{entry.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-clay">{entry.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
