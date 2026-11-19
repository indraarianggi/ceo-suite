const FALLBACK = "/";
// A reserved host nobody can own: if resolving a value against it lands on a
// different origin, the value was trying to leave the site.
const ORIGIN = "http://return-to.invalid";

/**
 * Validates the `?next=` value after sign-in. Only same-origin paths survive;
 * `//host`, `/\host`, absolute URLs and `javascript:` all fall back to "/".
 * Resolving through `URL` (instead of string checks alone) catches the
 * browser-specific tricks: tabs/newlines are stripped and backslashes become
 * slashes before the origin is decided.
 */
export function sanitizeReturnTo(value: string | null | undefined): string {
  if (typeof value !== "string" || !value.startsWith("/")) return FALLBACK;
  let url: URL;
  try {
    url = new URL(value, ORIGIN);
  } catch {
    return FALLBACK;
  }
  if (url.origin !== ORIGIN) return FALLBACK;
  return `${url.pathname}${url.search}${url.hash}`;
}
