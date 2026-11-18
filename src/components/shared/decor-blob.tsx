import { cn } from "@/lib/utils";

export function DecorBlob({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full bg-linear-to-b from-product-100 to-product-300 opacity-60 blur-2xl",
        className,
      )}
    />
  );
}
