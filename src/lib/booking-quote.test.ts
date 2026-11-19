import assert from "node:assert/strict";
import { test } from "node:test";

import type { Voucher } from "../types/booking.ts";
import type { AddOn } from "../types/space.ts";
import {
  buildQuote,
  checkVoucher,
  describeSpaceCharge,
  findVoucher,
  MAX_ADD_ON_QUANTITY,
  resolveAddOns,
} from "./booking-quote.ts";

const today = new Date(2026, 10, 18, 9, 30);

const catalog: AddOn[] = [
  {
    id: "lunch",
    name: "Lunch Package - Standard",
    price: 85_000,
    unit: "pax",
    icon: "lunch",
  },
  {
    id: "coffee",
    name: "Coffee Break - Standard",
    price: 50_000,
    unit: "pax",
    icon: "coffee",
  },
  {
    id: "projector-hour",
    name: "LCD Projector",
    price: 250_000,
    unit: "hour",
    icon: "projector",
  },
  {
    id: "projector-day",
    name: "LCD Projector",
    price: 1_500_000,
    unit: "day",
    icon: "projector",
  },
  {
    id: "flip-chart",
    name: "Flip Chart",
    price: 85_000,
    unit: "event",
    icon: "flip-chart",
  },
];

// The Figma "AXA Tower Boardroom" scenario: 3 hours, capped at the daily rate.
const tiers = {
  hourly: 1_000_000,
  daily: 2_880_000,
  weekly: 15_000_000,
  monthly: 50_000_000,
};
const threeHours = { kind: "hours", minutes: 180 } as const;

const voucher: Voucher = {
  code: "15DISCOUNT",
  title: "Discount 15% for Meeting Room",
  validUntil: "2026-12-31",
  percentOff: 15,
  maxDiscount: 100_000,
  appliesTo: ["meeting-room"],
};

/* ---------- resolveAddOns ---------- */

test("resolveAddOns keeps catalog order and drops unknown ids and empty quantities", () => {
  const resolved = resolveAddOns(
    [
      { addOnId: "coffee", quantity: 2 },
      { addOnId: "nope", quantity: 1 },
      { addOnId: "lunch", quantity: 0 },
      { addOnId: "flip-chart", quantity: 1 },
    ],
    catalog,
    20,
  );
  assert.deepEqual(
    resolved.map((r) => [r.addOn.id, r.quantity]),
    [
      ["coffee", 2],
      ["flip-chart", 1],
    ],
  );
});

test("resolveAddOns rejects negative, fractional and non-numeric quantities", () => {
  const resolved = resolveAddOns(
    [
      { addOnId: "lunch", quantity: -3 },
      { addOnId: "coffee", quantity: 1.5 },
      { addOnId: "flip-chart", quantity: Number.NaN },
      { addOnId: "projector-day", quantity: Number.POSITIVE_INFINITY },
    ],
    catalog,
    20,
  );
  assert.deepEqual(resolved, []);
});

test("resolveAddOns caps per-pax add-ons at capacity and the rest at the global max", () => {
  const resolved = resolveAddOns(
    [
      { addOnId: "lunch", quantity: 500 },
      { addOnId: "flip-chart", quantity: 500 },
    ],
    catalog,
    20,
  );
  const byId = Object.fromEntries(
    resolved.map((r) => [r.addOn.id, r.quantity]),
  );
  assert.equal(byId.lunch, 20);
  assert.equal(byId["flip-chart"], MAX_ADD_ON_QUANTITY);
});

test("resolveAddOns merges a duplicate id instead of double counting", () => {
  const resolved = resolveAddOns(
    [
      { addOnId: "coffee", quantity: 1 },
      { addOnId: "coffee", quantity: 3 },
    ],
    catalog,
    20,
  );
  assert.deepEqual(
    resolved.map((r) => [r.addOn.id, r.quantity]),
    [["coffee", 3]],
  );
});

/* ---------- findVoucher ---------- */

test("findVoucher matches a typed code regardless of case and whitespace", () => {
  assert.equal(findVoucher([voucher], "  15discount "), voucher);
  assert.equal(findVoucher([voucher], "15DISCOUNT"), voucher);
  assert.equal(findVoucher([voucher], "NOPE"), null);
  assert.equal(findVoucher([voucher], "   "), null);
});

/* ---------- describeSpaceCharge ---------- */

test("describeSpaceCharge names the tier the visitor is actually charged", () => {
  assert.equal(describeSpaceCharge(threeHours, tiers), "Daily"); // 3h hits the daily cap
  assert.equal(
    describeSpaceCharge({ kind: "hours", minutes: 60 }, tiers),
    "Hourly",
  );
  assert.equal(describeSpaceCharge({ kind: "days", days: 1 }, tiers), "Daily");
  assert.equal(describeSpaceCharge({ kind: "days", days: 4 }, tiers), "4 days");
});

/* ---------- checkVoucher ---------- */

