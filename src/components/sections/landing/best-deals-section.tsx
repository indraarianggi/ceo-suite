import Image from "next/image";
import Link from "next/link";

import { DecorBlob } from "@/components/shared/decor-blob";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { getDeals } from "@/lib/promotions";
import { cn } from "@/lib/utils";

export async function BestDealsSection() {
  const deals = await getDeals();

  return (
    <section
      id="best-deals"
      aria-labelledby="best-deals-title"
      className="relative scroll-mt-18 overflow-hidden py-12 xl:scroll-mt-28 xl:py-16"
    >
      <DecorBlob className="top-4 -left-16 size-32" />
      <div className="relative page-container flex flex-col gap-6">
        <SectionHeading
          id="best-deals-title"
          title="Best Deals"
          description="Take advantage of our special promotions and enjoy exceptional savings on your workspace."
          descriptionWeight="regular"
          gap="lg"
          icon={
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-badge-deal">
              <Image
                src="/images/icons/badge-discount.svg"
                alt=""
                width={24}
                height={24}
              />
            </span>
          }
          action={
            <Link
              href="/promotions"
              className={cn(
                buttonVariants({ variant: "secondary", size: "md" }),
                "min-w-41 shrink-0",
              )}
            >
              See All Deals
            </Link>
          }
        />
        <ul className="grid gap-4 lg:grid-cols-3 xl:gap-3">
          {deals.map((deal) => (
            <li key={deal.id}>
              <article className="relative aspect-522/241 overflow-hidden rounded-lg bg-grey-950">
                <Image
                  src={deal.image.src}
                  alt={deal.image.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover"
                />
                <span aria-hidden className="absolute inset-0 bg-black/30" />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-b from-product-800/10 from-40% to-product-800 opacity-90"
                />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 px-8 py-4 text-white">
                  <p className="flex items-center gap-1 text-body-16-medium">
                    <span className="text-body-16-bold">{deal.amount}</span>
                    <Link
                      href={deal.href}
                      className="rounded-sm outline-none after:absolute after:inset-0 focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
                    >
                      {deal.label}
                    </Link>
                  </p>
                  <p className="text-body-10-regular text-grey-100">
                    {deal.validUntil}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
