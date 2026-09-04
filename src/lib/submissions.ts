/**
 * The seam between the forms and wherever their data eventually goes.
 *
 * Phase 1 has no backend: both functions validate, pause briefly so the
 * pending state is visible, and resolve. Wiring this to Supabase (or Resend,
 * or a Google Sheet) means replacing the bodies of these two functions and
 * nothing else — no component changes, no prop drilling, no refactor.
 */

export type Result = { ok: true } | { ok: false; error: string };

export type Reservation = {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  notes: string;
};

/** Indian mobile numbers: ten digits starting 6-9, with optional +91 and spacing. */
const PHONE = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateReservation(values: Reservation): Partial<Record<keyof Reservation, string>> {
  const errors: Partial<Record<keyof Reservation, string>> = {};

  if (values.name.trim().length < 2) errors.name = "Please tell us your name.";
  if (!PHONE.test(values.phone.replace(/\s/g, ""))) {
    errors.phone = "Enter a 10-digit mobile number.";
  }
  if (!values.date) errors.date = "Pick a date.";
  if (!values.time) errors.time = "Pick a time.";

  // Compare date strings rather than Date objects so a booking for later today
  // isn't rejected by the current clock time.
  if (values.date && values.date < today()) {
    errors.date = "That date has already passed.";
  }

  return errors;
}

export function today() {
  // The café's local date, not the visitor's — someone booking from London at
  // 9pm should still be able to reserve for "tomorrow" in Ahmedabad.
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

export async function submitReservation(values: Reservation): Promise<Result> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  // TODO: replace with the real destination.
  //   const { error } = await supabase.from("reservations").insert(values);
  //   if (error) return { ok: false, error: "Something went wrong. Please call us." };
  if (process.env.NODE_ENV === "development") {
    console.info("[reservation] would submit:", values);
  }

  return { ok: true };
}

export async function subscribe(email: string): Promise<Result> {
  if (!EMAIL.test(email.trim())) {
    return { ok: false, error: "That email doesn't look right." };
  }

  await new Promise((resolve) => setTimeout(resolve, 700));

  // TODO: replace with the real list.
  if (process.env.NODE_ENV === "development") {
    console.info("[newsletter] would subscribe:", email);
  }

  return { ok: true };
}
