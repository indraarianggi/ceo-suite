import { addDays, format, startOfDay } from "date-fns";

import type { StoredBooking } from "../types/booking.ts";

/**
 * Demo bookings for the signed-in persona (same email as `MOCK_USERS` in
 * `src/lib/auth.ts`), so My Booking is never empty in a demo. Dates are
 * relative to `now` so Active and History both stay populated over time. Any
 * other account starts with no bookings (the empty states in Figma).
 *
 * Space slugs must exist in `src/data/space-details.ts`.
 */
export const DEMO_OWNER_EMAIL = "janedoe@gmail.com";

export function seedBookings(now: Date): StoredBooking[] {
  const today = startOfDay(now);
  const day = (offset: number) => format(addDays(today, offset), "yyyy-MM-dd");
  const created = (offset: number) => addDays(today, offset).toISOString();
  const owner = { ownerEmail: DEMO_OWNER_EMAIL, contactName: "Jane Doe" };

  return [
    {
      ...owner,
      reference: "CS-DEMO0001",
      spaceSlug: "wisma-gkbi-boardroom",
      selection: {
        slug: "wisma-gkbi-boardroom",
        from: day(3),
        to: day(3),
        time: { start: "16:00", end: "19:00" },
      },
      note: "Annual Meeting of 18 people",
      quote: {
        lines: [
          {
            id: "space",
            label: "Wisma GKBI Boardroom (Hourly)",
            quantity: 1,
            amount: 1_200_000,
          },
          {
            id: "coffee-break-standard",
            label: "Coffee Break - Standard",
            quantity: 1,
            amount: 50_000,
          },
          {
            id: "lcd-projector-daily",
            label: "LCD Projector (/day)",
            quantity: 1,
            amount: 1_500_000,
          },
        ],
        subtotal: 2_750_000,
        discount: null,
        total: 2_750_000,
      },
      status: "success",
      createdAt: created(-1),
    },
    {
      ...owner,
      reference: "CS-DEMO0002",
      spaceSlug: "suite-7-view",
      selection: {
        slug: "suite-7-view",
        from: day(10),
        to: day(10),
        time: { start: "10:00", end: "18:00" },
      },
      note: "",
      quote: {
        lines: [
          {
            id: "space",
            label: "Suite 7 View (Daily)",
            quantity: 1,
            amount: 3_480_000,
          },
        ],
        subtotal: 3_480_000,
        discount: null,
        total: 3_480_000,
      },
      status: "expired",
      createdAt: created(-2),
    },
    {
      ...owner,
      reference: "CS-DEMO0003",
      spaceSlug: "axa-tower-meeting-room-a",
      selection: {
        slug: "axa-tower-meeting-room-a",
        from: day(-20),
        to: day(-20),
        time: { start: "09:00", end: "12:00" },
      },
      note: "Quarterly planning",
      quote: {
        lines: [
          {
            id: "space",
            label: "AXA Tower Meeting Room (Hourly)",
            quantity: 1,
            amount: 750_000,
          },
        ],
        subtotal: 750_000,
        discount: { code: "15DISCOUNT", amount: 100_000 },
        total: 650_000,
      },
      status: "success",
      createdAt: created(-25),
    },
    {
      ...owner,
      reference: "CS-DEMO0004",
      spaceSlug: "suite-7-view",
      selection: { slug: "suite-7-view", from: day(-42), to: day(-40) },
      note: "",
      quote: {
        lines: [
          {
            id: "space",
            label: "Suite 7 View (3 days)",
            quantity: 1,
            amount: 9_000_000,
          },
        ],
        subtotal: 9_000_000,
        discount: null,
        total: 9_000_000,
      },
      status: "expired",
      createdAt: created(-45),
    },
  ];
}
