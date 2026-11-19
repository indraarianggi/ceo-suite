import { AuthButton } from "@/components/shared/auth-button";
import { formatRupiah } from "@/lib/format";
import type { BookingQuote } from "@/types/booking";

type PriceSummaryProps = {
  quote: BookingQuote;
  onContinue: () => void;
  loading?: boolean;
};

export function PriceSummary({
  quote,
  onContinue,
  loading,
}: PriceSummaryProps) {
  return (
    <aside
      aria-labelledby="price-summary-heading"
      className="flex flex-col gap-6 rounded-xl bg-white p-6 shadow-panel md:p-8"
    >
      <div className="flex flex-col">
        <div className="flex flex-col gap-2.5 px-4 py-2.5">
          <h2
            id="price-summary-heading"
            className="text-heading-20-bold text-grey-800"
          >
            Price Summary
          </h2>
          <ul className="flex flex-col gap-2.5">
            {quote.lines.map((line) => (
              <li
                key={line.id}
                className="flex items-center justify-between gap-7 text-body-13-regular text-grey-600"
              >
                <span>
                  {line.quantity}x {line.label}
                </span>
                <span className="shrink-0 text-body-13-medium text-grey-800">
                  {formatRupiah(line.amount)}
                </span>
              </li>
            ))}
            {quote.discount && (
              <li className="flex items-center justify-between gap-7 text-body-13-regular text-grey-600">
                <span>{quote.discount.code}</span>
                <span className="shrink-0 text-body-13-medium text-grey-800 line-through">
                  <span className="sr-only">Discount of </span>
                  {formatRupiah(quote.discount.amount)}
                </span>
              </li>
            )}
          </ul>
        </div>
        <div className="flex items-center justify-between gap-7 border-t border-grey-100 p-2.5">
          <span className="text-body-13-bold text-grey-600">Total Price</span>
          <span className="text-body-16-bold text-primary">
            {formatRupiah(quote.total)}
          </span>
        </div>
      </div>
      <AuthButton type="button" onClick={onContinue} loading={loading}>
        Continue to Payment
      </AuthButton>
    </aside>
  );
}
