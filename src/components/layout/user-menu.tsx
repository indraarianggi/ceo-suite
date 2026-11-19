"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { useTransition } from "react";

import { UserAvatar } from "@/components/shared/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/lib/auth-actions";
import type { SessionUser } from "@/types/user";

type UserMenuProps = {
  user: SessionUser;
};

/**
 * Logged-in header account control (avatar, name, chevron)
 */
export function UserMenu({ user }: UserMenuProps) {
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group/trigger flex items-center gap-4 rounded-sm text-heading-20-medium text-grey-600 transition-colors outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:text-primary">
        <span className="flex items-center gap-3">
          <UserAvatar name={user.name} />
          <span className="max-w-48 truncate">{user.name}</span>
        </span>
        <ChevronDown
          aria-hidden
          className="size-6 shrink-0 transition-transform group-data-popup-open/trigger:rotate-180 motion-reduce:transition-none"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="w-64 rounded-lg p-2 shadow-popover"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-1 px-3 py-2.5">
            <span className="truncate text-body-16-bold text-grey-800">
              {user.name}
            </span>
            <span className="truncate text-body-13-regular text-grey-500">
              {user.email}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              await logoutAction();
            });
          }}
          className="gap-3 rounded-lg px-3 py-2.5 text-body-16-medium text-product-800 data-highlighted:bg-accent data-highlighted:text-product-800"
        >
          <LogOut aria-hidden className="size-5" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
