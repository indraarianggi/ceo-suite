import { formatPriceUnit, formatRupiah } from "@/lib/format";
import type { SpacePrices } from "@/types/space";

type PriceSectionProps = { prices: SpacePrices; bestDeal?: boolean };

const otherTiers = ["hourly", "weekly", "monthly"] as const;

export function PriceSection({ prices, bestDeal }: PriceSectionProps) {
  return (
    <section
      aria-labelledby="price-heading"
      className="relative flex flex-col gap-3 pt-2 pb-6 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-grey-100"
    >
      <h2 id="price-heading" className="text-heading-25-bold text-grey-950">
        Price
      </h2>

      <div className="flex flex-col gap-3 rounded-xl bg-linear-151 from-product-50 to-white to-78% px-4 py-6 outline -outline-offset-1 outline-product-100 md:px-6 md:py-8">
        <div className="flex flex-wrap items-center justify-between gap-x-1 gap-y-2">
          <p className="flex items-center gap-2">
            <span className="text-body-16-regular text-grey-400">
              {formatPriceUnit("daily")}
            </span>
            <span className="text-heading-20-bold text-product-800">
              {formatRupiah(prices.daily)}
            </span>
          </p>
          {bestDeal && (
            <span className="rounded-4xl bg-success-100 px-4 py-2 text-body-13-bold whitespace-nowrap text-success-700">
              Best Deal
            </span>
          )}
        </div>

        <hr className="-mb-px h-px border-0 bg-grey-100" />

        <dl className="flex flex-col gap-1">
          {otherTiers.map((tier) => (
            <div key={tier} className="flex items-center gap-1">
              <dt className="w-15 text-body-13-regular text-grey-400">
                {formatPriceUnit(tier)}
              </dt>
              <dd className="text-body-13-bold text-product-800">
                {formatRupiah(prices[tier])}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
