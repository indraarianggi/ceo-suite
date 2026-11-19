import assert from "node:assert/strict";
import { test } from "node:test";

import { seedBookings } from "../data/bookings.ts";
import type {
  BookingQuote,
  BookingSelection,
  StoredBooking,
} from "../types/booking.ts";
import {
  bookingEnd,
  buildPriceBreakdown,
  decodeBookings,
  encodeBookings,
  formatBookingDuration,
  invoiceNumber,
  isReference,
  MAX_COOKIE_CHARS,
  MAX_STORED_BOOKINGS,
  mergeBookings,
  paymentInfo,
  sameOwner,
  splitBookings,
  storedBookingSchema,
} from "./booking-records.ts";

const quote = (): BookingQuote => ({
  lines: [
    { id: "space", label: "Room (Hourly)", quantity: 1, amount: 1_200_000 },
    {
      id: "coffee-break-standard",
      label: "Coffee Break - Standard",
      quantity: 2,
      amount: 100_000,
    },
  ],
  subtotal: 1_300_000,
  discount: null,
  total: 1_300_000,
});

const single: BookingSelection = {
  slug: "suite-7-view",
  from: "2026-11-20",
  to: "2026-11-20",
  time: { start: "10:00", end: "12:00" },
};

function booking(overrides: Partial<StoredBooking> = {}): StoredBooking {
  return {
    reference: "CS-AAAAAAAA",
    ownerEmail: "jane@x.co",
    contactName: "Jane",
    spaceSlug: "suite-7-view",
    selection: single,
    note: "",
    quote: quote(),
    status: "success",
    createdAt: "2026-11-19T03:00:00.000Z",
    ...overrides,
  };
}

// --- bookingEnd / splitBookings -------------------------------------------

test("bookingEnd of a timed single-day booking is its end time", () => {
  assert.deepEqual(bookingEnd(single), new Date(2026, 10, 20, 12, 0));
});

test("bookingEnd of a multi-day booking is the start of the day after `to`", () => {
  const multi: BookingSelection = {
    slug: "suite-7-view",
    from: "2026-11-20",
    to: "2026-11-22",
  };
  assert.deepEqual(bookingEnd(multi), new Date(2026, 10, 23, 0, 0));
});

test("a booking is Active until its end, History from the end onward", () => {
  const item = booking();
  const justBefore = new Date(2026, 10, 20, 11, 59);
  const exactlyEnd = new Date(2026, 10, 20, 12, 0);
  assert.equal(splitBookings([item], justBefore).active.length, 1);
  assert.equal(splitBookings([item], exactlyEnd).history.length, 1);
  assert.equal(splitBookings([item], exactlyEnd).active.length, 0);
});

test("a multi-day booking stays Active through its last day", () => {
  const item = booking({
    selection: { slug: "suite-7-view", from: "2026-11-20", to: "2026-11-22" },
  });
  const lastDayNight = new Date(2026, 10, 22, 23, 30);
  assert.equal(splitBookings([item], lastDayNight).active.length, 1);
});

test("Active sorts soonest first, History sorts most recent first", () => {
  const at = (day: number, reference: string) =>
    booking({
      reference,
      selection: {
        slug: "suite-7-view",
        from: `2026-12-${String(day).padStart(2, "0")}`,
        to: `2026-12-${String(day).padStart(2, "0")}`,
        time: { start: "10:00", end: "12:00" },
      },
    });
  const now = new Date(2026, 11, 10, 0, 0);
  const { active, history } = splitBookings(
    [
      at(20, "CS-ACTIVE20"),
      at(15, "CS-ACTIVE15"),
      at(1, "CS-PAST0001"),
      at(5, "CS-PAST0005"),
    ],
    now,
  );
  assert.deepEqual(
    active.map((b) => b.reference),
    ["CS-ACTIVE15", "CS-ACTIVE20"],
  );
  assert.deepEqual(
    history.map((b) => b.reference),
    ["CS-PAST0005", "CS-PAST0001"],
  );
});

// --- duration, prices, payment --------------------------------------------

test("formatBookingDuration handles hours and days", () => {
  const timed = (start: string, end: string): BookingSelection => ({
    ...single,
    time: { start, end },
  });
  assert.equal(formatBookingDuration(timed("10:00", "12:00")), "2 hours");
  assert.equal(formatBookingDuration(timed("10:00", "11:00")), "1 hour");
  assert.equal(formatBookingDuration(timed("10:00", "11:30")), "1.5 hours");
  assert.equal(
    formatBookingDuration({ slug: "s", from: "2026-11-20", to: "2026-11-20" }),
    "1 day",
  );
  assert.equal(
    formatBookingDuration({ slug: "s", from: "2026-11-20", to: "2026-11-22" }),
    "3 days",
  );
});

test("buildPriceBreakdown splits room and add-ons and ends at the checkout total", () => {
  const rows = buildPriceBreakdown(quote());
  assert.equal(rows.room, 1_200_000);
  assert.equal(rows.addOns, 100_000);
  assert.equal(rows.overtime, 0);
  assert.equal(rows.subtotal, 1_300_000);
  assert.equal(rows.deposit, 0);
  assert.equal(rows.discount, null);
  assert.equal(rows.final, 1_300_000);
});

