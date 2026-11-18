"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { useBooking } from "@/components/sections/product/booking-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";

// Below xl the card is a fixed bar. Hide it while the footer is on screen so it
// never covers the footer's last line.
let footerVisible = false;

function subscribeToFooter(onChange: () => void) {
  const footer = document.querySelector("footer");
  if (!footer) return () => {};
  const observer = new IntersectionObserver(([entry]) => {
    footerVisible = entry.isIntersecting;
    onChange();
  });
  observer.observe(footer);
  return () => observer.disconnect();
}
const readFooterVisible = () => footerVisible;
const readFalse = () => false;

/**
 * Desktop: card in the right column. Below xl: fixed bottom bar showing the
 * total beside the Book button, so the call to action stays reachable.
 */
export function BookingCard() {
  const { total, bookHref } = useBooking();
  const ready = total !== null && bookHref !== null;
  const hideBar = useSyncExternalStore(
    subscribeToFooter,
    readFooterVisible,
    readFalse,
  );

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-grey-100 bg-white px-4 py-3 shadow-panel transition-transform duration-200 motion-reduce:transition-none",
        hideBar && "translate-y-full",
        "xl:static xl:z-auto xl:translate-y-0 xl:rounded-2xl xl:border-0 xl:bg-linear-to-b xl:from-white xl:to-grey-25 xl:px-8 xl:py-12",
      )}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between gap-4 xl:max-w-none xl:flex-col xl:items-stretch xl:gap-6">
        <div
          className="flex min-w-0 flex-col gap-1 xl:gap-3"
          aria-live="polite"
        >
          {ready ? (
            <>
              <p className="text-body-16-regular text-grey-400">Total</p>
              <p className="text-heading-20-bold text-product-800 xl:text-heading-25-bold">
                {formatRupiah(total)}
              </p>
            </>
          ) : (
            <p className="text-body-16-medium text-grey-600">
              Select date to Book
            </p>
          )}
        </div>

        {ready ? (
          <Link
            href={bookHref}
            prefetch={false}
            className={cn(
              buttonVariants({ size: "md" }),
              "h-10.75 px-8 xl:w-full xl:px-4",
            )}
          >
            Book
          </Link>
        ) : (
          <Button
            type="button"
            size="md"
            disabled
            className="h-10.75 px-8 disabled:bg-grey-100 disabled:text-grey-200 disabled:opacity-100 xl:w-full xl:px-4"
          >
            Book
          </Button>
        )}
      </div>
    </div>
  );
}
