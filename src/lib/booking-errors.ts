import type { BookingQuote } from "@/types/booking";

/** Lives outside the "use server" file, which may only export async functions. */
export type SubmitBookingError =
  | "invalid-request"
  | "guest-details"
  | "voucher-invalid"
  | "voucher-expired"
  | "voucher-not-applicable"
  | "unavailable";

export type SubmitBookingResult =
  | { ok: true; reference: string; quote: BookingQuote }
  | { ok: false; error: SubmitBookingError };

export const SUBMIT_BOOKING_ERROR_MESSAGES: Record<SubmitBookingError, string> =
  {
    "invalid-request":
      "We couldn't read your booking details. Please go back and check them again.",
    "guest-details":
      "Please enter your name, email and phone number to book as a guest.",
    "voucher-invalid": "That voucher code isn't valid.",
    "voucher-expired": "That voucher has expired.",
    "voucher-not-applicable": "That voucher can't be used for this space.",
    unavailable:
      "This space is no longer available for the time you picked. Please choose another time.",
  };