test("buildPriceBreakdown keeps the voucher and the final price after it", () => {
  const withVoucher: BookingQuote = {
    ...quote(),
    discount: { code: "15DISCOUNT", amount: 100_000 },
    total: 1_200_000,
  };
  const rows = buildPriceBreakdown(withVoucher);
  assert.deepEqual(rows.discount, { code: "15DISCOUNT", amount: 100_000 });
  assert.equal(rows.subtotal, 1_300_000);
  assert.equal(rows.final, 1_200_000);
});

test("invoiceNumber is deterministic and INV- plus 14 digits", () => {
  assert.match(invoiceNumber("CS-ABCD1234"), /^INV-\d{14}$/);
  assert.equal(invoiceNumber("CS-ABCD1234"), invoiceNumber("CS-ABCD1234"));
  assert.notEqual(invoiceNumber("CS-ABCD1234"), invoiceNumber("CS-ABCD1235"));
});

test("paymentInfo: success is Paid, expired is Payment Failed with an expiry", () => {
  const paid = paymentInfo(booking());
  assert.equal(paid.status, "Paid");
  assert.equal(paid.type, "payment_gateway");
  assert.equal(paid.expiredBy, null);

  const failed = paymentInfo(booking({ status: "expired" }));
  assert.equal(failed.status, "Payment Failed");
  assert.deepEqual(failed.expiredBy, new Date("2026-11-20T03:00:00.000Z"));
});

// --- identifiers ------------------------------------------------------------

test("isReference accepts CS- plus eight upper-case letters or digits only", () => {
  assert.ok(isReference("CS-ABCD1234"));
  assert.ok(isReference("CS-DEMO0001"));
  assert.ok(!isReference("cs-abcd1234"));
  assert.ok(!isReference("CS-ABC"));
  assert.ok(!isReference("CS-ABCD12345"));
  assert.ok(!isReference("../etc/passwd"));
});

test("sameOwner ignores case and surrounding whitespace", () => {
  assert.ok(sameOwner("Jane@X.co", " jane@x.co "));
  assert.ok(!sameOwner("jane@x.co", "joe@x.co"));
});

// --- cookie codec -----------------------------------------------------------

test("encode then decode round-trips records", () => {
  const records = [booking(), booking({ reference: "CS-BBBBBBBB" })];
  assert.deepEqual(decodeBookings(encodeBookings(records)), records);
});

test("decode never throws and returns [] for missing or garbage input", () => {
  assert.deepEqual(decodeBookings(undefined), []);
  assert.deepEqual(decodeBookings(""), []);
  assert.deepEqual(decodeBookings("not json"), []);
  assert.deepEqual(decodeBookings('{"a":1}'), []);
});

test("decode drops invalid records but keeps the good ones", () => {
  const good = booking();
  const raw = JSON.stringify([good, { reference: "nope" }, 42, null]);
  assert.deepEqual(decodeBookings(raw), [good]);
});

test("decode accepts a still-percent-encoded value", () => {
  const records = [booking()];
  assert.deepEqual(
    decodeBookings(encodeURIComponent(encodeBookings(records))),
    records,
  );
});

test("encode keeps the newest records and stays under the cookie budget", () => {
  const records = Array.from({ length: 30 }, (_, i) =>
    booking({
      reference: `CS-${String(i).padStart(8, "0")}`,
      note: "x".repeat(120),
    }),
  );
  const encoded = encodeBookings(records);
  assert.ok(encodeURIComponent(encoded).length <= MAX_COOKIE_CHARS);
  const decoded = decodeBookings(encoded);
  assert.ok(decoded.length > 0);
  assert.ok(decoded.length <= MAX_STORED_BOOKINGS);
  assert.equal(decoded[0].reference, "CS-00000000");
});

test("mergeBookings puts stored first and drops duplicate references", () => {
  const stored = [booking({ reference: "CS-STORED01" })];
  const seed = [
    booking({ reference: "CS-SEED0001" }),
    booking({ reference: "CS-STORED01", status: "expired" }),
  ];
  const merged = mergeBookings(seed, stored);
  assert.deepEqual(
    merged.map((b) => b.reference),
    ["CS-STORED01", "CS-SEED0001"],
  );
  assert.equal(merged[0].status, "success");
});

// --- seed data --------------------------------------------------------------

test("seed bookings are valid, unique, and cover every state", () => {
  const now = new Date(2026, 10, 19, 12, 0);
  const seeds = seedBookings(now);
  for (const seed of seeds) {
    assert.ok(storedBookingSchema.safeParse(seed).success, seed.reference);
  }
  assert.equal(new Set(seeds.map((s) => s.reference)).size, seeds.length);

  const { active, history } = splitBookings(seeds, now);
  assert.ok(active.length >= 2 && history.length >= 2);
  assert.ok(seeds.some((s) => s.status === "success"));
  assert.ok(seeds.some((s) => s.status === "expired"));
  assert.ok(active.some((s) => s.status === "expired")); // the Figma red card
});
