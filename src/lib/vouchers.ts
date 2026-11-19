import { cacheLife } from "next/cache";

import { vouchers } from "@/data/vouchers";
import type { Voucher } from "@/types/booking";

export async function getVouchers(): Promise<Voucher[]> {
  "use cache";
  cacheLife("hours");
  return vouchers;
}
