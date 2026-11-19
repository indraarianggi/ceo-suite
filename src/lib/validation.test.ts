import assert from "node:assert/strict";
import { test } from "node:test";

import {
  birthDateToLocalDate,
  forgotPasswordSchema,
  formatBirthDate,
  getPasswordChecks,
  guestFormSchema,
  identitySchema,
  loginSchema,
  otpSchema,
  parseBirthDate,
  resetPasswordSchema,
  signUpSchema,
  toInternationalPhone,
} from "./validation.ts";

const validSignUp = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "+62 812-3456-7890",
  password: "Abcdef12",
};

function firstMessage(result: {
  success: boolean;
  error?: { issues: { message: string }[] };
}) {
  return result.error?.issues[0]?.message;
}

test("getPasswordChecks: reports each rule independently", () => {
  const checks = getPasswordChecks("abcdefgh");
  assert.deepEqual(
    checks.map((c) => [c.id, c.met]),
    [
      ["length", true],
      ["number", false],
      ["case", false],
    ],
  );
});

test("getPasswordChecks: adds a match row only when confirm is given", () => {
  assert.equal(getPasswordChecks("Abcdef12").length, 3);
  const withConfirm = getPasswordChecks("Abcdef12", "Abcdef12");
  assert.equal(withConfirm.length, 4);
  assert.equal(withConfirm[3]?.met, true);
  assert.equal(getPasswordChecks("Abcdef12", "nope")[3]?.met, false);
  assert.equal(getPasswordChecks("", "")[3]?.met, false);
});

test("signUpSchema: accepts a valid payload", () => {
  assert.equal(signUpSchema.safeParse(validSignUp).success, true);
});

test("signUpSchema: rejects weak passwords with the first failing rule", () => {
  assert.equal(
    firstMessage(
      signUpSchema.safeParse({ ...validSignUp, password: "short1A" }),
    ),
    "Use at least 8 characters.",
  );
  assert.equal(
    firstMessage(
      signUpSchema.safeParse({ ...validSignUp, password: "Abcdefgh" }),
    ),
    "Include at least 1 number.",
  );
  assert.equal(
    firstMessage(
      signUpSchema.safeParse({ ...validSignUp, password: "abcdefg1" }),
    ),
    "Mix upper and lower case letters.",
  );
});

test("signUpSchema: empty password reports the required message first", () => {
  assert.equal(
    firstMessage(signUpSchema.safeParse({ ...validSignUp, password: "" })),
    "Please enter a password.",
  );
});

test("signUpSchema: rejects bad email and phone", () => {
  assert.equal(
    signUpSchema.safeParse({ ...validSignUp, email: "nope" }).success,
    false,
  );
  assert.equal(
    signUpSchema.safeParse({ ...validSignUp, phone: "12" }).success,
    false,
  );
  assert.equal(
    signUpSchema.safeParse({ ...validSignUp, phone: "0812 3456 7890" }).success,
    true,
  );
});

test("loginSchema: only requires a non-empty password (no policy on login)", () => {
  assert.equal(
    loginSchema.safeParse({ email: "a@b.co", password: "x", remember: false })
      .success,
    true,
  );
  assert.equal(
    firstMessage(
      loginSchema.safeParse({ email: "a@b.co", password: "", remember: false }),
    ),
    "Please enter your password.",
  );
});

test("forgotPasswordSchema: trims and validates email", () => {
  assert.equal(
    forgotPasswordSchema.safeParse({ email: "  a@b.co " }).success,
    true,
  );
  assert.equal(forgotPasswordSchema.safeParse({ email: "" }).success, false);
});

test("otpSchema: exactly six digits", () => {
  assert.equal(otpSchema.safeParse({ code: "123456" }).success, true);
  assert.equal(otpSchema.safeParse({ code: "12345" }).success, false);
  assert.equal(otpSchema.safeParse({ code: "12345a" }).success, false);
});

test("resetPasswordSchema: policy plus matching confirmation", () => {
  assert.equal(
    resetPasswordSchema.safeParse({
      password: "Abcdef12",
      confirmPassword: "Abcdef12",
    }).success,
    true,
  );
  const mismatch = resetPasswordSchema.safeParse({
    password: "Abcdef12",
    confirmPassword: "Abcdef13",
  });
  assert.equal(mismatch.success, false);
  assert.deepEqual(mismatch.error?.issues[0]?.path, ["confirmPassword"]);
});

test("parseBirthDate: DD/MM/YYYY, real dates only, not in the future", () => {
  const now = new Date("2026-11-19T00:00:00Z");
  assert.ok(parseBirthDate("19/08/2002", now));
  assert.equal(parseBirthDate("31/02/2002", now), null);
  assert.equal(parseBirthDate("2002-08-19", now), null);
  assert.equal(parseBirthDate("20/11/2026", now), null);
  assert.equal(parseBirthDate("01/01/1800", now), null);
});

test("formatBirthDate: DD/MM/YYYY from a local calendar date", () => {
  assert.equal(formatBirthDate(new Date(2002, 7, 19)), "19/08/2002");
  assert.equal(formatBirthDate(new Date(2002, 0, 5)), "05/01/2002");
});

test("birthDateToLocalDate: round-trips with formatBirthDate", () => {
  const now = new Date(2026, 10, 19);
  const date = birthDateToLocalDate("19/08/2002", now);
  assert.ok(date);
  assert.equal(date.getFullYear(), 2002);
  assert.equal(date.getMonth(), 7);
  assert.equal(date.getDate(), 19);
  assert.equal(formatBirthDate(date), "19/08/2002");
  assert.equal(birthDateToLocalDate("", now), undefined);
  assert.equal(birthDateToLocalDate("31/02/2002", now), undefined);
});

test("identitySchema: both fields required", () => {
  assert.equal(
    identitySchema.safeParse({
      dateOfBirth: "19/08/2002",
      companyName: "The Best Company, Inc.",
    }).success,
    true,
  );
  assert.equal(
    identitySchema.safeParse({ dateOfBirth: "19/08/2002", companyName: " " })
      .success,
    false,
  );
});

test("toInternationalPhone normalises national input behind the fixed +62 prefix", () => {
  assert.equal(toInternationalPhone("0812-3456-7890"), "+6281234567890");
  assert.equal(toInternationalPhone("812 3456 7890"), "+6281234567890");
  assert.equal(toInternationalPhone("+62 812 3456 7890"), "+6281234567890");
});

test("guestFormSchema accepts a normal number and rejects junk", () => {
  const ok = {
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "0812 3456 7890",
  };
  assert.equal(guestFormSchema.safeParse(ok).success, true);
  assert.equal(guestFormSchema.safeParse({ ...ok, phone: "" }).success, false);
  assert.equal(
    guestFormSchema.safeParse({ ...ok, phone: "12345" }).success,
    false,
  );
  assert.equal(
    guestFormSchema.safeParse({ ...ok, phone: "abc" }).success,
    false,
  );
  assert.equal(
    guestFormSchema.safeParse({ ...ok, email: "not-an-email" }).success,
    false,
  );
});
