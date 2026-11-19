"use client";

import { cn } from "cn";
import { useState } from "react";

import { OTP_LENGTH, sanitizeOtp } from "@/lib/otp";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  readOnly?: boolean;
  id?: string;
  "aria-describedby"?: string;
  autoFocus?: boolean;
};

export function OtpInput({
  value,
  onChange,
  invalid,
  readOnly,
  autoFocus,
  ...rest
}: OtpInputProps) {
  const [focused, setFocused] = useState(false);
  const activeIndex = Math.min(value.length, OTP_LENGTH - 1);

  return (
    <div className="relative">
      <input
        {...rest}
        value={value}
        readOnly={readOnly}
        autoFocus={autoFocus}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={OTP_LENGTH}
        aria-label="Verification code"
        aria-invalid={invalid}
        onChange={(e) => onChange(sanitizeOtp(e.target.value))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        // Keep the caret at the end so clicking a box can't create gaps.
        onSelect={(e) =>
          e.currentTarget.setSelectionRange(value.length, value.length)
        }
        className="absolute inset-0 z-10 size-full cursor-text opacity-0"
      />
      <div aria-hidden className="grid grid-cols-6 gap-2">
        {Array.from({ length: OTP_LENGTH }, (_, i) => {
          const isActive = focused && i === activeIndex;
          return (
            <div
              key={i}
              className={cn(
                "flex h-14 items-center justify-center rounded-lg border border-grey-100 text-heading-20-bold text-grey-950 transition-colors xs:h-16 xs:text-heading-31-bold sm:h-20 md:h-25 md:text-heading-39-bold",
                isActive &&
                  "border-product-600 bg-white ring-6 ring-product-50",
                invalid && "border-destructive",
              )}
            >
              {value[i]}
            </div>
          );
        })}
      </div>
    </div>
  );
}
