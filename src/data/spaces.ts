import type { Space, SpaceCategory } from "@/types/space";

export const spaceCategories: SpaceCategory[] = [
  {
    type: "private-office",
    label: "Private Offices",
    image: {
      src: "/images/spaces/browse-private-office.webp",
      alt: "Private office with a desk and a round meeting table overlooking the city skyline",
    },
    href: "/spaces?type=private-office",
  },
  {
    type: "coworking",
    label: "Coworking Space",
    image: {
      src: "/images/spaces/browse-coworking.webp",
      alt: "Three people laughing together at a wooden table with laptops",
    },
    href: "/spaces?type=coworking",
  },
  {
    type: "meeting-room",
    label: "Meeting Room",
    image: {
      src: "/images/spaces/browse-meeting-room.webp",
      alt: "Boardroom with a long table and leather chairs by floor-to-ceiling windows",
    },
    href: "/spaces?type=meeting-room",
  },
];

const axaTowerLounge: Space = {
  id: "axa-tower-meeting-room-a",
  slug: "axa-tower-meeting-room-a",
  name: "AXA Tower Meeting Room",
  type: "meeting-room",
  categoryLabel: "Meeting Room",
  capacity: 4,
  image: {
    src: "/images/spaces/rec-meeting-room-lounge.webp",
    alt: "Meeting room with a long table and tan chairs facing large windows",
  },
  price: { unit: "daily", amount: 2_880_000 },
  secondaryPrice: { unit: "hourly", amount: 480_000 },
};

const axaTowerWoodTable: Space = {
  id: "axa-tower-meeting-room-b",
  slug: "axa-tower-meeting-room-b",
  name: "AXA Tower Meeting Room",
  type: "meeting-room",
  categoryLabel: "Meeting Room",
  capacity: 4,
  image: {
    src: "/images/spaces/rec-meeting-room-wood-table.webp",
    alt: "Industrial meeting room with a wooden table, laptops and a chalkboard",
  },
  price: { unit: "daily", amount: 1_200_000, originalAmount: 1_680_000 },
  secondaryPrice: { unit: "hourly", amount: 200_000 },
};

const suite7View: Space = {
  id: "suite-7-view",
  slug: "suite-7-view",
  name: "Suite 7 View",
  type: "private-office",
  categoryLabel: "Office",
  capacity: 8,
  image: {
    src: "/images/spaces/rec-suite-7-view.webp",
    alt: "Colourful open-plan office with a ping-pong table and pendant lamps",
  },
  price: { unit: "daily", amount: 3_480_000 },
  secondaryPrice: { unit: "hourly", amount: 600_000 },
};

const suiteVip5: Space = {
  id: "suite-vip-5-non-view",
  slug: "suite-vip-5-non-view",
  name: "Suite VIP 5 Non View",
  type: "coworking",
  categoryLabel: "Co-Working Space (Dedicated)",
  capacity: 1,
  image: {
    src: "/images/spaces/rec-suite-vip-5.webp",
    alt: "Three colleagues smiling while working on laptops at a wooden table",
  },
  price: { unit: "weekly", amount: 750_000 },
  secondaryPrice: { unit: "daily", amount: 150_000 },
};

export const recommendedSpaces: Space[] = [
  axaTowerLounge,
  axaTowerWoodTable,
  suite7View,
  suiteVip5,
  {
    ...axaTowerLounge,
    id: "axa-tower-meeting-room-c",
    slug: "axa-tower-meeting-room-c",
  },
  {
    ...axaTowerWoodTable,
    id: "axa-tower-meeting-room-d",
    slug: "axa-tower-meeting-room-d",
  },
  { ...suite7View, id: "suite-7-view-2", slug: "suite-7-view-2" },
  {
    ...suiteVip5,
    id: "suite-vip-5-non-view-2",
    slug: "suite-vip-5-non-view-2",
  },
];
