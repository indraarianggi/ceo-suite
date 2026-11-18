export function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString("en-US")}`;
}

const priceUnitLabels = {
  hourly: "Hourly",
  daily: "Daily",
  weekly: "Weekly",
} as const;

export function formatPriceUnit(unit: keyof typeof priceUnitLabels): string {
  return priceUnitLabels[unit];
}

export function formatPeople(count: number): string {
  return `${count} People`;
}
