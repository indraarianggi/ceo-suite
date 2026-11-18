import { cacheLife } from "next/cache";

import { faqs } from "@/data/faqs";
import { featuredPost, newsPosts } from "@/data/news";
import { corporatePartners, trustedLogos } from "@/data/partners";

export async function getCorporatePartners() {
  "use cache";
  cacheLife("hours");
  return corporatePartners;
}

export async function getTrustedLogos() {
  "use cache";
  cacheLife("days");
  return trustedLogos;
}

export async function getFaqs() {
  "use cache";
  cacheLife("days");
  return faqs;
}

export async function getNews() {
  "use cache";
  cacheLife("hours");
  return { posts: newsPosts, featured: featuredPost };
}
