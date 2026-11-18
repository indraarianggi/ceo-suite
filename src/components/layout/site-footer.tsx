import Image from "next/image";
import Link from "next/link";

import { NewsletterForm } from "@/components/layout/newsletter-form";
import { footerNav } from "@/data/navigation";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="bg-grey-50 py-12 xl:pt-16 xl:pb-12">
      <div className="page-container">
        <div className="flex flex-col gap-12 xl:px-8">
          <div className="flex flex-col gap-8">
            <Link
              href="/"
              aria-label={`${siteConfig.name} home`}
              className="w-fit rounded-sm"
            >
              <Image
                src="/images/brand/logo-ceo-suite.webp"
                alt={siteConfig.name}
                width={132}
                height={32}
                className="h-8 w-33"
              />
            </Link>
            <nav aria-label="Footer">
              <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
                {footerNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-sm text-body-16-bold text-slate-500 transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex flex-col gap-8 border-t border-slate-200 pt-8 md:flex-row md:items-center md:justify-between">
            <NewsletterForm />
            <p className="text-body-16-regular text-slate-400">
              © 1997-2024 CEO Suite. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
