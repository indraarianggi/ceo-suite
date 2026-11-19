"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { createContext, useContext, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mainNav, type NavItem } from "@/data/navigation";
import { cn } from "@/lib/utils";

const CloseMenuContext = createContext<() => void>(() => {});

export function MobileNavLink({
  onClick,
  ...props
}: React.ComponentProps<typeof Link>) {
  const closeMenu = useContext(CloseMenuContext);
  return (
    <Link
      {...props}
      onClick={(event) => {
        onClick?.(event);
        closeMenu();
      }}
    />
  );
}

type MobileNavProps = {
  children: React.ReactNode;
  items?: NavItem[];
  activeHref?: string;
};

export function MobileNav({
  children,
  items = mainNav,
  activeHref,
}: MobileNavProps) {
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
        <CloseMenuContext value={() => setOpen(false)}>
          <SheetHeader>
            <SheetTitle className="text-heading-20-bold text-grey-950">
              Menu
            </SheetTitle>
          </SheetHeader>
          <nav aria-label="Mobile" className="flex flex-col px-4">
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.href}>
                  <MobileNavLink
                    href={item.href}
                    aria-current={item.href === activeHref ? "page" : undefined}
                    className={cn(
                      "block rounded-lg px-2 py-3 text-heading-20-medium text-grey-600 transition-colors hover:bg-accent hover:text-primary",
                      item.href === activeHref &&
                        "text-heading-20-bold text-primary",
                    )}
                  >
                    {item.label}
                  </MobileNavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto flex flex-col gap-3 p-4">{children}</div>
        </CloseMenuContext>
      </SheetContent>
    </Sheet>
  );
}
