import type { City } from "../types/space.ts";

/** Districts offered by the listing's Region filter, per city. */
export const regionsByCity: Record<City, readonly string[]> = {
  Jakarta: ["Central Jakarta", "South Jakarta", "West Jakarta"],
  Bandung: ["Coblong", "Cicendo"],
  Surabaya: ["Surabaya Pusat", "Surabaya Barat"],
  Bali: ["Kuta", "Seminyak"],
};
