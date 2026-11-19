import type {
  BookingQuote,
  BookingSelection,
  GuestDetails,
} from "@/types/booking";

/**
 * Mock booking backend. Swap `createBooking` for a real API call later; the
 * Server Action in `booking-actions.ts` is its only caller.
 *
 * Magic value for trying the failure state by hand: a request note containing
 * "[fail]" is rejected as unavailable.
 */
export const MOCK_BOOKING = { failNote: "[fail]" } as const;

export const bookingConfig = { latencyMs: 800 };

export type CreateBookingInput = {
  spaceId: string;
  selection: BookingSelection;
  note: string;
  quote: BookingQuote;
  contact: GuestDetails | { name: string; email: string };
};

export type CreateBookingResult =
  { ok: true; reference: string } | { ok: false; error: "unavailable" };

export async function createBooking(
  input: CreateBookingInput,
): Promise<CreateBookingResult> {
  await new Promise<void>((resolve) =>
    setTimeout(resolve, bookingConfig.latencyMs),
  );
  if (input.note.includes(MOCK_BOOKING.failNote)) {
    return { ok: false, error: "unavailable" };
  }
  const reference = `CS-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  return { ok: true, reference };
}
