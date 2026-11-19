export type TermsGroup = { title?: string; items: string[] };
export type TermsSection = { heading: string; groups: TermsGroup[] };

export const termsAndConditions: TermsSection[] = [
  {
    heading: "Cancellation Policy:",
    groups: [
      {
        title: "Meeting Room and Boardroom:",
        items: [
          "Less than 24 hours' notice -100% of the rental fee is chargeable",
          "24-48 hours' notice - 50% of the rental fee is chargeable.",
        ],
      },
      {
        items: [
          "Please note that the booking fee and full payment for office rentals are non-refundable. However, the amount paid can be retained as a credit balance, which may be used for our services and future rentals.",
        ],
      },
      {
        title: "Event Space:",
        items: [
          "Less than 3 working days from the event date - 100% of the fee is chargeable.",
          "Less than 7 working days from the event date - 50% of the fee is chargeable",
        ],
      },
    ],
  },
  {
    heading: "Catering Service:",
    groups: [
      {
        items: [
          "Non-Refundable for catering/food and beverage orders upon confirmation.",
          "Food items may be subject to change without prior notice(due to availability of ingredients) and will be replaced with its equivalent.",
        ],
      },
    ],
  },
  {
    heading: "Services:",
    groups: [
      {
        items: [
          "Please contact us for full listing and prices",
          "Services provided may vary at CEO SUITE's absolute discretion and shall be provided during our normal office hours.",
          "Services provided after normal business hours will be subjected to after-office-hour rates.",
        ],
      },
    ],
  },
];
