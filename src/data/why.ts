export type Stat = {
  value: string;
  label: string;
  icon: string;
};

export const stats: Stat[] = [
  {
    value: "11",
    label: "Vibrant Cities",
    icon: "/images/icons/stat-globe.svg",
  },
  {
    value: "22",
    label: "prime locations in Asia’s CBDs",
    icon: "/images/icons/stat-location.svg",
  },
  {
    value: "25",
    label: "years in business",
    icon: "/images/icons/stat-briefcase.svg",
  },
  {
    value: "100%",
    label: "grade A+ Buildings",
    icon: "/images/icons/stat-building.svg",
  },
  {
    value: "80,000+",
    label: "businesses served",
    icon: "/images/icons/stat-handshake.svg",
  },
];

export const whyCopy = {
  eyebrow: "Why CEO SUITE?",
  title: "We revolutionize your workspace",
  paragraphs: [
    "In today’s fast-paced business environment, finding the right workspace solution is crucial to your company’s success. CEO SUITE offers an unparalleled workplace experience that combines premium locations, flexibility, top-notch amenities, and exceptional service to meet the needs of modern businesses.",
    "As Asia’s leading serviced office provider, CEO SUITE stands out as the ideal partner for companies seeking more than just office space—a place where business can thrive.",
  ],
} as const;
