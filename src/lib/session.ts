import { cookies } from "next/headers";
import { cache } from "react";

import { decodeSession, encodeSession } from "@/lib/user";
import type { SessionUser } from "@/types/user";

/**
 * Mock session. The cookie holds the display profile and is NOT signed, which is
 * fine while auth is mocked; a real backend would issue a signed or encrypted
 * session (e.g. iron-session) and look the user up from it. Only this file and
 * `auth-actions.ts` know the cookie exists, so swapping it out stays local.
 *
 * Server only: it reads request cookies, so callers must sit behind <Suspense>
 * (Cache Components keeps the rest of the route in the static shell).
 */
export const SESSION_COOKIE = "ceo_suite_session";
const REMEMBER_ME_SECONDS = 60 * 60 * 24 * 30;

/** Current user or null. Deduped per request, so header and mobile nav share one read. */
export const getSession = cache(async (): Promise<SessionUser | null> => {
  const store = await cookies();
  return decodeSession(store.get(SESSION_COOKIE)?.value);
});

export async function createSession(
  user: SessionUser,
  options: { remember: boolean },
): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, encodeSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // No maxAge = a session cookie that ends when the browser closes.
    ...(options.remember ? { maxAge: REMEMBER_ME_SECONDS } : {}),
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
