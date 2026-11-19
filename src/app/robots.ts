import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    // Personal, transactional pages: not for search results.
    rules: { userAgent: "*", allow: "/", disallow: ["/booking"] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
