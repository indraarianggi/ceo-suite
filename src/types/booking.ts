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

export type BookingStatus = "success" | "expired";

/**
 * A booking as stored (cookie or seed). Compact on purpose: the space is
 * rehydrated from `spaceSlug`, and the quote is a snapshot of what the
 * customer confirmed so later price changes never rewrite history.
 */
export type StoredBooking = {
  /** "CS-XXXXXXXX"; doubles as the id and the "Booking Invoice" shown in Figma. */
  reference: string;
  /** Lower-case; bookings are only listed for their owner. */
  ownerEmail: string;
  contactName: string;
  spaceSlug: string;
  selection: BookingSelection;
  note: string;
  quote: BookingQuote;
  status: BookingStatus;
  /** ISO timestamp. */
  createdAt: string;
};

/** A stored booking joined with its space, ready to render. */
export type BookingView = StoredBooking & { space: SpaceDetail };
