import { cacheLife } from "next/cache";

import { recommendedSpaces, spaceCategories } from "@/data/spaces";
import type { Space, SpaceCategory } from "@/types/space";

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
