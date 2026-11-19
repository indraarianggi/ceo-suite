"use client";

import { useId, useState } from "react";
import type { DateRange } from "react-day-picker";

import {
  CityField,
  DateRangeField,
  SearchField,
  SpaceTypeField,
} from "@/components/shared/space-search-fields";
import { ALL_SPACE_TYPES } from "@/components/shared/space-type-select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSearchCard({ className }: { className?: string }) {
  const uid = useId();
  const [picked, setPicked] = useState<DateRange | undefined>();
  const [dateOpen, setDateOpen] = useState(false);
  const [spaceTypes, setSpaceTypes] = useState<string[]>([ALL_SPACE_TYPES]);

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
        <SearchField label="Select City" id={`${uid}-city`}>
          <CityField id={`${uid}-city`} defaultValue="Jakarta" />
        </SearchField>

        <SearchField label="Select Date" id={`${uid}-date`}>
          <DateRangeField
            id={`${uid}-date`}
            value={picked}
            onValueChange={setPicked}
            open={dateOpen}
            onOpenChange={setDateOpen}
            defaultToToday
          />
        </SearchField>

        <SearchField
          label="Space Type"
          id={`${uid}-type`}
          className="md:col-span-2 lg:col-span-1"
        >
          <SpaceTypeField
            id={`${uid}-type`}
            value={spaceTypes}
            onValueChange={setSpaceTypes}
          />
        </SearchField>
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
