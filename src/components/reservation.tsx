"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { PHONE_IS_PLACEHOLDER, site } from "@/lib/site";
import {
  submitReservation,
  today,
  validateReservation,
  type Reservation as ReservationValues,
} from "@/lib/submissions";

const EASE = [0.22, 1, 0.36, 1] as const;

const empty: ReservationValues = {
  name: "",
  phone: "",
  date: "",
  time: "19:00",
  guests: "2",
  notes: "",
};

export function Reservation() {
  const [values, setValues] = useState<ReservationValues>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof ReservationValues, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const reduced = useReducedMotion();

  const set = (key: keyof ReservationValues) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    // Clear the error as soon as the visitor starts fixing it, rather than
    // making them submit again to find out whether they got it right.
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    const found = validateReservation(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setStatus("sending");
    const result = await submitReservation(values);

    if (result.ok) {
      setStatus("done");
    } else {
      setStatus("idle");
      setErrors({ name: result.error });
    }
  }

  return (
    <Section id="reserve" tone="limewash">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Reservations"
            title="Reserve a table."
            description="For groups of two to eight. For anything larger, give us a call and we'll sort it out properly."
          />

          <Reveal delay={0.12}>
            <div className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-3xl lg:block">
              <Image
                src="/images/interior-banquette.jpg"
                alt="The banquette seating along the plaster wall"
                fill
                sizes="40vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            {PHONE_IS_PLACEHOLDER ? (
              <p className="mt-8 text-sm text-clay">
                Table for more than eight? Say so in the special request and
                we&apos;ll sort it out.
              </p>
            ) : (
              <p className="mt-8 text-sm text-clay">
                Prefer to talk to someone?{" "}
                <a
                  href={`tel:${site.phone}`}
                  className="text-bean underline decoration-brass/40 underline-offset-4"
                >
                  {site.phoneDisplay}
                </a>
              </p>
            )}
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <div className="rounded-3xl bg-plaster p-6 ring-1 ring-brass/20 sm:p-9">
            <AnimatePresence mode="wait">
              {status === "done" ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: reduced ? 0 : 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <div className="grid size-14 place-items-center rounded-full bg-palm/15 text-palm">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="m20 6-11 11-5-5" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-2xl">Table requested</h3>
                  <p className="mt-3 max-w-sm text-clay">
                    Thanks, {values.name.split(" ")[0]}. We&apos;ll confirm on{" "}
                    {values.phone} shortly. If you don&apos;t hear from us within
                    the hour, please call.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setValues(empty);
                      setStatus("idle");
                    }}
                    className="mt-8 text-sm text-clay underline decoration-brass/40 underline-offset-4 hover:text-bean"
                  >
                    Book another table
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <Field label="Name" error={errors.name}>
                    <input
                      type="text"
                      value={values.name}
                      onChange={(e) => set("name")(e.target.value)}
                      autoComplete="name"
                      placeholder="Meher Shah"
                      className={inputClass(!!errors.name)}
                    />
                  </Field>

                  <Field label="Phone" error={errors.phone}>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={values.phone}
                      onChange={(e) => set("phone")(e.target.value)}
                      autoComplete="tel"
                      placeholder="98795 40118"
                      className={inputClass(!!errors.phone)}
                    />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Date" error={errors.date}>
                      <input
                        type="date"
                        value={values.date}
                        min={today()}
                        onChange={(e) => set("date")(e.target.value)}
                        className={inputClass(!!errors.date)}
                      />
                    </Field>

                    <Field label="Time" error={errors.time}>
                      <select
                        value={values.time}
                        onChange={(e) => set("time")(e.target.value)}
                        className={inputClass(!!errors.time)}
                      >
                        {timeSlots().map((slot) => (
                          <option key={slot.value} value={slot.value}>
                            {slot.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label="Guests">
                    <div className="flex flex-wrap gap-2">
                      {["1", "2", "3", "4", "5", "6", "7", "8"].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => set("guests")(n)}
                          aria-pressed={values.guests === n}
                          className={`size-11 rounded-full text-sm transition-colors ${
                            values.guests === n
                              ? "bg-bean text-plaster"
                              : "border border-brass/25 text-ink hover:border-bean"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Special request" optional>
                    <textarea
                      value={values.notes}
                      onChange={(e) => set("notes")(e.target.value)}
                      rows={3}
                      placeholder="Window table, birthday, a quiet corner to work…"
                      className={`${inputClass(false)} resize-none`}
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="mt-2 w-full rounded-full bg-bean py-4 text-sm text-plaster transition-colors hover:bg-terracotta disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending…" : "Reserve Table"}
                  </button>

                  <p className="text-center text-xs text-clay">
                    We&apos;ll confirm by phone. No deposit, no card details.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/** Half-hour slots from opening to an hour before the earliest closing time. */
function timeSlots() {
  const slots: { value: string; label: string }[] = [];

  for (let minutes = 8 * 60; minutes <= 21 * 60; minutes += 30) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const period = h < 12 ? "AM" : "PM";
    const h12 = h % 12 === 0 ? 12 : h % 12;

    slots.push({
      value: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      label: `${h12}:${String(m).padStart(2, "0")} ${period}`,
    });
  }

  return slots;
}

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-plaster px-4 py-3.5 text-ink outline-none transition-colors placeholder:text-clay/50 ${
    hasError ? "border-terracotta" : "border-brass/25 focus:border-bean"
  }`;
}

function Field({
  label,
  error,
  optional,
  children,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline gap-2 text-sm text-ink">
        {label}
        {optional && <span className="text-xs text-clay">optional</span>}
      </span>
      {children}
      {error && (
        <span role="alert" className="mt-1.5 block text-xs text-terracotta">
          {error}
        </span>
      )}
    </label>
  );
}
