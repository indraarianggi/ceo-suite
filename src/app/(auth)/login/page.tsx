import type { Metadata } from "next";

import { LoginForm } from "@/components/sections/auth/login-form";
import { AuthColumn } from "@/components/shared/auth-column";
import { AuthHeading } from "@/components/shared/auth-heading";
import { ResetOnHide } from "@/components/shared/reset-on-hide";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your CEO SUITE account to book private offices, coworking spaces and meeting rooms.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <AuthColumn>
      <AuthHeading
        subtitleSize="sm"
        title="Book your Room Now!"
        description="Please logged in to flexible and easy access."
      />
      <ResetOnHide>
        <LoginForm />
      </ResetOnHide>
    </AuthColumn>
  );
}
