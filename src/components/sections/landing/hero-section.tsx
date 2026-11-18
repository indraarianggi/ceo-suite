import { HeroSearchCard } from "@/components/sections/landing/hero-search-card";
import { HeroSlider } from "@/components/sections/landing/hero-slider";
import { heroCopy, heroSlides } from "@/data/hero";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="pt-8 pb-10 xl:pt-14 xl:pb-19"
    >
      <div className="page-container">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between xl:gap-24">
          <h1
            id="hero-title"
            className="text-heading-31-bold text-grey-900 md:text-heading-39-bold xl:max-w-170 xl:text-heading-39-bold 2xl:text-heading-49-bold"
          >
            {heroCopy.title}
          </h1>
          <p className="text-body-16-medium text-grey-500 md:text-heading-20-medium xl:max-w-162">
            {heroCopy.subtitle}
          </p>
        </div>

        <div className="relative mt-8 flex flex-col gap-4 xl:mt-16 xl:block">
          <HeroSearchCard className="xl:absolute xl:top-11 xl:left-0 xl:z-10 xl:w-7/16" />
          <HeroSlider slides={heroSlides} className="xl:ml-auto xl:w-3/4" />
        </div>
      </div>
    </section>
  );
}
