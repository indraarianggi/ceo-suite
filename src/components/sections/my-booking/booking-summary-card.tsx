import { detailCard } from "@/components/sections/my-booking/detail-row";
import { buildPriceBreakdown } from "@/lib/booking-records";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { BookingQuote } from "@/types/booking";

type SummaryRow = [label: string, value: string];

export function BookingSummaryCard({ quote }: { quote: BookingQuote }) {
  const price = buildPriceBreakdown(quote);
  const rows: SummaryRow[] = [
    ["Room Booking Price", formatRupiah(price.room)],
    ["Add On Price", formatRupiah(price.addOns)],
    ["Overtime Price", formatRupiah(price.overtime)],
    ["Total Price", formatRupiah(price.subtotal)],
    ...(price.discount
      ? ([
          [
            `Voucher ${price.discount.code}`,
            `-${formatRupiah(price.discount.amount)}`,
          ],
        ] as SummaryRow[])
      : []),
    // The checkout total already includes tax, so PPN is shown as included
    // rather than added on top: Final Price must equal what was confirmed.
    ["PPN 11%", "Included"],
    ["Deposit", formatRupiah(price.deposit)],
  ];

  return (
    <aside
      aria-labelledby="booking-summary-heading"
      className={cn(detailCard, "flex flex-col gap-6 px-4 py-4")}
    >
      <h2
        id="booking-summary-heading"
        className="text-heading-20-bold text-grey-800"
      >
        Booking Summary
      </h2>
      <dl className="flex flex-col gap-2">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 text-body-13-regular text-grey-600"
          >
            <dt>{label}</dt>
            <dd className="text-body-13-medium text-grey-800">{value}</dd>
          </div>
        ))}
      </dl>
      <hr className="border-grey-100" />
      <p className="flex items-center justify-between gap-4 text-body-16-bold text-grey-600">
        <span>Final Price</span>
        <span className="text-primary">{formatRupiah(price.final)}</span>
      </p>
    </aside>
  );
}
