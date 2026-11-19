import Link from "next/link";

import { SectionHeading } from "@/components/shared/section-heading";
import { SpaceCard } from "@/components/shared/space-card";
import { ListingFilterSheet } from "@/components/sections/spaces/listing-filters";
import { buttonVariants } from "@/components/ui/button";
import { type ListingView, resultsHeadings } from "@/data/spaces-listing";
import {
  PAGE_SIZE,
  spaceHref,
  toSearchString,
  type SpaceSearchMode,
  type SpaceSearchQuery,
} from "@/lib/space-search";
import { cn } from "@/lib/utils";
import type { Space } from "@/types/space";

type ListingResultsProps = {
  query: SpaceSearchQuery;
  mode: SpaceSearchMode;
  view: ListingView;
  page: { items: Space[]; total: number; hasMore: boolean; nextLimit: number };
};

function describeResults(total: number, query: SpaceSearchQuery): string {
  const noun = total === 1 ? "space" : "spaces";
  const where = query.city ? ` in ${query.region ?? query.city}` : "";
  return `${total} ${noun} found${where}`;
}

export function ListingResults({
  query,
  mode,
  view,
  page,
}: ListingResultsProps) {
  const { items, total, hasMore, nextLimit } = page;
  const heading = resultsHeadings[view];
  // A category keeps its type when filters are reset; a search starts over.
  const resetHref = `/spaces${toSearchString({
    types: mode === "category" ? query.types : [],
    limit: PAGE_SIZE,
  })}`;

  return (
    <section aria-labelledby="results-title" className="flex flex-col gap-8">
      <SectionHeading
        id="results-title"
        title={heading.title}
        description={heading.subtitle}
        gap="sm"
        action={
          <ListingFilterSheet
            key={toSearchString(query)}
            query={query}
            showTypes={mode !== "category"}
          />
        }
      />

      <p role="status" className="sr-only">
        {describeResults(total, query)}
      </p>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg bg-white px-6 py-12 text-center shadow-card">
          <h3 className="text-heading-25-bold text-grey-800">
            No spaces match your filters
          </h3>
          <p className="text-body-16-regular text-grey-600">
            Try another city or region, or clear the filters to see every space.
          </p>
          <Link
            href={resetHref}
            className={cn(buttonVariants({ size: "xl" }), "h-12 px-8")}
          >
            Reset filters
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {items.map((space, index) => (
            <li
              key={space.id}
              id={`space-${space.id}`}
              className="flex min-w-0 scroll-mt-22 flex-col rounded-lg target:ring-3 target:ring-ring/50 xl:scroll-mt-32"
            >
              <SpaceCard
                space={space}
                href={spaceHref(space.slug, query)}
                priority={index < 3}
              />
            </li>
          ))}
        </ul>
      )}

      {hasMore && (
        <Link
          href={`/spaces${toSearchString(query, { limit: nextLimit })}`}
          scroll={false}
          className={cn(
            buttonVariants({ size: "xl" }),
            "h-14 self-center px-12",
          )}
        >
          See More
        </Link>
      )}
    </section>
  );
}
