import { SlidersHorizontalIcon } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/shared/section-heading";
import { SpaceCard } from "@/components/shared/space-card";
import { buttonVariants } from "@/components/ui/button";
import { getRecommendedSpaces } from "@/lib/spaces";
import { cn } from "@/lib/utils";

export async function RecommendedSection() {
  const spaces = await getRecommendedSpaces();

  return (
    <section
      id="recommended"
      aria-labelledby="recommended-title"
      className="scroll-mt-28 py-12 xl:py-16"
    >
      <div className="page-container flex flex-col gap-8">
        <SectionHeading
          id="recommended-title"
          title="Recommended For You"
          description="Explore top-rated meeting rooms and workspaces."
          gap="sm"
          action={
            <Link
              href="/spaces"
              className={cn(
                buttonVariants({ variant: "outline", size: "md" }),
                "h-12 shrink-0 rounded-4xl bg-white px-6 text-grey-800",
              )}
            >
              <SlidersHorizontalIcon aria-hidden className="size-6" />
              <span className="sr-only md:not-sr-only">Filter</span>
            </Link>
          }
        />
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-y-8">
          {spaces.map((space) => (
            <li key={space.id} className="contents">
              <SpaceCard space={space} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
