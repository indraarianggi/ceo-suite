import { LogOut } from "lucide-react";

import { MobileNavLink } from "@/components/layout/mobile-nav";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { authLinks } from "@/data/navigation";
import { logoutAction } from "@/lib/auth-actions";
import { getSession } from "@/lib/session";
import { cn } from "@/lib/utils";

/**
 * Bottom of the mobile menu sheet (designed in code; Figma has no mobile frames):
 * Sign In / Sign Up for visitors, or the user's name and a Logout button.
 * Rendered inside <Suspense> as a child of <MobileNav>.
 */
export async function MobileAccount() {
  const user = await getSession();

  if (!user) {
    return (
      <>
        <MobileNavLink
          href={authLinks.signIn.href}
          className={cn(
            buttonVariants({ variant: "outline", size: "xl" }),
            "text-primary",
          )}
        >
          {authLinks.signIn.label}
        </MobileNavLink>
        <MobileNavLink
          href={authLinks.signUp.href}
          className={cn(buttonVariants({ size: "xl" }))}
        >
          {authLinks.signUp.label}
        </MobileNavLink>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3 px-2">
        <UserAvatar name={user.name} className="size-10" />
        <div className="flex min-w-0 flex-col gap-1">
          <p className="truncate text-heading-20-medium text-grey-800">
            {user.name}
          </p>
          <p className="truncate text-body-13-regular text-grey-500">
            {user.email}
          </p>
        </div>
      </div>
      {/* SheetClose closes the menu while the click still submits the form. */}
      <form action={logoutAction}>
        <SheetClose
          render={
            <Button
              type="submit"
              variant="outline"
              size="xl"
              className="w-full gap-3 text-primary"
            />
          }
        >
          <LogOut aria-hidden />
          Logout
        </SheetClose>
      </form>
    </>
  );
}

export function MobileAccountFallback() {
  return (
    <>
      <div aria-hidden className="h-12" />
      <div aria-hidden className="h-12" />
    </>
  );
}
