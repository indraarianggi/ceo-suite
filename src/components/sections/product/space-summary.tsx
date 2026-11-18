import Image from "next/image";

import { SpaceTypeChip } from "@/components/shared/space-type-chip";
import type { SpaceDetail, SpaceStatKind } from "@/types/space";

const statIcons: Record<SpaceStatKind, string> = {
  people: "/images/icons/product/stat-people.svg",
  seats: "/images/icons/product/stat-seats.svg",
  desks: "/images/icons/product/stat-desks.svg",
};

type SpaceSummaryProps = { space: SpaceDetail };

export function SpaceSummary({ space }: SpaceSummaryProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <h1 className="text-heading-25-bold text-grey-950 md:text-heading-31-bold">
            {space.name}
          </h1>
          <p className="flex items-center gap-0.5">
            <Image
              src="/images/icons/product/star.svg"
              alt=""
              width={32}
              height={32}
              className="size-8"
            />
            <span className="sr-only">Rated </span>
            <span className="text-body-16-bold text-grey-900">
              {space.rating}/5
            </span>
          </p>
        </div>
        <SpaceTypeChip
          type={space.type}
          label={space.categoryLabel}
          className="p-3"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-4">
        <p className="flex items-center gap-3 text-body-16-medium text-grey-500">
          <Image
            src="/images/icons/product/map-pin.svg"
            alt=""
            width={24}
            height={24}
            className="size-6"
          />
          {space.location.name}
        </p>
        <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-4xl px-6 py-3 outline-hairline outline-grey-100">
          {space.stats.map((stat) => (
            <li
              key={stat.kind}
              className="flex items-center gap-1 text-body-13-medium text-grey-500"
              aria-label={`${stat.count} ${stat.label}`}
            >
              <Image
                src={statIcons[stat.kind]}
                alt=""
                width={24}
                height={24}
                className="size-6"
              />
              {stat.count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
