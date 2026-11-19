import { cn } from "@/lib/utils";

export const detailCard =
  "rounded-lg bg-white shadow-material print:shadow-none";

type DetailRowProps = {
  label: string;
  children: React.ReactNode;
  strong?: boolean;
  className?: string;
};

export function DetailRow({
  label,
  children,
  strong,
  className,
}: DetailRowProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <dt className="text-body-13-regular text-grey-400">{label}</dt>
      <dd
        className={cn(
          "text-right text-body-13-regular text-grey-800",
          strong && "text-body-13-bold",
        )}
      >
        {children}
      </dd>
    </div>
  );
}
