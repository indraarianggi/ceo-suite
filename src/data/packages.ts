export const meetingRoomPackage = {
  title: "Meeting Room Package",
  paragraphs: [
    [
      {
        text: "Elevate your meetings with CEO SUITE's premium meeting rooms, now available at an ",
      },
      { text: "exclusive special rate", highlight: true },
      { text: "." },
    ],
    [
      {
        text: "Whether you're hosting a team brainstorming session, client presentations, or strategic workshops, our fully-equipped meeting spaces offer the perfect ",
      },
      { text: "blend of professionalism and comfort", highlight: true },
      { text: "." },
    ],
  ],
  cta: { label: "Browse Packages", href: "/spaces?type=meeting-room" },
  images: [
    {
      src: "/images/packages/city-view-office.webp",
      alt: "Office with a city skyline view",
      tall: false,
    },
    {
      src: "/images/packages/lobby.webp",
      alt: "Lobby with leather lounge chairs and a wood-panelled wall",
      tall: true,
    },
    {
      src: "/images/packages/lounge.webp",
      alt: "Lounge with a sofa, ottomans and a kitchenette",
      tall: true,
    },
    {
      src: "/images/packages/boardroom.webp",
      alt: "Boardroom table set for a meeting with a city view",
      tall: false,
    },
  ],
} as const;
