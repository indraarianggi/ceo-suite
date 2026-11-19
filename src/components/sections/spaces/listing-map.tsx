import { DoorOpen } from "lucide-react";
import Image from "next/image";

import { listingMap } from "@/data/listing-map";
import type { Space } from "@/types/space";

type ListingMapProps = {
  spaces: Space[];
  priority?: boolean;
};

export function ListingMap({ spaces, priority = false }: ListingMapProps) {
  return (
    <section
      aria-label="Map of results"
      className="mx-auto w-full max-w-md xl:max-w-none"
    >
      <div className="relative overflow-hidden border border-grey-100">
        <Image
          src={listingMap.src}
          alt={listingMap.alt}
          width={listingMap.width}
          height={listingMap.height}
          priority={priority}
          sizes="(min-width: 1280px) 35vw, (min-width: 448px) 448px, 100vw"
          className="h-auto w-full"
        />
        <ul className="absolute inset-0">
          {spaces.map((space) => (
            <li
              key={space.id}
              className="absolute -translate-1/2"
              style={{
                left: `${space.pin.x}%`,
                top: `${space.pin.y}%`,
                width: "7%",
              }}
            >
              <a
                href={`#space-${space.id}`}
                aria-label={`${space.name}, ${space.region}`}
                className="grid aspect-square place-items-center rounded-full bg-map-pin text-white shadow-sm ring-2 ring-white outline-none focus-visible:ring-4 focus-visible:ring-ring"
              >
                <DoorOpen aria-hidden className="size-1/2" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
