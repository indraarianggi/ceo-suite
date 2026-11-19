import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { BookingHeader } from "@/components/layout/booking-header";
import { BookingList } from "@/components/sections/my-booking/booking-list";
import { BookingsTabs } from "@/components/sections/my-booking/bookings-tabs";
import { myBookingHref } from "@/data/navigation";
import { splitBookings } from "@/lib/booking-records";
import { listBookings } from "@/lib/bookings";
import { getSession } from "@/lib/session";

// Personal page: keep it out of search results. `noindex` alone is used (not a
// robots.txt `disallow`), because a disallowed page is never fetched, so
// crawlers could never see its `noindex`.
export const metadata: Metadata = {
  title: "My Bookings",
  description: "See your active and past CEO SUITE bookings.",
  robots: { index: false, follow: false },
};

function ListFallback() {
  return (
    <div aria-busy="true" className="flex flex-col gap-8">
      <div className="h-13 w-full max-w-102 animate-pulse rounded-md bg-grey-100 motion-reduce:animate-none" />
      <div className="h-52.5 animate-pulse rounded-lg bg-grey-100 motion-reduce:animate-none" />
    </div>
  );
}

export default function MyBookingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-grey-25">
      <BookingHeader activeHref={myBookingHref} />
      <main className="flex-1">
        <div className="page-container">
          <div className="mx-auto flex w-full max-w-196 flex-col gap-8 py-8">
            <h1 className="text-heading-25-bold text-grey-800">My Bookings</h1>
            <Suspense fallback={<ListFallback />}>
              <MyBookingContent />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}

async function MyBookingContent() {
  // Active vs History depends on the current time, so this is request-time.
  await connection();
  const user = await getSession();
  if (!user) redirect(`/login?next=${encodeURIComponent(myBookingHref)}`);

  const now = new Date();
  const { active, history } = splitBookings(await listBookings(user, now), now);
  return (
    <BookingsTabs
      active={<BookingList bookings={active} />}
      history={<BookingList bookings={history} />}
    />
  );
}
