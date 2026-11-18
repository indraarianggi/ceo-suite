export type Promotion = {
  id: string;
  title: string;
  description: string;
  image: { src: string; alt: string };
  href: string;
};

export type Deal = {
  id: string;
  amount: string;
  label: string;
  validUntil: string;
  image: { src: string; alt: string };
  href: string;
};

export const promotions: Promotion[] = [
  {
    id: "coworking-20",
    title: "Discount 20% for all co-working space booking!",
    description: "Limited time offer! Don't miss out on this incredible deal.",
    image: {
      src: "/images/promotions/promo-coworking-open-plan.webp",
      alt: "Open-plan co-working floor with colleagues working at a long table",
    },
    href: "/promotions",
  },
  {
    id: "coworking-monthly-30",
    title: "Exclusive 30% discount on monthly co-working space subscriptions!",
    description: "Limited time offer! Don't miss out on this incredible deal.",
    image: {
      src: "/images/promotions/promo-monthly-coworking.webp",
      alt: "Sunlit loft office with a wooden table and pink chairs",
    },
    href: "/promotions",
  },
  {
    id: "meeting-room-25",
    title: "Special offer: Get 25% off any meeting room booking!",
    description: "Don't miss out on this exclusive deal! Limited time only.",
    image: {
      src: "/images/promotions/promo-meeting-room.webp",
      alt: "Meeting room with a long table beside floor-to-ceiling windows",
    },
    href: "/promotions",
  },
];

const officeVoucher: Omit<Deal, "id"> = {
  amount: "Rp200,000",
  label: "Voucher for Office!",
  validUntil: "Valid until 31 August 2024",
  image: {
    src: "/images/promotions/deal-voucher-office.webp",
    alt: "Glass-walled office corridor with a lounge area",
  },
  href: "/promotions",
};

export const deals: Deal[] = [
  { id: "voucher-office-1", ...officeVoucher },
  { id: "voucher-office-2", ...officeVoucher },
  { id: "voucher-office-3", ...officeVoucher },
];
