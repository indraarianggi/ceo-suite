"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

import { AuthButton } from "@/components/shared/auth-button";
import { AuthField } from "@/components/shared/auth-field";
import { AuthInput } from "@/components/shared/auth-input";
import { PasswordField } from "@/components/shared/password-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { authLinks } from "@/data/navigation";
import { loginAction } from "@/lib/auth-actions";
import { loginSchema, type LoginValues } from "@/lib/validation";

export function LoginForm() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  async function onSubmit(values: LoginValues) {
    // On success the action redirects home, so this promise never resolves and
    // the button stays in its loading state until the navigation lands.
    const result = await loginAction(values);
    if (result?.error) setError("root", { message: result.error });
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-16"
    >
      <div className="flex flex-col gap-8">
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <AuthField
              id="login-email"
              label="Email"
              required
              error={fieldState.error?.message}
            >
              <AuthInput
                {...field}
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-required
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.invalid ? "login-email-error" : undefined
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
                id="login-password"
                label="Password"
                required
                error={fieldState.error?.message}
              >
                <PasswordField
                  {...field}
                  id="login-password"
                  autoComplete="current-password"
                  aria-required
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? "login-password-error" : undefined
                  }
                />
              </AuthField>
            )}
          />

          <div className="flex items-center justify-between gap-4">
            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <Field orientation="horizontal" className="w-auto gap-2">
                  <Checkbox
                    id="login-remember"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                  <FieldLabel
                    htmlFor="login-remember"
                    className="text-body-16-regular text-grey-800"
                  >
                    Remember me
                  </FieldLabel>
                </Field>
              )}
            />
            <Link
              href={authLinks.forgotPassword.href}
              className="rounded-sm text-body-16-medium text-product-700 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {authLinks.forgotPassword.label}
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {errors.root && (
          <FieldError id="login-form-error" className="text-center">
            {errors.root.message}
          </FieldError>
        )}
        <AuthButton type="submit" shape="compact" loading={isSubmitting}>
          Sign In
        </AuthButton>
        <p className="text-body-16-regular text-grey-800">
          Don’t have an account?{" "}
          <Link
            href={authLinks.signUp.href}
            className="rounded-sm text-body-16-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Sign Up Here
          </Link>
        </p>
      </div>
    </form>
  );
}
