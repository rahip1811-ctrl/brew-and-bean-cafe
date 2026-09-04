"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/lib/site";

/**
 * The single highest-value element on a café site that lives in an Instagram
 * bio: three one-tap actions, always within thumb reach, once the visitor has
 * scrolled past the hero. Phone-only — on desktop the same actions sit in the
 * Visit Us section where there is room for them.
 */
export function MobileActionBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const actions = [
    { label: "Directions", href: site.directionsUrl, external: true, icon: PinIcon },
    { label: "Call", href: `tel:${site.phone}`, external: false, icon: PhoneIcon },
    {
      label: "WhatsApp",
      href: `https://wa.me/${site.whatsapp}`,
      external: true,
      icon: ChatIcon,
    },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          // Keeps the bar clear of the iOS home indicator.
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="mx-3 mb-3 grid grid-cols-3 overflow-hidden rounded-2xl border border-brass/25 bg-plaster/95 shadow-[0_8px_30px_rgba(64,35,22,0.14)] backdrop-blur-md">
            {actions.map(({ label, href, external, icon: Icon }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex min-h-[62px] flex-col items-center justify-center gap-1 border-r border-brass/15 text-xs text-ink last:border-r-0 active:bg-travertine/70"
              >
                <Icon />
                {label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function PinIcon() {
  return (
    <svg {...iconProps} className="text-terracotta">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg {...iconProps} className="text-terracotta">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg {...iconProps} className="text-terracotta">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-3.8-.9L3 20.5l1.6-4.8A8.4 8.4 0 0 1 3.6 11a8.4 8.4 0 0 1 8.9-8.4 8.4 8.4 0 0 1 8.5 8.4Z" />
    </svg>
  );
}
