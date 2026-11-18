"use client";

import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";
import { CalendarDays } from "lucide-react";
import dynamic from "next/dynamic";
import { useState, useSyncExternalStore } from "react";

import { useBooking } from "@/components/sections/product/booking-provider";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// react-day-picker is only needed once the popover opens, so keep it out of the initial bundle.
const Calendar = dynamic(
  () => import("@/components/ui/calendar").then((module) => module.Calendar),
  { loading: () => <div className="h-80 w-72" aria-hidden /> },
);

const DURATIONS = [1, 7, 14, 30] as const;
const DATE_FORMAT = "EEEE, d MMMM yyyy";

const subscribeNever = () => () => {};
const readToday = () => format(new Date(), "yyyy-MM-dd");
const readNull = () => null;

function subscribeDesktop(onChange: () => void) {
  const query = window.matchMedia("(min-width: 768px)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const readDesktop = () => window.matchMedia("(min-width: 768px)").matches;
const readFalse = () => false;

type DatePickerFieldProps = { id: string };

export function DatePickerField({ id }: DatePickerFieldProps) {
  const { span, setSpan } = useBooking();
  const [open, setOpen] = useState(false);
  const [draftFrom, setDraftFrom] = useState<Date>();
  const [draftDays, setDraftDays] = useState<number>(1);

  // The clock is an external value: the server snapshot is null so the
  // prerendered shell never depends on "now" and hydration cannot mismatch.
  const todayKey = useSyncExternalStore(subscribeNever, readToday, readNull);
  const today = todayKey ? parseISO(todayKey) : undefined;
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    readDesktop,
    readFalse,
  );

  const draftRange = draftFrom
    ? { from: draftFrom, to: addDays(draftFrom, draftDays - 1) }
    : undefined;

  function handleOpenChange(next: boolean) {
    if (next) {
      // Seed the draft from the committed selection; closing without
      // confirming discards it.
      setDraftFrom(span?.from);
      setDraftDays(span ? differenceInCalendarDays(span.to, span.from) + 1 : 1);
    }
    setOpen(next);
  }

  function confirm() {
    if (draftRange) setSpan(draftRange);
    setOpen(false);
  }

  const label = span
    ? span.to > span.from
      ? `${format(span.from, DATE_FORMAT)} - ${format(span.to, DATE_FORMAT)}`
      : format(span.from, DATE_FORMAT)
    : null;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        id={id}
        aria-labelledby={`${id}-label ${id}`}
        className="flex h-14 w-full items-center gap-4 rounded-lg bg-white px-3 text-left text-body-13-medium text-grey-700 outline-none focus-visible:ring-3 focus-visible:ring-white/70"
      >
        <CalendarDays
          className="size-6 shrink-0 text-product-800"
          aria-hidden
        />
        {label ? (
          <span>{label}</span>
        ) : (
          <span className="text-grey-400">Select Date</span>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-auto max-w-[calc(100vw-2rem)] gap-0 rounded-lg p-0 shadow-popover"
      >
        <Calendar
          mode="range"
          numberOfMonths={isDesktop ? 2 : 1}
          weekStartsOn={1}
          selected={draftRange}
          onDayClick={(day) => setDraftFrom(day)}
          disabled={today ? { before: today } : undefined}
          defaultMonth={draftFrom ?? today}
          className="p-3 [--cell-size:--spacing(9)]"
          formatters={{
            formatCaption: (month) => format(month, "MMM yyyy"),
            formatWeekdayName: (weekday) => format(weekday, "EEE"),
          }}
          classNames={{
            caption_label: "text-body-13-bold text-grey-800 select-none",
            weekday: "flex-1 text-body-13-regular text-grey-800 select-none",
            today:
              "rounded-sm border border-product-800 bg-transparent text-foreground data-[selected=true]:border-transparent",
          }}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-grey-100 px-3 py-2.5">
          <div
            role="group"
            aria-label="Booking length"
            className="flex flex-wrap items-center gap-2"
          >
            {DURATIONS.map((days) => (
              <button
                key={days}
                type="button"
                aria-pressed={draftDays === days}
                onClick={() => setDraftDays(days)}
                className={cn(
                  "rounded-4xl border px-3 py-1.5 text-body-13-regular outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  draftDays === days
                    ? "border-product-600 text-product-600"
                    : "border-grey-100 text-grey-500 hover:border-grey-200",
                )}
              >
                {days} {days === 1 ? "Day" : "Days"}
              </button>
            ))}
          </div>
          <Button
            type="button"
            onClick={confirm}
            disabled={!draftRange}
            className="h-7 rounded-sm px-3 text-body-13-medium"
          >
            Select Date
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
