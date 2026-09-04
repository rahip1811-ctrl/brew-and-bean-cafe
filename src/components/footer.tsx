import Image from "next/image";
import Link from "next/link";
import { hoursDisplay, site } from "@/lib/site";

const nav = [
  { label: "Menu", href: "/menu" },
  { label: "Our Story", href: "/#story" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Visit Us", href: "/#visit" },
  { label: "Reserve", href: "/#reserve" },
];

const socials = [
  { label: "Instagram", href: site.instagramUrl },
  { label: "Facebook", href: site.facebookUrl },
  { label: "WhatsApp", href: `https://wa.me/${site.whatsapp}` },
];

export function Footer({ addressLines }: { addressLines: string[] }) {
  return (
    // The extra bottom padding on small screens clears the sticky action bar.
    <footer className="bg-bean pb-28 pt-20 text-plaster lg:pb-16">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/brand/logo.png"
              alt="Brew and Bean Cafe"
              width={1774}
              height={887}
              sizes="176px"
              // The logo is dark brown artwork on white; inverting it lets the
              // same single asset sit on the dark footer without a second file.
              className="h-auto w-44 brightness-0 invert"
            />
            <p className="mt-5 max-w-xs font-[family-name:var(--font-display)] text-xl text-plaster/90">
              {site.tagline}
            </p>
          </div>

          <FooterColumn title="Navigation">
            <ul className="space-y-2.5">
              {nav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-plaster/70 transition-colors hover:text-plaster"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Find us">
            <address className="space-y-1 text-sm not-italic leading-relaxed text-plaster/70">
              {addressLines.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </address>
            <a
              href={`tel:${site.phone}`}
              className="mt-3 inline-block text-sm text-plaster/70 transition-colors hover:text-plaster"
            >
              {site.phoneDisplay}
            </a>
          </FooterColumn>

          <FooterColumn title="Hours">
            <ul className="space-y-3 text-sm text-plaster/70">
              {hoursDisplay.map((row) => (
                <li key={row.label}>
                  <div className="text-plaster/90">{row.label}</div>
                  <div>{row.value}</div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-plaster/70 underline-offset-4 transition-colors hover:text-plaster hover:underline"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </FooterColumn>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-plaster/15 pt-7 text-xs text-plaster/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Brew and Bean Cafe. All rights reserved.</p>
          <p>{site.address.city}, {site.address.state}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="eyebrow mb-5 text-plaster/45">{title}</h3>
      {children}
    </div>
  );
}
