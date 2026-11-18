import type { SpacePrices } from "../types/space.ts";

export type BookingDuration =
  { kind: "hours"; minutes: number } | { kind: "days"; days: number };

const WEEK_DAYS = 7;
const MONTH_DAYS = 30;

/**
 * Price for `days` whole calendar days (counting both the first and last day).
 *
 * Cheapest-for-the-customer rule: the lowest cost of covering at least `days`
 * days with day, week and month units. That combines tiers (10 days = 1 week +
 * 3 days) and rounds up when a bigger tier is cheaper (6 days = 1 week), and it
 * never exceeds `days x daily`.
 */
export function priceForDays(days: number, tiers: SpacePrices): number {
  // cost[n] = cheapest way to cover n days; units may overshoot (clamped to 0).
  const cost = [0];
  for (let n = 1; n <= days; n++) {
    cost[n] = Math.min(
      cost[n - 1] + tiers.daily,
      cost[Math.max(0, n - WEEK_DAYS)] + tiers.weekly,
      cost[Math.max(0, n - MONTH_DAYS)] + tiers.monthly,
    );
  }
  return cost[Math.max(0, days)];
}

export function calculateBookingTotal(
  tiers: SpacePrices,
  duration: BookingDuration,
): number {
  if (duration.kind === "days") return priceForDays(duration.days, tiers);
  // Hours are prorated in 30-minute steps and capped at the daily rate.
  const byHour = Math.round((duration.minutes / 60) * tiers.hourly);
  return Math.min(byHour, tiers.daily);
}
