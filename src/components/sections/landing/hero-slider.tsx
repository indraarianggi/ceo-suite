"use client";

import { useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import type { HeroSlide } from "@/data/hero";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6000;

type HeroSliderProps = {
  slides: HeroSlide[];
  className?: string;
};

export function HeroSlider({ slides, className }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const autoplay = !paused && !reducedMotion && slides.length > 1;

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      AUTOPLAY_MS,
    );
    return () => window.clearInterval(id);
  }, [autoplay, slides.length]);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Featured workspaces"
      className={cn(
        "relative aspect-2/1 overflow-hidden bg-grey-100 shadow-sm",
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div aria-live={autoplay ? "off" : "polite"}>
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none",
              i === index ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              fetchPriority={i === 0 ? "high" : "low"}
              sizes="(min-width: 1280px) 75vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1 xl:bottom-10">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className="group flex h-4 items-center rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span
                className={cn(
                  "block h-1 transition-all duration-300 motion-reduce:transition-none",
                  i === index
                    ? "w-10 bg-product-500"
                    : "w-4 bg-white group-hover:bg-product-200",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
