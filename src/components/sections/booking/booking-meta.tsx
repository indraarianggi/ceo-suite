import { CalendarDays, Clock, Users } from "lucide-react";

import { formatBookingDates, formatBookingTime } from "@/lib/booking-format";
import { formatPeople } from "@/lib/format";
import type { BookingSelection } from "@/types/booking";

type BookingMetaProps = {
  capacity: number;
  selection: BookingSelection;
  stacked?: boolean;
};

export function BookingMeta({
  capacity,
  selection,
  stacked,
}: BookingMetaProps) {
  const time = formatBookingTime(selection);
  const items = [
    { Icon: Users, text: formatPeople(capacity) },
    { Icon: CalendarDays, text: formatBookingDates(selection) },
    ...(time ? [{ Icon: Clock, text: time }] : []),
  ];

  return (
    <ul
      className={
        stacked
          ? "flex flex-col gap-1 text-body-13-regular text-grey-600"
          : "flex flex-wrap gap-x-4 gap-y-2 text-body-13-regular text-grey-600"
      }
    >
      {items.map(({ Icon, text }) => (
        <li key={text} className="flex items-center gap-2">
          <Icon aria-hidden className="size-4 shrink-0 text-grey-400" />
          {text}
        </li>
      ))}
    </ul>
  );
}
