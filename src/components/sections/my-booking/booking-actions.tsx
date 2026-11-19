"use client";

import { Printer, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BookingActions({ reference }: { reference: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function share() {
    const url = window.location.href;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: `Booking ${reference}`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Dismissing the share sheet is not an error; a denied clipboard has no fallback.
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row print:hidden">
      <button
        type="button"
        onClick={share}
        className={cn(
          buttonVariants({ size: "md" }),
          "h-10.75 w-full rounded-lg md:w-62.5",
        )}
      >
        <Share2 aria-hidden />
        {copied ? "Link copied" : "Share Booking Details"}
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className={cn(
          buttonVariants({ variant: "outline", size: "md" }),
          "h-10.75 w-full rounded-lg md:w-62.5",
          "border-primary text-primary hover:bg-accent",
        )}
      >
        <Printer aria-hidden />
        Print Booking
      </button>
      <span role="status" className="sr-only">
        {copied ? "Booking link copied to the clipboard" : ""}
      </span>
    </div>
  );
}
