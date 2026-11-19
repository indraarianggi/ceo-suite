import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { BookingHeader } from "@/components/layout/booking-header";
import { BookingFlow } from "@/components/sections/booking/booking-flow";
import { parseBookingParams } from "@/lib/booking-params";
import { getSession } from "@/lib/session";
import { getSpaceBySlug } from "@/lib/spaces";
import { getVouchers } from "@/lib/vouchers";
import type { BookingSpace } from "@/types/booking";

// A personal, transactional page: keep it out of search results.
export const metadata: Metadata = {
  title: "Fill Booking Details",
  description: "Review your booking, add extras and confirm your space.",
  robots: { index: false, follow: false },
};

/** Static shell while the request-specific content (URL params, session) loads. */
function BookingFallback() {
  return (
    <div className="flex min-h-dvh flex-col bg-grey-25">
      <BookingHeader />
      <main className="flex-1" aria-busy="true">
        <div className="page-container flex flex-col gap-6 py-6 xl:gap-9 xl:py-8">
          <div className="h-8 w-64 animate-pulse rounded-md bg-grey-100 motion-reduce:animate-none" />
          <div className="h-96 animate-pulse rounded-xl bg-grey-100 motion-reduce:animate-none" />
        </div>
      </main>
    </div>
  );
}

// Synchronous page: `searchParams` and the session cookie are read inside the
// Suspense boundary, so the route keeps a static shell (same pattern as
// /spaces/[slug]).
export default function BookingPage(props: PageProps<"/booking">) {
  return (
    <Suspense fallback={<BookingFallback />}>
      <BookingContent searchParams={props.searchParams} />
    </Suspense>
  );
}

async function BookingContent({
  searchParams,
}: {
  searchParams: PageProps<"/booking">["searchParams"];
}) {
  // "Is this date in the past?" depends on the current time, so this page is
  // request-time by nature: say so before reading the clock.
  await connection();
  // The URL is user-editable: validate it, never trust the totals it implies.
  const parsed = parseBookingParams(await searchParams, new Date());

  if (!parsed.ok) {
    // Bad dates or hours for a real space: send the visitor back to pick again.
    if (parsed.slug && (await getSpaceBySlug(parsed.slug))) {
      redirect(`/spaces/${parsed.slug}`);
    }
    notFound();
  }

  const [space, user, vouchers] = await Promise.all([
    getSpaceBySlug(parsed.selection.slug),
    getSession(),
    getVouchers(),
  ]);
  if (!space) notFound();

  // Ship only what the flow needs (not the gallery, description, stats).
  const bookingSpace: BookingSpace = {
    id: space.id,
    slug: space.slug,
    name: space.name,
    type: space.type,
    categoryLabel: space.categoryLabel,
    capacity: space.capacity,
    image: space.image,
    prices: space.prices,
    addOns: space.addOns,
    location: space.location,
  };

  return (
    <BookingFlow
      header={<BookingHeader />}
      space={bookingSpace}
      selection={parsed.selection}
      vouchers={vouchers}
      user={user}
    />
  );
}
