import Image from "next/image";
import Link from "next/link";

import { DecorBlob } from "@/components/shared/decor-blob";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { getPromotions } from "@/lib/promotions";
import { cn } from "@/lib/utils";

export async function PromotionsSection() {
  const promotions = await getPromotions();

  return (
    <section
      id="promotions"
      aria-labelledby="promotions-title"
      className="relative scroll-mt-18 overflow-hidden py-12 xl:scroll-mt-28 xl:py-16"
    >
      <DecorBlob className="-top-14 -right-8 size-42" />
      <div className="relative page-container flex flex-col gap-6">
        <SectionHeading
          id="promotions-title"
          title="Promotions"
          description="Don’t miss this opportunity to elevate your workspace experience at unbeatable value."
          descriptionWeight="regular"
          icon={
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-badge-promo">
              <Image
                src="/images/icons/badge-megaphone.svg"
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
              See All
            </Link>
          }
        />
        <ul className="grid gap-4 lg:grid-cols-3">
          {promotions.map((promo) => (
            <li key={promo.id}>
              <article className="relative flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-card">
                <div className="relative aspect-video xl:aspect-auto xl:h-58">
                  <Image
                    src={promo.image.src}
                    alt={promo.image.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 px-4 py-8">
                  <h3 className="text-heading-20-bold text-grey-800">
                    <Link
                      href={promo.href}
                      className="rounded-lg outline-none after:absolute after:inset-0 focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
                    >
                      {promo.title}
                    </Link>
                  </h3>
                  <p className="text-body-16-regular text-grey-400">
                    {promo.description}
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
