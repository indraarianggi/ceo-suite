"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authLinks, mainNav } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-lg" }),
          "xl:hidden",
        )}
        aria-label="Open menu"
      >
        <MenuIcon className="size-6" aria-hidden />
      </SheetTrigger>
      <SheetContent side="right" className="gap-0">
        <SheetHeader>
          <SheetTitle className="text-heading-20-bold text-grey-950">
            Menu
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col px-4">
          <ul className="flex flex-col">
            {mainNav.map((item) => (
              <li key={item.href}>
                <SheetClose
                  nativeButton={false}
                  render={
                    <Link
                      href={item.href}
                      className="block rounded-lg px-2 py-3 text-heading-20-medium text-grey-600 transition-colors hover:bg-accent hover:text-primary"
                    />
                  }
                >
                  {item.label}
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto flex flex-col gap-3 p-4">
          <Link
            href={authLinks.signIn.href}
            onClick={() => setOpen(false)}
            className={cn(
              buttonVariants({ variant: "outline", size: "xl" }),
              "text-primary",
            )}
          >
            {authLinks.signIn.label}
          </Link>
          <Link
            href={authLinks.signUp.href}
            onClick={() => setOpen(false)}
            className={cn(buttonVariants({ size: "xl" }))}
          >
            {authLinks.signUp.label}
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
