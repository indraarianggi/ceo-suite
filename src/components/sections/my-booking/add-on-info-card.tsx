import { detailCard } from "@/components/sections/my-booking/detail-row";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { BookingQuote } from "@/types/booking";

export function AddOnInfoCard({ quote }: { quote: BookingQuote }) {
  return (
    <section
      aria-labelledby="add-on-heading"
      className={cn(detailCard, "flex flex-col gap-3 py-4")}
    >
      <h2 id="add-on-heading" className="px-4 text-body-16-bold text-grey-800">
        Add On Info
      </h2>
      <ul className="flex flex-col gap-2 px-4">
        {quote.lines.map((line) => (
          <li
            key={line.id}
            className="flex items-center justify-between gap-4 text-body-13-regular text-grey-600"
          >
            <span>
              {line.label}{" "}
              <span className="whitespace-nowrap">x{line.quantity}</span>
            </span>
            <span className="shrink-0 text-body-13-medium text-grey-800">
              {formatRupiah(line.amount)}
            </span>
          </li>
        ))}
      </ul>
      <hr className="border-grey-100" />
      <p className="flex items-center justify-between gap-4 px-4 text-body-13-regular text-grey-600">
        <span>Total Price</span>
        <span className="text-body-13-bold text-grey-900">
          {formatRupiah(quote.subtotal)}
        </span>
      </p>
    </section>
  );
}
