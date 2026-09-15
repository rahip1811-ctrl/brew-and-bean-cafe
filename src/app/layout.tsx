import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { SmoothScroll } from "@/components/smooth-scroll";
import { AnalyticsEvents } from "@/components/analytics-events";
import {
  addressLines,
  openingHoursSpecification,
  PHONE_IS_PLACEHOLDER,
  site,
} from "@/lib/site";

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
  // Omitted while the number is a placeholder. Publishing it here is worse than
  // showing it on the page: search engines index `telephone` and surface it in
  // the local panel, so a stranger's number would end up being handed out by
  // Google itself. Returns automatically once a real number is set.
  ...(PHONE_IS_PLACEHOLDER ? {} : { telephone: site.phone }),
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
      <head>
        {/* Google Analytics - Direct Script Tag */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-RFYGVS3J0J"></script>
        {/* Opening any page once with ?internal=1 marks that browser as the
            café's own; ?internal=0 clears it. Marked browsers send
            traffic_type=internal, which GA's Internal Traffic data filter drops
            from reports. Unlike an IP rule this survives a changed broadband IP
            and covers phones on mobile data. It lives in localStorage, so it
            has to be set once per browser and is lost if site data is cleared. */}
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            var bbInternal = false;
            try {
              var bbFlag = new URLSearchParams(location.search).get('internal');
              if (bbFlag === '1') localStorage.setItem('bb_internal', '1');
              if (bbFlag === '0') localStorage.removeItem('bb_internal');
              bbInternal = localStorage.getItem('bb_internal') === '1';
            } catch (e) {}
            gtag('config', 'G-RFYGVS3J0J', bbInternal ? { traffic_type: 'internal' } : {});
          `,
        }} />
      </head>
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
        <AnalyticsEvents />
        <Analytics />
      </body>
    </html>
  );
}