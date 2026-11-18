import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AddOnsSection } from "@/components/sections/product/add-ons-section";
import { BookingBar } from "@/components/sections/product/booking-bar";
import { BookingCard } from "@/components/sections/product/booking-card";
import { BookingProvider } from "@/components/sections/product/booking-provider";
import { DetailsSection } from "@/components/sections/product/details-section";
import { GallerySection } from "@/components/sections/product/gallery-section";
import { LocationSection } from "@/components/sections/product/location-section";
import { PriceSection } from "@/components/sections/product/price-section";
import { SimilarSpacesSection } from "@/components/sections/product/similar-spaces-section";
import { SpaceSummary } from "@/components/sections/product/space-summary";
import { formatCity } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import { getSimilarSpaces, getSpaceBySlug, getSpaceSlugs } from "@/lib/spaces";
import { jsonLdString, spaceJsonLd } from "@/lib/structured-data";

export async function generateStaticParams() {
  const slugs = await getSpaceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/spaces/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const space = await getSpaceBySlug(slug);
  if (!space) return {};

  // The root layout's title template appends "| CEO SUITE".
  const title = `${space.name} – ${space.categoryLabel} in ${formatCity(space.location.name)}`;
  const description = `${space.description} Book by the hour or day at ${siteConfig.name}.`;
  const path = `/spaces/${space.slug}`;
  const image = space.gallery[0];

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: siteConfig.name,
      title,
      description,
      images: [{ url: image.src, alt: image.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.src],
    },
  };
}

type SpacePageProps = PageProps<"/spaces/[slug]">;

/** Shown while a client navigation waits for this space's content. */
function SpacePageFallback() {
  return (
    <main className="flex-1 bg-grey-25" aria-busy="true">
      <div className="h-40 bg-product-800" />
      <div className="page-container py-8 xl:py-12">
        <div className="aspect-video animate-pulse rounded-xl bg-grey-100 motion-reduce:animate-none xl:aspect-auto xl:h-124.5" />
      </div>
    </main>
  );
}

// The page stays synchronous: reading `params` (URL data) happens inside the
// Suspense boundary, so navigating here renders the shell instantly while the
// content streams. Known slugs are still prerendered via generateStaticParams.
export default function SpacePage(props: SpacePageProps) {
  return (
    <Suspense fallback={<SpacePageFallback />}>
      <SpaceContent params={props.params} />
    </Suspense>
  );
}

async function SpaceContent({ params }: { params: SpacePageProps["params"] }) {
  const { slug } = await params;
  const space = await getSpaceBySlug(slug);
  if (!space) notFound();

  const similarSpaces = await getSimilarSpaces(space.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(spaceJsonLd(space)) }}
      />
      <BookingProvider slug={space.slug} prices={space.prices}>
        <main className="flex-1 bg-grey-25">
          <BookingBar />
          <GallerySection images={space.gallery} name={space.name} />

          <div className="bg-white py-12 xl:py-18">
            <div className="page-container flex flex-col gap-2.5">
              <div className="flex flex-col gap-8 xl:flex-row xl:gap-16">
                <div className="flex min-w-0 flex-col gap-6 xl:flex-1">
                  <SpaceSummary space={space} />
                  <PriceSection
                    prices={space.prices}
                    bestDeal={space.bestDeal}
                  />
                  <DetailsSection description={space.description} />
                  <AddOnsSection addOns={space.addOns} />
                </div>
                <div className="xl:w-131.25 xl:shrink-0">
                  <BookingCard />
                </div>
              </div>

              <hr className="-mb-px h-px border-0 bg-grey-100" />
              <LocationSection location={space.location} />
            </div>
          </div>

          <SimilarSpacesSection spaces={similarSpaces} />
        </main>
      </BookingProvider>
    </>
  );
}
