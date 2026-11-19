import Image from "next/image";

import { type CategoryIntro, trustedBy } from "@/data/spaces-listing";

type CategoryIntroProps = { intro: CategoryIntro };

export function CategoryIntroSection({ intro }: CategoryIntroProps) {
  return (
    <section
      aria-labelledby="category-intro-title"
      className="bg-white py-12 md:py-16 xl:py-23"
    >
      <div className="page-container flex flex-col gap-12 xl:flex-row xl:items-center xl:justify-between xl:gap-21">
        <div className="flex flex-col gap-10 xl:w-140 xl:shrink-0 xl:gap-15">
          <div className="flex flex-col gap-6">
            <h2
              id="category-intro-title"
              className="text-heading-31-bold text-grey-900 md:text-heading-39-bold"
            >
              {intro.heading}
            </h2>
            <p className="text-body-16-regular text-grey-600 xl:text-lg/6.25">
              {intro.body}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <p className="text-body-16-bold text-grey-500">{trustedBy.label}</p>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-4">
              {trustedBy.logos.map((logo) => (
                <li key={logo.alt}>
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width}
                    height={40}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="grid gap-5 md:grid-cols-2 xl:w-196.25 xl:shrink-0">
          {intro.features.map((feature) => (
            <li
              key={feature.title}
              className="flex min-h-48 flex-col gap-8 rounded-3xl px-6 py-7 xl:h-64"
            >
              <span className="grid size-15 shrink-0 place-items-center rounded-full bg-product-200 ring-12 ring-badge-promo">
                <Image
                  src={feature.icon}
                  alt=""
                  width={28}
                  height={28}
                  className="size-7"
                />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="text-heading-25-bold text-product-700">
                  {feature.title}
                </h3>
                <p className="text-body-16-regular leading-relaxed text-grey-600">
                  {feature.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
