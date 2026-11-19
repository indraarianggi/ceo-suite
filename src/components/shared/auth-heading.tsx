"use client";

import { cn } from "cn";
import { useEffect, useRef } from "react";

type AuthHeadingProps = {
  title: string;
  description: React.ReactNode;
  descriptionId?: string;
  subtitleSize?: "sm" | "md";
  focusOnMount?: boolean;
};

export function AuthHeading({
  title,
  description,
  descriptionId,
  subtitleSize = "md",
  focusOnMount = false,
}: AuthHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (focusOnMount) ref.current?.focus();
  }, [focusOnMount]);

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <h1
        ref={ref}
        tabIndex={-1}
        className="text-heading-31-bold text-ink outline-none"
      >
        {title}
      </h1>
      <p
        id={descriptionId}
        className={cn(
          subtitleSize === "sm"
            ? "text-body-14-regular text-zinc-600"
            : "text-body-16-regular text-grey-600",
        )}
      >
        {description}
      </p>
    </div>
  );
}
