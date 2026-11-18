import { recommendedSpaces } from "@/data/spaces";
import type {
  AddOn,
  Space,
  SpaceDetail,
  SpaceImage,
  SpaceLocation,
  SpacePrices,
  SpaceStat,
} from "@/types/space";

const addOns: AddOn[] = [
  {
    id: "corkage-fee",
    name: "Corkage Fee",
    price: 270_000,
    unit: "event",
    icon: "corkage",
  },
  {
    id: "lunch-executive",
    name: "Lunch Package - Executive",
    price: 110_000,
    unit: "pax",
    icon: "lunch",
  },
  {
    id: "lunch-standard",
    name: "Lunch Package - Standard",
    price: 85_000,
    unit: "pax",
    icon: "lunch",
  },
  {
    id: "coffee-break-executive",
    name: "Coffee Break - Executive",
    price: 75_000,
    unit: "pax",
    icon: "coffee",
  },
  {
    id: "coffee-break-standard",
    name: "Coffee Break - Standard",
    price: 50_000,
    unit: "pax",
    icon: "coffee",
  },
  {
    id: "flip-chart",
    name: "Flip Chart",
    price: 85_000,
    unit: "event",
    icon: "flip-chart",
  },
  {
    id: "lcd-projector-hourly",
    name: "LCD Projector",
    price: 250_000,
    unit: "hour",
    icon: "projector",
  },
  {
    id: "lcd-projector-daily",
    name: "LCD Projector",
    price: 1_500_000,
    unit: "day",
    icon: "projector",
  },
];

const stats: SpaceStat[] = [
  { kind: "people", count: 20, label: "People" },
  { kind: "seats", count: 20, label: "Seats" },
  { kind: "desks", count: 20, label: "Desks" },
];

const location: SpaceLocation = {
  name: "Wisma GKBI, Jakarta",
  address:
    "Jl. Jend. Sudirman No.28, RT.14/RW.1, Bend. Hilir, Kecamatan Tanah Abang, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10210",
  map: {
    src: "/images/spaces/map-wisma-gkbi.webp",
    alt: "Map of central Jakarta around Jl. Jend. Sudirman with a pin on Wisma GKBI",
  },
  pin: { x: 36.4, y: 2.1 },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Wisma+GKBI+Jakarta",
};

const wismaGallery: SpaceImage[] = [
  {
    src: "/images/spaces/gallery-wisma-gkbi-1.webp",
    alt: "Boardroom with a long table and tan chairs facing floor-to-ceiling windows",
  },
  {
    src: "/images/spaces/gallery-wisma-gkbi-2.webp",
    alt: "Tall meeting room with a long dark table, beige chairs, a wall screen and a window bench",
  },
  {
    src: "/images/spaces/gallery-wisma-gkbi-3.webp",
    alt: "Open-plan office where two colleagues work on laptops at a long shared table",
  },
  {
    src: "/images/spaces/gallery-wisma-gkbi-4.webp",
    alt: "Industrial-style meeting room with a wooden table and pink chairs under pendant lamps",
  },
  {
    src: "/images/spaces/gallery-wisma-gkbi-5.webp",
    alt: "Shared workspace with a long wooden desk and black mesh chairs",
  },
];

const wismaGkbi: SpaceDetail = {
  id: "wisma-gkbi-boardroom",
  slug: "wisma-gkbi-boardroom",
  name: "Wisma GKBI Boardroom",
  type: "meeting-room",
  categoryLabel: "Meeting Room",
  capacity: 20,
  image: wismaGallery[0],
  price: { unit: "daily", amount: 2_400_000 },
  secondaryPrice: { unit: "hourly", amount: 400_000 },
  rating: 4.8,
  description:
    "Meeting room with South Jakarta view, with fully amenities and fullboard facilities.",
  gallery: wismaGallery,
  stats,
  prices: {
    hourly: 400_000,
    daily: 2_400_000,
    weekly: 13_350_000,
    monthly: 44_500_000,
  },
  bestDeal: true,
  addOns,
  location,
};

const round = (amount: number) => Math.round(amount / 1000) * 1000;

/** MOCK: tier ratios taken from the Figma "Wisma GKBI" price card. */
function pricesFor(space: Space): SpacePrices {
  const tiers = [space.price, space.secondaryPrice];
  const amountOf = (unit: Space["price"]["unit"]) =>
    tiers.find((t) => t.unit === unit)?.amount;

  const daily = amountOf("daily") ?? 0;
  return {
    daily,
    hourly: amountOf("hourly") ?? round(daily / 6),
    weekly: amountOf("weekly") ?? round(daily * 5.5625),
    monthly: round(daily * 18.5416),
  };
}

/** MOCK: replace with API data. Gallery, add-ons, stats and location are shared placeholders. */
function toDetail(space: Space): SpaceDetail {
  return {
    ...space,
    rating: 4.8,
    description: `${space.name}: a ${space.categoryLabel.toLowerCase()} you can book by the hour or by the day.`,
    gallery: [space.image, ...wismaGallery.slice(1)],
    stats,
    prices: pricesFor(space),
    bestDeal: space.price.originalAmount !== undefined,
    addOns,
    location,
  };
}

export const spaceDetails: SpaceDetail[] = [
  wismaGkbi,
  ...recommendedSpaces.map(toDetail),
];
