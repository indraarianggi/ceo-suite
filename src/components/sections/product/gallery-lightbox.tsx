"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import type { SpaceImage } from "@/types/space";

type GalleryLightboxProps = {
  images: SpaceImage[];
  open: boolean;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  title: string;
};

const controlClass =
  "inline-flex items-center justify-center rounded-full bg-white/10 text-white outline-none transition-colors hover:bg-white/20 focus-visible:ring-3 focus-visible:ring-white/70";

export function GalleryLightbox({
  images,
  open,
  index,
  onIndexChange,
  onClose,
  title,
}: GalleryLightboxProps) {
  const count = images.length;
  const current = images[index] ?? images[0];

  const go = (next: number) => onIndexChange((next + count) % count);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowLeft") go(index - 1);
    if (event.key === "ArrowRight") go(index + 1);
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-grey-1000/95 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
        <Dialog.Popup
          onKeyDown={handleKeyDown}
          className="fixed inset-0 z-50 flex flex-col gap-4 p-4 transition-opacity duration-200 outline-none data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none md:p-8"
        >
          <div className="flex items-center justify-between gap-4">
            <Dialog.Title className="text-body-16-medium text-white">
              {title}
              <span className="ml-3 text-grey-200" aria-live="polite">
                {index + 1} / {count}
              </span>
            </Dialog.Title>
            <Dialog.Close
              aria-label="Close gallery"
              className={cn(controlClass, "size-11")}
            >
              <X className="size-5" aria-hidden />
            </Dialog.Close>
          </div>

          <div className="relative min-h-0 flex-1">
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              fill
              sizes="100vw"
              className="animate-in object-contain duration-200 fade-in-0 motion-reduce:animate-none"
            />
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => go(index - 1)}
              className={cn(
                controlClass,
                "absolute top-1/2 left-0 size-12 -translate-y-1/2",
              )}
            >
              <ChevronLeft className="size-6" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => go(index + 1)}
              className={cn(
                controlClass,
                "absolute top-1/2 right-0 size-12 -translate-y-1/2",
              )}
            >
              <ChevronRight className="size-6" aria-hidden />
            </button>
          </div>

          <ul className="flex justify-center gap-2">
            {images.map((image, i) => (
              <li key={image.src}>
                <button
                  type="button"
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => onIndexChange(i)}
                  className={cn(
                    "relative block h-12 w-16 overflow-hidden rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-white/70",
                    i === index
                      ? "ring-2 ring-white"
                      : "opacity-60 hover:opacity-100",
                  )}
                >
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
