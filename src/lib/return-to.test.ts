import assert from "node:assert/strict";
import { test } from "node:test";

import { sanitizeReturnTo } from "./return-to.ts";

test("keeps same-origin paths, queries and hashes", () => {
  assert.equal(sanitizeReturnTo("/my-booking"), "/my-booking");
  assert.equal(
    sanitizeReturnTo("/my-booking/CS-ABCD1234"),
    "/my-booking/CS-ABCD1234",
  );
  assert.equal(
    sanitizeReturnTo("/my-booking?tab=history#top"),
    "/my-booking?tab=history#top",
  );
});

test("falls back to / for missing or empty input", () => {
  assert.equal(sanitizeReturnTo(undefined), "/");
  assert.equal(sanitizeReturnTo(null), "/");
  assert.equal(sanitizeReturnTo(""), "/");
});

test("rejects anything that is not a path starting with a single slash", () => {
  for (const value of [
    "my-booking",
    "https://evil.com",
    "http://evil.com/my-booking",
    "javascript:alert(1)",
    "//evil.com",
    "///evil.com",
    "/\\evil.com",
    "/\t/evil.com",
    "/\n/evil.com",
  ]) {
    assert.equal(sanitizeReturnTo(value), "/", JSON.stringify(value));
  }
});
