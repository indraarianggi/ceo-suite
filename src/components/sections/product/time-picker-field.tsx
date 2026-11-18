"use client";

import { Clock } from "lucide-react";
import { useMemo, useState } from "react";

import { useBooking } from "@/components/sections/product/booking-provider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BOOKING_HOURS,
  buildTimeSlots,
  formatTimeField,
  toMinutes,
} from "@/lib/booking";
import { cn } from "@/lib/utils";

type TimePickerFieldProps = { id: string };

/**
 * Two steps in one list: the first click picks the start time, then the list
 * shows only later slots and the second click picks the end time.
 */
export function TimePickerField({ id }: TimePickerFieldProps) {
  const { time, setTime } = useBooking();
  const [open, setOpen] = useState(false);
  const [pendingStart, setPendingStart] = useState<string>();

  const slots = useMemo(
    () => buildTimeSlots(BOOKING_HOURS.open, BOOKING_HOURS.close),
    [],
  );
  const choosingEnd = pendingStart !== undefined;
  const options = choosingEnd
    ? slots.filter((slot) => toMinutes(slot) > toMinutes(pendingStart))
    : slots.slice(0, -1); // the closing time cannot be a start time

  function handleOpenChange(next: boolean) {
    setPendingStart(undefined);
    setOpen(next);
  }

  function pick(slot: string) {
    if (!choosingEnd) {
      setPendingStart(slot);
      return;
    }
    setTime({ start: pendingStart, end: slot });
    setOpen(false);
  }

  const startLabel = pendingStart
    ? formatTimeField(pendingStart)
    : "Start Time";
  const label = open ? (
    <span className="flex items-center gap-2">
      <span className={pendingStart ? "text-grey-700" : "text-grey-400"}>
        {startLabel}
      </span>
      <span className="text-grey-400">-</span>
      <span className="text-grey-400">End Time</span>
    </span>
  ) : time ? (
    <span>
      {formatTimeField(time.start)} - {formatTimeField(time.end)}
    </span>
  ) : (
    <span className="text-grey-400">Select Time</span>
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        id={id}
        aria-labelledby={`${id}-label ${id}`}
        className="flex h-14 w-full items-center gap-4 rounded-lg bg-white px-3 text-left text-body-13-medium text-grey-700 outline-none focus-visible:ring-3 focus-visible:ring-white/70"
      >
        <Clock className="size-6 shrink-0 text-product-800" aria-hidden />
        {label}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-auto gap-2 rounded-lg p-3 shadow-popover"
      >
        <p className="sr-only" aria-live="polite">
          {choosingEnd ? "Choose an end time" : "Choose a start time"}
        </p>
        <ul className="flex max-h-68 w-52 flex-col gap-2 overflow-y-auto">
          {options.map((slot) => {
            const selected =
              slot === pendingStart ||
              (!choosingEnd && time !== undefined && slot === time.start);
            return (
              <li key={slot}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => pick(slot)}
                  className={cn(
                    "flex h-8 w-full items-center rounded-sm px-2 text-body-13-medium text-grey-700 outline-none hover:bg-grey-50 focus-visible:ring-3 focus-visible:ring-ring/50",
                    selected && "bg-grey-100",
                  )}
                >
                  {slot}
                </button>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
