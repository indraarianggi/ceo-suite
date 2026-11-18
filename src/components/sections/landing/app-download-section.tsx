import Image from "next/image";
import Link from "next/link";

import { appDownload } from "@/data/app";

export function AppDownloadSection() {
  return (
    <section
      id="app"
      aria-labelledby="app-title"
      className="relative scroll-mt-28 overflow-hidden bg-linear-to-b from-product-50 to-product-100"
    >
      <Image
        src="/images/app/bg-wave-left.svg"
        alt=""
        aria-hidden
        width={565}
        height={413}
        className="pointer-events-none absolute bottom-0 left-0 max-w-none"
      />
      <Image
        src="/images/app/bg-wave-right.svg"
        alt=""
        aria-hidden
        width={418}
        height={489}
        className="pointer-events-none absolute top-0 right-0 hidden max-w-none xl:block"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-20 -bottom-20 size-96 rounded-full bg-product-400 blur-glow xl:right-31 xl:-bottom-87 xl:size-164.5"
      />

      <div className="relative page-container pt-12 xl:flex xl:items-center xl:justify-between xl:py-40">
        <div className="flex max-w-214.5 flex-col gap-10 xl:min-w-0 xl:flex-1 xl:gap-16">
          <div className="flex flex-col gap-4">
            <h2
              id="app-title"
              className="text-heading-31-bold text-product-700 md:text-heading-39-bold"
            >
              {appDownload.title}
            </h2>
            <p className="text-body-16-medium text-grey-400 md:text-heading-25-medium">
              {appDownload.description}
            </p>
          </div>
          <ul className="flex flex-wrap items-center gap-3.5">
            {appDownload.stores.map((store) => (
              <li key={store.name}>
                <Link
                  href={store.href}
                  className="block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <Image
                    src={store.badge}
                    alt={`Download on ${store.name}`}
                    width={store.width}
                    height={66}
                    className="h-12 w-auto sm:h-16.5"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Phone mockups */}
        <div
          aria-hidden
          className="relative mx-auto mt-10 aspect-698/400 w-full max-w-174.5 xl:mx-0 xl:mt-0 xl:aspect-auto xl:w-174.5 xl:shrink-0 xl:self-stretch"
        >
          <Image
            src="/images/app/phone-home.webp"
            alt=""
            width={316}
            height={642}
            className="absolute top-1/4 left-0 h-auto w-9/20 max-w-none drop-shadow-device xl:top-0 xl:w-79"
          />
          <Image
            src="/images/app/phone-detail.webp"
            alt=""
            width={329}
            height={661}
            className="absolute top-0 right-0 h-auto w-47/100 max-w-none drop-shadow-device xl:-top-67.5 xl:right-2.5 xl:w-82"
          />
        </div>
      </div>
    </section>
  );
}
