"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

import { AuthButton } from "@/components/shared/auth-button";
import { AuthField } from "@/components/shared/auth-field";
import { PasswordChecklist } from "@/components/shared/password-checklist";
import { PasswordField } from "@/components/shared/password-field";
import { resetPassword } from "@/lib/auth";
import {
  getPasswordChecks,
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/validation";

type ResetPasswordFormProps = {
  email: string;
  code: string;
  onSuccess: () => void;
};

export function ResetPasswordForm({
  email,
  code,
  onSuccess,
}: ResetPasswordFormProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const [password, confirmPassword] = useWatch({
    control,
    name: ["password", "confirmPassword"],
  });

  async function onSubmit(values: ResetPasswordValues) {
    await resetPassword({ email, code, password: values.password });
    onSuccess();
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8"
    >
      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <AuthField
            id="reset-password"
            label="New Password"
            required
            error={fieldState.error?.message}
          >
            <PasswordField
              {...field}
              id="reset-password"
              size="lg"
              autoComplete="new-password"
              placeholder="type your new password"
              aria-required
              aria-invalid={fieldState.invalid}
              aria-describedby={
                fieldState.invalid ? "reset-password-error" : undefined
              }
            />
          </AuthField>
        )}
      />

      <div className="flex flex-col gap-4">
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <AuthField
              id="reset-confirm"
              label="Retype new Password"
              required
              error={fieldState.error?.message}
            >
              <PasswordField
                {...field}
                id="reset-confirm"
                size="lg"
                autoComplete="new-password"
                placeholder="retype your new password"
                aria-required
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.invalid ? "reset-confirm-error" : undefined
                }
              />
            </AuthField>
          )}
        />
        <PasswordChecklist
          className="gap-4"
          checks={getPasswordChecks(password, confirmPassword)}
        />
      </div>

      <AuthButton type="submit" loading={isSubmitting}>
        Save
      </AuthButton>
    </form>
  );
}
