import {
  ChevronRight,
  Clapperboard,
  DoorOpen,
  GraduationCap,
  Laptop,
  Presentation,
  Projector,
  Users,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CarouselControls } from "@/components/sections/spaces/carousel-controls";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  type OtherSpaceKind,
  otherSpaces,
  otherSpacesCopy,
} from "@/data/spaces-listing";

const kindStyles: Record<OtherSpaceKind, { Icon: LucideIcon; text: string }> = {
  coworking: { Icon: Laptop, text: "text-space-coworking" },
  meeting: { Icon: DoorOpen, text: "text-space-meeting" },
  board: { Icon: Projector, text: "text-space-board" },
  class: { Icon: GraduationCap, text: "text-space-class" },
  seminar: { Icon: Presentation, text: "text-space-seminar" },
  theatre: { Icon: Clapperboard, text: "text-space-theatre" },
  combined: { Icon: Users, text: "text-space-combined" },
};

const LIST_ID = "other-spaces-list";

export function OtherSpacesSection() {
  return (
    <section
      aria-labelledby="other-spaces-title"
      className="overflow-hidden bg-white py-12 md:py-16 xl:py-21"
    >
      <div className="page-container">
        <SectionHeading
          id="other-spaces-title"
          title={otherSpacesCopy.title}
          description={otherSpacesCopy.subtitle}
          gap="sm"
          action={
            <div className="max-md:hidden">
              <CarouselControls targetId={LIST_ID} />
            </div>
          }
        />
      </div>

      <ul
        id={LIST_ID}
        className="mt-8 flex snap-x snap-mandatory page-gutter-start gap-6 overflow-x-auto pb-4 xl:mt-12 xl:gap-10"
      >
        {otherSpaces.map((item) => {
          const { Icon, text } = kindStyles[item.kind];
          return (
            <li
              key={item.kind}
              className="w-64 shrink-0 snap-start last:pe-4 sm:w-72 md:last:pe-8 xl:w-92.5 xl:last:pe-12"
            >
              <Link
                href={`/spaces?type=${item.type}`}
                className="group flex flex-col gap-6 rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span className="relative block aspect-370/363 overflow-hidden">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 1280px) 370px, (min-width: 425px) 288px, 256px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
                  />
                  <span className="absolute bottom-0 left-0 grid h-17.75 w-19 place-items-center bg-product-700 text-white">
                    <ChevronRight aria-hidden className="size-8" />
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  <Icon aria-hidden className={`size-6 shrink-0 ${text}`} />
                  <span className="text-heading-20-bold text-grey-900">
                    {item.label}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
