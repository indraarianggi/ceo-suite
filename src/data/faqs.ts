export type Faq = { id: string; question: string; answer: string };

export const faqHeading = {
  title: "Frequently Asked Questions",
  description:
    "Everything You Need to Know About CEO SUITE Services & Facilities!",
} as const;

export const faqs: Faq[] = [
  {
    id: "office-types",
    question: "What types of office spaces does CEO SUITE offer?",
    answer:
      "We provide a variety of office spaces including private offices, co-working spaces, meeting rooms, and virtual offices. Whether you need a dedicated workspace or flexible hot-desking options, we have a solution to fit your needs.",
  },
  {
    id: "amenities",
    question: "What amenities are included with a CEO SUITE membership?",
    answer:
      "Memberships include access to your chosen workspace along with shared amenities such as high-speed internet, refreshments and reception support. Details vary by space type and location.",
  },
  {
    id: "customize",
    question: "Can I customize my office space?",
    answer:
      "Private offices can be tailored to your team’s needs. Contact us and we will walk you through the options available at your chosen location.",
  },
  {
    id: "book-meeting-rooms",
    question: "How do I book meeting rooms?",
    answer:
      "Search for a meeting room by city, date and capacity, pick an available hourly or daily slot, and complete your booking online.",
  },
  {
    id: "additional-costs",
    question:
      "Are there any additional costs for using meeting rooms or other facilities?",
    answer:
      "Prices shown at booking cover the room itself. Optional add-ons such as catering or extra equipment are listed separately before you confirm.",
  },
  {
    id: "admin-support",
    question: "What is included in the administrative support services?",
    answer:
      "Our on-site team can help with reception, mail handling and day-to-day workspace requests. Ask us about the services available at your location.",
  },
  {
    id: "internet",
    question: "How can I access CEO SUITE’s high-speed internet?",
    answer:
      "Connection details are provided when you check in. Our team is on hand if you need help getting online.",
  },
  {
    id: "events",
    question: "Can I use CEO SUITE’s facilities for events?",
    answer:
      "Yes. Event spaces and larger meeting rooms can be booked for workshops, presentations and corporate gatherings. Reach out for availability.",
  },
  {
    id: "operating-hours",
    question: "What are the operating hours for CEO SUITE locations?",
    answer:
      "Operating hours differ by location and are shown on each space’s detail page.",
  },
  {
    id: "contact",
    question: "How can I contact CEO SUITE for more information or support?",
    answer:
      "Use the Contact Us button on this page and our team will get back to you as soon as possible.",
  },
];
