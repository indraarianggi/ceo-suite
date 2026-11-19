import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { BookingStatusBanner } from "@/components/sections/my-booking/booking-status";
import { SpaceTypeIcon } from "@/components/shared/space-type-chip";
import { formatBookingDates, formatBookingTime } from "@/lib/booking-format";
import { formatRupiah } from "@/lib/format";
import type { BookingView } from "@/types/booking";

export function BookingCard({ booking }: { booking: BookingView }) {
  const { space, selection } = booking;
  const time = formatBookingTime(selection);

  return (
    <Link
      href={`/my-booking/${booking.reference}`}
      className="group block overflow-hidden rounded-lg bg-white shadow-panel outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <BookingStatusBanner status={booking.status} />
      <div className="flex items-start justify-between gap-6 p-4">
        <div className="flex min-w-0 flex-col gap-6">
          <div className="flex items-center gap-3">
            <SpaceTypeIcon type={space.type} className="size-6 shrink-0" />
            <div className="flex min-w-0 flex-col">
              <h2 className="text-body-16-bold break-words text-grey-950">
                {space.name}
              </h2>
              <p className="text-body-13-medium text-grey-600">
                {space.categoryLabel}
              </p>
            </div>
          </div>
          <p className="flex flex-wrap items-center gap-x-2 text-body-13-medium text-grey-600">
            <span>{formatBookingDates(selection)}</span>
            {time && (
              <>
                <span aria-hidden>•</span>
                <span>{time}</span>
              </>
            )}
          </p>
          <div className="flex flex-col gap-1">
            <p className="text-body-13-medium text-grey-600">Total Price</p>
            <p className="text-body-16-bold text-primary">
              {formatRupiah(booking.quote.total)}
            </p>
          </div>
        </div>
        <ChevronRight
          aria-hidden
          className="size-6 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      </div>
    </Link>
  );
}
