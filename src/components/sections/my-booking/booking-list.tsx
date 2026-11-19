import { BookingCard } from "@/components/sections/my-booking/booking-card";
import { EmptyBookings } from "@/components/sections/my-booking/empty-bookings";
import type { BookingView } from "@/types/booking";

export function BookingList({ bookings }: { bookings: BookingView[] }) {
  if (bookings.length === 0) return <EmptyBookings />;
  return (
    <ul className="flex flex-col gap-4">
      {bookings.map((booking) => (
        <li key={booking.reference}>
          <BookingCard booking={booking} />
        </li>
      ))}
    </ul>
  );
}
