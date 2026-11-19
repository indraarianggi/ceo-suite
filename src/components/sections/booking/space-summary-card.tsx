import Image from "next/image";

import { BookingMeta } from "@/components/sections/booking/booking-meta";
import { SpaceTypeChip } from "@/components/shared/space-type-chip";
import type { BookingSelection, BookingSpace } from "@/types/booking";

type SpaceSummaryCardProps = {
  space: BookingSpace;
  selection: BookingSelection;
};

export function SpaceSummaryCard({ space, selection }: SpaceSummaryCardProps) {
  return (
    <section
      aria-label="Space and schedule"
      className="flex flex-col gap-6 rounded-lg bg-white p-4 shadow-sm md:flex-row md:p-6"
    >
      <Image
        src={space.image.src}
        alt={space.image.alt}
        width={182}
        height={146}
        sizes="(min-width: 768px) 182px, 100vw"
        className="aspect-video w-full rounded-xs object-cover md:aspect-auto md:h-36.5 md:w-45.5 md:shrink-0"
      />
      <div className="flex min-w-0 flex-col justify-between gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-heading-20-medium text-grey-900">{space.name}</h2>
          <SpaceTypeChip
            type={space.type}
            label={space.categoryLabel}
            className="px-3 py-3"
          />
        </div>
        <BookingMeta capacity={space.capacity} selection={selection} />
      </div>
    </section>
  );
}
