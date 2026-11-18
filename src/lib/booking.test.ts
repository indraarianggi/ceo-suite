import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildTimeSlots,
  formatTimeField,
  getBookingDuration,
  toMinutes,
} from "./booking.ts";

const day = (d: number) => new Date(2024, 7, d);

test("toMinutes parses HH:mm", () => {
  assert.equal(toMinutes("10:30"), 630);
});

test("buildTimeSlots steps by 30 minutes, inclusive of close", () => {
  assert.deepEqual(buildTimeSlots("08:00", "09:30"), [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
  ]);
});

test("formatTimeField uses a dot like the Figma field", () => {
  assert.equal(formatTimeField("10:00"), "10.00");
});

test("getBookingDuration: nothing without a date", () => {
  assert.equal(getBookingDuration(undefined, undefined), null);
});

test("getBookingDuration: one day without a time is incomplete", () => {
  assert.equal(
    getBookingDuration({ from: day(17), to: day(17) }, undefined),
    null,
  );
});

test("getBookingDuration: one day with a time is hours", () => {
  assert.deepEqual(
    getBookingDuration(
      { from: day(17), to: day(17) },
      { start: "10:00", end: "14:00" },
    ),
    { kind: "hours", minutes: 240 },
  );
});

test("getBookingDuration: multi-day is days, time ignored", () => {
  assert.deepEqual(
    getBookingDuration(
      { from: day(17), to: day(23) },
      { start: "10:00", end: "14:00" },
    ),
    { kind: "days", days: 7 },
  );
});
