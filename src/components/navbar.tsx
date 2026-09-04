"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** `hash` targets sit on the landing page; `href` targets are real routes. */
const links = [
  { label: "Home", hash: "#top" },
  { label: "Menu", href: "/menu" },
  { label: "Our Story", hash: "#story" },
  { label: "Gallery", hash: "#gallery" },
  { label: "Reviews", hash: "#reviews" },
  { label: "Visit Us", hash: "#visit" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const onHome = pathname === "/";

  // Both pages open with a dark hero, so an unscrolled bar sits on dark imagery
  // and its chrome has to be light. Once the bar picks up its own cream
  // background — or the full-screen mobile menu covers the page — it flips back.
  const onLight = scrolled || open;

  // An anchor only works as a bare hash when we're already on the page that
  // contains it; from /menu it has to route home first.
  const resolve = (link: (typeof links)[number]) =>
    link.href ?? (onHome ? link.hash! : `/${link.hash}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The overlay is closed by the links inside it, which all call setOpen(false)
  // on click — so there is no route-change effect to write here. This one just
  // makes sure the body is never left locked if the component unmounts while open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={false}
        animate={{
          backgroundColor: scrolled ? "rgba(247,242,233,0.82)" : "rgba(247,242,233,0)",
          backdropFilter: scrolled ? "blur(14px)" : "blur(0px)",
          borderBottomColor: scrolled ? "rgba(176,141,87,0.22)" : "rgba(176,141,87,0)",
        }}
        transition={{ duration: 0.4, ease: EASE }}
        style={{ borderBottomWidth: 1, borderBottomStyle: "solid" }}
      >
        <motion.div
          className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 sm:px-8"
          initial={false}
          animate={{ paddingTop: scrolled ? 12 : 22, paddingBottom: scrolled ? 12 : 22 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <Link href="/" className="relative block" aria-label="Brew and Bean Cafe — home">
            <motion.div
              initial={false}
              animate={{ width: scrolled ? 116 : 148 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="relative"
            >
              <Image
                src="/brand/logo.png"
                alt="Brew and Bean Cafe"
                width={1774}
                height={887}
                priority
                // Without this Next serves a 3840px-wide file for a 148px slot.
                sizes="148px"
                // The logo is dark brown artwork. Over the dark hero it needs
                // to be white; once the bar picks up its cream background it
                // goes back to brand colour. One asset, both states.
                className={`h-auto w-full transition-[filter] duration-300 ${
                  onLight ? "" : "brightness-0 invert"
                }`}
              />
            </motion.div>
          </Link>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
            {links.map((link) => (
              <Link
                key={link.label}
                href={resolve(link)}
                className={`group relative text-sm transition-colors ${
                  onLight ? "text-ink/80 hover:text-bean" : "text-plaster/85 hover:text-plaster"
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-terracotta transition-[width] duration-300 ease-out group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={onHome ? "#reserve" : "/#reserve"}
              className={`hidden rounded-full px-6 py-3 text-sm transition-colors sm:inline-block ${
                onLight
                  ? "bg-bean text-plaster hover:bg-terracotta"
                  : "bg-plaster text-bean hover:bg-brass hover:text-plaster"
              }`}
            >
              Reserve a Table
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={`relative z-50 grid size-11 place-items-center rounded-full border transition-colors lg:hidden ${
                onLight ? "border-brass/30" : "border-plaster/40"
              }`}
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span className="relative block h-3 w-5">
                <motion.span
                  className={`absolute left-0 block h-px w-full ${onLight ? "bg-bean" : "bg-plaster"}`}
                  animate={open ? { top: 6, rotate: 45 } : { top: 0, rotate: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                />
                <motion.span
                  className={`absolute left-0 block h-px w-full ${onLight ? "bg-bean" : "bg-plaster"}`}
                  animate={open ? { top: 6, rotate: -45 } : { top: 12, rotate: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                />
              </span>
            </button>
          </div>
        </motion.div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col justify-center bg-plaster px-8 lg:hidden"
            initial={{ opacity: 0, clipPath: reduced ? undefined : "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: reduced ? undefined : "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: reduced ? undefined : "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {links.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: reduced ? 0 : 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.055, duration: 0.5, ease: EASE }}
                >
                  <Link
                    href={resolve(link)}
                    onClick={() => setOpen(false)}
                    className="block border-b border-brass/15 py-4 font-[family-name:var(--font-display)] text-3xl text-bean"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: reduced ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5, ease: EASE }}
              className="mt-10"
            >
              <Link
                href={onHome ? "#reserve" : "/#reserve"}
                onClick={() => setOpen(false)}
                className="inline-block rounded-full bg-bean px-8 py-4 text-plaster"
              >
                Reserve a Table
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
