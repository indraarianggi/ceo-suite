import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { getNews } from "@/lib/content";
import { cn } from "@/lib/utils";

export async function NewsSection() {
  const { posts, featured } = await getNews();

  return (
    <section
      id="news"
      aria-labelledby="news-title"
      className="scroll-mt-18 py-12 xl:scroll-mt-28 xl:pt-14 xl:pb-19"
    >
      <div className="page-container grid gap-10 xl:grid-cols-[782fr_760fr] xl:gap-x-14">
        <div className="flex flex-col gap-8 xl:order-first xl:row-span-2 xl:gap-10">
          <h2
            id="news-title"
            className="text-heading-25-bold text-grey-800 md:text-heading-31-bold"
          >
            News, events and insights for you
          </h2>
          <div className="flex flex-col gap-8">
            <ul className="flex flex-col divide-y divide-grey-100">
              {posts.map((post) => (
                <li key={post.id} className="py-8 first:pt-0 last:pb-0">
                  <article className="relative flex items-center gap-4 md:gap-7">
                    <div className="relative h-28 w-36 shrink-0 overflow-hidden rounded-lg md:h-50 md:w-78">
                      <Image
                        src={post.image.src}
                        alt={post.image.alt}
                        fill
                        sizes="(min-width: 768px) 312px, 144px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex max-w-92 flex-col gap-1 md:gap-1.5">
                      <p className="text-body-10-regular text-grey-950/60 md:text-body-13-regular">
                        {post.byline}
                      </p>
                      <h3 className="text-body-16-bold text-grey-950 md:text-heading-25-medium">
                        <Link
                          href={post.href}
                          className="rounded-sm outline-none after:absolute after:inset-0 focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <p className="mt-2 hidden max-w-80 text-body-16-regular text-grey-500 md:block">
                        {post.excerpt}
                      </p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
            <Link
              href="/news"
              className={cn(
                buttonVariants({ variant: "accent", size: "cta" }),
                "self-start",
              )}
            >
              See All Updates
              <ChevronRightIcon aria-hidden className="size-5" />
            </Link>
          </div>
        </div>

        <article className="relative min-h-120 overflow-hidden rounded-lg bg-grey-950 xl:h-203">
          <Image
            src={featured.image.src}
            alt={featured.image.alt}
            fill
            sizes="(min-width: 1280px) 760px, 100vw"
            className="object-cover"
          />
          <span aria-hidden className="absolute inset-0 bg-black/60" />
          <p className="absolute top-6 left-6 flex h-12 w-36 items-center justify-center rounded-sm border border-grey-50 text-heading-25-bold text-grey-50 xl:top-10 xl:left-12">
            {featured.tag}
          </p>
          <div className="absolute inset-x-6 bottom-8 flex flex-col gap-3 text-white xl:inset-x-12 xl:bottom-11">
            <p className="text-body-16-regular md:text-heading-25-regular">
              {featured.byline}
            </p>
            <h3 className="text-heading-31-bold md:text-heading-39-bold xl:text-heading-49-bold">
              <Link
                href={featured.href}
                className="rounded-sm outline-none after:absolute after:inset-0 focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
              >
                {featured.title}
              </Link>
            </h3>
          </div>
        </article>
      </div>
    </section>
  );
}
