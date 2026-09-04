import type { ReactNode } from "react";
import { Reveal } from "@/components/motion-primitives";

/** Wraps a page section with the shared max width, gutters and vertical rhythm. */
export function Section({
  id,
  children,
  className = "",
  tone = "plaster",
  full = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "plaster" | "limewash" | "bean";
  full?: boolean;
}) {
  const tones = {
    plaster: "bg-plaster",
    limewash: "bg-limewash",
    bean: "bg-bean text-plaster",
  };

  return (
    <section id={id} className={`${tones[tone]} py-20 sm:py-28 lg:py-36 ${className}`}>
      <div className={full ? "" : "mx-auto w-full max-w-7xl px-5 sm:px-8"}>{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  const centered = align === "center";

  return (
    <Reveal className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}>
      <p className={`eyebrow ${dark ? "text-brass/80" : ""}`}>{eyebrow}</p>
      <h2
        className={`mt-4 text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.06] ${
          dark ? "text-plaster" : ""
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 text-base leading-relaxed sm:text-lg ${
            dark ? "text-plaster/70" : "text-clay"
          }`}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
