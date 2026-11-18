// Facts used for JSON-LD
export const business = {
  legalName: "CEO SUITE",
  slogan: "First choice for global workplace",
  logo: "/images/brand/logo-ceo-suite.webp",
  address: null as null | {
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  },
  rating: null as null | { ratingValue: number; reviewCount: number },
  sameAs: [] as string[],
} as const;
