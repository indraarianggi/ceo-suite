import type { MetadataRoute } from "next";

import { SPACE_TYPES } from "@/lib/space-search";
import { getSpaceSlugs } from "@/lib/spaces";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getSpaceSlugs();

  return [
    {
      url: siteConfig.url,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/spaces`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...SPACE_TYPES.map((type) => ({
      url: `${siteConfig.url}/spaces?type=${type}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...slugs.map((slug) => ({
      url: `${siteConfig.url}/spaces/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
