"use client";

import { LayoutGrid } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SpaceImage } from "@/types/space";

// The lightbox is only needed after the first click, so keep it out of the initial bundle.
const GalleryLightbox = dynamic(() =>
  import("@/components/sections/product/gallery-lightbox").then(
    (module) => module.GalleryLightbox,
  ),
);

type GallerySectionProps = { images: SpaceImage[]; name: string };

const tileClass =
  "group relative block overflow-hidden rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

export function GallerySection({ images, name }: GallerySectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [lightboxRequested, setLightboxRequested] = useState(false);

  const [main, ...thumbs] = images;
  const visibleThumbs = thumbs.slice(0, 4);

  function openAt(index: number) {
    setLightboxRequested(true);
    setOpenIndex(index);
  }

  return (
    <section aria-label={`${name} photos`} className="py-8 xl:py-12">
      <div className="relative page-container">
        <div className="flex flex-col gap-4 xl:h-124.5 xl:flex-row xl:gap-6">
          <button
            type="button"
            onClick={() => openAt(0)}
            aria-label={`View photo 1 of ${images.length}: ${main.alt}`}
            className={cn(tileClass, "aspect-video xl:aspect-auto xl:flex-2")}
          >
            <Image
              src={main.src}
              alt=""
              fill
              priority
              sizes="(min-width: 1280px) 1051px, 100vw"
              className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-102 motion-reduce:transition-none"
            />
          </button>

          <ul className="hidden grid-cols-4 gap-4 md:grid xl:flex-1 xl:grid-cols-2 xl:grid-rows-2">
            {visibleThumbs.map((image, index) => (
              <li key={image.src} className="flex">
                <button
                  type="button"
                  onClick={() => openAt(index + 1)}
                  aria-label={`View photo ${index + 2} of ${images.length}: ${image.alt}`}
                  className={cn(
                    tileClass,
                    "aspect-square w-full xl:aspect-auto",
                  )}
                >
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 255px, 25vw"
                    className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105 motion-reduce:transition-none"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => openAt(0)}
          className="absolute right-6 bottom-4 text-grey-500 shadow-float xl:right-9"
        >
          <LayoutGrid aria-hidden />
          Show All Photos
        </Button>
      </div>

      {lightboxRequested && (
        <GalleryLightbox
          images={images}
          open={openIndex !== null}
          index={openIndex ?? 0}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
          title={`${name} photos`}
        />
      )}
    </section>
  );
}
