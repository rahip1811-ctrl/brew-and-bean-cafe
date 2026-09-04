"use client";

import { useEffect, useState } from "react";
import { getOpenState, type OpenState } from "@/lib/site";

/**
 * The live "Open now / Closed" badge.
 *
 * The status depends on the current time, so it cannot be rendered on the
 * server without risking a hydration mismatch the moment a build is cached or
 * the clock ticks between render and hydrate. Instead the server emits a
 * neutral placeholder and the real state is computed after mount, then
 * refreshed every minute so a visitor sitting on the page at closing time
 * sees it change.
 */
export function useOpenState() {
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => {
    const update = () => setState(getOpenState());
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);

  return state;
}

export function OpenStatus({
  variant = "light",
  className = "",
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const state = useOpenState();

  const dark = variant === "dark";
  const shell = dark
    ? "border-plaster/20 bg-plaster/10 text-plaster"
    : "border-brass/30 bg-travertine/60 text-ink";

  // Before hydration, hold the exact space the badge will occupy so nothing
  // shifts when the real status arrives.
  if (!state) {
    return (
      <div
        className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm ${shell} ${className}`}
        aria-hidden
      >
        <span className="size-2 rounded-full bg-clay/40" />
        <span className="opacity-0">Open today · 8 AM – 10 PM</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm ${shell} ${className}`}
      role="status"
    >
      <span className="relative flex size-2">
        {state.isOpen && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-palm opacity-60" />
        )}
        <span
          className={`relative inline-flex size-2 rounded-full ${
            state.isOpen ? "bg-palm" : "bg-terracotta"
          }`}
        />
      </span>
      <span>
        <span className="font-medium">{state.label}</span>
        <span className={dark ? "text-plaster/70" : "text-clay"}> · {state.detail}</span>
      </span>
    </div>
  );
}
