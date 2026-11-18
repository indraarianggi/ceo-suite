"use client";

import { format } from "date-fns";
import { createContext, useContext, useMemo, useState } from "react";

import {
  getBookingDuration,
  type DateSpan,
  type TimeRange,
} from "@/lib/booking";
import { calculateBookingTotal } from "@/lib/pricing";
import type { SpacePrices } from "@/types/space";

type BookingState = {
  span: DateSpan | undefined;
  time: TimeRange | undefined;
  /** More than one day: hours no longer apply, so the time picker is hidden. */
  isMultiDay: boolean;
  /** Null until the selection is complete. */
  total: number | null;
  /** Null until the selection is complete. */
  bookHref: string | null;
  setSpan: (span: DateSpan | undefined) => void;
  setTime: (time: TimeRange | undefined) => void;
};

const BookingContext = createContext<BookingState | null>(null);

export function useBooking(): BookingState {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used inside <BookingProvider>");
  }
  return context;
}

type BookingProviderProps = {
  slug: string;
  prices: SpacePrices;
  children: React.ReactNode;
};

export function BookingProvider({
  slug,
  prices,
  children,
}: BookingProviderProps) {
  const [span, setSpanState] = useState<DateSpan>();
  const [time, setTime] = useState<TimeRange>();

  const value = useMemo<BookingState>(() => {
    const isMultiDay = span !== undefined && span.to > span.from;
    const effectiveTime = isMultiDay ? undefined : time;
    const duration = getBookingDuration(span, effectiveTime);
    const total = duration ? calculateBookingTotal(prices, duration) : null;

    const params = new URLSearchParams({ space: slug });
    if (span) {
      params.set("from", format(span.from, "yyyy-MM-dd"));
      params.set("to", format(span.to, "yyyy-MM-dd"));
    }
    if (effectiveTime) {
      params.set("start", effectiveTime.start);
      params.set("end", effectiveTime.end);
    }

    return {
      span,
      time: effectiveTime,
      isMultiDay,
      total,
      bookHref: total === null ? null : `/booking?${params}`,
      setSpan: (next) => {
        setSpanState(next);
        if (next && next.to > next.from) setTime(undefined);
      },
      setTime,
    };
  }, [span, time, prices, slug]);

  return <BookingContext value={value}>{children}</BookingContext>;
}
