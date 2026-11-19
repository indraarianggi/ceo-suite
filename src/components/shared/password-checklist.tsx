import { cn } from "cn";
import { Check } from "lucide-react";

import type { PasswordCheck } from "@/lib/validation";

type PasswordChecklistProps = {
  checks: PasswordCheck[];
  className?: string;
};

export function PasswordChecklist({
  checks,
  className,
}: PasswordChecklistProps) {
  return (
    <ul
      aria-label="Password requirements"
      className={cn("flex flex-col gap-3", className)}
    >
      {checks.map((check) => (
        <li
          key={check.id}
          className="flex items-center gap-2 text-body-16-regular text-grey-600"
        >
          <span
            aria-hidden
            className={cn(
              "flex size-4 shrink-0 items-center justify-center rounded-full text-white transition-colors",
              check.met ? "bg-success-600" : "bg-grey-300",
            )}
          >
            <Check className="size-2.5" strokeWidth={3} />
          </span>
          <span>{check.label}</span>
          <span className="sr-only">{check.met ? "(met)" : "(not met)"}</span>
        </li>
      ))}
    </ul>
  );
}
