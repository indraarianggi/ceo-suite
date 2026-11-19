export type SpaceType =
  "private-office" | "coworking" | "meeting-room" | "event-space";

export type City = "Jakarta" | "Bandung" | "Surabaya" | "Bali";

export type PriceUnit = "hourly" | "daily" | "weekly" | "monthly";

export type SpacePrice = {
  unit: PriceUnit;
  amount: number;
  originalAmount?: number;
};

export type Space = {
  id: string;
  slug: string;
  name: string;
  type: SpaceType;
  categoryLabel: string;
  capacity: number;
  city: City;
  region: string;
  pin: { x: number; y: number };
  image: { src: string; alt: string };
  price: SpacePrice;
  secondaryPrice: SpacePrice;
};

export type SpaceCategory = {
  type: SpaceType;
  label: string;
  image: { src: string; alt: string };
  href: string;
};

export type SpacePrices = {
  hourly: number;
  daily: number;
  weekly: number;
  monthly: number;
};

export type SpaceImage = { src: string; alt: string };

export type SpaceStatKind = "people" | "seats" | "desks";
export type SpaceStat = { kind: SpaceStatKind; count: number; label: string };

export type AddOnUnit = "event" | "pax" | "hour" | "day";
export type AddOnIcon =
  "corkage" | "lunch" | "coffee" | "flip-chart" | "projector" | "ac";
export type AddOn = {
  id: string;
  name: string;
  price: number;
  unit: AddOnUnit;
  icon: AddOnIcon;
};

export type SpaceLocation = {
  name: string;
  address: string;
  map: SpaceImage;
  /** Pin position as a percentage of the map image (x, y). */
  pin: { x: number; y: number };
  mapsUrl: string;
};

/** Everything the detail page needs; `Space` stays the card-level subset. */
export type SpaceDetail = Space & {
  rating: number; // out of 5
  description: string;
  gallery: SpaceImage[]; // [0] is the large image
  stats: SpaceStat[];
  prices: SpacePrices;
  bestDeal?: boolean;
  addOns: AddOn[];
  location: SpaceLocation;
};
