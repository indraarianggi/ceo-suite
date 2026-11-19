import assert from "node:assert/strict";
import { test } from "node:test";

import {
  decodeSession,
  displayNameFromEmail,
  encodeSession,
  getInitials,
} from "./user.ts";

test("getInitials: first and last word, uppercased", () => {
  assert.equal(getInitials("Jane Doe"), "JD");
  assert.equal(getInitials("jane doe"), "JD");
  assert.equal(getInitials("  Mary  Ann   Smith "), "MS");
  assert.equal(getInitials("Jane"), "J");
});

test("getInitials: falls back to ? when there is no name", () => {
  assert.equal(getInitials(""), "?");
  assert.equal(getInitials("   "), "?");
});

test("displayNameFromEmail: splits on . _ - and capitalises", () => {
  assert.equal(displayNameFromEmail("jane.doe@example.com"), "Jane Doe");
  assert.equal(
    displayNameFromEmail("john_smith-jr@example.com"),
    "John Smith Jr",
  );
  assert.equal(displayNameFromEmail("janedoe@gmail.com"), "Janedoe");
  assert.equal(displayNameFromEmail("A@b.co"), "A");
});

test("encodeSession / decodeSession: round trip", () => {
  const user = { name: "Jane Doe", email: "janedoe@gmail.com" };
  assert.deepEqual(decodeSession(encodeSession(user)), user);
});

test("encodeSession: output is safe to store in a cookie value", () => {
  const value = encodeSession({ name: 'Jane; Doe, "JD"', email: "a@b.co" });
  assert.doesNotMatch(value, /[;,\s"]/);
});

test("decodeSession: rejects garbage and malformed shapes", () => {
  assert.equal(decodeSession(undefined), null);
  assert.equal(decodeSession(""), null);
  assert.equal(decodeSession("not-json"), null);
  assert.equal(decodeSession(encodeURIComponent("{}")), null);
  assert.equal(
    decodeSession(
      encodeURIComponent(JSON.stringify({ name: 1, email: "a@b.co" })),
    ),
    null,
  );
  assert.equal(
    decodeSession(
      encodeURIComponent(JSON.stringify({ name: "A", email: "nope" })),
    ),
    null,
  );
  assert.equal(
    decodeSession(
      encodeURIComponent(JSON.stringify({ name: "", email: "a@b.co" })),
    ),
    null,
  );
});
