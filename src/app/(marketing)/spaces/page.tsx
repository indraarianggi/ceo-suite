import type { Metadata } from "next";
import { Suspense } from "react";

import { CategoryIntroSection } from "@/components/sections/spaces/category-intro";
import { ListingFilterBar } from "@/components/sections/spaces/listing-filters";
import { ListingHeroSection } from "@/components/sections/spaces/listing-hero";
import { ListingMap } from "@/components/sections/spaces/listing-map";
import { ListingResults } from "@/components/sections/spaces/listing-results";
import { OtherSpacesSection } from "@/components/sections/spaces/other-spaces-section";
import {
  categoryIntros,
  type ListingView,
  listingHeroes,
  searchResultsTitle,
} from "@/data/spaces-listing";
import { getListingMeta } from "@/lib/space-listing-meta";
import {
  getSearchMode,
  paginate,
  parseSpaceSearch,
  toSearchString,
} from "@/lib/space-search";
import { siteConfig } from "@/lib/site-config";
import { searchSpaces } from "@/lib/spaces";
import { jsonLdString, listingJsonLd } from "@/lib/structured-data";
import type { SpaceType } from "@/types/space";

function getView(types: SpaceType[], isCategory: boolean): ListingView {
  return isCategory ? types[0] : "all";
}

export async function generateMetadata(
  props: PageProps<"/spaces">,
): Promise<Metadata> {
  const query = parseSpaceSearch(await props.searchParams);
  const mode = getSearchMode(query);
  const meta = getListingMeta(query, mode);
  const image = listingHeroes[getView(query.types, mode === "category")].image;

  // The root layout's title template appends "| CEO SUITE".
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: meta.canonical },
    // Searches and filtered views stay out of the index but their links are followed.
    robots: meta.indexable ? undefined : { index: false, follow: true },
    openGraph: {
      type: "website",
      url: meta.canonical,
      siteName: siteConfig.name,
      title: meta.title,
      description: meta.description,
      images: [{ url: image.src, alt: image.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [image.src],
    },
  };
}

type SpacesPageProps = PageProps<"/spaces">;

/** Shown while a client navigation waits for the results. */
function SpacesFallback() {
  return (
    <main className="flex-1 bg-white" aria-busy="true">
      <div className="h-64 animate-pulse bg-grey-100 motion-reduce:animate-none md:h-80 xl:h-99.5" />
      <div className="page-container grid gap-4 py-12 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="h-80 animate-pulse rounded-lg bg-grey-100 motion-reduce:animate-none"
          />
        ))}
      </div>
    </main>
  );
}

// The page stays synchronous: reading `searchParams` (URL data) happens inside
// the Suspense boundary, so navigating here renders the shell instantly while
// the results stream.
export default function SpacesPage(props: SpacesPageProps) {
  return (
    <Suspense fallback={<SpacesFallback />}>
      <SpacesContent searchParams={props.searchParams} />
    </Suspense>
  );
}

async function SpacesContent({
  searchParams,
}: {
  searchParams: SpacesPageProps["searchParams"];
}) {
  const query = parseSpaceSearch(await searchParams);
  const mode = getSearchMode(query);
  const view = getView(query.types, mode === "category");
  const meta = getListingMeta(query, mode);

  const matches = await searchSpaces(query);
  const page = paginate(matches, query.limit);
  const filtersKey = toSearchString(query);

  return (
    <main className="flex-1 bg-white">
      {meta.indexable && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdString(
              listingJsonLd(page.items, meta.title, meta.canonical),
            ),
          }}
        />
      )}

      {mode !== "search" && <ListingHeroSection hero={listingHeroes[view]} />}
      {mode === "category" && view !== "all" && (
        <CategoryIntroSection intro={categoryIntros[view]} />
      )}

      <div id="results" className="scroll-mt-18 xl:flex xl:scroll-mt-28">
        <div className="flex min-w-0 page-gutter-start flex-col gap-10 py-8 pe-4 md:pe-8 xl:flex-1 xl:gap-12 xl:py-12 xl:pe-20">
          {mode === "search" && (
            <h1 className="text-heading-31-bold text-grey-950">
              {searchResultsTitle}
            </h1>
          )}
          <ListingFilterBar
            key={filtersKey}
            query={query}
            showTypes={mode !== "category"}
          />
          <ListingResults query={query} mode={mode} view={view} page={page} />
        </div>
        <div className="px-4 pb-12 md:px-8 xl:w-83/240 xl:shrink-0 xl:p-0">
          <ListingMap spaces={page.items} priority={mode === "search"} />
        </div>
      </div>

      <OtherSpacesSection />
    </main>
  );
}
