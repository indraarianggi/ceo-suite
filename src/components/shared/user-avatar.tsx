import { cn } from "cn";

import { getInitials } from "@/lib/user";

type UserAvatarProps = {
  name: string;
  className?: string;
};

export function UserAvatar({ name, className }: UserAvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full bg-avatar text-body-16-medium text-white select-none",
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
