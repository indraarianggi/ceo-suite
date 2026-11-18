import Image from "next/image";

import { getTrustedLogos } from "@/lib/content";

export async function TrustedSection() {
  const logos = await getTrustedLogos();

  return (
    <section
      aria-labelledby="trusted-title"
      className="bg-background-25 py-12 xl:pt-17.5 xl:pb-27"
    >
      <div className="page-container flex flex-col items-center gap-10 xl:gap-10">
        <h2
          id="trusted-title"
          className="pb-3 text-center text-heading-25-regular text-grey-800 md:text-heading-39-regular"
        >
          <span className="relative inline-block font-bold">
            Trusted
            <svg
              aria-hidden
              viewBox="0 0 152 10"
              fill="none"
              className="absolute -bottom-2.5 left-0 w-full text-product-400"
            >
              <path
                d="M4 5 Q 76 -1 148 5"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          by <span className="font-bold text-product-600">80,000+</span>{" "}
          customers
        </h2>

        <div className="group w-full overflow-hidden mask-fade-x">
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            <LogoList logos={logos} />
            <LogoList logos={logos} hidden />
          </div>
        </div>
      </div>
    </section>
  );
}

type LogoListProps = {
  logos: Awaited<ReturnType<typeof getTrustedLogos>>;
  hidden?: boolean;
};

function LogoList({ logos, hidden = false }: LogoListProps) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-16 pr-16"
    >
      {logos.map((logo) => (
        <li
          key={logo.name}
          className="flex h-42.5 w-32 items-center justify-center"
        >
          <Image
            src={logo.src}
            alt={hidden ? "" : logo.name}
            width={logo.width}
            height={logo.height}
            className="h-auto max-h-full w-32"
          />
        </li>
      ))}
    </ul>
  );
}
