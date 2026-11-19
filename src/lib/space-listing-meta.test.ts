import assert from "node:assert/strict";
import { test } from "node:test";

import { getListingMeta } from "./space-listing-meta.ts";
import { getSearchMode, parseSpaceSearch } from "./space-search.ts";

const meta = (raw: Parameters<typeof parseSpaceSearch>[0]) => {
  const query = parseSpaceSearch(raw);
  return getListingMeta(query, getSearchMode(query));
};

test("/spaces is indexable with a clean canonical", () => {
  const result = meta({});
  assert.equal(result.title, "All Spaces");
  assert.equal(result.canonical, "/spaces");
  assert.equal(result.indexable, true);
});

test("each single type is indexable with its own title and canonical", () => {
  const cases = [
    ["private-office", "Private Offices"],
    ["coworking", "Co-Working Spaces"],
    ["meeting-room", "Meeting Rooms"],
    ["event-space", "Event Spaces"],
  ] as const;
  for (const [type, title] of cases) {
    const result = meta({ type });
    assert.equal(result.title, title);
    assert.equal(result.canonical, `/spaces?type=${type}`);
    assert.equal(result.indexable, true);
  }
});

test("a search is noindex and canonicalises to the clean listing", () => {
  const result = meta({
    city: "Bandung",
    from: "2026-11-20",
    to: "2026-11-21",
  });
  assert.equal(result.title, "Search Results in Bandung");
  assert.equal(result.indexable, false);
  assert.equal(result.canonical, "/spaces");
});

test("a search with one type canonicalises to that category", () => {
  const result = meta({ city: "Jakarta", type: "coworking" });
  assert.equal(result.indexable, false);
  assert.equal(result.canonical, "/spaces?type=coworking");
});

test("See More pages (limit) are noindex but keep the category canonical", () => {
  const result = meta({ type: "coworking", limit: "12" });
  assert.equal(result.indexable, false);
  assert.equal(result.canonical, "/spaces?type=coworking");
});

test("several types are noindex and canonicalise to /spaces", () => {
  const result = meta({ type: ["coworking", "meeting-room"] });
  assert.equal(result.indexable, false);
  assert.equal(result.canonical, "/spaces");
  assert.equal(result.title, "All Spaces");
});

test("garbage params still produce the plain listing meta", () => {
  const result = meta({ type: "x", limit: "abc", from: "zzz" });
  assert.equal(result.canonical, "/spaces");
  assert.equal(result.indexable, true);
});
