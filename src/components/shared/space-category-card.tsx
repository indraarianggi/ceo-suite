import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SpaceTypeIcon } from "@/components/shared/space-type-chip";
import type { SpaceCategory } from "@/types/space";

export function SpaceCategoryCard({ category }: { category: SpaceCategory }) {
  return (
    <article className="group relative flex flex-col gap-6">
      <div className="relative aspect-370/363 overflow-hidden">
        <Image
          src={category.image.src}
          alt={category.image.alt}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
        />
        <span className="absolute bottom-0 left-0 flex h-18 w-19 items-center justify-center bg-product-700 text-white transition-colors group-hover:bg-product-800">
          <ChevronRightIcon aria-hidden className="size-6" />
        </span>
      </div>
      <h3 className="flex items-center gap-3 text-heading-20-bold text-grey-900">
        <SpaceTypeIcon type={category.type} className="size-6 shrink-0" />
        <Link
          href={category.href}
          className="rounded-sm outline-none after:absolute after:inset-0 focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
        >
          {category.label}
        </Link>
      </h3>
    </article>
  );
}
