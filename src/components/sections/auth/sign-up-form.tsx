"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm, useWatch } from "react-hook-form";

import { AuthButton } from "@/components/shared/auth-button";
import { AuthField } from "@/components/shared/auth-field";
import { AuthInput } from "@/components/shared/auth-input";
import { PasswordChecklist } from "@/components/shared/password-checklist";
import { PasswordField } from "@/components/shared/password-field";
import { authLinks } from "@/data/navigation";
import { AUTH_ERROR_MESSAGES, signUp } from "@/lib/auth";
import {
  getPasswordChecks,
  signUpSchema,
  type SignUpValues,
} from "@/lib/validation";

type SignUpFormProps = {
  onSuccess: (values: SignUpValues) => void;
};

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", phone: "", password: "" },
  });
  const password = useWatch({ control, name: "password" });

  async function onSubmit(values: SignUpValues) {
    const result = await signUp(values);
    if (!result.ok) {
      // Attach to the email field so it gets the error and the focus.
      setError(
        "email",
        { message: AUTH_ERROR_MESSAGES[result.error] },
        { shouldFocus: true },
      );
      return;
    }
    onSuccess(values);
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-16"
    >
      <div className="flex flex-col gap-8">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <AuthField
              id="sign-up-name"
              label="Name"
              required
              error={fieldState.error?.message}
            >
              <AuthInput
                {...field}
                id="sign-up-name"
                autoComplete="name"
                placeholder="your full name"
                aria-required
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.invalid ? "sign-up-name-error" : undefined
                }
              />
            </AuthField>
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <AuthField
              id="sign-up-email"
              label="Email"
              required
              error={fieldState.error?.message}
            >
              <AuthInput
                {...field}
                id="sign-up-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-required
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.invalid ? "sign-up-email-error" : undefined
                }
              />
            </AuthField>
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState }) => (
            <AuthField
              id="sign-up-phone"
              label="Phone Number"
              required
              error={fieldState.error?.message}
            >
              <AuthInput
                {...field}
                id="sign-up-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="Enter Phone Number"
                aria-required
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.invalid ? "sign-up-phone-error" : undefined
                }
              />
            </AuthField>
          )}
        />

        <div className="flex flex-col gap-3">
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <AuthField
                id="sign-up-password"
                label="Enter Password"
                required
                error={fieldState.error?.message}
              >
                <PasswordField
                  {...field}
                  id="sign-up-password"
                  autoComplete="new-password"
                  aria-required
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? "sign-up-password-error" : undefined
                  }
                />
              </AuthField>
            )}
          />
          <PasswordChecklist checks={getPasswordChecks(password)} />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <AuthButton
          type="submit"
          shape="compact"
          loading={isSubmitting || isSubmitSuccessful}
        >
          Sign Up
        </AuthButton>
        <p className="text-body-16-regular text-grey-800">
          Already have an account?{" "}
          <Link
            href={authLinks.signIn.href}
            className="rounded-sm text-body-16-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Sign In Here
          </Link>
        </p>
      </div>
    </form>
  );
}
