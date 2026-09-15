"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { site } from "@/lib/site";

/**
 * Records the clicks that matter to a café — directions, reservations, the
 * menu, Instagram — without an onClick wired into every button that leads to
 * them.
 *
 * A single capture-phase listener classifies links by where they point. Every
 * "Get Directions" on the site goes to the same Google Maps URL, so a new
 * directions button added anywhere later is tracked with no extra code, and
 * `link_location` records which one was used: navbar, hero, Visit section,
 * mobile action bar, footer, and so on.
 *
 * Renders nothing.
 */

/** Maps a link's destination to an event name, or null if it isn't one we track. */
function classify(anchor: HTMLAnchorElement): string | null {
  const href = anchor.getAttribute("href") ?? "";

  // Calling and WhatsApp only appear once PHONE_IS_PLACEHOLDER is false, and
  // are tracked from that moment without touching this file.
  if (href.startsWith("tel:")) return "click_call";
  if (href.includes("wa.me/")) return "click_whatsapp";
  if (href === site.directionsUrl) return "get_directions";
  if (href === site.reviewsUrl) return "click_google_reviews";
  if (href.startsWith(site.instagramUrl)) return "click_instagram";
  if (href.startsWith(site.facebookUrl)) return "click_facebook";
  if (href === "/menu") return "click_view_menu";
  if (href.endsWith("#reserve")) return "click_reserve";
  if (href.endsWith("#visit")) return "click_find_us";

  return null;
}

/** Section ids that read badly as report labels. */
const LOCATION_NAMES: Record<string, string> = { top: "hero" };

/** Where on the site the click happened, as a short readable label. */
function locationOf(el: Element): string {
  const tagged = el.closest("[data-analytics-location]");
  if (tagged) return tagged.getAttribute("data-analytics-location") ?? "unknown";
  if (el.closest("header")) return "navbar";
  if (el.closest("#mobile-menu")) return "mobile_menu";
  if (el.closest("footer")) return "footer";

  const section = el.closest("section[id]");
  if (section) return LOCATION_NAMES[section.id] ?? section.id;

  return window.location.pathname === "/menu" ? "menu_page" : "page";
}

export function AnalyticsEvents() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Primary and middle clicks both count. A middle click opens the link in
      // a new tab, and that is still someone going to the menu.
      if (event.button !== 0 && event.button !== 1) return;

      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const name = classify(anchor);
      if (name) track(name, { link_location: locationOf(anchor) });
    };

    // Capture phase, so the click is recorded even if a handler further down
    // (the smooth-scroll anchor router, for one) cancels the default action.
    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("auxclick", onClick, { capture: true });

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("auxclick", onClick, { capture: true });
    };
  }, []);

  return null;
}
