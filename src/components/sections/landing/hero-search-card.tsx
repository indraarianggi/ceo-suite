"use client";

import { addDays, format, parseISO } from "date-fns";
import { CalendarDays, MapPin } from "lucide-react";
import { useId, useState, useSyncExternalStore } from "react";
import type { DateRange } from "react-day-picker";

import {
  ALL_SPACE_TYPES,
  SpaceTypeSelect,
} from "@/components/shared/space-type-select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allSpaceTypesLabel, cities, searchSpaceTypes } from "@/data/hero";
import { cn } from "@/lib/utils";

const DATE_LABEL_FORMAT = "EEE, d MMMM yyyy";

const cityItems = cities.map((city) => ({ value: city, label: city }));

const subscribeNever = () => () => {};
const readToday = () => format(new Date(), "yyyy-MM-dd");
const readNull = () => null;

type FieldProps = {
  label: string;
  id: string;
  children: React.ReactNode;
  className?: string;
};

function Field({ label, id, children, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <label htmlFor={id} className="text-heading-20-regular text-grey-800">
        {label}
      </label>
      {children}
    </div>
  );
}

export function HeroSearchCard({ className }: { className?: string }) {
  const uid = useId();
  const [picked, setPicked] = useState<DateRange | undefined>();
  const [dateOpen, setDateOpen] = useState(false);
  const [spaceTypes, setSpaceTypes] = useState<string[]>([ALL_SPACE_TYPES]);

  // The clock is an external value: the server snapshot is null (so the
  // prerendered shell never depends on "now" and hydration cannot mismatch),
  // the browser snapshot is today's date. Until the visitor picks dates the
  // field defaults to today -> tomorrow.
  const todayKey = useSyncExternalStore(subscribeNever, readToday, readNull);
  const today = todayKey ? parseISO(todayKey) : undefined;
  const range =
    picked ?? (today ? { from: today, to: addDays(today, 1) } : undefined);

  return (
    <form
      action="/spaces"
      method="get"
      aria-labelledby={`${uid}-title`}
      className={cn(
        "flex flex-col gap-6 rounded-2xl bg-product-100 p-4 sm:p-8",
        className,
      )}
    >
      <h2
        id={`${uid}-title`}
        className="text-heading-25-bold text-grey-950 sm:text-heading-31-bold"
      >
        Find your space now
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1">
        <Field label="Select City" id={`${uid}-city`}>
          <Select name="city" defaultValue="Jakarta" items={cityItems}>
            <SelectTrigger
              id={`${uid}-city`}
              className="h-14 w-full gap-4 rounded-lg border-border bg-white px-3 text-body-16-medium text-grey-700 data-[size=default]:h-14"
            >
              <MapPin className="text-primary" aria-hidden />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Select Date" id={`${uid}-date`}>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger
              id={`${uid}-date`}
              className={cn(
                "flex items-center rounded-lg border outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                "h-14 w-full gap-4 rounded-lg border-border bg-white px-3 text-body-16-medium text-grey-700 data-[size=default]:h-14",
                "gap-3 xs:gap-4",
              )}
            >
              <CalendarDays
                className="size-5 shrink-0 text-primary"
                aria-hidden
              />
              <span className="flex flex-wrap items-center gap-x-4 text-left">
                {range?.from ? (
                  <>
                    <span>{format(range.from, DATE_LABEL_FORMAT)}</span>
                    {range.to && (
                      <>
                        <span aria-hidden className="hidden xs:inline">
                          -
                        </span>
                        <span>{format(range.to, DATE_LABEL_FORMAT)}</span>
                      </>
                    )}
                  </>
                ) : (
                  <span className="text-muted-foreground">
                    Select date range
                  </span>
                )}
              </span>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="range"
                numberOfMonths={2}
                selected={range}
                onSelect={setPicked}
                disabled={today ? { before: today } : undefined}
              />
            </PopoverContent>
          </Popover>
          {range?.from && (
            <>
              <input
                type="hidden"
                name="from"
                value={format(range.from, "yyyy-MM-dd")}
              />
              {range.to && (
                <input
                  type="hidden"
                  name="to"
                  value={format(range.to, "yyyy-MM-dd")}
                />
              )}
            </>
          )}
        </Field>

        <Field
          label="Space Type"
          id={`${uid}-type`}
          className="md:col-span-2 lg:col-span-1"
        >
          <SpaceTypeSelect
            id={`${uid}-type`}
            options={searchSpaceTypes}
            value={spaceTypes}
            onValueChange={setSpaceTypes}
            allLabel={allSpaceTypesLabel}
          />
          {/* One `type` param per chosen type; "all" means no filter, so it sends none. */}
          {spaceTypes
            .filter((type) => type !== ALL_SPACE_TYPES)
            .map((type) => (
              <input key={type} type="hidden" name="type" value={type} />
            ))}
        </Field>
      </div>

      <Button
        type="submit"
        size="md"
        className="w-full lg:w-auto lg:min-w-41 lg:self-end"
      >
        Search
      </Button>
    </form>
  );
}
