import { cookies } from "next/headers";

import { seedBookings } from "@/data/bookings";
import {
  BOOKINGS_COOKIE,
  BOOKINGS_COOKIE_MAX_AGE,
  decodeBookings,
  encodeBookings,
  MAX_STORED_NOTE,
  mergeBookings,
  sameOwner,
} from "@/lib/booking-records";
import { getSpaceBySlug } from "@/lib/spaces";
import type {
  BookingQuote,
  BookingSelection,
  BookingView,
  GuestDetails,
  StoredBooking,
} from "@/types/booking";
import type { SessionUser } from "@/types/user";

/**
 * Mock booking backend. Swap `createBooking` and the store functions below
 * (`listBookings`, `getBookingByReference`, `saveBooking`) for real API calls
 * later; the Server Action in `booking-actions.ts` and the My Booking pages are
 * their only callers.
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

// --- booking store (mock) ----------------------------------------------------
//
// Seed bookings (demo persona) plus an httpOnly cookie for bookings made in
// this browser. Pure logic (codec, merging, ownership) lives in
// `booking-records.ts`, which is unit-tested.

async function readStored(): Promise<StoredBooking[]> {
  const store = await cookies();
  return decodeBookings(store.get(BOOKINGS_COOKIE)?.value);
}

async function withSpace(records: StoredBooking[]): Promise<BookingView[]> {
  const views = await Promise.all(
    records.map(async (record) => {
      const space = await getSpaceBySlug(record.spaceSlug);
      // A booking whose space was removed is skipped, never a crash.
      return space ? { ...record, space } : null;
    }),
  );
  return views.filter((view): view is BookingView => view !== null);
}

/** Every booking the user owns, unsorted. Split with `splitBookings` for the tabs. */
export async function listBookings(
  user: SessionUser,
  now: Date = new Date(),
): Promise<BookingView[]> {
  const merged = mergeBookings(seedBookings(now), await readStored());
  return withSpace(merged.filter((b) => sameOwner(b.ownerEmail, user.email)));
}

/** Ownership is checked inside the user's own list, never by reference alone. */
export async function getBookingByReference(
  user: SessionUser,
  reference: string,
  now: Date = new Date(),
): Promise<BookingView | null> {
  const bookings = await listBookings(user, now);
  return bookings.find((b) => b.reference === reference) ?? null;
}

export type SaveBookingInput = {
  owner: SessionUser;
  reference: string;
  spaceSlug: string;
  selection: BookingSelection;
  note: string;
  quote: BookingQuote;
};

/**
 * Remembers a freshly placed booking for a signed-in user. Guests have no
 * session to list bookings with, so the caller skips them. Never throws: the
 * booking is already placed, so a failed cookie write must not fail checkout.
 */
export async function saveBooking(input: SaveBookingInput): Promise<void> {
  try {
    const store = await cookies();
    const record: StoredBooking = {
      reference: input.reference,
      ownerEmail: input.owner.email.trim().toLowerCase(),
      contactName: input.owner.name,
      spaceSlug: input.spaceSlug,
      selection: input.selection,
      note: input.note.slice(0, MAX_STORED_NOTE),
      quote: input.quote,
      status: "success",
      createdAt: new Date().toISOString(),
    };
    const existing = decodeBookings(store.get(BOOKINGS_COOKIE)?.value);
    store.set(BOOKINGS_COOKIE, encodeBookings([record, ...existing]), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: BOOKINGS_COOKIE_MAX_AGE,
    });
  } catch (error) {
    console.error("Could not remember the booking", error);
  }
}
