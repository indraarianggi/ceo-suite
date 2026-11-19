import { cn } from "cn";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type AuthButtonProps = Omit<React.ComponentProps<typeof Button>, "size"> & {
  loading?: boolean;
  shape?: "compact" | "block";
};

export function AuthButton({
  loading = false,
  shape = "block",
  disabled,
  className,
  children,
  ...props
}: AuthButtonProps) {
  return (
    <Button
      size="md"
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "h-10.75 w-full",
        shape === "compact" ? "rounded-xl sm:w-77" : "rounded-lg",
        "disabled:bg-grey-100 disabled:text-grey-200 disabled:opacity-100",
        loading && "disabled:bg-primary disabled:text-primary-foreground",
        className,
      )}
    >
      {loading && (
        <LoaderCircle
          aria-hidden
          className="size-4 animate-spin motion-reduce:animate-none"
        />
      )}
      {children}
    </Button>
  );
}
