import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DecorBlob } from "@/components/shared/decor-blob";
import { buttonVariants } from "@/components/ui/button";
import { meetingRoomPackage } from "@/data/packages";
import { cn } from "@/lib/utils";

export function MeetingRoomPackageSection() {
  const { title, paragraphs, cta, images } = meetingRoomPackage;
  const [topLeft, bottomLeft, topRight, bottomRight] = images;

  return (
    <section
      id="meeting-room-package"
      aria-labelledby="meeting-room-package-title"
      className="relative scroll-mt-28 overflow-hidden py-12 xl:py-20"
    >
      <DecorBlob className="top-52 left-104 size-50 max-xl:hidden" />
      <DecorBlob className="top-57 -right-8 size-42 max-xl:hidden" />

      <div className="relative page-container flex flex-col items-center gap-12 xl:flex-row xl:justify-center xl:gap-32">
        <div
          aria-hidden={false}
          className="grid w-full max-w-109 shrink-0 grid-cols-2 gap-6"
        >
          <div className="flex flex-col gap-6">
            <CollageTile image={topLeft} />
            <CollageTile image={bottomLeft} />
          </div>
          <div className="mt-6 flex flex-col gap-6">
            <CollageTile image={topRight} />
            <CollageTile image={bottomRight} />
          </div>
        </div>

        <div className="flex max-w-197 flex-col gap-8 xl:gap-12">
          <div className="flex flex-col gap-6">
            <h2
              id="meeting-room-package-title"
              className="text-heading-31-bold text-grey-800 md:text-heading-39-bold"
            >
              {title}
            </h2>
            <div className="flex flex-col gap-6 text-body-16-regular text-grey-400 md:text-heading-20-regular">
              {paragraphs.map((segments, i) => (
                <p key={i}>
                  {segments.map((segment, j) =>
                    "highlight" in segment ? (
                      <span key={j} className="text-product-600">
                        {segment.text}
                      </span>
                    ) : (
                      <span key={j}>{segment.text}</span>
                    ),
                  )}
                </p>
              ))}
            </div>
          </div>
          <Link
            href={cta.href}
            className={cn(
              buttonVariants({ size: "md" }),
              "min-w-64 self-start",
            )}
          >
            {cta.label}
            <ChevronRightIcon aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

type CollageTileProps = {
  image: (typeof meetingRoomPackage.images)[number];
};

function CollageTile({ image }: CollageTileProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-product-50 shadow-brand",
        image.tall ? "h-62" : "h-50",
      )}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 1280px) 206px, 50vw"
        className="object-cover"
      />
    </div>
  );
}
