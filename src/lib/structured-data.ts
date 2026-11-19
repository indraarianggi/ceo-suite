import { business } from "@/data/business";
import { siteConfig } from "@/lib/site-config";
import type { Space, SpaceDetail } from "@/types/space";

const abs = (path: string) => new URL(path, siteConfig.url).toString();

/** Organization + LocalBusiness for the landing page. Optional facts are omitted when unknown. */
export function landingJsonLd() {
  const base = {
    name: business.legalName,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: abs(business.logo),
    image: abs(business.logo),
    slogan: business.slogan,
    ...(business.sameAs.length > 0 && { sameAs: [...business.sameAs] }),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        ...base,
      },
      {
        "@type": "LocalBusiness",
        "@id": `${siteConfig.url}/#localbusiness`,
        ...base,
        parentOrganization: { "@id": `${siteConfig.url}/#organization` },
        ...(business.address && {
          address: { "@type": "PostalAddress", ...business.address },
        }),
        ...(business.rating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: business.rating.ratingValue,
            reviewCount: business.rating.reviewCount,
          },
        }),
      },
    ],
  };
}

/** Product + Offer + BreadcrumbList for a space detail page. */
export function spaceJsonLd(space: SpaceDetail) {
  const url = abs(`/spaces/${space.slug}`);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: space.name,
        description: space.description,
        image: space.gallery.map((image) => abs(image.src)),
        category: space.categoryLabel,
        brand: { "@type": "Brand", name: business.legalName },
        offers: {
          "@type": "Offer",
          url,
          price: space.prices.daily,
          priceCurrency: "IDR",
          availability: "https://schema.org/InStock",
        },
        // aggregateRating is omitted on purpose: the design shows a score but no review count.
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
          {
            "@type": "ListItem",
            position: 2,
            name: space.categoryLabel,
            item: abs(`/spaces?type=${space.type}`),
          },
          { "@type": "ListItem", position: 3, name: space.name, item: url },
        ],
      },
    ],
  };
}

/** ItemList for an indexable listing view (the plain listing or one space type). */
export function listingJsonLd(spaces: Space[], name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: abs(path),
    numberOfItems: spaces.length,
    itemListElement: spaces.map((space, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: space.name,
      url: abs(`/spaces/${space.slug}`),
    })),
  };
}

/** Serialises JSON-LD for a <script> tag, escaping "<" so content cannot close the tag. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
