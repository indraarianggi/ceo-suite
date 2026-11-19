"use client";

import { cn } from "cn";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { birthDateToLocalDate, formatBirthDate } from "@/lib/validation";

// react-day-picker is only needed once the popover opens, so keep it out of the initial bundle.
const Calendar = dynamic(
  () => import("@/components/ui/calendar").then((module) => module.Calendar),
  { loading: () => <div className="h-72 w-72" aria-hidden /> },
);

const EARLIEST_YEAR = 1900;
/** With no value yet, open a few decades back so the year dropdown starts near a typical birth year. */
const DEFAULT_YEARS_AGO = 25;

type DateOfBirthPickerProps = {
  id: string;
  /** DD/MM/YYYY, or "" when nothing is selected. */
  value: string;
  onChange: (value: string) => void;
  /** Called when the popover closes, so "touched" doesn't fire while the user is still picking. */
  onBlur?: () => void;
  invalid?: boolean;
  placeholder?: string;
  "aria-describedby"?: string;
  ref?: React.Ref<HTMLButtonElement>;
};

export function DateOfBirthPicker({
  id,
  value,
  onChange,
  onBlur,
  invalid,
  placeholder,
  ref,
  ...rest
}: DateOfBirthPickerProps) {
  const [open, setOpen] = useState(false);
  // Lazy init: this only mounts after the dialog opens, never during prerender.
  const [today] = useState(() => new Date());

  const selected = birthDateToLocalDate(value, today);
  const fallbackMonth = new Date(
    today.getFullYear() - DEFAULT_YEARS_AGO,
    today.getMonth(),
  );

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) onBlur?.();
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        ref={ref}
        id={id}
        aria-invalid={invalid || undefined}
        aria-describedby={rest["aria-describedby"]}
        className={cn(
          "flex h-12 w-full items-center justify-between gap-3 rounded-lg border border-input bg-white px-3 text-left text-body-13-regular text-grey-800 transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        )}
      >
        {value ? (
          <span>{value}</span>
        ) : (
          <span className="text-grey-400">{placeholder}</span>
        )}
        <CalendarDays
          aria-hidden
          className="size-5 shrink-0 text-product-800"
        />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-auto max-w-[calc(100vw-2rem)] gap-0 rounded-lg p-0 shadow-popover"
      >
        <Calendar
          mode="single"
          captionLayout="dropdown"
          weekStartsOn={1}
          startMonth={new Date(EARLIEST_YEAR, 0)}
          endMonth={today}
          disabled={{ after: today }}
          selected={selected}
          defaultMonth={selected ?? fallbackMonth}
          onSelect={(date) => {
            if (!date) return;
            onChange(formatBirthDate(date));
            handleOpenChange(false);
          }}
          className="p-3 [--cell-size:--spacing(9)]"
          formatters={{
            formatWeekdayName: (weekday) => format(weekday, "EEE"),
          }}
          classNames={{
            // Keep the dropdown layout (label + chevron on one line) from Calendar.
            caption_label:
              "flex items-center gap-1 rounded-sm text-body-13-bold text-grey-800 select-none [&>svg]:size-3.5 [&>svg]:text-grey-500",
            weekday: "flex-1 text-body-13-regular text-grey-800 select-none",
            today:
              "rounded-sm border border-product-800 bg-transparent text-foreground data-[selected=true]:border-transparent",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
