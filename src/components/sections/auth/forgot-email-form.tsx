"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

import { AuthButton } from "@/components/shared/auth-button";
import { AuthField } from "@/components/shared/auth-field";
import { AuthInput } from "@/components/shared/auth-input";
import { buttonVariants } from "@/components/ui/button";
import { authLinks } from "@/data/navigation";
import { requestPasswordReset } from "@/lib/auth";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/lib/validation";
import { cn } from "cn";

type ForgotEmailFormProps = {
  onSuccess: (email: string) => void;
};

export function ForgotEmailForm({ onSuccess }: ForgotEmailFormProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit({ email }: ForgotPasswordValues) {
    await requestPasswordReset({ email });
    onSuccess(email);
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8"
    >
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <AuthField
            id="forgot-email"
            label="Email"
            required
            error={fieldState.error?.message}
          >
            <AuthInput
              {...field}
              id="forgot-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-required
              aria-invalid={fieldState.invalid}
              aria-describedby={
                fieldState.invalid ? "forgot-email-error" : undefined
              }
            />
          </AuthField>
        )}
      />
      <div className="flex flex-col gap-4">
        <AuthButton type="submit" loading={isSubmitting || isSubmitSuccessful}>
          Reset Password
        </AuthButton>
        <Link
          href={authLinks.signIn.href}
          className={cn(
            buttonVariants({ variant: "ghost", size: "md" }),
            "h-10.75 w-full rounded-lg text-body-16-medium text-primary hover:bg-accent",
          )}
        >
          Back to Login
        </Link>
      </div>
    </form>
  );
}
