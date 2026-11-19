"use server";

import { z } from "zod";

import { vouchers } from "@/data/vouchers";
import { parseBookingParams, selectionToDuration } from "@/lib/booking-params";
import { buildQuote, findVoucher, resolveAddOns } from "@/lib/booking-quote";
import type { SubmitBookingResult } from "@/lib/booking-errors";
import { createBooking, saveBooking } from "@/lib/bookings";
import { getSession } from "@/lib/session";
import { getSpaceBySlug } from "@/lib/spaces";
import { guestSchema } from "@/lib/validation";
import type { BookingRequest } from "@/types/booking";

const requestSchema = z.object({
  selection: z.object({
    slug: z.string().max(100),
    from: z.string().max(10),
    to: z.string().max(10),
    time: z
      .object({ start: z.string().max(5), end: z.string().max(5) })
      .optional(),
  }),
  note: z.string().max(500),
  addOns: z
    .array(z.object({ addOnId: z.string().max(64), quantity: z.number() }))
    .max(50),
  voucherCode: z.string().max(64).nullable(),
  guest: guestSchema.nullable(),
});

/**
 * Places a booking. The client's own totals never reach this function: it
 * re-validates the selection, reloads the space and prices everything again
 * with the same `buildQuote` the order summary uses.
 *
 * Guests: a real backend would require proof that their email was verified
 * (e.g. a signed token from the OTP step). The mock OTP has no such token.
 */
export async function submitBooking(
  request: BookingRequest,
): Promise<SubmitBookingResult> {
  const parsed = requestSchema.safeParse(request);
  if (!parsed.success) {
    // A bad guest block is the one failure the visitor can fix in place.
    const guestIssue = parsed.error.issues.some((i) => i.path[0] === "guest");
    return {
      ok: false,
      error: guestIssue ? "guest-details" : "invalid-request",
    };
  }
  const { selection, note, addOns, voucherCode, guest } = parsed.data;

  const params = parseBookingParams({
    space: selection.slug,
    from: selection.from,
    to: selection.to,
    start: selection.time?.start,
    end: selection.time?.end,
  });
  if (!params.ok) return { ok: false, error: "invalid-request" };

  const [space, user] = await Promise.all([
    getSpaceBySlug(params.selection.slug),
    getSession(),
  ]);
  if (!space) return { ok: false, error: "invalid-request" };
  if (!user && !guest) return { ok: false, error: "guest-details" };

  let voucher = null;
  if (voucherCode) {
    voucher = findVoucher(vouchers, voucherCode);
    if (!voucher) return { ok: false, error: "voucher-invalid" };
  }

  const { quote, voucherCheck } = buildQuote({
    spaceName: space.name,
    spaceType: space.type,
    tiers: space.prices,
    duration: selectionToDuration(params.selection),
    addOns: resolveAddOns(addOns, space.addOns, space.capacity),
    voucher,
    today: new Date(),
  });
  if (voucherCheck && !voucherCheck.ok) {
    return {
      ok: false,
      error:
        voucherCheck.reason === "expired"
          ? "voucher-expired"
          : "voucher-not-applicable",
    };
  }

  const created = await createBooking({
    spaceId: space.id,
    selection: params.selection,
    note,
    quote,
    contact: user ?? (guest as NonNullable<typeof guest>),
  });
  if (!created.ok) return { ok: false, error: created.error };

  // Signed-in users get the booking in My Booking; guests have no session to list it with.
  if (user) {
    await saveBooking({
      owner: user,
      reference: created.reference,
      spaceSlug: space.slug,
      selection: params.selection,
      note,
      quote,
    });
  }

  return { ok: true, reference: created.reference, quote };
}
