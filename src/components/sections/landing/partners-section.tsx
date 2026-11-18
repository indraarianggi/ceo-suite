import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { getCorporatePartners } from "@/lib/content";
import { cn } from "@/lib/utils";

export async function PartnersSection() {
  const partners = await getCorporatePartners();

  return (
    <section
      id="partners"
      aria-labelledby="partners-title"
      className="scroll-mt-28 py-12 xl:py-16"
    >
      <div className="page-container flex flex-col gap-8 xl:gap-16">
        <SectionHeading
          id="partners-title"
          title="Our Corporate Partners"
          description="Exclusive benefits and promotions tailored to meet the needs of businesses of all sizes."
          descriptionWeight="regular"
          action={
            <Link
              href="/partners"
              className={cn(
                buttonVariants({ variant: "secondary", size: "md" }),
                "min-w-41 shrink-0",
              )}
            >
              See All
            </Link>
          }
        />
        <ul className="grid gap-8 lg:grid-cols-3 xl:gap-4">
          {partners.map((partner) => (
            <li key={partner.id}>
              <article className="relative flex flex-col gap-6">
                <div className="relative aspect-523/300 overflow-hidden rounded-lg bg-grey-950">
                  <Image
                    src={partner.image.src}
                    alt={partner.image.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-linear-to-b from-black/50 to-transparent"
                  />
                  <div className="absolute top-0 left-4 flex h-18 items-center gap-4">
                    {partner.logos.map((logo) => (
                      <Image
                        key={logo.src}
                        src={logo.src}
                        alt={logo.alt}
                        width={logo.width}
                        height={logo.height}
                        className="shrink-0"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-heading-20-bold text-grey-950 md:text-heading-25-bold">
                    <Link
                      href={partner.href}
                      className="rounded-sm outline-none after:absolute after:inset-0 focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
                    >
                      {partner.title}
                    </Link>
                  </h3>
                  <p className="text-body-16-regular text-grey-500 md:text-heading-20-regular md:leading-7 xl:min-h-28">
                    {partner.description}
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
