import assert from "node:assert/strict";
import { test } from "node:test";

import { calculateBookingTotal, priceForDays } from "./pricing.ts";

const tiers = {
  hourly: 400_000,
  daily: 2_400_000,
  weekly: 13_350_000,
  monthly: 44_500_000,
};

test("hours: hourly rate when cheaper than daily", () => {
  assert.equal(
    calculateBookingTotal(tiers, { kind: "hours", minutes: 240 }),
    1_600_000,
  );
});

test("hours: capped at the daily rate", () => {
  assert.equal(
    calculateBookingTotal(tiers, { kind: "hours", minutes: 420 }),
    2_400_000,
  );
});

test("hours: half-hour steps are prorated", () => {
  assert.equal(
    calculateBookingTotal(tiers, { kind: "hours", minutes: 90 }),
    600_000,
  );
});

test("days: one day is the daily rate", () => {
  assert.equal(priceForDays(1, tiers), 2_400_000);
});

test("days: two days is two daily rates (weekly would cost more)", () => {
  assert.equal(priceForDays(2, tiers), 4_800_000);
});

test("days: seven days uses the weekly rate", () => {
  assert.equal(priceForDays(7, tiers), 13_350_000);
});

test("days: thirty days uses the monthly rate", () => {
  assert.equal(priceForDays(30, tiers), 44_500_000);
});

test("days: dispatches through calculateBookingTotal", () => {
  assert.equal(
    calculateBookingTotal(tiers, { kind: "days", days: 7 }),
    13_350_000,
  );
});

test("days: six days rounds up to the weekly rate when that is cheaper", () => {
  assert.equal(priceForDays(6, tiers), 13_350_000);
});

test("days: ten days combines one week with three days", () => {
  assert.equal(priceForDays(10, tiers), 13_350_000 + 3 * 2_400_000);
});

test("days: fourteen days is two weeks", () => {
  assert.equal(priceForDays(14, tiers), 2 * 13_350_000);
});

test("days: thirty-one days is a month plus a day", () => {
  assert.equal(priceForDays(31, tiers), 44_500_000 + 2_400_000);
});

test("days: never exceeds days x daily, even with inverted tiers", () => {
  const inverted = { ...tiers, weekly: 99_000_000, monthly: 999_000_000 };
  assert.equal(priceForDays(10, inverted), 10 * 2_400_000);
});
