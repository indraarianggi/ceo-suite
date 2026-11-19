import type { Metadata } from "next";

import { SignUpFlow } from "@/components/sections/auth/sign-up-flow";
import { ResetOnHide } from "@/components/shared/reset-on-hide";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create your CEO SUITE account to book private offices, coworking spaces and meeting rooms.",
  alternates: { canonical: "/sign-up" },
};

export default function SignUpPage() {
  return (
    <ResetOnHide>
      <SignUpFlow />
    </ResetOnHide>
  );
}
