"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { BookingMeta } from "@/components/sections/booking/booking-meta";
import { SpaceTypeChip } from "@/components/shared/space-type-chip";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BookingSelection, BookingSpace } from "@/types/booking";

type ConfirmationStepProps = {
  space: BookingSpace;
  selection: BookingSelection;
};

export function ConfirmationStep({ space, selection }: ConfirmationStepProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // The step swap replaces the whole page, so tell screen readers where they are.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-193.25 flex-col items-center gap-8 py-8 xl:gap-16 xl:py-16">
      <Image
        src="/images/booking/booking-confirmed.webp"
        alt=""
        width={773}
        height={317}
        priority
        sizes="(min-width: 1024px) 773px, 100vw"
        className="h-auto w-full rounded-4xl"
      />

      <div className="flex w-full max-w-159 flex-col gap-9">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-heading-31-bold text-primary outline-none xl:text-heading-49-bold"
        >
          Your booking is confirmed!
        </h1>

        <div className="flex flex-col items-center gap-8">
          <section
            aria-labelledby="booking-summary-heading"
            className="flex w-full flex-col gap-2"
          >
            <h2
              id="booking-summary-heading"
              className="text-heading-20-bold text-grey-900"
            >
              Booking Summary
            </h2>
            <div className="flex flex-col gap-4 rounded-xl bg-white px-4 py-6 shadow-sm">
              <div className="flex flex-col gap-3">
                <p className="text-body-13-medium text-grey-900">
                  {space.name}
                </p>
                <SpaceTypeChip type={space.type} label={space.categoryLabel} />
              </div>
              <hr className="border-t border-dashed border-grey-100" />
              <BookingMeta
                capacity={space.capacity}
                selection={selection}
                stacked
              />
              <hr className="border-t border-dashed border-grey-100" />
              <div className="flex items-center gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-product-100">
                  <Image
                    src="/images/icons/booking-location.svg"
                    alt=""
                    width={24}
                    height={24}
                  />
                </span>
                <div className="flex min-w-0 flex-col gap-1 text-body-13-regular text-grey-600">
                  <p className="text-body-13-bold">{space.location.name}</p>
                  <p>{space.location.address}</p>
                </div>
              </div>
            </div>
          </section>

          <Link
            href="/my-booking"
            className={cn(
              buttonVariants({ size: "md" }),
              "h-10.75 w-full rounded-lg sm:w-78",
            )}
          >
            View Booking
          </Link>
        </div>
      </div>
    </div>
  );
}
