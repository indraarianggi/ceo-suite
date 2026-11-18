type DetailsSectionProps = { description: string };

export function DetailsSection({ description }: DetailsSectionProps) {
  return (
    <section
      aria-labelledby="details-heading"
      className="relative flex flex-col gap-6 py-4 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-grey-100"
    >
      <h2 id="details-heading" className="text-heading-25-bold text-grey-950">
        Details
      </h2>
      <p className="px-3 text-body-16-medium text-grey-600">{description}</p>
    </section>
  );
}
