import { cn } from "cn";

import { Input } from "@/components/ui/input";

export function AuthInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        "h-12 rounded-lg border-input bg-white px-4 text-body-13-regular text-grey-900 placeholder:text-grey-400 md:text-body-13-regular",
        className,
      )}
      {...props}
    />
  );
}
