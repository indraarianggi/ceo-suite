import { isValid, parse } from "date-fns";

import { cities } from "../data/hero.ts";
import type { City, Space, SpaceType } from "../types/space.ts";

export const SPACE_TYPES: readonly SpaceType[] = [
  "private-office",
  "coworking",
  "meeting-room",
  "event-space",
];

export const PAGE_SIZE = 6;
export const MAX_LIMIT = 60;

type RawParams = Record<string, string | string[] | undefined>;

export type SpaceSearchQuery = {
  city?: City;
  region?: string;
  from?: string;
  to?: string;
  types: SpaceType[];
  limit: number;
};

/**
 * - `search`: the visitor came from a search (city/dates) -> "Search Results"
 * - `category`: exactly one type, no search -> hero + intro for that type
 * - `all`: everything else -> "All Spaces"
 */
export type SpaceSearchMode = "search" | "all" | "category";

function list(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

/** `?a=1&a=2` arrives as an array; the first value wins. */
function first(value: string | string[] | undefined): string | undefined {
  return list(value)[0]?.trim() || undefined;
}

/** `parse` needs a reference date but a full yyyy-MM-dd ignores it; a constant keeps this pure (no clock read). */
const PARSE_REFERENCE = new Date(2000, 0, 1);

function isIsoDate(value: string | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return isValid(parse(value, "yyyy-MM-dd", PARSE_REFERENCE));
}

/**
 * Parses `/spaces?city=…&region=…&from=…&to=…&type=…&type=…&limit=…`.
 *
 * The URL is user-editable and a listing should never 404, so invalid values
 * are dropped (the page falls back to "no filter") instead of reported.
 */
export function parseSpaceSearch(raw: RawParams): SpaceSearchQuery {
  const query: SpaceSearchQuery = { types: [], limit: PAGE_SIZE };

  const cityInput = first(raw.city)?.toLowerCase();
  const city = cities.find((name) => name.toLowerCase() === cityInput);
  if (city) {
    query.city = city;
    const region = first(raw.region);
    // "all" is the Region select's default; without JS the form submits it as-is.
    if (region && region.toLowerCase() !== "all") query.region = region;
  }

  const from = first(raw.from);
  const to = first(raw.to);
  // ISO dates sort lexically, so a string compare is a date compare.
  if (isIsoDate(from) && isIsoDate(to) && from <= to) {
    query.from = from;
    query.to = to;
  }

  query.types = [...new Set(list(raw.type))].filter((type): type is SpaceType =>
    (SPACE_TYPES as readonly string[]).includes(type),
  );

  const limit = Number.parseInt(first(raw.limit) ?? "", 10);
  if (Number.isFinite(limit)) {
    query.limit = Math.min(MAX_LIMIT, Math.max(PAGE_SIZE, limit));
  }

  return query;
}

export function getSearchMode(query: SpaceSearchQuery): SpaceSearchMode {
  if (query.city || query.from) return "search";
  return query.types.length === 1 ? "category" : "all";
}

/** Order is preserved: the data order is the curated ("top-rated") order. */
export function filterSpaces(
  spaces: readonly Space[],
  query: SpaceSearchQuery,
): Space[] {
  return spaces.filter(
    (space) =>
      (!query.city || space.city === query.city) &&
      (!query.region || space.region === query.region) &&
      (query.types.length === 0 || query.types.includes(space.type)),
  );
}

export function paginate<T>(items: readonly T[], limit: number) {
  return {
    items: items.slice(0, limit),
    total: items.length,
    hasMore: items.length > limit,
    nextLimit: Math.min(MAX_LIMIT, limit + PAGE_SIZE),
  };
}

/** Query string (with the leading `?`, or "" when empty) for a query plus overrides. */
export function toSearchString(
  query: SpaceSearchQuery,
  overrides: Partial<SpaceSearchQuery> = {},
): string {
  const merged = { ...query, ...overrides };
  const params = new URLSearchParams();
  if (merged.city) params.set("city", merged.city);
  if (merged.region) params.set("region", merged.region);
  if (merged.from && merged.to) {
    params.set("from", merged.from);
    params.set("to", merged.to);
  }
  for (const type of merged.types) params.append("type", type);
  if (merged.limit !== PAGE_SIZE) params.set("limit", String(merged.limit));
  const search = params.toString();
  return search ? `?${search}` : "";
}

/** Link to a space page; the searched dates ride along so the page can prefill them later. */
export function spaceHref(slug: string, query: SpaceSearchQuery): string {
  const params = new URLSearchParams();
  if (query.from && query.to) {
    params.set("from", query.from);
    params.set("to", query.to);
  }
  const search = params.toString();
  return `/spaces/${slug}${search ? `?${search}` : ""}`;
}
