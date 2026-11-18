export type NewsPost = {
  id: string;
  title: string;
  byline: string;
  excerpt: string;
  image: { src: string; alt: string };
  href: string;
};

export type FeaturedPost = {
  id: string;
  tag: string;
  byline: string;
  title: string;
  image: { src: string; alt: string };
  href: string;
};

const excerpt =
  "NEW YORK—A 6-year-old horse died after being injured in a race at Belmont Park ahead of next week’s";

export const newsPosts: NewsPost[] = [
  {
    id: "productivity-remote",
    title: "Does productivity increase when working remotely ? ",
    byline: "Race98 - 03 June 2023",
    excerpt,
    image: {
      src: "/images/news/remote-productivity.webp",
      alt: "Man reading a newspaper with his hand over his mouth",
    },
    href: "/news",
  },
  {
    id: "morning-routine",
    title: "Morning routine to boost your mood",
    byline: "Race98 - 03 June 2023",
    excerpt,
    image: {
      src: "/images/news/morning-routine.webp",
      alt: "Colleagues gathered around a laptop, smiling",
    },
    href: "/news",
  },
  {
    id: "coworking-tips",
    title: "5+ tips to find comfortable co-working space",
    byline: "Race98 - 03 June 2023",
    excerpt,
    image: {
      src: "/images/news/coworking-tips.webp",
      alt: "Glass desk in a bright co-working space with a blue wall",
    },
    href: "/news",
  },
];

export const featuredPost: FeaturedPost = {
  id: "minimal-workspace",
  tag: "TIPS",
  byline: "Debits - 03 June 2023",
  title: "Minimal workspace for inspirations",
  image: {
    src: "/images/news/minimal-workspace.webp",
    alt: "Laptop, vase and glasses on a minimal white desk",
  },
  href: "/news",
};
