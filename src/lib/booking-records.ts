import { addDays, addMinutes, differenceInCalendarDays, parse } from "date-fns";
import { z } from "zod";

import type {
  BookingQuote,
  BookingSelection,
  BookingStatus,
  StoredBooking,
} from "../types/booking.ts";
import { toMinutes } from "./booking.ts";

/**
 * Pure logic for the My Booking pages: cookie codec, Active/History split,
 * derived display values. No Next.js imports, so `node --test` can load it.
 */

export const BOOKINGS_COOKIE = "ceo_suite_bookings";
/** Mock "remember": 30 days, matching the session's "remember me". */
export const BOOKINGS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
export const MAX_STORED_BOOKINGS = 10;
/** Browsers drop cookies over ~4096 bytes; this budgets the URL-encoded value. */
export const MAX_COOKIE_CHARS = 3500;
/** The note is the largest free-text field, so it is trimmed when stored. */
export const MAX_STORED_NOTE = 120;

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  success: "Success",
  expired: "Expired by Midtrans",
};

// --- identifiers ------------------------------------------------------------

const REFERENCE_PATTERN = /^CS-[A-Z0-9]{8}$/;

export function isReference(value: string): boolean {
  return REFERENCE_PATTERN.test(value);
}

export function sameOwner(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/** Deterministic mock gateway invoice: "INV-" + 14 digits derived from the reference. */
export function invoiceNumber(reference: string): string {
  let digits = "";
  for (const char of reference.toUpperCase()) {
    digits += String(char.charCodeAt(0) % 10);
  }
  return `INV-${digits.padEnd(14, "0").slice(0, 14)}`;
}

// --- schema + cookie codec --------------------------------------------------

const dateField = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const timeField = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const rupiah = z.number().int().nonnegative();

export const storedBookingSchema = z.object({
  reference: z.string().regex(REFERENCE_PATTERN),
  ownerEmail: z.string().max(254),
  contactName: z.string().max(100),
  spaceSlug: z.string().max(100),
  selection: z.object({
    slug: z.string().max(100),
    from: dateField,
    to: dateField,
    time: z.object({ start: timeField, end: timeField }).optional(),
  }),
  note: z.string().max(500),
  quote: z.object({
    lines: z
      .array(
        z.object({
          id: z.string().max(64),
          label: z.string().max(120),
          quantity: z.number().int().positive().max(99),
          amount: rupiah,
        }),
      )
      .max(20),
    subtotal: rupiah,
    discount: z.object({ code: z.string().max(64), amount: rupiah }).nullable(),
    total: rupiah,
  }),
  status: z.enum(["success", "expired"]),
  createdAt: z.iso.datetime(),
});

/**
 * Raw JSON, not pre-encoded: `cookies().set` URL-encodes the value itself, and
 * the 4 KB browser limit applies to the encoded form, so that is what is
 * budgeted. Records are newest first; the oldest are dropped to fit.
 */
export function encodeBookings(records: StoredBooking[]): string {
  let kept = records.slice(0, MAX_STORED_BOOKINGS);
  let json = JSON.stringify(kept);
  while (
    kept.length > 0 &&
    encodeURIComponent(json).length > MAX_COOKIE_CHARS
  ) {
    kept = kept.slice(0, -1);
    json = JSON.stringify(kept);
  }
  return json;
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    try {
      return JSON.parse(decodeURIComponent(value));
    } catch {
      return undefined;
    }
  }
}

/** Never throws: a missing, corrupt or tampered cookie yields the good records only. */
export function decodeBookings(value: string | undefined): StoredBooking[] {
  if (!value) return [];
  const parsed = parseJson(value);
  if (!Array.isArray(parsed)) return [];
  const records: StoredBooking[] = [];
  for (const item of parsed) {
    const result = storedBookingSchema.safeParse(item);
    if (result.success) records.push(result.data);
  }
  return records;
}

/** Stored (this browser) first, then seed; a stored reference wins over a seed one. */
export function mergeBookings(
  seed: StoredBooking[],
  stored: StoredBooking[],
): StoredBooking[] {
  const seen = new Set<string>();
  const merged: StoredBooking[] = [];
  for (const item of [...stored, ...seed]) {
    if (seen.has(item.reference)) continue;
    seen.add(item.reference);
    merged.push(item);
  }
  return merged;
}

// --- Active / History -------------------------------------------------------

function toDay(value: string): Date {
  return parse(value, "yyyy-MM-dd", new Date(0));
}

export function bookingStart(selection: BookingSelection): Date {
  const day = toDay(selection.from);
  return selection.time
    ? addMinutes(day, toMinutes(selection.time.start))
    : day;
}

/** Timed bookings end at their end time; multi-day ones at the start of the day after `to`. */
export function bookingEnd(selection: BookingSelection): Date {
  const day = toDay(selection.to);
  return selection.time
    ? addMinutes(day, toMinutes(selection.time.end))
    : addDays(day, 1);
}

/**
 * Active = the booking has not ended yet; History = it has. `now` is injected
 * so callers (and tests) control the clock.
 */
export function splitBookings<T extends { selection: BookingSelection }>(
  items: T[],
  now: Date,
): { active: T[]; history: T[] } {
  const active: T[] = [];
  const history: T[] = [];
  for (const item of items) {
    (bookingEnd(item.selection) > now ? active : history).push(item);
  }
  active.sort(
    (a, b) =>
      bookingStart(a.selection).getTime() - bookingStart(b.selection).getTime(),
  );
  history.sort(
    (a, b) =>
      bookingEnd(b.selection).getTime() - bookingEnd(a.selection).getTime(),
  );
  return { active, history };
}

// --- derived display values -------------------------------------------------

/** "2 hours", "1 hour", "1.5 hours", "1 day", "3 days". */
export function formatBookingDuration(selection: BookingSelection): string {
  if (selection.time) {
    const hours =
      (toMinutes(selection.time.end) - toMinutes(selection.time.start)) / 60;
    const text = Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
    return `${text} ${hours === 1 ? "hour" : "hours"}`;
  }
  const days =
    differenceInCalendarDays(toDay(selection.to), toDay(selection.from)) + 1;
  return `${days} ${days === 1 ? "day" : "days"}`;
}

export type PriceBreakdown = {
  room: number;
  addOns: number;
  /** Not produced by the booking flow yet; always 0. */
  overtime: number;
  subtotal: number;
  discount: BookingQuote["discount"];
  /** Not produced by the booking flow yet; always 0. */
  deposit: number;
  /** Always the quote total, so it equals what the customer confirmed. */
  final: number;
};

export function buildPriceBreakdown(quote: BookingQuote): PriceBreakdown {
  const room = quote.lines.find((line) => line.id === "space")?.amount ?? 0;
  const addOns = quote.lines
    .filter((line) => line.id !== "space")
    .reduce((sum, line) => sum + line.amount, 0);
  return {
    room,
    addOns,
    overtime: 0,
    subtotal: quote.subtotal,
    discount: quote.discount,
    deposit: 0,
    final: quote.total,
  };
}

export type PaymentInfo = {
  invoice: string;
  status: "Paid" | "Payment Failed";
  type: "payment_gateway";
  /** Only for expired payments: one day after the booking was made. */
  expiredBy: Date | null;
};

export function paymentInfo(
  booking: Pick<StoredBooking, "reference" | "status" | "createdAt">,
): PaymentInfo {
  const expired = booking.status === "expired";
  return {
    invoice: invoiceNumber(booking.reference),
    status: expired ? "Payment Failed" : "Paid",
    type: "payment_gateway",
    expiredBy: expired ? addDays(new Date(booking.createdAt), 1) : null,
  };
}
