import { cn } from "cn";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";

type AuthFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  labelClassName?: string;
  className?: string;
  children: React.ReactNode;
};

export function AuthField({
  id,
  label,
  required = false,
  error,
  labelClassName,
  className,
  children,
}: AuthFieldProps) {
  return (
    <Field data-invalid={!!error} className={cn("gap-3", className)}>
      <FieldLabel
        htmlFor={id}
        className={cn("text-body-16-regular text-grey-800", labelClassName)}
      >
        <span>
          {label}
          {required && (
            <span aria-hidden className="ml-0.5 text-required">
              *
            </span>
          )}
        </span>
      </FieldLabel>
      {children}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </Field>
  );
}
