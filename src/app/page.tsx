import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AppDownloadSection } from "@/components/sections/landing/app-download-section";
import { BestDealsSection } from "@/components/sections/landing/best-deals-section";
import { BrowseSpacesSection } from "@/components/sections/landing/browse-spaces-section";
import { FaqSection } from "@/components/sections/landing/faq-section";
import { HeroSection } from "@/components/sections/landing/hero-section";
import { MeetingRoomPackageSection } from "@/components/sections/landing/meeting-room-package-section";
import { NewsSection } from "@/components/sections/landing/news-section";
import { PartnersSection } from "@/components/sections/landing/partners-section";
import { PromotionsSection } from "@/components/sections/landing/promotions-section";
import { RecommendedSection } from "@/components/sections/landing/recommended-section";
import { TrustedSection } from "@/components/sections/landing/trusted-section";
import { WhySection } from "@/components/sections/landing/why-section";
import { jsonLdString, landingJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";

const title =
  "CEO SUITE | Book Private Offices, Coworking Spaces & Meeting Rooms";
const description =
  "Discover your perfect workspace at CEO SUITE. Search and book private offices, coworking spaces and meeting rooms by the hour or day in premium locations.";
const ogImage = {
  url: "/images/hero/hero-lounge.webp",
  width: 1072,
  height: 598,
  alt: "Bright CEO SUITE workspace lounge with a sofa and kitchenette",
};

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    title,
    description,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage.url],
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(landingJsonLd()) }}
      />
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <BrowseSpacesSection />
        <RecommendedSection />
        <WhySection />
        <PromotionsSection />
        <BestDealsSection />
        <MeetingRoomPackageSection />
        <PartnersSection />
        <TrustedSection />
        <NewsSection />
        <FaqSection />
        <AppDownloadSection />
      </main>
      <SiteFooter />
    </>
  );
}
