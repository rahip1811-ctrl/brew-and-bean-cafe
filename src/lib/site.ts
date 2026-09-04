/**
 * Every real-world fact about the café lives here, once.
 *
 * Components read from this file and so does the JSON-LD in the layout, so the
 * address shown on the page can never drift from the address Google indexes.
 * Changing a phone number or an opening hour is a one-line edit in this file.
 */

export const site = {
  name: "Brew and Bean Cafe",
  shortName: "Brew and Bean",
  tagline: "Good coffee. Slow moments.",
  description:
    "A specialty coffee house on Sindhu Bhavan Road, Ahmedabad. Beans roasted in small lots, pastries baked every morning, and a room worth staying in.",
  url: "https://brewandbean.cafe",

  address: {
    line1: "Unit 3, Ground Floor, Anantam House",
    line2: "Sindhu Bhavan Marg, Bodakdev",
    city: "Ahmedabad",
    state: "Gujarat",
    postalCode: "380054",
    country: "IN",
  },

  /** Approximate — Sindhu Bhavan Road, Bodakdev. */
  geo: { lat: 23.0396, lng: 72.5065 },

  /**
   * PLACEHOLDER. Every Indian mobile range is live, so this must be replaced
   * with the café's real number before the site is published anywhere public.
   */
  phone: "+919879540118",
  phoneDisplay: "+91 98795 40118",
  whatsapp: "919879540118",
  email: "hello@brewandbean.cafe",

  instagram: "brewandbeancafe",
  instagramUrl: "https://instagram.com/brewandbeancafe",
  facebookUrl: "https://facebook.com/brewandbeancafe",

  /** Free, keyless Google Maps embed — no API key or billing account needed. */
  mapEmbedUrl:
    "https://www.google.com/maps?q=Sindhu+Bhavan+Road,+Bodakdev,+Ahmedabad,+Gujarat+380054&output=embed",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Sindhu+Bhavan+Road%2C+Bodakdev%2C+Ahmedabad%2C+Gujarat+380054",
  reviewsUrl: "https://www.google.com/maps/search/?api=1&query=Brew+and+Bean+Cafe+Ahmedabad",
} as const;

export const addressLines = [
  site.address.line1,
  site.address.line2,
  `${site.address.city}, ${site.address.state} ${site.address.postalCode}`,
];

/* ---------------------------------------------------------------------------
   Opening hours
   Stored as minutes from midnight so the live open/closed badge can compare
   against the clock without parsing strings. Times are Asia/Kolkata — a
   visitor browsing from another timezone still sees the café's real status.
   --------------------------------------------------------------------------- */

export const TIMEZONE = "Asia/Kolkata";

/** Kitchen stops taking orders this many minutes before the doors close. */
export const KITCHEN_CLOSES_BEFORE = 30;

export type DayHours = { open: number; close: number };

/** Indexed by JS day number: 0 = Sunday. */
export const hours: DayHours[] = [
  { open: 8 * 60, close: 23 * 60 }, // Sun
  { open: 8 * 60, close: 22 * 60 }, // Mon
  { open: 8 * 60, close: 22 * 60 }, // Tue
  { open: 8 * 60, close: 22 * 60 }, // Wed
  { open: 8 * 60, close: 22 * 60 }, // Thu
  { open: 8 * 60, close: 22 * 60 }, // Fri
  { open: 8 * 60, close: 23 * 60 }, // Sat
];

/** How the hours are grouped for display, rather than seven near-identical rows. */
export const hoursDisplay = [
  { label: "Monday – Friday", value: "8:00 AM – 10:00 PM" },
  { label: "Saturday – Sunday", value: "8:00 AM – 11:00 PM" },
];

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

/** Schema.org day tokens, in the same 0-6 order as `hours`. */
const SCHEMA_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

function toClock(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Formats minutes-from-midnight as a human clock time: 510 -> "8:30 AM".
 */
export function formatTime(minutes: number) {
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const period = h24 < 12 ? "AM" : "PM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return m === 0 ? `${h12} ${period}` : `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

/**
 * Reads the wall clock in the café's timezone, not the visitor's.
 * `Intl` does the conversion, so this stays correct without a date library.
 */
export function nowInCafeTimezone(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekdayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  // Midnight can format as "24" in some engines; fold it back to 0.
  const hour = Number(get("hour")) % 24;

  return { day: weekdayIndex, minutes: hour * 60 + Number(get("minute")) };
}

export type OpenState = {
  isOpen: boolean;
  /** Short badge text, e.g. "Open now" or "Closed". */
  label: string;
  /** The supporting line, e.g. "Closes at 10 PM" or "Opens tomorrow at 8 AM". */
  detail: string;
};

/**
 * Works out whether the café is open right now, and what to say if it isn't.
 * Returns the next opening day by name rather than only ever "tomorrow".
 */
export function getOpenState(now = new Date()): OpenState {
  const { day, minutes } = nowInCafeTimezone(now);
  const today = hours[day];

  if (minutes >= today.open && minutes < today.close) {
    return {
      isOpen: true,
      label: "Open now",
      detail: `Closes at ${formatTime(today.close)}`,
    };
  }

  // Before opening, the café opens again later today.
  if (minutes < today.open) {
    return {
      isOpen: false,
      label: "Closed",
      detail: `Opens today at ${formatTime(today.open)}`,
    };
  }

  // After closing, find the next day with hours (all seven have them today,
  // but this still holds if a rest day is ever added above).
  for (let i = 1; i <= 7; i += 1) {
    const nextDay = (day + i) % 7;
    const next = hours[nextDay];
    if (!next) continue;
    const when = i === 1 ? "tomorrow" : DAY_NAMES[nextDay];
    return {
      isOpen: false,
      label: "Closed",
      detail: `Opens ${when} at ${formatTime(next.open)}`,
    };
  }

  return { isOpen: false, label: "Closed", detail: "" };
}

/** Schema.org opening hours, generated from the same array the page renders. */
export const openingHoursSpecification = hours.map((h, i) => ({
  "@type": "OpeningHoursSpecification",
  dayOfWeek: `https://schema.org/${SCHEMA_DAYS[i]}`,
  opens: toClock(h.open),
  closes: toClock(h.close),
}));
