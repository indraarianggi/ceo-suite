import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import {
  HeaderAccount,
  HeaderAccountFallback,
} from "@/components/layout/header-account";
import {
  MobileAccount,
  MobileAccountFallback,
} from "@/components/layout/mobile-account";
import { MobileNav } from "@/components/layout/mobile-nav";
import { bookingNav } from "@/data/navigation";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function BookingHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="page-container flex h-18 items-center justify-between xl:h-28">
        <Link
          href="/"
          aria-label={`${siteConfig.name} home`}
          className="rounded-sm"
        >
          <Image
            src="/images/brand/logo-ceo-suite.webp"
            alt={siteConfig.name}
            width={200}
            height={48}
            priority
            className="h-9 w-37 xl:h-12 xl:w-50"
          />
        </Link>

        <div className="hidden items-center gap-8 xl:flex 2xl:gap-14">
          <nav aria-label="Main">
            <ul className="flex items-center gap-8 2xl:gap-14">
              {bookingNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "rounded-sm text-body-16-medium text-grey-600 transition-colors hover:text-primary",
                      item.href === "/" && "text-body-16-bold text-primary",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Suspense fallback={<HeaderAccountFallback />}>
            <HeaderAccount />
          </Suspense>
        </div>

        <MobileNav>
          <Suspense fallback={<MobileAccountFallback />}>
            <MobileAccount />
          </Suspense>
        </MobileNav>
      </div>
    </header>
  );
}
