import type { SpaceSearchMode, SpaceSearchQuery } from "./space-search.ts";
import { PAGE_SIZE } from "./space-search.ts";
import type { SpaceType } from "../types/space.ts";

export const typeTitles: Record<SpaceType, string> = {
  "private-office": "Private Offices",
  coworking: "Co-Working Spaces",
  "meeting-room": "Meeting Rooms",
  "event-space": "Event Spaces",
};

const typeDescriptions: Record<SpaceType, string> = {
  "private-office":
    "Private offices with privacy, focus and flexible terms. Book a dedicated workspace by the day or week.",
  coworking:
    "Co-working spaces with hot desks and dedicated desks, shared resources and a community of professionals.",
  "meeting-room":
    "Meeting rooms for any team size with the technology you need. Book by the hour or by the day.",
  "event-space":
    "Event spaces for seminars, workshops, classes and launches, with support from setup to execution.",
};

export type ListingMeta = {
  title: string;
  description: string;
  /** Path (with query) of the page search engines should index. */
  canonical: string;
  indexable: boolean;
};

/**
 * Only the plain listing and single-type category views are indexable.
 * Searches (city, region, dates), multi-type selections and "See More"
 * pages are `noindex, follow` and canonicalise to the nearest clean view, so
 * the endless filter permutations never become thin duplicate pages.
 */
export function getListingMeta(
  query: SpaceSearchQuery,
  mode: SpaceSearchMode,
): ListingMeta {
  const singleType = query.types.length === 1 ? query.types[0] : undefined;
  const canonical = singleType ? `/spaces?type=${singleType}` : "/spaces";
  const filtered = Boolean(
    query.city || query.region || query.from || query.limit !== PAGE_SIZE,
  );
  const indexable = !filtered && query.types.length <= 1;

  if (mode === "search") {
    const where = query.city ? ` in ${query.city}` : "";
    return {
      title: `Search Results${where}`,
      description: `Private offices, co-working spaces, meeting rooms and event spaces${where}. Book by the hour or by the day at CEO SUITE.`,
      canonical,
      indexable,
    };
  }

  if (singleType) {
    return {
      title: typeTitles[singleType],
      description: typeDescriptions[singleType],
      canonical,
      indexable,
    };
  }

  return {
    title: "All Spaces",
    description:
      "Explore top-rated private offices, co-working spaces, meeting rooms and event spaces. Best place to work together with your team.",
    canonical,
    indexable,
  };
}
