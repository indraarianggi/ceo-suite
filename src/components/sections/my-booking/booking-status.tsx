import { BOOKING_STATUS_LABEL } from "@/lib/booking-records";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/types/booking";

const tone: Record<BookingStatus, string> = {
  success: "bg-success-50 text-success-700",
  expired: "bg-error-50 text-error-600",
};

/** Full-width banner on list cards. */
export function BookingStatusBanner({ status }: { status: BookingStatus }) {
  return (
    <p className={cn("px-4 py-3 text-body-13-medium", tone[status])}>
      <span className="sr-only">Status: </span>
      {BOOKING_STATUS_LABEL[status]}
    </p>
  );
}

/** Pill on the details page. */
export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-4xl p-2 text-body-10-medium",
        tone[status],
      )}
    >
      {BOOKING_STATUS_LABEL[status]}
    </span>
  );
}
