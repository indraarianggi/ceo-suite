"use server";

import { redirect } from "next/navigation";

import { AUTH_ERROR_MESSAGES, signIn } from "@/lib/auth";
import { sanitizeReturnTo } from "@/lib/return-to";
import { createSession, destroySession } from "@/lib/session";
import { loginSchema, type LoginValues } from "@/lib/validation";

/**
 * Sign in on the server so a session cookie only exists after the credentials
 * check passes. Resolves with an error message to show, or redirects home
 * to the validated `next` path (setting a cookie in a Server Action also
 * refreshes the header's session).
 */
export async function loginAction(
  values: LoginValues,
  next?: string | null,
): Promise<{ error: string } | undefined> {
  // Never trust the client: validate again on the server.
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { error: AUTH_ERROR_MESSAGES["invalid-credentials"] };
  }

  const result = await signIn(parsed.data);
  if (!result.ok) return { error: AUTH_ERROR_MESSAGES[result.error] };

  await createSession(result.user, { remember: parsed.data.remember });
  // `next` comes from the URL, so it is untrusted: only same-origin paths pass.
  redirect(sanitizeReturnTo(next));
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}
