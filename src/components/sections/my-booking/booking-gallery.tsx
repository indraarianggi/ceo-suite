"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { SpaceImage } from "@/types/space";

export function BookingGallery({ images }: { images: SpaceImage[] }) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  if (count === 0) return null;
  const current = images[index];
  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Space photos"
      className="relative h-56 md:h-72 xl:h-89"
    >
      <Image
        key={current.src}
        src={current.src}
        alt={current.alt}
        fill
        priority={index === 0}
        sizes="(min-width: 1280px) 920px, 100vw"
        className="object-cover"
      />
      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => go(-1)}
            className={cn(
              "absolute top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white text-grey-800 shadow-sm transition-colors outline-none hover:bg-grey-50 focus-visible:ring-3 focus-visible:ring-ring/50 print:hidden",
              "left-4",
            )}
          >
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => go(1)}
            className={cn(
              "absolute top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white text-grey-800 shadow-sm transition-colors outline-none hover:bg-grey-50 focus-visible:ring-3 focus-visible:ring-ring/50 print:hidden",
              "right-4",
            )}
          >
            <ChevronRight aria-hidden className="size-5" />
          </button>
          <div
            aria-hidden
            className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 print:hidden"
          >
            {images.map((image, i) => (
              <span
                key={image.src}
                className={cn(
                  "size-2 rounded-full bg-white/50",
                  i === index && "bg-white",
                )}
              />
            ))}
          </div>
        </>
      )}
      <p aria-live="polite" className="sr-only">
        Photo {index + 1} of {count}
      </p>
    </div>
  );
}
