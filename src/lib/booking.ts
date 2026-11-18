import { differenceInCalendarDays } from "date-fns";

import type { BookingDuration } from "./pricing.ts";

export const SLOT_STEP_MINUTES = 30;

/** MOCK operating hours until the API provides them per space. */
export const BOOKING_HOURS = { open: "08:00", close: "20:00" } as const;

/** "HH:mm" 24-hour strings. */
export type TimeRange = { start: string; end: string };
export type DateSpan = { from: Date; to: Date };

export function toMinutes(hhmm: string): number {
  const [hours, minutes] = hhmm.split(":").map(Number);
  return hours * 60 + minutes;
}

function fromMinutes(total: number): string {
  const hours = String(Math.floor(total / 60)).padStart(2, "0");
  const minutes = String(total % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function buildTimeSlots(open: string, close: string): string[] {
  const slots: string[] = [];
  for (let t = toMinutes(open); t <= toMinutes(close); t += SLOT_STEP_MINUTES) {
    slots.push(fromMinutes(t));
  }
  return slots;
}

/** Figma shows the field as "10.00" (dot) while the list shows "10:00". */
export function formatTimeField(hhmm: string): string {
  return hhmm.replace(":", ".");
}

/**
 * Turns the visitor's selection into something the pricing function accepts.
 * Returns null while the selection is incomplete. A multi-day span ignores
 * `time`; a single day needs one.
 */
export function getBookingDuration(
  span: DateSpan | undefined,
  time: TimeRange | undefined,
): BookingDuration | null {
  if (!span) return null;
  const days = differenceInCalendarDays(span.to, span.from) + 1;
  if (days > 1) return { kind: "days", days };
  if (!time) return null;
  return {
    kind: "hours",
    minutes: toMinutes(time.end) - toMinutes(time.start),
  };
}
