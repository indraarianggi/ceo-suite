import { SpaceCard } from "@/components/shared/space-card";
import type { Space } from "@/types/space";

type SimilarSpacesSectionProps = { spaces: Space[] };

export function SimilarSpacesSection({ spaces }: SimilarSpacesSectionProps) {
  if (spaces.length === 0) return null;

  return (
    <section
      aria-labelledby="similar-spaces-heading"
      className="bg-grey-25 py-12 xl:py-20"
    >
      <div className="page-container flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2
            id="similar-spaces-heading"
            className="text-heading-25-bold text-grey-800"
          >
            Similar Spaces
          </h2>
          <p className="text-body-16-medium text-grey-400 md:text-heading-20-medium">
            Check out these spaces with similar features to the ones you&apos;ve
            been looking at.
          </p>
        </div>

        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {spaces.map((space) => (
            <li key={space.id} className="flex">
              <div className="min-w-0 flex-1">
                <SpaceCard space={space} variant="compact" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
