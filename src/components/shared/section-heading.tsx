import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  id?: string;
  title: string;
  description?: string;
  descriptionWeight?: "medium" | "regular";
  gap?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function SectionHeading({
  id,
  title,
  description,
  descriptionWeight = "medium",
  gap = "md",
  icon,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col",
          gap === "sm" && "gap-2",
          gap === "md" && "gap-3",
          gap === "lg" && "gap-6",
        )}
      >
        <div className="flex items-center gap-4 md:gap-6">
          {icon}
          <h2
            id={id}
            className="text-heading-25-bold text-grey-800 md:text-heading-31-bold"
          >
            {title}
          </h2>
        </div>
        {description && (
          <p
            className={cn(
              "text-body-16-medium text-grey-400",
              descriptionWeight === "medium"
                ? "md:text-heading-20-medium"
                : "md:text-heading-20-regular",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
