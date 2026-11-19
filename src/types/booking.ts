import type { SpaceDetail, SpaceType } from "./space.ts";

/** The slice of a space the booking flow needs (and sends to the client). */
export type BookingSpace = Pick<
  SpaceDetail,
  | "id"
  | "slug"
  | "name"
  | "type"
  | "categoryLabel"
  | "capacity"
  | "image"
  | "prices"
  | "addOns"
  | "location"
>;

/**
 * What the Product page hands over in the URL. Public, non-sensitive, and
 * untrusted: the server re-parses it and recomputes every price.
 */
export type BookingSelection = {
  slug: string;
  /** Local calendar dates, "yyyy-MM-dd". Equal for a single-day booking. */
  from: string;
  to: string;
  /** "HH:mm". Present only for single-day bookings. */
  time?: { start: string; end: string };
};

export type AddOnChoice = { addOnId: string; quantity: number };

export type Voucher = {
  code: string;
  title: string;
  /** Last valid day, "yyyy-MM-dd", inclusive. */
  validUntil: string;
  percentOff: number;
  /** Rupiah ceiling for the discount. */
  maxDiscount: number;
  appliesTo: SpaceType[];
};

export type QuoteLine = {
  id: string;
  label: string;
  quantity: number;
  amount: number;
};

export type BookingQuote = {
  lines: QuoteLine[];
  subtotal: number;
  discount: { code: string; amount: number } | null;
  total: number;
};

export type GuestDetails = { name: string; email: string; phone: string };

/** Everything the Server Action needs to price and place a booking. */
export type BookingRequest = {
  selection: BookingSelection;
  note: string;
  addOns: AddOnChoice[];
  voucherCode: string | null;
  /** Null when the visitor is signed in (the session identifies them). */
  guest: GuestDetails | null;
};
