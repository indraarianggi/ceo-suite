import type { SpaceType } from "@/types/space";

export type ListingView = "all" | SpaceType;

type ListingImage = { src: string; alt: string };

export type ListingHero = {
  title: string;
  tagline: string;
  image: ListingImage;
};

export const listingHeroes: Record<ListingView, ListingHero> = {
  all: {
    title: "All Spaces",
    tagline: "Best Place to work together with your teams!",
    image: {
      src: "/images/spaces/listing-hero-all.webp",
      alt: "Colleagues working on laptops around a long table in a meeting room",
    },
  },
  "private-office": {
    title: "Private Offices",
    tagline: "Best Place to work together with your teams!",
    image: {
      src: "/images/spaces/listing-hero-private-office.webp",
      alt: "Team gathered around a long table with laptops while a colleague presents",
    },
  },
  coworking: {
    title: "Co-Working Spaces",
    tagline: "Enjoy Flexibility and Convenience",
    image: {
      src: "/images/spaces/listing-hero-coworking.webp",
      alt: "Person working on a laptop at a wooden desk in a bright co-working space",
    },
  },
  "meeting-room": {
    title: "Meeting Rooms",
    tagline: "Enhance Your Meeting Productivity",
    image: {
      src: "/images/spaces/listing-hero-meeting-room.webp",
      alt: "Team meeting around a white table with laptops and notebooks",
    },
  },
  "event-space": {
    title: "Event Spaces",
    tagline: "Book Your Event Venue Today",
    image: {
      src: "/images/spaces/listing-hero-event-space.webp",
      alt: "Audience seated at tables facing a stage during an event",
    },
  },
};

export type IntroFeature = { title: string; text: string; icon: string };

export type CategoryIntro = {
  heading: string;
  body: string;
  features: [IntroFeature, IntroFeature, IntroFeature, IntroFeature];
};

const icon = (name: string) => `/images/icons/spaces/feature-${name}.svg`;

export const categoryIntros: Record<SpaceType, CategoryIntro> = {
  "private-office": {
    heading: "Boost Productivity in a Private Office",
    body: "Discover our range of private offices designed to provide a professional and focused workspace. Whether you need a single desk or an entire floor, our private offices offer privacy and flexibility, complete with high-speed internet, modern furnishings, and access to all our premium amenities. Perfect for teams of all sizes looking for a dedicated, secure environment to boost productivity.",
    features: [
      {
        title: "Privacy and Focus",
        text: "Enjoy a quiet, dedicated workspace free from distractions.",
        icon: icon("volume-off"),
      },
      {
        title: "Customizable",
        text: "Tailor the office to fit your business needs and branding.",
        icon: icon("crm"),
      },
      {
        title: "All-Inclusive",
        text: "Access high-speed internet, modern furnishings, and premium amenities.",
        icon: icon("thumbs-up"),
      },
      {
        title: "Flexible Terms",
        text: "Choose from short-term or long-term leases to match your business requirements.",
        icon: icon("dollar"),
      },
    ],
  },
  coworking: {
    heading: "Collaborate and Connect in Our Co-Working Spaces",
    body: "Experience the energy and creativity of our co-working spaces. Ideal for freelancers, startups, and remote workers, our co-working areas provide a collaborative environment with flexible membership options. Enjoy the benefits of a dynamic community, hot-desking options, and access to shared resources like meeting rooms and common areas.",
    features: [
      {
        title: "Collaborative Environment",
        text: "Connect with like-minded professionals and expand your network.",
        icon: icon("team-meeting"),
      },
      {
        title: "Flexibility",
        text: "Enjoy hot-desking options and flexible membership plans.",
        icon: icon("crm"),
      },
      {
        title: "Cost-Effective",
        text: "Access a professional workspace without the overhead of a dedicated office.",
        icon: icon("dollar"),
      },
      {
        title: "Shared Resources",
        text: "Benefit from meeting rooms, common areas, and on-site support services.",
        icon: icon("rating"),
      },
    ],
  },
  "meeting-room": {
    heading: "Enjoy a Seamless Meeting Experience",
    body: "Host your meetings in style with our state-of-the-art meeting rooms. Equipped with the latest technology and comfortable seating, our meeting rooms cater to small discussions or large presentations. Book by the hour or day and benefit from additional services such as catering and technical support to ensure your meetings are a success.",
    features: [
      {
        title: "Professional Setup",
        text: "Utilize advanced technology and comfortable seating for productive meetings.",
        icon: icon("toolbox"),
      },
      {
        title: "Convenience",
        text: "Book by the hour or day with no long-term commitments.",
        icon: icon("thumbs-up"),
      },
      {
        title: "Support Services",
        text: "Access additional services like catering and technical assistance.",
        icon: icon("info"),
      },
      {
        title: "Flexibility",
        text: "Choose from various room sizes to accommodate small discussions or large presentations.",
        icon: icon("crm"),
      },
    ],
  },
  "event-space": {
    heading: "Create Memorable Events with Our Venues",
    body: "Make your events memorable with our versatile event spaces. From corporate seminars and workshops to networking events and product launches, our venues are designed to accommodate a variety of functions. With professional support and customizable options, we provide everything you need to create a seamless and impactful event.",
    features: [
      {
        title: "Versatility",
        text: "Host a wide range of events from corporate seminars to product launches.",
        icon: icon("check-square"),
      },
      {
        title: "Customizable",
        text: "Personalize the space to suit the theme and requirements of your event.",
        icon: icon("crm"),
      },
      {
        title: "Professional Support",
        text: "Receive assistance with event planning, setup, and execution.",
        icon: icon("info"),
      },
      {
        title: "Impactful Venues",
        text: "Create a memorable experience with our well-appointed and adaptable event spaces.",
        icon: icon("stars"),
      },
    ],
  },
};

