export type CorporatePartner = {
  id: string;
  title: string;
  description: string;
  image: { src: string; alt: string };
  logos: { src: string; alt: string; width: number; height: number }[];
  href: string;
};

const ceoSuiteLogo = {
  src: "/images/partners/logo-ceo-suite-white.webp",
  alt: "CEO SUITE",
  width: 77,
  height: 19,
};

export const corporatePartners: CorporatePartner[] = [
  {
    id: "bank-mandiri",
    title: "Exclusive Corporate Rate | Bank Mandiri",
    description:
      "Enjoy substantial savings on meeting rooms, event spaces, and other business solutions when you partner with us.",
    image: {
      src: "/images/promotions/promo-monthly-coworking.webp",
      alt: "Sunlit meeting room with a long table and pink chairs",
    },
    logos: [
      ceoSuiteLogo,
      {
        src: "/images/partners/logo-mandiri.svg",
        alt: "Bank Mandiri",
        width: 111,
        height: 63,
      },
    ],
    href: "/partners",
  },
  {
    id: "member-benefits",
    title: "Exclusive Member Benefits",
    description:
      "As a valued member, you'll enjoy a range of benefits designed to enhance your experience and provide exceptional value.",
    image: {
      src: "/images/promotions/deal-voucher-office.webp",
      alt: "Glass-walled office corridor with a lounge area",
    },
    logos: [ceoSuiteLogo],
    href: "/partners",
  },
  {
    id: "dbs-credit-card",
    title: "10% Offer for DBS Credit Card Holder",
    description:
      "Exclusive to DBS Credit Card holders: Get a 10% discount on your next booking. Valid for corporate booking only.",
    image: {
      src: "/images/promotions/deal-voucher-office.webp",
      alt: "Glass-walled office corridor with a lounge area",
    },
    logos: [
      ceoSuiteLogo,
      {
        src: "/images/partners/logo-dbs.svg",
        alt: "DBS",
        width: 84,
        height: 48,
      },
    ],
    href: "/partners",
  },
];

export type TrustedLogo = {
  name: string;
  src: string;
  width: number;
  height: number;
};

export const trustedLogos: TrustedLogo[] = [
  { name: "Uber", src: "/images/logos/uber.svg", width: 128, height: 85 },
  { name: "Dell", src: "/images/logos/dell.svg", width: 128, height: 128 },
  { name: "Samsung", src: "/images/logos/samsung.svg", width: 128, height: 42 },
  { name: "Nike", src: "/images/logos/nike.svg", width: 128, height: 46 },
  {
    name: "Etihad Airways",
    src: "/images/logos/etihad.svg",
    width: 128,
    height: 45,
  },
  {
    name: "Zurich Insurance",
    src: "/images/logos/zurich.svg",
    width: 128,
    height: 80,
  },
  { name: "Cisco", src: "/images/logos/cisco.svg", width: 128, height: 68 },
  { name: "BP", src: "/images/logos/bp.svg", width: 128, height: 170 },
  {
    name: "ExxonMobil",
    src: "/images/logos/exxonmobil.svg",
    width: 128,
    height: 24,
  },
];
