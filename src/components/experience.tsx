import Image from "next/image";
import { Section, SectionHeading } from "@/components/section";
import { Stagger, StaggerItem } from "@/components/motion-primitives";

const pillars = [
  {
    title: "Coffee",
    body: "Specialty beans, roasted in small lots and dialled in fresh every morning before we unlock the door.",
    image: "/images/bar-counter-grinders.jpg",
    alt: "Grinders and the espresso machine along the live-edge wooden bar",
  },
  {
    title: "Fresh",
    body: "Croissants laminated over three days and baked at six. When they're gone, they're gone.",
    image: "/images/pourover-v60.jpg",
    alt: "A pour-over being brewed by hand",
  },
  {
    title: "Space",
    body: "Plaster arches, travertine tables and enough plug points. Work, meet, or read for three hours.",
    image: "/images/terrace-rattan-pots.jpg",
    alt: "The rattan seating on the terrace, under the timber pergola",
  },
];

export function Experience() {
  return (
    <Section id="experience" tone="limewash">
      <SectionHeading
        eyebrow="The café"
        title="Three things we get right."
        align="center"
      />

      <Stagger className="mt-14 grid gap-6 md:grid-cols-3" gap={0.16}>
        {pillars.map((pillar) => (
          <StaggerItem key={pillar.title} as="article">
            <div className="group h-full overflow-hidden rounded-3xl bg-plaster ring-1 ring-brass/15 transition-shadow duration-500 hover:shadow-[0_16px_50px_rgba(64,35,22,0.1)]">
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={pillar.image}
                  alt={pillar.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
              </div>
              <div className="p-7">
                <h3 className="text-2xl">{pillar.title}</h3>
                <p className="mt-3 leading-relaxed text-clay">{pillar.body}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
