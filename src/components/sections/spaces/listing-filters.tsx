"use client";

import { format, parseISO } from "date-fns";
import { Funnel } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import type { DateRange } from "react-day-picker";

import {
  ALL_CITIES,
  CityField,
  DateRangeField,
  RegionField,
  SearchField,
  SpaceTypeField,
} from "@/components/shared/space-search-fields";
import { ALL_SPACE_TYPES } from "@/components/shared/space-type-select";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  PAGE_SIZE,
  SPACE_TYPES,
  toSearchString,
  type SpaceSearchQuery,
} from "@/lib/space-search";
import { cn } from "@/lib/utils";
import type { City, SpaceType } from "@/types/space";

const ISO_FORMAT = "yyyy-MM-dd";

type FilterProps = {
  query: SpaceSearchQuery;
  showTypes: boolean;
};

/**
 * Local copy of the filters. Every change is pushed to the URL (the source of
 * truth), so results stay shareable and the Back button works. Parents remount
 * this with `key={search string}` so it re-syncs when the URL changes.
 */
function useListingFilters({ query, showTypes }: FilterProps) {
  const router = useRouter();
  const [city, setCity] = useState<City | typeof ALL_CITIES>(
    query.city ?? ALL_CITIES,
  );
  const [region, setRegion] = useState(query.region ?? "");
  const [types, setTypes] = useState<string[]>(
    query.types.length > 0 ? query.types : [ALL_SPACE_TYPES],
  );
  const [range, setRange] = useState<DateRange | undefined>(
    query.from && query.to
      ? { from: parseISO(query.from), to: parseISO(query.to) }
      : undefined,
  );
  const [dateOpen, setDateOpen] = useState(false);

  type Next = {
    city?: City | typeof ALL_CITIES;
    region?: string;
    types?: string[];
    range?: DateRange | undefined;
  };

  function push(next: Next = {}) {
    const nextCity = next.city ?? city;
    const nextRange = "range" in next ? next.range : range;
    const nextTypes = showTypes
      ? (next.types ?? types).filter((type): type is SpaceType =>
          (SPACE_TYPES as readonly string[]).includes(type),
        )
      : query.types;

    const nextQuery: SpaceSearchQuery = {
      types: nextTypes,
      limit: PAGE_SIZE, // a new filter starts again from the first page
    };
    if (nextCity !== ALL_CITIES) {
      nextQuery.city = nextCity;
      const nextRegion = next.region ?? region;
      if (nextRegion) nextQuery.region = nextRegion;
    }
    if (nextRange?.from && nextRange.to) {
      nextQuery.from = format(nextRange.from, ISO_FORMAT);
      nextQuery.to = format(nextRange.to, ISO_FORMAT);
    }
    router.replace(`/spaces${toSearchString(nextQuery)}`, { scroll: false });
  }

  return {
    city,
    region,
    types,
    range,
    dateOpen,
    setDateOpen,
    push,
    onCity(value: City | typeof ALL_CITIES) {
      setCity(value);
      setRegion(""); // regions belong to a city
      push({ city: value, region: "" });
    },
    onRegion(value: string) {
      const next = value === "all" ? "" : value;
      setRegion(next);
      push({ region: next });
    },
    onTypes(value: string[]) {
      setTypes(value);
      push({ types: value });
    },
    onRange(value: DateRange | undefined) {
      setRange(value);
      // Wait for both ends; a lone first click is only half a range.
      if (!value || (value.from && value.to)) {
        if (value) setDateOpen(false);
        push({ range: value });
      }
    },
  };
}

type FieldsProps = FilterProps & {
  variant: "bar" | "sheet";
  onSubmitted?: () => void;
};

function FilterForm({ query, showTypes, variant, onSubmitted }: FieldsProps) {
  const uid = useId();
  const filters = useListingFilters({ query, showTypes });
  const bar = variant === "bar";

  return (
    <form
      action="/spaces"
      method="get"
      aria-label="Filter spaces"
      onSubmit={(event) => {
        event.preventDefault();
        filters.push();
        onSubmitted?.();
      }}
      className={cn(
        "grid gap-4",
        bar && "md:grid-cols-2 xl:max-w-194 xl:grid-cols-3",
        !bar && "gap-6",
      )}
    >
      <SearchField label="Select City" id={`${uid}-city`}>
        <CityField
          id={`${uid}-city`}
          value={filters.city}
          onValueChange={filters.onCity}
          allLabel="All Cities"
        />
      </SearchField>

      <SearchField label="Select Region" id={`${uid}-region`}>
        {/* Without a city there are no regions to pick from. */}
        <RegionField
          id={`${uid}-region`}
          city={filters.city === ALL_CITIES ? "Jakarta" : filters.city}
          value={filters.region}
          onValueChange={filters.onRegion}
          disabled={filters.city === ALL_CITIES}
        />
      </SearchField>

      {showTypes && (
        <SearchField label="Space Type" id={`${uid}-type`}>
          <SpaceTypeField
            id={`${uid}-type`}
            value={filters.types}
            onValueChange={filters.onTypes}
          />
        </SearchField>
      )}

      <SearchField
        label="Select Date"
        id={`${uid}-date`}
        className={cn(
          bar && (showTypes ? "md:col-span-1" : "md:col-span-2"),
          bar && "xl:col-span-2 xl:max-w-122",
        )}
      >
        <DateRangeField
          id={`${uid}-date`}
          value={filters.range}
          onValueChange={filters.onRange}
          open={filters.dateOpen}
          onOpenChange={filters.setDateOpen}
          months={bar ? 2 : 1}
        />
      </SearchField>

      {/* Without JS nothing applies on change, so offer the submit the design omits. */}
      <noscript>
        <Button type="submit" size="md">
          Apply filters
        </Button>
      </noscript>
    </form>
  );
}

/** Inline filters under the page title (hidden on phones, where the sheet is used). */
export function ListingFilterBar(props: FilterProps) {
  return (
    <div className="max-md:hidden">
      <FilterForm {...props} variant="bar" />
    </div>
  );
}

/** The "Filter" pill from the design. It opens the same filters in a sheet. */
export function ListingFilterSheet(props: FilterProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "md" }),
          "h-12 shrink-0 rounded-4xl bg-white px-6 text-grey-800",
        )}
      >
        <Funnel aria-hidden className="size-6 fill-current" />
        Filter
      </SheetTrigger>
      <SheetContent side="right" className="gap-0">
        <SheetHeader>
          <SheetTitle className="text-heading-20-bold text-grey-950">
            Filter
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <FilterForm
            {...props}
            variant="sheet"
            onSubmitted={() => setOpen(false)}
          />
        </div>
        <SheetFooter>
          <SheetClose render={<Button size="md" className="w-full" />}>
            Show results
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
