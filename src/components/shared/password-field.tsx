"use client";

import { cn } from "cn";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { AuthInput } from "@/components/shared/auth-input";
import { Button } from "@/components/ui/button";

type PasswordFieldProps = Omit<
  React.ComponentProps<typeof AuthInput>,
  "type" | "size"
> & {
  size?: "default" | "lg";
};

export function PasswordField({
  size = "default",
  className,
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <div className="relative">
      <AuthInput
        {...props}
        type={visible ? "text" : "password"}
        className={cn("pr-12", size === "lg" && "h-14", className)}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        onClick={() => setVisible((v) => !v)}
        className="absolute top-1/2 right-2 -translate-y-1/2 text-grey-600"
      >
        <Icon className={size === "lg" ? "size-6" : "size-4"} />
      </Button>
    </div>
  );
}
