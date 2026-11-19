import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { BookingHeader } from "@/components/layout/booking-header";
import { AddOnInfoCard } from "@/components/sections/my-booking/add-on-info-card";
import { BookingActions } from "@/components/sections/my-booking/booking-actions";
import { BookingOverviewCard } from "@/components/sections/my-booking/booking-overview-card";
import { BookingSummaryCard } from "@/components/sections/my-booking/booking-summary-card";
import { PaymentInfoCard } from "@/components/sections/my-booking/payment-info-card";
import { myBookingHref } from "@/data/navigation";
import { isReference } from "@/lib/booking-records";
import { getBookingByReference } from "@/lib/bookings";
import { getSession } from "@/lib/session";

// Personal page: `noindex` alone (see the My Booking list page for why).
export const metadata: Metadata = {
  title: "Booking Details",
  description: "Review your CEO SUITE booking, add-ons and payment.",
  robots: { index: false, follow: false },
};

type Props = PageProps<"/my-booking/[reference]">;

function DetailFallback() {
  return (
    <div
      aria-busy="true"
      className="grid gap-8 xl:grid-cols-[minmax(0,920fr)_minmax(0,648fr)]"
    >
      <div className="h-96 animate-pulse rounded-lg bg-grey-100 motion-reduce:animate-none" />
      <div className="h-72 animate-pulse rounded-lg bg-grey-100 motion-reduce:animate-none" />
    </div>
  );
}

// Synchronous page: `params` and the session cookie are read inside the
// Suspense boundary, so the route keeps a static shell.
export default function BookingDetailsPage(props: Props) {
  return (
    <div className="flex min-h-dvh flex-col bg-grey-25">
      <BookingHeader activeHref={myBookingHref} />
      <main className="flex-1">
        <div className="page-container flex flex-col gap-9 py-8">
          <Link
            href={myBookingHref}
            className="flex w-fit items-center gap-4 rounded-sm text-body-16-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 print:hidden"
          >
            <ArrowLeft aria-hidden className="size-6" />
            back to My Booking
          </Link>
          <h1 className="text-heading-25-bold text-grey-800">
            Booking Details
          </h1>
          <Suspense fallback={<DetailFallback />}>
            <BookingDetails params={props.params} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

async function BookingDetails({ params }: { params: Props["params"] }) {
  // Seed dates are relative to "now", so this is request-time like the list.
  await connection();
  const { reference } = await params;
  if (!isReference(reference)) notFound();

  const user = await getSession();
  if (!user) {
    redirect(
      `/login?next=${encodeURIComponent(`${myBookingHref}/${reference}`)}`,
    );
  }

  // Looked up inside the user's own list: someone else's reference is a 404.
  const booking = await getBookingByReference(user, reference);
  if (!booking) notFound();

  return (
    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,920fr)_minmax(0,648fr)] xl:gap-x-8">
      <BookingOverviewCard booking={booking} />
      {/* Right after the overview on small screens; right column on desktop. */}
      <div className="xl:col-start-2 xl:row-span-4 xl:row-start-1">
        <BookingSummaryCard quote={booking.quote} />
      </div>
      <AddOnInfoCard quote={booking.quote} />
      <PaymentInfoCard booking={booking} />
      <BookingActions reference={booking.reference} />
    </div>
  );
}
