import type { SessionUser } from "../types/user.ts";
import { displayNameFromEmail } from "./user.ts";
import type {
  IdentityValues,
  LoginValues,
  SignUpValues,
} from "./validation.ts";

/**
 * Mock auth backend. Swap these functions for real API calls later; UI code only
 * depends on the signatures and `AuthResult`.
 *
 * Magic values for trying error states by hand:
 *   sign in  with email  wrong@example.com  -> invalid-credentials
 *   sign up  with email  taken@example.com  -> email-taken
 *   any code entered     000000             -> invalid-code
 */
export const MOCK_AUTH = {
  wrongCredentialsEmail: "wrong@example.com",
  takenEmail: "taken@example.com",
  invalidCode: "000000",
} as const;

/** Seeded accounts: email -> profile name (the demo persona from the Figma frames). */
const MOCK_USERS: Record<string, string> = {
  "janedoe@gmail.com": "Jane Doe",
};

export const authConfig = { latencyMs: 600 };

export type AuthError = "invalid-credentials" | "email-taken" | "invalid-code";
export type AuthResult = { ok: true } | { ok: false; error: AuthError };
export type SignInResult =
  { ok: true; user: SessionUser } | { ok: false; error: AuthError };

const ok: AuthResult = { ok: true };
const fail = (error: AuthError) => ({ ok: false, error }) as const;
const wait = () =>
  new Promise<void>((resolve) => setTimeout(resolve, authConfig.latencyMs));

export async function signIn(values: LoginValues): Promise<SignInResult> {
  await wait();
  const email = values.email.trim().toLowerCase();
  if (email === MOCK_AUTH.wrongCredentialsEmail) {
    return fail("invalid-credentials");
  }
  return {
    ok: true,
    user: { name: MOCK_USERS[email] ?? displayNameFromEmail(email), email },
  };
}

export async function signUp(values: SignUpValues): Promise<AuthResult> {
  await wait();
  return values.email === MOCK_AUTH.takenEmail ? fail("email-taken") : ok;
}

export async function saveIdentity(
  values: IdentityValues & { email: string },
): Promise<AuthResult> {
  void values;
  await wait();
  return ok;
}

export async function verifyCode(values: {
  email: string;
  code: string;
}): Promise<AuthResult> {
  await wait();
  return values.code === MOCK_AUTH.invalidCode ? fail("invalid-code") : ok;
}

export async function resendCode(values: {
  email: string;
}): Promise<AuthResult> {
  void values;
  await wait();
  return ok;
}

export async function requestPasswordReset(values: {
  email: string;
}): Promise<AuthResult> {
  void values;
  await wait();
  return ok;
}

export async function resetPassword(values: {
  email: string;
  code: string;
  password: string;
}): Promise<AuthResult> {
  void values;
  await wait();
  return ok;
}

// Wording trade-off: credential errors stay generic on purpose, so the form
// can't be used to discover which emails are registered. "email-taken" is
// inherently specific (sign-up must tell the user), so it points to sign-in.
export const AUTH_ERROR_MESSAGES: Record<AuthError, string> = {
  "invalid-credentials": "Incorrect email or password.",
  "email-taken":
    "An account with this email already exists. Try signing in instead.",
  "invalid-code": "That code is incorrect. Please try again.",
};
