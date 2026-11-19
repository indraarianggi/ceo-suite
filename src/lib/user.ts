import { z } from "zod";

import type { SessionUser } from "../types/user.ts";

/** "Jane Doe" -> "JD". First and last word only; "?" when there is no name. */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words.at(0);
  const last = words.at(-1);
  if (!first || !last) return "?";
  const initial = (word: string) => Array.from(word)[0] ?? "";
  const letters =
    words.length > 1 ? initial(first) + initial(last) : initial(first);
  return letters.toUpperCase();
}

/**
 * Best-effort display name for accounts that only have an email, e.g.
 * "jane.doe@x.com" -> "Jane Doe". A real backend returns the profile name.
 */
export function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

const sessionSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
});

/** Cookie-safe string (no spaces, quotes, commas or semicolons). */
export function encodeSession(user: SessionUser): string {
  return encodeURIComponent(JSON.stringify(user));
}

/** Inverse of encodeSession. Returns null for anything missing, malformed or tampered into the wrong shape. */
export function decodeSession(value: string | undefined): SessionUser | null {
  if (!value) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    try {
      parsed = JSON.parse(decodeURIComponent(value));
    } catch {
      return null;
    }
  }
  const result = sessionSchema.safeParse(parsed);
  return result.success ? result.data : null;
}
