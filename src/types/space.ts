export type SpaceType = "private-office" | "coworking" | "meeting-room";

export type PriceUnit = "hourly" | "daily" | "weekly";

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
