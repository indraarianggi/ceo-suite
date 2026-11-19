"use client";

import { Fragment, useLayoutEffect, useState } from "react";

/**
 * Resets everything inside it when the user navigates away.
 *
 * With Cache Components, Next.js keeps a visited route alive (hidden with
 * `<Activity>`) instead of unmounting it, so a login form would reappear with
 * the typed email, the password and any old error. Activity runs layout-effect
 * cleanups when it hides a route, so we bump a `key` there: the subtree is
 * remounted fresh while hidden and the user returns to a clean page.
 *
 * Use it on pages where stale state is wrong: credentials, one-time codes, and
 * multi-step flows that should restart. See
 * node_modules/next/dist/docs/01-app/02-guides/preserving-ui-state.md.
 */
export function ResetOnHide({ children }: { children: React.ReactNode }) {
  const [epoch, setEpoch] = useState(0);

  useLayoutEffect(() => {
    return () => setEpoch((e) => e + 1);
  }, []);

  return <Fragment key={epoch}>{children}</Fragment>;
}
