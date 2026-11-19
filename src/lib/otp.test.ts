import assert from "node:assert/strict";
import { test } from "node:test";

import {
  formatCountdown,
  OTP_LENGTH,
  RESEND_SECONDS,
  sanitizeOtp,
} from "./otp.ts";

test("sanitizeOtp keeps digits only, capped at six", () => {
  assert.equal(sanitizeOtp("12a3-45 6789"), "123456");
  assert.equal(sanitizeOtp(""), "");
  assert.equal(sanitizeOtp("abc"), "");
  assert.equal(OTP_LENGTH, 6);
});

test("formatCountdown renders mm:ss", () => {
  assert.equal(formatCountdown(RESEND_SECONDS), "01:59");
  assert.equal(formatCountdown(60), "01:00");
  assert.equal(formatCountdown(5), "00:05");
  assert.equal(formatCountdown(0), "00:00");
  assert.equal(formatCountdown(-3), "00:00");
});
