import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { SmoothScroll } from "@/components/smooth-scroll";
import { addressLines, openingHoursSpecification, site } from "@/lib/site";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  keywords: [
    "cafe in Ahmedabad",
    "specialty coffee Ahmedabad",
    "Sindhu Bhavan Road cafe",
    "Bodakdev coffee shop",
    "brunch Ahmedabad",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [{ url: "/images/exterior-storefront.png", width: 1122, height: 1402 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#f7f2e9",
  colorScheme: "light",
};

/**
 * Structured data. This is what puts the café in Google's local panel with
 * its hours and address, which for a business discovered through Maps and
 * Instagram matters more than anything on the page itself.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  image: `${site.url}/images/exterior-storefront.png`,
  logo: `${site.url}/brand/logo.png`,
  priceRange: "₹₹",
  servesCuisine: ["Coffee", "Cafe", "Bakery", "Breakfast"],
  currenciesAccepted: "INR",
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.line1}, ${site.address.line2}`,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.geo.lat,
    longitude: site.geo.lng,
  },
  openingHoursSpecification,
  hasMenu: `${site.url}/menu`,
  sameAs: [site.instagramUrl, site.facebookUrl],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-plaster text-ink">
        <script
          type="application/ld+json"
          // The object is authored above, not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-bean focus:px-5 focus:py-3 focus:text-sm focus:text-plaster"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer addressLines={addressLines} />
        <MobileActionBar />
      </body>
    </html>
  );
}
