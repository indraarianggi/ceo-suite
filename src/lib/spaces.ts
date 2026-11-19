import { cacheLife } from "next/cache";

import { spaceDetails } from "@/data/space-details";
import { recommendedSpaces, spaceCategories } from "@/data/spaces";
import { filterSpaces, type SpaceSearchQuery } from "@/lib/space-search";
import type { Space, SpaceCategory, SpaceDetail } from "@/types/space";

export async function getSpaceCategories(): Promise<SpaceCategory[]> {
  "use cache";
  cacheLife("hours");
  return spaceCategories;
}

export async function getRecommendedSpaces(): Promise<Space[]> {
  "use cache";
  cacheLife("hours");
  return recommendedSpaces;
}

export async function getSpaceSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  return spaceDetails.map((space) => space.slug);
}

export async function getSpaceBySlug(
  slug: string,
): Promise<SpaceDetail | null> {
  "use cache";
  cacheLife("hours");
  return spaceDetails.find((space) => space.slug === slug) ?? null;
}

/** MOCK ranking: first four other spaces in list order. A real API would rank by similarity. */
export async function getSimilarSpaces(slug: string): Promise<Space[]> {
  "use cache";
  cacheLife("hours");
  return spaceDetails.filter((space) => space.slug !== slug).slice(0, 4);
}

/**
 * Listing search. The parsed query is the cache key, so each distinct
 * filter combination is cached once. A real API would take the same query.
 */
export async function searchSpaces(query: SpaceSearchQuery): Promise<Space[]> {
  "use cache";
  cacheLife("hours");
  return filterSpaces(spaceDetails, query);
}
