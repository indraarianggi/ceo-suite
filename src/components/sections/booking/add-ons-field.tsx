import { ChevronRight } from "lucide-react";
import Image from "next/image";

import type { ResolvedAddOn } from "@/lib/booking-quote";

type AddOnsFieldProps = {
  selected: ResolvedAddOn[];
  onOpen: () => void;
};

export function AddOnsField({ selected, onOpen }: AddOnsFieldProps) {
  const count = selected.length;

  return (
    <section aria-labelledby="booking-add-ons" className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <h2 id="booking-add-ons" className="text-body-16-bold text-grey-800">
          Add Ons
        </h2>
        <p className="text-body-13-medium text-grey-400">
          Enhance your booking experience with a variety of add-ons.
        </p>
      </div>
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-grey-100 bg-white p-4 text-left transition-colors outline-none hover:border-grey-200 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span className="flex min-w-0 flex-col gap-3">
          <span className="flex items-center gap-3">
            <Image
              src="/images/icons/booking-add-ons.svg"
              alt=""
              width={24}
              height={24}
              className="size-6"
            />
            <span
              className={
                count > 0
                  ? "text-body-13-medium text-primary"
                  : "text-body-13-medium text-grey-600"
              }
            >
              {count > 0 ? `${count} Selected` : "Select add ons"}
            </span>
          </span>
          {count > 0 && (
            <span className="flex flex-col gap-2 pl-4 text-body-13-medium text-grey-700">
              {selected.map(({ addOn, quantity }) => (
                <span key={addOn.id}>
                  {addOn.name}
                  {quantity > 1 && ` (x${quantity})`}
                </span>
              ))}
            </span>
          )}
        </span>
        <ChevronRight aria-hidden className="size-6 shrink-0 text-grey-800" />
      </button>
    </section>
  );
}
