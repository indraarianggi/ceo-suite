import type { Voucher } from "@/types/booking";

const shared = {
  title: "Discount 15% for Meeting Room",
  validUntil: "2027-08-30",
  percentOff: 15,
  maxDiscount: 100_000,
  appliesTo: ["meeting-room"],
} as const satisfies Omit<Voucher, "code">;

export const vouchers: Voucher[] = [
  { ...shared, appliesTo: [...shared.appliesTo], code: "15DISCOUNT" },
  { ...shared, appliesTo: [...shared.appliesTo], code: "MEETING15" },
  { ...shared, appliesTo: [...shared.appliesTo], code: "BOARDROOM15" },
  { ...shared, appliesTo: [...shared.appliesTo], code: "WELCOME15" },
];
