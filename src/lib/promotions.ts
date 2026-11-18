import { cacheLife } from "next/cache";

import {
  deals,
  promotions,
  type Deal,
  type Promotion,
} from "@/data/promotions";

export async function getPromotions(): Promise<Promotion[]> {
  "use cache";
  cacheLife("hours");
  return promotions;
}

export async function getDeals(): Promise<Deal[]> {
  "use cache";
  cacheLife("hours");
  return deals;
}
