import { BookingGallery } from "@/components/sections/my-booking/booking-gallery";
import { BookingStatusBadge } from "@/components/sections/my-booking/booking-status";
import {
  DetailRow,
  detailCard,
} from "@/components/sections/my-booking/detail-row";
import { SpaceTypeChip } from "@/components/shared/space-type-chip";
import { formatBookingDates, formatBookingTime } from "@/lib/booking-format";
import { formatBookingDuration } from "@/lib/booking-records";
import { cn } from "@/lib/utils";
import type { BookingView } from "@/types/booking";

const divider = "border-grey-100";

export function BookingOverviewCard({ booking }: { booking: BookingView }) {
  const { space, selection } = booking;
  const time = formatBookingTime(selection);
  const facts: Array<[string, string]> = [
    ["Capacity", `${space.capacity} people`],
    ["Date", formatBookingDates(selection)],
    ...(time ? ([["Time", time]] as Array<[string, string]>) : []),
    ["Duration", formatBookingDuration(selection)],
  ];

  return (
    <section
      aria-labelledby="booking-overview-heading"
      className={cn(detailCard, "overflow-hidden")}
    >
      <BookingGallery images={space.gallery} />
      <div className="flex flex-col gap-3 py-4">
        <dl className="flex flex-col gap-3 px-4">
          <DetailRow label="Booking Invoice" strong>
            {booking.reference}
          </DetailRow>
          <DetailRow label="Booking Status">
            <BookingStatusBadge status={booking.status} />
          </DetailRow>
        </dl>
        <hr className={divider} />
        <div className="flex flex-col gap-3 px-4">
          <h2
            id="booking-overview-heading"
            className="text-heading-20-bold text-grey-900"
          >
            {space.name}
          </h2>
          <SpaceTypeChip type={space.type} label={space.categoryLabel} />
        </div>
        <hr className={divider} />
        <dl className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 px-4">
            <dt className="text-body-10-regular text-grey-400">Customer</dt>
            <dd className="text-body-13-medium text-grey-900">
              {booking.contactName}
            </dd>
          </div>
          {booking.note && (
            <>
              <hr className={divider} />
              <div className="flex flex-col gap-1 px-4">
                <dt className="text-body-10-regular text-grey-400">
                  Usage Description
                </dt>
                <dd className="text-body-13-regular text-grey-800">
                  {booking.note}
                </dd>
              </div>
            </>
          )}
        </dl>
        <hr className={divider} />
        <dl className="flex flex-col gap-2 px-4 text-body-13-regular">
          {facts.map(([label, value]) => (
            <div key={label} className="flex gap-4">
              <dt className="w-21 shrink-0 text-grey-400">{label}</dt>
              <dd className="min-w-0 text-grey-800">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
