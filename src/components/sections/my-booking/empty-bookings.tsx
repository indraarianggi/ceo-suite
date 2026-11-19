import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyBookings() {
  return (
    <div className="flex flex-col items-center gap-8 py-10 text-center">
      <Image
        src="/images/my-booking/empty-bookings.svg"
        alt=""
        width={180}
        height={188}
      />
      <p className="max-w-99 text-heading-20-medium text-grey-600">
        You have no booking. Book your meeting room now!
      </p>
      <Link
        href="/#browse-spaces"
        className={cn(
          buttonVariants({ size: "md" }),
          "h-10.75 w-full rounded-lg sm:w-64",
        )}
      >
        Search Rooms
      </Link>
    </div>
  );
}
