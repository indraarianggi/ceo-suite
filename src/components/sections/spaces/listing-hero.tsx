import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { ListingHero } from "@/data/spaces-listing";
import { cn } from "@/lib/utils";

type ListingHeroProps = { hero: ListingHero };

export function ListingHeroSection({ hero }: ListingHeroProps) {
  return (
    <section
      aria-labelledby="listing-title"
      className="relative isolate flex h-64 items-center justify-center overflow-hidden bg-grey-900 md:h-80 xl:h-99.5"
    >
      <Image
        src={hero.image.src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-top"
      />
      <div className="page-container flex flex-col items-center gap-6 text-center xl:gap-9">
        <div className="flex flex-col items-center gap-3 xl:gap-4">
          <h1
            id="listing-title"
            className="text-heading-39-bold text-white text-shadow-hero md:text-heading-49-bold xl:text-heading-61-bold"
          >
            {hero.title}
          </h1>
          <p className="text-body-16-medium text-background-50 md:text-heading-20-medium">
            {hero.tagline}
          </p>
        </div>
        <Link
          href="#results"
          className={cn(
            buttonVariants({ size: "xl" }),
            "h-12 px-8 xl:h-14 xl:px-12",
          )}
        >
          Book Now
        </Link>
      </div>
    </section>
  );
}
