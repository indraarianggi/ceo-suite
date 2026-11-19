"use client";

import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import {
  BookingDialog,
  BookingDialogFrame,
} from "@/components/sections/booking/booking-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { addOnIcons } from "@/lib/add-on-icons";
import { maxAddOnQuantity } from "@/lib/booking-quote";
import { formatAddOnUnit, formatRupiah } from "@/lib/format";
import type { AddOnChoice } from "@/types/booking";
import type { AddOn } from "@/types/space";

const DISPLAY_ORDER = [
  "lunch-standard",
  "lunch-executive",
  "coffee-break-standard",
  "coffee-break-executive",
  "overtime-ac",
  "lcd-projector-daily",
  "lcd-projector-hourly",
  "flip-chart",
  "corkage-fee",
];

function inDisplayOrder(addOns: AddOn[]): AddOn[] {
  const rank = (id: string) => {
    const index = DISPLAY_ORDER.indexOf(id);
    return index === -1 ? DISPLAY_ORDER.length : index;
  };
  return [...addOns].sort((a, b) => rank(a.id) - rank(b.id));
}

type AddOnsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addOns: AddOn[];
  capacity: number;
  value: AddOnChoice[];
  onSave: (choices: AddOnChoice[]) => void;
};

export function AddOnsDialog({
  open,
  onOpenChange,
  addOns,
  capacity,
  value,
  onSave,
}: AddOnsDialogProps) {
  return (
    <BookingDialog open={open} onOpenChange={onOpenChange}>
      <AddOnsPanel
        addOns={addOns}
        capacity={capacity}
        value={value}
        onSave={(choices) => {
          onSave(choices);
          onOpenChange(false);
        }}
      />
    </BookingDialog>
  );
}

type AddOnsPanelProps = Pick<
  AddOnsDialogProps,
  "addOns" | "capacity" | "value" | "onSave"
>;

function AddOnsPanel({ addOns, capacity, value, onSave }: AddOnsPanelProps) {
  // Draft: nothing reaches the booking until Save.
  const [draft, setDraft] = useState<Record<string, number>>(() =>
    Object.fromEntries(value.map((c) => [c.addOnId, c.quantity])),
  );

  function setQuantity(addOn: AddOn, next: number) {
    const clamped = Math.max(
      0,
      Math.min(next, maxAddOnQuantity(addOn, capacity)),
    );
    setDraft((current) => ({ ...current, [addOn.id]: clamped }));
  }

  function save() {
    onSave(
      Object.entries(draft)
        .filter(([, quantity]) => quantity > 0)
        .map(([addOnId, quantity]) => ({ addOnId, quantity })),
    );
  }

  return (
    <BookingDialogFrame title="Select Add ons" onSave={save}>
      <ul className="md:columns-2 md:gap-x-8">
        {inDisplayOrder(addOns).map((addOn) => {
          const quantity = draft[addOn.id] ?? 0;
          const max = maxAddOnQuantity(addOn, capacity);
          return (
            <li
              key={addOn.id}
              className="mb-8 flex break-inside-avoid items-center justify-between gap-4 border-b border-grey-100 pb-2"
            >
              <label className="flex min-w-0 cursor-pointer items-center gap-4">
                <Checkbox
                  checked={quantity > 0}
                  onCheckedChange={(checked) =>
                    setQuantity(addOn, checked ? 1 : 0)
                  }
                  className="border-primary"
                />
                <Image
                  src={addOnIcons[addOn.icon]}
                  alt=""
                  width={24}
                  height={24}
                  className="size-6 shrink-0"
                />
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-body-10-medium text-grey-500">
                    {addOn.name}
                  </span>
                  <span className="flex items-baseline gap-0.5">
                    <span className="text-body-10-bold text-grey-950">
                      {formatRupiah(addOn.price)}
                    </span>
                    <span className="text-body-10-regular text-grey-500">
                      {formatAddOnUnit(addOn.unit)}
                    </span>
                  </span>
                </span>
              </label>

              <div
                role="group"
                aria-label={`${addOn.name} quantity`}
                className="flex shrink-0 items-center gap-2"
              >
                <button
                  type="button"
                  aria-label={`Decrease ${addOn.name}`}
                  disabled={quantity === 0}
                  onClick={() => setQuantity(addOn, quantity - 1)}
                  className="relative grid size-4 cursor-pointer place-items-center rounded-full bg-grey-200 text-grey-500 outline-none after:absolute after:-inset-1 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed"
                >
                  <Minus aria-hidden className="size-2.5" strokeWidth={3} />
                </button>
                <span
                  aria-live="polite"
                  className="min-w-2 text-center text-body-10-bold text-grey-800"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label={`Increase ${addOn.name}`}
                  disabled={quantity >= max}
                  onClick={() => setQuantity(addOn, quantity + 1)}
                  className="relative grid size-4 cursor-pointer place-items-center rounded-full bg-primary text-grey-50 outline-none after:absolute after:-inset-1 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-grey-200 disabled:text-grey-500"
                >
                  <Plus aria-hidden className="size-2.5" strokeWidth={3} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </BookingDialogFrame>
  );
}
