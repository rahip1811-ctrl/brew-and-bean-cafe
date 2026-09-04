"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/motion-primitives";
import { subscribe } from "@/lib/submissions";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setStatus("sending");

    const result = await subscribe(email);

    if (result.ok) {
      setStatus("done");
    } else {
      setStatus("idle");
      setError(result.error);
    }
  }

  return (
    <section className="bg-travertine py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-[clamp(1.65rem,3vw,2.25rem)] leading-tight">
                Stay in the loop
              </h2>
              <p className="mt-3 max-w-md text-clay">
                New drinks, seasonal menus and café stories. Once a month, never more.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {status === "done" ? (
                <motion.p
                  key="done"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-lg text-bean"
                >
                  You&apos;re on the list. See you in the inbox. ☕
                </motion.p>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <label className="flex-1">
                      <span className="sr-only">Email address</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError(null);
                        }}
                        placeholder="your@email.com"
                        autoComplete="email"
                        className={`w-full rounded-full border bg-plaster px-6 py-4 text-ink outline-none transition-colors placeholder:text-clay/60 ${
                          error ? "border-terracotta" : "border-brass/25 focus:border-bean"
                        }`}
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="rounded-full bg-bean px-8 py-4 text-sm text-plaster transition-colors hover:bg-terracotta disabled:opacity-60"
                    >
                      {status === "sending" ? "…" : "Subscribe"}
                    </button>
                  </div>
                  {error && (
                    <p role="alert" className="mt-2.5 pl-6 text-xs text-terracotta">
                      {error}
                    </p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
