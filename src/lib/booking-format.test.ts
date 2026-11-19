import assert from "node:assert/strict";
import { test } from "node:test";

import { formatBookingDates, formatBookingTime } from "./booking-format.ts";

const single = {
  slug: "x",
  from: "2024-07-10",
  to: "2024-07-10",
  time: { start: "10:00", end: "13:00" },
};

// Figma's sample says "Mon, 10 July 2024", but that date was a Wednesday: the
// weekday is derived from the real date, never copied.
test("a single day reads like the Figma frame", () => {
  assert.equal(formatBookingDates(single), "Wed, 10 July 2024");
  assert.equal(formatBookingTime(single), "10.00 - 13.00");
});

test("several days show the range and no time", () => {
  const multi = { slug: "x", from: "2024-07-10", to: "2024-07-12" };
  assert.equal(
    formatBookingDates(multi),
    "Wed, 10 July 2024 - Fri, 12 July 2024",
  );
  assert.equal(formatBookingTime(multi), null);
});
