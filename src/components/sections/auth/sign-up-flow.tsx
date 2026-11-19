"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { CodeVerificationForm } from "@/components/sections/auth/code-verification-form";
import { IdentityDialog } from "@/components/sections/auth/identity-dialog";
import { SignUpForm } from "@/components/sections/auth/sign-up-form";
import { AuthColumn } from "@/components/shared/auth-column";
import { AuthHeading } from "@/components/shared/auth-heading";
import { authLinks } from "@/data/navigation";
import { resendCode, verifyCode } from "@/lib/auth";

type Step = "form" | "verify";

/**
 * Sign Up → "Complete your identity" dialog → Email Verification → /login.
 * One route, in-memory steps, so the email never lands in the URL.
 */
export function SignUpFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [identityOpen, setIdentityOpen] = useState(false);

  if (step === "verify") {
    return (
      <AuthColumn centered>
        <AuthHeading
          title="Email Verification"
          description={`We have sent a verification code to ${email}`}
          descriptionId="verify-description"
        />
        <CodeVerificationForm
          describedBy="verify-description"
          verify={(code) => verifyCode({ email, code })}
          resend={() => resendCode({ email })}
          onVerified={() => router.push(authLinks.signIn.href)}
        />
      </AuthColumn>
    );
  }

  return (
    <AuthColumn>
      <AuthHeading
        subtitleSize="sm"
        title="Book your Room Now!"
        description="Please logged in to flexible and easy access."
      />
      <SignUpForm
        onSuccess={(values) => {
          setEmail(values.email);
          setIdentityOpen(true);
        }}
      />
      <IdentityDialog
        open={identityOpen}
        email={email}
        onDone={() => {
          setIdentityOpen(false);
          setStep("verify");
        }}
      />
    </AuthColumn>
  );
}
