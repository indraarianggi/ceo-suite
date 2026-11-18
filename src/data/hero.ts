export type HeroSlide = { src: string; alt: string };

export const heroSlides: HeroSlide[] = [
  {
    src: "/images/hero/hero-lounge.webp",
    alt: "Bright workspace lounge with a sofa, ottomans and a kitchenette",
  },
  {
    src: "/images/hero/hero-meeting-room.webp",
    alt: "Sunlit meeting room with white tables, chairs and a palm plant",
  },
];

export const heroCopy = {
  title: "Discover Your Perfect Workspace at CEO SUITE.",
  subtitle:
    "Experience the ultimate in flexible, premium workspaces where luxury meets productivity—CEO SUITE offers an inspiring environment tailored to elevate your business success.",
} as const;

export const cities = ["Jakarta", "Bandung", "Surabaya", "Bali"] as const;

export const searchSpaceTypes = [
  { value: "all", label: "All Rooms" },
  { value: "private-office", label: "Offices" },
  { value: "meeting-room", label: "Meeting Room" },
  { value: "coworking", label: "Co-working Space" },
  { value: "event-space", label: "Event Space" },
] as const;

export const allSpaceTypesLabel = "All Space";
