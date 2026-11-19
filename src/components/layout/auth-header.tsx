import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

export function AuthHeader() {
  return (
    <header className="relative isolate mx-auto h-39.75 w-full max-w-186 bg-background-50 pt-17">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-56.75 left-1/2 -z-10 size-85.75 -translate-x-1/2 rounded-full bg-product-200 blur-auth-glow"
      />
      <Link
        href="/"
        aria-label={`${siteConfig.name} home`}
        className="mx-auto block w-fit rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Image
          src="/images/brand/logo-ceo-suite.webp"
          alt={siteConfig.name}
          width={166}
          height={40}
          priority
          className="h-10 w-41.5"
        />
      </Link>
    </header>
  );
}
