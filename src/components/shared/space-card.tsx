import Image from "next/image";
import Link from "next/link";

import { SpaceTypeChip } from "@/components/shared/space-type-chip";
import { formatPeople, formatPriceUnit, formatRupiah } from "@/lib/format";
import type { Space } from "@/types/space";

type SpaceCardProps = { space: Space; priority?: boolean };

export function SpaceCard({ space, priority = false }: SpaceCardProps) {
  const { price, secondaryPrice } = space;

  return (
    <article className="relative flex min-w-0 flex-col gap-4 rounded-lg bg-white p-4 shadow-card transition-shadow hover:shadow-sm xl:h-97">
      <div className="relative aspect-video overflow-hidden rounded-sm xl:aspect-auto xl:min-h-48 xl:flex-1">
        <Image
          src={space.image.src}
          alt={space.image.alt}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="text-heading-20-bold text-grey-900">
              <Link
                href={`/spaces/${space.slug}`}
                className="rounded-sm outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
              >
                {space.name}
              </Link>
            </h3>
            <SpaceTypeChip type={space.type} label={space.categoryLabel} />
          </div>
          <p className="flex shrink-0 items-center gap-1 text-body-16-regular text-grey-800">
            {formatPeople(space.capacity)}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <p className="text-body-13-bold text-product-800">
              {formatPriceUnit(price.unit)}
            </p>
            <div className="flex flex-col">
              {price.originalAmount && (
                <p className="text-body-10-medium text-grey-300 line-through">
                  {formatRupiah(price.originalAmount)}
                </p>
              )}
              <p className="text-heading-20-bold text-product-800">
                {formatRupiah(price.amount)}
              </p>
            </div>
          </div>
          <p className="flex gap-1 text-body-13-regular text-grey-400">
            {formatPriceUnit(secondaryPrice.unit)}
            <span className="text-body-13-medium text-grey-800">
              {formatRupiah(secondaryPrice.amount)}
            </span>
          </p>
        </div>
      </div>
    </article>
  );
}
