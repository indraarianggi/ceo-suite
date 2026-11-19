"use client";

import { useState } from "react";

import { CodeVerificationForm } from "@/components/sections/auth/code-verification-form";
import { ForgotEmailForm } from "@/components/sections/auth/forgot-email-form";
import { ResetPasswordForm } from "@/components/sections/auth/reset-password-form";
import { ResetSuccessDialog } from "@/components/sections/auth/reset-success-dialog";
import { AuthColumn } from "@/components/shared/auth-column";
import { AuthHeading } from "@/components/shared/auth-heading";
import { resendCode, verifyCode } from "@/lib/auth";

type Step = "email" | "otp" | "reset";

const OTP_COPY =
  "Please enter the One-Time Password (OTP) sent to your email to complete the verification process.";

/**
 * Email → OTP → Reset your Password → success dialog → /login.
 * One route, in-memory steps; the email and code never touch the URL.
 */
export function ForgotPasswordFlow() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  if (step === "otp") {
    return (
      <AuthColumn centered>
        <AuthHeading
          title="OTP Verification"
          description={OTP_COPY}
          descriptionId="otp-description"
        />
        <CodeVerificationForm
          describedBy="otp-description"
          verify={(value) => verifyCode({ email, code: value })}
          resend={() => resendCode({ email })}
          onVerified={(value) => {
            setCode(value);
            setStep("reset");
          }}
        />
      </AuthColumn>
    );
  }

  if (step === "reset") {
    return (
      <AuthColumn centered width="wide">
        <AuthHeading
          focusOnMount
          title="Reset your Password"
          description={OTP_COPY}
        />
        <ResetPasswordForm
          email={email}
          code={code}
          onSuccess={() => setSuccessOpen(true)}
        />
        <ResetSuccessDialog open={successOpen} />
      </AuthColumn>
    );
  }

  return (
    <AuthColumn centered>
      <AuthHeading
        title="Forget Password"
        description="Forgot your password? Enter your email address below to reset it and regain access to your account."
      />
      <ForgotEmailForm
        onSuccess={(value) => {
          setEmail(value);
          setStep("otp");
        }}
      />
    </AuthColumn>
  );
}
