import Link from "next/link";

import { UserMenu } from "@/components/layout/user-menu";
import { buttonVariants } from "@/components/ui/button";
import { authLinks } from "@/data/navigation";
import { getSession } from "@/lib/session";
import { cn } from "@/lib/utils";

/**
 * Right-hand side of the desktop header: the user menu when signed in, otherwise
 * Sign In / Sign Up. Reads the session cookie, so render it inside <Suspense>;
 * the rest of the header stays in the static shell.
 */
export async function HeaderAccount() {
  const user = await getSession();
  if (user) return <UserMenu user={user} />;

  return (
    <div className="flex items-center gap-3">
      <Link
        href={authLinks.signIn.href}
        className={cn(
          buttonVariants({ variant: "ghost", size: "xl" }),
          "px-4 text-primary",
        )}
      >
        {authLinks.signIn.label}
      </Link>
      <Link
        href={authLinks.signUp.href}
        className={cn(buttonVariants({ size: "xl" }))}
      >
        {authLinks.signUp.label}
      </Link>
    </div>
  );
}

/**
 * Suspense fallback: reserves the Sign In / Sign Up footprint (278 x 48) so the
 * nav doesn't jump for signed-out visitors, who are the common case.
 */
export function HeaderAccountFallback() {
  return <div aria-hidden className="h-12 w-69.5" />;
}
