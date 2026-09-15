/**
 * The one place the site talks to Google Analytics.
 *
 * GA's snippet in layout.tsx defines `gtag` before any component runs, but a
 * visitor with an ad blocker never gets it. Every call here is therefore a
 * silent no-op when `gtag` is missing, never an exception that could break a
 * reservation form mid-submit.
 *
 * Never pass personal data — no names, phone numbers or email addresses.
 * Google's terms forbid it, and it would put customers' details somewhere the
 * café has no reason to keep them.
 */

export type EventParams = Record<string, string | number | boolean | undefined>;

export function track(name: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  // Cast rather than augment `Window`: other packages ship their own `gtag`
  // typings, and a second, different declaration is a compile error.
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;

  gtag("event", name, params);
}
