"use client";

import { addDays, format, parseISO } from "date-fns";
import { CalendarDays, MapPin } from "lucide-react";
import { useSyncExternalStore } from "react";
import type { DateRange } from "react-day-picker";

import {
  ALL_SPACE_TYPES,
  SpaceTypeSelect,
} from "@/components/shared/space-type-select";
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
import { regionsByCity } from "@/data/regions";
import { cn } from "@/lib/utils";
import type { City } from "@/types/space";

const DATE_LABEL_FORMAT = "EEE, d MMMM yyyy";
const ISO_FORMAT = "yyyy-MM-dd";

const cityItems = cities.map((city) => ({ value: city, label: city }));

const subscribeNever = () => () => {};
const readToday = () => format(new Date(), ISO_FORMAT);
const readNull = () => null;

export const ALL_REGIONS = "all";

type FieldProps = {
  label: string;
  id: string;
  children: React.ReactNode;
  className?: string;
};

/** Label above a control, in the Figma "Select …" style. */
export function SearchField({ label, id, children, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <label htmlFor={id} className="text-heading-20-regular text-grey-800">
        {label}
      </label>
      {children}
    </div>
  );
}

/** Value of the optional "all cities" item. */
export const ALL_CITIES = "all";

type CityFieldProps = {
  id: string;
  defaultValue?: City;
  value?: City | typeof ALL_CITIES;
  onValueChange?: (city: City | typeof ALL_CITIES) => void;
  /** Adds an "all cities" item with this label (the listing filters use it). */
  allLabel?: string;
};

export function CityField({
  id,
  defaultValue,
  value,
  onValueChange,
  allLabel,
}: CityFieldProps) {
  const items = allLabel
    ? [{ value: ALL_CITIES, label: allLabel }, ...cityItems]
    : cityItems;
  return (
    <Select
      name="city"
      items={items}
      defaultValue={
        value === undefined ? (defaultValue ?? "Jakarta") : undefined
      }
      value={value}
      onValueChange={(next) =>
        onValueChange?.(next as City | typeof ALL_CITIES)
      }
    >
      <SelectTrigger
        id={id}
        className="h-14 w-full gap-4 rounded-lg border-border bg-white px-3 text-body-16-medium text-grey-700 data-[size=default]:h-14"
      >
        <MapPin className="text-primary" aria-hidden />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

type RegionFieldProps = {
  id: string;
  city: City;
  value: string;
  onValueChange: (region: string) => void;
  disabled?: boolean;
};

export function RegionField({
  id,
  city,
  value,
  onValueChange,
  disabled,
}: RegionFieldProps) {
  const regions = regionsByCity[city];
  const items = [
    { value: ALL_REGIONS, label: "All" },
    ...regions.map((region) => ({ value: region, label: region })),
  ];
  return (
    <Select
      name="region"
      disabled={disabled}
      items={items}
      value={regions.includes(value) ? value : ALL_REGIONS}
      onValueChange={(next) => onValueChange(next as string)}
    >
      <SelectTrigger
        id={id}
        className="h-14 w-full gap-4 rounded-lg border-border bg-white px-3 text-body-16-medium text-grey-700 data-[size=default]:h-14"
      >
        <MapPin className="text-primary" aria-hidden />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

type DateRangeFieldProps = {
  id: string;
  value: DateRange | undefined;
  onValueChange: (range: DateRange | undefined) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Hero search: show today -> tomorrow until the visitor picks dates. */
  defaultToToday?: boolean;
  /** Months shown in the calendar; use 1 where 2 would overflow (narrow sheets). */
  months?: 1 | 2;
  className?: string;
};

export function DateRangeField({
  id,
  value,
  onValueChange,
  open,
  onOpenChange,
  defaultToToday = false,
  months = 2,
  className,
}: DateRangeFieldProps) {
  // The clock is an external value: the server snapshot is null (so the
  // prerendered shell never depends on "now" and hydration cannot mismatch),
  // the browser snapshot is today's date.
  const todayKey = useSyncExternalStore(subscribeNever, readToday, readNull);
  const today = todayKey ? parseISO(todayKey) : undefined;
  const range =
    value ??
    (defaultToToday && today
      ? { from: today, to: addDays(today, 1) }
      : undefined);

  return (
    <>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger
          id={id}
          className={cn(
            "flex items-center rounded-lg border outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "h-14 w-full gap-4 rounded-lg border-border bg-white px-3 text-body-16-medium text-grey-700 data-[size=default]:h-14",
            "gap-3 xs:gap-4",
            className,
          )}
        >
          <CalendarDays className="size-5 shrink-0 text-primary" aria-hidden />
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
              <span className="text-muted-foreground">Select date range</span>
            )}
          </span>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="range"
            numberOfMonths={months}
            selected={range}
            onSelect={onValueChange}
            disabled={today ? { before: today } : undefined}
          />
        </PopoverContent>
      </Popover>
      {range?.from && (
        <>
          <input
            type="hidden"
            name="from"
            value={format(range.from, ISO_FORMAT)}
          />
          {range.to && (
            <input
              type="hidden"
              name="to"
              value={format(range.to, ISO_FORMAT)}
            />
          )}
        </>
      )}
    </>
  );
}

type SpaceTypeFieldProps = {
  id: string;
  value: string[];
  onValueChange: (value: string[]) => void;
};

export function SpaceTypeField({
  id,
  value,
  onValueChange,
}: SpaceTypeFieldProps) {
  return (
    <>
      <SpaceTypeSelect
        id={id}
        options={searchSpaceTypes}
        value={value}
        onValueChange={onValueChange}
        allLabel={allSpaceTypesLabel}
      />
      {/* One `type` param per chosen type; "all" means no filter, so it sends none. */}
      {value
        .filter((type) => type !== ALL_SPACE_TYPES)
        .map((type) => (
          <input key={type} type="hidden" name="type" value={type} />
        ))}
    </>
  );
}