test("checkVoucher: percentage, capped by maxDiscount", () => {
  assert.deepEqual(
    checkVoucher(voucher, {
      spaceType: "meeting-room",
      subtotal: 4_430_000,
      today,
    }),
    { ok: true, discount: 100_000 },
  );
});

test("checkVoucher: below the cap the percentage applies", () => {
  assert.deepEqual(
    checkVoucher(voucher, {
      spaceType: "meeting-room",
      subtotal: 200_000,
      today,
    }),
    { ok: true, discount: 30_000 },
  );
});

test("checkVoucher: never discounts more than the subtotal", () => {
  const generous = { ...voucher, percentOff: 100, maxDiscount: 10_000_000 };
  assert.deepEqual(
    checkVoucher(generous, {
      spaceType: "meeting-room",
      subtotal: 50_000,
      today,
    }),
    { ok: true, discount: 50_000 },
  );
});

test("checkVoucher: valid through its last day, expired the day after", () => {
  const lastDay = new Date(2026, 11, 31, 23, 59);
  const dayAfter = new Date(2027, 0, 1, 0, 1);
  const ctx = { spaceType: "meeting-room", subtotal: 1_000_000 } as const;
  assert.equal(checkVoucher(voucher, { ...ctx, today: lastDay }).ok, true);
  assert.deepEqual(checkVoucher(voucher, { ...ctx, today: dayAfter }), {
    ok: false,
    reason: "expired",
  });
});

test("checkVoucher: wrong space type is not applicable", () => {
  assert.deepEqual(
    checkVoucher(voucher, {
      spaceType: "coworking",
      subtotal: 1_000_000,
      today,
    }),
    { ok: false, reason: "not-applicable" },
  );
});

/* ---------- buildQuote ---------- */

test("buildQuote reproduces the Figma order summary", () => {
  const { quote, voucherCheck } = buildQuote({
    spaceName: "AXA Tower Boardroom",
    spaceType: "meeting-room",
    tiers,
    duration: threeHours,
    addOns: resolveAddOns(
      [
        { addOnId: "coffee", quantity: 1 },
        { addOnId: "projector-day", quantity: 1 },
      ],
      catalog,
      20,
    ),
    voucher,
    today,
  });

  assert.deepEqual(quote.lines, [
    {
      id: "space",
      label: "AXA Tower Boardroom (Daily)",
      quantity: 1,
      amount: 2_880_000,
    },
    {
      id: "coffee",
      label: "Coffee Break - Standard",
      quantity: 1,
      amount: 50_000,
    },
    {
      id: "projector-day",
      label: "LCD Projector",
      quantity: 1,
      amount: 1_500_000,
    },
  ]);
  assert.equal(quote.subtotal, 4_430_000);
  assert.deepEqual(quote.discount, { code: "15DISCOUNT", amount: 100_000 });
  assert.equal(quote.total, 4_330_000);
  assert.deepEqual(voucherCheck, { ok: true, discount: 100_000 });
});

test("buildQuote multiplies add-ons by quantity", () => {
  const { quote } = buildQuote({
    spaceName: "Room",
    spaceType: "meeting-room",
    tiers,
    duration: threeHours,
    addOns: resolveAddOns([{ addOnId: "lunch", quantity: 12 }], catalog, 20),
    voucher: null,
    today,
  });
  assert.deepEqual(quote.lines[1], {
    id: "lunch",
    label: "Lunch Package - Standard",
    quantity: 12,
    amount: 1_020_000,
  });
  assert.equal(quote.total, 2_880_000 + 1_020_000);
  assert.equal(quote.discount, null);
});

test("buildQuote disambiguates add-ons that share a name", () => {
  const { quote } = buildQuote({
    spaceName: "Room",
    spaceType: "meeting-room",
    tiers,
    duration: threeHours,
    addOns: resolveAddOns(
      [
        { addOnId: "projector-hour", quantity: 2 },
        { addOnId: "projector-day", quantity: 1 },
      ],
      catalog,
      20,
    ),
    voucher: null,
    today,
  });
  assert.deepEqual(
    quote.lines.slice(1).map((l) => l.label),
    ["LCD Projector (/hour)", "LCD Projector (/day)"],
  );
});

test("buildQuote ignores an invalid voucher but reports why", () => {
  const { quote, voucherCheck } = buildQuote({
    spaceName: "Room",
    spaceType: "coworking",
    tiers,
    duration: threeHours,
    addOns: [],
    voucher,
    today,
  });
  assert.equal(quote.discount, null);
  assert.equal(quote.total, quote.subtotal);
  assert.deepEqual(voucherCheck, { ok: false, reason: "not-applicable" });
});

test("buildQuote prices multi-day stays through the tier mix", () => {
  const { quote } = buildQuote({
    spaceName: "Room",
    spaceType: "meeting-room",
    tiers,
    duration: { kind: "days", days: 3 },
    addOns: [],
    voucher: null,
    today,
  });
  assert.equal(quote.lines[0].label, "Room (3 days)");
  assert.equal(quote.total, 3 * 2_880_000);
});
