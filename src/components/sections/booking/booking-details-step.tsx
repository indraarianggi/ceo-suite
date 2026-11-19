"use client";

import { AddOnsField } from "@/components/sections/booking/add-ons-field";
import { SpaceSummaryCard } from "@/components/sections/booking/space-summary-card";
import { VoucherField } from "@/components/sections/booking/voucher-field";
import type { ResolvedAddOn } from "@/lib/booking-quote";
import type { BookingSelection, BookingSpace } from "@/types/booking";

export const NOTE_MAX_LENGTH = 500;

type BookingDetailsStepProps = {
  space: BookingSpace;
  selection: BookingSelection;
  note: string;
  onNoteChange: (note: string) => void;
  selectedAddOns: ResolvedAddOn[];
  onOpenAddOns: () => void;
  appliedVoucher: string | null;
  onOpenVoucher: () => void;
};

/** Left column of "Fill Booking Details": summary, request, add-ons, voucher. */
export function BookingDetailsStep({
  space,
  selection,
  note,
  onNoteChange,
  selectedAddOns,
  onOpenAddOns,
  appliedVoucher,
  onOpenVoucher,
}: BookingDetailsStepProps) {
  return (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-1">
      <SpaceSummaryCard space={space} selection={selection} />

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <label
            htmlFor="booking-note"
            className="flex items-baseline gap-1 text-body-16-bold text-grey-800"
          >
            Additional Request
            <span className="text-body-16-regular text-grey-400">
              (Optional)
            </span>
          </label>
          <textarea
            id="booking-note"
            value={note}
            maxLength={NOTE_MAX_LENGTH}
            onChange={(event) => onNoteChange(event.target.value)}
            placeholder="Let us know if you need anything extra!"
            className="block h-32 w-full resize-none rounded-xl border border-grey-100 bg-white px-4 py-3 text-body-13-regular text-grey-800 transition-colors outline-none placeholder:text-grey-300 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <AddOnsField selected={selectedAddOns} onOpen={onOpenAddOns} />
        <VoucherField applied={appliedVoucher} onOpen={onOpenVoucher} />
      </div>
    </div>
  );
}