export const trustedBy = {
  label: "Trusted by 8,000+ established company",
  logos: [
    { src: "/images/logos/trusted-cloudnex.svg", alt: "CloudNex", width: 144 },
    {
      src: "/images/logos/trusted-marketease.svg",
      alt: "MarketEase",
      width: 175,
    },
    { src: "/images/logos/trusted-sourcer.svg", alt: "Sourcer", width: 140 },
  ],
} as const;

/** Heading and subtitle above the results grid (Figma copy, verbatim). */
export const resultsHeadings: Record<
  ListingView,
  { title: string; subtitle: string }
> = {
  all: {
    title: "All Spaces",
    subtitle: "Explore top-rated meeting rooms and workspaces.",
  },
  "private-office": {
    title: "Our Office",
    subtitle: "Explore top-rated meeting rooms and workspaces.",
  },
  coworking: {
    title: "Our Co-Working Spaces",
    subtitle: "Find Your Ideal Collaborative Workspace",
  },
  "meeting-room": {
    title: "Our Meeting Rooms",
    subtitle: "Find the Perfect Space for Your Event",
  },
  "event-space": {
    title: "Our Event Spaces",
    subtitle: "Versatile Event Spaces for Any Occasion",
  },
};

export const searchResultsTitle = "Search Results";

export const otherSpacesCopy = {
  title: "Other Spaces",
  subtitle: "Find the perfect space for your next meeting or event.",
} as const;

export type OtherSpaceKind =
  | "coworking"
  | "meeting"
  | "board"
  | "class"
  | "seminar"
  | "theatre"
  | "combined";

export type OtherSpace = {
  kind: OtherSpaceKind;
  label: string;
  /** Nearest space type: these sub-categories are not types of their own. */
  type: SpaceType;
  image: ListingImage;
};

export const otherSpaces: readonly OtherSpace[] = [
  {
    kind: "coworking",
    label: "Coworking Space",
    type: "coworking",
    image: {
      src: "/images/spaces/other-coworking-space.webp",
      alt: "Person working on a laptop at a desk beside a white brick wall",
    },
  },
  {
    kind: "meeting",
    label: "Meeting Room",
    type: "meeting-room",
    image: {
      src: "/images/spaces/other-meeting-room.webp",
      alt: "Open workspace with black office chairs at a long wooden desk",
    },
  },
  {
    kind: "board",
    label: "Board Room",
    type: "meeting-room",
    image: {
      src: "/images/spaces/other-board-room.webp",
      alt: "Boardroom with a long table, tan chairs and a ceiling projector",
    },
  },
  {
    kind: "class",
    label: "Class Room",
    type: "event-space",
    image: {
      src: "/images/spaces/other-class-room.webp",
      alt: "Instructor teaching a seated class beneath arched shuttered windows",
    },
  },
  {
    kind: "seminar",
    label: "Seminar Room",
    type: "event-space",
    image: {
      src: "/images/spaces/other-seminar-room.webp",
      alt: "Speaker presenting to an audience seated at tables in a loft venue",
    },
  },
  {
    kind: "theatre",
    label: "Theatre Room",
    type: "event-space",
    image: {
      src: "/images/spaces/other-theatre-room.webp",
      alt: "Rows of red theatre seats facing a large projection screen",
    },
  },
  {
    kind: "combined",
    label: "Combined Boardroom Meeting Room",
    type: "meeting-room",
    image: {
      src: "/images/spaces/other-combined-boardroom.webp",
      alt: "Meeting room with a rustic wooden table, white chairs and a city view",
    },
  },
];
