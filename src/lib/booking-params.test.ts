import assert from "node:assert/strict";
import { test } from "node:test";

import { parseBookingParams } from "./booking-params.ts";

// Wed 18 Nov 2026, local time.
const today = new Date(2026, 10, 18, 9, 30);

const base = { space: "axa-tower-meeting-room-a" };

test("single day with a time range parses into a selection", () => {
  const result = parseBookingParams(
    {
      ...base,
      from: "2026-11-20",
      to: "2026-11-20",
      start: "10:00",
      end: "13:00",
    },
    today,
  );
  assert.deepEqual(result, {
    ok: true,
    selection: {
      slug: "axa-tower-meeting-room-a",
      from: "2026-11-20",
      to: "2026-11-20",
      time: { start: "10:00", end: "13:00" },
    },
  });
});

test("multi-day ignores start/end", () => {
  const result = parseBookingParams(
    {
      ...base,
      from: "2026-11-20",
      to: "2026-11-22",
      start: "10:00",
      end: "13:00",
    },
    today,
  );
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.selection.time, undefined);
});

test("missing or empty space is rejected", () => {
  for (const space of [undefined, "", "   "]) {
    const result = parseBookingParams(
      { space, from: "2026-11-20", to: "2026-11-21" },
      today,
    );
    assert.deepEqual(result, { ok: false, error: "missing-space" });
  }
});

test("malformed or impossible dates are rejected and keep the slug", () => {
  for (const from of [
    "tomorrow",
    "2026-13-01",
    "2026-02-31",
    "20-11-2026",
    "",
  ]) {
    const result = parseBookingParams(
      { ...base, from, to: "2026-11-21" },
      today,
    );
    assert.deepEqual(result, {
      ok: false,
      error: "invalid-dates",
      slug: base.space,
    });
  }
  const noDates = parseBookingParams(base, today);
  assert.equal(noDates.ok === false && noDates.error, "invalid-dates");
});

test("end date before start date is rejected", () => {
  const result = parseBookingParams(
    { ...base, from: "2026-11-22", to: "2026-11-20" },
    today,
  );
  assert.equal(result.ok === false && result.error, "invalid-dates");
});

test("past dates are rejected, today is allowed", () => {
  const past = parseBookingParams(
    { ...base, from: "2026-11-17", to: "2026-11-18" },
    today,
  );
  assert.equal(past.ok === false && past.error, "past-dates");

  const todayOk = parseBookingParams(
    {
      ...base,
      from: "2026-11-18",
      to: "2026-11-18",
      start: "14:00",
      end: "15:00",
    },
    today,
  );
  assert.equal(todayOk.ok, true);
});

test("spans longer than a year are rejected (pricing loops per day)", () => {
  const year = parseBookingParams(
    { ...base, from: "2026-11-20", to: "2027-11-19" },
    today,
  );
  assert.equal(year.ok, true); // exactly 365 days

  const tooLong = parseBookingParams(
    { ...base, from: "2026-11-20", to: "2027-11-20" },
    today,
  );
  assert.equal(tooLong.ok === false && tooLong.error, "invalid-dates");

  const absurd = parseBookingParams(
    { ...base, from: "2026-11-20", to: "9999-12-31" },
    today,
  );
  assert.equal(absurd.ok === false && absurd.error, "invalid-dates");
});

test("single day needs a valid time range on the 30-minute grid", () => {
  const single = { ...base, from: "2026-11-20", to: "2026-11-20" };
  const cases: Record<string, { start?: string; end?: string }> = {
    "no time": {},
    "only start": { start: "10:00" },
    "end before start": { start: "13:00", end: "10:00" },
    "zero length": { start: "10:00", end: "10:00" },
    "off the grid": { start: "10:15", end: "11:00" },
    "before opening": { start: "07:30", end: "09:00" },
    "after closing": { start: "19:00", end: "20:30" },
    garbage: { start: "ten", end: "noon" },
  };
  for (const [label, time] of Object.entries(cases)) {
    const result = parseBookingParams({ ...single, ...time }, today);
    assert.equal(result.ok === false && result.error, "invalid-time", label);
  }
});

test("repeated params use the first value", () => {
  const result = parseBookingParams(
    { space: ["a-space", "other"], from: ["2026-11-20"], to: "2026-11-21" },
    today,
  );
  assert.equal(result.ok && result.selection.slug, "a-space");
});
