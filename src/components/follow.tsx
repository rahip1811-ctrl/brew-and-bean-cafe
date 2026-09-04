import Image from "next/image";
import { Section, SectionHeading } from "@/components/section";
import { Stagger, StaggerItem } from "@/components/motion-primitives";
import { site } from "@/lib/site";

/**
 * This section replaces the ordering block. The site's job is to send people
 * back to Instagram and Google, not to a delivery app — so the strongest
 * closing action is a follow, not a checkout.
 */
const posts = [
  { src: "/images/signature-cream-croissant.jpg", alt: "The kesar pista croissant" },
  { src: "/images/plaster-niche-stairs.jpg", alt: "The plaster staircase and niche wall" },
  { src: "/images/cappuccino-latte-art.jpg", alt: "A cappuccino on the terrace table" },
  { src: "/images/bar-shelf-cups.jpg", alt: "Cups warming on the machine" },
  { src: "/images/terrace-rattan-pots.jpg", alt: "The terrace seating" },
  { src: "/images/table-spread-cheesecake.jpg", alt: "Cheesecake, a croissant and chai" },
];

export function Follow() {
  return (
    <Section id="follow">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Follow along"
          title="We post the good days."
          description="New drinks, seasonal bakes, and whatever the light is doing at four in the afternoon."
        />

        <a
          href={site.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2.5 self-start rounded-full bg-bean px-6 py-3.5 text-sm text-plaster transition-colors hover:bg-terracotta sm:self-end"
        >
          <InstagramIcon />@{site.instagram}
        </a>
      </div>

      <Stagger className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6" gap={0.06}>
        {posts.map((post) => (
          <StaggerItem key={post.src}>
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-2xl"
            >
              <Image
                src={post.src}
                alt={post.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
              />
              <span className="absolute inset-0 grid place-items-center bg-bean/0 text-plaster opacity-0 transition-all duration-300 group-hover:bg-bean/40 group-hover:opacity-100">
                <InstagramIcon />
              </span>
            </a>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
