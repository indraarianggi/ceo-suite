import { format } from "date-fns";

import type {
  AddOnChoice,
  BookingQuote,
  QuoteLine,
  Voucher,
} from "../types/booking.ts";
import type { AddOn, SpacePrices, SpaceType } from "../types/space.ts";
import { formatAddOnUnit } from "./format.ts";
import { calculateBookingTotal, type BookingDuration } from "./pricing.ts";

/** Ceiling for any single add-on line (per-pax add-ons are capped at capacity instead). */
export const MAX_ADD_ON_QUANTITY = 99;

export type ResolvedAddOn = { addOn: AddOn; quantity: number };

/** Per-pax add-ons can't outnumber the people the room holds. */
export function maxAddOnQuantity(addOn: AddOn, capacity: number): number {
  return addOn.unit === "pax"
    ? Math.min(Math.max(1, capacity), MAX_ADD_ON_QUANTITY)
    : MAX_ADD_ON_QUANTITY;
}

/**
 * Turns the visitor's raw choices into trustworthy line items: unknown ids,
 * zero/negative/fractional quantities are dropped, per-pax add-ons can't
 * exceed the room's capacity, and the result follows catalog order so the
 * order summary reads the same however the choices were made.
 */
export function resolveAddOns(
  choices: AddOnChoice[],
  catalog: AddOn[],
  capacity: number,
): ResolvedAddOn[] {
  const requested = new Map<string, number>();
  for (const { addOnId, quantity } of choices) {
    if (Number.isInteger(quantity) && quantity > 0) {
      requested.set(addOnId, quantity); // a repeated id replaces, never adds up
    }
  }

  const resolved: ResolvedAddOn[] = [];
  for (const addOn of catalog) {
    const quantity = requested.get(addOn.id);
    if (quantity === undefined) continue;
    resolved.push({
      addOn,
      quantity: Math.min(quantity, maxAddOnQuantity(addOn, capacity)),
    });
  }
  return resolved;
}

/**
 * Label suffix for the space line: the tier the visitor is really charged.
 * Three hours of a room whose hourly x3 exceeds the daily rate is "Daily".
 */
export function describeSpaceCharge(
  duration: BookingDuration,
  tiers: SpacePrices,
): string {
  if (duration.kind === "days") {
    return duration.days === 1 ? "Daily" : `${duration.days} days`;
  }
  const byHour = Math.round((duration.minutes / 60) * tiers.hourly);
  return byHour >= tiers.daily ? "Daily" : "Hourly";
}

/** Case- and whitespace-insensitive lookup for a typed voucher code. */
export function findVoucher(vouchers: Voucher[], code: string): Voucher | null {
  const wanted = code.trim().toUpperCase();
  if (!wanted) return null;
  return vouchers.find((v) => v.code.toUpperCase() === wanted) ?? null;
}

export type VoucherCheck =
  { ok: true; discount: number } | { ok: false; reason: VoucherRejection };
export type VoucherRejection = "expired" | "not-applicable";

/**
 * `percentOff` of the subtotal, ceilinged by `maxDiscount` and by the subtotal
 * itself. (Figma's "15%" card deducts Rp100,000 from Rp4,430,000: only a
 * capped percentage explains both numbers.)
 */
export function checkVoucher(
  voucher: Voucher,
  context: { spaceType: SpaceType; subtotal: number; today: Date },
): VoucherCheck {
  // "yyyy-MM-dd" strings sort chronologically, and validUntil is inclusive.
  if (format(context.today, "yyyy-MM-dd") > voucher.validUntil) {
    return { ok: false, reason: "expired" };
  }
  if (!voucher.appliesTo.includes(context.spaceType)) {
    return { ok: false, reason: "not-applicable" };
  }
  const percentage = Math.round((context.subtotal * voucher.percentOff) / 100);
  return {
    ok: true,
    discount: Math.min(percentage, voucher.maxDiscount, context.subtotal),
  };
}

type QuoteInput = {
  spaceName: string;
  spaceType: SpaceType;
  tiers: SpacePrices;
  duration: BookingDuration;
  addOns: ResolvedAddOn[];
  voucher: Voucher | null;
  today: Date;
};

export type QuoteResult = {
  quote: BookingQuote;
  /** Null when no voucher was supplied. A rejected voucher yields no discount. */
  voucherCheck: VoucherCheck | null;
};

/**
 * The single pricing path: the live order summary and the Server Action both
 * call this, so what the visitor sees is what the server charges.
 */
export function buildQuote(input: QuoteInput): QuoteResult {
  const { spaceName, spaceType, tiers, duration, addOns, voucher, today } =
    input;

  const nameCounts = new Map<string, number>();
  for (const { addOn } of addOns) {
    nameCounts.set(addOn.name, (nameCounts.get(addOn.name) ?? 0) + 1);
  }

  const lines: QuoteLine[] = [
    {
      id: "space",
      label: `${spaceName} (${describeSpaceCharge(duration, tiers)})`,
      quantity: 1,
      amount: calculateBookingTotal(tiers, duration),
    },
    ...addOns.map(({ addOn, quantity }) => ({
      id: addOn.id,
      label:
        (nameCounts.get(addOn.name) ?? 0) > 1
          ? `${addOn.name} (${formatAddOnUnit(addOn.unit)})`
          : addOn.name,
      quantity,
      amount: addOn.price * quantity,
    })),
  ];

  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
  const voucherCheck = voucher
    ? checkVoucher(voucher, { spaceType, subtotal, today })
    : null;
  const discount =
    voucher && voucherCheck?.ok
      ? { code: voucher.code, amount: voucherCheck.discount }
      : null;

  return {
    quote: {
      lines,
      subtotal,
      discount,
      total: subtotal - (discount?.amount ?? 0),
    },
    voucherCheck,
  };
}
