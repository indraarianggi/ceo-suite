import { differenceInCalendarDays, isValid, parse, startOfDay } from "date-fns";
import { z } from "zod";

import type { BookingSelection } from "../types/booking.ts";
import {
  BOOKING_HOURS,
  getBookingDuration,
  SLOT_STEP_MINUTES,
  toMinutes,
} from "./booking.ts";
import type { BookingDuration } from "./pricing.ts";

/** Longest bookable span. Pricing loops once per day, so this also bounds the work. */
export const MAX_BOOKING_DAYS = 365;

export type BookingParamsError =
  "missing-space" | "invalid-dates" | "past-dates" | "invalid-time";

export type BookingParamsResult =
  | { ok: true; selection: BookingSelection }
  | { ok: false; error: BookingParamsError; slug?: string };

type RawParams = Record<string, string | string[] | undefined>;

const slugField = z.string().trim().min(1);
const dateField = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const timeField = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);

/** `?a=1&a=2` arrives as an array; the first value wins. */
function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toDate(value: string | undefined): Date | null {
  if (!dateField.safeParse(value).success) return null;
  // Local time, matching how the Product page formats the picked days.
  const date = parse(value as string, "yyyy-MM-dd", new Date());
  return isValid(date) ? date : null;
}

function isValidTimeRange(start: string, end: string): boolean {
  const open = toMinutes(BOOKING_HOURS.open);
  const close = toMinutes(BOOKING_HOURS.close);
  const from = toMinutes(start);
  const to = toMinutes(end);
  return (
    from % SLOT_STEP_MINUTES === 0 &&
    to % SLOT_STEP_MINUTES === 0 &&
    from >= open &&
    to <= close &&
    to > from
  );
}

/** Calendar span and hours of a selection that already passed `parseBookingParams`. */
export function selectionToDuration(
  selection: BookingSelection,
): BookingDuration {
  const span = {
    from: parse(selection.from, "yyyy-MM-dd", new Date()),
    to: parse(selection.to, "yyyy-MM-dd", new Date()),
  };
  const duration = getBookingDuration(span, selection.time);
  if (!duration) throw new Error("Selection has no bookable duration");
  return duration;
}

/**
 * Validates `/booking?space=…&from=…&to=…[&start=…&end=…]` (the contract built
 * by `booking-provider.tsx`). The URL is user-editable, so nothing here is
 * trusted: prices are always recomputed from the validated selection.
 *
 * `slug` is returned on date/time errors so the page can send the visitor back
 * to that space instead of a dead end.
 */
export function parseBookingParams(
  raw: RawParams,
  today: Date = new Date(),
): BookingParamsResult {
  const slugParsed = slugField.safeParse(first(raw.space));
  if (!slugParsed.success) return { ok: false, error: "missing-space" };
  const slug = slugParsed.data;

  const fromValue = first(raw.from);
  const toValue = first(raw.to);
  const from = toDate(fromValue);
  const to = toDate(toValue);
  if (!from || !to || to < from) {
    return { ok: false, error: "invalid-dates", slug };
  }
  if (differenceInCalendarDays(to, from) + 1 > MAX_BOOKING_DAYS) {
    return { ok: false, error: "invalid-dates", slug };
  }
  if (from < startOfDay(today)) return { ok: false, error: "past-dates", slug };

  const selection: BookingSelection = {
    slug,
    from: fromValue as string,
    to: toValue as string,
  };

  // Hours only exist for a single day; a multi-day span ignores them.
  if (differenceInCalendarDays(to, from) === 0) {
    const start = first(raw.start);
    const end = first(raw.end);
    if (
      !timeField.safeParse(start).success ||
      !timeField.safeParse(end).success ||
      !isValidTimeRange(start as string, end as string)
    ) {
      return { ok: false, error: "invalid-time", slug };
    }
    selection.time = { start: start as string, end: end as string };
  }

  return { ok: true, selection };
}
