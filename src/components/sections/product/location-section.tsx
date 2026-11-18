import Image from "next/image";

import type { SpaceLocation } from "@/types/space";

type LocationSectionProps = { location: SpaceLocation };

export function LocationSection({ location }: LocationSectionProps) {
  const { pin } = location;

  return (
    <section
      aria-labelledby="location-heading"
      className="flex flex-col gap-6 py-2"
    >
      <h2 id="location-heading" className="text-heading-25-bold text-grey-950">
        Location
      </h2>

      <a
        href={location.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${location.name} in Google Maps (opens in a new tab)`}
        className="relative block h-56 overflow-hidden rounded-xl bg-product-50 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:h-80 xl:h-108"
      >
        <Image
          src={location.map.src}
          alt={location.map.alt}
          fill
          sizes="(min-width: 1280px) 1600px, 100vw"
          className="object-cover"
          // Keep the pin's image column inside the frame when the crop is narrower than the image.
          style={{ objectPosition: `${pin.x}% 50%` }}
        />
        <Image
          src="/images/icons/product/map-pin.svg"
          alt=""
          width={72}
          height={72}
          className="absolute size-12 -translate-x-1/2 xl:size-18"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
        />
      </a>

      <div className="flex flex-col gap-4">
        <p className="text-heading-20-bold text-grey-600">{location.name}</p>
        <p className="text-body-16-medium text-grey-400">{location.address}</p>
      </div>
    </section>
  );
}
