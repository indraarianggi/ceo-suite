"use client";

import { useState } from "react";

import { AuthButton } from "@/components/shared/auth-button";
import { OtpInput } from "@/components/shared/otp-input";
import { ResendTimer } from "@/components/shared/resend-timer";
import { FieldError } from "@/components/ui/field";
import { AUTH_ERROR_MESSAGES, type AuthResult } from "@/lib/auth";
import { otpSchema } from "@/lib/validation";

type CodeVerificationFormProps = {
  verify: (code: string) => Promise<AuthResult>;
  resend: () => Promise<unknown>;
  onVerified: (code: string) => void;
  /** Id of the element describing where the code was sent (the step subtitle). */
  describedBy?: string;
};

/**
 * Six-digit code entry shared by Email Verification (Sign Up) and OTP
 * Verification (Forgot Password): code boxes, Verify button, resend countdown.
 */
export function CodeVerificationForm({
  verify,
  resend,
  onVerified,
  describedBy,
}: CodeVerificationFormProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const ready = otpSchema.safeParse({ code }).success;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || submitting) return;
    setSubmitting(true);
    setError(null);
    const result = await verify(code);
    if (!result.ok) {
      setError(AUTH_ERROR_MESSAGES[result.error]);
      setSubmitting(false);
      return;
    }
    // Stay in the busy state: the parent navigates or swaps the step.
    onVerified(code);
  }

  async function handleResend() {
    await resend();
    setCode("");
    setError(null);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <OtpInput
          autoFocus
          value={code}
          onChange={(next) => {
            setCode(next);
            if (error) setError(null);
          }}
          invalid={!!error}
          readOnly={submitting}
          aria-describedby={
            [describedBy, error ? "code-error" : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
        />
        {error && (
          <FieldError id="code-error" className="text-center">
            {error}
          </FieldError>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <AuthButton type="submit" disabled={!ready} loading={submitting}>
          Verify
        </AuthButton>
        <div className="pt-2.5">
          <ResendTimer onResend={handleResend} />
        </div>
      </div>
    </form>
  );
}
