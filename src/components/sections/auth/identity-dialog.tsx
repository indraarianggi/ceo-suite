"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { AuthButton } from "@/components/shared/auth-button";
import { AuthField } from "@/components/shared/auth-field";
import { AuthInput } from "@/components/shared/auth-input";
import { DateOfBirthPicker } from "@/components/shared/date-of-birth-picker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { saveIdentity } from "@/lib/auth";
import { identitySchema, type IdentityValues } from "@/lib/validation";

type IdentityDialogProps = {
  open: boolean;
  email: string;
  /** Called after Save, Skip for Now or Esc: all three continue to verification. */
  onDone: () => void;
};

const labelClass = "text-body-13-bold text-grey-800";
const inputClass = "px-3 text-grey-800";

export function IdentityDialog({ open, email, onDone }: IdentityDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<IdentityValues>({
    resolver: zodResolver(identitySchema),
    mode: "onChange",
    defaultValues: { dateOfBirth: "", companyName: "" },
  });

  async function onSubmit(values: IdentityValues) {
    await saveIdentity({ email, ...values });
    onDone();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onDone();
      }}
      disablePointerDismissal
    >
      <DialogContent
        showCloseButton={false}
        className="w-[min(var(--container-auth-dialog),calc(100%-2rem))] max-w-none gap-8 rounded-lg bg-white p-6 ring-0 sm:p-12"
      >
        <div className="flex flex-col gap-3">
          <DialogTitle className="text-heading-20-bold text-grey-800">
            Complete your identity
          </DialogTitle>
          <DialogDescription className="text-body-13-regular text-grey-500">
            For better experience complete your identity start from now.
          </DialogDescription>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-5">
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field, fieldState }) => (
                <AuthField
                  id="identity-dob"
                  label="Date of Birth"
                  labelClassName={labelClass}
                  className="gap-2"
                  error={
                    fieldState.isTouched ? fieldState.error?.message : undefined
                  }
                >
                  <DateOfBirthPicker
                    id="identity-dob"
                    ref={field.ref}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="19/08/2002"
                    invalid={fieldState.isTouched && fieldState.invalid}
                    aria-describedby={
                      fieldState.isTouched && fieldState.invalid
                        ? "identity-dob-error"
                        : undefined
                    }
                  />
                </AuthField>
              )}
            />
            <Controller
              name="companyName"
              control={control}
              render={({ field, fieldState }) => (
                <AuthField
                  id="identity-company"
                  label="Company Name"
                  labelClassName={labelClass}
                  className="gap-2"
                  error={
                    fieldState.isTouched ? fieldState.error?.message : undefined
                  }
                >
                  <AuthInput
                    {...field}
                    id="identity-company"
                    autoComplete="organization"
                    placeholder="Enter your company name"
                    aria-invalid={fieldState.isTouched && fieldState.invalid}
                    aria-describedby={
                      fieldState.isTouched && fieldState.invalid
                        ? "identity-company-error"
                        : undefined
                    }
                    className={inputClass}
                  />
                </AuthField>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <AuthButton
              type="submit"
              disabled={!isValid}
              loading={isSubmitting}
            >
              Save my Data
            </AuthButton>
            <Button
              type="button"
              variant="ghost"
              onClick={onDone}
              disabled={isSubmitting}
              className="h-9 w-full rounded-lg text-body-13-medium text-primary hover:bg-accent"
            >
              Skip for Now
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
