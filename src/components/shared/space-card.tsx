import Image from "next/image";
import Link from "next/link";

import { SpaceTypeChip } from "@/components/shared/space-type-chip";
import { formatPeople, formatPriceUnit, formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Space } from "@/types/space";

type SpaceCardVariant = "default" | "compact";

type SpaceCardProps = {
  space: Space;
  priority?: boolean;
  variant?: SpaceCardVariant;
  href?: string;
};

const variantStyles = {
  default: {
    root: "xl:h-97",
    title: "text-heading-20-bold text-grey-900",
    people: "text-body-16-regular text-grey-800",
    unit: "text-body-13-bold",
    amount: "text-heading-20-bold",
    original: "text-body-10-medium",
    secondaryLabel: "text-body-13-regular",
    secondaryAmount: "text-body-13-medium",
  },
  compact: {
    root: "xl:h-90.5",
    title: "text-heading-20-bold text-grey-900 xl:text-body-13-medium",
    people: "text-body-16-regular text-grey-800 xl:text-body-10-regular",
    unit: "text-body-13-bold xl:text-body-10-bold",
    amount: "text-heading-20-bold xl:text-body-13-bold",
    original: "text-body-10-medium",
    secondaryLabel: "text-body-13-regular xl:text-body-10-regular",
    secondaryAmount: "text-body-13-medium xl:text-body-10-medium",
  },
} satisfies Record<SpaceCardVariant, Record<string, string>>;

export function SpaceCard({
  space,
  priority = false,
  variant = "default",
  href,
}: SpaceCardProps) {
  const { price, secondaryPrice } = space;
  const styles = variantStyles[variant];
  const compact = variant === "compact";

  return (
    <article
      className={cn(
        "relative flex min-w-0 flex-col gap-4 rounded-lg bg-white p-4 shadow-card transition-shadow hover:shadow-sm",
        styles.root,
      )}
    >
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
            <h3 className={styles.title}>
              <Link
                href={href ?? `/spaces/${space.slug}`}
                className="rounded-sm outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
              >
                {space.name}
              </Link>
            </h3>
            <SpaceTypeChip type={space.type} label={space.categoryLabel} />
          </div>
          <p className={cn("flex shrink-0 items-center gap-1", styles.people)}>
            {compact && (
              <Image
                src="/images/icons/product/stat-people.svg"
                alt=""
                width={16}
                height={16}
                className="size-4 max-xl:hidden"
              />
            )}
            {formatPeople(space.capacity)}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <p className={cn("text-product-800", styles.unit)}>
              {formatPriceUnit(price.unit)}
            </p>
            <div className="flex flex-col">
              {price.originalAmount && (
                <p
                  className={cn("text-grey-300 line-through", styles.original)}
                >
                  {formatRupiah(price.originalAmount)}
                </p>
              )}
              <p className={cn("text-product-800", styles.amount)}>
                {formatRupiah(price.amount)}
              </p>
            </div>
          </div>
          <p className={cn("flex gap-1 text-grey-400", styles.secondaryLabel)}>
            {formatPriceUnit(secondaryPrice.unit)}
            <span className={cn("text-grey-800", styles.secondaryAmount)}>
              {formatRupiah(secondaryPrice.amount)}
            </span>
          </p>
        </div>
      </div>
    </article>
  );
}
