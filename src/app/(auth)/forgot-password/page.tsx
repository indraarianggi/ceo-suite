import type { Metadata } from "next";

import { ForgotPasswordFlow } from "@/components/sections/auth/forgot-password-flow";
import { ResetOnHide } from "@/components/shared/reset-on-hide";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Reset your CEO SUITE password with a one-time code sent to your email.",
  alternates: { canonical: "/forgot-password" },
};

export default function ForgotPasswordPage() {
  return (
    <ResetOnHide>
      <ForgotPasswordFlow />
    </ResetOnHide>
  );
}
