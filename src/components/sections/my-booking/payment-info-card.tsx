import { format } from "date-fns";

import {
  DetailRow,
  detailCard,
} from "@/components/sections/my-booking/detail-row";
import { paymentInfo } from "@/lib/booking-records";
import { cn } from "@/lib/utils";
import type { BookingView } from "@/types/booking";

export function PaymentInfoCard({ booking }: { booking: BookingView }) {
  const info = paymentInfo(booking);
  return (
    <section
      aria-labelledby="payment-info-heading"
      className={cn(detailCard, "flex flex-col gap-3 py-4")}
    >
      <h2
        id="payment-info-heading"
        className="px-4 text-body-16-bold text-grey-800"
      >
        Payment Info
      </h2>
      <dl className="flex flex-col gap-3 px-4">
        <DetailRow label="Invoice" strong>
          {info.invoice}
        </DetailRow>
        {info.expiredBy && (
          <DetailRow label="Expired by" strong>
            {format(info.expiredBy, "d MMMM yyyy HH:mm")}
          </DetailRow>
        )}
        <DetailRow label="Status" strong>
          {info.status}
        </DetailRow>
        <DetailRow label="Type" strong>
          {info.type}
        </DetailRow>
      </dl>
    </section>
  );
}
