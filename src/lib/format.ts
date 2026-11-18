export function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString("en-US")}`;
}

const priceUnitLabels = {
  hourly: "Hourly",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
} as const;

export function formatPriceUnit(unit: keyof typeof priceUnitLabels): string {
  return priceUnitLabels[unit];
}

export function formatPeople(count: number): string {
  return `${count} People`;
}

/** "Wisma GKBI, Jakarta" -> "Jakarta" (last comma-separated part). */
export function formatCity(locationName: string): string {
  return locationName.split(",").at(-1)?.trim() ?? locationName;
}

export function formatAddOnUnit(unit: string): string {
  return `/${unit}`;
}
