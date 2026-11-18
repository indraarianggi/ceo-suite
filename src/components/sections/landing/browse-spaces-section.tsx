import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/shared/section-heading";
import { SpaceCategoryCard } from "@/components/shared/space-category-card";
import { getSpaceCategories } from "@/lib/spaces";

export async function BrowseSpacesSection() {
  const categories = await getSpaceCategories();

  return (
    <section
      id="browse-spaces"
      aria-labelledby="browse-spaces-title"
      className="scroll-mt-28 pt-8 pb-12 xl:pt-12 xl:pb-25"
    >
      <div className="page-container flex flex-col gap-8 xl:gap-12">
        <SectionHeading
          id="browse-spaces-title"
          title="Browse Spaces"
          description="Find the perfect space for your next meeting or event."
        />
        <div className="grid items-start gap-10 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <SpaceCategoryCard key={category.type} category={category} />
          ))}

          <article className="group relative flex min-h-106 flex-col items-center justify-center gap-4 bg-product-800 px-8 pt-8 pb-24 text-center text-white shadow-brand">
            <span
              aria-hidden
              className="absolute top-4 right-4 h-20 w-24 bg-diagonal-lines text-white/40"
            />
            <h3 className="text-heading-31-bold">All Space</h3>
            <p className="max-w-67 text-body-16-medium">
              Comfortable space, Full speed wifi, Free coffe &amp; Snack
              <br />
              and many more
            </p>
            <Link
              href="/spaces"
              className="absolute bottom-0 left-0 flex h-16 w-68 items-center gap-4 bg-tango-600 px-7 text-heading-20-bold text-white transition-colors outline-none after:absolute after:inset-0 hover:bg-tango-700 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Check availability
              <ChevronRightIcon aria-hidden className="size-6" />
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
