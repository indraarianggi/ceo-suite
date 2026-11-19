import { mapPinSlots } from "@/data/listing-map";
import type { Space, SpaceImage } from "@/types/space";

const images = {
  lounge: {
    src: "/images/spaces/rec-meeting-room-lounge.webp",
    alt: "Meeting room with a long table and tan chairs facing large windows",
  },
  woodTable: {
    src: "/images/spaces/rec-meeting-room-wood-table.webp",
    alt: "Industrial meeting room with a wooden table, laptops and a chalkboard",
  },
  colourfulOffice: {
    src: "/images/spaces/rec-suite-7-view.webp",
    alt: "Colourful open-plan office with a ping-pong table and pendant lamps",
  },
  teamTable: {
    src: "/images/spaces/rec-suite-vip-5.webp",
    alt: "Three colleagues smiling while working on laptops at a wooden table",
  },
  boardroom: {
    src: "/images/spaces/gallery-wisma-gkbi-1.webp",
    alt: "Boardroom with a long table and tan chairs facing floor-to-ceiling windows",
  },
  tallRoom: {
    src: "/images/spaces/gallery-wisma-gkbi-2.webp",
    alt: "Tall meeting room with a long dark table, beige chairs and a wall screen",
  },
  sharedDesk: {
    src: "/images/spaces/gallery-wisma-gkbi-3.webp",
    alt: "Open-plan office where two colleagues work on laptops at a long shared table",
  },
  pinkChairs: {
    src: "/images/spaces/gallery-wisma-gkbi-4.webp",
    alt: "Industrial-style meeting room with a wooden table and pink chairs",
  },
} satisfies Record<string, SpaceImage>;

type Draft = Pick<
  Space,
  "name" | "type" | "categoryLabel" | "capacity" | "city" | "region" | "pin"
> & { slug: string; image: SpaceImage; daily: number; hourly: number };

function space(draft: Draft): Space {
  const { daily, hourly, ...rest } = draft;
  return {
    ...rest,
    id: draft.slug,
    price: { unit: "daily", amount: daily },
    secondaryPrice: { unit: "hourly", amount: hourly },
  };
}

/**
 * MOCK: extra spaces so the listing's city, region and type filters, "See
 * More" and the empty state can be demonstrated. Photos are reused from the
 * landing page; replace with API data.
 */
export const moreSpaces: Space[] = [
  space({
    slug: "sudirman-boardroom",
    name: "Sudirman Boardroom",
    type: "meeting-room",
    categoryLabel: "Meeting Room",
    capacity: 12,
    city: "Jakarta",
    region: "Central Jakarta",
    pin: mapPinSlots[9],
    image: images.boardroom,
    daily: 3_200_000,
    hourly: 520_000,
  }),
  space({
    slug: "kuningan-private-suite",
    name: "Kuningan Private Suite",
    type: "private-office",
    categoryLabel: "Office",
    capacity: 10,
    city: "Jakarta",
    region: "South Jakarta",
    pin: mapPinSlots[4],
    image: images.colourfulOffice,
    daily: 3_900_000,
    hourly: 650_000,
  }),
  space({
    slug: "thamrin-open-desk",
    name: "Thamrin Open Desk",
    type: "coworking",
    categoryLabel: "Co-Working Space (Non-Dedicated)",
    capacity: 1,
    city: "Jakarta",
    region: "Central Jakarta",
    pin: mapPinSlots[6],
    image: images.sharedDesk,
    daily: 180_000,
    hourly: 35_000,
  }),
  space({
    slug: "wisma-gkbi-seminar-hall",
    name: "Wisma GKBI Seminar Hall",
    type: "event-space",
    categoryLabel: "Seminar Room",
    capacity: 60,
    city: "Jakarta",
    region: "Central Jakarta",
    pin: mapPinSlots[8],
    image: images.tallRoom,
    daily: 6_500_000,
    hourly: 1_100_000,
  }),
  space({
    slug: "suite-vip-5-class-room",
    name: "Suite VIP 5 Class Room",
    type: "event-space",
    categoryLabel: "Class Room",
    capacity: 30,
    city: "Jakarta",
    region: "South Jakarta",
    pin: mapPinSlots[2],
    image: images.pinkChairs,
    daily: 4_200_000,
    hourly: 700_000,
  }),
  space({
    slug: "dago-creative-office",
    name: "Dago Creative Office",
    type: "private-office",
    categoryLabel: "Office",
    capacity: 8,
    city: "Bandung",
    region: "Coblong",
    pin: mapPinSlots[5],
    image: images.colourfulOffice,
    daily: 2_100_000,
    hourly: 350_000,
  }),
  space({
    slug: "braga-meeting-room",
    name: "Braga Meeting Room",
    type: "meeting-room",
    categoryLabel: "Meeting Room",
    capacity: 6,
    city: "Bandung",
    region: "Cicendo",
    pin: mapPinSlots[7],
    image: images.woodTable,
    daily: 1_500_000,
    hourly: 250_000,
  }),
  space({
    slug: "tunjungan-coworking",
    name: "Tunjungan Coworking",
    type: "coworking",
    categoryLabel: "Co-Working Space (Dedicated)",
    capacity: 1,
    city: "Surabaya",
    region: "Surabaya Pusat",
    pin: mapPinSlots[9],
    image: images.teamTable,
    daily: 220_000,
    hourly: 40_000,
  }),
  space({
    slug: "darmo-theatre-room",
    name: "Darmo Theatre Room",
    type: "event-space",
    categoryLabel: "Theatre Room",
    capacity: 80,
    city: "Surabaya",
    region: "Surabaya Barat",
    pin: mapPinSlots[1],
    image: images.lounge,
    daily: 5_800_000,
    hourly: 950_000,
  }),
  space({
    slug: "seminyak-beach-office",
    name: "Seminyak Beach Office",
    type: "private-office",
    categoryLabel: "Office",
    capacity: 6,
    city: "Bali",
    region: "Seminyak",
    pin: mapPinSlots[3],
    image: images.boardroom,
    daily: 2_700_000,
    hourly: 450_000,
  }),
  space({
    slug: "kuta-coworking-loft",
    name: "Kuta Coworking Loft",
    type: "coworking",
    categoryLabel: "Co-Working Space (Non-Dedicated)",
    capacity: 1,
    city: "Bali",
    region: "Kuta",
    pin: mapPinSlots[0],
    image: images.sharedDesk,
    daily: 200_000,
    hourly: 38_000,
  }),
];
