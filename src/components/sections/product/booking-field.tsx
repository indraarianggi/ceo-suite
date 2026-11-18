import { cn } from "@/lib/utils";

type BookingFieldProps = {
  label: string;
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
};

export function BookingField({
  label,
  htmlFor,
  className,
  children,
}: BookingFieldProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <label
        id={`${htmlFor}-label`}
        htmlFor={htmlFor}
        className="text-heading-20-bold text-grey-50"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
