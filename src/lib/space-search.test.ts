import assert from "node:assert/strict";
import { test } from "node:test";

import type { Space } from "../types/space.ts";
import {
  filterSpaces,
  getSearchMode,
  PAGE_SIZE,
  paginate,
  parseSpaceSearch,
  spaceHref,
  toSearchString,
} from "./space-search.ts";

const space = (over: Partial<Space>): Space => ({
  id: "a",
  slug: "a",
  name: "A",
  type: "meeting-room",
  categoryLabel: "Meeting Room",
  capacity: 4,
  city: "Jakarta",
  region: "South Jakarta",
  pin: { x: 10, y: 10 },
  image: { src: "/x.webp", alt: "x" },
  price: { unit: "daily", amount: 1 },
  secondaryPrice: { unit: "hourly", amount: 1 },
  ...over,
});

test("empty params give no filters and the default limit", () => {
  assert.deepEqual(parseSpaceSearch({}), { types: [], limit: PAGE_SIZE });
});

test("repeated type params are collected, deduped, and unknown ones dropped", () => {
  const query = parseSpaceSearch({
    type: ["coworking", "nope", "coworking", "meeting-room"],
  });
  assert.deepEqual(query.types, ["coworking", "meeting-room"]);
});

test("a single type param works and event-space is a known type", () => {
  assert.deepEqual(parseSpaceSearch({ type: "event-space" }).types, [
    "event-space",
  ]);
});

test("city is matched case-insensitively and normalised; unknown cities are dropped", () => {
  assert.equal(parseSpaceSearch({ city: "jakarta" }).city, "Jakarta");
  assert.equal(parseSpaceSearch({ city: "Atlantis" }).city, undefined);
});

test("region is ignored without a city", () => {
  assert.equal(parseSpaceSearch({ region: "Kuta" }).region, undefined);
  assert.equal(
    parseSpaceSearch({ city: "Bali", region: "Kuta" }).region,
    "Kuta",
  );
});

test('region "all" (the Region select\'s default) means no region filter', () => {
  assert.equal(
    parseSpaceSearch({ city: "Bali", region: "all" }).region,
    undefined,
  );
  assert.equal(
    parseSpaceSearch({ city: "Bali", region: "All" }).region,
    undefined,
  );
});

test("dates need both ends, valid, with from <= to", () => {
  const ok = parseSpaceSearch({ from: "2026-11-20", to: "2026-11-22" });
  assert.equal(ok.from, "2026-11-20");
  assert.equal(ok.to, "2026-11-22");

  const sameDay = parseSpaceSearch({ from: "2026-11-20", to: "2026-11-20" });
  assert.equal(sameDay.from, "2026-11-20");

  for (const raw of [
    { from: "2026-02-30", to: "2026-03-01" },
    { from: "2026-11-22", to: "2026-11-20" },
    { from: "2026-11-20" },
    { to: "2026-11-20" },
    { from: "soon", to: "later" },
  ]) {
    const query = parseSpaceSearch(raw);
    assert.equal(query.from, undefined, JSON.stringify(raw));
    assert.equal(query.to, undefined, JSON.stringify(raw));
  }
});

test("limit is clamped to [PAGE_SIZE, 60] and garbage falls back to the default", () => {
  assert.equal(parseSpaceSearch({ limit: "12" }).limit, 12);
  assert.equal(parseSpaceSearch({ limit: "1" }).limit, PAGE_SIZE);
  assert.equal(parseSpaceSearch({ limit: "9999" }).limit, 60);
  assert.equal(parseSpaceSearch({ limit: "abc" }).limit, PAGE_SIZE);
});

test("array-valued scalar params use the first value", () => {
  assert.equal(parseSpaceSearch({ city: ["Bali", "Jakarta"] }).city, "Bali");
});

test("mode: city or dates is a search, one type is a category, else all", () => {
  assert.equal(getSearchMode(parseSpaceSearch({ city: "Jakarta" })), "search");
  assert.equal(
    getSearchMode(parseSpaceSearch({ from: "2026-11-20", to: "2026-11-21" })),
    "search",
  );
  assert.equal(
    getSearchMode(parseSpaceSearch({ type: "coworking" })),
    "category",
  );
  assert.equal(
    getSearchMode(parseSpaceSearch({ type: ["coworking", "meeting-room"] })),
    "all",
  );
  assert.equal(getSearchMode(parseSpaceSearch({})), "all");
  // A city makes it a search even with one type (the hero form always sends a city).
  assert.equal(
    getSearchMode(parseSpaceSearch({ city: "Jakarta", type: "coworking" })),
    "search",
  );
});

test("filterSpaces matches city, region and ORs the types, keeping order", () => {
  const list = [
    space({ id: "1", type: "coworking" }),
    space({ id: "2", type: "meeting-room", city: "Bali", region: "Kuta" }),
    space({ id: "3", type: "private-office", region: "Central Jakarta" }),
  ];
  const ids = (query: Parameters<typeof filterSpaces>[1]) =>
    filterSpaces(list, query).map((s) => s.id);

  assert.deepEqual(ids({ types: [], limit: 6 }), ["1", "2", "3"]);
  assert.deepEqual(ids({ city: "Jakarta", types: [], limit: 6 }), ["1", "3"]);
  assert.deepEqual(
    ids({ city: "Jakarta", region: "Central Jakarta", types: [], limit: 6 }),
    ["3"],
  );
  assert.deepEqual(ids({ types: ["coworking", "private-office"], limit: 6 }), [
    "1",
    "3",
  ]);
  assert.deepEqual(ids({ city: "Surabaya", types: [], limit: 6 }), []);
});

test("paginate slices by limit and reports the next limit", () => {
  const items = Array.from({ length: 14 }, (_, i) => space({ id: String(i) }));
  const page = paginate(items, 6);
  assert.equal(page.items.length, 6);
  assert.equal(page.total, 14);
  assert.equal(page.hasMore, true);
  assert.equal(page.nextLimit, 12);
  assert.equal(paginate(items, 18).hasMore, false);
  assert.equal(paginate(items, 60).nextLimit, 60);
});

test("toSearchString omits defaults and keeps a stable param order", () => {
  assert.equal(toSearchString({ types: [], limit: PAGE_SIZE }), "");
  assert.equal(
    toSearchString({
      city: "Jakarta",
      region: "South Jakarta",
      from: "2026-11-20",
      to: "2026-11-21",
      types: ["coworking", "meeting-room"],
      limit: 12,
    }),
    "?city=Jakarta&region=South+Jakarta&from=2026-11-20&to=2026-11-21&type=coworking&type=meeting-room&limit=12",
  );
  assert.equal(
    toSearchString({ types: ["coworking"], limit: PAGE_SIZE }, { limit: 12 }),
    "?type=coworking&limit=12",
  );
});

test("spaceHref carries valid dates to the space page and nothing else", () => {
  assert.equal(
    spaceHref("suite-7-view", { types: [], limit: PAGE_SIZE }),
    "/spaces/suite-7-view",
  );
  assert.equal(
    spaceHref("suite-7-view", {
      city: "Jakarta",
      from: "2026-11-20",
      to: "2026-11-21",
      types: ["coworking"],
      limit: 12,
    }),
    "/spaces/suite-7-view?from=2026-11-20&to=2026-11-21",
  );
});
