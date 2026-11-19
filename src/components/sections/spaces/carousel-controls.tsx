"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type CarouselControlsProps = {
  targetId: string;
};

const buttonClass =
  "grid h-16.75 w-24 place-items-center rounded-sm text-grey-50 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed";

export function CarouselControls({ targetId }: CarouselControlsProps) {
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    const list = document.getElementById(targetId);
    if (!list) return;

    const update = () => {
      setCanPrev(list.scrollLeft > 1);
      setCanNext(list.scrollLeft + list.clientWidth < list.scrollWidth - 1);
    };
    update();
    list.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      list.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetId]);

  function scrollByPage(direction: 1 | -1) {
    const list = document.getElementById(targetId);
    if (!list) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // One card plus its gap; the first visible card is one step.
    const card = list.querySelector("li");
    const step = (card?.getBoundingClientRect().width ?? list.clientWidth) + 40;
    list.scrollBy({
      left: direction * step,
      behavior: reduce ? "auto" : "smooth",
    });
  }

  return (
    <div className="flex gap-4">
      <button
        type="button"
        aria-label="Previous spaces"
        disabled={!canPrev}
        onClick={() => scrollByPage(-1)}
        className={cn(buttonClass, canPrev ? "bg-product-700" : "bg-grey-300")}
      >
        <ArrowLeft aria-hidden className="size-8" strokeWidth={2.5} />
      </button>
      <button
        type="button"
        aria-label="Next spaces"
        disabled={!canNext}
        onClick={() => scrollByPage(1)}
        className={cn(buttonClass, canNext ? "bg-product-700" : "bg-grey-300")}
      >
        <ArrowRight aria-hidden className="size-8" strokeWidth={2.5} />
      </button>
    </div>
  );
}
