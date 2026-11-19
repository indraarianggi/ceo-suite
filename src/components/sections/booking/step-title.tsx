"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type StepTitleProps = {
  title: string;
  back: { href: string } | { onClick: () => void };
  focusOnMount?: boolean;
};

export function StepTitle({ title, back, focusOnMount }: StepTitleProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (focusOnMount) ref.current?.focus();
  }, [focusOnMount]);

  return (
    <div className="flex items-center gap-4 xl:gap-6">
      {"href" in back ? (
        <Link
          href={back.href}
          aria-label="Back"
          className="grid size-8 shrink-0 place-items-center rounded-full text-grey-800 transition-colors outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ArrowLeft aria-hidden className="size-8" strokeWidth={1.5} />
        </Link>
      ) : (
        <button
          type="button"
          aria-label="Back"
          onClick={back.onClick}
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-full text-grey-800 transition-colors outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50",
            "cursor-pointer",
          )}
        >
          <ArrowLeft aria-hidden className="size-8" strokeWidth={1.5} />
        </button>
      )}
      <h1
        ref={ref}
        tabIndex={-1}
        className="text-heading-20-bold text-grey-800 outline-none xl:text-heading-25-bold"
      >
        {title}
      </h1>
    </div>
  );
}
