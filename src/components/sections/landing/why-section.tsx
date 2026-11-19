import Image from "next/image";

import { stats, whyCopy } from "@/data/why";

export function WhySection() {
  return (
    <section
      id="why-ceo-suite"
      aria-labelledby="why-title"
      className="scroll-mt-18 py-12 xl:scroll-mt-28 xl:py-20"
    >
      <div className="page-container grid items-center gap-12 xl:grid-cols-9 xl:gap-x-20">
        <ul className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 xl:col-span-4 xl:gap-y-26">
          {stats.map((stat) => (
            <li key={stat.label} className="flex items-start gap-6">
              <Image
                src={stat.icon}
                alt=""
                width={48}
                height={48}
                className="size-12 shrink-0"
              />
              <div className="flex flex-col gap-2.5">
                <p className="text-heading-31-bold text-navy-900 md:text-heading-39-bold">
                  {stat.value}
                </p>
                <p className="text-body-16-regular text-grey-400 md:text-heading-20-regular">
                  {stat.label}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="bg-primary px-6 py-10 text-white md:px-12 xl:col-span-5 xl:px-21 xl:py-16">
          <div className="flex flex-col gap-8 xl:gap-14">
            <div className="flex flex-col gap-5">
              <p className="flex items-center gap-5 text-heading-20-regular xl:text-heading-25-regular">
                {whyCopy.eyebrow}
                <span aria-hidden className="h-0.75 w-24 bg-white" />
              </p>
              <h2
                id="why-title"
                className="text-heading-31-bold md:text-heading-39-bold xl:text-heading-49-bold"
              >
                {whyCopy.title}
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-body-16-regular md:text-heading-20-regular">
              {whyCopy.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
