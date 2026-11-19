import assert from "node:assert/strict";
import { test } from "node:test";

import {
  AUTH_ERROR_MESSAGES,
  authConfig,
  MOCK_AUTH,
  requestPasswordReset,
  resendCode,
  resetPassword,
  saveIdentity,
  signIn,
  signUp,
  verifyCode,
} from "./auth.ts";

authConfig.latencyMs = 0;

test("signIn succeeds for normal credentials and returns the user", async () => {
  assert.deepEqual(
    await signIn({ email: "a@b.co", password: "x", remember: false }),
    { ok: true, user: { name: "A", email: "a@b.co" } },
  );
});

test("signIn returns the seeded display name for the demo user", async () => {
  const result = await signIn({
    email: "janedoe@gmail.com",
    password: "x",
    remember: false,
  });
  assert.ok(result.ok);
  assert.deepEqual(result.user, {
    name: "Jane Doe",
    email: "janedoe@gmail.com",
  });
});

test("signIn normalises the email (trim, lower case)", async () => {
  const result = await signIn({
    email: "  JaneDoe@Gmail.com ",
    password: "x",
    remember: false,
  });
  assert.ok(result.ok);
  assert.equal(result.user.email, "janedoe@gmail.com");
  assert.equal(result.user.name, "Jane Doe");
});

test("signIn fails for the magic wrong-credentials email", async () => {
  assert.deepEqual(
    await signIn({
      email: MOCK_AUTH.wrongCredentialsEmail,
      password: "x",
      remember: false,
    }),
    { ok: false, error: "invalid-credentials" },
  );
});

test("signUp rejects the magic taken email", async () => {
  const base = {
    name: "J",
    email: "a@b.co",
    phone: "0812345678",
    password: "Abcdef12",
  };
  assert.deepEqual(await signUp(base), { ok: true });
  assert.deepEqual(await signUp({ ...base, email: MOCK_AUTH.takenEmail }), {
    ok: false,
    error: "email-taken",
  });
});

test("verifyCode rejects the magic invalid code only", async () => {
  assert.deepEqual(await verifyCode({ email: "a@b.co", code: "123456" }), {
    ok: true,
  });
  assert.deepEqual(
    await verifyCode({ email: "a@b.co", code: MOCK_AUTH.invalidCode }),
    { ok: false, error: "invalid-code" },
  );
});

test("remaining actions resolve ok", async () => {
  assert.deepEqual(
    await saveIdentity({
      email: "a@b.co",
      dateOfBirth: "19/08/2002",
      companyName: "X",
    }),
    { ok: true },
  );
  assert.deepEqual(await resendCode({ email: "a@b.co" }), { ok: true });
  assert.deepEqual(await requestPasswordReset({ email: "a@b.co" }), {
    ok: true,
  });
  assert.deepEqual(
    await resetPassword({
      email: "a@b.co",
      code: "123456",
      password: "Abcdef12",
    }),
    { ok: true },
  );
});

test("every error code has a non-empty message", () => {
  for (const message of Object.values(AUTH_ERROR_MESSAGES)) {
    assert.ok(message.length > 0);
  }
  assert.equal(Object.keys(AUTH_ERROR_MESSAGES).length, 3);
});
