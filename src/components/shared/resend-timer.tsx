"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatCountdown, RESEND_SECONDS } from "@/lib/otp";
import { useCountdown } from "@/lib/use-countdown";

type ResendTimerProps = {
  onResend: () => Promise<unknown>;
};

export function ResendTimer({ onResend }: ResendTimerProps) {
  const { remaining, restart } = useCountdown(RESEND_SECONDS);
  const [pending, setPending] = useState(false);
  const finished = remaining === 0;

  async function handleResend() {
    setPending(true);
    try {
      await onResend();
      restart();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-1 text-body-16-regular text-grey-800">
      <p>{"Didn't receive the code?"}</p>
      <div className="flex min-h-6 items-center justify-center gap-3">
        {finished ? (
          <Button
            type="button"
            variant="link"
            onClick={handleResend}
            disabled={pending}
            aria-busy={pending || undefined}
            className="h-6 px-0 text-body-16-medium text-primary"
          >
            Resend Code
          </Button>
        ) : (
          <>
            <LoaderCircle
              aria-hidden
              className="size-6 animate-spin text-product-600 motion-reduce:animate-none"
            />
            <p>
              Resend new code in{" "}
              <span className="text-body-16-medium text-primary tabular-nums">
                {formatCountdown(remaining)}
              </span>
            </p>
          </>
        )}
      </div>
      <p role="status" className="sr-only">
        {finished ? "You can now request a new code." : ""}
      </p>
    </div>
  );
}
