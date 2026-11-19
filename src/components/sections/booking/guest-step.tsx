"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";

import { AuthButton } from "@/components/shared/auth-button";
import { AuthField } from "@/components/shared/auth-field";
import { AuthInput } from "@/components/shared/auth-input";
import type { GuestDetails } from "@/types/booking";
import {
  GUEST_DIAL_CODE,
  guestFormSchema,
  toInternationalPhone,
  type GuestFormValues,
} from "@/lib/validation";

type GuestStepProps = {
  defaultValues?: GuestFormValues;
  onSubmit: (guest: GuestDetails) => Promise<void>;
};

export function GuestStep({ defaultValues, onSubmit }: GuestStepProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<GuestFormValues>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: defaultValues ?? { name: "", email: "", phone: "" },
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) =>
        onSubmit({ ...values, phone: toInternationalPhone(values.phone) }),
      )}
      className="flex flex-col gap-8 xl:px-20"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-heading-25-bold text-grey-700">Book as Guest</h2>
        <p className="text-body-16-regular text-grey-400">
          Please enter your personal details to proceed with your booking.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <AuthField
              id="guest-name"
              label="Name"
              required
              error={fieldState.error?.message}
            >
              <AuthInput
                {...field}
                id="guest-name"
                autoComplete="name"
                placeholder="Your Full Name"
                aria-required
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.invalid ? "guest-name-error" : undefined
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
              id="guest-email"
              label="Email"
              required
              error={fieldState.error?.message}
            >
              <AuthInput
                {...field}
                id="guest-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-required
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.invalid ? "guest-email-error" : undefined
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
              id="guest-phone"
              label="Phone Number"
              required
              error={fieldState.error?.message}
            >
              <div
                data-invalid={fieldState.invalid || undefined}
                className="flex h-14 overflow-hidden rounded-lg border border-input bg-white focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 data-invalid:border-destructive"
              >
                <span className="flex shrink-0 items-center gap-3 bg-grey-50 px-4 text-body-13-regular text-grey-500">
                  <Image
                    src="/images/icons/flag-id.svg"
                    alt=""
                    width={21}
                    height={15}
                  />
                  <span className="sr-only">Indonesia country code </span>
                  {GUEST_DIAL_CODE}
                </span>
                <AuthInput
                  {...field}
                  id="guest-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="Enter Phone Number"
                  aria-required
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? "guest-phone-error" : undefined
                  }
                  className="h-full min-w-0 flex-1 rounded-none border-0 focus-visible:ring-0"
                />
              </div>
            </AuthField>
          )}
        />
      </div>

      <AuthButton
        type="submit"
        loading={isSubmitting}
        className="mx-auto max-w-128"
      >
        Continue
      </AuthButton>
    </form>
  );
}
