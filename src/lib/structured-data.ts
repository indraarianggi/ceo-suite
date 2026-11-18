import { business } from "@/data/business";
import { siteConfig } from "@/lib/site-config";

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

/** Serialises JSON-LD for a <script> tag, escaping "<" so content cannot close the tag. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
