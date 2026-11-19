import { format, parse } from "date-fns";

import type { BookingSelection } from "../types/booking.ts";
import { formatTimeField } from "./booking.ts";

const DATE_FORMAT = "EEE, d MMMM yyyy"; // "Mon, 10 July 2024"

function toDate(value: string): Date {
  return parse(value, "yyyy-MM-dd", new Date());
}

/** One day: "Mon, 10 July 2024". Several days: "Mon, 10 July 2024 - Wed, 12 July 2024". */
export function formatBookingDates(selection: BookingSelection): string {
  const from = format(toDate(selection.from), DATE_FORMAT);
  if (selection.from === selection.to) return from;
  return `${from} - ${format(toDate(selection.to), DATE_FORMAT)}`;
}

/** "10.00 - 13.00" for a single-day booking, null for a multi-day one. */
export function formatBookingTime(selection: BookingSelection): string | null {
  if (!selection.time) return null;
  return `${formatTimeField(selection.time.start)} - ${formatTimeField(selection.time.end)}`;
}
