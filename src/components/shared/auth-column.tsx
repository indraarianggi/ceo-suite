import { cn } from "cn";

type AuthColumnProps = {
  width?: "default" | "wide";
  centered?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function AuthColumn({
  width = "default",
  centered = false,
  className,
  children,
}: AuthColumnProps) {
  const column = (
    <div
      className={cn(
        "flex w-full flex-col gap-10",
        width === "wide" ? "max-w-auth-wide" : "max-w-auth",
        className,
      )}
    >
      {children}
    </div>
  );

  if (!centered) return column;

  return (
    <div className="my-auto flex w-full justify-center md:pb-34">{column}</div>
  );
}
