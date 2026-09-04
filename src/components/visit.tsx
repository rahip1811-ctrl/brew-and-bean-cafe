import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { OpenStatus } from "@/components/open-status";
import {
  addressLines,
  hoursDisplay,
  KITCHEN_CLOSES_BEFORE,
  PHONE_IS_PLACEHOLDER,
  site,
} from "@/lib/site";

/**
 * Hours and location in one section. They answer the same question — "can I
 * go there right now, and how?" — and splitting them across two screens of
 * scrolling on a phone only makes that question harder to answer.
 */
export function Visit() {
  const actions = [
    { label: "Get Directions", href: site.directionsUrl, primary: true, external: true },
    ...(PHONE_IS_PLACEHOLDER
      ? [{ label: "Reserve a Table", href: "#reserve", primary: false, external: false }]
      : [
          { label: "Call Us", href: `tel:${site.phone}`, primary: false, external: false },
          {
            label: "WhatsApp",
            href: `https://wa.me/${site.whatsapp}`,
            primary: false,
            external: true,
          },
        ]),
  ];

  return (
    <Section id="visit">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Visit us"
            title="Come by. Stay awhile."
            description="We're on Sindhu Bhavan Road, ground floor, with the black awning and the two cats who have decided they live here."
          />

          <Reveal delay={0.1}>
            <div className="mt-9">
              <OpenStatus />
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div id="hours" className="mt-10 scroll-mt-28">
              <h3 className="eyebrow">Opening hours</h3>
              <dl className="mt-5 space-y-4">
                {hoursDisplay.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-4 border-b border-brass/15 pb-4"
                  >
                    <dt className="text-ink">{row.label}</dt>
                    <dd className="text-clay">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-sm text-clay">
                The kitchen stops taking orders {KITCHEN_CLOSES_BEFORE} minutes before we close.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-10">
              <h3 className="eyebrow">Address</h3>
              <address className="mt-5 space-y-1 not-italic leading-relaxed text-ink">
                {addressLines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </address>
              {PHONE_IS_PLACEHOLDER ? (
                <p className="mt-3 text-clay">
                  {site.phoneDisplay}{" "}
                  <span className="text-xs text-clay/70">(sample number)</span>
                </p>
              ) : (
                <a
                  href={`tel:${site.phone}`}
                  className="mt-3 inline-block text-clay transition-colors hover:text-bean"
                >
                  {site.phoneDisplay}
                </a>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="mt-9 flex flex-wrap gap-3">
              {actions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  {...(action.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={`rounded-full px-6 py-3.5 text-sm transition-colors ${
                    action.primary
                      ? "bg-bean text-plaster hover:bg-terracotta"
                      : "border border-bean/25 text-bean hover:border-bean hover:bg-travertine/60"
                  }`}
                >
                  {action.label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="h-[420px] overflow-hidden rounded-3xl ring-1 ring-brass/20 lg:sticky lg:top-28 lg:h-[620px]">
            {/* Keyless Google Maps embed — no API key, no billing account. */}
            <iframe
              src={site.mapEmbedUrl}
              title={`Map showing ${site.name} on Sindhu Bhavan Road, Ahmedabad`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="size-full border-0"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
